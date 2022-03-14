import { INameIDObject } from '@reactor-room/model-lib';
import { IProductAttributeList, IQuickPayOrderAndOrderItems, ISalePageProducts } from '@reactor-room/itopplus-model-lib';
import { ILeadPostbackForm } from '../leads/leads.model';
import { EnumLogisticDeliveryProviderType } from '../logistics';
import { EnumPaymentType } from '../payment/payment.enum';
import { IPaymentOmiseOption, ReturnAddBankAccount } from '../payment/payment.model';
import { IProductCategoryList } from '../product/product-category-model';
import { IProductVariantPipeline, IVariantsOfProduct } from '../product/product-model';
import { EnumPurchasingPayloadType } from '../purchase-order/purchase-order.enum';
import {
  IOmiseInitTransaction,
  IPurchaseOrderPostbackAddProductViaShareLink,
  IPurchaseOrderPostbackMessageAddress,
  IPurchaseOrderPostbackPaypal,
  IPurchaseOrderPostbackSelectLogistic,
  IPurchaseOrderPostbackSelectPayment,
  TransactionCheckerBody,
} from '../purchase-order/purchase-order.model';
import { ViewRenderType } from '../view-render/view-render.model';

export type PurchaseOrderPostbackPayload =
  | IPurchaseOrderPostbackSelectLogistic
  | IPurchaseOrderPostbackSelectPayment
  | IPurchaseOrderPostbackMessageAddress
  | IPurchaseOrderPostbackAddProductViaShareLink
  | IPurchaseOrderPostbackPaypal
  | ILeadPostbackForm
  | IOmiseInitTransaction
  | TransactionCheckerBody
  | IPipelinePaypalApproveData;

export interface IPipelinePaypalPurchaseUnits {
  custom_id: string;
}
export interface IPipelinePaypalApproveData {
  orderID: string;
  payerID: string;
  paymentID?: string;
  billingToken?: string;
  facilitatorAccessToken: string;
}
export interface IPipelinePaypalDetail {
  id: string;
  purchase_units: IPipelinePaypalPurchaseUnits[];
  // it have more than this
}
export interface IPipelineBankAccountDetail {
  bank_id: number;
  branch_name: string;
  account_name: string;
  account_id: string;
  bank_type: string;
  bank_status: boolean;
  bank_created_at: Date;
  bank_updated_at: Date;
}

export interface PaymentDefaultSetting {
  feePercent: string;
  feeValue: string;
  minimumValue: string;
}

export interface PaymentCashOnDelivery extends PaymentDefaultSetting {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option?: any;
}
export interface PaymentPaypal extends PaymentDefaultSetting {
  clientId: string;
  clientSecret: string;
}

export interface IPipelinePaymentDetail {
  id: number;
  type: EnumPaymentType;
  page_id: number;
  name: string;
  status: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option?: any;
  created_at: Date;
  updated_at: Date;
}
export interface IPipelineILogisticSelectorTemplate {
  id: number;
  name: string;
  type: EnumLogisticDeliveryProviderType;
  flatRate: boolean;
  deliveryFee: number;
  isCOD: boolean;
}

export interface IPipelineShippingAddressLocation {
  address: string;
  amphoe: string;
  city: string;
  district: string;
  post_code: string;
  province: string;
  country: string;
}

export interface IPipelineCustomerAddress {
  name: string;
  phone_number: string;
  location: IPipelineShippingAddressLocation;
}

export interface IPipelineCustomerShippingAddress extends IPipelineCustomerAddress {
  id: number;
  customer_id: number;
  purchase_order_id: number;
  page_id: number;
  is_confirm: boolean;
  created_at: Date;
}

export interface IPipelinePurchaseCustomerDetail extends IPipelineCustomerAddress {
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

export interface IPipelinePostData {
  audienceId: string;
  psid?: string;
  response_type?: string;
  auth: string;
  view: ViewRenderType;
}

export interface IPipelineCommons {
  hash?: string;
  view: ViewRenderType;
  type: EnumPurchasingPayloadType;
  psid: string;
  audienceId: string;
  auth: string;
}

export interface IPipelineStep2Payload extends IPipelineCommons {
  settings?: IPipelineStep2Settings;
}

export interface IPipelineStep2Combined extends IPipelineCommons, IPipelineStep2Settings {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  option?: any;
}

export interface IPipelineSelectProduct extends IPipelineCommons {
  product: IProductVariantPipeline | IProductVariantPipeline[];
}

export interface IPipelineQuickPay extends IPipelineCommons {
  quickPay: IQuickPayOrderAndOrderItems;
  bankDetails: ReturnAddBankAccount[];
}

export interface IPipelineProductCatalog extends IPipelineCommons {
  products: any;
  filter?: any;
}

export interface IPipelineProductCatalogFilter extends IPipelineCommons {
  catalogID: string;
  search: string;
  categoryIDs: string[];
  tagIDs: string[];
  tags: INameIDObject[];
  categories: IProductCategoryList[];
}

export interface IPipelineProductCatalogVariant extends IPipelineCommons {
  catalogID: string;
  productID: number;
  product: ISalePageProducts;
  variants: IVariantsOfProduct[];
  attributes: IProductAttributeList[];
}
export interface IAddressJQL {
  d: string;
  a: string;
  p: string;
  z: number;
}

export interface IAddressJson {
  province: string;
  amphoe: string;
  district: string;
  post_code: number;
}

export type AddressJsonArray = (string | (string | ((string | number[])[] | (string | string[])[])[])[][])[][];

export interface IPipelineOrderSettings {
  aliasOrderId: string;
  logisticSystem: boolean;
  taxIncluded: boolean;
  taxPrice: number;
  taxAmount: number;
  totalSub: number;
  totalAmount: number;
  shippingCost: number;
}

export interface IOmiseOrderInfo extends IPipelineOrderSettings {
  shopName: string;
  aliasOrderId: string;
}

export interface IPipelineStep2SettingProductList {
  unitPrice: string;
  variantId: number;
  productId: number;
  quantity: number;
  productName: string;
  images: string[];
  attributes: string;
}
export interface IPipelineStep2Settings extends IPipelineOrderSettings {
  payments: IPipelinePaymentDetail[];
  accounts: IPipelineBankAccountDetail[];
  logistics: IPipelineILogisticSelectorTemplate[];
  logisticID: number;
  paymentID: number;
  bankAccountID: number;
  currency: string;
  enablePaypal: boolean;
  paypalClientId: string;
  omisePublicKey: string;
  omiseOption: IPaymentOmiseOption;
  notMetMinimumCOD?: boolean;
  customId?: string;
  // eslint-disable-next-line
  addressJson: any;
  customer?: IPipelineCustomerAddress;
  productList?: IPipelineStep2SettingProductList[];
}
export interface IPipelineCheckoutPaypalSettings extends IPipelineOrderSettings {
  enablePaypal: boolean;
  //
  currency: string;
  paypalClientId: string;
}
export interface IPipelineCheckout2C2PSettings extends IPipelineOrderSettings {
  //
  currency: string;
}
export interface IPipelineCheckoutOmiseSettings extends IPipelineOrderSettings {
  enableOmise: boolean;
  omiseOption: IPaymentOmiseOption;
  //
  currency: string;
  omisePublicKey: string;

  // enableOmise;
  // currency;
  // omisePublicKey;
}
