import { PubSub } from '@google-cloud/pubsub';
import { genericRecursive, getRedisOnRecursive, getUTCDayjs, isAllowCaptureException, PostgresHelper, setRedisOnRecursive } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, EnumGenericRecursiveStatus, GenericRecursiveMessageType, IGenericRecursiveMessage } from '@reactor-room/model-lib';
import { assembleThaiPostDropOffTracking } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumCreditPaymentStatus,
  EnumPaymentType,
  EnumPurchasingPayloadType,
  ICalculatedShipping,
  ICalculatedShippingResultByType,
  IDropOffTrackingNumber,
  IPayOffResult,
  IThaipostDropOffSubscription,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import {
  createTemporaryCourierTracking,
  getDestinationAddressByOrderID,
  getPageAddress,
  getPaymentById,
  getPurchasingOrderLogisticInfo,
  getPurchasingOrderSelectedPayment,
  getPurchasingOrderTrackingInfo,
  getSubscriptionCurrentBudget,
  getTotalWeightOfEachProductInCart,
} from '../../../data';
import { calculateThaipostShippingPrice, checkDestinationMethod } from '../../../domains/thai-post/calculate-shipping-price.domain';
import { AdminLogisticsService } from '../../admin/logistic.service';
import { CreditPaymentHistoriesService } from '../../credit/credit.service';
import { PipelineService } from '../../pipeline';
import { PipelineOrderMessageService } from '../../pipeline/pipeline-order-message.service';
import { PlusmarService } from '../../plusmarservice.class';
import { PurchaseOrderTrackingInfoService } from '../../purchase-order/purchase-order-tracking-info.service';
import { PurchaseOrderService } from '../../purchase-order/purchase-order.service';
import { SubscriptionService } from '../../subscription/subscription.service';
import { ThaiPostService } from '../../thai-post/thai-post.service';
import * as Sentry from '@sentry/node';

export class LogisticsDropOffService {
  public thaiPostService: ThaiPostService;
  public purchaseOrderService: PurchaseOrderService;
  public pipelineOrderMessageService: PipelineOrderMessageService;
  public pipelineService: PipelineService;
  public adminLogisticsService: AdminLogisticsService;
  public purchaseOrderTrackingInfoService: PurchaseOrderTrackingInfoService;
  public subscriptionService: SubscriptionService;
  public creditPaymentHistoriesService: CreditPaymentHistoriesService;

  constructor() {
    this.subscriptionService = new SubscriptionService();
    this.thaiPostService = new ThaiPostService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.pipelineOrderMessageService = new PipelineOrderMessageService();
    this.pipelineService = new PipelineService();
    this.adminLogisticsService = new AdminLogisticsService();
    this.creditPaymentHistoriesService = new CreditPaymentHistoriesService();
    this.purchaseOrderTrackingInfoService = new PurchaseOrderTrackingInfoService();
  }
  publishCreditPayoffQueue = async (payload: IThaipostDropOffSubscription): Promise<void> => {
    const topicName = PlusmarService.environment.SUBSCRIPTION_THAIPOST_TOPIC;

    const data = JSON.stringify(payload);
    const dataBuffer = Buffer.from(data);
    const connection = new PubSub();

    const redisKey = `${GenericRecursiveMessageType.REQUEST}_${payload.orderID}`;
    const redisPayload = {
      unqiueKey: payload.orderID,
      messageStatus: EnumGenericRecursiveStatus.PENDING,
      messageType: GenericRecursiveMessageType.REQUEST,
      createAt: getUTCDayjs().toDate(),
    } as IGenericRecursiveMessage;
    setRedisOnRecursive(PlusmarService.redisClient, redisKey, redisPayload);
    await connection.topic(topicName).publishMessage({ data: dataBuffer, attributes: { type: GenericRecursiveMessageType.REQUEST } });
  };

  paySingleDropOffBalance = async (pageID: number, orderID: number, subscriptionID: string, platform: AudiencePlatformType): Promise<IPayOffResult> => {
    const track = await this.checkTracking(orderID, pageID, subscriptionID, platform);

    if (track.isSuccess) {
      return track;
    } else {
      await this.publishCreditPayoffQueue({ pageID, orderID, subscriptionID });
      const redisKey = `${GenericRecursiveMessageType.REQUEST}_${orderID}`;
      const maxRetry = PlusmarService.environment.cronJobConfig.dropOffCheckoutMaxRetry;
      const timerSec = PlusmarService.environment.cronJobConfig.dropOffCheckoutRepeatTimer;

      const result = await genericRecursive(PlusmarService.redisClient, redisKey, timerSec, maxRetry);
      if (result === EnumGenericRecursiveStatus.SUCCESS) {
        const checkResult = await this.checkTracking(orderID, pageID, subscriptionID, platform);
        if (checkResult.isSuccess) {
          return checkResult;
        } else {
          return {
            isSuccess: false,
          };
        }
      } else {
        const redisResult = await getRedisOnRecursive(PlusmarService.redisClient, redisKey);
        const failMessage = redisResult.messageDetail;
        return {
          isSuccess: false,
          message: failMessage,
        };
      }
    }
  };

  async checkTracking(orderID: number, pageID: number, subscriptionID: string, platform: AudiencePlatformType): Promise<IPayOffResult> {
    const result = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderID, pageID);

    if (result.active) {
      const budget = await this.subscriptionService.getSubscriptionCurrentBudget(subscriptionID);
      const shipping = await this.calculateShippingPrice(pageID, [orderID], subscriptionID);

      const pipeline = await this.pipelineService.checkPurchaseOrderPipelineByOrderID(pageID, orderID);
      const payment = await getPaymentById(PlusmarService.readerClient, pageID, pipeline.payment_id);

      switch (payment.type) {
        case EnumPaymentType.CASH_ON_DELIVERY:
          await this.pipelineOrderMessageService.sendOrderPayload(
            pipeline.page_id,
            pipeline.audience_id,
            EnumPurchasingPayloadType.SEND_TRACKING_NUMBER_COD,
            platform,
            subscriptionID,
          );
          break;
        default:
          await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.SEND_TRACKING_NUMBER, platform, subscriptionID);
          break;
      }

      return {
        isSuccess: true,
        orderID: orderID,
        aliasOrderId: result.aliasOrderId,
        trackingNo: result.tracking_no,
        remainingCredit: budget.currentBudget,
        totalPrice: shipping.totalPrice,
      };
    } else {
      return { isSuccess: false } as IPayOffResult;
    }
  }

  calculateShippingPrice = async (pageID: number, orderIDs: number[], subscriptionID: string): Promise<ICalculatedShipping> => {
    const sourceAddress = await getPageAddress(PlusmarService.readerClient, pageID);
    const chart = await this.thaiPostService.getThaipostShippingPrice();

    const srcProvince = sourceAddress.province;

    const result = {
      orders: [],
      totalPrice: 0,
      isAfford: false,
    };

    for (let orderIndex = 0; orderIndex < orderIDs.length; orderIndex++) {
      const orderID = orderIDs[orderIndex];

      let order = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderID, pageID);
      if (order === null) {
        const preparedData = await getPurchasingOrderLogisticInfo(PlusmarService.readerClient, orderID, pageID);
        if (preparedData !== null) {
          await createTemporaryCourierTracking(PlusmarService.writerClient, orderID);
          order = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderID, pageID);
        }
      }

      const destination = await getDestinationAddressByOrderID(PlusmarService.readerClient, pageID, orderID);
      const itemsWeight = await getTotalWeightOfEachProductInCart(PlusmarService.readerClient, pageID, orderID);

      const desProvince = destination[0].location.province;

      const useInsourcePrice = checkDestinationMethod(srcProvince, desProvince);
      const weight = itemsWeight.reduce((memo, { totalWeight }) => Number(memo) + Number(totalWeight), 0);
      const shippingPrice = calculateThaipostShippingPrice(useInsourcePrice, weight, chart);

      result.orders.push({
        orderID,
        aliasOrderId: order.aliasOrderId,
        weight,
        weightRange: shippingPrice.range,
        price: shippingPrice.price,
      } as ICalculatedShippingResultByType);
      result.totalPrice += shippingPrice.price;
    }

    const budget = await getSubscriptionCurrentBudget(PlusmarService.readerClient, subscriptionID);
    if (budget.currentBudget >= result.totalPrice) result.isAfford = true;
    return result;
    //
  };

  generateDropOffTrackingAndDeductCredit = async ({ pageID, orderID, subscriptionID }: IThaipostDropOffSubscription): Promise<boolean> => {
    let history = await this.creditPaymentHistoriesService.getCreditHistory(pageID, orderID, subscriptionID);
    if (history && history.status !== EnumCreditPaymentStatus.PENDING) {
      // START PG TRANSACTION
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await this.setDropOffTracking(client, orderID, pageID);
      await PostgresHelper.execBatchCommitTransaction(client);
      return true;
    } else {
      const budget = await this.subscriptionService.getSubscriptionCurrentBudget(subscriptionID);
      const shipping = await this.calculateShippingPrice(pageID, [orderID], subscriptionID);
      const remainCredit = budget.currentBudget;
      const dropOffCost = shipping.totalPrice;

      if (!history) {
        history = await this.creditPaymentHistoriesService.createCreditHistory(pageID, orderID, subscriptionID, remainCredit, dropOffCost);
      }
      // START PG TRANSACTION
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await this.creditPaymentHistoriesService.deductCreditDropOff(client, subscriptionID, dropOffCost);
      await this.creditPaymentHistoriesService.updateCreditPaymentHistory(client, pageID, orderID, subscriptionID, EnumCreditPaymentStatus.COMPLETED);
      await this.setDropOffTracking(client, orderID, pageID);
      await PostgresHelper.execBatchCommitTransaction(client);
      return true;
    }
  };

  setDropOffTracking = async (Client: Pool, orderID: number, pageID: number): Promise<void> => {
    const payment = await getPurchasingOrderSelectedPayment(PlusmarService.readerClient, { orderID, pageID });
    const isCOD = payment.type === EnumPaymentType.CASH_ON_DELIVERY;
    const redisKey = `${GenericRecursiveMessageType.REQUEST}_${orderID}`;

    const tempCourier = await this.purchaseOrderTrackingInfoService.getTemporaryCourierOrder(Client, orderID, pageID);

    const track = await this.getTrackingByType(Client, isCOD);
    if (track) {
      const { id, spent: currentIndex, from: start, to: end, prefix, suffix } = track;
      const trackingNo = assembleThaiPostDropOffTracking(currentIndex, start, end, prefix, suffix);
      await this.thaiPostService.createCourierOrderThaipostDropOff(Client, pageID, orderID, tempCourier.logistic_id, trackingNo, isCOD);
      if (isCOD) {
        await this.adminLogisticsService.setNextCODDropOffTrackingUsed(Client, id);
      } else {
        await this.adminLogisticsService.setNextDropOffTrackingUsed(Client, id);
      }
    } else {
      const redisResult = await getRedisOnRecursive(PlusmarService.redisClient, redisKey);
      setRedisOnRecursive(PlusmarService.redisClient, redisKey, {
        ...redisResult,
        messageDetail: 'THAIPOST_TRACKING_SET_EMPTY',
      });

      const err = new Error('THAIPOST_TRACKING_SET_EMPTY');
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  };

  async getTrackingByType(Client: Pool, isCOD: boolean): Promise<IDropOffTrackingNumber> {
    if (isCOD) {
      return await this.adminLogisticsService.getThaiPostCODDropOffTrackingNumber(Client);
    } else {
      return await this.adminLogisticsService.getThaiPostDropOffTrackingNumber(Client);
    }
  }
}
