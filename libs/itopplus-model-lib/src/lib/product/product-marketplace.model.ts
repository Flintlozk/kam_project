import * as Joi from 'joi';
import { ILazadaDefaultAccessRequest, INameObject, ITableFilter, LanguageTypes, nameValidate, tableFilterValidate } from '@reactor-room/model-lib';
import { IShopeeEnv } from '@reactor-room/itopplus-model-lib';
import gql from 'graphql-tag';
import * as JoiDate from 'joi-date-dayjs';
import { SocialTypes } from '../pages/pages.enum';
import { IMergedProductData, INameValuePair, MergeMarketPlaceType } from './product-model';

Joi.extend(JoiDate);

export const BRAND_ID = -100;

export enum ProductMarketPlaceLinkStatus {
  LINKED = 'LINKED',
  NOT_LINKED = 'NOT_LINKED',
  ALL = 'ALL',
}

export enum ShopeeShopStatusTypes {
  Normal = 'NORMAL',
  Frozen = 'FROZEN',
  Banned = 'BANNED',
  Deleted = 'DELETED',
}

export enum ProductMarketPlaceUpdateTypes {
  PRODUCT_MAIN = 'PRODUCT_MAIN',
  PRODUCT_IMAGES = 'PRODUCT_IMAGES',
  VARIANT = 'VARIANT',
  VARIANT_IMAGES = 'VARIANT_IMAGES',
}

export enum ShopeeItemStatusTypes {
  UNLIST = 'UNLIST',
  NORMAL = 'NORMAL',
}

export enum ShopeeAttributeType {
  INT_TYPE = 'INT_TYPE',
  STRING_TYPE = 'STRING_TYPE',
  ENUM_TYPE = 'ENUM_TYPE',
  FLOAT_TYPE = 'FLOAT_TYPE',
  DATE_TYPE = 'DATE_TYPE',
  TIMESTAMP_TYPE = 'TIMESTAMP_TYPE',
}

export enum MergeMarketUpdatePriceInventoryResultType {
  MARKET_UPDATE_SUCCESS_VARIANT_MERGE_SUCCESS = 'UPDATE_SUCCESS',
  MARKET_UPDATE_FAIL_VARIANT_MERGE_FAIL = 'UPDATE_FAIL',
  MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL = 'MARKET_UPDATE_SUCCESS_VARIANT_UPDATE_FAIL',
}

export enum UpdateMarketPlaceResultType {
  MARKETPLACE_CREATE_SUCCESS = 'MARKETPLACE_CREATE_SUCCESS',
  LAZADA_MARKETPLACE_UPDATE_SUCCESS = 'LAZADA_MARKETPLACE_UPDATE_SUCCESS',
  LAZADA_MARKETPLACE_UPDATE_FAIL = 'LAZADA_MARKETPLACE_UPDATE_FAIL',
  SHOPEE_MARKETPLACE_UPDATE_SUCCESS = 'SHOPEE_MARKETPLACE_UPDATE_SUCCESS',
  SHOPEE_MARKETPLACE_UPDATE_FAIL = 'SHOPEE_MARKETPLACE_UPDATE_FAIL',
  MARKETPLACE_UPDATE_FAIL = 'MARKETPLACE_UPDATE_FAIL',
  NO_MARKETPLACE_VARIANT_MERGED = 'NO_MARKETPLACE_VARIANT_MERGED',
}

export enum ShopeeMarketPlaceResultType {
  SHOPEE_MARKETPLACE_SUCCESS = 'SHOPEE_MARKETPLACE_SUCCESS',
  SHOPEE_MARKETPLACE_ERROR = 'SHOPEE_MARKETPLACE_ERROR',
  SHOPEE_MERGE_SUCCESS = 'SHOPEE_MERGE_SUCCESS',
  SHOPEE_MERGE_ERROR = 'SHOPEE_MERGE_ERROR',
  SHOPEE_ADD_VARIANT_SUCCESS = 'SHOPEE_ADD_VARIANT_SUCCESS',
  SHOPEE_ADD_VARIANT_ERROR = 'SHOPEE_ADD_VARIANT_ERROR',
}

export enum ShopeeOrderDetailsOptionalFieldTypes {
  BUYER_USER_ID = 'buyer_user_id',
  BUYER_USERNAME = 'buyer_username',
  ESTIMATED_SHIPPING_FEE = 'estimated_shipping_fee',
  RECIPIENT_ADDRESS = 'recipient_address',
  ACTUAL_SHIPPING_FEE = 'actual_shipping_fee ',
  GOODS_TO_DECLARE = 'goods_to_declare',
  NOTE = 'note',
  NOTE_UPDATE_TIME = 'note_update_time',
  ITEM_LIST = 'item_list',
  PAY_TIME = 'pay_time',
  DROPSHIPPER = 'dropshipper',
  CREDIT_CARD_NUMBER = 'credit_card_number ',
  DROPSHIPPER_PHONE = 'dropshipper_phone',
  SPLIT_UP = 'split_up',
  BUYER_CANCEL_REASON = 'buyer_cancel_reason',
  CANCEL_BY = 'cancel_by',
  CANCEL_REASON = 'cancel_reason',
  ACTUAL_SHIPPING_FEE_CONFIRMED = 'actual_shipping_fee_confirmed',
  BUYER_CPF_ID = 'buyer_cpf_id',
  FULFILLMENT_FLAG = 'fulfillment_flag',
  PICKUP_DONE_TIME = 'pickup_done_time',
  PACKAGE_LIST = 'package_list',
  SHIPPING_CARRIER = 'shipping_carrier',
  PAYMENT_METHOD = 'payment_method',
  TOTAL_AMOUNT = 'total_amount',
  INVOICE_DATA = 'invoice_data',
}

export enum ShopeeInputValidationTypes {
  INT_TYPE = 'INT_TYPE',
  STRING_TYPE = 'STRING_TYPE',
  ENUM_TYPE = 'ENUM_TYPE',
  FLOAT_TYPE = 'FLOAT_TYPE',
  DATE_TYPE = 'DATE_TYPE',
  TIMESTAMP_TYPE = 'TIMESTAMP_TYPE',
}

export enum ShopeeProductStatusTypes {
  NORMAL = 'NORMAL',
  BANNED = 'BANNED',
  DELETED = 'DELETED',
  UNLIST = 'UNLIST',
}

export enum ShopeeFormatTypes {
  NORMAL = 'NORMAL',
  QUANTITATIVE = 'QUANTITATIVE',
}

export enum ShopeeDateFormatTypes {
  YEAR_MONTH_DATE = 'YEAR_MONTH_DATE',
  YEAR_MONTH = 'YEAR_MONTH',
}

export enum ShopeeInputTypes {
  DROP_DOWN = 'DROP_DOWN',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  TEXT_FILED = 'TEXT_FILED',
  COMBO_BOX = 'COMBO_BOX',
  MULTIPLE_SELECT_COMBO_BOX = 'MULTIPLE_SELECT_COMBO_BOX',
}

export enum ShopeeOrdersTimeRangeField {
  CREATE_TIME = 'create_time',
  UPDATE_TIME = 'update_time',
}
export interface ICategorySelectedEmitter {
  showCategorySelector: boolean;
  selectedCategory: ILazadaCategories;
  selectCategory: IProductMarketPlaceCategoryTree[];
  categoryLevels: {
    [key: number]: IProductMarketPlaceCategoryTree[];
  }[];
}

export interface IMarketPlaceTogglerInput {
  id: string;
  icon?: string;
  title: string;
  toggleStatus: boolean;
  requiredForm: {
    attributes: ILazadaCategoryAttribute[] | IShopeeAttributes[] | INameValuePair[];
    groupName: LazadaCategoryAttributeFormGroupTypes | ShopeeCategoryAttributeFormGroupTypes;
  };
  notRequiredForm: {
    attributes: ILazadaCategoryAttribute[] | IShopeeAttributes[] | INameValuePair[];
    groupName: LazadaCategoryAttributeFormGroupTypes | ShopeeCategoryAttributeFormGroupTypes;
  };
}

export interface IProductMarketPlaceListParams {
  isImported: boolean;
  filters: ITableFilter;
}

export enum LazadaCategoryAttributeInputTypes {
  TEXT = 'text',
  DATE = 'date',
  NUMERIC = 'numeric',
  IMG = 'img',
  RICH_TEXT = 'rich text',
  SINGLESELECT = 'singleSelect',
  MULTISELECT = 'multiSelect',
  ENUMINPUT = 'enumInput',
  MULTIENUMINPUT = 'multiEnumInput',
}

export enum MarketPlaceErrorType {
  MARKET_PRODUCT_CREATED_ERROR_MERGING = 'MARKET_PRODUCT_CREATED_ERROR_MERGING',
  ERROR_CREATE_PRODUCT_RECHECK_MARKET = 'ERROR_CREATE_PRODUCT_RECHECK_MARKET',
  ERROR_500 = 'ERROR_500',
  IllegalAccessToken = 'IllegalAccessToken',
  MARKETPLACE_PRODUCT_ALREADY_EXISTS = 'MARKETPLACE_PRODUCT_ALREADY_EXISTS',
}

export interface ILazadaDateOptions {
  update_after?: string;
  created_after?: string;
  created_before?: string;
  update_before?: string;
}
export interface IShopeeUpdateDateOptions {
  update_time_from?: number;
  update_time_to?: number;
}

export interface IShopeeDateOptions extends IShopeeUpdateDateOptions {
  create_time_from?: number;
  create_time_to?: number;
}
export interface IOrderRequestParams extends ILazadaDateOptions {
  status?: LazadaOrderStatusTypes;
  sort_by?: LazadaSortByTypes;
}

export interface IShopeeOrdersRequestParams {
  time_range_field: ShopeeOrdersTimeRangeField;
  time_from: number;
  time_to: number;
  page_size: number;
  cursor?: string;
  order_status?: ShopeeOrderStatusTypes;
  response_optional_fields?: string;
}

export interface IShopeeOrdersByStatusRequestParams extends IShopeeOrdersRequestParams {
  order_status: ShopeeOrderStatusTypes;
}

export enum LazadaSortByTypes {
  CREATED_AT = 'created_at',
  UPDATED_AT = 'updated_at',
}
export interface IMergeMarketPlaceProductParams {
  id: number;
  marketIDs: number[];
  mergeType?: MergeMarketPlaceType;
  marketPlaceType?: SocialTypes;
}

export interface IUpdateMarketPlaceVariantBySKUParams {
  id: number;
  sku: string;
  marketPlaceType: SocialTypes;
}

export interface IUpdateMarketPlaceProductByMarketPlaceIDParams {
  id: number;
  marketPlaceID: number;
  marketPlaceType: SocialTypes;
}

export interface IMarketPlaceApi {
  sellerSku: string;
  quantity: number;
}

export interface IMarketPlaceVariant {
  id: number;
  sellerSku: string;
  quantity: number;
  pageID: number;
}

export enum IncreaseDecreaseType {
  INCREASE = 'INCREASE',
  DECREASE = 'DECREASE',
}
export interface IMarketPlaceDiffInQuantity {
  id: number;
  sku?: string;
  pageID?: number;
  quantity: number;
  mode: IncreaseDecreaseType;
}

export interface ILazadaOrdersReponseData {
  data: ILazadaOrdersData;
}

export interface ILazadaOrdersData {
  count: number;
  orders: ILazadaOrdersReponse[];
}

export interface IProductDetailsFromMarketSkuParams {
  pageID: number;
  marketPlaceSKU: string;
  marketPlaceType: SocialTypes;
}

export interface IProductDetailsFromMarketVariantIDParams {
  pageID: number;
  marketPlaceVariantID: string;
  marketPlaceType: SocialTypes;
}

export interface IProductIDVariantID {
  productID: number;
  variantID: number;
}
export interface ILazadaOrderItemsResponse {
  tax_amount: number;
  reason: string;
  sla_time_stamp: string;
  purchase_order_id: string;
  voucher_seller: number;
  voucher_code_seller: string;
  voucher_code: string;
  package_id: string;
  variation: string;
  voucher_code_platform: string;
  purchase_order_number: string;
  sku: string;
  invoice_number: string;
  order_type: string;
  cancel_return_initiator: string;
  shop_sku: string;
  stage_pay_status: string;
  tracking_code_pre: string;
  order_item_id: number;
  shop_id: string;
  order_flag: string;
  name: string;
  order_id: number;
  status: LazadaOrderStatusTypes;
  paid_price: number;
  product_main_image: string;
  voucher_platform: number;
  product_detail_url: string;
  promised_shipping_time: string;
  warehouse_code: string;
  shipping_type: string;
  created_at: string;
  updated_at: string;
  currency: string;
  shipping_provider_type: string;
  shipping_fee_original: number;
  is_digital: number;
  item_price: number;
  shipping_service_cost: number;
  tracking_code: string;
  shipping_amount: number;
  reason_detail: string;
  return_status: string;
  shipment_provider: string;
  voucher_amount: number;
  digital_delivery_info: string;
  extra_attributes: string;
  quantity?: number;
  canceledQuantity?: number;
  canceledCount?: number;
  quantityJson?: ILazadaOrderItemsResponse[];
}

export interface ILazadaOrdersAddressbilling {
  country: string;
  address3: string;
  phone: string;
  address2: string;
  city: string;
  address1: string;
  post_code: string;
  phone2: string;
  last_name: string;
  address5: string;
  address4: string;
  first_name: string;
}

export interface ILazadaOrdersReponse {
  order_id?: number;
  voucher_platform: number;
  voucher: number;
  warehouse_code: string;
  order_number: number;
  voucher_seller: number;
  created_at: string;
  voucher_code: string;
  gift_option: boolean;
  shipping_fee_discount_platform: number;
  customer_last_name: string;
  updated_at: string;
  promised_shipping_times: string;
  price: string;
  national_registration_number: string;
  shipping_fee_original: number;
  payment_method: string;
  customer_first_name: string;
  shipping_fee_discount_seller: number;
  shipping_fee: number;
  items_count: number;
  delivery_info: string;
  statuses: LazadaOrderStatusTypes[];
  address_billing: ILazadaOrdersAddressbilling;
}

export interface IMarketPlaceQuantityDiff {
  variantQuantity: IMarketPlaceVariant[];
  apiQuantity: IMarketPlaceApi[];
  differenceInQuantity: IMarketPlaceVariant[];
}

export interface IProductMarketPlaceList {
  id: number;
  marketPlaceID: string;
  name: string;
  price: string;
  variants: number;
  inventory: number;
  marketPlaceType: SocialTypes;
  totalRows?: number;
  marketPlaceIcon?: string;
  active?: boolean;
  sold?: number;
  variantList?: IProductMarketPlaceVariantList[];
  isSelected?: boolean;
  isDisabled?: boolean;
}

export interface IProductMarketPlaceCategoryTree {
  id: number;
  marketplaceType: SocialTypes;
  categoryID: number;
  name: string;
  parentID: number;
  leaf: boolean;
  language: LanguageTypes;
}

export interface IUpdateProductVariantPriceMarketPlace {
  variantID: number;
  variantPrice: number;
  marketPlaceVariantID?: number;
  marketPlaceVariantType?: SocialTypes;
  marketPlaceVariantSku?: string;
}

export interface IUpdateProductVariantImageMarketPlace {
  variantID: number;
  variantImage: string;
  marketPlaceVariantID?: number;
  marketPlaceVariantType?: SocialTypes;
  marketPlaceVariantSku?: string;
}
export interface IShopeeUpdateVariantPriceRequest {
  item_id: number;
  price_list: IShopeeUpdateVariantPriceListRequest[];
}

export interface IShopeeUpdateVariantPriceListRequest {
  model_id: number;
  original_price: number;
}

export interface IShopeeUpdateVariantInventoryRequest {
  item_id: number;
  stock_list: IShopeeUpdateVariantInventoryListRequest[];
}

export interface IShopeeUpdateVariantInventoryListRequest {
  model_id: number;
  normal_stock: number;
}

export interface IProductMarketPlace {
  id: number;
  pageID: number;
  marketPlaceID: string;
  productID: number;
  name: string;
  img?: string;
  marketPlaceType: SocialTypes;
  productJson?: string;
  active?: boolean;
  totalProducts?: number;
  marketPlaceVariantID?: string;
  imported?: boolean;
}

export interface IProductMarketPlaceLatestByType {
  id: number;
  pageID: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface ILazadaDataResponse<T> {
  code: string;
  request_id: string;
  data?: T;
  type?: string;
  message?: string;
}

export interface IShopeeProductListResponse {
  item: IShopeeProductList[];
  total_count: number;
  has_next_page: boolean;
  next_offset: number;
}
export interface IShopeeProductList {
  item_id: number;
  item_status: string;
  update_time: number;
}

export interface ILazadaBrandDataApi {
  enable_total: boolean;
  start_row: number;
  page_index: number;
  module: ILazadaBrand[];
  total_page: number;
  page_size: number;
  total_record: number;
}

export interface ILazadaBrand {
  name: string;
  global_identifier: string;
  name_en?: string;
  brand_id: number;
  marketPlaceType?: SocialTypes;
}

export interface ILazadaCreateProductResponse {
  item_id: number;
  sku_list: ILazadaCreateProductSKUList[];
}

export interface ILazadaCreateProductSKUList {
  shop_sku: string;
  seller_sku: string;
  sku_id: number;
}

export interface IProductMarketPlaceBrandsDB {
  marketplace_type: SocialTypes;
  brand_id: number;
  name: string;
  identifier: string;
}

export interface IProductMarketPlaceBrands {
  id: number;
  marketplaceType: SocialTypes;
  brandID: number;
  name: string;
  identifier: string;
}

export interface ILazadaProductUpdateRequest<T> {
  Request: {
    Product: {
      Skus: {
        Sku: T;
      };
    };
  };
}

export interface ILazadaCreateProductRequest<T, V> {
  Request: {
    Product: {
      PrimaryCategory: number;
      Images: { Image: string[] };
      SPUId: string;
      AssociatedSku: string;
      Attributes: T;
      Skus: {
        Sku: V[];
      };
    };
  };
}

export interface ILazadaUpdateProductRequest<T> {
  Request: {
    Product: {
      ItemId: number;
      Images: { Image: string[] };
      Attributes: {
        name: string;
        description: string;
      };
      Skus: {
        Sku: T[];
      };
    };
  };
}

export type IAddProductMarketPlaceParams = Pick<
  IProductMarketPlace,
  'name' | 'pageID' | 'productID' | 'marketPlaceID' | 'marketPlaceType' | 'productJson' | 'totalProducts' | 'imported'
>;

export interface IProductMarketPlaceVariant {
  id: number;
  productMarketPlaceID: number;
  productVariantID?: number;
  marketPlaceVariantID?: string;
  name: string;
  sku: string;
  pageID: number;
  unitPrice: number;
  inventory: number;
  marketPlaceType: SocialTypes;
  variantJson: string;
  active?: boolean;
}

export interface ILazadaBrandParams {
  startRow: number;
  pageSize: number;
}

export interface IProductOrVariantUnMerge {
  name: string;
  img: string;
  price: string | number;
  mergedMarketPlaceData: IMergedProductData[];
  minPrice?: string | number;
}

export type IProductMarketPlaceVariantList = Pick<
  IProductMarketPlaceVariant,
  'id' | 'productMarketPlaceID' | 'productVariantID' | 'name' | 'unitPrice' | 'sku' | 'inventory' | 'marketPlaceType' | 'variantJson' | 'active'
>;

export interface IAddProductMarketPlaceVariantParams {
  productMarketPlaceID: number;
  productVariantID?: number;
  name: string;
  sku: string;
  pageID: number;
  unitPrice: number;
  inventory: number;
  marketPlaceType: SocialTypes;
  variantJson: string;
  marketPlaceVariantID: string;
}

export interface IProductLazadaMainResponse {
  total_products: number;
  products: IProductLazadaProductResponse[];
}

export enum LazadaOrderStatusTypes {
  UNPAID = 'unpaid',
  PENDING = 'pending',
  CANCELED = 'canceled',
  READY_TO_SHIP = 'ready_to_ship',
  READY_TO_SHIP_PENDING = 'ready_to_ship_pending',
  DELIVERED = 'delivered',
  RETURNED = 'returned',
  SHIPPED = 'shipped',
  FAILED = 'failed',
  PACKED = 'packed',
  REPACKED = 'repacked',

  // pack
  // repack
  // arrange ?
}

export enum ShopeeOrderStatusTypes {
  UNPAID = 'UNPAID',
  READY_TO_SHIP = 'READY_TO_SHIP',
  PROCESSED = 'PROCESSED',
  SHIPPED = 'SHIPPED',
  COMPLETED = 'COMPLETED',
  IN_CANCEL = 'IN_CANCEL',
  CANCELLED = 'CANCELLED',
  INVOICE_PENDING = 'INVOICE_PENDING',
}

export interface IPurchaseOrderMarketPlaceByOrderAlias {
  id: number;
  pageID: number;
  status: string;
  orderChannel: string;
  aliasOrderID: string;
}

export interface IShopeeOrderDetailResponse {
  error: string;
  message: string;
  response: IShopeeOrderDetailListResponse;
  request_id: string;
}

export interface IShopeeOrderDetailListResponse {
  order_list: IShopeeOrderDetailList[];
}

export interface IShopeeOrderDetailList {
  cod: boolean;
  create_time: number;
  currency: string;
  days_to_ship: number;
  item_list: IShopeeOrderDetailItems[];
  message_to_seller: string;
  estimated_shipping_fee: number;
  order_sn: string;
  order_status: string;
  region: string;
  ship_by_date: number;
  total_amount: number;
  update_time: number;
}

export interface IShopeeOrderDetailItems {
  item_id: number;
  item_name: string;
  item_sku: string;
  model_id: number;
  model_name: string;
  model_sku: string;
  model_quantity_purchased: number;
  model_original_price: number;
  model_discounted_price: number;
  wholesale: boolean;
  weight: number;
  add_on_deal: boolean;
  main_item: boolean;
  add_on_deal_id: number;
  promotion_type: string;
  promotion_id: number;
  order_item_id: number;
  promotion_group_id: number;
}

export enum OrderMappedTypes {
  MARKETPLACE_TO_ITP = 'MARKETPLACE_TO_ITP',
  ITP_TO_MARKETPLACE = 'ITP_TO_MARKETPLACE',
}

export interface IIDisMerged {
  id: number;
  isMerged: boolean;
}

export interface IProductLazadaProductResponse {
  item_id: number;
  primary_category: number;
  attributes: INameObject;
  skus: IProductLazadaVariantResponse[];
}

export interface ILazadaCategories {
  categoryPath?: string;
  categoryName: string;
  categoryId: number;
}

export interface IProductLazadaVariantResponse {
  Status: string;
  quantity: number;
  Images: string[];
  Variation3?: string;
  SellerSku: string;
  ShopSku: string;
  Url: string;
  multiWarehouseInventories: ILazadaVariantResponseMultiWarehouseInventory[];
  package_width: string;
  package_height: string;
  fblWarehouseInventories?: any[];
  special_price: number;
  price: number;
  Variation1?: string;
  channelInventories: any[];
  package_length: string;
  package_weight: string;
  SkuId: number;
}

export interface ILazadaVariantResponseMultiWarehouseInventory {
  occupyQuantity: number;
  quantity: number;
  totalQuantity: number;
  withholdQuantity: number;
  warehouseCode: string;
  sellableQuantity: number;
}
export interface ILazadaSellerResponse {
  code: string;
  data?: ILazadaSellerDetails;
}

export interface ILazadaCategorySuggestionResponseData {
  data: ILazadaCategorySuggestionResponse;
}
export interface ILazadaCategorySuggestionResponse {
  code: string;
  data: {
    categorySuggestions: ILazadaCategories[];
  };
}
export interface ILazadaSellerDetails {
  name: string;
  location: string;
  seller_id: string;
  email: string;
  short_code: string;
  cb?: boolean;
  logo_url?: string;
  name_company?: string;
}

export interface ILazadaSkuDetails {
  SkuId?: number;
  SellerSku: string;
  Status: string;
  quantity?: number;
  price: number;
  package_length?: number;
  package_height?: number;
  package_weight?: number;
  package_width?: number;
  Images?: { Image: string[] };
}
export interface IShopeeCategories {
  category_id: number;
  parent_category_id: number;
  original_category_name: string;
  display_category_name: string;
  has_children: boolean;
}
export interface IErrorMessagesForm {
  [key: string]: string;
}
export interface IShopeeSellerDetails {
  shop_name: string;
  region: string;
  status: string;
  sip_affi_shops: IShopeeSellerDetailsRegion[];
  is_cb: boolean;
  is_cnsc: boolean;
  request_id: string;
  auth_time: number;
  expire_time: number;
}

export interface IShopeeSellerDetailsRegion {
  affi_shop_id: number;
  region: string;
}

export interface IShopeeLogistics {
  logistics_channel_id: number;
  logistics_channel_name: string;
  cod_enabled: boolean;
  enabled: boolean;
  fee_type: string;
  size_list: string[];
  weight_limit: IShopeeLogisticsWeightLimits;
  item_max_dimension: IShopeeLogisticsItemMaxDimension;
  volume_limit: IShopeeLogisticsVolumeLimits;
  preferred: boolean;
}
export interface IShopeeLogisticsVolumeLimits {
  item_max_volume: number;
  item_min_volume: number;
}

export interface IShopeeLogisticsItemMaxDimension {
  width?: number;
  length?: number;
  unit?: string;
  height?: number;
}

export interface IShopeeLogisticsWeightLimits {
  item_min_weight: number;
  item_max_weight: number;
}

export interface IProductFromLazadaUrlParams extends ILazadaDefaultAccessRequest {
  offset?: number;
  limit?: number;
  filter: string;
}

export interface IOrdersFromLazadaUrlParams extends ILazadaDefaultAccessRequest {
  status?: LazadaOrderStatusTypes;
  created_after?: string;
}

export interface IOrderFromLazadaUrlParams extends ILazadaDefaultAccessRequest {
  order_id: number;
}

export interface ICategoryAttributesFromLazadaUrlParams extends ILazadaDefaultAccessRequest {
  primary_category_id: number;
}

export interface ICategorySuggestionFromLazadaUrlParams extends ILazadaDefaultAccessRequest {
  product_name: string;
}

export interface ILazadaProductPriceQuantityUpdateParams extends ILazadaDefaultAccessRequest {
  payload: string;
}

export interface ILazadaGetBrandParams extends ILazadaDefaultAccessRequest, ILazadaBrandParams {}

export interface ILazadaCategoryTreeData {
  data: {
    var: boolean;
    name: string;
    leaf: boolean;
    language: LanguageTypes;
    category_id: number;
    children?: ILazadaCategoryTreeItem[];
  }[];
  code: string;
}

export interface IShopeeApiResponse<T> {
  error?: string;
  msg?: string;
  request_id: string;
  data?: T;
}

export interface IShopeeAttributes {
  attribute_id?: number;
  original_attribute_name?: string;
  display_attribute_name?: string;
  is_mandatory?: boolean;
  input_validation_type?: ShopeeInputValidationTypes;
  format_type?: ShopeeFormatTypes;
  date_format_type?: ShopeeDateFormatTypes;
  input_type?: ShopeeInputTypes;
  attribute_unit?: string[];
  attribute_value_list?: IShopeeAttributeValue[];
}

export interface IShopeeAttributeValue {
  value_id?: number;
  original_value_name?: string;
  display_value_name?: string;
  value_unit?: string;
  parent_attribute_list?: {
    parent_attribute_id?: number;
    parent_value_id?: number;
  }[];
  parent_brand_list?: {
    parent_brand_id?: number;
  }[];
}

export interface ILazadaCategoryTreeItem {
  var: boolean;
  name: string;
  leaf: boolean;
  language?: LanguageTypes;
  category_id: number;
  parent_id?: number;
  children?: ILazadaCategoryTreeItem[];
}

export interface OrderList {
  order_sn: string;
}

export interface IShopeeOrdersListResponse {
  error: string;
  message: string;
  response: IShopeeResponseOrderList;
  request_id: string;
}

export interface IShopeeResponseOrderList {
  more: boolean;
  next_cursor: string;
  order_list: IShopeeOrderList[];
}

export interface IShopeeErrorResponse {
  request_id: string;
  msg: string;
  error: string;
}

export interface IShopeeOrderList {
  order_sn: string;
}

export interface IProductMarketPlaceCategory {
  id?: number;
  marketPlaceType: SocialTypes;
  categoryID: number;
  parentID: number;
  name: string;
  leaf: boolean;
  varType: boolean;
  language: LanguageTypes;
}

export enum LazadaCategoryAttributeType {
  NORMAL = 'normal',
  SKU = 'sku',
}

export enum LazadaCategoryAttributeFormGroupTypes {
  NORMAL_ATTRIBUTE_REQUIRED = 'normalAttributeRequired',
  NORMAL_ATTRIBUTE_NOT_REQUIRED = 'normalAttributeNotRequired',
  SKU_ATTRIBUTE_REQUIRED = 'skuAttributeRequired',
  SKU_ATTRIBUTE_NOT_REQUIRED = 'skuAttributeNotRequired',
  SKU_PACKAGE_ATTRIBUTE_REQUIRED = 'skuPackageAttributeRequired',
}

export enum ShopeeCategoryAttributeFormGroupTypes {
  NORMAL_ATTRIBUTE_REQUIRED = 'normalAttributeRequired',
  NORMAL_ATTRIBUTE_NOT_REQUIRED = 'normalAttributeNotRequired',
  ATTRIBUTE_REQUIRED = 'attributeRequired',
  ATTRIBUTE_NOT_REQUIRED = 'attributeNotRequired',
  LOGISTICS_REQUIRED = 'logisticRequired',
  LOGISTICS_NOT_REQUIRED = 'logisticNotRequired',
  SKU_ATTRIBUTE_REQUIRED = 'skuAttributeRequired',
  SKU_ATTRIBUTE_NOT_REQUIRED = 'skuAttributeNotRequired',
}

export interface ILazadaCategoryAttributeResponseData {
  data: ILazadaCategoryAttributeResponse;
}
export interface ILazadaCategoryAttributeResponse {
  data: ILazadaCategoryAttribute[];
  code: string;
}

export interface ILazadaCategoryAttribute {
  name: string;
  input_type: LazadaCategoryAttributeInputTypes;
  options: INameObject[];
  is_mandatory: number;
  attribute_type: string;
  is_sale_prop: number;
  label: string;
  advanced?: {
    is_key_prop: number;
  };
}

export interface ILazadaCreateFormGroup {
  normalAttributeRequired?: any;
  normalAttributeNotRequired?: any;
  skuAttributeRequired?: any;
  skuAttributeNotRequired?: any;
  skuPackageAttributeRequired?: any;
}

export interface ILazadaCreateProductPayload extends ILazadaCreateFormGroup {
  productID: number;
  categoryID: number;
  payload?: string;
  isCreateMultipleProduct: boolean;
}

export interface IMarketPlaceCategoryAttribute {
  id: number;
  marketPlaceType: SocialTypes;
  lang: string;
}

export interface IMarketPlaceBrandSuggestion {
  keyword: string;
  socialType: SocialTypes;
  isSuggestion: boolean;
}

export interface IProductMarketPlaceCategoryTreeParams {
  parentOrCategoryID: number;
  marketPlaceType: SocialTypes;
  isCategory: boolean;
  language: LanguageTypes;
}

export interface IShopeeCreateVariantParams {
  productID: number;
  variantIDs: number[];
}

export interface IShopeeCreateProductPayload {
  productID: number;
  categoryID: number;
  logistics: string;
  variantIDs: number[];
  attributes: string;
  brand: string;
}

export interface IShopeeCommonParams {
  partner_id: number;
  timestamp: number;
  access_token: string;
  shop_id: number;
  sign: string;
}

export interface IShopeeCommonParamsPost {
  partner_id: number;
  timestamp: number;
  sign: string;
}

export interface IShopeeImageInfo {
  image_id: string;
  image_url_list: {
    image_url_region: string;
    image_url: string;
  }[];
}

export interface IShopeeRequestParmas {
  path: string;
  shop_id?: number;
  access_token: string;
  shopeeEnv: IShopeeEnv;
}

export interface IShopeePostRequestParmas {
  path: string;
  shopeeEnv: IShopeeEnv;
}

export interface IShopeeCreateUpdateProductRequired {
  item_id?: number;
  original_price: number;
  description: string;
  weight: number;
  item_name: string;
  item_status: ShopeeItemStatusTypes;
  dimension?: {
    package_length: number;
    package_width: number;
    package_height: number;
  };
  normal_stock: number;
  logistic_info: IShopeeCreateUpdateProductLogistic[];
  attribute_list?: IShopeeCreateProductAttribute[];
  category_id: number;
  image: IShopeeCreateProductImage;
  item_sku: string;
  brand?: IShopeeCreateProductBrand;
}

export interface IShopeeCreateProduct extends IShopeeCreateUpdateProductRequired {
  timestamp: number;
  shopid: number;
  partner_id: number;
  days_to_ship?: number;
  wholesales?: IShopeeCreateProductWholesale[];
  condition?: string;
  status?: string;
}

interface IShopeeCreateProductWholesale {
  min: number;
  max: number;
  unit_price: number;
}

export interface IShopeeCreateUpdateProductLogistic {
  logistic_id: number;
  enabled: boolean;
  shipping_fee?: number;
  size_id?: number;
  is_free?: boolean;
}

export interface IShopeeCreateProductAttribute {
  attribute_id: number;
  attribute_value_list: IShopeeCreateProductAttributeValueList[];
}

export interface IShopeeCreateProductBrand {
  brand_id: number;
  original_brand_name: string;
}

export interface IShopeeCreateProductAttributeValueList {
  value_id: number;
  original_value_name?: string;
  value_unit?: string;
}

export enum ShopeeBrandStatusTypes {
  NORMAL = 1,
  PENDING = 2,
}
export interface IShopeeBrandApiParams {
  offset: number;
  page_size?: number;
  category_id?: number;
  status?: ShopeeBrandStatusTypes;
}

export interface IShopeeBrands {
  brand_list: IShopeeBrandList[];
  has_next_page: boolean;
  next_offset: number;
  is_mandatory: boolean;
  input_type: string;
}

export interface IShopeeBrandResponse {
  brandList: IShopeeBrandList[];
  isMandatory: boolean;
}

export interface IShopeeBrandList {
  brand_id: number;
  original_brand_name: string;
  display_brand_name: string;
}

export interface IShopeeCreateProductImage {
  image_id_list: string[];
}

export interface IShopeeCreateProductVariation {
  name: string;
  stock: number;
  price: number;
  variation_sku: string;
}

export interface IShopeeUpdateProductVariant {
  variation_id: number;
  name: string;
  variation_sku: string;
}

export interface IShopeeAddVariationToProduct {
  item_id: number;
  variations: IShopeeCreateProductVariation[];
}

export interface IShopeeVariationCreate {
  item_id: number;
  tier_variation: IShopeeVariationTier[];
  model: IShopeeVariationModel[] | IShopeeVariationModelResponse[];
}
export interface IShopeeVariationModelResponse {
  tier_index: number[];
  model_id: number;
  promotion_id?: number;
  model_sku?: string;
  stock_info: IShopeeVariationStockInfo[];
  price_info: IShopeeVariationPriceInfo[];
}

export interface IShopeeGetVariationModelResponse {
  model_id: number;
  promotion_id: number;
  tier_index: number[];
  stock_info: IShopeeGetVariationModelResponseStockInfo[];
  price_info: IShopeeGetVariationModelResponsePriceInfo[];
}

export interface IShopeeGetVariationModelResponseStockInfo {
  stock_type: number;
  current_stock: number;
  normal_stock: number;
  reserved_stock: number;
}

export interface IShopeeGetVariationModelResponsePriceInfo {
  current_price: number;
  original_price: number;
  inflated_price_of_current_price: number;
  inflated_price_of_original_price: number;
}

export interface IShopeeVariationStockInfo {
  stock_type: number;
  normal_stock: number;
}

export interface IShopeeVariationPriceInfo {
  original_price: number;
}

export interface IShopeeVariationTier {
  name: string;
  option_list: IShopeeVariationOptionList[];
}

export interface IShopeeVariationOptionList {
  option: string;
  image?: IShopeeVariationImage;
}

export interface IShopeeVariationImage {
  image_id: string;
  image_url?: string;
}

export interface IShopeeVariationModel {
  tier_index: any;
  normal_stock: number;
  original_price: number;
  model_sku: string;
}

export interface IShopeeVariationModelListResponse {
  tier_variation: IShopeeVariationTier[];
  model: IShopeeVariationModelResponse[];
}

export interface IShopeeUpdateTierVariationPayload {
  item_id: number;
  tier_variation: IShopeeVariationTier[];
}

export const ProductMarketPlaceTypeDefs = gql`
  "Product MarketPlace Schema"
  type ProductMarketPlaceModel {
    id: Int
    pageID: Int
    marketPlaceID: String
    productID: Int
    name: String
    marketPlaceType: String
    productJson: String
    active: Boolean
    totalProducts: String
  }

  type ProductMarketPlaceListModel {
    id: Int
    marketPlaceID: String
    name: String
    price: String
    variants: String
    marketPlaceType: String
    totalRows: Int
    inventory: Int
    active: Boolean
    sold: Int
  }

  type ProductMarketPlaceVariantListModel {
    id: Int
    productMarketPlaceID: Int
    name: String
    unitPrice: Int
    inventory: Int
    marketPlaceType: String
    active: Boolean
  }

  type ProductMarketPlaceCategoryTreeModel {
    id: Int
    marketplaceType: String
    name: String
    categoryID: Int
    parentID: Int
    leaf: Boolean
    language: String
  }

  input MergedMarketPlaceItemInput {
    mergedMarketPlaceID: Int
    mergedMarketPlaceType: String
  }

  input publishProductOnLazadaInput {
    productID: Int
    categoryID: Int
    isCreateMultipleProduct: Boolean
    payload: String
  }

  input PublishProductOnShopeeInput {
    productID: Int
    categoryID: Int
    logistics: String
    variantIDs: [Int]
    attributes: String
    brand: String
  }

  type LazadaCategoriesModel {
    categoryPath: String
    categoryName: String
    categoryId: Int
  }

  type LazadaCategoryAttributesModel {
    name: String
    input_type: String
    options: [NameModel]
    is_mandatory: Int
    attribute_type: String
    is_sale_prop: Int
    label: String
  }

  type ShopeeCategoryAttributesModel {
    attribute_id: Int
    original_attribute_name: String
    display_attribute_name: String
    is_mandatory: Boolean
    input_validation_type: String
    format_type: String
    date_format_type: String
    input_type: String
    attribute_unit: [String]
    attribute_value_list: [ShopeeAttributeValueModel]
  }

  type ShopeeAttributeValueModel {
    value_id: Int
    original_value_name: String
    display_value_name: String
    value_unit: String
    parent_attribute_list: [ShopeeParentAttributeListModel]
    parent_brand_list: [ShopeeParentBrandListModel]
  }

  type ShopeeParentAttributeListModel {
    parent_attribute_id: Int
    parent_value_id: Int
  }

  type ShopeeParentBrandListModel {
    parent_brand_id: Int
  }

  type ShopeeBrandResponseModel {
    brandList: [ShopeeBrandListModel]
    isMandatory: Boolean
  }

  type ShopeeBrandListModel {
    brand_id: Int
    original_brand_name: String
    display_brand_name: String
  }

  extend type Query {
    getProductsFromLazada: HTTPResult
    getProductsFromShopee: HTTPResult
    getProductMarketPlaceList(isImported: Boolean, filters: TableFilterInput): [ProductMarketPlaceListModel]
    getProductMarketPlaceVariantList(id: Int, isMerged: Boolean): [ProductMarketPlaceVariantListModel]
    getLazadaSuggestedCategories(keywords: [String]): [LazadaCategoriesModel]
    getLazadaCategoryAttribute(id: Int, marketPlaceType: String, lang: String): [LazadaCategoryAttributesModel]
    getShopeeCategoryAttribute(id: Int, marketPlaceType: String, lang: String): [ShopeeCategoryAttributesModel]
    getMarketPlaceBrandSuggestions(keyword: String, socialType: String, isSuggestion: Boolean): [NameModel]
    getProductMarketPlaceCategoryTree(marketPlaceType: String, parentOrCategoryID: Int, isCategory: Boolean, language: String): [ProductMarketPlaceCategoryTreeModel]
    getShopeeLogistics: TextString
    getShopeeBrands(id: Int): ShopeeBrandResponseModel
  }

  extend type Mutation {
    importDeleteProductFromMarketPlace(ids: [Int], operation: String): HTTPResult
    mergeMarketPlaceProductOrVariant(id: Int, marketIDs: [Int], mergeType: String): [HTTPResult]
    unMergeMarketPlaceProductOrVariant(unMergeItem: [MergedMarketPlaceItemInput], unMergeType: String): HTTPResult
    publishProductOnLazada(payloadParams: publishProductOnLazadaInput): [HTTPResult]
    publishProductOnShopee(payloadParams: PublishProductOnShopeeInput): [HTTPResult]
    publishVariantToShopeeProduct(productID: Int, variantIDs: [Int]): [HTTPResult]
    updateProductOnMarketPlaces(id: Int, marketPlaceUpdateTypes: [String]): [HTTPResult]
  }
`;

export const productMarketPlaceListValidate = {
  isImported: Joi.boolean().required(),
  filters: tableFilterValidate,
};

export const productMarketPlaceIDMergeValidate = {
  id: Joi.number().required(),
  isMerged: Joi.boolean().required(),
};

export const mergeMarketPlaceToProductValidate = {
  id: Joi.number().required(),
  marketIDs: Joi.array().items(Joi.number().required()).required(),
  mergeType: Joi.string().required(),
};

export const productMarketPlaceListResponseValidate = {
  id: Joi.number().required(),
  marketPlaceID: Joi.string().required(),
  name: Joi.string().required(),
  marketPlaceType: Joi.string().required(),
  variants: Joi.number().required(),
  active: Joi.boolean().required(),
  inventory: Joi.number().required(),
  price: Joi.string().required(),
  updated_at: Joi.string().required(),
  totalRows: Joi.number().required(),
};

export const marketPlaceShopeeBrandValidate = {
  brand_list: Joi.array()
    .items({
      brand_id: Joi.number().allow('').allow(null),
      original_brand_name: Joi.string().allow('').allow(null),
      display_brand_name: Joi.string().allow('').allow(null),
    })
    .allow('')
    .allow(null),
  has_next_page: Joi.boolean().allow('').allow(null),
  next_offset: Joi.number().allow('').allow(null),
  is_mandatory: Joi.boolean().allow('').allow(null),
  input_type: Joi.string().allow('').allow(null),
};

export const productMarketPlaceVariantListResponseValidate = {
  id: Joi.number().required(),
  productMarketPlaceID: Joi.string().required(),
  name: Joi.string().allow(null).allow(''),
  unitPrice: Joi.number().required(),
  inventory: Joi.number().required(),
  marketPlaceType: Joi.string().required(),
  active: Joi.boolean().required(),
};

export const unMergeMarketPlaceValidate = {
  unMergeItem: Joi.array()
    .items(
      Joi.object({
        mergedMarketPlaceID: Joi.number().required(),
        mergedMarketPlaceType: Joi.string().required(),
      }),
    )
    .required(),
  unMergeType: Joi.string().required(),
};

export const lazadaCategoryListValidate = {
  categoryPath: Joi.string(),
  categoryName: Joi.string().required(),
  categoryId: Joi.number().required(),
};

export const lazadaCategoryAttributeListValidate = {
  name: Joi.string().required(),
  input_type: Joi.string().required(),
  options: Joi.array().items(nameValidate),
  is_mandatory: Joi.number().required(),
  attribute_type: Joi.string().required(),
  is_sale_prop: Joi.number().required(),
  label: Joi.string().required(),
};

export const shopeeCategoryAttributeListValidate = {
  attribute_id: Joi.number().required(),
  original_attribute_name: Joi.string().required(),
  display_attribute_name: Joi.string().required(),
  is_mandatory: Joi.boolean().required(),
  input_validation_type: Joi.string().required(),
  format_type: Joi.string().required(),
  date_format_type: Joi.string().allow('').allow(null),
  input_type: Joi.string().required(),
  attribute_unit: Joi.array(),
  attribute_value_list: Joi.array().allow(null),
};

export const productMarketPlaceCategoryTreeListValidate = {
  id: Joi.number().required(),
  marketplaceType: Joi.string().required(),
  categoryID: Joi.number().required(),
  name: Joi.string().required(),
  parentID: Joi.number().required(),
  leaf: Joi.boolean().required(),
  language: Joi.string().required(),
};

export const createProductOnLazadaParamsValidate = {
  payloadParams: Joi.object()
    .keys({
      productID: Joi.number().required(),
      categoryID: Joi.number().required(),
      payload: Joi.string().allow(null).allow(''),
      isCreateMultipleProduct: Joi.boolean().required(),
    })
    .required(),
};

export const keywordsValidate = {
  keywords: Joi.array().items(Joi.string().required()).required(),
};

export const marketPlaceUpdateValidate = {
  id: Joi.number().required(),
  marketPlaceUpdateTypes: Joi.array().items(Joi.string().required().allow('')).allow('').allow(null),
};

export const lazadaCategoryAttributeValidate = {
  id: Joi.number().required(),
  marketPlaceType: Joi.string().required(),
  lang: Joi.string().required(),
};

export const marketPlaceBrandSuggestionsValidate = {
  keyword: Joi.string().required(),
  socialType: Joi.string().required(),
  isSuggestion: Joi.boolean().required(),
};

export const marketPlaceCategoryTreeParamsValidate = {
  parentOrCategoryID: Joi.number().required(),
  marketPlaceType: Joi.string().required(),
  isCategory: Joi.boolean().required(),
  language: Joi.string().required(),
};

export const shopeeCreateVariantValidate = {
  productID: Joi.number().required(),
  variantIDs: Joi.array().items(Joi.number().required()).required(),
};

export const shopeeCreateProductValidate = {
  payloadParams: Joi.object()
    .keys({
      productID: Joi.number().required(),
      categoryID: Joi.number().required(),
      logistics: Joi.string().required(),
      variantIDs: Joi.array().items(Joi.number().required()).required(),
      attributes: Joi.string().required(),
      brand: Joi.string().allow(null).allow(''),
    })
    .required(),
};

export interface IShopeeCreateProductResponse {
  item_id: number;
  category_id: number;
  item_name: string;
  description: string;
  attributes: IShopeeCreateResponseAttribute[];
  price_info: IShopeeCreateResponsePriceInfo;
  stock_info: IShopeeCreateResponseStockInfo;
  images: IShopeeProductResponseImages;
  weight: number;
  dimension: IShopeeCreateResponseDimension;
  logistic_info: IShopeeCreateResponseLogisticInfo[];
  pre_order: IShopeeCreateResponsePreOrder;
  condition: string;
  item_status: string;
  brand: IShopeeCreateResponseBrand;
}

export interface IShopeeProductBaseInfo {
  item_id: number;
  category_id: number;
  item_name: string;
  description: string;
  item_sku: string;
  create_time: number;
  update_time: number;
  image: IShopeeProductResponseImages;
  weight: string;
  dimension: IShopeeCreateResponseDimension;
  logistic_info: IShopeeCreateResponseLogisticInfo[];
  pre_order: IShopeeCreateResponsePreOrder;
  condition: string;
  size_chart: string;
  item_status: string;
  has_model: boolean;
  brand: IShopeeCreateResponseBrand;
  item_dangerous: number;
  model_list?: IShopeeVariationModelListResponse;
}

export interface IShopeeProductBaseInfoNoModel extends IShopeeProductBaseInfo {
  price_info: IShopeeVariationPriceInfo[];
  stock_info: IShopeeVariationStockInfo[];
}

export interface IShopeeProductUpdatePayload {
  item_id: number;
  description?: string;
  attribute_list?: IShopeeCreateResponseAttribute[];
  item_sku?: string;
  condition?: string;
  pre_order?: IShopeeCreateResponsePreOrder;
  item_name?: string;
  category_id?: number;
  logistic_info?: IShopeeCreateResponseLogisticInfo[];
  weight?: number;
  wholesale?: IShopeeCreateProductWholesale[];
  item_status?: string;
  image?: IShopeeProductImageIDList;
  dimension?: IShopeeCreateResponseDimension;
  brand?: IShopeeCreateResponseBrand;
  price_info?: IShopeeVariationPriceInfo[];
  stock_info?: IShopeeVariationStockInfo[];
}

export interface IShopeeCreateResponseDimension {
  package_length: number;
  package_width: number;
  package_height: number;
}

export interface IShopeeCreateResponseLogisticInfo {
  logistic_id: number;
  enabled: boolean;
  shipping_fee: number;
  size_id: number;
  is_free: boolean;
}

export interface IShopeeCreateResponsePreOrder {
  is_pre_order: boolean;
  days_to_ship: number;
}

export interface IShopeeCreateResponseBrand {
  brand_id: number;
  original_brand_name: string;
}

export interface IShopeeCreateResponsePriceInfo {
  original_price: number;
  current_price: number;
  inflated_price_of_current_price?: number;
  inflated_price_of_original_price?: number;
}

export interface IShopeeCreateResponseStockInfo {
  stock_type: number;
  normal_stock: number;
  current_stock: number;
  reserved_stock?: number;
}

export interface IShopeeCreateResponseAttribute {
  attribute_id: number;
  attribute_value_list: IShopeeCreateResponseAttributeValueList[];
}

export interface IShopeeProductResponseImages extends IShopeeProductImageIDList {
  image_url_list: string[];
}

export interface IShopeeProductImageIDList {
  image_id_list: string[];
}
export interface IShopeeCreateResponseAttributeValueList {
  value_id: number;
  original_value_name: string;
  value_unit: string;
}

export interface IShopeeCreateResponseVariation {
  status: string;
  original_price: number;
  update_time: number;
  set_content: any[];
  price: number;
  variation_id: number;
  discount_id: number;
  create_time: number;
  name: string;
  is_set_item: boolean;
  variation_sku: string;
  reserved_stock: number;
  stock: number;
}

export interface IShopeeCreateResponseLogistic {
  logistic_name: string;
  shipping_fee: number;
  enabled: boolean;
  logistic_id: number;
  is_free: boolean;
}

export interface IShopeeGetProductListParams extends IShopeeUpdateDateOptions {
  offset: number;
  page_size: number;
  item_status: ShopeeProductStatusTypes;
}
