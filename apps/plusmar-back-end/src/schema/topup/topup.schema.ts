import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { topUpHashValidate, topUpHistoriesValidate } from '@reactor-room/itopplus-model-lib';

export function validateTopupHashValidatation<T>(data: T): T {
  return validate<T>(topUpHashValidate, data);
}

export function validateTopupHidstoriesValidatation<T>(data: T): T {
  return validateArray<T>(topUpHistoriesValidate, data);
}
