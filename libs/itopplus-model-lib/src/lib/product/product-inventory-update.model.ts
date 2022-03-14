import { SocialTypes } from '../pages/pages.enum';
import { InventoryChannel, OrderChannelTypes } from '../purchase-order/purchase-order.model';
import { IncreaseDecreaseType } from './product-marketplace.model';

export const PRODUCT_UPDATE_INVENTORY_QUEUE_MAX_RETRY = 3;

export interface IProductUpdateInventoryQueue {
  id: number;
  toUpdate: boolean;
  pageID: number;
  maxRetry: number;
  retry: number;
  orderChannelType: OrderChannelTypes;
  orderID?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
export interface IProductUpdateInventoryQueuePayload {
  pageID: number;
  orderID: string;
  orderChannelType: OrderChannelTypes;
  toUpdate: boolean;
  maxRetry?: number;
}

export interface IProductVariantUpdateInventoryCalcPayload {
  variantID: number;
  productID: number;
  operationType: IncreaseDecreaseType;
  stockToUpdate: number;
  inventoryChannel: InventoryChannel;
}
export interface IProductUpdateInventoryQueueItemsPayload {
  queueID: number;
  pageID: number;
  productID: number;
  variantID: number;
  stockToUpdate: number;
  operationType: IncreaseDecreaseType;
  marketPlaceType: SocialTypes;
  errorText?: string;
  isSuccess?: boolean;
}
export interface IProductUpdateInventoryQueueItems {
  queueID: number;
  queueItemID: number;
  pageID: number;
  productID: number;
  variantID: number;
  stockToUpdate: number;
  operationType: IncreaseDecreaseType;
  marketPlaceType: SocialTypes;
  orderChannelType: OrderChannelTypes;
  orderID?: string;
  errorText?: string;
  isSuccess?: boolean;
}

export interface IProductVariantCurrentInventory {
  variantID: number;
  pageID: number;
  productID: number;
  inventory: number;
  sku: string;
}

export interface IProductVariantIDInventory {
  variantID: number;
  inventory: number;
  currentInventory: number;
}

export interface IProductVariantUpdateInventoryMarketPlace extends IProductVariantUpdateInventoryCalcPayload {
  marketPlaceType: SocialTypes;
}

export interface IProductUpdateInventoryQueueResponse {
  queueID: number;
  pageID: number;
}

export interface IVariantConnectedMarketPlaces {
  variantID: number;
  productID?: number;
  marketPlaceType: SocialTypes;
}

export interface IProductUpdateInventoryProcessQueue {
  queueID: number;
  queueItemID: number;
  stockToUpdate: number;
  marketPlaceType: SocialTypes;
  operationType: IncreaseDecreaseType;
  maxRetry: number;
  retry: number;
  pageID: number;
  variantID: number;
  productID: number;
  orderID: string;
  orderChannelType: OrderChannelTypes;
}

export interface IProductUpdateInventoryQueueItemStatus {
  pageID: number;
  queueID: number;
  queueItemID: number;
  isSuccess: boolean;
  errorText: string;
}

export interface IMarketPlaceUpdateInventoryQueueResponse {
  marketPlace: SocialTypes;
  isSuccess: boolean;
  errorText: string;
  variantID: number;
}

export interface IProductMarketPlaceVariantUpdateInventory {
  id: number;
  productMarketPlaceID: number;
  variantID: number;
  marketPlaceSKU: string;
}

export interface IProductUpdateInventoryLazadaPayload {
  orderID: string;
  pageID: number;
  orderItems: IProductUpateInventoryLazadaOrders[];
  orderChannelType: OrderChannelTypes;
}

export interface IProductUpateInventoryLazadaOrders {
  purchaseOrderID: number;
  purchaseOrderItemID: number;
  productID: number;
  pageID: number;
  sku: string;
  variantID: number;
  operationType: IncreaseDecreaseType;
  stockToUpdate: number;
  orderChannelType: OrderChannelTypes;
}

export interface IPurchaseOrderItemByOrderVariantID {
  id: number;
  itemQuantity: number;
  canceledQuantity: number;
  canceledCount: number;
}
