import { validate } from '@reactor-room/itopplus-back-end-helpers';
import { TaxResponseValidate, TaxInputObjectValidate, TaxIDInputValidate, UpdateTaxStatusInputValidate, TaxInputWithIDValidate } from '@reactor-room/itopplus-model-lib';

export function validateTaxResponse<T>(data: T) {
  return validate(TaxResponseValidate, data);
}

export function validateTaxInput<T>(data: T): T {
  return validate(TaxInputObjectValidate, data);
}

export function validateTaxIDInput<T>(data: T): T {
  return validate(TaxIDInputValidate, data);
}

export function validateUpdateTaxStatusInput<T>(data: T): T {
  return validate(UpdateTaxStatusInputValidate, data);
}

export function validateTaxInputWithIDValidate<T>(data: T): T {
  return validate(TaxInputWithIDValidate, data);
}
