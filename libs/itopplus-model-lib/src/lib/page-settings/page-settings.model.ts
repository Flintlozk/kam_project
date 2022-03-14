import * as Joi from 'joi';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { EnumBankAccountType, EnumLogisticDeliveryProviderType, EnumLogisticSystemType, EPageMessageTrackMode, ICustomerOffTimeDetail } from '@reactor-room/itopplus-model-lib';
import type { PageSettingType } from './page-settings.enum';

export type PageSettingOptionType =
  | IPageCloseCustomerOptions
  | IPageCustomerSlaTimeOptions
  | IPageTermsAndConditionOptions
  | IPagePrivacyPolicyOptions
  | IPageWorkingHoursOptions
  | IPageMessageTrackMode
  | IPageLogisticSystemOptions
  | IPageQuickpayWebhookOptions;
export interface IPageTermsAndConditionOptions {
  textTH: string;
  textENG: string;
}
export interface IPageMessageTrackMode {
  trackMode: EPageMessageTrackMode;
}

export interface IPageLogisticSystemOptionPricingTable {
  type: EnumLogisticSystemType;
  isActive: boolean;
  provider?: EnumLogisticDeliveryProviderType; // on PRICING_TABLE
}
export interface IPageLogisticSystemOptionFlatRate {
  type: EnumLogisticSystemType;
  isActive: boolean;
  deliveryFee?: number; // on FLAT_RATE
}
export interface IPageLogisticSystemOptionFixedRate {
  type: EnumLogisticSystemType;
  isActive: boolean;
  useMin: boolean; // If set true Any order's price lower than amount will "charge" and use fallbackType method ELSE free
  amount: number;
  fallbackType: EnumLogisticSystemType; // on MIN_PRICE allow to choose PRICING_TABLE | FLAT_RATE
}
export interface IPageLogisticSystemOptions {
  pricingTable: IPageLogisticSystemOptionPricingTable;
  flatRate: IPageLogisticSystemOptionFlatRate;
  fixedRate: IPageLogisticSystemOptionFixedRate;
}

export type PageLogisitcSystem = IPageLogisticSystemOptionPricingTable | IPageLogisticSystemOptionFlatRate | IPageLogisticSystemOptionFixedRate;

export interface IPagePrivacyPolicyOptions {
  textTH: string;
  textENG: string;
}
export interface IPageCloseCustomerOptions {
  url: string;
}
export interface IPageQuickpayWebhookOptions {
  url: string;
}
export interface IPageCustomerSlaTimeOptions {
  alertHour: number; // Time before reach SLA
  alertMinute: number; // Time before reach SLA
  hour: number; // Time over SLA
  minute: number; // Time over SLA
}

export interface IPageWorkingHoursOptionAdditional {
  isActive: boolean;
  time: number;
}

export interface IPageWorkingHoursOptionOffTime {
  isActive: boolean;
  attachment: string;
  message: string;
}
export interface IPageWorkingHoursOptionTimes {
  openTime: Date;
  openTimeString: string;
  closeTime: Date;
  closeTimeString: string;
}
export interface IPageWorkingHoursOptionDates {
  day?: string;
  isActive: boolean;
  allTimes: boolean;
  times: IPageWorkingHoursOptionTimes[];
}

export interface IPageWorkoingHourEmailShopDetail {
  shopName: string;
  shopPicture: string;
}
export interface IPageWorkoingHourEmailMessages {
  _id: string;
  audienceID: number;
  text: string;
  timestamp: Date;
  link: string;
  customerDetail: ICustomerOffTimeDetail;
}
export interface IPageWorkingHoursOptionNotifyList {
  isActive: boolean;
  emails: { email: string }[];
}
export interface IPageWorkingHoursOptions {
  offTime: IPageWorkingHoursOptionOffTime;
  notifyList: IPageWorkingHoursOptionNotifyList;
  additional: IPageWorkingHoursOptionAdditional;
  sunday: IPageWorkingHoursOptionDates;
  monday: IPageWorkingHoursOptionDates;
  tuesday: IPageWorkingHoursOptionDates;
  wednesday: IPageWorkingHoursOptionDates;
  thursday: IPageWorkingHoursOptionDates;
  friday: IPageWorkingHoursOptionDates;
  saturday: IPageWorkingHoursOptionDates;
}
export interface IPageSettings {
  id: number;
  page_id: number;
  setting_type: PageSettingType;
  status: boolean;
  created_at: Date;
  updated_at: Date;
  options: string | PageSettingOptionType;
}

export interface IPageWebhookPatternSetting {
  id: number;
  name: string;
  regex_pattern: string;
  url: string;
  status: boolean;
}

export interface IPageWebhookPatternPayload {
  audience_id: number;
  page_id: number;
  customer_id: number;
  platform_user_id: string;
  message: string;
  url: string;
  platform_type: AudiencePlatformType;
}

export interface IPageWebhookQuickpay {
  url: string;
}

export interface IPageWebhookQuickpayPayload extends IPageWebhookQuickpay {
  page_id: number;
  quickpay_name: string;
  amount: number;
  slip_url: string;
  method: string;
  bankAccount: EnumBankAccountType;
  date: string;
  time: string;
  customer_id: number;
}

export interface IEachPageSettingsSLA {
  pageID: number;
  messageTrack: EPageMessageTrackMode;
  alertSLA: string;
  exceedSLA: string;
}

export interface ILogisticSystemTempMapping {
  logisticID: number;
  logisticSystem: boolean;
  method: EnumLogisticSystemType;
  fallBackMethod: EnumLogisticSystemType;
  isFallback: boolean;
  shippingFee: number;
}

export const settingWebhookPatternValidateRequest = {
  id: Joi.number().allow(null),
  name: Joi.string().required(),
  url: Joi.string().required(),
  regex_pattern: Joi.string().required(),
  status: Joi.boolean().required(),
};

export const removeWebhookPatternValidateRequest = {
  id: Joi.number().required(),
};

export const settingWebhookPatternValidateResponse = {
  id: Joi.number().required(),
  name: Joi.string().required(),
  url: Joi.string().required(),
  regex_pattern: Joi.string().required(),
  status: Joi.boolean().required(),
};

export const logisticSystemInputValidate = {
  pricingTable: Joi.object()
    .keys({
      type: Joi.string().valid('PRICING_TABLE', 'FLAT_RATE', 'FIXED_RATE').required(),
      isActive: Joi.boolean().required(),
      provider: Joi.string().valid('THAILAND_POST', 'FLASH_EXPRESS', 'J_AND_T').required(),
    })
    .required(),
  flatRate: Joi.object()
    .keys({ type: Joi.string().valid('PRICING_TABLE', 'FLAT_RATE', 'FIXED_RATE').required(), isActive: Joi.boolean().required(), deliveryFee: Joi.number().required() })
    .required(),
  fixedRate: Joi.object()
    .keys({
      type: Joi.string().valid('PRICING_TABLE', 'FLAT_RATE', 'FIXED_RATE').required(),
      isActive: Joi.boolean().required(),
      useMin: Joi.boolean().required(),
      amount: Joi.number().required(),
      fallbackType: Joi.string().valid('PRICING_TABLE', 'FLAT_RATE').required(),
    })
    .required(),
};
