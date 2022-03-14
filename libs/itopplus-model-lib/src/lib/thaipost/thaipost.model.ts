import { ILogisticConfig } from '../logistics';

import { EnumThaiPostOrderType } from './thaipost.enum';

export class ThaiPostConfig implements ILogisticConfig {
  type: string;
}
export interface IThaipostDropOffSubscription {
  pageID: number;
  subscriptionID: string;
  orderID: number;
}
export interface IThaiPostShippingPrice {
  '250': number;
  '500': number;
  '1000': number;
  '2000': number;
  '3500': number;
  '5000': number;
  '7500': number;
  '10000': number;
  '15000': number;
  '20000': number;
}
export interface IThaiPostShippingPriceChart {
  default: IThaiPostShippingPrice;
  inSource: IThaiPostShippingPrice;
  outSource: IThaiPostShippingPrice;
}

export interface IThaiPostResponse {
  errorCode: string;
  errorDetail: string;
  status: boolean;
}

export interface IThaiPostCancelOrderParams {
  barcode: string;
}
export interface IThaiPostCreateOrderParams {
  orderId: string;
  invNo: string;
  barcode: string;
  shipperName?: string;
  shipperAddress?: string;
  shipperDistrict?: string;
  shipperProvince?: string;
  shipperZipcode?: string;
  shipperEmail?: string;
  shipperMobile?: string;
  cusName: string;
  cusAdd: string;
  cusAmp: string;
  cusProv: string;
  cusZipcode: string;
  cusTel: string;
  productPrice: number;
  productInbox: string;
  productWeight: number;
  orderType: EnumThaiPostOrderType;
  insurance?: string;
  insuranceRatePrice?: number;
  merchantId?: string;
  merchantZipcode?: string;
  manifestNo?: string;
  storeLocationNo?: string;
}
