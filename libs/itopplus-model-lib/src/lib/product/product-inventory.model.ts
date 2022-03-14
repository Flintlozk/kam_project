import { IProductVariantUpdateInventoryCalcPayload } from './product-inventory-update.model';

export enum ProductInCartAction {
  CREATE = 'CREATE',
  REMOVE = 'REMOVE',
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}

export interface IProductInventoryUpdateVariant {
  variantID: number;
  inventory: number;
}
export interface IProductInventoryDifferentPayload {
  different: IProductInventoryDifferent[];
}
export interface IProductInventoryDifferent {
  createList: IProductCartAction[];
  increaseList: IProductCartAction[];
  decreaseList: IProductCartAction[];
  removeList: IProductCartAction[];
}

export interface IProductCartAction {
  orderID: number;
  productID?: number;
  variantID?: number;
  orderItemID?: number;
  currentQuantity: number;
  newQuantity: number;
  action: ProductInCartAction;
}
export type ProductInventoryCronPayload =
  | IProductInventoryCronPayload
  | IProductInventoryCronUpdateCartPayload
  | IProductInventoryCronUpdateInventoryPayload
  | IProductInventoryCronUpdateInventoryV2Payload;
export interface IProductInventoryCronPayload {
  isRecursion: boolean;
  pageID: number;
  subscriptionID: string;
  orderID?: number;
  audienceID?: number;
}
export interface IProductInventoryCronUpdateCartPayload extends IProductInventoryCronPayload {
  different?: IProductInventoryDifferent;
}
export interface IProductInventoryCronUpdateInventoryPayload extends IProductInventoryCronPayload {
  queueID: number;
}
export interface IProductInventoryCronUpdateInventoryV2Payload extends IProductInventoryCronPayload {
  processID: string;
  inventory: IProductVariantUpdateInventoryCalcPayload[];
}

export interface IProductInventoryNatsData {
  pageID: number;
  uniqueKey: number;
}

export interface IProductUpdateInventory {
  pageID: number;
  orderID?: number;
  inventory: IProductVariantUpdateInventoryCalcPayload[];
}
