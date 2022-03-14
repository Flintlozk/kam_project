import { genericRecursive, getRedisOnRecursive, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, EnumGenericRecursiveStatus } from '@reactor-room/model-lib';
import {
  AudienceContactActionMethod,
  AudienceViewType,
  EnumHandleResponseMessageType,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  EnumPurchasingPayloadType,
  IOmiseOrderInfo,
  IPayment2C2PResponse,
  IPipelinePaypalApproveData,
  IPipelineStep2SettingProductList,
  IPurchaseOrderPostbackAddItemToCartCatalog,
  IPurchaseOrderPostbackAddProductViaShareLink,
  IPurchaseOrderPostbackMessageAddress,
  IPurchaseOrderPostbackSelectLogistic,
  IPurchaseOrderPostbackSelectPayment,
  POMessageConfirmOrder,
  PurchaseOrderPostbackMessage,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Request, Response } from 'express';
import { IncomingHttpHeaders } from 'http';
import { getAudienceByIDOnly, getPageByID, getPurchasingOrderById, getPurchasingOrderItems } from '../../data';
import { checkOrderDetail, checkOrigin } from '../../domains';
import { PipelineOnHandlePostbackMessagesError } from '../../errors';
import { AudienceContactService, AudienceService } from '../audience';
import { AudienceStepService } from '../audience-step/audience-step.service';
import { AuthService } from '../auth';
import { CustomerService } from '../customer/customer.service';
import { JAndTExpressService } from '../j&t-express';
import { PaymentOmiseService } from '../payment';
import { PaymentService } from '../payment/payment.service';
import { PipelineMessageService, PipelineOrderMessageService, PipelineService } from '../pipeline';
import { PlusmarService } from '../plusmarservice.class';
import { ProductService } from '../product';
import { ProductInventoryService } from '../product/product-inventory.service';
import { Payment2C2PConfirmPaymentService } from './confirm-payment/2c2p-confirm-payment.service';
import { CommonConfirmPaymentService } from './confirm-payment/common-confirm-payment.service';
import { PaypalConfirmPaymentService } from './confirm-payment/paypal-confirm-payment.service';
import { PurchaseOrderPipelineService } from './purchase-order-pipeline.service';
import { PurchaseOrderService } from './purchase-order.service';

export class PurchaseOrderPostbackMessageService {
  public purchaseOrderService: PurchaseOrderService;
  public productInventoryService: ProductInventoryService;
  public purchaseOrderPipelineService: PurchaseOrderPipelineService;
  public pipelineMessageService: PipelineMessageService;
  public audienceStepService: AudienceStepService;
  public pipelineService: PipelineService;
  public paymentService: PaymentService;
  public paymentOmiseService: PaymentOmiseService;
  public audienceService: AudienceService;
  public audienceContactService: AudienceContactService;
  public productService: ProductService;
  public commonConfirmPaymentService: CommonConfirmPaymentService;
  public paypalConfirmPaymentService: PaypalConfirmPaymentService;
  public payment2C2PConfirmPaymentService: Payment2C2PConfirmPaymentService;
  public customerService: CustomerService;
  public jAndTExpressService: JAndTExpressService;
  public pipelineOrderMessageService: PipelineOrderMessageService;
  public authService: AuthService;

  constructor() {
    this.purchaseOrderService = new PurchaseOrderService();
    this.productInventoryService = new ProductInventoryService();
    this.pipelineService = new PipelineService();
    this.purchaseOrderPipelineService = new PurchaseOrderPipelineService();
    this.pipelineMessageService = new PipelineMessageService();
    this.audienceStepService = new AudienceStepService();
    this.paymentService = new PaymentService();
    this.audienceService = new AudienceService();
    this.audienceContactService = new AudienceContactService();
    this.productService = new ProductService();
    this.commonConfirmPaymentService = new CommonConfirmPaymentService();
    this.paypalConfirmPaymentService = new PaypalConfirmPaymentService();
    this.payment2C2PConfirmPaymentService = new Payment2C2PConfirmPaymentService();
    this.jAndTExpressService = new JAndTExpressService();
    this.customerService = new CustomerService();
    this.pipelineOrderMessageService = new PipelineOrderMessageService();
    this.authService = new AuthService();
    this.paymentOmiseService = new PaymentOmiseService();
  }

  handlePostbackMessages = async (req: Request, res: Response): Promise<void> => {
    try {
      checkOrigin(PlusmarService.environment.backendUrl, req.headers as IncomingHttpHeaders);
      const params = new Object(req.query) as PurchaseOrderPostbackMessage;

      const credential = await this.authService.getCredentialFromToken(params.auth);
      const { response_type, view } = params; // view this is a must have value
      const { pageID, audienceID, subscriptionID } = credential;

      // console.log('-------------------------------------------------------------- handlePostbackMessages:', response_type);

      switch (response_type) {
        case EnumHandleResponseMessageType.ADD_ITEM_TO_CART: {
          await this.onAddItemToCart(params, response_type, pageID, audienceID, subscriptionID);
          break;
        }
        case EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK: {
          const { variant, quantity } = new Object(req.body) as IPurchaseOrderPostbackAddProductViaShareLink;
          const audience = await getAudienceByIDOnly(PlusmarService.readerClient, audienceID);
          try {
            await this.onAddProductViaShareLink(params.psid, { variant, quantity }, response_type, audienceID, audience.page_id, audience.platform, subscriptionID);
            res.sendStatus(200);
          } catch (error) {
            // TODO : Readable message about product exception only
            const errMessage = error?.message;
            await this.sendProductNotAddedMsgToCustomer(audience.page_id, audience.id, errMessage);
            res.sendStatus(500);
          }
          break;
        }
        case EnumHandleResponseMessageType.ADD_ITEM_TO_CART_CATALOG: {
          const payload = new Object(req.body) as IPurchaseOrderPostbackAddItemToCartCatalog[];
          const audience = await getAudienceByIDOnly(PlusmarService.readerClient, audienceID);
          try {
            await this.onAddProductCatalogToCart(params.psid, payload, response_type, audienceID, audience.page_id, audience.platform, subscriptionID);
            res.sendStatus(200);
          } catch (error) {
            // TODO : Readable message about product exception only
            const errMessage = error?.message;
            await this.sendProductNotAddedMsgToCustomer(audience.page_id, audience.id, errMessage);
            res.sendStatus(500);
          }
          break;
        }

        // __________________________________________________________________________________PIPELINE STEP 1 & 2
        case EnumHandleResponseMessageType.SELECT_LOGISTIC_METHOD: {
          const { logisticID } = new Object(req.body) as IPurchaseOrderPostbackSelectLogistic;
          const status = await this.onSelectLogisticMethod(response_type, pageID, audienceID, Number(logisticID));
          status ? res.sendStatus(200) : res.sendStatus(500);
          break;
        }
        case EnumHandleResponseMessageType.SELECT_PAYMENT_METHOD: {
          const { paymentType } = new Object(req.body) as IPurchaseOrderPostbackSelectPayment;
          const status = await this.onSelectPaymentMethod(response_type, pageID, audienceID, paymentType);
          status ? res.sendStatus(200) : res.sendStatus(500);
          break;
        }
        case EnumHandleResponseMessageType.UPDATE_DELIVERY_ADDRESS: {
          const address = new Object(req.body) as IPurchaseOrderPostbackMessageAddress;
          const status = await this.onUpdateDeliveryAddress(response_type, pageID, audienceID, address);
          status ? res.sendStatus(200) : res.sendStatus(500);
          break;
        }
        case EnumHandleResponseMessageType.CHECK_PRODUCT_SUFFICIENT: {
          const status = await this.commonConfirmPaymentService.onCheckProductSufficient(response_type, pageID, audienceID);
          status ? res.sendStatus(200) : res.sendStatus(500);
          break;
        }
        case EnumHandleResponseMessageType.GET_PRODUCT_IN_CART: {
          const products = await this.onGetProductInCart(response_type, pageID, audienceID);
          res.send(JSON.stringify(products));
          break;
        }
        case EnumHandleResponseMessageType.VERIFY_ORDER_CONTEXT: {
          const status = await this.commonConfirmPaymentService.onVerifyOrderContext(response_type, pageID, audienceID, params.hash);
          status ? res.sendStatus(200) : res.sendStatus(500);
          break;
        }
        case EnumHandleResponseMessageType.CONFIRM_PAYMENT_SELECTION: {
          const status = await this.commonConfirmPaymentService.onConfirmPaymentSelection(response_type, pageID, audienceID, subscriptionID);
          status ? res.sendStatus(200) : res.sendStatus(500);
          break;
        }

        case EnumHandleResponseMessageType.SUBMIT_PAYPAL_PAYMENT_APPROVE: {
          const body = new Object(req.body) as IPipelinePaypalApproveData;
          const responseStatus = await this.paypalConfirmPaymentService.onApprovePaypalPayment(params, body, response_type, pageID, audienceID, subscriptionID);
          res.sendStatus(responseStatus);
          break;
        }

        case EnumHandleResponseMessageType.SUBMIT_PAYPAL_PAYMENT_CANCEL:
        case EnumHandleResponseMessageType.SUBMIT_PAYPAL_PAYMENT_ERROR: {
          res.sendStatus(500);
          break;
        }

        case EnumHandleResponseMessageType.SUBMIT_2C2P_PAYMENT: {
          const body = new Object(req.body) as IPayment2C2PResponse;
          const isComplete = await this.payment2C2PConfirmPaymentService.onComplete2C2PPayment(params, body, response_type, pageID, audienceID, subscriptionID);
          if (isComplete) {
            res.sendStatus(200);
          } else {
            res.sendStatus(500);
          }
          break;
        }
        case EnumHandleResponseMessageType.INTERVAL_CHECK_PURCHASE_ORDER_STATUS: {
          const result = await this.intervalCheckPurchaseOrderStatus(params.psid, response_type, pageID, audienceID);
          res.send(JSON.stringify(result));
          break;
        }

        case EnumHandleResponseMessageType.CHECK_PURCHASE_ORDER_STATUS: {
          const result = await this.checkPurchaseOrderStatus(response_type, pageID, audienceID);
          res.send(JSON.stringify(result));
          break;
        }

        case EnumHandleResponseMessageType.GET_OMISE_ORDER_INFO: {
          const purchaseOrder = await this.getPurchaseOrderInfo(response_type, pageID, audienceID);
          res.send(purchaseOrder);
          break;
        }

        default:
          res.sendStatus(500);
          break;
      }
    } catch (err) {
      const error = new PipelineOnHandlePostbackMessagesError(err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      res.sendStatus(500);
    }
  };

  async onGetProductInCart(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number): Promise<IPipelineStep2SettingProductList[]> {
    try {
      const { order_id } = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceID);
      const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, order_id);

      const productList: IPipelineStep2SettingProductList[] = products.map((item) => {
        return {
          unitPrice: `฿${item.unitPrice}`,
          variantId: item.variantId,
          productId: item.productId,
          quantity: item.quantity,
          productName: item.productName,
          images: item.images.map((item) => item.mediaLink),
          attributes: item.attributes,
        };
      });
      return productList;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      console.log('onUpdateDeliveryAddress err ::::::::::>>> ', err);
      throw err;
    }
  }

  async onUpdateDeliveryAddress(eventType: EnumHandleResponseMessageType, pageID: number, audienceID: number, address: IPurchaseOrderPostbackMessageAddress): Promise<boolean> {
    try {
      const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceID);
      return await this.purchaseOrderService.checkAddressDetail(pipeline, address, pageID, audienceID);
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      console.log('onUpdateDeliveryAddress err ::::::::::>>> ', err);
      return false;
    }
  }

  async onAddItemToCart(params: PurchaseOrderPostbackMessage, eventType: EnumHandleResponseMessageType, pageID: number, audienceId: number, subscriptionID: string): Promise<void> {
    // eslint-disable-next-line no-useless-catch
    try {
      // TODO : Disable add to cart on step further than 2
      const val = params as POMessageConfirmOrder;
      const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceId);
      const audience = await getAudienceByIDOnly(PlusmarService.readerClient, audienceId);
      await this.purchaseOrderPipelineService.addProductToCart(pipeline, val);

      if (pipeline.pipeline === EnumPurchaseOrderStatus.FOLLOW) {
        await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.CONFIRM_ORDER, audience.platform, subscriptionID);
      }

      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(audienceId, Number(pipeline.order_id), Number(pipeline.page_id));
    } catch (err) {
      throw err;
    }
  }

  async onAddProductViaShareLink(
    PSID: string,
    params: IPurchaseOrderPostbackAddProductViaShareLink,
    eventType: EnumHandleResponseMessageType,
    audienceId: number,
    pageID: number,
    platform: AudiencePlatformType,
    subscriptionID: string,
  ): Promise<void> {
    await this.productInventoryService.isProductVariantAvailable(pageID, +params.variant, +params.quantity); // Check Page Stock
    const audienceID = Number(audienceId);

    const pipeline = await this.purchaseOrderPipelineService.addProductToCartFromShareLink(audienceID, pageID, PSID, params);
    await this.productInventoryService.checkProductInCart(pipeline, +params.variant, +params.quantity);

    if (pipeline.pipeline === EnumPurchaseOrderStatus.FOLLOW || pipeline.pipeline === EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT) {
      // await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.SEND_RECEIPT, platform); // ! PREPARE TO DELETE
      await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.CONFIRM_ORDER, platform, subscriptionID);
    }

    await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, pageID, {
      method: AudienceContactActionMethod.MOVE_TO_ORDER,
      audienceID: +audienceId,
      customerID: pipeline.customer_id,
    });

    await this.purchaseOrderService.publishGetPurchaseOrderSubscription(audienceId, Number(pipeline.order_id), Number(pipeline.page_id));
  }

  async onAddProductCatalogToCart(
    PSID: string,
    payload: IPurchaseOrderPostbackAddItemToCartCatalog[],
    response_type: EnumHandleResponseMessageType,
    audienceId: number,
    pageID: number,
    platform: AudiencePlatformType,
    subscriptionID: string,
  ): Promise<void> {
    for (let index = 0; index < payload.length; index++) {
      const params = payload[index];
      await this.productInventoryService.isProductVariantAvailable(pageID, +params.variantID, +params.quantity); // Check Page Stock
    }
    const audienceID = Number(audienceId);

    const pipeline = await this.purchaseOrderPipelineService.addProductToCartFromCatalog(audienceID, pageID, PSID, payload);
    for (let index = 0; index < payload.length; index++) {
      const params = payload[index];
      await this.productInventoryService.checkProductInCart(pipeline, +params.variantID, +params.quantity);
    }

    if (pipeline.pipeline === EnumPurchaseOrderStatus.FOLLOW || pipeline.pipeline === EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT) {
      // await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.SEND_RECEIPT, platform); // ! PREPARE TO DELETE
      await this.pipelineOrderMessageService.sendOrderPayload(pipeline.page_id, pipeline.audience_id, EnumPurchasingPayloadType.CONFIRM_ORDER, platform, subscriptionID);
    }

    await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, pageID, {
      method: AudienceContactActionMethod.MOVE_TO_ORDER,
      audienceID: +audienceId,
      customerID: pipeline.customer_id,
    });

    await this.purchaseOrderService.publishGetPurchaseOrderSubscription(audienceId, Number(pipeline.order_id), Number(pipeline.page_id));
  }

  async onSelectPaymentMethod(eventType: EnumHandleResponseMessageType, pageID: number, audienceId: number, paymentType: EnumPaymentType): Promise<boolean> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceId);
    const isComplete = await this.purchaseOrderPipelineService.updateOrderPaymentMethod(pipeline.page_id, pipeline, EnumPaymentType[paymentType]);
    if (isComplete) {
      await this.purchaseOrderService.publishGetPurchaseOrderSubscription(audienceId, Number(pipeline.order_id), Number(pipeline.page_id));
      return true;
    } else {
      return false;
    }
  }

  async onSelectLogisticMethod(eventType: EnumHandleResponseMessageType, pageID: number, audienceId: number, logisticID: number): Promise<boolean> {
    // eslint-disable-next-line no-useless-catch
    try {
      const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, audienceId);
      await this.purchaseOrderService.resetOrderPaymentMethod(pageID, pipeline);
      const isComplete = await this.purchaseOrderService.updateSelectedLogisticMethod(pageID, pipeline, logisticID);

      if (isComplete) {
        await this.purchaseOrderService.publishGetPurchaseOrderSubscription(audienceId, Number(pipeline.order_id), Number(pipeline.page_id));
        return true;
      } else {
        return false;
        // TODO : Send Incomplete Message for let customer known to select new option
      }
    } catch (err) {
      throw err;
    }
  }

  async sendProductNotAddedMsgToCustomer(pageID: number, audienceID: number, errMessage: string): Promise<void> {
    try {
      await this.sendQuantityReachedMessage(pageID, audienceID, errMessage);
    } catch (error) {
      throw new Error('Error in sending message to customer that product not added ');
    }
  }

  async sendQuantityReachedMessage(pageID: number, audienceID: number, errMessage: string): Promise<void> {
    try {
      await this.pipelineMessageService.sendMessagePayload({ pageID }, errMessage, audienceID);
    } catch (error) {
      console.log('PurchaseOrderPostbackMessageService -> sendQuantityReachedMessage -> error', error);
      throw new Error(error);
    }
  }

  async intervalCheckPurchaseOrderStatus(PSID: string, eventType: EnumHandleResponseMessageType, pageID: number, audienceId: number): Promise<EnumGenericRecursiveStatus> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, Number(audienceId));

    const redisKey = `OMISE_${pipeline.order_id.toString()}`;
    const timerSec = PlusmarService.environment.cronJobConfig.redirectOmiseRepeatTimer;
    const maxRetry = PlusmarService.environment.cronJobConfig.redirectOmiseMaxRetry;

    return await genericRecursive(PlusmarService.redisClient, redisKey, timerSec, maxRetry);
  }

  async checkPurchaseOrderStatus(eventType: EnumHandleResponseMessageType, pageID: number, audienceId: number): Promise<EnumGenericRecursiveStatus> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, Number(audienceId));
    const paymentRedis = await getRedisOnRecursive(PlusmarService.redisClient, `OMISE_${pipeline.order_id.toString()}`);
    return paymentRedis.messageStatus;
  }

  async getPurchaseOrderInfo(eventType: EnumHandleResponseMessageType, pageID: number, audienceId: number): Promise<IOmiseOrderInfo> {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(eventType, pageID, Number(audienceId));
    const purchaseOrder = await getPurchasingOrderById(PlusmarService.readerClient, pipeline.page_id, pipeline.order_id);
    const page = await getPageByID(PlusmarService.readerClient, pipeline.page_id);
    const orderDetail = checkOrderDetail(purchaseOrder);

    return {
      ...orderDetail,
      shopName: page.page_name,
    };
  }
}
