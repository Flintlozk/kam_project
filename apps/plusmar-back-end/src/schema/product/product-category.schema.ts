import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import { productCategoryListValidate, productCategoryListValidateRequest, productCategoryHolderValidateRequest } from '@reactor-room/itopplus-model-lib';

export function validateResponseProductCategoryList<T>(data: T): T {
  return validateArray(productCategoryListValidate, data);
}

export function validateRequestProductCategoryList<T>(data: T): T {
  return validateArray(productCategoryListValidateRequest, data);
}

export function validateProductCategoryHolderRequest<T>(data: T): T {
  return validate(productCategoryHolderValidateRequest, data);
}
