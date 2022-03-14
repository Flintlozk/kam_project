export interface IJAndTExpressResponseData {
  logisticproviderid: string;
  responseitems: Array<IJAndTResoinseItems>;
}

export interface IJAndTResoinseItems {
  success: string;
  reason: string;
  mailno?: string;
  billcode?: string;
  reportUrl?: string;
  sortingcode?: string;
  txlogisticid?: string;
  tracesList?: IJAndTTrakingInfo;
}

export interface IJAndTTrakingInfo {
  billcode: string;
  details: Array<any>;
  scanPics: string;
  txlogisticid: string;
}

export interface IJAndTItem {
  itemname: string;
  number: number;
  itemvalue: number;
  desc: string;
}

export interface IJAndTJsonAddress {
  city: string;
  area: string;
  area_code: number;
  city_code: number;
}

export interface IJAndAddress {
  city: string;
  area: string;
  area_code: string;
  city_code: string;
}

export interface IJAndTPickUpDate {
  createordertime: string;
  sendstarttime: string;
  sendendtime: string;
}

export interface IJAndTAddressInfo {
  name: string;
  postcode: string;
  mobile: string;
  phone: string;
  city: string;
  area: string;
  address: string;
}

export interface IJAndTSenderAndRecieverInfo {
  sender: IJAndTAddressInfo;
  receiver: IJAndTAddressInfo;
}

export interface ILogisterInterface {
  actiontype: string;
  customerid: string;
  txlogisticid: string;
  ordertype: number;
  servicetype: string;
  deliverytype: number;
  sender: IJAndTAddressInfo;
  receiver: IJAndTAddressInfo;
  createordertime: string;
  sendstarttime: string;
  sendendtime: string;
  paytype: number;
  isinsured: number;
  shopid: string;
  items: IJAndTItem[];
}
