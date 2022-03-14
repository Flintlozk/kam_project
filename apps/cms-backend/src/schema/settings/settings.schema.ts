import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import {
  shopOwnerProfile,
  settinSubscriptionDetail,
  pageValidate,
  getShopDetail,
  getUserPhone,
  settinPageMember,
  socialConnect,
  socialConnectRequest,
  lineSettingRequest,
  lineResponse,
  lineSettingResponse,
  verifyLineSettingResponse,
  companyInfoResponse,
  trackingType,
  settingWebhookPatternValidateRequest,
  settingWebhookPatternValidateResponse,
  removeWebhookPatternValidateRequest,
} from '@reactor-room/itopplus-model-lib';

export function validateResponseShopProfile<T>(data: T): T {
  const result = validate(shopOwnerProfile, data);
  return result;
}
export function validateResponseGetShopDetail<T>(data: T): T {
  const result = validate(getShopDetail, data);
  return result;
}
export function validateCompanyInfoResponse<T>(data: T): T {
  const result = validate(companyInfoResponse, data);
  return result;
}
export function validateResponseSettingSubScription<T>(data: T): T {
  const result = validate(settinSubscriptionDetail, data);
  return result;
}
export function validateGetPhoneUser<T>(data: T): T {
  const result = validate(getUserPhone, data);
  return result;
}
export function validateGetLogisticTrackingType<T>(data: T): T {
  const result = validate(trackingType, data);
  return result;
}
export function validateResponseSettingPageMember<T>(data: T): T {
  const result = validate(settinPageMember, data);
  return result;
}

export function validateResponseSocialConnect<T>(data: T): T {
  const result = validate(socialConnect, data);
  return result;
}

export function validatePageParam<T>(data: T): T {
  const result = validate(pageValidate, data);
  return result;
}

export function validateRequestSocialConnect<T>(data: T): T {
  const result = validate(socialConnectRequest, data);
  return result;
}

export function validateRequestSetLineChannelDetail<T>(data: T): T {
  const result = validate(lineSettingRequest, data);
  return result;
}

export function validateResponseLineChannelSetting<T>(data: T): T {
  const result = validate(lineSettingResponse, data);
  return result;
}

export function validateResponseVerifyLineChannelSetting<T>(data: T): T {
  const result = validate(verifyLineSettingResponse, data);
  return result;
}

export function validateResponseLineResponse<T>(data: T): T {
  const result = validate(lineResponse, data);
  return result;
}

export function validateRequestWebhookPattern<T>(data: T): T {
  const result = validate(settingWebhookPatternValidateRequest, data);
  return result;
}

export function validateRequestRemoveWebhookPattern<T>(data: T): T {
  const result = validate(removeWebhookPatternValidateRequest, data);
  return result;
}

export function validateResponseWebhookPattern<T>(data: T): T {
  const result = validateArray(settingWebhookPatternValidateResponse, data);
  return result;
}
