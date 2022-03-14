import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { pageThirdPartyPageInactiveResponseValidate, pageThirdPartyPageResponseValidate, refreshPageThirdPartyTokenObjectValidate } from '@reactor-room/itopplus-model-lib';

export function validatePageThirdPartyPageResponse<T>(data: T): T {
  return validate(pageThirdPartyPageResponseValidate, data);
}

export function validatePageThirdPartyInactiveResponse<T>(data: T): T {
  return validateArray(pageThirdPartyPageInactiveResponseValidate, data);
}

export function validateRefreshPageThirdPartyTokenRequest<T>(data: T): T {
  return validate(refreshPageThirdPartyTokenObjectValidate, data);
}
