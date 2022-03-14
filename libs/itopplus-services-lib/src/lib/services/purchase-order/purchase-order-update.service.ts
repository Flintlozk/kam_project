import { getUTCDayjs, getUTCMongo, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, EnumFileFolder, IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import {
  CustomerAddressFromGroup,
  CustomerDomainStatus,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  EnumPurchasingPayloadType,
  EnumTrackingType,
  IChangePaymentInput,
  IFacebookPipelineModel,
  ILogInput,
  IPayload,
  IPurchaseOrder,
  IPurchaseOrderPostbackMessageAddress,
  PurchaseOrderResponse,
  TrackingNoInput,
  UpdatePurchasePaymentInput,
  UpdatePurchasePaymentMode,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { Pool } from 'pg';
import {
  createTemporaryCourierTracking,
  getAudienceByID,
  getLogisticDetail,
  getPaymentById,
  getPaymentDetail,
  getPurchaseOrderPipelineData,
  getPurchasingOrderById,
  getPurchasingOrderLogisticInfo,
  getPurchasingOrderPaymentType,
  getPurchasingOrderTrackingInfo,
  listPayloadBankAccount,
  updateAutomatePurchasing,
  updateCourierTrackingDate,
  updateOrderPayment,
  updateOrderPaymentInfo,
  updateOrderPaymentOnBankAccount,
  updateOrderPaymentProof,
  updateOrderTracking,
  updateOrderTrackingType,
} from '../../data';
import { getLogisitcTrackingURL } from '../../domains/logistic/get-tracking-url.domain';
import { getMessageForBankMethod } from '../../domains/pipeline/get-payload-messages.domain';
import { PurchasingOrderNotFound, PurchasingOrderUpdateDisabled } from '../../errors';
import { AudienceStepService } from '../audience-step';
import { CustomerService } from '../customer/customer.service';
import { FileService } from '../file/file.service';
import { JAndTExpressService } from '../j&t-express';
import { LogService } from '../log/log.service';
import { PipelineService } from '../pipeline';
import { PipelineMessageService } from '../pipeline/pipeline-message.service';
import { PipelineOrderMessageService } from '../pipeline/pipeline-order-message.service';
import { PlusmarService } from '../plusmarservice.class';
import { ProductService } from '../product';
import { ProductInventoryService } from '../product/product-inventory.service';
import { PurchaseOrderPipelineService } from './purchase-order-pipeline.service';
import { PurchaseOrderService } from './purchase-order.service';

const FOLDER_ORDER = 'order';

export class PurchaseOrderUpdateService {
  public productInventoryService: ProductInventoryService;
  public purchaseOrderService: PurchaseOrderService;
  public productService: ProductService;
  public customerService: CustomerService;
  public LogService: LogService;
  public jAndTExpressService: JAndTExpressService;
  public pipelineService: PipelineService;
  public pipelineMessageService: PipelineMessageService;
  public pipelineOrderMessageService: PipelineOrderMessageService;
  public purchaseOrderPipelineService: PurchaseOrderPipelineService;
  public audienceStepService: AudienceStepService;
  public fileService: FileService;

  constructor() {
    this.productInventoryService = new ProductInventoryService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.productService = new ProductService();
    this.customerService = new CustomerService();
    this.LogService = new LogService();
    this.jAndTExpressService = new JAndTExpressService();
    this.pipelineMessageService = new PipelineMessageService();
    this.pipelineService = new PipelineService();
    this.pipelineOrderMessageService = new PipelineOrderMessageService();
    this.purchaseOrderPipelineService = new PurchaseOrderPipelineService();
    this.audienceStepService = new AudienceStepService();
    this.fileService = new FileService();
  }

  changeOrderLogistic = () => {
    //
  };
  changeOrderPayment = (params: IChangePaymentInput) => {
    const { audienceID, orderID, changeTo } = params;
    switch (changeTo) {
      case EnumPaymentType.PAYPAL: {
        break;
      }
      default:
        break;
    }
    //
  };

  updatePurchaseOrder = async (payload: IPayload, { orderId: orderID, products: newOrder, isAuto, platform }: IPurchaseOrder): Promise<PurchaseOrderResponse> => {
    try {
      const { pageID, subscriptionID } = payload;
      const orderDetail = await getPurchasingOrderById(PlusmarService.readerClient, pageID, orderID);
      if (!isEmpty(orderDetail)) {
        const customerPaid = orderDetail.is_paid;
        const audienceId = orderDetail.audience_id;

        if (customerPaid) {
          throw new PurchasingOrderUpdateDisabled('ORDER_IS_PAID_ALREADY');
        }

        await this.productInventoryService.updatePurchaseCart(newOrder, pageID, orderID, audienceId, subscriptionID);

        try {
          const pipeline = await this.pipelineService.checkPurchaseOrderPipelineByAudienceID(pageID, audienceId);
          await this.changeAutomateOrderStatus(pipeline, isAuto);
          await this.updatePurchaseOrderOnFollowStatus(pipeline, isAuto, platform, subscriptionID); // IF EnumPurchaseOrderStatus.FOLLOW
          await this.updatePurchaseOrderOnWaitingForPaymentStatus(pipeline, isAuto, platform, subscriptionID); // IF EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT
          await this.updatePurchaseOrderOnConfirmPayment(pipeline, audienceId, platform, pageID); // IF EnumPurchaseOrderStatus.CONFIRM_PAYMENT
        } catch (err) {
          throw new Error(err);
        }
        return { status: 200, message: 'ok' };
      } else {
        throw new PurchasingOrderNotFound('PURCHASE_ORDER_NOT_FOUND');
      }
    } catch (err) {
      console.log('err ::::::::::>>> ', err);
      throw err;
    }
  };

  updatePurchaseOrderOnFollowStatus = async (pipeline: IFacebookPipelineModel, isAuto: boolean, platform: AudiencePlatformType, subscriptionID: string): Promise<void> => {
    if (pipeline.pipeline === EnumPurchaseOrderStatus.FOLLOW) {
      if (isAuto) {
        await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.CONFIRM_ORDER, platform, subscriptionID);
      }
    }
  };

  updatePurchaseOrderOnWaitingForPaymentStatus = async (
    pipeline: IFacebookPipelineModel,
    isAuto: boolean,
    platform: AudiencePlatformType,
    subscriptionID: string,
  ): Promise<void> => {
    if (pipeline.pipeline === EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT) {
      if (isAuto) {
        await this.pipelineOrderMessageService.sendOrderPayload(
          pipeline.page_id,
          pipeline.audience_id,
          EnumPurchasingPayloadType.COMBINE_LOGISTIC_PAYMENT,
          platform,
          subscriptionID,
        );
      }
    }
  };
  updatePurchaseOrderOnConfirmPayment = async (pipeline: IFacebookPipelineModel, audienceID: number, platform: AudiencePlatformType, pageID: number): Promise<void> => {
    if (pipeline.pipeline === EnumPurchaseOrderStatus.CONFIRM_PAYMENT) {
      const paymentDetail = await getPaymentDetail(PlusmarService.readerClient, pageID, pipeline.payment_id);

      if (paymentDetail[0].type === EnumPaymentType.BANK_ACCOUNT) {
        const account = await listPayloadBankAccount(PlusmarService.readerClient, pageID);
        const message = getMessageForBankMethod(account);
        await this.pipelineMessageService.sendPlayloadPlatform({ pageID }, message, 'sendMessagePayload', audienceID, platform);
      }
    }
  };

  changeAutomateOrderStatus = async (pipeline: IFacebookPipelineModel, isAuto: boolean): Promise<void> => {
    await updateAutomatePurchasing(PlusmarService.writerClient, isAuto, pipeline.page_id, pipeline.order_id);
  };

  async updateTrackingNumber(
    { pageID, subscriptionID }: IPayload,
    audienceId: number,
    orderId: number,
    tracking: TrackingNoInput,
    platform: AudiencePlatformType,
  ): Promise<PurchaseOrderResponse> {
    const pipeline = await this.pipelineService.checkPurchaseOrderPipelineByOrderID(pageID, orderId);
    const trackResult = await Promise.all([
      getLogisticDetail(PlusmarService.readerClient, pageID, pipeline.logistic_id),
      getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderId, pageID),
      getPurchasingOrderLogisticInfo(PlusmarService.readerClient, orderId, pageID),
    ]);
    const logisticDetail = trackResult[0];
    let trackInfo = trackResult[1];
    const logisticInfo = trackResult[2];
    const Client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    if (!isEmpty(logisticDetail)) {
      tracking.trackingUrl = getLogisitcTrackingURL(logisticDetail[0].delivery_type, tracking.trackingNo);
    }

    if (isEmpty(trackInfo)) {
      await createTemporaryCourierTracking(Client, orderId);
      trackInfo = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderId, pageID);
    }

    if (!isEmpty(trackInfo)) {
      if (!trackInfo.active && logisticInfo.tracking_type !== EnumTrackingType.MANUAL) {
        await updateOrderTrackingType(Client, orderId);
      }
    }
    await updateOrderTracking(Client, pageID, audienceId, orderId, tracking);
    await updateCourierTrackingDate(Client, orderId, tracking);

    await PostgresHelper.execBatchCommitTransaction(Client);
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
      status: 200,
      message: 'ok',
    };
  }

  async updatePurchasePayment(
    { pageID, page: { uuid: pageUUID }, subscriptionID }: IPayload,
    payment: UpdatePurchasePaymentInput,
    mode: UpdatePurchasePaymentMode,
    file: IGQLFileSteam,
  ): Promise<PurchaseOrderResponse> {
    try {
      const order = await getPurchasingOrderPaymentType(PlusmarService.readerClient, pageID, payment.audienceId, payment.orderId);
      switch (order.type) {
        case EnumPaymentType.BANK_ACCOUNT:
          if (payment.bankAccount !== -1) {
            const IS_PAID = true;
            const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
            await updateOrderPaymentOnBankAccount(client, pageID, payment);
            await updateOrderPaymentInfo(client, JSON.stringify({}), `${EnumPaymentType.BANK_ACCOUNT}_${order.id}`, order.id, order.payment_id);
            await PostgresHelper.execBatchCommitTransaction(client);

            if (payment.paymentStatus === IS_PAID && mode === UpdatePurchasePaymentMode.UPDATE) {
              await this.productInventoryService.checkActualProductInventory(pageID, payment.orderId, payment.audienceId);
              await this.productInventoryService.subtractProduct(pageID, payment.orderId, payment.audienceId, subscriptionID);
            } else if (payment.paymentStatus !== IS_PAID && mode === UpdatePurchasePaymentMode.UPDATE) {
              await this.productService.releasePurchaseProductOnCancelPayment(pageID, payment.orderId, subscriptionID);
            }
          } else {
            throw new Error('PLEASE_SELECT_ACCOUNT');
          }
          break;
        default:
          if (!order.is_auto) {
            await this.productInventoryService.checkActualProductInventory(pageID, payment.orderId, payment.audienceId);
            await this.productInventoryService.subtractProduct(pageID, payment.orderId, payment.audienceId, subscriptionID);
            await updateOrderPayment(PlusmarService.writerClient, pageID, payment);
          } else {
            throw new Error('NOT_ALLOW_TO_UPDATE_STEP');
          }
          break;
      }

      if (file !== null) {
        const images = await this.fileService.uploadSystemFiles(pageID, [file], subscriptionID, pageUUID, EnumFileFolder.ORDER, payment.orderId.toString());
        payment.imagePayment = images[0].mediaLink;
        await updateOrderPaymentProof(PlusmarService.writerClient, pageID, payment);
      }

      return { status: 200, message: 'ok' };
    } catch (err) {
      console.log('updatePurchasePayment err ::::::::::>>> ', err);
      throw err;
    }
  }

  async handlePlatFormMessage(payload: IPayload, text: string, platform: AudiencePlatformType, audienceID: number): Promise<void> {
    switch (platform) {
      case AudiencePlatformType.LINEOA:
        await this.pipelineMessageService.sendLinePayloadData(payload, text, 'sendMessagePayload', audienceID);
        break;
      default:
        await this.pipelineMessageService.sendMessageConfirmEventUpdatePayload(payload, text, audienceID);
        break;
    }
  }

  async updateStep(pageID: number, audienceID: number, subscriptionID: string): Promise<void> {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient, 'UPDATE_STEP_SIGNATURE');
      const userIDNullForCustomer = null;
      await this.audienceStepService.updateAudiencePurchaseStep(audienceID, pageID, userIDNullForCustomer, client);
      await this.purchaseOrderPipelineService.updateNextPurchaseOrderStatus(pageID, audienceID, subscriptionID, client);
      await PostgresHelper.execBatchCommitTransaction(client);
    } catch (err) {
      console.log('updateStep ERROR', err);
      throw err;
    }
  }

  async updateStepTransaction(pageID: number, audienceID: number, subscriptionID: string, Client: Pool): Promise<void> {
    const userIDNullForCustomer = null;
    await this.audienceStepService.updateAudiencePurchaseStep(audienceID, pageID, userIDNullForCustomer, Client);
    await this.purchaseOrderPipelineService.updateNextPurchaseOrderStatus(pageID, audienceID, subscriptionID, Client);
  }

  updateShippingAddress = async (pageID: number, orderID: number, audienceID: number, shippingAddress: CustomerAddressFromGroup): Promise<IHTTPResult> => {
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const isStep1 = audience.status === CustomerDomainStatus.FOLLOW;
    const isStep5 = audience.status === CustomerDomainStatus.CLOSED;
    if (isStep1 && isStep5) {
      throw new Error('Cannot Update Shipping address in current step');
    }
    const pipeline = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
    const addressConvertObjectToType: IPurchaseOrderPostbackMessageAddress = {
      name: shippingAddress.name,
      phone_number: shippingAddress.phoneNo,
      address: shippingAddress.address,
      post_code: shippingAddress.postalCode,
      district: shippingAddress.district,
      city: shippingAddress.city,
      province: shippingAddress.province,
    };

    await this.purchaseOrderService.checkAddressDetail(pipeline, addressConvertObjectToType, pageID, audienceID);
    return {
      status: 200,
      value: 'OK',
    };
  };

  async updateOrderOnTransactionComplete(pageID: number, orderID: number, audienceID: number, amount: number): Promise<void> {
    const currentDate = getUTCDayjs();
    const paymentObject = {
      audienceId: audienceID,
      orderId: orderID,
      paymentStatus: true,
      amount: Number(amount),
      date: currentDate.toDate(),
      time: `${currentDate.hour()}:${currentDate.minute()}`,
    } as UpdatePurchasePaymentInput;
    await updateOrderPayment(PlusmarService.writerClient, pageID, paymentObject);
  }

  async loggerPipeline(pageID: number, description: string, type: string, action: string): Promise<void> {
    // const { pageID, userID, name } = payload;
    await this.LogService.addLog(
      {
        user_id: null,
        type: type,
        action: action,
        description: description,
        user_name: null,
        audience_id: null,
        audience_name: null,
        created_at: getUTCMongo(),
      } as ILogInput,
      pageID,
    );
  }
}
