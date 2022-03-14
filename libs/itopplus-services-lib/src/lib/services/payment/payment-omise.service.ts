import {
  deleteSessionValue,
  getKeysFromSession,
  getRedisOnRecursive,
  isAllowCaptureException,
  PostgresHelper,
  setRedisOnRecursive,
  setSessionValue,
} from '@reactor-room/itopplus-back-end-helpers';
import { EnumGenericRecursiveStatus } from '@reactor-room/model-lib';
import {
  EnumHandleResponseMessageType,
  EnumOmiseChargeStatus,
  EnumOmiseChargeWatchType,
  EnumOmiseSourceType,
  EnumPaymentType,
  EnumPurchaseOrderSubStatus,
  IFacebookPipelineModel,
  IOmiseChargeDetail,
  IOmiseChargeStatus,
  IOmiseDetail,
  IOmiseInitTransaction,
  IOmisePaymentMetaData,
  IPayment,
  IPaymentOmiseOption,
  SettingPaymentResponse,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import {
  checkOmiseAccount,
  checkOmisePaymentSuccess,
  checkValidOmiseCharge,
  createTemporaryCourierTracking,
  creatOmisePromptpayCharge,
  findPayment,
  getOmiseAccountCapability,
  getPageByID,
  getPurchasingOrder,
  getPurchasingOrderById,
  getPurchasingOrderByPurchasingOrderID,
  insertPaymentTypeOmise,
  omiseRefundPost,
  setPurchaseOrderToUnpaid,
  updateOrderPaymentInfo,
  updateOrderRefundHistory,
  updatePaymentTypeOmise,
  updateRefundedPaymentInfo,
} from '../../data';
import { createPOKey, mapOmiseCapability } from '../../domains';
import { InsufficientProductSupply, PaymentOmiseError } from '../../errors';
import { AdvanceMessageService } from '../message/advance-message.service';
import { PipelineMessageService } from '../pipeline/pipeline-message.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { ProductInventoryService } from '../product/product-inventory.service';
import { PurchaseOrderFailedService } from '../purchase-order/purchase-order-failed.service';
import { PurchaseOrderUpdateService } from '../purchase-order/purchase-order-update.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { PaymentService } from './payment.service';

export class PaymentOmiseService {
  public paymentService: PaymentService;
  public pipelineService: PipelineService;
  public pipelineMessageService: PipelineMessageService;
  public purchaseOrderService: PurchaseOrderService;
  public productInventoryService: ProductInventoryService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;
  public advanceMessageService: AdvanceMessageService;

  constructor() {
    this.paymentService = new PaymentService();
    this.pipelineService = new PipelineService();
    this.pipelineMessageService = new PipelineMessageService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.productInventoryService = new ProductInventoryService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
    this.advanceMessageService = new AdvanceMessageService();
  }

  updateOmise = async (pageID: number, omiseDetail: IOmiseDetail): Promise<SettingPaymentResponse> => {
    try {
      const type = EnumPaymentType.OMISE;
      const paymentObject = await findPayment(PlusmarService.readerClient, pageID, type);
      if (!isEmpty(paymentObject)) {
        return await updatePaymentTypeOmise(PlusmarService.writerClient, pageID, type, omiseDetail);
      } else {
        return await insertPaymentTypeOmise(PlusmarService.writerClient, pageID, type, omiseDetail);
      }
    } catch (err) {
      console.log('err ', err);
      throw new PaymentOmiseError(err);
    }
  };

  validateOmiseAccountAndGetCapability = async (omiseDetail: IOmiseDetail): Promise<IPaymentOmiseOption> => {
    try {
      await checkOmiseAccount(omiseDetail);
      const omiseCapability = await getOmiseAccountCapability(omiseDetail.publicKey);
      return mapOmiseCapability(omiseCapability);
    } catch (err) {
      console.log('err ', err);
      throw new PaymentOmiseError(err);
    }
  };

  async getOmisePaymentCapability(pageID: number): Promise<IPaymentOmiseOption> {
    try {
      const payments = await this.paymentService.getPaymentList(pageID);
      const omiseData = payments.find((x) => x.type === EnumPaymentType.OMISE);
      const key = omiseData.option.OMISE.publicKey;
      const omiseCapability = await getOmiseAccountCapability(key);
      return mapOmiseCapability(omiseCapability);
    } catch (err) {
      console.log('getOmisePaymentCapability ===> err : ', err);
      throw new PaymentOmiseError(err);
    }
  }

  async checkValidOmiseCharge(omiseCharge: IOmiseChargeDetail, key: string, pageID: number, orderID: number): Promise<EnumOmiseChargeStatus> {
    const omiseResponse = await checkValidOmiseCharge(omiseCharge, key);
    if (omiseResponse.object === 'error') return EnumOmiseChargeStatus.INVALID;
    if (omiseResponse.paid) {
      await getPurchasingOrderById(PlusmarService.readerClient, pageID, orderID);
      return EnumOmiseChargeStatus.ALREADY_PAID;
    }
    if (omiseResponse.expired) return EnumOmiseChargeStatus.EXPIRED;
    if (omiseResponse.source.charge_status === IOmiseChargeStatus.CHARGE_PENDING) return EnumOmiseChargeStatus.VALID;
    if (omiseResponse.source.charge_status === IOmiseChargeStatus.CHARGE_FAILED) return EnumOmiseChargeStatus.PAYMENT_FAILED;
  }

  async getOmiseCharge(
    pipeline: IFacebookPipelineModel,
    paymentOmise: IPayment,
    paymentDetail: IOmiseInitTransaction,
    totalPrice: number,
    currencyCode: string,
    pageID: number,
    subscriptionID: string,
  ): Promise<IOmiseChargeDetail> {
    const createOmiseChargeInput: IOmisePaymentMetaData = {
      audienceID: paymentDetail.audienceId,
      poID: pipeline.order_id,
      psid: paymentDetail.psid,
      responseType: paymentDetail.responseType,
      amount: totalPrice * 100,
      source: EnumOmiseSourceType.PROMPTPAY,
      currency: currencyCode,
    };
    let omiseCharge = await this.getChargeKeyOnSession(pipeline.order_id);
    const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, pipeline.order_id.toString());
    if (omiseCharge) {
      const isOrderChange = createOmiseChargeInput.amount !== omiseCharge.metadata.amount;
      const changeStatus = await this.checkValidOmiseCharge(omiseCharge, paymentOmise.option.OMISE.secretKey, pipeline.page_id, pipeline.order_id);
      switch (changeStatus) {
        case EnumOmiseChargeStatus.ALREADY_PAID: {
          const payments = await this.paymentService.getPaymentList(pipeline.page_id);
          const paymentOmise = payments.find((x) => x.type === EnumPaymentType.OMISE);
          const success = await this.omisePaymentSuccess(omiseCharge, paymentOmise.option.OMISE, pageID, subscriptionID);
          if (success) {
            omiseCharge = await creatOmisePromptpayCharge(createOmiseChargeInput, paymentOmise.option.OMISE.secretKey);
            setRedisOnRecursive(PlusmarService.redisClient, pipeline.order_id.toString(), {
              ...paymentRedis,
              messageStatus: EnumGenericRecursiveStatus.PENDING,
            });
            this.addChargKeyOnSession(pipeline.order_id, omiseCharge);
            break;
          } else {
            throw new PaymentOmiseError('ALREADY_PAID');
          }
        }
        case EnumOmiseChargeStatus.PAYMENT_FAILED:
          omiseCharge = await creatOmisePromptpayCharge(createOmiseChargeInput, paymentOmise.option.OMISE.secretKey);
          setRedisOnRecursive(PlusmarService.redisClient, pipeline.order_id.toString(), {
            ...paymentRedis,
            messageStatus: EnumGenericRecursiveStatus.PENDING,
          });
          this.addChargKeyOnSession(pipeline.order_id, omiseCharge);
          break;
        case EnumOmiseChargeStatus.EXPIRED:
          omiseCharge = await creatOmisePromptpayCharge(createOmiseChargeInput, paymentOmise.option.OMISE.secretKey);
          setRedisOnRecursive(PlusmarService.redisClient, pipeline.order_id.toString(), {
            ...paymentRedis,
            messageStatus: EnumGenericRecursiveStatus.PENDING,
          });
          this.addChargKeyOnSession(pipeline.order_id, omiseCharge);
          break;
        case EnumOmiseChargeStatus.VALID:
          if (isOrderChange) {
            omiseCharge = await creatOmisePromptpayCharge(createOmiseChargeInput, paymentOmise.option.OMISE.secretKey);
            setRedisOnRecursive(PlusmarService.redisClient, pipeline.order_id.toString(), {
              ...paymentRedis,
              messageStatus: EnumGenericRecursiveStatus.PENDING,
            });
            this.addChargKeyOnSession(pipeline.order_id, omiseCharge);
          }
          break;
        case EnumOmiseChargeStatus.INVALID:
          throw new PaymentOmiseError('INVALID_CHANGE');
      }
    } else {
      omiseCharge = await creatOmisePromptpayCharge(createOmiseChargeInput, paymentOmise.option.OMISE.secretKey);

      setRedisOnRecursive(PlusmarService.redisClient, pipeline.order_id.toString(), {
        ...paymentRedis,
        messageStatus: EnumGenericRecursiveStatus.PENDING,
      });

      this.addChargKeyOnSession(pipeline.order_id, omiseCharge);
    }
    return omiseCharge;
  }

  getChargeKeyOnSession = (poID: number): Promise<IOmiseChargeDetail> => {
    // TODO: FIx this
    // eslint-disable-next-line no-async-promise-executor
    return new Promise(async (resolve, reject) => {
      try {
        const poKey = createPOKey(poID);
        const userKey = (await getKeysFromSession(PlusmarService.redisClient, poKey)) as IOmiseChargeDetail;
        resolve(userKey);
      } catch (err) {
        console.log('err in getChargeKeyOnSession: ', err);
        reject(err);
      }
    });
  };

  addChargKeyOnSession(poID: number, chargeDetail: IOmiseChargeDetail): void {
    const poKey = createPOKey(poID);

    const session = { poID: poID, ...chargeDetail };
    setSessionValue(PlusmarService.redisClient, poKey, session);
  }

  async setChargKeyOnSession(poID: number, watchType: EnumOmiseChargeWatchType): Promise<void> {
    const poKey = createPOKey(poID);
    const chargeDetail = (await getKeysFromSession(PlusmarService.redisClient, poKey)) as IOmiseChargeDetail;
    chargeDetail.watchType = watchType;
    const session = { poID: poID, ...chargeDetail };
    setSessionValue(PlusmarService.redisClient, poKey, session);
  }

  removeChargeKey(poID: number): void {
    const poKey = createPOKey(poID);
    deleteSessionValue(PlusmarService.redisClient, poKey);
  }

  async omisePaymentSuccess(omiseResponse: IOmiseChargeDetail, paymentOmise: IOmiseDetail, pageID: number, subscriptionID: string): Promise<boolean> {
    const { responseType, audienceID: metaID, amount, psid } = omiseResponse.metadata;
    const {
      order_id: orderID,
      audience_id: audienceID,
      psid: PSID,
      payment_id: paymentID,
    } = await this.pipelineService.getPipelineOnPostbackMessage(responseType, pageID, Number(metaID));

    const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, `OMISE_${orderID.toString()}`);
    try {
      await updateOrderPaymentInfo(PlusmarService.writerClient, JSON.stringify(omiseResponse), omiseResponse.id, orderID, paymentID);
      if (omiseResponse.source) {
        const result = await checkOmisePaymentSuccess(omiseResponse.id, paymentOmise.secretKey);
        if (result.source.charge_status === IOmiseChargeStatus.CHARGE_FAILED) {
          await this.omisePaymentFail(result, PSID);
        }
      }

      if (!omiseResponse.paid) {
        await this.omisePaymentFail(omiseResponse, psid);
      }
      const orderDetail = await getPurchasingOrder(PlusmarService.readerClient, pageID, Number(audienceID));

      const orderAmount = amount / 100;
      await this.purchaseOrderUpdateService.updateOrderOnTransactionComplete(pageID, orderID, audienceID, orderAmount);

      await this.onCompleteOmiseCheckout(PSID, pageID, orderID, audienceID, orderDetail[0].is_auto, subscriptionID);

      setRedisOnRecursive(PlusmarService.redisClient, `OMISE_${orderID.toString()}`, {
        ...paymentRedis,
        messageStatus: EnumGenericRecursiveStatus.SUCCESS,
      });

      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));

      const messages = await this.advanceMessageService.getOrderAdvanceMessage(pageID, EnumHandleResponseMessageType.SUBMIT_2C2P_PAYMENT);
      await this.pipelineMessageService.sendMessagePayload({ pageID: pageID }, messages.title, audienceID);
      await this.pipelineMessageService.sendMessagePayload({ pageID: pageID }, messages.subtitle, audienceID);

      return true;
    } catch (err) {
      if (err instanceof InsufficientProductSupply) {
        const failParams = { pageID, orderID, typename: EnumPurchaseOrderSubStatus.PRODUCT_SUBTRACT_FAILED };
        await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      }
      setRedisOnRecursive(PlusmarService.redisClient, `OMISE_${orderID.toString()}`, {
        ...paymentRedis,
        messageDetail: err.message,
        messageStatus: EnumGenericRecursiveStatus.FAILED,
      });
      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new Error(err));

      throw err;
    }
  }

  async onCompleteOmiseCheckout(PSID: string, pageID: number, orderID: number, audienceID: number, isAutomode: boolean, subscriptionID: string): Promise<void> {
    try {
      await this.productInventoryService.checkActualProductInventory(pageID, orderID, audienceID);
      await this.productInventoryService.subtractProduct(pageID, orderID, audienceID, subscriptionID);

      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      if (isAutomode) await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, client); // ? UPDATE TO STEP 3 ON 2C2P METHOD
      await createTemporaryCourierTracking(client, orderID);

      await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, client); // ? UPDATE TO STEP 4 ON 2C2P METHOD
      await PostgresHelper.execBatchCommitTransaction(client);
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      console.log('onCompleteOmiseCheckout err ::::::::::>>> ', err);
      throw err;
    }
  }

  async omisePaymentFail(omiseResponse: IOmiseChargeDetail, PSID: string): Promise<void> {
    try {
      const purchaseOrder = await getPurchasingOrderByPurchasingOrderID(PlusmarService.readerClient, omiseResponse.metadata.poID);
      const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, `OMISE_${purchaseOrder.id}`);
      setRedisOnRecursive(PlusmarService.redisClient, `OMISE_${purchaseOrder.id}`, {
        ...paymentRedis,
        messageStatus: EnumGenericRecursiveStatus.FAILED,
      });
      const page = await getPageByID(PlusmarService.readerClient, purchaseOrder.page_id);
      const text = `Payment fail : ${omiseResponse.failure_message}`;
      await this.pipelineMessageService.sendMessagePayload({ pageID: page.id }, text, purchaseOrder.audience_id);
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      console.log('err: omisePaymentFail => ', err);
      throw new PaymentOmiseError(err);
    }
  }

  refundTransaction = async (payload: IOmiseChargeDetail, pageID: number, orderID: number): Promise<void> => {
    const responseType = payload.metadata.responseType;
    const creditCard = EnumHandleResponseMessageType.SUBMIT_OMISE_CREDIT_CARD_PAYMENT;
    if (responseType !== creditCard) throw new Error('PAYMENT_TYPE_NOT_SUPPORT_REFUND');

    const payments = await this.paymentService.getPaymentList(pageID);
    const omiseData = payments.find((x) => x.type === EnumPaymentType.OMISE);
    const key = omiseData.option.OMISE.secretKey;
    const { id, amount } = payload as IOmiseChargeDetail;
    const { data } = await omiseRefundPost(key, id, { amount });

    await updateRefundedPaymentInfo(PlusmarService.writerClient, pageID, orderID);
    await setPurchaseOrderToUnpaid(PlusmarService.writerClient, pageID, orderID);
    await updateOrderRefundHistory(PlusmarService.writerClient, JSON.stringify(data), orderID, omiseData.id);
  };
}
