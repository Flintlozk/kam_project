import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { pageThirdPartyPageTypeObjectValidate } from '@reactor-room/itopplus-model-lib';

export function validateRequestPageThirdPartyPageType<T>(data: T): T {
  return validate<T>(pageThirdPartyPageTypeObjectValidate, data);
}
export function validateResponsePages<T>(data: T): T {
  return data;
  // return validateArray<T>(PagesObjectValidate, data);
}
