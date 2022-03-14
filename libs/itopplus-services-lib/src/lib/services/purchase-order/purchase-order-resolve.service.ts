import { EnumPaymentType, EnumPurchaseOrderSubStatus, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { getCustomerByAudienceID, getPurchasingOrderById, getPurchasingOrderUnrefundedPaymentInfo } from '../../data';
import { Payment2C2PService } from '../payment/payment-2c2p.service';
import { PaymentOmiseService } from '../payment/payment-omise.service';
import { PaymentPaypalService } from '../payment/payment-paypal.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderFailedService } from './purchase-order-failed.service';
import { PurchaseOrderService } from './purchase-order.service';

export class PurchaseOrderResolveService {
  public paymentPaypalService: PaymentPaypalService;
  public payment2C2PService: Payment2C2PService;
  public paymentOmiseService: PaymentOmiseService;
  public purchaseOrderService: PurchaseOrderService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;

  constructor() {
    this.paymentPaypalService = new PaymentPaypalService();
    this.payment2C2PService = new Payment2C2PService();
    this.paymentOmiseService = new PaymentOmiseService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
  }

  resolvePurchaseOrderPaidTransaction = async (pageID: number, orderID: number, subscriptionID: string): Promise<PurchaseOrderResponse> => {
    const { is_paid, audience_id: audienceID } = await getPurchasingOrderById(PlusmarService.readerClient, pageID, orderID);
    if (is_paid) {
      const payment = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, orderID);
      if (isEmpty(payment)) throw new Error('PAYMENT_NOT_FOUND');
      const { type } = payment[0];
      switch (type) {
        case EnumPaymentType.PAYPAL:
          await this.onResolvePaypal(pageID, orderID, audienceID, subscriptionID);
          break;
        case EnumPaymentType.PAYMENT_2C2P:
          await this.onResolve2C2P(pageID, orderID, audienceID, subscriptionID);
          break;
        case EnumPaymentType.OMISE:
          await this.onResolveOmise(pageID, orderID, audienceID, subscriptionID);
          break;
      }

      await this.purchaseOrderFailedService.resolvePurchaseOrderProblem({ orderID, pageID, typename: EnumPurchaseOrderSubStatus.PRODUCT_SUBTRACT_FAILED });
      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));

      return {
        status: 200,
        message: 'ok',
      };
    } else {
      throw new Error('ORDER_NOT_YET_PAID');
    }
  };

  async onResolvePaypal(pageID: number, orderID: number, audienceID: number, subscriptionID: string): Promise<void> {
    const { psid: PSID } = await getCustomerByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    const resolveAsAutomode = true;
    await this.paymentPaypalService.onCompletePaypalCheckout(PSID, pageID, orderID, audienceID, resolveAsAutomode, subscriptionID);
  }

  async onResolve2C2P(pageID: number, orderID: number, audienceID: number, subscriptionID: string): Promise<void> {
    const { psid: PSID } = await getCustomerByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    const resolveAsAutomode = true;
    await this.payment2C2PService.onComplete2C2PCheckout(PSID, pageID, orderID, audienceID, resolveAsAutomode, subscriptionID);
  }

  async onResolveOmise(pageID: number, orderID: number, audienceID: number, subscriptionID: string): Promise<void> {
    const { psid: PSID } = await getCustomerByAudienceID(PlusmarService.readerClient, audienceID, pageID);
    const resolveAsAutomode = true;
    await this.paymentOmiseService.onCompleteOmiseCheckout(PSID, pageID, orderID, audienceID, resolveAsAutomode, subscriptionID);
  }
}
