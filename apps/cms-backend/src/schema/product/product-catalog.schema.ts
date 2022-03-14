import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { authCatalogValidate, pageCatalogValidate, sendCatalogToChatBoxValidate } from '@reactor-room/itopplus-model-lib';

export function validateRequestSendCatalogToChatBox<T>(data: T): T {
  return validate<T>(sendCatalogToChatBoxValidate, data);
}

export function validateRequestCatalogAuth<T>(data: T): T {
  return validate<T>(authCatalogValidate, data);
}

export function validateRequestCatalogPage<T>(data: T): T {
  return validate<T>(pageCatalogValidate, data);
}
