import { isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { EnumHandleResponseMessageType, EnumPaymentType, IPayload, IPaypalPaymentResponse, PaypalDetail } from '@reactor-room/itopplus-model-lib';
// import * as checkoutNodeJssdk from '@paypal/checkout-server-sdk';
import axios from 'axios';
import { createTemporaryCourierTracking, setPurchaseOrderToUnpaid, updateOrderRefundHistory, updateRefundedPaymentInfo } from '../../data';
import { findPayment, getPaypalAuthorization, insertPaymentTypePaypal, paypalRefundPost, updatePaymentTypePaypal } from '../../data/payment';
import { AdvanceMessageService } from '../message/advance-message.service';
import { PipelineMessageService } from '../pipeline/pipeline-message.service';
import { PlusmarService } from '../plusmarservice.class';
import { ProductInventoryService } from '../product/product-inventory.service';
import { PurchaseOrderUpdateService } from '../purchase-order/purchase-order-update.service';
import { PurchaseOrderService } from '../purchase-order/purchase-order.service';
import { PaymentService } from './payment.service';
export class PaymentPaypalService {
  public paymentService: PaymentService;
  public productInventoryService: ProductInventoryService;
  public purchaseOrderService: PurchaseOrderService;
  public purchaseOrderUpdateService: PurchaseOrderUpdateService;
  public pipelineMessageService: PipelineMessageService;
  public advanceMessageService: AdvanceMessageService;

  constructor() {
    this.paymentService = new PaymentService();
    this.productInventoryService = new ProductInventoryService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.pipelineMessageService = new PipelineMessageService();
    this.purchaseOrderUpdateService = new PurchaseOrderUpdateService();
    this.advanceMessageService = new AdvanceMessageService();
  }

  updatePaypal = async (payload: IPayload, paypalDetail: PaypalDetail, paypalOauthApi: string): Promise<void> => {
    try {
      await this.validatePaypalAccount(paypalDetail, paypalOauthApi);
      const pageId = payload.pageID;
      const type = EnumPaymentType.PAYPAL;
      const paymentObject = await findPayment(PlusmarService.readerClient, pageId, type);
      if (!isEmpty(paymentObject)) {
        await updatePaymentTypePaypal(PlusmarService.writerClient, pageId, type, paypalDetail);
      } else {
        await insertPaymentTypePaypal(PlusmarService.writerClient, pageId, type, paypalDetail);
      }
    } catch (err) {
      console.log('Update paypal service err: ', err);
      throw new Error(err);
    }
  };

  async validatePaypalAccount(paypalDetail: PaypalDetail, paypalOauthApi: string): Promise<void> {
    await axios.post(
      paypalOauthApi,
      {},
      {
        headers: {
          Accept: 'application/json',
          'Accept-Language': 'en_US',
          'content-type': 'application/x-www-form-urlencoded',
        },
        auth: {
          username: paypalDetail.clientId,
          password: paypalDetail.clientSecret,
        },
        params: {
          grant_type: 'client_credentials',
        },
      },
    );
  }

  refundTransaction = async (payload: IPaypalPaymentResponse, pageID: number, orderID: number): Promise<void> => {
    const payments = await this.paymentService.getPaymentList(pageID);
    const paypalData = payments.find((x) => x.type === EnumPaymentType.PAYPAL);
    const ClientID = paypalData.option.PAYPAL.clientId;
    const ClientSecret = paypalData.option.PAYPAL.clientSecret;
    const basicAuth = Buffer.from(`${ClientID}:${ClientSecret}`).toString('base64');
    const auth = await getPaypalAuthorization(PlusmarService.environment.paypalOauthApi, basicAuth);
    const accessToken = auth.data.access_token;
    const captureID = payload.purchase_units[0].payments.captures[0].id; // get from paymentInfo

    const params = {
      amount: {
        currency_code: payload.purchase_units[0]?.payments?.captures[0]?.amount?.currency_code, // HARDCODE Should implement shop's settings
        value: payload.purchase_units[0]?.payments?.captures[0]?.amount?.value,
      },
    };
    const { data } = await paypalRefundPost(PlusmarService.environment.paypalPaymentApi, accessToken, captureID, params);
    await updateRefundedPaymentInfo(PlusmarService.writerClient, pageID, orderID);
    await setPurchaseOrderToUnpaid(PlusmarService.writerClient, pageID, orderID);
    await updateOrderRefundHistory(PlusmarService.writerClient, JSON.stringify(data), orderID, paypalData.id);
  };

  async onCompletePaypalCheckout(PSID: string, pageID: number, orderID: number, audienceID: number, isAutomode: boolean, subscriptionID: string): Promise<number> {
    await this.productInventoryService.checkActualProductInventory(pageID, orderID, audienceID);
    await this.productInventoryService.subtractProduct(pageID, orderID, audienceID, subscriptionID);

    const CLIENT = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    if (isAutomode) await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, CLIENT);
    await createTemporaryCourierTracking(CLIENT, orderID);

    await this.purchaseOrderUpdateService.updateStepTransaction(pageID, audienceID, subscriptionID, CLIENT); // ? UPDATE TO STEP 4 ON PAYPAL METHOD

    await PostgresHelper.execBatchCommitTransaction(CLIENT);

    await this.purchaseOrderService.publishGetPurchaseOrderSubscription(Number(audienceID), Number(orderID), Number(pageID));
    const messages = await this.advanceMessageService.getOrderAdvanceMessage(pageID, EnumHandleResponseMessageType.SUBMIT_PAYPAL_PAYMENT);
    await this.pipelineMessageService.sendMessagePayload({ pageID: pageID }, messages.title, audienceID);
    await this.pipelineMessageService.sendMessagePayload({ pageID: pageID }, messages.subtitle, audienceID);

    return 200;
  }
}
