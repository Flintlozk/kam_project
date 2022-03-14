import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  cartMessageValidate,
  credentialAndPageIDValidate,
  facebookFanPageId,
  facebookPageWithBindedPageStatusValidate,
  fbPageIDValidate,
  pageIndexValidate,
  pageThirdPartyPageTypeObjectValidate,
  pageWithOwnerInfoValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateResponsePages<T>(data: T): T {
  return data;
  // return validateArray<T>(PagesObjectValidate, data);
}

export function validateCartMessageResponse<T>(data: T): T {
  return validate<T>(cartMessageValidate, data);
}

export function validatePageWithOwnerInfo<T>(data: T): T {
  return validate<T>(pageWithOwnerInfoValidate, data);
}

export function validateFacebookPageWithBindedPageStatus<T>(data: T): T {
  return validateArray<T>(facebookPageWithBindedPageStatusValidate, data);
}

export function validateCredentialAndPageID<T>(data: T): T {
  return validate<T>(credentialAndPageIDValidate, data);
}

export function validatePageIndex<T>(data): T {
  return validate<T>(pageIndexValidate, data);
}

export function validateFbPageIDValidate<T>(data): T {
  return validate<T>(fbPageIDValidate, data);
}

export function validateRequestFaceBookFanPage<T>(data: T): T {
  return validate<T>(facebookFanPageId, data);
}

export function validateRequestPageThirdPartyPageType<T>(data: T): T {
  return validate<T>(pageThirdPartyPageTypeObjectValidate, data);
}
