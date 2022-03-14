import * as Joi from 'joi';
import gql from 'graphql-tag';
import * as JoiDate from 'joi-date-dayjs';
import { IPageLogisticSystemOptions, logisticSystemInputValidate } from '../../page-settings';
import { ILotNumberModel } from '../lot-number/lot-number.model';
import { EnumLogisticDeliveryProviderType, EnumLogisticFeeType, EnumLogisticType, EnumTrackingType } from './logistic-enum';
declare const Buffer;
Joi.extend(JoiDate);

export interface ILogisticModel {
  _id?: string;
  id: number;
  page_id: number;
  name: string;
  type: EnumLogisticType;
  fee_type: EnumLogisticFeeType;
  delivery_type: EnumLogisticDeliveryProviderType;
  tracking_type: EnumTrackingType;
  cod_status: boolean;
  delivery_fee: number;
  tracking_url: string;
  image: string;
  country: string;
  delivery_days: number;
  wallet_id: string;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  option?: ILogisticConfig;
  logisticLotNumbers: ILotNumberModel[];
  courier_pickup: boolean;
  sub_system: IPageLogisticSystemOptions;
}
export interface ThemeWithILogisticModel {
  logisticModel: ILogisticModel;
  theme?: string;
}
export interface LogisticPayloadDetail {
  id: number;
  name: string;
  type: string;
  flatRate: boolean;
  deliveryFee: number;
  isCOD: boolean;
}

export interface TrackingDetail {
  trackNo: string;
  logisticType: string;
}

export interface ILogisticModelInput {
  _id?: string;
  name: string;
  type: EnumLogisticType;
  feeType: EnumLogisticFeeType;
  deliveryType: EnumLogisticDeliveryProviderType;
  codStatus: boolean;
  deliveryFee: number;
  image: string;
  trackingUrl: string;
  deliveryDays: string;
  walletId: string;
  trackingType: EnumTrackingType;
  status: boolean;
  option?: string; //| ILogisticConfig; // ILogisticOption have to cast after parse string to object
  subSystem?: IPageLogisticSystemOptions;
}

export interface IUpdateLogisticFormInput {
  id: number;
  logisticInputData: ILogisticModelInput;
}

export interface ILogisticFiltersInput {
  orderBy: string[];
  orderMethod: string;
}

export interface ILogisticArg {
  id: number;
  logisticInputData: ILogisticModelInput;
  status: boolean;
  fee: number;
  filters: ILogisticFiltersInput;
}

export interface ILogisticSelectorTemplate {
  id: number;
  name: string;
  type: EnumLogisticDeliveryProviderType;
  trackingType: EnumTrackingType;
  flatRate: boolean;
  deliveryFee: number;
  isCOD: boolean;
  hash: string;
}

export interface ILogisticConfig {
  type: string;
  merchant_id?: string;
  merchant_secret?: string;
  shop_id?: string;
  shop_name?: string;
  option1?: string;
  option2?: string;
  option3?: string;
  option4?: string;
  registered?: boolean;
}
export class FlashExpressConfig implements ILogisticConfig {
  type: string;
  merchant_id: string;
  insured: boolean;
}
export class JAndTExpressConfig implements ILogisticConfig {
  type: string;
  shop_id: string;
  shop_name: string;
  insured: boolean;
  registered: boolean;
}
export class AlphaFastConfig implements ILogisticConfig {
  type: string;
  merchant_id: string;
}
export interface ILogisticLabelsBuffer {
  label1?: string | typeof Buffer;
  label2?: string | typeof Buffer;
  label3?: string | typeof Buffer;
  label4?: string | typeof Buffer;
}
export interface ILogisticLabels extends ILogisticLabelsBuffer {
  _id?: string;
  trackID: number;
  pageID: number;
  orderID: number;
}
export interface ICalculatedShippingResultByType {
  orderID: number;
  aliasOrderId: string;
  weight: number;
  weightRange: number;
  price: number;
}

export interface ICalculatedShipping {
  orders: ICalculatedShippingResultByType[];
  totalPrice: number;
  isAfford: boolean;
}
export interface IPayOffResult {
  isSuccess: boolean;
  message?: string;
  orderID?: number;
  remainingCredit?: number;
  totalPrice?: number;
  trackingNo?: string;
  aliasOrderId?: string;
}

export const LogisticTypeDefs = gql`
  interface ILogisticConfigOption {
    type: String
  }

  type ThaiPostConfig implements ILogisticConfigOption {
    type: String
    tracking_generate_status: Boolean
    tracking_start_numbers: String
    tracking_end_numbers: String
    wallet_id: String
  }

  type ThaiEmsConfig implements ILogisticConfigOption {
    type: String
    tracking_generate_status: Boolean
    tracking_start_numbers: String
    tracking_end_numbers: String
    wallet_id: String
  }
  type FlashExpressConfig implements ILogisticConfigOption {
    type: String
    tracking_generate_status: Boolean
    tracking_start_numbers: String
    tracking_end_numbers: String
    wallet_id: String
    merchant_id: String
    insured: Boolean
  }
  type JAndTConfig implements ILogisticConfigOption {
    type: String
    tracking_generate_status: Boolean
    tracking_start_numbers: String
    tracking_end_numbers: String
    registered: Boolean
    wallet_id: String
    shop_id: String
    shop_name: String
    insured: Boolean
  }
  type AlphaFastConfig implements ILogisticConfigOption {
    type: String
    tracking_generate_status: Boolean
    tracking_start_numbers: String
    tracking_end_numbers: String
    wallet_id: String
    merchant_id: String
  }

  "Logistic Schema"
  type LogisticModel {
    page_id: Int
    id: Int
    name: String
    type: EnumLogisticType
    fee_type: EnumLogisticFeeType
    delivery_type: EnumLogisticDeliveryProviderType
    cod_status: Boolean
    delivery_fee: Float
    image: String
    country: String
    tracking_url: String
    delivery_days: String
    status: Boolean
    tracking_type: EnumTrackingType
    expired_at: Date
    created_at: Date
    updated_at: Date
    option: ILogisticConfigOption
    sub_system: PageLogisticSystemOption
    logisticLotNumbers: [LotNumberModel]
  }

  type LogisticJoinLotNumber {
    page_id: Int
    id: Int
    name: String
    type: EnumLogisticType
    fee_type: EnumLogisticFeeType
    delivery_type: EnumLogisticDeliveryProviderType
    cod_status: Boolean
    wallet_id: String
    delivery_fee: Float
    image: String
    country: String
    tracking_url: String
    delivery_days: String
    tracking_type: EnumTrackingType
    status: Boolean
    created_at: Date
    updated_at: Date
    option: ILogisticConfigOption
    sub_system: PageLogisticSystemOption
    logisticLotNumbers(logistic_id: Int): [LotNumberModel]
  }
  enum EnumLogisticType {
    DOMESTIC_INTERNATIONAL
    DOMESTIC
    INTERNATIONAL
  }

  enum EnumLogisticFeeType {
    FREE
    FLAT_RATE
  }

  enum EnumLogisticDeliveryProviderType {
    THAILAND_POST
    EMS_THAILAND
    FLASH_EXPRESS
    J_AND_T
    ALPHA
    CUSTOM
  }

  enum EnumTrackingType {
    DROP_OFF
    MANUAL
    BOOK
  }

  input LogisticModelInput {
    name: String
    type: EnumLogisticType
    feeType: EnumLogisticFeeType
    deliveryType: EnumLogisticDeliveryProviderType
    codStatus: Boolean
    walletId: String
    deliveryFee: Float
    image: String
    country: String
    trackingUrl: String
    deliveryDays: String
    trackingType: EnumTrackingType
    status: Boolean
    option: String
    subSystem: PageLogisticSystemOptionInput
  }

  input LogisticFiltersInput {
    orderBy: [String]
    orderMethod: String
  }

  input ThaiPostConfigInput {
    type: String
    walletID: String
    trackingGenerateStatus: Boolean
    trackingStartNumbers: String
    trackingEndNumbers: String
  }

  input ThaiEmsConfigInput {
    type: String
    walletID: String
    trackingGenerateStatus: Boolean
    trackingStartNumbers: String
    trackingEndNumbers: String
  }

  type CalculatedShippingResultByType {
    orderID: Int
    aliasOrderId: String
    weight: Float
    weightRange: Int
    price: Int
  }

  type CalculatedShippingResult {
    orders: [CalculatedShippingResultByType]
    totalPrice: Int
    isAfford: Boolean
  }
  type PayOffResult {
    isSuccess: Boolean
    message: String
    orderID: Int
    aliasOrderId: String
    remainingCredit: Int
    totalPrice: Int
    trackingNo: String
  }

  extend type Query {
    getLogisticPageLogisticSettings: [LogisticModel]
    getLogisticsByPageID(pageID: Int, filters: LogisticFiltersInput): [LogisticJoinLotNumber]
    getPageFeeInfo(pageID: Int): PageFeeInfo
    calculateShippingPrice(orderIDs: [Int]): CalculatedShippingResult
    paySingleDropOffBalance(orderID: Int, platform: String): PayOffResult
    verifyJAndTExpress: HTTPResult
  }

  extend type Mutation {
    createLogistic(logisticInputData: LogisticModelInput): HTTPResult
    updateLogisticStatus(id: Int, status: Boolean): HTTPResult
    updatePageFlatStatus(status: Boolean): HTTPResult
    updatePageDeliveryFee(fee: Float): HTTPResult
    updateLogistic(id: Int, logisticInputData: LogisticModelInput): HTTPResult
    deleteLogistic(id: Int): HTTPResult
  }
`;

export const LogisticObjectValidate = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  type: Joi.string().required(),
  fee_type: Joi.string().required(),
  delivery_type: Joi.string().required(),
  delivery_fee: Joi.number().required(),
  image: Joi.string().allow(''),
  tracking_url: Joi.string().allow(''),
  delivery_days: Joi.string().allow(''),
  cod_status: Joi.boolean(),
  wallet_id: Joi.string().allow(''),
  status: Joi.boolean(),
  option: Joi.any(),
};
export const LogisticInputValidate = {
  name: Joi.string().required(),
  type: Joi.string().required(),
  feeType: Joi.string().required(),
  deliveryType: Joi.string().required(),
  deliveryFee: Joi.number().required(),
  image: Joi.string().allow(''),
  trackingUrl: Joi.string().allow(''),
  deliveryDays: Joi.string().allow(''),
  walletId: Joi.string().allow(''),
  trackingType: Joi.string().required(),
  codStatus: Joi.boolean(),
  status: Joi.boolean(),
  option: Joi.any(),
  subSystem: logisticSystemInputValidate,
};

export const LogisticInputObjectValidate = {
  logisticInputData: LogisticInputValidate,
};

export const LogisticFiltersInputValidate = {
  orderBy: Joi.any(),
  orderMethod: Joi.string().required(),
};

export const LogisticFiltersInputObjectValidate = {
  filters: LogisticFiltersInputValidate,
};

export const LogistcIDInputValidate = {
  id: Joi.number().required(),
};

export const UpdateLogisticStatusInputValidate = {
  id: Joi.number().required(),
  status: Joi.boolean().required(),
};

export const UpdatePageFlatStatusInputValidate = {
  status: Joi.boolean().required(),
};

export const UpdateDeliveryFeeInputValidate = {
  fee: Joi.number().required(),
};

export const UpdateLogisticFormInputValidate = {
  id: Joi.number().required(),
  logisticInputData: LogisticInputValidate,
};

export const calculateShippingPriceValidate = {
  orders: Joi.array().items({
    orderID: Joi.number(),
    aliasOrderId: Joi.string(),
    weight: Joi.number(),
    weightRange: Joi.number(),
    price: Joi.number(),
  }),
  totalPrice: Joi.number(),
  isAfford: Joi.boolean(),
};
export const payDropOffResultValidate = {
  isSuccess: Joi.boolean(),
  message: Joi.string(),
  orderID: Joi.number(),
  aliasOrderId: Joi.string(),
  remainingCredit: Joi.number(),
  totalPrice: Joi.number(),
  trackingNo: Joi.string().allow(''),
};
