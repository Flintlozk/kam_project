import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  productAddValidate,
  productAddVariantValidateRequest,
  productByIDValidate,
  productIDValidateRequest,
  productListValidate,
  productListVariantListValidate,
  productMainUpdateValidate,
  productRemoveValidate,
  productVariantParamsValidateRequest,
  shopsProductVariantListValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateResponseProductList<T>(data: T): T {
  return validateArray(productListValidate, data);
}

export function validateResponseProductListVariants<T>(data: T): T {
  return validateArray(productListVariantListValidate, data);
}

export function validateResponseProductByID<T>(data: T): T {
  return validateArray(productByIDValidate, data);
}

export function validateResponseshopsProductVariantList<T>(data: T): T {
  return validateArray(shopsProductVariantListValidate, data);
}
export function validateProductAddRequest<T>(data: T): T {
  return validate(productAddValidate, data);
}

export function validateProductRemoveRequest<T>(data: T): T {
  return validate(productRemoveValidate, data);
}

export function validateProductOnlyIDRequest<T>(data: T): T {
  return validate(productIDValidateRequest, data);
}

export function validateProductMainUpdateRequest<T>(data: T): T {
  return validate(productMainUpdateValidate, data);
}

export function validateProductVariantParamsRequest<T>(data: T): T {
  return validate(productVariantParamsValidateRequest, data);
}

export function validateAddVariantRequest<T>(data: T): T {
  return validate(productAddVariantValidateRequest, data);
}
