import { getNumberFromAmount, getTimeStampFromUnix } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumPurchaseOrderStatus,
  ILazadaDataResponse,
  ILazadaOrderItemsResponse,
  ILazadaOrdersReponse,
  IncreaseDecreaseType,
  InventoryChannel,
  IProductIDVariantID,
  IProductLazadaMainResponse,
  IProductUpateInventoryLazadaOrders,
  IProductUpdateInventoryLazadaPayload,
  IPurchaseOrderItemsMarketPlace,
  IPurchaseOrderItemsMarketPlaceUpsertParams,
  IPurchaseOrderItemsToUpdateInventory,
  IPurchaseOrderMarketPlace,
  IPurchaseOrderMarketPlaceUpsertParamsRequired,
  IShopeeOrderDetailItems,
  IShopeeOrderDetailList,
  IShopeeOrderList,
  LazadaOrderStatusTypes,
  OrderChannelTypes,
  OrderMappedTypes,
  ShopeeOrderStatusTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { groupBy, isEmpty } from 'lodash';

export const LAZADA_API_SUCCESS_CODE = '0';
export const SHOPEE_REFRESH_EXPIRE_IN_DAYS = 30;
export const SHOPEE_MAX_ORDER_DETAILS = 50;
export const SHOPEE_PRODUCT_NO_VARIANT_ID = '0';
export const increaseStatuses = [EnumPurchaseOrderStatus.REJECT, EnumPurchaseOrderStatus.MARKET_PLACE_RETURNED, EnumPurchaseOrderStatus.MARKET_PLACE_FAILED];

export const DEFAULT_MORE_COMMERCE_IMAGE = 'https://app.more-commerce.com/assets/icons/icon-72x72.png';

export const getLazadaRequestResult = (responseData: ILazadaDataResponse<IProductLazadaMainResponse>): IHTTPResult => {
  try {
    const { data, message } = responseData || null;
    return LAZADA_API_SUCCESS_CODE === responseData.code ? { status: 200, value: data ? data : true } : { status: 403, value: message ? message : false };
  } catch (error) {
    throw new Error('Not a valid lazada response data');
  }
};
export const getPagesThirdPartySellerURL = (value: string, url: string, pageType: SocialTypes): string => {
  if (!value || !url) throw new Error('Not a valid value to get seller url');
  const sellerURLObj = {
    [SocialTypes.LAZADA]: `${url}/shop/${value.replace(' ', '-').toLowerCase()}`,
    [SocialTypes.SHOPEE]: `${url}/shop/${value.replace(' ', '_').toLowerCase()}`,
  };

  return sellerURLObj[pageType];
};

export const getMappedOrderStatus = (
  status: LazadaOrderStatusTypes[] | ShopeeOrderStatusTypes,
  marketPlaceType: SocialTypes,
  mappedType: OrderMappedTypes,
): EnumPurchaseOrderStatus => {
  if (marketPlaceType === SocialTypes.LAZADA) {
    const lazadaStatus = status as LazadaOrderStatusTypes[];
    const filteredStatus = getLazadaNotCancelStatus(lazadaStatus);
    return mappedType === OrderMappedTypes.MARKETPLACE_TO_ITP ? lazadaToItpMappedStatus[filteredStatus] : itpTolazadaMappedStatus[filteredStatus];
  } else if (marketPlaceType === SocialTypes.SHOPEE) {
    const shopeeStatus = status as ShopeeOrderStatusTypes;
    return mappedType === OrderMappedTypes.MARKETPLACE_TO_ITP ? shopeeToItpMappedStatus[shopeeStatus] : itpToShoppeMappedStatus[shopeeStatus];
  }
};

export const getMarketPlaceIncreaseOrDecrease = (status: EnumPurchaseOrderStatus): IncreaseDecreaseType => {
  const isIncrease = increaseStatuses.includes(status);
  return isIncrease ? IncreaseDecreaseType.INCREASE : IncreaseDecreaseType.DECREASE;
};

const shopeeToItpMappedStatus = {
  [ShopeeOrderStatusTypes.UNPAID]: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
  [ShopeeOrderStatusTypes.READY_TO_SHIP]: EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT,
  [ShopeeOrderStatusTypes.PROCESSED]: EnumPurchaseOrderStatus.MARKET_PLACE_PROCESSED,
  [ShopeeOrderStatusTypes.SHIPPED]: EnumPurchaseOrderStatus.MARKET_PLACE_SHIPPED,
  [ShopeeOrderStatusTypes.COMPLETED]: EnumPurchaseOrderStatus.CLOSE_SALE,
  [ShopeeOrderStatusTypes.CANCELLED]: EnumPurchaseOrderStatus.REJECT,
  [ShopeeOrderStatusTypes.INVOICE_PENDING]: EnumPurchaseOrderStatus.MARKET_PLACE_PENDING,
  [ShopeeOrderStatusTypes.IN_CANCEL]: EnumPurchaseOrderStatus.MARKET_PLACE_IN_CANCEL,
};

const itpToShoppeMappedStatus = {
  [EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT]: ShopeeOrderStatusTypes.UNPAID,
  [EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT]: ShopeeOrderStatusTypes.READY_TO_SHIP,
  [EnumPurchaseOrderStatus.MARKET_PLACE_PROCESSED]: ShopeeOrderStatusTypes.PROCESSED,
  [EnumPurchaseOrderStatus.MARKET_PLACE_SHIPPED]: ShopeeOrderStatusTypes.SHIPPED,
  [EnumPurchaseOrderStatus.CLOSE_SALE]: ShopeeOrderStatusTypes.COMPLETED,
  [EnumPurchaseOrderStatus.REJECT]: ShopeeOrderStatusTypes.CANCELLED,
  [EnumPurchaseOrderStatus.MARKET_PLACE_PENDING]: ShopeeOrderStatusTypes.INVOICE_PENDING,
  [EnumPurchaseOrderStatus.MARKET_PLACE_IN_CANCEL]: ShopeeOrderStatusTypes.IN_CANCEL,
};

const lazadaToItpMappedStatus = {
  [LazadaOrderStatusTypes.UNPAID]: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
  [LazadaOrderStatusTypes.PENDING]: EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT,
  [LazadaOrderStatusTypes.READY_TO_SHIP]: EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT,
  [LazadaOrderStatusTypes.DELIVERED]: EnumPurchaseOrderStatus.CLOSE_SALE,
  [LazadaOrderStatusTypes.SHIPPED]: EnumPurchaseOrderStatus.MARKET_PLACE_SHIPPED,
  [LazadaOrderStatusTypes.CANCELED]: EnumPurchaseOrderStatus.REJECT,
  [LazadaOrderStatusTypes.RETURNED]: EnumPurchaseOrderStatus.MARKET_PLACE_RETURNED,
  [LazadaOrderStatusTypes.FAILED]: EnumPurchaseOrderStatus.MARKET_PLACE_FAILED,
  [LazadaOrderStatusTypes.READY_TO_SHIP_PENDING]: EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT,
  [LazadaOrderStatusTypes.PACKED]: EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT,
  [LazadaOrderStatusTypes.REPACKED]: EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT,
};

const itpTolazadaMappedStatus = {
  [EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT]: LazadaOrderStatusTypes.UNPAID,
  [EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT]: LazadaOrderStatusTypes.PENDING,
  [EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT]: LazadaOrderStatusTypes.READY_TO_SHIP,
  [EnumPurchaseOrderStatus.CLOSE_SALE]: LazadaOrderStatusTypes.DELIVERED,
  [EnumPurchaseOrderStatus.MARKET_PLACE_SHIPPED]: LazadaOrderStatusTypes.SHIPPED,
  [EnumPurchaseOrderStatus.REJECT]: LazadaOrderStatusTypes.CANCELED,
  [EnumPurchaseOrderStatus.MARKET_PLACE_RETURNED]: LazadaOrderStatusTypes.RETURNED,
  [EnumPurchaseOrderStatus.MARKET_PLACE_FAILED]: LazadaOrderStatusTypes.FAILED,
  [EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT]: LazadaOrderStatusTypes.READY_TO_SHIP_PENDING,
  [EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT]: LazadaOrderStatusTypes.PACKED,
  [EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT]: LazadaOrderStatusTypes.REPACKED,
};

export const getLazadaOrderUpdateParams = (pageID: number, order: ILazadaOrdersReponse): IPurchaseOrderMarketPlaceUpsertParamsRequired => {
  const is_auto = false;
  const { payment_method, statuses, order_number, price, created_at, updated_at } = order;
  const is_paid = payment_method === 'COD' || statuses.some((status) => status === LazadaOrderStatusTypes.UNPAID) ? false : true;
  return {
    alias_order_id: String(order_number),
    total_price: getNumberFromAmount(price),
    page_id: pageID,
    created_at: new Date(created_at),
    updated_at: new Date(updated_at),
    discount: 0,
    is_paid,
    is_auto,
    order_channel: OrderChannelTypes.LAZADA,
    status: getMappedOrderStatus(statuses, SocialTypes.LAZADA, OrderMappedTypes.MARKETPLACE_TO_ITP),
    order_json: JSON.stringify(order),
  };
};

export const getShopeeOrderUpdateParams = (pageID: number, order: IShopeeOrderDetailList): IPurchaseOrderMarketPlaceUpsertParamsRequired => {
  const { order_sn, total_amount, create_time, update_time, cod, order_status } = order;
  const shopeeOrderStatus = order_status as ShopeeOrderStatusTypes;
  const is_auto = false;
  return {
    alias_order_id: String(order_sn),
    total_price: +total_amount,
    page_id: pageID,
    created_at: new Date(getTimeStampFromUnix(create_time)),
    updated_at: new Date(getTimeStampFromUnix(update_time)),
    discount: 0,
    is_paid: !cod,
    is_auto,
    order_channel: OrderChannelTypes.SHOPEE,
    status: getMappedOrderStatus(shopeeOrderStatus, SocialTypes.SHOPEE, OrderMappedTypes.MARKETPLACE_TO_ITP),
    order_json: JSON.stringify(order),
  };
};

export const getShopeeOrderItemsUpdateParams = (
  orderID: number,
  pageID: number,
  orderItemResponse: IShopeeOrderDetailItems,
  { productID, variantID }: IProductIDVariantID,
  marketOrders: IPurchaseOrderMarketPlace,
  createdAt: number,
  updatedAt: number,
  orderShopeeExists: IPurchaseOrderItemsMarketPlace,
): IPurchaseOrderItemsMarketPlaceUpsertParams => {
  const { model_original_price, model_quantity_purchased, model_id, item_id } = orderItemResponse;
  const sku = model_id ? model_id : getShopeeCustomVariantID(item_id);
  const { status } = marketOrders;
  const canceledQuantity = getShopeeOrderItemCancelled(status, model_quantity_purchased, orderShopeeExists);
  const marketplace_variant_id = String(model_id);
  return {
    purchase_order_id: orderID,
    product_variant_id: variantID ? variantID : null,
    product_id: productID ? productID : null,
    page_id: pageID,
    item_price: model_original_price,
    item_quantity: model_quantity_purchased,
    purchase_status: status === EnumPurchaseOrderStatus.REJECT || EnumPurchaseOrderStatus.MARKET_PLACE_RETURNED ? false : true,
    order_channel: OrderChannelTypes.SHOPEE,
    sku,
    status: status,
    discount: 0,
    created_at: new Date(getTimeStampFromUnix(createdAt)),
    updated_at: new Date(getTimeStampFromUnix(updatedAt)),
    canceled_quantity: canceledQuantity,
    canceled_count: orderShopeeExists ? canceledQuantity : 0,
    marketplace_type: SocialTypes.SHOPEE,
    order_item_json: JSON.stringify(orderItemResponse),
    marketplace_variant_id,
  };
};

export const getLazadaOrderItemsUpdateParams = (
  orderID: number,
  pageID: number,
  status: EnumPurchaseOrderStatus,
  orderItemResponse: ILazadaOrderItemsResponse,
  { productID, variantID }: IProductIDVariantID,
  orderItemResponseArr: ILazadaOrderItemsResponse[],
  orderItemJson: ILazadaOrderItemsResponse,
): IPurchaseOrderItemsMarketPlaceUpsertParams => {
  const { item_price, paid_price, quantity, created_at, updated_at, sku, status: itemStatus, canceledQuantity } = orderItemResponse;
  return {
    purchase_order_id: orderID,
    product_variant_id: variantID,
    product_id: productID,
    page_id: pageID,
    item_price,
    item_quantity: quantity,
    canceled_quantity: canceledQuantity,
    purchase_status: status === EnumPurchaseOrderStatus.REJECT || EnumPurchaseOrderStatus.MARKET_PLACE_RETURNED ? false : true,
    order_channel: OrderChannelTypes.LAZADA,
    sku,
    status: getMappedOrderStatus([itemStatus], SocialTypes.LAZADA, OrderMappedTypes.MARKETPLACE_TO_ITP),
    discount: item_price - paid_price,
    created_at: new Date(created_at),
    updated_at: new Date(updated_at),
    canceled_count: getLazadaRecentlyOrderItemCancelled(orderItemResponseArr, orderItemJson, sku),
    order_item_json: JSON.stringify(orderItemResponse),
    marketplace_type: SocialTypes.LAZADA,
    marketplace_variant_id: sku,
  };
};

export const getCalulateQuantityOrderItems = (orderItemsResponse: ILazadaOrderItemsResponse[]): ILazadaOrderItemsResponse[] => {
  const groupOrderItemsBySku = groupBy(orderItemsResponse, 'sku');
  return Object.values(groupOrderItemsBySku).map((values: any) => ({
    ...values[0],
    quantity: values.length,
    canceledQuantity: values.filter((value) => value.status === LazadaOrderStatusTypes.CANCELED)?.length || 0,
    quantityJson: values,
  }));
};

export const getLazadaNotCancelStatus = (statuses: LazadaOrderStatusTypes[]): LazadaOrderStatusTypes => {
  if (statuses.length === 1) return statuses[0];
  return statuses.filter((status) => status !== LazadaOrderStatusTypes.CANCELED)[0];
};

export const getLazadaRecentlyOrderItemCancelled = (orderItemResponse: ILazadaOrderItemsResponse[], orderItemStored: ILazadaOrderItemsResponse, orderSKU: string): number => {
  if (!isEmpty(orderItemStored)) {
    const { quantityJson } = orderItemStored || {};
    if (quantityJson?.length === 0) return 0;
    const orderItemResponseCancel = orderItemResponse?.filter(({ status, sku }) => status === LazadaOrderStatusTypes.CANCELED && sku === orderSKU).length || 0;
    const quantityJsonArr = quantityJson as ILazadaOrderItemsResponse[];
    const orderItemStoredCancel = quantityJsonArr?.filter(({ status, sku }) => status === LazadaOrderStatusTypes.CANCELED && sku === orderSKU).length || 0;
    const newCanceledItems = orderItemResponseCancel - orderItemStoredCancel;
    return newCanceledItems;
  } else {
    return 0;
  }
};

export const getProductUpdateInventoryMarketOrderParams = (marketPlaceOrders: IPurchaseOrderItemsToUpdateInventory[]): IProductUpdateInventoryLazadaPayload[] => {
  if (!marketPlaceOrders?.length) return [];
  const productUpateInventoryMarketOrders: IProductUpateInventoryLazadaOrders[] = marketPlaceOrders.map((lazadaOrder) => {
    const { productVariantID: variantID, productID, sku, purchaseOrderID, purchaseOrderItemID, pageID, orderQuantity, orderStatus, canceledCount, orderChannelType } = lazadaOrder;
    const operationType = getMarketPlaceIncreaseOrDecrease(orderStatus);
    const stockToUpdate = operationType === IncreaseDecreaseType.INCREASE ? canceledCount : orderQuantity;
    return {
      purchaseOrderID,
      purchaseOrderItemID,
      productID,
      pageID,
      sku,
      variantID,
      operationType,
      stockToUpdate,
      orderChannelType,
    };
  });
  const lazadaGroupByOrderQueue = groupBy(productUpateInventoryMarketOrders, 'purchaseOrderID');
  //TODO: Puneet I'm found return diffreence type from heare just remove as casting for get more detail
  const lazadaOrderUpdateInvQueueArray: IProductUpdateInventoryLazadaPayload[] = Object.entries(lazadaGroupByOrderQueue).map(([key, value]) => ({
    orderID: key,
    pageID: value[0].pageID,
    orderChannelType: value[0].orderChannelType,
    orderItems: value,
  })) as IProductUpdateInventoryLazadaPayload[];
  return lazadaOrderUpdateInvQueueArray;
};

export const getShopeeOrderItemCancelled = (status: EnumPurchaseOrderStatus, itemQuantity: number, orderItemStored: IPurchaseOrderItemsMarketPlace): number => {
  if (!isEmpty(orderItemStored)) {
    const { status: orderStoredStatus } = orderItemStored;
    const increaseDecreaseType = getMarketPlaceIncreaseOrDecrease(status);
    if (increaseDecreaseType === IncreaseDecreaseType.INCREASE && !increaseStatuses.includes(orderStoredStatus)) {
      return itemQuantity;
    } else {
      return 0;
    }
  } else {
    return 0;
  }
};

export const getOrderIDSlots = (shopeeOrdersList: IShopeeOrderList[]): string[] => {
  const orderNoList = shopeeOrdersList.map(({ order_sn }) => order_sn);
  const orderLength = orderNoList.length;
  const orderSlotArray = [];
  let previousSlot = 0;
  const orderSlot = Math.ceil(orderLength / SHOPEE_MAX_ORDER_DETAILS);
  for (let index = 1; index <= orderSlot; index++) {
    const slot = index * SHOPEE_MAX_ORDER_DETAILS;
    const orderSlot = orderNoList.slice(previousSlot, slot + 1).join(',');
    previousSlot = slot + 1;
    orderSlotArray.push(orderSlot);
  }
  return orderSlotArray;
};

export const getInventoryChannelFromOrderChannel = (orderChannelType: OrderChannelTypes): InventoryChannel => {
  const orderInvChannelObj = {
    [OrderChannelTypes.FACEBOOK_CHAT]: InventoryChannel.MARKETPLAEC_FACEBOOK,
    [OrderChannelTypes.LAZADA]: InventoryChannel.MARKETPLACE_LAZADA,
    [OrderChannelTypes.SHOPEE]: InventoryChannel.MARKETPLACE_SHOPEE,
    [OrderChannelTypes.NO_ORDER]: InventoryChannel.MORE_COMMERCE,
  };
  return orderInvChannelObj[orderChannelType];
};

export const getShopeeCustomVariantID = (shopeeID: number): string => `SHOPEE-V-ID-${shopeeID}`;
