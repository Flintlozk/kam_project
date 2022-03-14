import { isAllowCaptureException, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Enum2C2PProcessType, EnumPaymentType, I2C2PPaymentModel, IPayment2C2PResponse, SettingPaymentResponse } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import {
  createTemporaryCourierTracking,
  findPayment,
  getPaymentById,
  getPurchasingOrderByPurchasingOrderID,
  insertPaymentType2C2P,
  requestPaymentAction2C2P,
  setPurchaseOrderToUnpaid,
  updateOrderRefundHistory,
  updatePaymentType2C2P,
  updateRefundedPaymentInfo,
} from '../../data';
import { generatePKCS7, getRefundXML, payment2C2PSignHmacHha256, signHmacSha256 } from '../../domains';
import { Payment2C2PError } from '../../errors';
import { PlusmarService } from '../plusmarservice.class';
import { ProductInventoryService } from '../product/product-inventory.service';
import { PurchaseOrderUpdateService } from '../purchase-order/purchase-order-update.service';
import { PaymentService } from './payment.service';

export class Payment2C2PService {
  public paymentService: PaymentService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public productInventoryService: ProductInventoryService;

  constructor() {
    this.paymentService = new PaymentService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.productInventoryService = new ProductInventoryService();
  }
  updatePayment2C2P = async (pageID: number, paypalDetail: I2C2PPaymentModel): Promise<SettingPaymentResponse> => {
    try {
      const type = EnumPaymentType.PAYMENT_2C2P;
      const paymentObject = await findPayment(PlusmarService.readerClient, pageID, type);
      if (!isEmpty(paymentObject)) {
        return await updatePaymentType2C2P(PlusmarService.writerClient, pageID, type, paypalDetail);
      } else {
        return await insertPaymentType2C2P(PlusmarService.writerClient, pageID, type, paypalDetail);
      }
    } catch (err) {
      throw new Payment2C2PError(err);
    }
  };

  validate2C2PHash = async (paymentRes: IPayment2C2PResponse): Promise<void> => {
    try {
      const purchaseOrderID = parseInt(paymentRes.order_id.replace(/^0+/, '').replace(/[^0-9]+/g, ''));
      const purchaseOrder = await getPurchasingOrderByPurchasingOrderID(PlusmarService.readerClient, purchaseOrderID);
      const payment = await getPaymentById(PlusmarService.readerClient, purchaseOrder.page_id, purchaseOrder.payment_id);
      if (!payment || !payment.option.secretKey) throw new Payment2C2PError('INVALID_PAYMENT_RESPONSE');
      const result = payment2C2PSignHmacHha256(paymentRes, payment.option.secretKey);
      if (result !== paymentRes.hash_value.toLowerCase()) new Payment2C2PError('INVALID_PAYMENT_RESPONSE');
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  };

  refundTransaction = async (payload: IPayment2C2PResponse, pageID: number, orderID: number): Promise<void> => {
    const payments = await this.paymentService.getPaymentList(pageID);
    const payment2C2P = payments.find((x) => x.type === EnumPaymentType.PAYMENT_2C2P);
    const version = PlusmarService.environment.PAYMENT_2C2P_VERSION;
    const merchantID = payment2C2P.option.PAYMENT_2C2P.merchantID;
    const processType = Enum2C2PProcessType.REFUND;
    const invoiceNo = payload.order_id; // Invoice No / order ID
    const actionAmount = payload.amount;
    const rawData = `${version}${merchantID}${processType}${invoiceNo}${actionAmount}`;
    const hashValue = signHmacSha256(rawData, payment2C2P.option.PAYMENT_2C2P.secretKey);
    const jsonPayload = {
      version,
      merchantID,
      processType,
      invoiceNo,
      actionAmount,
      hashValue,
    };
    const xml = getRefundXML(jsonPayload);
    const encyptedValue = generatePKCS7(xml);
    const response = await requestPaymentAction2C2P(PlusmarService.environment.PAYMENT_2C2P_PAYMENT_ACTION, { paymentRequest: encyptedValue });
    await updateRefundedPaymentInfo(PlusmarService.writerClient, pageID, orderID);
    await setPurchaseOrderToUnpaid(PlusmarService.writerClient, pageID, orderID);
    await updateOrderRefundHistory(PlusmarService.writerClient, JSON.stringify(response), orderID, payment2C2P.id);
  };

  async onComplete2C2PCheckout(PSID: string, pageID: number, orderID: number, audienceID: number, isAutomode: boolean, subscriptionID: string): Promise<void> {
    await this.productInventoryService.checkActualProductInventory(pageID, orderID, audienceID);
    await this.productInventoryService.subtractProduct(pageID, orderID, audienceID, subscriptionID);
    const CLIENT = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    if (isAutomode) await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, CLIENT);
    await createTemporaryCourierTracking(CLIENT, orderID);
    await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, CLIENT);
    await PostgresHelper.execBatchCommitTransaction(CLIENT);
  }
}
