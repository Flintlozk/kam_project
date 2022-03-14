import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import { productTagValidate, productTagResponseSearchValidate } from '@reactor-room/itopplus-model-lib';

export function validateResponseProductTag<T>(data: T): T {
  return validateArray(productTagValidate, data);
}

export function validateResponseProductTagSearch<T>(data: T): T {
  return validateArray(productTagResponseSearchValidate, data);
}

export function validateResponseAddTag<T>(data: T): T {
  return validate(productTagResponseSearchValidate, data);
}
