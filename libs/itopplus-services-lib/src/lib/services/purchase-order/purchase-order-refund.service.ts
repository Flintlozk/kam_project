import {
  EnumHandleResponseMessageType,
  EnumPaymentType,
  EnumPurchaseOrderSubStatus,
  IOmiseChargeDetail,
  IPayment2C2PResponse,
  IPaypalPaymentResponse,
  IPurhcaseOrderPayment,
  PurchaseOrderResponse,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { getPurchasingOrderUnrefundedPaymentInfo } from '../../data';
import { Payment2C2PService } from '../payment/payment-2c2p.service';
import { PaymentPaypalService } from '../payment/payment-paypal.service';
import { PaymentOmiseService } from '../payment/payment-omise.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderFailedService } from './purchase-order-failed.service';
import * as Sentry from '@sentry/node';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';

export class PurchaseOrderRefundService {
  public payment2C2PService: Payment2C2PService;
  public paymentOmiseService: PaymentOmiseService;
  public paymentPaypalService: PaymentPaypalService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;
  constructor() {
    this.payment2C2PService = new Payment2C2PService();
    this.paymentOmiseService = new PaymentOmiseService();
    this.paymentPaypalService = new PaymentPaypalService();
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
  }

  async getPurchasingOrderUnrefundedPaymentInfo(pageID: number, orderID: number): Promise<IPurhcaseOrderPayment[]> {
    const result = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, orderID);
    if (isEmpty(result)) throw new Error('NO_PAYMENT_INFO');
    return result;
  }

  async proceedToRefundOrder(pageID: number, orderID: number): Promise<PurchaseOrderResponse> {
    const detail = await getPurchasingOrderUnrefundedPaymentInfo(PlusmarService.readerClient, pageID, orderID);
    if (isEmpty(detail)) throw new Error('REFUND_ALREADY_PROCEEDED');

    const { type, payload } = detail[0];
    switch (type) {
      case EnumPaymentType.PAYMENT_2C2P:
        await this.onRefund2C2P(payload as IPayment2C2PResponse, pageID, orderID);
        break;
      case EnumPaymentType.OMISE:
        await this.onRefundOmise(payload as IOmiseChargeDetail, pageID, orderID);
        break;
      case EnumPaymentType.PAYPAL:
        await this.onRefundPaypal(payload as IPaypalPaymentResponse, pageID, orderID);
        break;
      case EnumPaymentType.BANK_ACCOUNT:
      case EnumPaymentType.CASH_ON_DELIVERY:
        throw new Error('PAYMENT_TYPE_NOT_SUPPORT_REFUND');
    }
    return await Promise.resolve({
      status: 200,
      message: 'Complete',
    });
  }

  async onRefund2C2P(payload: IPayment2C2PResponse, pageID: number, orderID: number): Promise<void> {
    try {
      await this.payment2C2PService.refundTransaction(payload, pageID, orderID);
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      const failParams = { pageID, orderID, typename: EnumPurchaseOrderSubStatus.REFUND_2C2P_FAILED };
      await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      throw err;
    }
  }
  async onRefundOmise(payload: IOmiseChargeDetail, pageID: number, orderID: number): Promise<void> {
    const responseType = payload.metadata.responseType;
    const creditCard = EnumHandleResponseMessageType.SUBMIT_OMISE_CREDIT_CARD_PAYMENT;
    if (responseType !== creditCard) throw new Error('PAYMENT_TYPE_NOT_SUPPORT_REFUND');
    try {
      await this.paymentOmiseService.refundTransaction(payload, pageID, orderID);
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      const failParams = { pageID, orderID, typename: EnumPurchaseOrderSubStatus.REFUND_OMISE_CREDIT_FAILED };
      await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      throw err;
    }
  }
  async onRefundPaypal(payload: IPaypalPaymentResponse, pageID: number, orderID: number): Promise<void> {
    try {
      await this.paymentPaypalService.refundTransaction(payload, pageID, orderID);
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      const failParams = { pageID, orderID, typename: EnumPurchaseOrderSubStatus.REFUND_PAYPAL_FAILED };
      await this.purchaseOrderFailedService.upsertFailPurchaseOrderStatus(failParams);
      throw err;
    }
  }
}
