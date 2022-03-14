import { IMoreImageUrlResponse } from '@reactor-room/model-lib';

export interface DetailsubProductLowInventory {
  subIsLower: boolean;
  subImages?: IMoreImageUrlResponse[];
  subNameProductVariant: string;
  subInventory: number;
  subUnit_price: number;
  subWithhold: number;
  subUnpaid: number;
  subRevenue: number;
}

export interface IProductLowInventoryList {
  id: number;
  name: string;
  createdAt: Date;
  images?: IMoreImageUrlResponse[];
  subProductLowInventory: DetailsubProductLowInventory[];
  variants: number;
  isLower: boolean;
  inventory: number;
  withhold: number;
  unpaid: number;
  revenue: number;
  totalrows?: number;
  status?: boolean;
  idIndex?: number;
}

export interface IProductLowStockTotal {
  sumLowStock: number;
}
