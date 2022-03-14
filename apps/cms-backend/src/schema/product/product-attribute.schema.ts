import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import { productAttributeListValidate, productAttribIDSubAttribName, productAttributeListRequestValidate } from '@reactor-room/itopplus-model-lib';
import { countObjectValidate } from '@reactor-room/model-lib';

export function validateResponseProductAttributeList<T>(data: T): T {
  return validateArray(productAttributeListValidate, data);
}

export function validateRequestProductAttributeList<T>(data: T): T {
  return validate(productAttributeListRequestValidate, data);
}

export function validateRequestProductSubAttributeAdd<T>(data: T): T {
  return validate(productAttribIDSubAttribName, data);
}

export function validateResponseCount<T>(data: T): T {
  return validate(countObjectValidate, data);
}
