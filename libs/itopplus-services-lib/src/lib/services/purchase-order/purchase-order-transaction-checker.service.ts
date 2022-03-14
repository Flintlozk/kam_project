import { genericRecursive, getRedisOnRecursive, getUTCDayjs, isAllowCaptureException, onWaitFor, setRedisOnRecursive } from '@reactor-room/itopplus-back-end-helpers';
import {
  Enum2C2PPaymentStatusResponseCode,
  EnumOmiseSourceType,
  EnumPaymentOmiseError,
  IOmiseChargeDetail,
  IOmiseInitTransaction,
  IPayment2C2PResponse,
  IPaypalOrderModel,
  PurchaseOrderPostbackMessage,
  ReceiptDetail,
  TransactionCheckerBody,
  WebhookQueries,
} from '@reactor-room/itopplus-model-lib';
import { EnumHandleResponseMessageType, EnumPaymentType, EnumPurchasingPayloadType } from '@reactor-room/itopplus-model-lib';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { creatOmiseCreditCardCharge, creatOmiseInternetBankingCharge, getOmiseSourceDetails, getSubscriptionByPageID, updateOrderPaymentInfo } from '../../data';
import { calculateOrderAndShippingCost, checkOrigin, create2C2POrderID, signHmacSha256 } from '../../domains';
import { PaymentOmiseError } from '../../errors';
import { Payment2C2PService, PaymentOmiseService, PaymentService } from '../payment';
import { PipelineService } from '../pipeline';
import { PlusmarService } from '../plusmarservice.class';
import { ProductInventoryService } from '../product/product-inventory.service';
import { PurchaseOrderReceiptService } from './purchase-order-receipt.service';
import { PurchaseOrderService } from './purchase-order.service';
import * as Sentry from '@sentry/node';
import { GenericRecursiveMessageType, EnumGenericRecursiveStatus } from '@reactor-room/model-lib';
import { AuthService } from '../auth/auth.service';
import { OmiseConfirmPaymentService } from './confirm-payment/omise-confirm-payment.service';
export class PurchaseOrderTransactionCheckerService {
  public payment2C2PService: Payment2C2PService;
  public purchaseOrderReceiptService: PurchaseOrderReceiptService;
  public purchaseOrderService: PurchaseOrderService;
  public paymentService: PaymentService;
  public productInventoryService: ProductInventoryService;
  public pipelineService: PipelineService;
  public paymentOmiseService: PaymentOmiseService;
  public authService: AuthService;
  public omiseConfirmPaymentService: OmiseConfirmPaymentService;
  constructor() {
    this.payment2C2PService = new Payment2C2PService();
    this.purchaseOrderReceiptService = new PurchaseOrderReceiptService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.paymentService = new PaymentService();
    this.productInventoryService = new ProductInventoryService();
    this.pipelineService = new PipelineService();
    this.paymentOmiseService = new PaymentOmiseService();
    this.authService = new AuthService();
    this.omiseConfirmPaymentService = new OmiseConfirmPaymentService();
  }

  async handlePaypalCheckInitiator(req: Request, res: Response): Promise<void> {
    try {
      checkOrigin(PlusmarService.environment.backendUrl, req.headers as IncomingHttpHeaders);
      const validType = [EnumPurchasingPayloadType.GET_PAYPAL_INFO];
      const { type } = req.body as TransactionCheckerBody;
      const { auth } = new Object(req.query) as PurchaseOrderPostbackMessage;
      const { audienceID, pageID } = await this.authService.getCredentialFromToken(auth);

      const pipeline = await this.pipelineService.getPipelineOnHandleTemplate(type, pageID, Number(audienceID));

      const purchaseOrder = await this.purchaseOrderService.getPurchasingOrderById(pageID, pipeline.order_id);
      const receipt = (await this.purchaseOrderReceiptService.getReceiptDeatil(pageID, pipeline, audienceID)) as ReceiptDetail;

      if (validType.includes(type)) {
        const totalPrice = calculateOrderAndShippingCost(receipt, Number(purchaseOrder.total_price));
        const customId = `CUSTOM_ORDER_ID_${receipt.orderId}`;
        const currency = receipt.shopDetail.currency;

        const paypalObject = {
          description: `Shop: ${receipt.shopDetail.name}`,
          custom_id: customId,
          amount: {
            value: totalPrice,
            currency_code: currency,
          },
          // shipping: {},
        } as IPaypalOrderModel;

        // ! Dont remove this
        // if ('address' in receipt.customerDetail.location) {
        //   paypalObject.shipping = {
        //     method: 'More-Commerce, Inc. Powered by ITOPPLUS',
        //     address: {
        //       name: {
        //         full_name: receipt.customerDetail.name,
        //       },
        //       address_line_1: receipt.customerDetail.location.address,
        //       address_line_2: receipt.customerDetail.location.amphoe,
        //       admin_area_1: receipt.customerDetail.location.district,
        //       admin_area_2: receipt.customerDetail.location.province,
        //       postal_code: receipt.customerDetail.location.post_code,
        //       country_code: 'TH',
        //     },
        //   };
        // }else{
        //   paypalObject.shipping = {
        //     method: 'More-Commerce, Inc. Powered by ITOPPLUS',
        //     address: {
        //       name: {
        //         full_name: receipt.customerDetail.name,
        //       },
        //       address_line_1: receipt.customerDetail.location.address,
        //       address_line_2: receipt.customerDetail.location.amphoe,
        //       admin_area_1: receipt.customerDetail.location.district,
        //       admin_area_2: receipt.customerDetail.location.province,
        //       postal_code: receipt.customerDetail.location.post_code,
        //       country_code: 'TH',
        //     },
        //   };
        // }

        res.set('Content-Type', 'application/json');
        res.send(JSON.stringify(paypalObject));
      } else {
        console.log('THIS ERROR');
        res.sendStatus(500);
      }
    } catch (err) {
      res.sendStatus(500);
    }
  }

  async handle2C2PInitiator(req: Request, res: Response): Promise<void> {
    const { auth } = new Object(req.query) as WebhookQueries;
    const { psid, type } = new Object(req.body) as TransactionCheckerBody;
    const { audienceID, pageID } = await this.authService.getCredentialFromToken(auth);

    const pipeline = await this.pipelineService.getPipelineOnHandleTemplate(type, pageID, Number(audienceID));

    const payments = await this.paymentService.getPaymentList(pipeline.page_id);
    const payment2C2P = payments.find((x) => x.type === EnumPaymentType.PAYMENT_2C2P);

    const purchaseOrder = await this.purchaseOrderService.getPurchasingOrderById(pipeline.page_id, pipeline.order_id);
    const receipt = (await this.purchaseOrderReceiptService.getReceiptDeatil(pipeline.page_id, pipeline, pipeline.audience_id)) as ReceiptDetail;
    const totalPrice = calculateOrderAndShippingCost(receipt, Number(purchaseOrder.total_price));
    const currency = receipt.shopDetail.currency;

    let currency_code = 764;
    if (currency === 'THB (฿) Baht') currency_code = 764;

    const url = PlusmarService.environment.webViewUrl;
    const price = totalPrice.toFixed(2).replace('.', '').padStart(12, '0');
    const paymentOption = 'C'; // Credit Card
    const returnUrl = `${url}/2c2p-payment-redirect?audienceId=${pipeline.audience_id}&psid=${psid}&auth=${auth}`; //result_url_1
    // eslint-disable-next-line max-len
    const postbackUrl = `${url}/2c2p-payment?response_type=${EnumHandleResponseMessageType.SUBMIT_2C2P_PAYMENT}&audienceId=${pipeline.audience_id}&psid=${psid}&auth=${auth}`; //result_url_2
    const description = purchaseOrder.description ? purchaseOrder.description : 'Order from more-comerce';
    const orderID = create2C2POrderID(purchaseOrder.id);
    // eslint-disable-next-line max-len
    const rawData = `${PlusmarService.environment.PAYMENT_2C2P_VERSION}${payment2C2P.option.PAYMENT_2C2P.merchantID}${description}${orderID}${currency_code}${price}${returnUrl}${postbackUrl}${PlusmarService.environment.PAYMENT_2C2P_REQUEST_3DS}${paymentOption}`;
    const result = signHmacSha256(rawData, payment2C2P.option.PAYMENT_2C2P.secretKey);
    const payload = {
      version: PlusmarService.environment.PAYMENT_2C2P_VERSION,
      merchantID: payment2C2P.option.PAYMENT_2C2P.merchantID,
      payment_description: description,
      order_id: orderID,
      currency: currency_code,
      amount: price,
      result_url_1: returnUrl,
      result_url_2: postbackUrl,
      request_3ds: PlusmarService.environment.PAYMENT_2C2P_REQUEST_3DS,
      payment_option: paymentOption,
      hash_value: result.toUpperCase(),
    };

    setRedisOnRecursive(PlusmarService.redisClient, `2C2P_${purchaseOrder.id}`, {
      unqiueKey: purchaseOrder.id,
      createAt: getUTCDayjs().toDate(),
      messageStatus: EnumGenericRecursiveStatus.PENDING,
      messageType: GenericRecursiveMessageType.PAYMENT_2C2P,
    });

    res.set('Content-Type', 'application/json');
    res.send(JSON.stringify(payload));
  }

  async handle2C2PRedirect(req: Request): Promise<string> {
    const { auth, audienceId, psid } = new Object(req.query) as WebhookQueries;
    const { pageID, audienceID } = await this.authService.getCredentialFromToken(auth);
    const { order_id: orderID, payment_id: paymentID } = await this.pipelineService.getPipelineOnPostbackMessage(
      EnumHandleResponseMessageType.REDIRECT_2C2P_PAYMENT,
      pageID,
      audienceID,
    );
    const response = new Object(req.body) as IPayment2C2PResponse;
    await this.payment2C2PService.validate2C2PHash(response);
    const redirectUrl = `${PlusmarService.environment.webViewUrl}/purchase-redirect?auth=${auth}&audienceId=${audienceId}&psid=${psid}&type=`;
    const paymentStatus = response.payment_status;
    const ENUM = EnumPurchasingPayloadType;

    switch (paymentStatus) {
      case Enum2C2PPaymentStatusResponseCode.SUCCESSFUL:
        await updateOrderPaymentInfo(PlusmarService.writerClient, JSON.stringify(response), response.order_id, orderID, paymentID);
        return `${redirectUrl}${ENUM.SUBMIT_2C2P_PAYMENT_SUCCESS}`;
      case Enum2C2PPaymentStatusResponseCode.PENDING:
        return `${redirectUrl}${ENUM.SUBMIT_2C2P_PAYMENT_PENDING}`;
      case Enum2C2PPaymentStatusResponseCode.REJECTED:
        return `${redirectUrl}${ENUM.SUBMIT_2C2P_PAYMENT_REJECTED}`;
      case Enum2C2PPaymentStatusResponseCode.CANCELED:
        return `${redirectUrl}${ENUM.SUBMIT_2C2P_PAYMENT_CANCELED}`;
      default:
        return `${redirectUrl}${ENUM.SUBMIT_2C2P_PAYMENT_FAIL}`;
    }
  }

  async handleOmiseInitiator(req: Request, res: Response): Promise<void> {
    try {
      const paymentDetail = req.body as IOmiseInitTransaction;
      const { auth } = new Object(req.query) as WebhookQueries;
      const { audienceID, pageID, subscriptionID } = await this.authService.getCredentialFromToken(auth);
      const { order_id: orderID } = await this.pipelineService.getPipelineOnPostbackMessage(EnumHandleResponseMessageType.SUBMIT_OMISE_PAYMENT, pageID, audienceID);
      setRedisOnRecursive(PlusmarService.redisClient, `OMISE_${orderID.toString()}`, {
        unqiueKey: orderID,
        createAt: getUTCDayjs().toDate(),
        messageStatus: EnumGenericRecursiveStatus.PENDING,
        messageType: GenericRecursiveMessageType.OMISE,
      });
      const reponseType = paymentDetail.responseType;
      switch (reponseType) {
        case EnumHandleResponseMessageType.SUBMIT_OMISE_PROMTPAY_PAYMENT:
          await this.handleOmisePromptPay(req, res, audienceID, pageID, subscriptionID);
          break;
        case EnumHandleResponseMessageType.SUBMIT_OMISE_CREDIT_CARD_PAYMENT:
          await this.handleOmiseCreditCard(req, res, audienceID, pageID);
          break;
        case EnumHandleResponseMessageType.SUBMIT_OMISE_INTERNET_BANKING:
          await this.handleOmiseInternetBanking(req, res, audienceID, pageID);
          break;

        default:
          res.status(500);
          res.send(
            JSON.stringify({
              status: 'failed',
              failure_message: 'RESPONSE_TYPE_NOT_FOUND',
            } as IOmiseChargeDetail),
          );
          break;
      }
    } catch (err) {
      console.log('err: handleOmiseInitiator', err);
      res.status(500);
      res.send(
        JSON.stringify({
          status: 'failed',
          failure_message: err.message,
        } as IOmiseChargeDetail),
      );
    }
  }

  async handleOmisePromptPay(req: Request, res: Response, audienceID: number, pageID: number, subscriptionID: string): Promise<void> {
    try {
      const paymentDetail = req.body as IOmiseInitTransaction;
      const pipeline = await this.pipelineService.getPipelineOnHandleTemplate(paymentDetail.type, pageID, Number(audienceID));
      const payments = await this.paymentService.getPaymentList(pipeline.page_id);
      const paymentOmise = payments.find((x) => x.type === EnumPaymentType.OMISE);
      const purchaseOrder = await this.purchaseOrderService.getPurchasingOrderById(pipeline.page_id, pipeline.order_id);
      const receipt = (await this.purchaseOrderReceiptService.getReceiptDeatil(pipeline.page_id, pipeline, pipeline.audience_id)) as ReceiptDetail;
      const totalPrice = calculateOrderAndShippingCost(receipt, Number(purchaseOrder.total_price));
      const currency = receipt.shopDetail.currency;
      let currencyCode = 'THB';
      if (currency === 'THB (฿) Baht') currencyCode = 'THB';
      const omiseCharge = await this.paymentOmiseService.getOmiseCharge(pipeline, paymentOmise, paymentDetail, totalPrice, currencyCode, pageID, subscriptionID);
      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(omiseCharge.source.scannable_code.image));
    } catch (err) {
      console.log('err: handleOmiseInitiator', err);
      throw err;
    }
  }

  async handleOmiseCreditCard(req: Request, res: Response, audienceID: number, pageID: number): Promise<void> {
    try {
      const paymentDetail = req.body as IOmiseInitTransaction;
      if (!paymentDetail.token) throw new PaymentOmiseError(EnumPaymentOmiseError.NO_TOKEN);
      const pipeline = await this.pipelineService.getPipelineOnHandleTemplate(paymentDetail.type, pageID, Number(audienceID));
      const payments = await this.paymentService.getPaymentList(pipeline.page_id);
      const paymentOmise = payments.find((x) => x.type === EnumPaymentType.OMISE);

      const purchaseOrder = await this.purchaseOrderService.getPurchasingOrderById(pipeline.page_id, pipeline.order_id);
      const receipt = (await this.purchaseOrderReceiptService.getReceiptDeatil(pipeline.page_id, pipeline, pipeline.audience_id)) as ReceiptDetail;
      const totalPrice = calculateOrderAndShippingCost(receipt, Number(purchaseOrder.total_price));
      const currency = receipt.shopDetail.currency;

      let currencyCode = 'THB';
      if (currency === 'THB (฿) Baht') currencyCode = 'THB';

      const createOmiseChargeInput = {
        audienceID: paymentDetail.audienceId,
        poID: pipeline.order_id,
        psid: paymentDetail.psid,
        responseType: paymentDetail.responseType,
        amount: totalPrice * 100,
        source: EnumOmiseSourceType.CREDIT_CARD,
        currency: currencyCode,
      };

      const chargeResult = await creatOmiseCreditCardCharge(createOmiseChargeInput, paymentDetail.token, paymentOmise.option.OMISE.secretKey);
      if (chargeResult.status === 'successful') {
        if (chargeResult.paid === true) {
          await this.omiseConfirmPaymentService.onCompleteOmisePayment(chargeResult);
          res.status(200);
          res.send(JSON.stringify(chargeResult));
        } else {
          // FAILED OR SUCESS -> REDIS
          const checkoutComplete = await this.omiseCheckChargeRecursive(pipeline.order_id);
          if (checkoutComplete) {
            res.status(200);
            res.send(JSON.stringify(chargeResult));
          } else {
            res.status(200);
            const { messageDetail } = await getRedisOnRecursive(PlusmarService.redisClient, `OMISE_${pipeline.order_id}`);
            res.send(
              JSON.stringify({
                status: 'failed',
                failure_message: messageDetail,
              } as IOmiseChargeDetail),
            );
          }
        }
      } else {
        res.status(200);
        res.send(JSON.stringify(chargeResult));
      }
    } catch (err) {
      // UPSERT_ FAILED
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      res.status(200);
      res.send(
        JSON.stringify({
          status: 'failed',
          failure_message: err.message,
        } as IOmiseChargeDetail),
      );
      throw err;
    }
  }

  async omiseCheckChargeRecursive(orderID: number): Promise<boolean> {
    const redisKey = `OMISE_${orderID}`;
    const timerSec = PlusmarService.environment.cronJobConfig.redirectOmiseRepeatTimer;
    const maxRetry = PlusmarService.environment.cronJobConfig.redirectOmiseMaxRetry;
    const result = await genericRecursive(PlusmarService.redisClient, redisKey, timerSec, maxRetry);
    return result === EnumGenericRecursiveStatus.SUCCESS;
  }

  async handleOmiseInternetBanking(req: Request, res: Response, audienceID: number, pageID: number): Promise<void> {
    try {
      const paymentDetail = req.body as IOmiseInitTransaction;
      if (!paymentDetail.source) throw new PaymentOmiseError(EnumPaymentOmiseError.NO_SOURCE);
      const pipeline = await this.pipelineService.getPipelineOnHandleTemplate(paymentDetail.type, pageID, Number(audienceID));
      const payments = await this.paymentService.getPaymentList(pipeline.page_id);
      const paymentOmise = payments.find((x) => x.type === EnumPaymentType.OMISE);

      const purchaseOrder = await this.purchaseOrderService.getPurchasingOrderById(pipeline.page_id, pipeline.order_id);
      const receipt = (await this.purchaseOrderReceiptService.getReceiptDeatil(pipeline.page_id, pipeline, pipeline.audience_id)) as ReceiptDetail;
      const totalPrice = calculateOrderAndShippingCost(receipt, Number(purchaseOrder.total_price));
      const currency = receipt.shopDetail.currency;

      let currencyCode = 'THB';
      if (currency === 'THB (฿) Baht') currencyCode = 'THB';

      await getOmiseSourceDetails(paymentDetail.source, paymentOmise.option.OMISE.secretKey);

      const enumOmiseSourceType = EnumOmiseSourceType;
      const createOmiseChargeInput = {
        audienceID: paymentDetail.audienceId,
        poID: pipeline.order_id,
        psid: paymentDetail.psid,
        responseType: paymentDetail.responseType,
        amount: totalPrice * 100,
        source: enumOmiseSourceType[paymentDetail.type],
        currency: currencyCode,
      };
      const { auth } = new Object(req.query) as WebhookQueries;
      const url = PlusmarService.environment.webViewUrl;
      const returnUrl = `${url}/omise-payment-redirect?audienceId=${pipeline.audience_id}&psid=${pipeline.psid}&auth=${auth}`; //result_url_1
      const omiseCharge = await creatOmiseInternetBankingCharge(createOmiseChargeInput, paymentDetail.source, returnUrl, paymentOmise.option.OMISE.secretKey);

      res.set('Content-Type', 'application/json');
      res.send(JSON.stringify(omiseCharge.authorize_uri));
    } catch (err) {
      console.log('err: handleOmiseInitiator', err);
      throw err;
    }
  }

  async handleOmiseInternetBankingRedirect(req: Request): Promise<string> {
    const { auth, psid } = new Object(req.query) as WebhookQueries;
    const { pageID, audienceID } = await this.authService.getCredentialFromToken(auth);
    const { order_id: orderID } = await this.pipelineService.getPipelineOnPostbackMessage(EnumHandleResponseMessageType.CHECK_PURCHASE_ORDER_STATUS, pageID, audienceID);
    const redirectUrl = `${PlusmarService.environment.webViewUrl}/purchase-omise-redirect?auth=${auth}&audienceId=${audienceID}&psid=${psid}&type=`;
    const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, orderID.toString());

    const ENUM = EnumPurchasingPayloadType;
    const EnumMessageStatus = EnumGenericRecursiveStatus;

    switch (paymentRedis.messageStatus) {
      case EnumMessageStatus.SUCCESS:
        return `${redirectUrl}${ENUM.SUBMIT_OMISE_PAYMENT_SUCCESS}`;
      case EnumMessageStatus.FAILED:
        return `${redirectUrl}${ENUM.SUBMIT_OMISE_PAYMENT_FAILED}`;
      case EnumMessageStatus.PENDING:
        return `${redirectUrl}${ENUM.SUBMIT_OMISE_PAYMENT_PENDING}`;
      default:
        return `${redirectUrl}${ENUM.SUBMIT_OMISE_PAYMENT_FAILED}`;
    }
  }
}
