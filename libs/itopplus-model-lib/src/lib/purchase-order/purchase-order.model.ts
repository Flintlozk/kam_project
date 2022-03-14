import * as Joi from 'joi';
import { AudiencePlatformType, IMoreImageUrlResponse } from '@reactor-room/model-lib';
import { ILazadaOrderItemsResponse, PaperSize, PaperType, SocialTypes } from '@reactor-room/itopplus-model-lib';
import gql from 'graphql-tag';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import * as JoiDate from 'joi-date-dayjs';
import { OpenAPIPayLoad } from '../auth/auth.model';
import { CustomerAddress, CustomerAddressFromGroup } from '../customer/customer.model';
import { WebhookQueries } from '../facebook';
import { PipelineStepTypeEnum } from '../facebook/pipeline-model/pipeline-steps.enum';
import type { ILogisticModel } from '../logistics';
import { EnumLogisticDeliveryProviderType, EnumLogisticFeeType, EnumTrackingType } from '../logistics';
import { IPayment2C2PResponse } from '../order-history/order-history.model';
import { EnumBankAccountType, EnumPaymentType } from '../payment/payment.enum';
import type { IOmiseChargeDetail, IPaypalPaymentResponse, PaymentDetail } from '../payment/payment.model';
import {
  EnumHandleResponseMessageType,
  EnumPurchaseOrderStatus,
  EnumPurchaseOrderSubStatus,
  EnumPurchasingPayloadType,
  PaypalPaymentIntent,
  PaypalPaymentLinksRelEnum,
  PaypalPaymentStatus,
} from './purchase-order.enum';

dayjs.extend(utc);

Joi.extend(JoiDate);

export const PURCHASE_ORDER_RECEIVED = 'PURCHASE_ORDER_RECEIVED';

export interface IChangePaymentInput {
  audienceID: number;
  orderID: number;
  changeTo: EnumPaymentType;
}

export interface IPrintingRouteParams {
  type: PaperType;
  size: PaperSize;
  orderID: string;
  UUID: string;
  audienceID: string;
}

export interface IUpdateShippingAddressArgs {
  orderID: number;
  audienceID: number;
  shippingAddress: CustomerAddressFromGroup;
}

export interface IOrderExistsByVariant {
  variantID: number;
  orderExists: boolean;
}

export interface OrderFilters {
  id: string;
  startDate: string;
  endDate: string;
  search: string;
  status: string;
  pageSize: number;
  currentPage: number;
  orderBy: string[];
  orderMethod: string;
  exportAllRows?: boolean;
}

export interface OrderSettings {
  taxAmount: number;
  taxStatus: boolean;
  flatRate: boolean;
  deliveryFree?: number;
}
export interface IGetPriceCalculator {
  subtotal: string;
  shipping: string;
  tax: string;
  total: string;
}

export interface PurchaseOrderPostbackMessage extends WebhookQueries {
  type: PipelineStepTypeEnum;
  response_type: EnumHandleResponseMessageType;
  address?: string; // IPurchaseOrderPostbackMessageAddress;
  action: string;
}
export interface IPurchaseOrderPostbackSelectLogistic {
  logisticID: number;
}
export interface IPurchaseOrderPostbackSelectPayment {
  paymentType: EnumPaymentType;
}

export interface IPurchaseOrderPostbackMessageAddress {
  name: string;
  phone_number: string;
  address: string;
  post_code: string;
  district: string;
  city: string;
  province: string;
}

export interface IPurchaseOrderPostbackAddProductViaShareLink {
  variant: number;
  quantity: number;
}
export interface IPurchaseOrderPostbackAddItemToCartCatalog {
  productID: number;
  variantID: number;
  quantity: number;
}

export interface IPurchaseOrderPostbackPaypal {
  audienceId: string;
  psid: string;
  type: string;
}

export interface ProductVariantOrderPostbackMessage extends PurchaseOrderPostbackMessage {
  variant: string;
  quantity: string;
}

export interface TransactionCheckerBody {
  psid: string;
  type: EnumPurchasingPayloadType;
  audienceId: string;
}

export interface IOmiseInitTransaction extends TransactionCheckerBody {
  responseType: EnumHandleResponseMessageType;
  source?: string;
  token?: string;
  action: string;
}

export interface IPurchaseOrderRelationIDs {
  orderID: number;
  audienceID: number;
  paymentID: number;
  logisticID: number;
  bankAccountID: number;
  userID: number;
  aliasOrderID: string;
  UUID: string;
}
export interface PurchaseInventory {
  id: number;
  sku: string;
  stock: number;
  inventory: number;
}

export interface PaypalAuthResponse {
  scope: string;
  access_token: string;
  token_type: string;
  app_id: string;
  expires_in: number;
  nonce: string;
}

export interface IPaypalOrderModel {
  description: string;
  custom_id: string;
  amount: {
    value: number;
    currency_code: string;
  };
}

export interface PaypalPaymentPayerResponse {
  name: { given_name: string; surname: string };
  email_address: string;
  payer_id: string;
  address: { country_code: string };
}
export interface PaypalPaymentPurchaseUntisResponse {
  reference_id: string;
  amount: { currency_code: string; value: string };
  payee: { email_address: string; merchant_id: string };
  description: string;
  custom_id: string;
  shipping: {
    method: string;
    name: { full_name: string };
    address: { address_line_1: string; address_line_2: string; admin_area_2: string; admin_area_1: string; postal_code: string; country_code: string };
  };
  payments: {
    captures: [
      {
        id: string;
        status: string;
        status_details: { reason: string };
        amount: { currency_code: string; value: string };
        final_capture: true;
        seller_protection: { status: 'string'; dispute_categories: [string] };
        custom_id: string;
        links: [{ href: string; rel: string; method: string }];
        create_time: Date;
        update_time: Date;
      },
    ];
  };
}

export interface PaypalPaymentLinksResponse {
  href: string;
  rel: PaypalPaymentLinksRelEnum;
  method: string;
}

export interface IPaypalPaymentDetail {
  id: string;
  intent: PaypalPaymentIntent;
  status: PaypalPaymentStatus;
  purchase_units: PaypalPaymentPurchaseUntisResponse[];
  payer: PaypalPaymentPayerResponse;
  create_time: Date;
  update_time: Date;
  links: PaypalPaymentLinksResponse[];
}

export interface POMessageAddToCart extends PurchaseOrderPostbackMessage {
  quantity: number;
  value: number;
  id: number;
  variant: number;
}
export interface POMessageConfirmOrder extends PurchaseOrderPostbackMessage {
  quantity: number;
  value: number;
  id: number;
  variant: number;
}
export interface POEdittingAddress extends PurchaseOrderPostbackMessage {
  quantity: number;
  value: number;
  id: number;
  variant: number;
  psid: string;
  name: string;
  phone_number: string;
  address: string;
  province: string;
  district: string;
  post_code: string;
}

export interface PurchaseOrderResponse {
  status: number;
  message: string;
}

export interface PurchaseOrderStats {
  all_po: number;
  all_total: number;
  follow_po: number;
  follow_total: number;
  waiting_payment_po: number;
  waiting_payment_total: number;
  confirm_po: number;
  confirm_total: number;
  waiting_shipment_po: number;
  waiting_shipment_total: number;
  close_po: number;
  close_total: number;
  expired_po: number;
  reject_po: number;
}

export interface PurchaseOrderList {
  customerId: number;
  uuid: string;
  audienceId: number;
  orderNo: string;
  createdOrder: string;
  customerName: string;
  customerImgUrl: string;
  totalPrice: string;
  status: EnumPurchaseOrderStatus;
  actionStatus?: boolean;
  totalrows: number;
  delivery_type: string;
  tracking_url: string;
  shipping_date: string;
  tracking_no: string;
  customerPlatform: string;
}

export interface OrderProductList {
  orderItemId: number;
  variantId: number;
  productId: number;
  productName: string;
  productImage: string;
  attributes: string;
  totalPrice: string;
  quantity: number;
  unitPrice: string;
}

export interface PurchasePageDetail {
  name: string;
  currency: string;
}

export interface CheckProductsAvaliable {
  id: number;
  product_id: number;
  in_stock: number;
  inventory: number;
  reserved: number;
  status: number;
  active: boolean;
}
export interface IProductVaraintsOnCheckingStock {
  variant_id: number;
  product_id: number;
  name: string;
  attribute: string;
  inventory: number;
  status: number;
  reserved: number;
  withholding: number;
}

export interface PurchaseCustomerDetail extends CustomerAddress {
  first_name: string;
  last_name: string;
  profile_pic: string;
  psid: string;
  id: number;
  customer_id: number;
  page_id: number;
  domain: string;
  status: string;
  created_at: Date;
}

export interface PayloadOption {
  orderId: number;
  payment?: PaymentDetail[];
  address?: CustomerAddress;
  product?: PurchaseOrderProducts[];
  logistic?: ILogisticModel[];
  shopDetail?: PurchasePageDetail;
  customerDetail?: CustomerAddress;
  advanceMessage?: PayloadMessages;
  shipping?: PurchaseOrderShippingDetail;
}
export interface PayloadParams {
  webViewUrl: string;
  PSID: string;
  audienceID: number;
  pageID: number;
  hashKey: string;
}

export interface PayloadMessages {
  title: string;
  subtitle: string;
}
export interface LeadPayloadParams extends PayloadParams {
  formID: number;
  refID?: string;
}

export interface ReceiptDetail extends PayloadOption {
  paidWith: string;
  flatPrice: number;
  flatRate: boolean;
  tax: number;
  taxIncluded: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface AdvanceMessage {
  title: string;
  subtitle: string;
}
export interface PipelineCustomerAddress {
  advanceMessage: AdvanceMessage;
  address: CustomerAddress;
}

export interface PurchaseOrderProducts {
  orderId: number;
  orderItemId: number;
  totalPrice: string;
  variantId: number;
  productId: number;
  productName: string;
  productImage: string;
  attributes: string;
  unitPrice: number;
  quantity: number;
  isSold: boolean;
  images?: IMoreImageUrlResponse[];
  caution: string[];
  inventory: number;
}

export interface IProductCheckList {
  productID: number;
  variantID: number;
  quantity: number;
  isSold: boolean;
}
export interface CreatePurchaseOrder {
  orderId: number;
  products: PurchaseOrderProducts[];
}
export interface UpdatePurchaseOrder {
  orderId: number;
  audienceId: number;
  isAuto: boolean;
  platform: AudiencePlatformType;
  products: PurchaseOrderProducts[];
}

export interface PurchaseOrderPaymentBank {
  id: number;
  payment_id: number;
  branch_name: string;
  account_name: string;
  account_id: string;
  status: boolean;
  type: EnumBankAccountType;
}

export interface IPurchaseOrderPaymentDetail {
  id: number;
  type: EnumPaymentType;
  bankAccountId: number;
  bank: PurchaseOrderPaymentBank;
  isPaid: boolean;
  paidAmount: number;
  paidDate: Date;
  paidTime: string;
  paidProof: string;
}

export interface PurchaseOrderCustomerLocation {
  address: string;
  district: string;
  postCode: string;
  province: string;
  city: string;
  country: string;
}

export interface PurchaseOrderCustomerDetail {
  name: string;
  phoneNumber: string;
  location: PurchaseOrderCustomerLocation;
  isConfirm: boolean;
}

export interface PurchaseOrderShippingDetail {
  id: number;
  name: string;
  type: EnumLogisticDeliveryProviderType;
  trackingType: EnumTrackingType;
  flatRate: boolean;
  isAutoGeneratyeTrackingNo: boolean;
  deliveryFee: number;
  trackingUrl: string;
  trackingNo: string;
  isActive: boolean;
}

export interface IExpiryPurchaseOrderItems {
  order_id: number;
  page_id: number;
  purchase_order_item_id: number;
}
export interface IExpiryPurchaseOrder {
  order_id: number;
  page_id: number;
}

export interface IPurchaseOrerErrors {
  isFixed: boolean;
  typename: EnumPurchaseOrderSubStatus;
  message?: string;
  allow?: boolean;
}
export interface IPurchaseOrder {
  orderId: number;
  uuid: string;
  audienceId: number;
  totalPrice?: string;
  status: string;
  tax: number;
  taxIncluded: boolean;
  shipping: PurchaseOrderShippingDetail;
  customerDetail: PurchaseOrderCustomerDetail;
  createdAt: Date;
  payment: IPurchaseOrderPaymentDetail;
  flatRate: boolean; // define new definition TRUE mean using logistic system
  deliveryFee: number;
  products: PurchaseOrderProducts[];
  isAuto: boolean;
  platform: AudiencePlatformType;
  discount?: number;
  aliasOrderId?: string;
  errors?: IPurchaseOrerErrors[];
}

export interface IPurhcaseOrderLogistic {
  id?: number;
  purchase_order_id: number;
  logistic_id: number;
  tracking_type: EnumTrackingType;
  fee_type: EnumLogisticFeeType;
  delivery_fee: number;
  delivery_type: EnumLogisticDeliveryProviderType;
  cod_status: boolean;
  courier_pickup: boolean;
  created_at: Date;
  updated_at: Date;
}

type IPurhcaseOrderPaymentPayload = IPayment2C2PResponse | IPaypalPaymentResponse | IOmiseChargeDetail;
export interface IPurhcaseOrderPayment {
  id?: number;
  purchase_order_id: number;
  payment_id: number;
  type?: EnumPaymentType;
  payload: IPurhcaseOrderPaymentPayload;
  transaction_id: string;
  is_refund: boolean;
}

export interface IPurchasingOrderTrackingInfo {
  id: number;
  aliasOrderId?: string;
  purchase_order_id: number;
  delivery_type?: EnumLogisticDeliveryProviderType; // Have to move to IPurhcaseOrderLogistic
  logistic_id?: number; // Have to move to IPurhcaseOrderLogistic
  active: boolean;
  tracking_no: string;
  tracking_url: string;
  shipping_date: string;
  shipping_time: string;
  payload: string;
  created_at: Date;
  updated_at: Date;
  version?: number;
}

export interface IPurchaseOrderPipeline {
  pipeline: EnumPurchaseOrderStatus;
  audienceID: number;
  psid?: string;
  pageID: number;
  orderID: number;
  //
  paymentID?: number;
  bankAccountID?: number;
  logisticID?: number;
  //
  createdAt: Date;
  updatedAt: Date;
}

export interface IPurchaseOrderSubscription {
  pageID: number;
  audienceID: number;
  orderID: number;
}

export interface PurchaseOrderModel {
  id: number;
  page_id: number;
  uuid: string;
  audience_id: number;
  payment_id: number;
  logistic_id: number;
  bank_account_id: number;
  flat_rate: boolean;
  delivery_fee: number;
  tax: number;
  tax_included: boolean;
  total_price: number;
  status: EnumPurchaseOrderStatus;
  shipping_address: PurchaseOrderCustomerDetail;
  description: string;
  created_at: Date;
  updated_at: Date;
  is_paid: boolean;
  tracking_no: string;
  paid_amount: number;
  paid_date: Date;
  paid_time: string;
  paid_proof: string;
  create_unixtime?: number;
  update_unixtime?: number;
  is_auto: boolean;
  platform: AudiencePlatformType;
  aliasOrderId?: string;
  alias_order_id?: string;
}

export interface IPurchasingOrderQuickpayWebHook {
  total_price: number;
  description: string;
  customer_id: number;
}

export interface TrackingOrderDetail {
  trackingNo: string;
  trackingUrl: string;
  shippingDate: Date;
  shippingTime: string;
  logisticName: string;
  logisticType: string;
}

export interface PurchaseOrderItems {
  id: number;
  purchase_order_id: number;
  product_variant_id: number;
  product_id: number;
  audience_id: number;
  item_price: number;
  item_quantity: number;
  purchase_status: boolean;
  params1: string;
  params2: string;
  params3: string;
  params4: string;
  created_at: Date;
  updated_at: Date;
  page_id: number;
  is_reserve: boolean;
  discount: number;
}

export interface PaymentShippingDetail {
  customerDetail?: PurchaseOrderCustomerDetail;
  paymentDetail?: IPurchaseOrderPaymentDetail;
  shippingDetail?: PurchaseOrderShippingDetail;
  toggleShipment?: boolean;
  flatRate?: boolean;
  stepIndex?: number;
  amount?: number;
  type: string;
  orderIDs?: number[];
}

export enum OrderChannelTypes {
  SHOPEE = 'SHOPEE',
  LAZADA = 'LAZADA',
  LINE = 'LINE',
  FACEBOOK_CHAT = 'FACEBOOK_CHAT',
  FACEBOOK_MARKET_PLACE = 'FACEBOOK_MARKET_PLACE',
  CMS = 'CMS',
  NO_ORDER = 'NO_ORDER',
}

export enum InventoryChannel {
  MORE_COMMERCE = 'MORE_COMMERCE',
  MARKETPLACE_SHOPEE = 'MARKETPLACE_SHOPEE',
  MARKETPLACE_LAZADA = 'MARKETPLACE_LAZADA',
  MARKETPLAEC_FACEBOOK = 'MARKETPLAEC_FACEBOOK',
}

export interface IMarketPlaceOrderDetails {
  id: number;
  marketPlaceOrderID: string;
  status: string;
  totalPrice: number;
  paymentMethod: string;
  itemCount: string;
  shippingFee?: string;
  marketOrderStatus: string;
  customerName?: string;
  createdAt: Date;
  orderItems: IMarketPlaceOrderItemDetails[];
}

export interface IMarketPlaceOrderItemDetails {
  sku: string;
  discount: number;
  productID?: number;
  unitPrice: number;
  productImage: string;
  productVariantID?: number;
  name: string;
  productMarketLink: string;
  quantity: number;
  purchaseOrderItemID: number;
}

export interface IMarketPlaceOrderDetailsParams {
  marketPlaceOrderID: string;
  pageID: number;
  orderChannel: OrderChannelTypes;
}

export interface IPurchaseOrderMarketPlaceUpsertParamsRequired {
  total_price: number;
  status: EnumPurchaseOrderStatus;
  page_id: number;
  created_at: Date;
  updated_at: Date;
  is_paid: boolean;
  is_auto: boolean;
  discount: number;
  order_channel: OrderChannelTypes;
  alias_order_id: string;
  order_json: string;
}

export interface IPurchaseOrderItemsMarketPlaceUpsertParams {
  purchase_order_id: number;
  product_variant_id: number;
  product_id: number;
  page_id: number;
  item_price: number;
  item_quantity: number;
  canceled_quantity: number;
  purchase_status: boolean;
  order_channel: string;
  discount: number;
  sku: string | number;
  status: EnumPurchaseOrderStatus;
  created_at: Date;
  updated_at: Date;
  order_item_json: string;
  canceled_count: number;
  marketplace_type: SocialTypes;
  marketplace_variant_id: string;
}
export interface IPurchaseOrderLazadaUpsertParams extends IPurchaseOrderMarketPlaceUpsertParamsRequired {
  delivery_fee?: number;
  paid_amount?: number;
  tax_included?: boolean;
  uuid?: string;
  description?: string;
  paid_date?: number;
  flat_rate?: boolean;
  paid_time?: number;
  payment_id?: number;
  bank_account_id?: number;
  paid_proof?: number;
  shipping_date?: Date;
  tax?: number;
  shipping_time?: string;
  tracking_no?: number;
  tracking_url?: string;
  logistic_id?: number;
  shipping_address?: string;
  audience_id?: number;
  expired_at?: Date;
}

export interface IPurchaseOrderMarketPlace {
  orderID: number;
  marketPlaceOrderID: string;
  pageID: number;
  orderChannel: OrderChannelTypes;
  status: EnumPurchaseOrderStatus;
  createdAt: string;
  updatedAt: string;
}

export interface IPurchaseOrderItemsMarketPlace {
  id: number;
  pageID: number;
  purchaseOrderID: number;
  status: EnumPurchaseOrderStatus;
  orderChannel: OrderChannelTypes;
  orderItemJson: ILazadaOrderItemsResponse;
}

export interface IPurchaseOrderItemsToUpdateInventory {
  purchaseOrderID: number;
  purchaseOrderItemID: number;
  productMarketVariantID: number;
  productID: number;
  productVariantID: number;
  pageID: number;
  sku: string;
  orderStatus: EnumPurchaseOrderStatus;
  orderQuantity: number;
  canceledQuantity: number;
  canceledCount: number;
  orderChannelType: OrderChannelTypes;
}

export interface UpdatedPaymentValue {
  paymentMethod: string;
  bankAccount: number;
  datetime: Date;
  hour: string;
  money: number;
  paymentStatus: string | boolean;
  imagePayment: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any;
}

export interface UpdatePurchasePaymentInput {
  orderId: number;
  bankAccount: number;
  audienceId: number;
  imagePayment: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  file: any;
  paymentStatus: boolean;
  amount: number;
  date: Date;
  time: string;
  uuid: string;
  platform: AudiencePlatformType;
}
export interface TrackingTypeDetail {
  cod_status: boolean;
  delivery_type: string;
  tracking_type: string;
}

export interface TrackingNoInput {
  shippingDate: Date;
  shippingTime: string;
  trackingUrl: string;
  trackingNo: string;
}

export interface IPurchasingOrderFailedHistory {
  _id?: string;
  pageID: number;
  orderID: number;
  audienceID: number;
  isFixed: boolean;
  typename: EnumPurchaseOrderSubStatus;
  description: string;
  pipeline: EnumPurchaseOrderStatus;
  updatedAt: Date;
  createdAt: Date;
}

export interface IPurchaseOrderFailedParams {
  pageID: number;
  orderID: number;
  typename?: EnumPurchaseOrderSubStatus;
  description?: string;
}

export interface IOpenAPIPurchasing extends OpenAPIPayLoad {
  payloads: [IOpenAPIPurchasingPayload];
  total_price: number;
  discountTotal: number;
  expired_at: string;
  expire_day: string;
  tax: number;
  user_email: string;
  customer_id: number;
  description: string;
  isWithHoldingTax: boolean;
  withHoldingTax: number;
}

export interface IOpenAPIPurchasingPayload {
  item: string;
  amount: number;
  discount: number;
  item_price: number;
  item_quantity: number;
  is_vat: boolean;
}

export interface IOpenAPICancelPurchasing extends OpenAPIPayLoad {
  invoice_number: string;
  description: string;
  user_email: string;
}

export const PurchaseOrderTypeDefs = gql`
  "Purchase Order Status"
  enum EnumPurchaseOrderStatus {
    FOLLOW
    WAITING_FOR_PAYMENT
    CONFIRM_PAYMENT
    WAITING_FOR_SHIPMENT
    CLOSE_SALE
    REJECT
    EXPIRED
    MARKET_PLACE_RETURNED
    MARKET_PLACE_SHIPPED
    MARKET_PLACE_IN_CANCEL
    MARKET_PLACE_FAILED
  }

  type PurchaseOrderList {
    customerId: Int
    audienceId: Int
    orderNo: String
    createdOrder: String
    customerName: String
    customerImgUrl: String
    totalPrice: String
    status: EnumPurchaseOrderStatus
    totalrows: Int
    delivery_type: String
    tracking_url: String
    shipping_date: String
    tracking_no: String
    customerPlatform: String
  }

  type PurchaseOrderResponse {
    status: Int
    message: String
  }

  type ProductPurchaseOrderImages {
    id: String
    selfLink: String
    mediaLink: String
    bucket: String
  }

  type PurchaseOrderProducts {
    orderItemId: Int
    variantId: Int
    productName: String
    images: [ProductPurchaseOrderImages]
    attributes: String
    unitPrice: Float
    quantity: Int
  }

  type PurchaseOrderPaymentBank {
    id: Int
    payment_id: Int
    branch_name: String
    account_name: String
    account_id: String
    status: Boolean
    type: EnumBankAccountType
  }

  type PurchaseOrderPaymentDetail {
    id: Int
    type: EnumPaymentType
    bankAccountId: Int
    bank: PurchaseOrderPaymentBank
    isPaid: Boolean
    paidAmount: Float
    paidDate: Date
    paidTime: String
    paidProof: String
  }

  type PurchaseOrderCustomerLocation {
    address: String
    district: String
    postCode: String
    province: String
    country: String
    city: String
  }

  type PurchaseOrderCustomerDetail {
    name: String
    phoneNumber: String
    location: PurchaseOrderCustomerLocation
    isConfirm: Boolean
  }

  type PurchaseOrderShippingDetail {
    id: Int
    name: String
    type: String
    trackingType: EnumTrackingType
    flatRate: Boolean
    isAutoGeneratyeTrackingNo: Boolean
    deliveryFee: Int
    trackingUrl: String
    trackingNo: String
    isActive: Boolean
  }

  enum EnumPurchaseOrderSubStatus {
    PRODUCT_SUBTRACT_FAILED
    PURCHASE_ORDER_REFUND_FAILED
    REFUND_PAYPAL_FAILED
    REFUND_2C2P_FAILED
    REFUND_OMISE_CREDIT_FAILED
    TRANSACTION_2C2P_FAILED
  }

  type PurchaseOrderErrors {
    typename: EnumPurchaseOrderSubStatus
    isFixed: Boolean
  }

  type PurchaseOrder {
    orderId: Int
    uuid: String
    audienceId: Int
    totalPrice: Float
    status: String
    tax: Float
    taxIncluded: Boolean
    flatRate: Boolean
    deliveryFee: Float
    createdAt: Date
    isAuto: Boolean
    aliasOrderId: String
    shipping: PurchaseOrderShippingDetail
    customerDetail(audienceID: Int, orderID: Int): PurchaseOrderCustomerDetail
    payment: PurchaseOrderPaymentDetail
    products: [PurchaseOrderProducts]
    errors(orderID: Int): [PurchaseOrderErrors]
  }

  type PurchaseOrderModel {
    id: Int
  }

  type PurchaseOrderSubscription {
    pageID: Int
    audienceID: Int
    orderID: Int
  }

  input PurchaseOrderProductsInput {
    orderItemId: Int
    variantId: Int
    productId: Int
    productName: String
    attributes: String
    unitPrice: Float
    quantity: Int
    caution: [String]
    inventory: Int
    stock: Int
  }

  input PurchaseOrderInput {
    orderId: Int
    audienceId: Int
    totalPrice: String
    status: String
    products: [PurchaseOrderProductsInput]
  }
  input UpdatePurchaseOrderInput {
    orderId: Int
    audienceId: Int
    isAuto: Boolean
    platform: String
    products: [PurchaseOrderProductsInput]
  }

  input UpdatePurchasePaymentInput {
    orderId: Int
    audienceId: Int
    bankAccount: Int
    imagePayment: String
    file: Upload
    paymentStatus: Boolean
    amount: Float
    date: Date
    time: String
    uuid: String
    platform: String
  }
  enum UpdatePurchasePaymentMode {
    EDIT
    UPDATE
  }

  input TrackingNoInput {
    shippingDate: Date
    shippingTime: String
    trackingUrl: String
    trackingNo: String
  }

  type PoStats {
    all_po: Int
    all_total: Float
    follow_po: Int
    follow_total: Float
    waiting_payment_po: Int
    waiting_payment_total: Float
    confirm_po: Int
    confirm_total: Float
    waiting_shipment_po: Int
    waiting_shipment_total: Float
    close_po: Int
    close_total: Float
    expired_po: Int
    reject_po: Int
  }

  input POFilters {
    id: String
    startDate: String
    endDate: String
    search: String
    status: String
    pageSize: Int
    currentPage: Int
    orderBy: [String]
    orderMethod: String
    exportAllRows: Boolean
  }

  type PurchaseProductInventory {
    id: Int
    stock: Int
    inventory: Int
  }

  type CourierTrackingInfo {
    id: Int
    purchase_order_id: Int
    active: Boolean
    tracking_no: String
    tracking_url: String
    shipping_date: String
    shipping_time: String
    payload: String
    created_at: Date
    updated_at: Date
  }

  input UpdateShippingAddress {
    address: String
    city: String
    country: String
    district: String
    name: String
    phoneNo: String
    postalCode: String
    province: String
  }

  type PurchaseOrderPayment {
    id: Int
    purchase_order_id: Int
    payment_id: Int
    type: String
    transaction_id: String
    is_refund: Boolean
  }

  type PurchaseOrderMarketPlaceDetailsModel {
    id: Int
    marketPlaceOrderID: String
    status: String
    totalPrice: Int
    paymentMethod: String
    itemCount: String
    shippingFee: String
    marketOrderStatus: String
    customerName: String
    createdAt: Date
    orderItems: [PurchaseOrderItemsMarketPlaceDetailsModel]
  }

  type PurchaseOrderItemsMarketPlaceDetailsModel {
    sku: String
    discount: Int
    productID: Int
    unitPrice: Int
    productImage: String
    productVariantID: Int
    productMarketLink: String
    name: String
    quantity: Int
    purchaseOrderItemID: Int
  }

  extend type Query {
    getPurchaseOrderList(filters: POFilters): [PurchaseOrderList]
    getPurchaseOrderPipeline(audienceID: Int): FacebookPipelineModel
    #
    getPurchaseOrder(audienceId: Int, currentStatus: String): PurchaseOrder
    getPurchaseOrderShippingDetail(orderId: Int, audienceId: Int): PurchaseOrderShippingDetail
    getPurchaseOrderPaymentDetail(orderId: Int, audienceId: Int): PurchaseOrderPaymentDetail
    getPurchaseOrderProductDetail(orderId: Int, audienceId: Int): [PurchaseOrderProducts]
    getPurchaseOrderCustomerDetail(orderId: Int, audienceId: Int): PurchaseOrderCustomerDetail
    #
    getPurchaseOrderDestination(audienceId: Int): PurchaseOrderCustomerDetail
    getPurchaseOrderFailedHistory(audienceID: Int, orderID: Int): [PurchaseOrderErrors]
    getPurchaseOrderByType(type: EnumPurchaseOrderStatus): PurchaseOrderResponse
    getCurrentPurchaseProductInventory(orderId: Int, productIds: [Int]): [PurchaseProductInventory]
    getPurchasingOrderUnrefundedPaymentInfo(orderID: Int): [PurchaseOrderPayment]
    getPoStatsCounts(filters: POFilters): PoStats
    getAllPOInMonth: [PurchaseOrderModel]
    getMarketPlaceOrderDetails(marketPlaceOrderID: String, orderChannel: String): PurchaseOrderMarketPlaceDetailsModel
  }

  extend type Mutation {
    updateTrackingNumber(audienceID: Int, orderID: Int, tracking: TrackingNoInput, platform: String): PurchaseOrderResponse
    updateSelectedLogisticMethod(audienceID: Int, logisticID: Int): HTTPResult
    updateSelectedPaymentMethod(audienceID: Int, paymentID: Int): HTTPResult
    retryCreateOrderTracking(audienceID: Int, orderID: Int): PurchaseOrderResponse
    updatePurchaseOrder(order: UpdatePurchaseOrderInput): PurchaseOrderResponse
    updatePurchasePayment(payment: UpdatePurchasePaymentInput, mode: UpdatePurchasePaymentMode): PurchaseOrderResponse
    updateShippingAddress(orderID: Int, audienceID: Int, shippingAddress: UpdateShippingAddress): HTTPResult

    changeOrderPayment(orderID: Int, audienceID: Int, changeTo: EnumPaymentType): HTTPResult
    changeOrderLogistic(orderID: Int, audienceID: Int): HTTPResult

    setPurchaseOrder(purchaseOrderId: Int): PurchaseOrderResponse
    updateNextPurchaseOrderStatus(audienceId: Int, psid: String): PurchaseOrderResponse
    resolvePurchaseOrderProblem(audienceID: Int, orderID: Int, typename: EnumPurchaseOrderSubStatus): PurchaseOrderResponse
    proceedToRefundOrder(orderID: Int): PurchaseOrderResponse
    resolvePurchaseOrderPaidTransaction(orderId: Int): PurchaseOrderResponse
  }

  extend type Subscription {
    getPurchaseOrderSubscription(audienceID: Int, orderID: Int): PurchaseOrderSubscription
  }
`;

export const CreateCourierTrackingInfoValidator = {
  id: Joi.number().required(),
  purchase_order_id: Joi.number().required(),
  active: Joi.boolean(),
  tracking_no: Joi.string(),
  tracking_url: Joi.string(),
  shipping_date: Joi.string(),
  shipping_time: Joi.string(),
  payload: Joi.string(),
  created_at: Joi.string(),
  updated_at: Joi.string(),
};
export const UpdateTrackingRequestValidator = {
  audienceID: Joi.number().required(),
  orderID: Joi.number().required(),
  tracking: Joi.object().keys({
    shippingDate: Joi.string().required(),
    shippingTime: Joi.string().required(),
    trackingUrl: Joi.string().allow('').allow(null),
    trackingNo: Joi.string().required(),
  }),
  platform: Joi.string().required(),
};
export const UpdateCustomerAddressValidator = {
  orderID: Joi.number().required(),
  audienceID: Joi.number().required(),
  shippingAddress: Joi.object().keys({
    address: Joi.string().required(),
    city: Joi.string().required(),
    country: Joi.string().allow(null).allow(''),
    district: Joi.string().required(),
    name: Joi.string().required(),
    phoneNo: Joi.string().required(),
    postalCode: Joi.string().required(),
    province: Joi.string().required(),
  }),
};
export const GetPurchaseOrderRefundResponseValidate = {
  id: Joi.number(),
  purchase_order_id: Joi.number(),
  payment_id: Joi.number(),
  type: Joi.string(),
  transaction_id: Joi.string(),
  is_refund: Joi.boolean(),
};
export const GetPurchaseOrderFailedHistoryResponseValidate = {
  isFixed: Joi.boolean(),
  typename: Joi.string(),
};

export const GetPurchaseOrderShippingDetailResponseValidate = {
  id: Joi.number(),
  name: Joi.string(),
  type: Joi.string().allow('THAILAND_POST').allow('EMS_THAILAND').allow('FLASH_EXPRESS').allow('J_AND_T').allow('ALPHA').allow('CUSTOM'),
  trackingType: Joi.string().allow('DROP_OFF').allow('MANUAL').allow('BOOK'),
  flatRate: Joi.boolean(),
  deliveryFee: Joi.number(),
  trackingUrl: Joi.string().allow('').allow(null),
  trackingNo: Joi.string().allow('').allow(null),
  isAutoGeneratyeTrackingNo: Joi.boolean(),
  isActive: Joi.boolean(),
};
export const GetPurchaseOrderResponseValidate = {
  audienceId: Joi.number().required(),
  orderId: Joi.number().required().allow(null),
  uuid: Joi.string().required().allow(null).allow(''),
  totalPrice: Joi.number().required().allow(null),
  status: Joi.string().required(),
  tax: Joi.number().required(),
  taxIncluded: Joi.boolean().required(),
  flatRate: Joi.boolean().allow(null),
  createdAt: Joi.string().allow(null),
  isAuto: Joi.boolean().required(),
  aliasOrderId: Joi.string().allow(null),
  shipping: Joi.object()
    .keys({
      id: Joi.number(),
      name: Joi.string(),
      type: Joi.string().allow(null).allow('THAILAND_POST').allow('EMS_THAILAND').allow('FLASH_EXPRESS').allow('J_AND_T').allow('ALPHA').allow('CUSTOM'),
      trackingType: Joi.string().allow('DROP_OFF').allow('MANUAL').allow('BOOK'),
      flatRate: Joi.boolean(),
      deliveryFee: Joi.number(),
      trackingUrl: Joi.string().allow('').allow(null),
      trackingNo: Joi.string().allow('').allow(null),
      isAutoGeneratyeTrackingNo: Joi.boolean(),
      isActive: Joi.boolean(),
    })
    .allow(null),
  payment: Joi.object()
    .keys({
      id: Joi.number(),
      type: Joi.string(),
      bankAccountId: Joi.number().allow(null),
      bank: Joi.object()
        .keys({
          id: Joi.number(),
          payment_id: Joi.number(),
          branch_name: Joi.string(),
          account_name: Joi.string(),
          account_id: Joi.string(),
          status: Joi.boolean(),
          type: Joi.string(),
        })
        .allow(null),
      isPaid: Joi.boolean(),
      paidAmount: Joi.number().allow(null),
      paidDate: Joi.string().allow(null),
      paidTime: Joi.string().allow(null),
      paidProof: Joi.string().allow(null),
    })
    .allow(null),
  deliveryFee: Joi.number(),
  products: Joi.array()
    .items({
      orderItemId: Joi.number(),
      variantId: Joi.number(),
      attributes: Joi.string().allow(''),
      unitPrice: Joi.string(),
      quantity: Joi.number(),
      productName: Joi.string(),
      images: Joi.array().items(Joi.object()).allow(null).allow(),
    })
    .allow(null),
  customerDetail: Joi.object()
    .keys({
      name: Joi.string(),
      phoneNumber: Joi.string().allow(null),
      isConfirm: Joi.boolean(),
      location: Joi.object()
        .keys({
          address: Joi.string().allow(null),
          district: Joi.string().allow(null),
          postCode: Joi.string().allow(null),
          province: Joi.string().allow(null),
          country: Joi.string().allow(null),
          city: Joi.string().allow(null),
        })
        .allow(null),
    })
    .allow(null),
  errors: Joi.array()
    .items({
      isFixed: Joi.boolean(),
      typename: Joi.string(),
    })
    .optional(),
};
export const GetPurchaseOrderDestinationResponseValidate = {
  name: Joi.string(),
  phoneNumber: Joi.string().allow(null),
  isConfirm: Joi.boolean(),
  location: Joi.object()
    .keys({
      address: Joi.string().allow(null),
      district: Joi.string().allow(null),
      postCode: Joi.string().allow(null),
      province: Joi.string().allow(null),
      country: Joi.string().allow(null),
      city: Joi.string().allow(null),
    })
    .allow(null),
};
export const UpdatePurchaseOrderRequestValidate = {
  orderId: Joi.number().required(),
  audienceId: Joi.number().required(),
  isAuto: Joi.boolean().required(),
  platform: Joi.string().allow(null).required(),
  products: Joi.array()
    .items({
      orderItemId: Joi.number().allow(null),
      productId: Joi.number(),
      variantId: Joi.number(),
      unitPrice: Joi.number(),
      quantity: Joi.number(),
      caution: Joi.array(),
      inventory: Joi.number(),
    })
    .allow(null),
};
export const CreatePurchaseOrderRequestValidate = {
  orderId: Joi.string().required(),
  audienceId: Joi.number().required(),
  customerId: Joi.number().required(),
  products: Joi.array().items({
    productId: Joi.number(),
    productName: Joi.string(),
    productImage: Joi.string().allow(null),
    attributes: Joi.string().allow(''),
    unitPrice: Joi.number(),
    quantity: Joi.number(),
  }),
};

export const PurchaseOrderRequestValidate = {
  // purchaseOrderId: Joi.number().required(),
  audienceId: Joi.number().required(),
  psid: Joi.string().required(),
};
export const UpdateOrderPaymentRequestValidate = {
  payment: Joi.object().keys({
    orderId: Joi.number().required(),
    audienceId: Joi.number().required(),
    bankAccount: Joi.number().required().allow('').allow(null),
    imagePayment: Joi.string().allow('').allow(null),
    file: Joi.any().allow('').allow(null),
    paymentStatus: Joi.boolean(),
    amount: Joi.number(),
    date: Joi.string(),
    time: Joi.string(),
    platform: Joi.optional(),
  }),
  mode: Joi.string().required(),
};

export const PurchaseOrderResponseValidate = {
  status: Joi.number().required(),
  message: Joi.string().required(),
};

export const PoStatsResponseValidate = {
  all_po: Joi.number().required().allow(null),
  all_total: Joi.number().required().allow(null),
  follow_po: Joi.number().required().allow(null),
  follow_total: Joi.number().required().allow(null),
  waiting_payment_po: Joi.number().required().allow(null),
  waiting_payment_total: Joi.number().required().allow(null),
  confirm_po: Joi.number().required().allow(null),
  confirm_total: Joi.number().required().allow(null),
  waiting_shipment_po: Joi.number().required().allow(null),
  waiting_shipment_total: Joi.number().required().allow(null),
  close_po: Joi.number().required().allow(null),
  close_total: Joi.number().required().allow(null),
  expired_po: Joi.number().required().allow(null),
  reject_po: Joi.number().required().allow(null),
};
export const PurchaseInventoryResponseValidate = {
  id: Joi.number().required(),
  stock: Joi.number().required(),
  inventory: Joi.number().required(),
};

export const AllPurchaseOrderResponseValidate = {
  customerId: Joi.number().required(),
  audienceId: Joi.number().required(),
  orderNo: Joi.number().required(),
  createdOrder: Joi.string().required(),
  customerName: Joi.string().required(),
  customerImgUrl: Joi.string().required().allow(null).allow(''),
  totalPrice: Joi.number().required().allow(null).allow(''),
  status: Joi.string().required(),
  totalrows: Joi.number().required().allow(null),
  delivery_type: Joi.string().required().allow(null),
  tracking_url: Joi.string().required().allow(null).allow(''),
  shipping_date: Joi.string().required().allow(null).allow(''),
  tracking_no: Joi.string().required().allow(null).allow(''),
  customerPlatform: Joi.string().required().allow(null).allow(''),
};

export const PurchaseOrderModelValidate = {
  id: Joi.number().required(),
};

export const PurchaseOrderMarketPlaceRequestValidate = {
  marketPlaceOrderID: Joi.string().required(),
  orderChannel: Joi.string().required(),
};

export const PurchaseOrderMarketPlaceItemsResponseValidate = {
  sku: Joi.string().required(),
  discount: Joi.number().required(),
  productID: Joi.number().allow(null),
  unitPrice: Joi.number().required(),
  productImage: Joi.string().required(),
  productVariantID: Joi.number().allow(null),
  name: Joi.string().required(),
  productMarketLink: Joi.string().required(),
  quantity: Joi.number().required(),
  purchaseOrderItemID: Joi.number().required(),
};

export const PurchaseOrderMarketPlaceResponseValidate = {
  id: Joi.number().required(),
  marketPlaceOrderID: Joi.string().required(),
  status: Joi.string().required(),
  totalPrice: Joi.number().required(),
  paymentMethod: Joi.string().required(),
  itemCount: Joi.number().required(),
  shippingFee: Joi.number(),
  marketOrderStatus: Joi.string().required(),
  customerName: Joi.string(),
  createdAt: Joi.string().required(),
  orderItems: Joi.array().items(PurchaseOrderMarketPlaceItemsResponseValidate),
};

export const CreatePurchasingQuickPayOpenAPIRequestObject = {
  discount: Joi.number().required(),
  item_price: Joi.number().required(),
  item_quantity: Joi.number().required(),
  is_vat: Joi.boolean().required(),
  item: Joi.string().required(),
  amount: Joi.number().required(),
};

export const CreatePurchasingQuickPayOpenAPIRequestValidate = {
  page_uuid: Joi.string().required(),
  page_secret: Joi.string().required(),
  tax: Joi.number().required(),
  expired_at: Joi.date().required(),
  expire_day: Joi.number().required(),
  user_email: Joi.string().required(),
  customer_id: Joi.number().required(),
  discountTotal: Joi.number().required(),
  total_price: Joi.number().required(),
  payloads: Joi.array().items(CreatePurchasingQuickPayOpenAPIRequestObject),
  isWithHoldingTax: Joi.boolean().required(),
  withHoldingTax: Joi.number().required(),
};

export const CancelBillingQuickPayOpenAPIRequestValidate = {
  page_uuid: Joi.string().required(),
  page_secret: Joi.string().required(),
  invoice_number: Joi.string().required(),
  description: Joi.string().required(),
  user_email: Joi.string().required(),
};
