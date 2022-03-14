import { cryptoDecode, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  EnumHandleResponseMessageType,
  EnumPaymentType,
  EnumPurchaseOrderSubStatus,
  EnumPurchasingPayloadType,
  IFacebookPipelineModel,
  ILogisticSystemTempMapping,
  IPayloadContainer,
} from '@reactor-room/itopplus-model-lib';
import { createTemporaryCourierTracking, getAudienceByID, getPageByID, updateOrderPaymentInfo } from '../../../data';
import { sendPayload } from '../../../data/pipeline';
import { getMessageForBankMethod, sendMessagePayload } from '../../../domains';
import { getHashLogisitcSystemTempMapping } from '../../../domains/logistic-system/logistic-system.domain';
import { CustomerService } from '../../customer';
import { LogisticSystemService } from '../../logistic/logistic-system.service';
import { PaymentService } from '../../payment/payment.service';
import { PipelineService } from '../../pipeline';
import { PipelineLineMessageService } from '../../pipeline/pipeline-line-message.service';
import { PlusmarService } from '../../plusmarservice.class';
import { ProductInventoryService } from '../../product';
import { LogisticsService } from '../../settings/logistics/logistics.service';
import { PurchaseOrderFailedService } from '../purchase-order-failed.service';
import { PurchaseOrderUpdateService } from '../purchase-order-update.service';
import { PurchaseOrderService } from '../purchase-order.service';

export class CommonConfirmPaymentService {
  public purchaseOrderService: PurchaseOrderService;
  public pipelineService: PipelineService;
  public pipelineLineMessageService: PipelineLineMessageService;
  public paymentService: PaymentService;
  public logisticService: LogisticsService;
  public logisticSystemService: LogisticSystemService;
  public productInventoryService: ProductInventoryService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;
  public customerService: CustomerService;

  constructor() {
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.pipelineService = new PipelineService();
    this.pipelineLineMessageService = new PipelineLineMessageService();
    this.paymentService = new PaymentService();
    this.logisticService = new LogisticsService();
    this.productInventoryService = new ProductInventoryService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.customerService = new CustomerService();
    this.logisticSystemService = new LogisticSystemService();
  }

  async onCheckProductSufficient(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number): Promise<boolean> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, Number(audienceID));
    try {
      await this.productInventoryService.checkReservedProductInventory(pipeline.page_id, pipeline.order_id, audienceID);
      return true;
    } catch (err) {
      const failParams = { pageID, orderID: pipeline.order_id, typename: EnumPurchaseOrderSubStatus.PRODUCT_SUBTRACT_FAILED };
      await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      return false;
    }
  }
  async onConfirmPaymentSelection(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number, subscriptionID: string): Promise<boolean> {
    try {
      // IN-COMMING EVENT FROM STEP 2
      const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceID);
      const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);

      await this.checkPaymentDetail(pipeline, audience.platform, subscriptionID);
      await this.logisticService.checkLogisticDetail(pipeline, pipeline.is_flat_rate);
      await this.customerService.updatePDPAConsentAcceptance(audience.customer_id, pipeline.page_id, { TERMS: true, PRIVACY: true, DATA_USE: false });

      return true;
    } catch (err) {
      console.log('onConfirmPaymentSelection error: ', err);
      return false;
    }
  }
  async onVerifyOrderContext(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number, hashKey: string): Promise<boolean> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceID);
    const order = await this.purchaseOrderService.getPurchasingOrderById(pageID, pipeline.order_id);
    const tempShippingMapping: ILogisticSystemTempMapping = await this.logisticSystemService.getLogisticSystemOption(pageID, order, order.flat_rate, order.logistic_id);

    const compareHash = getHashLogisitcSystemTempMapping(tempShippingMapping, order.id);
    return hashKey === compareHash;
  }

  async checkPaymentDetail(pipeline: IFacebookPipelineModel, view: AudiencePlatformType, subscriptionID: string): Promise<void> {
    const paymentDetail = await this.paymentService.getPaymentDetail(pipeline.page_id, pipeline.payment_id);
    switch (paymentDetail[0].type) {
      case EnumPaymentType.BANK_ACCOUNT: {
        await this.onConfirmPaymentAsBankAccountMethod(pipeline, view, subscriptionID);
        break;
      }
      case EnumPaymentType.CASH_ON_DELIVERY: {
        await this.onConfirmPaymentAsCashOnDeliveryMethod(pipeline, subscriptionID);
        break;
      }
      case EnumPaymentType.PAYPAL:
      case EnumPaymentType.PAYMENT_2C2P: {
        // Backend will do nothing for this case
        await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(pipeline.audience_id), Number(pipeline.order_id), Number(pipeline.page_id));
        break;
      }
    }
  }

  async onConfirmPaymentAsBankAccountMethod(pipeline: IFacebookPipelineModel, view: AudiencePlatformType, subscriptionID: string): Promise<void> {
    const page = await getPageByID(PlusmarService.readerClient, pipeline.page_id);
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const graphVersion = PlusmarService.environment.graphFBVersion;

    await this.productInventoryService.reservedProduct(pipeline.order_id, pipeline.page_id, pipeline.audience_id, subscriptionID);
    await this.purchaseOrderUpdateService.updateStep(pipeline.page_id, pipeline.audience_id, subscriptionID);

    await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(pipeline.audience_id), Number(pipeline.order_id), Number(pipeline.page_id));

    const account = await this.paymentService.listPayloadBankAccount(pipeline.page_id);
    const message = getMessageForBankMethod(account);

    const payload: IPayloadContainer = {
      name: 'sendMessagePayload',
      json: sendMessagePayload({ PSID: pipeline.psid }, message),
    };

    switch (view) {
      case AudiencePlatformType.LINEOA:
        await this.pipelineLineMessageService.sendOrderLinePayload(pipeline.audience_id, pipeline.page_id, payload, EnumPurchasingPayloadType.SEND_BANK_ACCOUNT);
        break;
      default:
        await sendPayload(graphVersion, pageAccessToken, payload);
        break;
    }
  }

  async onConfirmPaymentAsCashOnDeliveryMethod(
    { page_id: pageID, order_id: orderID, audience_id: audienceID, payment_id }: IFacebookPipelineModel,
    subscriptionID: string,
  ): Promise<void> {
    const Client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    await updateOrderPaymentInfo(Client, JSON.stringify({}), `${'CASH_ON_DELIVERY'}_${orderID}`, orderID, payment_id);

    await this.productInventoryService.checkActualProductInventory(pageID, orderID, audienceID);
    await this.productInventoryService.subtractProduct(pageID, orderID, audienceID, subscriptionID);

    await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, Client); // to step 3
    await createTemporaryCourierTracking(Client, orderID);
    await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, Client); // to step 4

    await PostgresHelper.execBatchCommitTransaction(Client);

    await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));
  }
}
