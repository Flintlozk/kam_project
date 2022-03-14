import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumHandleResponseMessageType,
  EnumPaymentType,
  EnumPurchaseOrderSubStatus,
  IPaypalPaymentDetail,
  IPipelinePaypalApproveData,
  PaypalPaymentLinksRelEnum,
  PaypalPaymentStatus,
  PurchaseOrderPostbackMessage,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { capturePaypalTransaction, getPaymentDetail, getPaypalAuthorization, getPaypalAuthorizedCapture, getPurchasingOrder, updateOrderPaymentInfo } from '../../../data';
import { InsufficientProductSupply, PaypalPaymentError } from '../../../errors';
import { PaymentPaypalService } from '../../payment';
import { PipelineMessageService, PipelineService } from '../../pipeline';
import { PlusmarService } from '../../plusmarservice.class';
import { ProductInventoryService } from '../../product/product-inventory.service';
import { PurchaseOrderFailedService } from '../purchase-order-failed.service';
import { PurchaseOrderUpdateService } from '../purchase-order-update.service';
import { PurchaseOrderService } from '../purchase-order.service';

export class PaypalConfirmPaymentService {
  public purchaseOrderService: PurchaseOrderService;
  public productInventoryService: ProductInventoryService;
  public pipelineService: PipelineService;
  public pipelineMessageService: PipelineMessageService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public paymentPaypalService: PaymentPaypalService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;

  constructor() {
    this.purchaseOrderService = new PurchaseOrderService();
    this.productInventoryService = new ProductInventoryService();
    this.pipelineService = new PipelineService();
    this.pipelineMessageService = new PipelineMessageService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.paymentPaypalService = new PaymentPaypalService();
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
  }

  async onApprovePaypalPayment(
    params: PurchaseOrderPostbackMessage,
    body: IPipelinePaypalApproveData,
    eventType: EnumHandleResponseMessageType,
    pageID: number,
    audienceId: number,
    subscriptionID: string,
  ): Promise<number> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, Number(audienceId));
    const { order_id: orderID, psid: PSID, audience_id: audienceID, payment_id: paymentID } = pipeline;
    try {
      const paymentDetail = await getPaymentDetail(PlusmarService.readerClient, pageID, paymentID);

      const paypalData = paymentDetail.filter((item) => item.type === EnumPaymentType.PAYPAL);
      if (!paypalData) throw new Error('PAYPAL SETTING NOT FOUND');

      const ClientID = paypalData[0].option.clientId;
      const ClientSecret = paypalData[0].option.clientSecret;

      const basicAuth = Buffer.from(`${ClientID}:${ClientSecret}`).toString('base64');
      const auth = await getPaypalAuthorization(PlusmarService.environment.paypalOauthApi, basicAuth);
      const accessToken = auth.data.access_token;

      const { data: authorizedCaptureData } = await getPaypalAuthorizedCapture(PlusmarService.environment.paypalOrderApi, accessToken, body.orderID);
      const captureDetail = authorizedCaptureData as IPaypalPaymentDetail;

      const orderId = Number(captureDetail.purchase_units[0].custom_id.replace('CUSTOM_ORDER_ID_', ''));
      const isOrderValid = orderId === orderID;
      if (isOrderValid) {
        const capture = captureDetail.links.find((x) => x.rel === PaypalPaymentLinksRelEnum.capture);
        const { data: capturedTransaction } = await capturePaypalTransaction(capture.href, accessToken);
        const completeTransaction = capturedTransaction as IPaypalPaymentDetail;

        if (completeTransaction.status === PaypalPaymentStatus.COMPLETED) {
          await updateOrderPaymentInfo(PlusmarService.writerClient, JSON.stringify(completeTransaction), completeTransaction.id, orderID, paymentID);
          await this.purchaseOrderUpdateService.updateOrderOnTransactionComplete(pageID, orderID, audienceID, Number(captureDetail.purchase_units[0].amount.value));
          const orderDetail = await getPurchasingOrder(PlusmarService.readerClient, pageID, Number(audienceID));
          return await this.paymentPaypalService.onCompletePaypalCheckout(PSID, pageID, orderID, audienceID, orderDetail[0].is_auto, subscriptionID);
        } else {
          const failParams = { pageID, orderID, typename: EnumPurchaseOrderSubStatus.PAYMENT_PAYPAL_FAILED };
          await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
          return 500;
        }
      } else {
        return 500;
      }
    } catch (err) {
      if (err instanceof InsufficientProductSupply) {
        const failParams = { pageID, orderID, typename: EnumPurchaseOrderSubStatus.PRODUCT_SUBTRACT_FAILED };
        await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      }
      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new PaypalPaymentError(err));
      return 500;
    }
  }
}
