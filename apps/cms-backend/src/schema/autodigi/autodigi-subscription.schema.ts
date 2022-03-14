import {
  checkSubscriptionLinkStatusResponse,
  getLinkedAutodigiWebsitesRequest,
  getLinkedAutodigiWebsitesResponse,
  setPrimaryAutodigiLinkRequest,
} from '@reactor-room/autodigi-models-lib';
import { validate } from '@reactor-room/itopplus-back-end-helpers';

export function ValidateCheckSubscriptionLinkStatusResponse<T>(data: T): T {
  return validate(checkSubscriptionLinkStatusResponse, data);
}
export function ValidateGetLinkedAutodigiWebsitesResponse<T>(data: T): T {
  return validate(getLinkedAutodigiWebsitesResponse, data);
}
export function ValidateupdateLinkWebsiteAutodigiRequest<T>(data: T): T {
  return validate(getLinkedAutodigiWebsitesRequest, data);
}
export function ValidateSetPrimaryAutodigiLinkRequest<T>(data: T): T {
  return validate(setPrimaryAutodigiLinkRequest, data);
}
