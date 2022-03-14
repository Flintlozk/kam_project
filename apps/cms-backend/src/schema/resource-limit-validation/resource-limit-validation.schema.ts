import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { requestResourceValidate, resourcesValidationResponseValidate } from '@reactor-room/itopplus-model-lib';

export function validateRequestResourceValidate<T>(data: T): T {
  return validate<T>(requestResourceValidate, data);
}

export function validateResponseRequestResourceValidate<T>(data: T): T {
  return validate<T>(resourcesValidationResponseValidate, data);
}
