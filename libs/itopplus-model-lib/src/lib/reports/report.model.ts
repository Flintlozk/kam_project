export interface ReportDataResponse {
  purchase_order_id: number;
  createorderdate: string;
  shipping_date: string;
  product_variant_id: number;
  item_price: string;
  item_quantity: number;
  tax: string;
  sku: string;
  tracking_no: string;
  product_id: number;
  proname: string;
  customer_id: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: locationDataResponse;
  logistic_id: string;
  id: number;
  name: string;
  created_at: string;
  update_at: string;
  option: string;
  status: boolean;
  cod_status: boolean;
  fee_type: string;
  page_id: number;
  delivery_type: string;
  delivery_fee: string;
  image: string;
  tracking_url: string;
  contry: string;
  type: string;
  delivery_dats: string;
  tracking_type: string;
}
export interface locationDataResponse {
  street: string;
  address: string;
  district: string;
  province: string;
  city: string;
  post_code: string;
  postalCode: string;
}
export interface reportDetailPriceResponse {
  proOrder: string;
  proName: string;
  proId: string;
  proPrice: string;
  proQty: string;
  proTotal: string;
  isEvent: boolean;
}

export interface priceListDetail {
  discount: string;
  priceAfterDiscount: string;
  priceBeforeIncludeVat: string;
  taxValue: string;
  tax: string;
  total: string;
  shipping: string;
  subtotal: string;
  totalPriceText: string;
}
export interface productDetailList {
  proOrder: number;
  proName: string;
  proPrice: string;
  proQTY: string;
  proTotal: string;
  isEvent: boolean;
}

export interface reportPDF {
  label1: string;
  label2: string;
}
export interface reportDetailReponse {
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerAddres: string;
  orderID: string;
  createDate: string;
  shippingDate: string;
  subtotal: string;
  shipping: string;
  discount: string;
  total: string;
  totalString: string;
  tax: string;
  trackingNo: string;
  taxValue: string;
  productDetail: reportDetailPriceResponse[];
  priceDetail: PriceDetailResponse[];
}

export interface priceObjDetailResponse {
  totalPrice: string;
  subtotal: string;
  discount: string;
  totalPriceText: string;
  taxValue: string;
  vatString: string;
  priceAfterDiscount: string;
  priceBeforeIncludeVat: string;
  priceDetail: PriceDetailResponse[];
}
export interface PriceDetailResponse {
  discount: string;
  priceAfterDiscount: string;
  priceBeforeIncludeVat: string;
  shipping: string;
  vatValue: string;
  vat: string;
  total: string;
  totalString: string;
}

export interface multipleReportResponse {
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerAddress: string;
  orderID: string;
  createDate: string;
  shippingDate: string;
  trackingNo: string;
  productDetail: productDetailList[];
  priceDetail: PriceDetailResponse[];
}
export interface optionLogistic {
  type: string;
  tracking_generate_status: boolean;
  tracking_start_numbers: string;
  tracking_end_numbers: string;
  wallet_id: string;
}
export interface groupPurchaseByInOBJ {
  customerName: string;
  customerLastName: string;
  customerPhone: string;
  customerAddress: string;
  trackingNo: string;
  createDate: string;
  orderID: string;
  shippingDate: string;
  shippingName: string;
  shippingPrice: string;
  vat: string;
  discount: number;
  customer_detail: CustomerData[];
  productList: ProductListObj[];
  priceDetail: PriceDetailResponse[];
  sortLineCode: string;
  dstStoreName: string;
  sortCode: sortCodeObj;
  sortingCodeJandT: string;
  cod_value: string;
  printTime: string;
}
export interface CustomerData {
  detail: string;
  tracking_type: string;
  post_code1: string;
  post_code2: string;
  post_code3: string;
  post_code4: string;
  post_code5: string;
  trackingNo: string;
  sortLineCode: string;
  customerName: string;
  customerAddress: string;
  customerPhone: string;
  customerName_Phone: string;
}
export interface ProductListObj {
  proOrder: number;
  proName: string;
  proPrice: string;
  proQty: number;
  proTotal: number;
  proDuctAttribute: string;
  isEvent: boolean;
}
export interface flashReportReponse {
  name: string;
  payload: payloadObj;
  customer_id: string;
  tracking_no: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: locationDataResponse;
}
export interface payloadObj {
  code: number;
  message: string;
  data: dataPayloadObj;
  responseitems: JandTResponseItemReport[];
}
export interface JandTResponseItemReport {
  sortingcode: string;
}
export interface dataPayloadObj {
  pno: string;
  mchId: string;
  outTradeNo: string;
  sortCode: string;
  lineCode: string;
  sortingLineCode: string;
  dstStoreName: string;
  earlyFlightEnabled: boolean;
  packEnabled: boolean;
}
export interface sortCodeObj {
  sortCode1: string;
  sortCode2: string;
  sortCode3: string;
}
export interface customerDetail1 {
  receiptName: string;
  receiptAddress: string;
}
export interface customerDetail2 {
  receiptName2: string;
  receiptTel: string;
  receiptAddress: string;
}
export interface reportFlashResponse {
  sortCode: sortCodeObj[];
  dstStoreName: string;
  customerData1: customerDetail1;
  customerData2: customerDetail2;
  trackingNumber: string;
  pickuptime: string;
}
export interface reportAllType {
  flash: string[];
  thaipost_maunal: string[];
  thaipost_dropOff: string[];
  thaipost_book: string[];
  jandt_maunal: string[];
  jandt_dropOff: string[];
  jandt_cod: string[];
}

export interface logisticTrackingDetail {
  delivery_type: string;
  tracking_type: string;
  cod_status: boolean;
  uuid: string;
}
