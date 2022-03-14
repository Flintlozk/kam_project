import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  createProductOnLazadaParamsValidate,
  keywordsValidate,
  lazadaCategoryAttributeListValidate,
  lazadaCategoryAttributeValidate,
  lazadaCategoryListValidate,
  marketPlaceBrandSuggestionsValidate,
  marketPlaceCategoryTreeParamsValidate,
  marketPlaceShopeeBrandValidate,
  marketPlaceUpdateValidate,
  mergeMarketPlaceToProductValidate,
  productMarketPlaceCategoryTreeListValidate,
  productMarketPlaceIDMergeValidate,
  productMarketPlaceListResponseValidate,
  productMarketPlaceListValidate,
  productMarketPlaceVariantListResponseValidate,
  shopeeCategoryAttributeListValidate,
  shopeeCreateProductValidate,
  shopeeCreateVariantValidate,
  unMergeMarketPlaceValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateProductMarketPlaceListRequest<T>(data: T): T {
  return validate(productMarketPlaceListValidate, data);
}

export function validateProductMarketPlaceUpdateRequest<T>(data: T): T {
  return validate(marketPlaceUpdateValidate, data);
}

export function validateMarketPlaceShopeeBrandResponse<T>(data: T): T {
  return validate(marketPlaceShopeeBrandValidate, data);
}

export function validateProductMarketPlaceListResponse<T>(data: T): T {
  return validateArray(productMarketPlaceListResponseValidate, data);
}

export function validateProductMarketPlaceVariantListResponse<T>(data: T): T {
  return validateArray(productMarketPlaceVariantListResponseValidate, data);
}
export function validateProductLazadaCategoryListResponse<T>(data: T): T {
  return validateArray(lazadaCategoryListValidate, data);
}

export function validateProductLazadaCategoryAttributeResponse<T>(data: T): T {
  return validateArray(lazadaCategoryAttributeListValidate, data);
}

export function validateProductShopeeCategoryAttributeResponse<T>(data: T): T {
  return validateArray(shopeeCategoryAttributeListValidate, data);
}

export function validateProductMarketPlaceCategoryTreeResponse<T>(data: T): T {
  return validateArray(productMarketPlaceCategoryTreeListValidate, data);
}

export function validateProductMarketPlaceIDMergeRequest<T>(data: T): T {
  return validate(productMarketPlaceIDMergeValidate, data);
}

export function validateMergeMarketPlaceToProductRequest<T>(data: T): T {
  return validate(mergeMarketPlaceToProductValidate, data);
}

export function validateUnMergeMarketPlaceRequest<T>(data: T): T {
  return validate(unMergeMarketPlaceValidate, data);
}

export function validateCreateProductOnLazadaParamsRequest<T>(data: T): T {
  return validate(createProductOnLazadaParamsValidate, data);
}

export function validateKeywordsRequest<T>(data: T): T {
  return validate(keywordsValidate, data);
}

export function validateLazadaCategoryAttributeRequest<T>(data: T): T {
  return validate(lazadaCategoryAttributeValidate, data);
}

export function validateMarketPlaceBrandSuggestionsRequest<T>(data: T): T {
  return validate(marketPlaceBrandSuggestionsValidate, data);
}

export function validateMarketPlaceCategoryTreeParamsRequest<T>(data: T): T {
  return validate(marketPlaceCategoryTreeParamsValidate, data);
}

export function validateMarketShopeeCreateProductRequest<T>(data: T): T {
  return validate(shopeeCreateProductValidate, data);
}

export function validateMarketShopeeCreateVariantRequest<T>(data: T): T {
  return validate(shopeeCreateVariantValidate, data);
}
