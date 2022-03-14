import { generateAutodigiLinkKeyResponse, linkAutodigiSubscriptionRequest, linkAutodigiSubscriptionResponse } from '@reactor-room/autodigi-models-lib';
import { validate } from '@reactor-room/itopplus-back-end-helpers';

export function ValidateGenerateAutodigiLinkKeyResponse<T>(data: T): T {
  return validate(generateAutodigiLinkKeyResponse, data);
}

export function ValidateLinkAutodigiSubscriptionRequest<T>(data: T): T {
  return validate(linkAutodigiSubscriptionRequest, data);
}
export function ValidateLinkAutodigiSubscriptionResponse<T>(data: T): T {
  return validate(linkAutodigiSubscriptionResponse, data);
}
