import { isAllowCaptureException, isEmpty, onWaitFor, PostgresHelper, transformMediaLinkString } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  CustomerAddress,
  EnumLogisticDeliveryProviderType,
  EnumPaymentType,
  EnumPurchaseOrderStatus,
  EnumPurchasingPayloadType,
  EnumTrackingType,
  IAliases,
  IExpiryPurchaseOrder,
  IFacebookPipelineModel,
  IOrderExistsByVariant,
  IPages,
  IPayload,
  IPurchaseOrder,
  IPurchaseOrderPaymentDetail,
  IPurchaseOrderPostbackMessageAddress,
  IPurhcaseOrderLogistic,
  ITaxModel,
  OrderFilters,
  OrderSettings,
  PurchaseInventory,
  PurchaseOrderCustomerDetail,
  PurchaseOrderList,
  PurchaseOrderModel,
  PurchaseOrderProducts,
  PurchaseOrderShippingDetail,
  PurchaseOrderStats,
  PURCHASE_ORDER_RECEIVED,
  ShippingAddressLocation,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Pool } from 'pg';
import {
  createPurchasingOrder,
  getAllPOInMonth,
  getCustomerAudienceByID,
  getExpiredPurchaseOrder,
  getOrderExistsByVariantID,
  getPageByID,
  getPoList,
  getPoStats,
  getPurchaseOrderPipelineData,
  getPurchaseOrderRelationIDs,
  getPurchaseProductInventory,
  getPurchasingOrder,
  getPurchasingOrderById,
  getPurchasingOrderItems,
  getPurchasingOrderLogisticInfo,
  getPurchasingOrderTrackingInfo,
  releaseReservedPurchaseOrderItem,
  resetPurchaseOrderExpired,
  updateOrderLogisticInfo,
  updateOrderLogisticMethod,
  updateOrderPaymentMethod,
} from '../../data';
import { getCustomerShippingAddressByOrder, updateCustomerAddress } from '../../data/customer';
import { getBankAccountById, getPaymentById, getPaymentDetailOfPage } from '../../data/payment';
import { getLogisticByID, getLogisticByPageID, getTaxByPageID } from '../../data/settings';
import { createAliasPOID, getCustomerDestination } from '../../domains/purchase-order/purchase-order.domain';
import { PurchasingOrderNotFound } from '../../errors';
import { CustomerService } from '../customer/customer.service';
import { JAndTExpressService } from '../j&t-express';
import { LogisticSystemService } from '../logistic/logistic-system.service';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderFailedService } from './purchase-order-failed.service';
import { environmentLib } from '@reactor-room/environment-services-backend';
export class PurchaseOrderService {
  public pipelineService: PipelineService;
  public jAndTExpressService: JAndTExpressService;
  public purchaseOrderFailedService: PurchaseOrderFailedService;
  public customerService: CustomerService;
  public logisticSystemService: LogisticSystemService;

  constructor() {
    this.pipelineService = new PipelineService();
    this.jAndTExpressService = new JAndTExpressService();
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
    this.customerService = new CustomerService();
    this.logisticSystemService = new LogisticSystemService();
  }

  async getPurchasingOrderById(pageID: number, orderID: number): Promise<PurchaseOrderModel> {
    // ? being used at webhook-template.service
    return await getPurchasingOrderById(PlusmarService.readerClient, pageID, orderID);
  }

  getAllPOInMonth = async (pageID: number): Promise<PurchaseOrderModel[]> => {
    const result = await getAllPOInMonth(PlusmarService.readerClient, pageID);
    if (isEmpty(result)) return [] as PurchaseOrderModel[];
    return result;
  };

  getCurrentPurchaseProductInventory = async ({ pageID }: IPayload, orderId: number, productIds: number[]): Promise<PurchaseInventory[]> => {
    const list = await getPurchaseProductInventory(PlusmarService.readerClient, pageID, productIds);

    if (!isEmpty(list)) {
      return list;
    } else {
      throw new Error('VARIANT_INVENTORY_NOT_FOUND');
    }
  };

  getAllPurchaseOrder = async (
    { startDate = '', endDate = '', search = '', status = '', pageSize = 10, currentPage = 1, orderBy = [''], orderMethod = '', exportAllRows }: OrderFilters,
    pageID: number,
  ): Promise<PurchaseOrderList[]> => {
    const page = (currentPage - 1) * pageSize;
    const aliases = {
      pageID: pageID,
      startDate: startDate,
      endDate: endDate,
      currentPage: currentPage,
      search: search ? `${search}%` : null,
      pageSize: pageSize,
      page: page,
      status: status,
    } as IAliases;

    // prepare search
    const searchBy = ['tc.first_name', 'tc.last_name', 'po.created_at', 'po.status'];
    const addORclause = (i) => (searchBy.length - 1 > i ? 'OR' : '');
    const getSearchClause = (column, i) => `UPPER(${column}::text) LIKE UPPER(:search) ${addORclause(i)}`;
    const searchQuery = search ? `AND ${searchBy.map(getSearchClause).join(' ')}` : '';
    const statusQuery = status ? 'AND po.status = :status' : '';
    const lists = await getPoList(PlusmarService.readerClient, aliases, { searchQuery, orderBy, orderMethod, statusQuery, exportAllRows });
    if (isEmpty(lists)) return [];

    return lists;
  };

  purchaseOrderDetail = async (order: IPurchaseOrder, pageID: number, currentOrder: PurchaseOrderModel): Promise<void> => {
    const { payment_id, bank_account_id, logistic_id, is_paid, paid_amount, paid_date, paid_proof, paid_time, flat_rate: isLogisticSystem } = currentOrder;

    if (payment_id !== null) {
      const payment = await getPaymentById(PlusmarService.readerClient, pageID, payment_id);
      order.payment = {
        id: payment.id,
        type: payment.type,
        bankAccountId: null,
        bank: null,
        isPaid: is_paid,
        paidAmount: paid_amount,
        paidDate: paid_date,
        paidTime: paid_time,
        paidProof: paid_proof,
      };

      if (payment.type === EnumPaymentType.BANK_ACCOUNT && bank_account_id !== null) {
        const bank = await getBankAccountById(PlusmarService.readerClient, payment_id, bank_account_id);
        order.payment.bankAccountId = bank_account_id;
        order.payment.bank = bank[0];
      }
    }
    const trackInfo = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, currentOrder.id, currentOrder.page_id);

    if (logistic_id !== null) {
      const logistic = await getLogisticByID(PlusmarService.readerClient, logistic_id, pageID);
      const logisticSysConfig = await this.logisticSystemService.getLogisticSystemByLogisiticID(pageID, logistic_id, logistic);
      const { shippingFee } = await this.logisticSystemService.calculateShippingPriceByType(logisticSysConfig, currentOrder, logistic_id);
      let logisticInfo = await getPurchasingOrderLogisticInfo(PlusmarService.readerClient, currentOrder.id, currentOrder.page_id);

      if (logisticInfo === null) {
        const logisticInfoParams = {
          purchase_order_id: currentOrder.id,
          logistic_id: currentOrder.logistic_id,
          tracking_type: logistic.tracking_type,
          fee_type: logistic.fee_type,
          // delivery_fee: logistic.delivery_fee,
          delivery_fee: shippingFee,
          delivery_type: logistic.delivery_type,
          cod_status: false,
          courier_pickup: false,
        } as IPurhcaseOrderLogistic;

        await updateOrderLogisticInfo(PlusmarService.writerClient, logisticInfoParams);
        logisticInfo = await getPurchasingOrderLogisticInfo(PlusmarService.readerClient, currentOrder.id, currentOrder.page_id);
      }

      if (logistic) {
        const { id, name } = logistic;
        const { delivery_type, tracking_type } = logisticInfo;
        order.shipping = {
          id,
          name,
          type: delivery_type,
          trackingType: tracking_type,
          flatRate: false,
          deliveryFee: shippingFee,
          // flatRate: fee_type === 'FLAT_RATE', // else will return false
          // deliveryFee: delivery_fee,
          trackingUrl: '',
          trackingNo: '',
          isAutoGeneratyeTrackingNo: tracking_type !== EnumTrackingType.MANUAL,
          isActive: false,
        };

        if (trackInfo !== null) {
          const { tracking_url, tracking_no } = trackInfo;
          order.shipping.trackingNo = tracking_no ? tracking_no : '';
          order.shipping.trackingUrl = tracking_url;
          order.shipping.isActive = trackInfo.active;
        }
      }
    } else {
      if (isLogisticSystem) {
        const logisticSysConfig = await this.logisticSystemService.getLogisticSystemByDefaultConfig(pageID);
        const { shippingFee } = await this.logisticSystemService.calculateShippingPriceByType(logisticSysConfig, currentOrder);
        order.deliveryFee = shippingFee;
      } else {
        order.deliveryFee = 0;
      }

      if (trackInfo !== null) {
        const { tracking_url, tracking_no } = trackInfo;
        order.shipping = {
          id: -1,
          name: 'FLAT_RATE',
          type: null,
          trackingType: EnumTrackingType.MANUAL,
          flatRate: true,
          isAutoGeneratyeTrackingNo: false,
          deliveryFee: order.deliveryFee,
          trackingNo: tracking_no ? tracking_no : '',
          trackingUrl: tracking_url,
          isActive: trackInfo.active,
        };
      }
      order.flatRate = isLogisticSystem;
    }
  };

  getPromisingOrder = (pageID: number, audienceId: number): Promise<[PurchaseOrderModel[], ITaxModel]> => {
    const P1 = getPurchasingOrder(PlusmarService.readerClient, pageID, audienceId);
    const P2 = getTaxByPageID(PlusmarService.readerClient, pageID);
    return Promise.all([P1, P2]);
  };

  fillOrderDetail = async (
    order: IPurchaseOrder,
    pageID: number,
    audienceId: number,
    currentOrder: PurchaseOrderModel[],
    taxDetail: ITaxModel,
    subscriptionID: string,
  ): Promise<void> => {
    order.orderId = currentOrder[0].id;
    order.createdAt = currentOrder[0].created_at;
    order.uuid = currentOrder[0].uuid;
    order.isAuto = currentOrder[0].is_auto;
    order.aliasOrderId = currentOrder[0].aliasOrderId;

    if (currentOrder[0].tax_included) {
      order.taxIncluded = currentOrder[0].tax_included;
      order.tax = currentOrder[0].tax;
    }

    await this.purchaseOrderDetail(order, pageID, currentOrder[0]);
    if (!isEmpty(taxDetail)) {
      order.tax = Number(taxDetail.tax);
    }

    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceId, currentOrder[0].id);
    if (isEmpty(products)) {
      order.products = [];
    } else {
      products?.map((product) => {
        product?.images.map((image) => {
          image.mediaLink = transformMediaLinkString(image.mediaLink, environmentLib.filesServer, subscriptionID);
        });
      });
      order.products = products;
    }
  };

  getPurchaseOrder = async (pageID: number, audienceId: number, currentStatus: EnumPurchaseOrderStatus, subscriptionID: string): Promise<IPurchaseOrder> => {
    const order = {
      audienceId,
      status: currentStatus, // May not required
      orderId: null,
      uuid: null,
      totalPrice: null,
      flatRate: null,
      deliveryFee: 0,
      tax: 0,
      taxIncluded: false,
      createdAt: null,
      isAuto: true,
      aliasOrderId: null,
      shipping: null, // ? TODO : ATOM - Refactor to Chain Resolve
      customerDetail: null, // ? TODO : ATOM - Refactor to Chain Resolve
      payment: null, // ? TODO : ATOM - Refactor to Chain Resolve
      products: null, // ? TODO : ATOM - Refactor to Chain Resolve
      // errors: [],
    } as IPurchaseOrder;
    const PromiseResult = await this.getPromisingOrder(pageID, audienceId);
    const currentOrder = PromiseResult[0];
    currentOrder[0].paid_proof = transformMediaLinkString(currentOrder[0].paid_proof, environmentLib.filesServer, subscriptionID);
    const taxDetail = PromiseResult[1];
    if (!isEmpty(currentOrder)) {
      await this.fillOrderDetail(order, pageID, audienceId, currentOrder, taxDetail, subscriptionID);
      return order;
    } else {
      if (currentStatus !== EnumPurchaseOrderStatus.FOLLOW) {
        throw new PurchasingOrderNotFound('PURCHASE_ORDER_NOT_FOUND');
      } else {
        // Repeat Create Order
        const page = await getPageByID(PlusmarService.readerClient, pageID);
        await this.createPurchasingOrder(pageID, audienceId, page);

        const newPromiseResult = await this.getPromisingOrder(pageID, audienceId);
        const newCurrentOrder = newPromiseResult[0];
        const newTaxDetail = newPromiseResult[1];

        await this.fillOrderDetail(order, pageID, audienceId, newCurrentOrder, newTaxDetail, subscriptionID);
        return order;
      }
    }
  };

  getPurchaseOrderShippingDetail = async (pageID: number, orderID: number, audienceID: number): Promise<PurchaseOrderShippingDetail> => {
    const { logisticID } = await getPurchaseOrderRelationIDs(PlusmarService.readerClient, pageID, orderID);
    let shippingObject: PurchaseOrderShippingDetail = null;
    if (logisticID !== null) {
      const currentOrder = await getPurchasingOrder(PlusmarService.readerClient, pageID, audienceID);

      const logistic = await getLogisticByID(PlusmarService.readerClient, logisticID, pageID);
      const logisticSysConfig = await this.logisticSystemService.getLogisticSystemByLogisiticID(pageID, logisticID, logistic);
      const { shippingFee } = await this.logisticSystemService.calculateShippingPriceByType(logisticSysConfig, currentOrder[0], logisticID);
      const trackInfo = await getPurchasingOrderTrackingInfo(PlusmarService.readerClient, orderID, pageID);
      const logisticInfo = await getPurchasingOrderLogisticInfo(PlusmarService.readerClient, orderID, pageID);

      if (logistic) {
        const { id, name } = logistic;
        const { delivery_type, tracking_type } = logisticInfo;
        shippingObject = {
          id,
          name,
          type: delivery_type,
          trackingType: tracking_type,
          flatRate: false,
          deliveryFee: shippingFee,
          // flatRate: fee_type === 'FLAT_RATE', // else will return false
          // deliveryFee: delivery_fee,
          trackingUrl: '',
          trackingNo: '',
          isAutoGeneratyeTrackingNo: tracking_type !== EnumTrackingType.MANUAL,
          isActive: false,
        };

        if (trackInfo !== null) {
          const { tracking_url, tracking_no } = trackInfo;
          shippingObject.trackingNo = tracking_no ? tracking_no : '';
          shippingObject.trackingUrl = tracking_url;
          shippingObject.isActive = trackInfo.active;
        }
      }

      return shippingObject as PurchaseOrderShippingDetail;
    } else {
      return null as PurchaseOrderShippingDetail;
    }
  };
  getPurchaseOrderPaymentDetail = async (pageID: number, orderID: number, audienceID: number): Promise<IPurchaseOrderPaymentDetail> => {
    const { paymentID, bankAccountID } = await getPurchaseOrderRelationIDs(PlusmarService.readerClient, pageID, orderID);
    if (paymentID !== null) {
      const payment = await getPaymentById(PlusmarService.readerClient, pageID, paymentID);
      const obj = {
        id: payment.id,
        type: payment.type,
        bankAccountId: null,
        bank: null,
      };

      if (payment.type === EnumPaymentType.BANK_ACCOUNT && bankAccountID !== null) {
        const bank = await getBankAccountById(PlusmarService.readerClient, paymentID, bankAccountID);
        obj.bankAccountId = bankAccountID;
        obj.bank = bank[0];
      }
      return obj as IPurchaseOrderPaymentDetail;
    } else {
      throw new Error('PAYMENT NOT SELECTED');
    }
  };
  getPurchaseOrderProductDetail = async (pageID: number, orderID: number, audienceID: number): Promise<PurchaseOrderProducts[]> => {
    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, orderID);
    return products;
  };

  getPurchaseOrderCustomerDetail = async (pageID: number, orderID: number, audienceID: number): Promise<PurchaseOrderCustomerDetail> => {
    await onWaitFor(1);
    return {} as PurchaseOrderCustomerDetail;
  };

  async getPurchaseOrderDestination(pageID: number, audienceID: number, orderID: number): Promise<PurchaseOrderCustomerDetail> {
    const customerDetail = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const address = await getCustomerShippingAddressByOrder(PlusmarService.readerClient, customerDetail.customer_id, pageID, orderID);
    if (!isEmpty(address)) {
      return getCustomerDestination(address[0], address[0].is_confirm);
    } else {
      return getCustomerDestination(customerDetail, false);
    }
  }

  async getPurchaseOrderPipeline(pageID: number, audienceID: number): Promise<IFacebookPipelineModel> {
    const result = await getPurchaseOrderPipelineData(PlusmarService.readerClient, pageID, audienceID);
    return result;
  }

  async createCustomerPipeline(Client: Pool, pageID: number, audienceID: number): Promise<void> {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    await this.createPurchasingOrder(pageID, audienceID, page, Client);
  }

  async createPurchasingOrder(pageID: number, audienceID: number, page: IPages, Client: Pool = PlusmarService.writerClient): Promise<void> {
    const logistics = await getLogisticByPageID(PlusmarService.readerClient, pageID);
    const filterLogisticEnabled = logistics.filter((item) => item.status === true);
    if (filterLogisticEnabled.length === 0) throw new Error('NO_LOGISTIC_AVALIABLE');

    const payments = await getPaymentDetailOfPage(PlusmarService.readerClient, pageID);
    const filterPaymentEnabled = payments.filter((item) => item.status === true);
    if (filterPaymentEnabled.length === 0) throw new Error('NO_PAYMENT_AVALIABLE');

    const flatRate = page.flat_status;
    const deliveryFree = 0;

    const tax = await getTaxByPageID(PlusmarService.readerClient, pageID);
    let taxAmount = 0;
    let taxStatus = false;
    if (!isEmpty(tax)) {
      if (tax.status === true) {
        taxAmount = tax.tax;
        taxStatus = tax.status;
      }
    }

    const orderSettings: OrderSettings = {
      taxAmount,
      taxStatus,
      flatRate,
      deliveryFree,
    };

    const allPoInMonth = await getAllPOInMonth(PlusmarService.readerClient, pageID);
    let total = 0;
    if (!isEmpty(allPoInMonth)) {
      total = allPoInMonth.length;
    }
    const aliasePOID = createAliasPOID(total);

    await createPurchasingOrder(Client, pageID, audienceID, EnumPurchaseOrderStatus.FOLLOW, orderSettings, aliasePOID);
  }

  getPoStatsCounts = async ({ startDate = '', endDate = '' }: OrderFilters, pageID: number): Promise<PurchaseOrderStats> => {
    const aliases = {
      pageID: pageID,
      startDate: startDate,
      endDate: endDate,
    } as IAliases;
    const stats = await getPoStats(PlusmarService.readerClient, aliases);
    return stats;
  };

  async publishGetPurchaseOrderSubscription(audienceID: number, orderID: number, pageID: number): Promise<void> {
    try {
      const getPurchaseOrderSubscription = { getPurchaseOrderSubscription: { audienceID: audienceID, orderID, pageID } };
      await PlusmarService.pubsub.publish(PURCHASE_ORDER_RECEIVED, getPurchaseOrderSubscription);
    } catch (err) {
      console.log('publishGetPurchaseOrderSubscription', err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      return;
    }
  }

  async updateSelectedPaymentMethodService(pageID: number, audienceID: number, paymentID: number): Promise<IHTTPResult> {
    const eventType = EnumPurchasingPayloadType.PAYMENT_SELECTOR;
    const pipeline = await this.pipelineService.getPurchaseOrderPipeline(eventType, pageID, audienceID);

    const result = await this.updateSelectedPaymentMethod(pageID, pipeline, paymentID);
    if (!result) throw new Error('FAILED_TO_SELECT_PAYMENT');
    return {
      status: 200,
      value: 'ok',
    };
  }

  updateSelectedPaymentMethod = async (pageID: number, pipeline: IFacebookPipelineModel, paymentID: number): Promise<boolean> => {
    const method = await getPaymentById(PlusmarService.readerClient, pageID, paymentID);
    if (method) {
      await updateOrderPaymentMethod(PlusmarService.writerClient, method.id, pageID, pipeline.audience_id, pipeline.order_id);
      return true;
    } else {
      return false;
    }
  };

  updateSelectedLogisticMethodService = async (pageID: number, audienceID: number, logisticID: number): Promise<IHTTPResult> => {
    const customer = await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    const eventType = EnumPurchasingPayloadType.LOGISTIC_SELECTOR;
    const pipeline = await this.pipelineService.getPurchaseOrderPipeline(eventType, pageID, audienceID);
    await this.resetOrderPaymentMethod(pageID, pipeline); // UI will control the flow
    await this.jAndTExpressService.validateAddress(customer.id, pageID, pipeline.order_id, logisticID, audienceID);

    const result = await this.updateSelectedLogisticMethod(pageID, pipeline, logisticID);

    if (!result) throw new Error('FAILED_TO_SELECT_LOGISTIC');
    return {
      status: 200,
      value: 'ok',
    };
  };

  resetOrderPaymentMethod = async (pageID: number, pipeline: IFacebookPipelineModel): Promise<void> => {
    await updateOrderPaymentMethod(PlusmarService.writerClient, null, pageID, pipeline.audience_id, pipeline.order_id);
  };

  updateSelectedLogisticMethod = async (pageID: number, pipeline: IFacebookPipelineModel, logisticID: number): Promise<boolean> => {
    const _method = getLogisticByID(PlusmarService.readerClient, logisticID, pageID);
    const _currentOrder = getPurchasingOrder(PlusmarService.readerClient, pageID, pipeline.audience_id);

    const promiseValue = await Promise.all([_method, _currentOrder]);
    const method = promiseValue[0];
    const currentOrder = promiseValue[1];

    const logisticSysConfig = await this.logisticSystemService.getLogisticSystemByLogisiticID(pageID, logisticID, method);
    const { shippingFee } = await this.logisticSystemService.calculateShippingPriceByType(logisticSysConfig, currentOrder[0]);

    if (method) {
      const logisticInfo = {
        purchase_order_id: pipeline.order_id,
        logistic_id: logisticID,
        tracking_type: method.tracking_type,
        fee_type: method.fee_type,
        // delivery_fee: method.delivery_fee,
        delivery_fee: shippingFee,
        delivery_type: method.delivery_type,
        cod_status: method.cod_status,
        courier_pickup: method.courier_pickup,
      } as IPurhcaseOrderLogistic;

      const Client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await updateOrderLogisticMethod(Client, method.id, pageID, pipeline.audience_id, pipeline.order_id);
      await updateOrderLogisticInfo(Client, logisticInfo);
      await PostgresHelper.execBatchCommitTransaction(Client);
      return true;
    } else {
      return false;
    }
  };

  // Have been called from Cron
  async checkAndReleasePurchaseOrderItemsExpiries(): Promise<void> {
    const expiriesItems = await getExpiredPurchaseOrder(PlusmarService.readerClient);
    if (!isEmpty(expiriesItems)) {
      const Client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const pendingOrderIDs = [];
      const pendingPageIDs = [];
      for (let index = 0; index < expiriesItems.length; index++) {
        const { page_id: pageID, order_id: orderID } = expiriesItems[index] as IExpiryPurchaseOrder;
        pendingOrderIDs.push(orderID);
        pendingPageIDs.push(pageID);
      }

      const stringOrderIDs = PostgresHelper.joinInQueries(Array.from(new Set(pendingOrderIDs)));
      const stringPageIDs = PostgresHelper.joinInQueries(Array.from(new Set(pendingPageIDs)));
      await releaseReservedPurchaseOrderItem(Client, stringOrderIDs, stringPageIDs);
      await resetPurchaseOrderExpired(Client, stringOrderIDs, stringPageIDs);

      await PostgresHelper.execBatchCommitTransaction(Client);
    }
  }

  async checkAddressDetail(pipeline: IFacebookPipelineModel, address: IPurchaseOrderPostbackMessageAddress, pageID: number, audienceID: number): Promise<boolean> {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient); // ? PG Start Transaction
      const setNewLocation = true;
      const initateCustomerAddress = {
        address: address.address,
        province: address.province,
        district: address.district,
        post_code: address.post_code,
        city: address.city,
      } as ShippingAddressLocation;

      const shippingAddress = {
        name: address.name,
        phone_number: address.phone_number,
        location: initateCustomerAddress,
      } as CustomerAddress;

      const { location } = await getCustomerAudienceByID(client, audienceID, pageID);
      if (location === null) {
        await updateCustomerAddress(client, pipeline.customer_id, pageID, address.phone_number, initateCustomerAddress); // ? Initiate Customer Address
      } else {
        // ? setNewLocation === true -> On Webview when user check on Update Primary address
        if (setNewLocation) {
          await updateCustomerAddress(client, pipeline.customer_id, pageID, address.phone_number, initateCustomerAddress);
        }
      }

      await this.customerService.updateCustomerAddressToCurrentOrder(pipeline, shippingAddress); // ? Update Shipping Address

      if (pipeline.logistic_id !== null) {
        const logistic = await getLogisticByID(client, pipeline.logistic_id, pageID);
        if (logistic.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T) {
          await this.jAndTExpressService.validateAddress(pipeline.customer_id, pageID, pipeline.order_id, pipeline.logistic_id, audienceID, client);
        }
      }

      await PostgresHelper.execBatchCommitTransaction(client); // ? End PG Transaction

      return true;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      return false;
    }
  }

  async getOrderExistsByVariantID(pageID: number, variantIDs: number[]): Promise<IOrderExistsByVariant[]> {
    const variantExists = await getOrderExistsByVariantID(PlusmarService.readerClient, pageID, variantIDs);
    const variantExistIDs = variantExists?.map((variant) => variant.id) || [];
    const orderExists = variantIDs.map((id) => ({
      variantID: id,
      orderExists: variantExistIDs.some((existID) => existID === id),
    }));
    return orderExists;
  }
}
