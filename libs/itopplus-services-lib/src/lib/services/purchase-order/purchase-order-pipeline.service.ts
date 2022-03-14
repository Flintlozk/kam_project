import { getUTCMongo, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceDomainType,
  CustomerAddress,
  EnumHandleResponseMessageType,
  EnumLogDescription,
  EnumLogisticDeliveryProviderType,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  EnumPurchasingPayloadType,
  EnumTrackingType,
  IFacebookPipelineModel,
  ILogInput,
  INotificationSubScription,
  IPurchaseOrderPostbackAddItemToCartCatalog,
  IPurchaseOrderPostbackAddProductViaShareLink,
  NotificationStatus,
  NOTIFICATION_COUNT,
  PurchaseOrderModel,
  PurchaseOrderResponse,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { ProductCatalogService } from '..';
import {
  createPurchasingOrderItems,
  createTemporaryCourierTracking,
  findPayment,
  getAudienceByIDOnly,
  getCustomerAudienceByID,
  getLogisticByID,
  getOrderItemList,
  getPaymentById,
  getProductFromVariantId,
  // getPurchaseOrderPipelineByParams,
  // getPurchaseOrderPipelineData,
  getPurchasingOrder,
  setAudienceOffTimes,
  setNotificationStatusByStatus,
  updateOrderPaymentMethod,
  updatePurchasingOrderItems,
  updatePurchasingStatus,
} from '../../data';
import { getMessageForBankMethod } from '../../domains';
import { AudienceStepService } from '../audience-step/audience-step.service';
import { AudienceUpdateDomainService } from '../audience/audience-update-domain.service';
import { CustomerService } from '../customer/customer.service';
import { LogService } from '../log/log.service';
import { AdvanceMessageService } from '../message/advance-message.service';
import { PaymentService } from '../payment/payment.service';
import { PipelineOrderMessageService } from '../pipeline';
import { PipelineMessageService } from '../pipeline/pipeline-message.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { ProductInventoryService } from '../product/product-inventory.service';
import { LogisticsService } from '../settings/logistics/logistics.service';
import { LotNumberService } from '../settings/lot-number/lot-number.service';
import { PurchaseOrderTrackingInfoService } from './purchase-order-tracking-info.service';
import { PurchaseOrderService } from './purchase-order.service';

export class PurchaseOrderPipelineService {
  public pipelineService: PipelineService;
  public pipelineMessageService: PipelineMessageService;
  public pipelineOrderMessageService: PipelineOrderMessageService;
  public audienceUpdateDomainService: AudienceUpdateDomainService;
  public purchaseOrderTrackingInfoService: PurchaseOrderTrackingInfoService;
  public productInventoryService: ProductInventoryService;
  public paymentService: PaymentService;
  public logisticsService: LogisticsService;
  public customerService: CustomerService;
  public LogService: LogService;
  public lotNumberService: LotNumberService;
  public audienceStepService: AudienceStepService;
  public purchaseOrderService: PurchaseOrderService;
  public advanceMessageService: AdvanceMessageService;
  public productCatalogService: ProductCatalogService;

  constructor() {
    this.pipelineService = new PipelineService();
    this.pipelineMessageService = new PipelineMessageService();
    this.pipelineOrderMessageService = new PipelineOrderMessageService();
    this.audienceUpdateDomainService = new AudienceUpdateDomainService();
    this.purchaseOrderTrackingInfoService = new PurchaseOrderTrackingInfoService();
    this.productInventoryService = new ProductInventoryService();
    this.paymentService = new PaymentService();
    this.logisticsService = new LogisticsService();
    this.customerService = new CustomerService();
    this.audienceStepService = new AudienceStepService();
    this.purchaseOrderService = new PurchaseOrderService();
    this.advanceMessageService = new AdvanceMessageService();

    this.LogService = new LogService();
    this.lotNumberService = new LotNumberService();
    this.productCatalogService = new ProductCatalogService();
  }

  addProductToCartFromShareLink = async (audienceID: number, pageID: number, PSID: string, val: IPurchaseOrderPostbackAddProductViaShareLink): Promise<IFacebookPipelineModel> => {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK, pageID, audienceID);
    if (isEmpty(pipeline)) {
      const audience = await getAudienceByIDOnly(PlusmarService.readerClient, audienceID);
      const userIDNullForCustomer = null;
      await this.audienceUpdateDomainService.moveAudienceDomain(audienceID, { pageID: audience.page_id, name: '', userID: userIDNullForCustomer }, AudienceDomainType.CUSTOMER);
      const pipelineCreated = await this.pipelineService.getPipelineOnPostbackMessage(EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK, pageID, audienceID);
      await this.addProductToCart(pipelineCreated, val);

      return pipelineCreated;
    } else {
      await this.addProductToCart(pipeline, val);

      return pipeline;
    }
  };

  addProductToCartFromCatalog = async (
    audienceID: number,
    pageID: number,
    PSID: string,
    variants: IPurchaseOrderPostbackAddItemToCartCatalog[],
  ): Promise<IFacebookPipelineModel> => {
    const pipeline = await this.pipelineService.getPipelineOnPostbackMessage(EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK, pageID, audienceID);
    if (isEmpty(pipeline)) {
      const audience = await getAudienceByIDOnly(PlusmarService.readerClient, audienceID);
      const userIDNullForCustomer = null;
      await this.audienceUpdateDomainService.moveAudienceDomain(audienceID, { pageID: audience.page_id, name: '', userID: userIDNullForCustomer }, AudienceDomainType.CUSTOMER);
      const pipelineCreated = await this.pipelineService.getPipelineOnPostbackMessage(EnumHandleResponseMessageType.ADD_PRODUCT_VIA_SHARE_LINK, pageID, audienceID);
      for (let index = 0; index < variants?.length; index++) {
        const { variantID: variant, quantity } = variants[index];
        await this.addProductToCart(pipelineCreated, { variant, quantity });
      }
      return pipelineCreated;
    } else {
      for (let index = 0; index < variants?.length; index++) {
        const { variantID: variant, quantity } = variants[index];
        await this.addProductToCart(pipeline, { variant, quantity });
      }
      return pipeline;
    }
  };

  addProductToCart = async (pipeline: IFacebookPipelineModel, { variant, quantity }: IPurchaseOrderPostbackAddProductViaShareLink): Promise<void> => {
    const currentOrder = await getOrderItemList(PlusmarService.readerClient, pipeline.page_id, pipeline.order_id);
    const product = await getProductFromVariantId(PlusmarService.readerClient, variant);

    if (!isEmpty(currentOrder)) {
      const variantItem = currentOrder.find((item) => {
        return item.product_variant_id === product.variantID;
      });

      if (variantItem) {
        const newQuantity = Number(variantItem.item_quantity) + Number(quantity);
        const poItemId = variantItem.id;
        await updatePurchasingOrderItems(PlusmarService.readerClient, newQuantity, pipeline.order_id, product.variantID, poItemId, pipeline.page_id);
      } else {
        await createPurchasingOrderItems(
          PlusmarService.writerClient,
          pipeline.order_id,
          product.variantID,
          Number(quantity),
          pipeline.page_id,
          pipeline.audience_id,
          product.productID,
        );
      }
    } else {
      await createPurchasingOrderItems(
        PlusmarService.writerClient,
        pipeline.order_id,
        product.variantID,
        Number(quantity),
        pipeline.page_id,
        pipeline.audience_id,
        product.productID,
      );
    }
    await this.productInventoryService.updatePurchasingTotalPrice(PlusmarService.writerClient, pipeline.page_id, pipeline.order_id);
  };

  updateOrderPaymentMethod = async (pageID: number, pipeline: IFacebookPipelineModel, paymentType: EnumPaymentType): Promise<boolean> => {
    try {
      const method = await findPayment(PlusmarService.readerClient, pageID, paymentType);
      if (!isEmpty(method)) {
        await updateOrderPaymentMethod(PlusmarService.writerClient, method[0].id, pageID, pipeline.audience_id, pipeline.order_id);
        return true;
      } else {
        return false;
      }
    } catch (err) {
      console.log('-<updateOrderPaymentMethod  err >- ', err);
      return false;
    }
  };

  updateNextPurchaseOrderStatus = async (
    pageID: number,
    audienceId: number,
    subscriptionID: string,
    Client: Pool = PlusmarService.writerClient,
  ): Promise<PurchaseOrderResponse> => {
    const purchaseOrder = await getPurchasingOrder(Client, pageID, audienceId);
    if (!isEmpty(purchaseOrder)) {
      const { status: pipelineStage } = purchaseOrder[0];

      const ENUM = EnumPurchaseOrderStatus;
      switch (pipelineStage) {
        case ENUM.FOLLOW: {
          await this.updateNextPurchaseOnFollow(Client, pageID, purchaseOrder[0]);
          return { status: 200, message: 'updateNextPurchaseOnFollow' };
        }
        case ENUM.WAITING_FOR_PAYMENT: {
          await this.updateNextPurchaseOnWaitingForPayment(Client, pageID, audienceId, purchaseOrder[0], subscriptionID);
          return { status: 200, message: 'updateNextPurchaseOnWaitingForPayment' };
        }
        case ENUM.CONFIRM_PAYMENT: {
          await this.updateNextPurchaseOnConfirmOrder(Client, pageID, purchaseOrder[0]);
          await this.productCatalogService.deleteCatalogSession(pageID, audienceId);
          return { status: 200, message: 'updateNextPurchaseOnConfirmOrder' };
        }

        case ENUM.WAITING_FOR_SHIPMENT: {
          await this.updateNextPurchaseOnWaitingForShippment(Client, pageID, purchaseOrder[0]);
          return { status: 200, message: 'updateNextPurchaseOnWaitingForShippment' };
        }
        case ENUM.CLOSE_SALE: {
          return { status: 200, message: 'ok' };
        }
      }
    }
  };

  updateNextPurchaseOnFollow = async (Client: Pool, pageID: number, order: PurchaseOrderModel): Promise<void> => {
    const { id: poID, audience_id: audienceID } = order;
    const ENUM = EnumPurchaseOrderStatus;

    // Update Order Pipeline to Step 2
    await this.updateNextPurchasingStatus(ENUM.WAITING_FOR_PAYMENT, pageID, audienceID, poID, Client);
    const customer = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    await this.loggerPipeline(audienceID, pageID, EnumLogDescription.FOLLOW_TO_WAIT_FOR_PAYMENT, `${customer.first_name} ${customer.last_name}`);
  };

  updateNextPurchaseOnWaitingForPayment = async (
    Client: Pool,
    pageID: number,
    audienceID: number,
    // PSID: string,
    { id: orderID, payment_id, is_auto: isAutomate, platform }: PurchaseOrderModel,
    subscriptionID: string,
  ): Promise<void> => {
    const ENUM = EnumPurchaseOrderStatus;
    const customer = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    if (isAutomate === false) {
      const payment = await getPaymentById(Client, pageID, payment_id);

      const eventType = EnumPurchasingPayloadType.UPDATE_CART;
      const pipeline = await this.pipelineService.getPurchaseOrderPipeline(eventType, pageID, Number(audienceID));

      const customerDetail = await getCustomerAudienceByID(Client, audienceID, pageID);

      const customerAddress = {
        name: customerDetail.name,
        phone_number: customerDetail.phone_number,
        location: customerDetail.location,
      } as CustomerAddress;

      await this.customerService.updateCustomerAddressToCurrentOrder(pipeline, customerAddress);

      switch (payment.type) {
        case EnumPaymentType.BANK_ACCOUNT: {
          const account = await this.paymentService.listPayloadBankAccount(pageID);
          const message = getMessageForBankMethod(account);

          await this.productInventoryService.checkReservedProductInventory(pageID, orderID, audienceID);
          await this.productInventoryService.reservedProduct(orderID, pageID, audienceID, subscriptionID);
          await createTemporaryCourierTracking(Client, orderID);

          await setNotificationStatusByStatus(Client, audienceID, pageID, NotificationStatus.UNREAD);

          await PlusmarService.pubsub.publish(NOTIFICATION_COUNT, { page_id: pageID } as INotificationSubScription);

          await this.pipelineMessageService.sendPlayloadPlatform({ pageID }, message, 'sendMessagePayload', audienceID, platform);
          break;
        }
        case EnumPaymentType.CASH_ON_DELIVERY: {
          await this.productInventoryService.checkReservedProductInventory(pageID, orderID, audienceID);
          break;
        }
        case EnumPaymentType.PAYPAL:
          await this.pipelineOrderMessageService.sendOrderPayload(pageID, audienceID, EnumPurchasingPayloadType.CHECKOUT_PAYPAL, platform, subscriptionID);
          break;
        case EnumPaymentType.PAYMENT_2C2P:
          await this.pipelineOrderMessageService.sendOrderPayload(pageID, audienceID, EnumPurchasingPayloadType.CHECKOUT_2C2P, platform, subscriptionID);
          break;
        case EnumPaymentType.OMISE:
          await this.pipelineOrderMessageService.sendOrderPayload(pageID, audienceID, EnumPurchasingPayloadType.CHECKOUT_OMISE, platform, subscriptionID);
          break;
        default:
          break;
      }

      await this.updateNextPurchasingStatus(ENUM.CONFIRM_PAYMENT, pageID, audienceID, orderID, Client);
      await this.loggerPipeline(audienceID, pageID, EnumLogDescription.WAIT_FOR_PAYMENT_TO_CONFIRM, `${customer.first_name} ${customer.last_name}`);
    } else {
      const payment = await getPaymentById(Client, pageID, payment_id);
      await this.updateNextPurchasingStatus(ENUM.CONFIRM_PAYMENT, pageID, audienceID, orderID, Client);

      if (payment.type === EnumPaymentType.BANK_ACCOUNT) {
        await setNotificationStatusByStatus(Client, audienceID, pageID, NotificationStatus.UNREAD);
        await PlusmarService.pubsub.publish(NOTIFICATION_COUNT, { page_id: pageID } as INotificationSubScription);
      }
      if (payment.type !== EnumPaymentType.CASH_ON_DELIVERY) {
        // if (!flat_rate) await this.pipelineOrderMessageService.sendOrderPayload(pageID, audienceID, EnumPurchasingPayloadType.SEND_RECEIPT, platform);  // ! PREPARE TO DELETE
      }
      await this.loggerPipeline(audienceID, pageID, EnumLogDescription.WAIT_FOR_PAYMENT_TO_CONFIRM, `${customer.first_name} ${customer.last_name}`);
    }
  };

  updateNextPurchaseOnConfirmOrder = async (Client: Pool, pageID: number, order: PurchaseOrderModel): Promise<void> => {
    const { id: poID, audience_id: audienceID, payment_id: paymentID, platform, is_auto: isAutomate } = order;
    const ENUM = EnumPurchaseOrderStatus;
    const customer = await getCustomerAudienceByID(Client, audienceID, pageID);
    if (!isAutomate) {
      const courier = await createTemporaryCourierTracking(Client, poID);
    }

    await this.createCourierTrackingOnConfirmOrder(Client, pageID, order);

    const payment = await getPaymentById(Client, pageID, paymentID);
    switch (payment.type) {
      case EnumPaymentType.CASH_ON_DELIVERY: {
        await this.updateNextPurchasingStatus(ENUM.WAITING_FOR_SHIPMENT, pageID, audienceID, poID, Client);
        const messages = await this.advanceMessageService.getOrderAdvanceMessage(pageID, EnumHandleResponseMessageType.CORRECT_ADDRESS_COD);
        // await this.pipelineOrderMessageService.sendOrderPayload(pageID, audienceID, EnumPurchasingPayloadType.SEND_RECEIPT, platform); // ! PREPARE TO DELETE
        await this.pipelineMessageService.sendPlayloadPlatform({ pageID }, messages.subtitle, 'sendMessagePayload', audienceID, platform);
        await this.pipelineMessageService.sendPlayloadPlatform({ pageID }, messages.title, 'sendMessagePayload', audienceID, platform);
        break;
      }
      case EnumPaymentType.BANK_ACCOUNT: {
        await this.updateNextPurchasingStatus(ENUM.WAITING_FOR_SHIPMENT, pageID, audienceID, poID, Client);
        const messages = await this.advanceMessageService.getOrderAdvanceMessage(pageID, EnumHandleResponseMessageType.SUBMIT_PAYMENT);
        await this.pipelineMessageService.sendPlayloadPlatform({ pageID }, messages.title, 'sendMessagePayload', audienceID, platform);
        break;
      }
      case EnumPaymentType.PAYPAL:
      case EnumPaymentType.PAYMENT_2C2P:
      case EnumPaymentType.OMISE:
        await setNotificationStatusByStatus(Client, audienceID, pageID, NotificationStatus.UNREAD);
        await PlusmarService.pubsub.publish(NOTIFICATION_COUNT, { page_id: pageID } as INotificationSubScription);
        await this.updateNextPurchasingStatus(ENUM.WAITING_FOR_SHIPMENT, pageID, audienceID, poID, Client);
        break;
      default:
        throw new Error('PIPELINE_CONFIRM_PAYMENT_PAYMENT_MISSING');
    }

    await this.loggerPipeline(audienceID, pageID, EnumLogDescription.CONFIRM_TO_WAIT_FOR_SHIPMENT, `${customer.first_name} ${customer.last_name}`);
  };

  // await createTemporaryCourierTracking(PlusmarService.writerClient, pipeline.order_id);
  async createCourierTrackingOnConfirmOrder(Client: Pool, pageID: number, order: PurchaseOrderModel): Promise<void> {
    const { id: poID, flat_rate: isLogisticSystem, audience_id: audienceID, logistic_id: logisticID } = order;
    const logistic = await getLogisticByID(Client, logisticID, pageID);
    try {
      if (isLogisticSystem) {
        await this.purchaseOrderTrackingInfoService.createCourierTrackingOnPurchasingOrder(pageID, poID, audienceID, isLogisticSystem, Client);
      } else {
        const notFlatRate = false;
        switch (logistic.delivery_type) {
          case EnumLogisticDeliveryProviderType.THAILAND_POST: {
            if (logistic.tracking_type === EnumTrackingType.BOOK) {
              await this.purchaseOrderTrackingInfoService.createCourierTrackingOnPurchasingOrder(pageID, poID, audienceID, notFlatRate, Client);
            }
            // NOTE : logistic.tracking_type === EnumTrackingType.DROP_OFF should trigger from UI
            break;
          }
          default:
            switch (logistic.tracking_type) {
              case EnumTrackingType.DROP_OFF:
                // Auto Tracking -> FLASH, J&T, ALPHA
                await this.purchaseOrderTrackingInfoService.createCourierTrackingOnPurchasingOrder(pageID, poID, audienceID, notFlatRate, Client);
                break;
            }
            break;
        }
      }
    } catch (err) {
      console.log('updateNextPurchaseOnConfirmOrder ON FAILED ALLOED  ', err);
      // ALLOW TO FAILED FOR RETRYING PURPOSE
      if (isLogisticSystem) {
        await this.purchaseOrderTrackingInfoService.createCourierTrackingOnPurchasingOrder(pageID, poID, audienceID, isLogisticSystem, Client);
      }
    }
  }

  updateNextPurchaseOnWaitingForShippment = async (Client: Pool, pageID: number, order: PurchaseOrderModel): Promise<void> => {
    const { id: poID, audience_id: audienceID } = order;
    const customer = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const ENUM = EnumPurchaseOrderStatus;
    await this.updateNextPurchasingStatus(ENUM.CLOSE_SALE, pageID, audienceID, poID, Client);
    await setAudienceOffTimes(Client, pageID, audienceID, false);

    await this.loggerPipeline(audienceID, pageID, EnumLogDescription.WAIT_FOR_SHIPMENT_TO_CLOSE, `${customer.first_name} ${customer.last_name}`);
  };

  updateNextPurchasingStatus = async (statusType: EnumPurchaseOrderStatus, pageID: number, audienceId: number, purchaseOrderId: number, client: Pool): Promise<void> => {
    await updatePurchasingStatus(client, statusType, pageID, audienceId, purchaseOrderId);
    const pipelineParams = {
      pipeline: statusType,
      status: 'incomplete',
      updatedAt: getUTCMongo(),
    };
    if (statusType === EnumPurchaseOrderStatus.CLOSE_SALE) {
      pipelineParams.status = 'complete';
    }
  };

  async loggerPipeline(audienceID: number, pageID: number, description: string, subject: string): Promise<void> {
    await this.LogService.addLog(
      {
        user_id: null,
        type: 'Purchase Order',
        action: 'Update',
        description: description,
        subject: subject,
        user_name: null,
        audience_id: audienceID,
        audience_name: subject,
        created_at: getUTCMongo(),
      } as ILogInput,
      pageID,
    );
  }
}
