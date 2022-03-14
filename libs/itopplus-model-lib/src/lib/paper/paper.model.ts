import { AudienceViewType } from '../audience';
import { ShippingAddressLocation, SourceShippingAddressLocation } from '../customer';
import { IFlashExpressCreateOrderResponse } from '../flash-express';
import { IJAndTExpressResponseData } from '../j&t-express';
import { EnumLogisticDeliveryProviderType, EnumTrackingType } from '../logistics';
import { PaperFileStatus, PaperSize, PaperType } from './paper.model.enum';

export type PaperPayload = ReceiptPayload | LabelPayload;

export interface IPaperRouteParams {
  type: PaperType;
  size: PaperSize;
  orderID: string;
  UUID: string;
  audienceID: string;
  route: AudienceViewType;
}
interface IPaperCommon {
  name: string;
}

export type ReceiptPayload = IPaperCommon;
export type LabelPayload = IPaperCommon;

export interface IPaperRender {
  viewPath: string;
  payload: IPurchaseOrderPaperModel;
}

export type TrackingPayload = IFlashExpressCreateOrderResponse | IJAndTExpressResponseData;
export interface IPurchaseOrderItemListPaperModel {
  index: number;
  productID: number;
  variantID: number;
  itemID: number;
  quantity: number;
  attributes: string;
  productName: string;
}
export interface IPurchaseOrderPaperModel {
  orderID: string;
  aliasOrderID: string;
  trackingNo: string;
  trackingPayload: TrackingPayload;
  deliveryType: EnumLogisticDeliveryProviderType;
  trackingType: EnumTrackingType;
  shopWalletID: string;
  totalPrice: string;
  codEnabled: boolean;
  pageName: string;
  pagePhoneNumber: string;
  sourceLocation: SourceShippingAddressLocation;
  customerName: string;
  customerPhoneNumber: string;
  customerLocation: ShippingAddressLocation;
  expandedTrackingNo?: string;
}

export interface IPaperParam {
  paperSize: PaperSize;
  orderUUID: string;
  pageUUID: string;
  pageID: string;
}
export interface IPaperRequestParam {
  token: string;
  paperSize: PaperSize;
}
export interface IGetPaperRequestParam {
  token: string;
  filename: string;
}

export interface IGeneratePaperPDFResponse {
  reportUrl: string;
  soruceUrl: string;
  filename: string;
}

//TODO: mark for refactor
export type IPaperPuppetMessageParams = {
  type: string;
  token: string;
  paperSize: string;
  filename: string;
};
export interface IPaperPuppetMessageResponse {
  payload: string;
  params: IPaperPuppetMessageParams;
}

export interface IInputPaperSetting {
  size: PaperSize;
  type: PaperType;
}

export interface IPaperFileStatus {
  status: PaperFileStatus;
  latestUpdate: Date;
  subscriptionID: string;
  orderUUID: string;
}
