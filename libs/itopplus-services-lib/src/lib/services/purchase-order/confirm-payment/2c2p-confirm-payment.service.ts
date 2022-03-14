import { getRedisOnRecursive, isAllowCaptureException, setRedisOnRecursive } from '@reactor-room/itopplus-back-end-helpers';
import { EnumGenericRecursiveStatus } from '@reactor-room/model-lib';
import { EnumHandleResponseMessageType, EnumPurchaseOrderSubStatus, IPayment2C2PResponse, PurchaseOrderPostbackMessage } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { getPurchasingOrder, updateOrderPaymentInfo } from '../../../data';
import { InsufficientProductSupply, Payment2C2PError } from '../../../errors';
import { AdvanceMessageService } from '../../message/advance-message.service';
import { Payment2C2PService } from '../../payment/payment-2c2p.service';
import { PipelineMessageService, PipelineService } from '../../pipeline';
import { PlusmarService } from '../../plusmarservice.class';
import { ProductInventoryService } from '../../product';
import { PurchaseOrderFailedService } from '../purchase-order-failed.service';
import { PurchaseOrderUpdateService } from '../purchase-order-update.service';
import { PurchaseOrderService } from '../purchase-order.service';

export class Payment2C2PConfirmPaymentService {
  public purchaseOrderService: PurchaseOrderService;
  public pipelineService: PipelineService;
  public pipelineMessageService: PipelineMessageService;
  public payment2C2PService: Payment2C2PService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public productInventoryService: ProductInventoryService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;
  public advanceMessageService: AdvanceMessageService;

  constructor() {
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.pipelineService = new PipelineService();
    this.pipelineMessageService = new PipelineMessageService();
    this.payment2C2PService = new Payment2C2PService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.productInventoryService = new ProductInventoryService();
    this.advanceMessageService = new AdvanceMessageService();
  }

  async onComplete2C2PPayment(
    params: PurchaseOrderPostbackMessage,
    response: IPayment2C2PResponse,
    eventType: EnumHandleResponseMessageType,
    pageID: number,
    audienceId: number,
    subscriptionID: string,
  ): Promise<boolean> {
    const {
      order_id: orderID,
      audience_id: audienceID,
      psid: PSID,
      payment_id: paymentID,
    } = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, Number(audienceId));
    const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, `2C2P_${orderID}`);
    try {
      await this.payment2C2PService.validate2C2PHash(response);

      const resOrderID = response.order_id.substring(0, response.order_id.length - 10);
      const orderId = parseInt(resOrderID.replace(/^0+/, ''));
      const amount = parseInt(response.amount) / 100;
      const isPaymentSucces = response.payment_status === '000';
      const isOrderIDValid = orderId === orderID;

      if (!isOrderIDValid) {
        throw new Payment2C2PError('ORDER_ID_NOT_VALID');
      }
      if (!isPaymentSucces) {
        throw new Payment2C2PError('PAYMENT_NOT_COMPLETE');
      }
      await updateOrderPaymentInfo(PlusmarService.writerClient, JSON.stringify(response), response.order_id, orderID, paymentID);

      const orderDetail = await getPurchasingOrder(PlusmarService.readerClient, pageID, Number(audienceId));
      await this.purchaseOrderUpdateService.updateOrderOnTransactionComplete(pageID, orderID, audienceID, amount);
      await this.payment2C2PService.onComplete2C2PCheckout(PSID, pageID, orderID, audienceID, orderDetail[0].is_auto, subscriptionID);

      setRedisOnRecursive(PlusmarService.redisClient, `2C2P_${orderID}`, {
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

      if (err instanceof Payment2C2PError) {
        const failParams = {
          pageID,
          orderID,
          typename: EnumPurchaseOrderSubStatus.TRANSACTION_2C2P_FAILED,
          description: JSON.stringify({
            order_id: response.order_id,
            transaction_ref: response.transaction_ref,
            payment_status: response.payment_status,
            payment_channel: response.payment_channel,
            channel_response_code: response.channel_response_code,
            channel_response_desc: response.channel_response_desc,
          }),
        };
        await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      }

      setRedisOnRecursive(PlusmarService.redisClient, `2C2P_${orderID}`, {
        ...paymentRedis,
        messageStatus: EnumGenericRecursiveStatus.FAILED,
      });
      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new Payment2C2PError(err));
      return false;
    }
  }
}
