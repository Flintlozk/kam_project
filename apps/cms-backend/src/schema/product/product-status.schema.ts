import { validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { productStatusValidate } from '@reactor-room/itopplus-model-lib';

export function validateResponseProductStatus<T>(data: T): T {
  return validateArray(productStatusValidate, data);
}
