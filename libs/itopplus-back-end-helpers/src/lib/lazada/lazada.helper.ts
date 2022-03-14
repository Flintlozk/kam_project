import { ILazadaDefaultAccessRequest } from '@reactor-room/model-lib';
import { ILazadaEnv, IProductLazadaVariantResponse } from '@reactor-room/itopplus-model-lib';
import { createHmac } from 'crypto';
import { keys, xor } from 'lodash';
import { getUTCUnixLazadaTimestamps } from '../utc.helper';
const EMPTY_LAZADA_DEFINED_VARIANT: IProductLazadaVariantResponse = {
  Status: null,
  quantity: null,
  Images: null,
  //Variation3: null, not to use custom variation to get lazada variation
  SellerSku: null,
  ShopSku: null,
  Url: null,
  multiWarehouseInventories: null,
  package_width: null,
  package_height: null,
  fblWarehouseInventories: null,
  special_price: null,
  price: null,
  //Variation1: null, not to use custom variation to get lazada variation
  channelInventories: null,
  package_length: null,
  package_weight: null,
  SkuId: null,
};

const LAZADA_DEFINED_VARIANT_LIST = keys(EMPTY_LAZADA_DEFINED_VARIANT);

export const getSortedObjForLazada = <T>(obj: T): T => {
  const objKeys = [] as string[];
  const sortedObj = {} as T;
  for (const key in obj) {
    if (Object.prototype.hasOwnProperty.call(obj, key)) {
      objKeys.push(key);
    }
  }
  objKeys.sort();
  objKeys.forEach((key) => (sortedObj[key] = obj[key]));
  return sortedObj;
};

export const getLazadaConcatStringFromObj = <T>(obj: T): string => {
  let paramString = '';
  for (const [key, value] of Object.entries(obj)) {
    paramString += `${key}${value}`;
  }
  return paramString;
};

export const getLazadaSignCode = (concatStr: string, signInMethod: string, appSecret: string): string => {
  return createHmac(signInMethod, appSecret).update(concatStr).digest('hex').toString().toUpperCase();
};

export const mergeLazadaSignInCode = <T>(obj: T, sign: string): T => {
  return {
    ...obj,
    sign,
  };
};

export const getLazadaSignCodeAndParams = <T>(params: T, lazadaEndPoint: string, lazadaEnv: ILazadaEnv): T => {
  const { lazadaSignInMethod: sign_method, lazadaAppSecret } = lazadaEnv;
  const sortedParams = getSortedObjForLazada(params);
  const concatParamString = getLazadaConcatStringFromObj(sortedParams);
  const mergePathParamString = `${lazadaEndPoint}${concatParamString}`;
  const signCode = getLazadaSignCode(mergePathParamString, sign_method, lazadaAppSecret);
  const urlParams = mergeLazadaSignInCode(sortedParams, signCode);
  return urlParams;
};

export const getLazadaDefaultAccessTokenParams = (access_token: string, lazadaEnv: ILazadaEnv): ILazadaDefaultAccessRequest => {
  const { lazadaSignInMethod: sign_method, lazadaAppID: app_key } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const defaultAccessParams: ILazadaDefaultAccessRequest = {
    app_key,
    access_token,
    sign_method,
    timestamp,
  };
  return defaultAccessParams;
};

export const getLazadaResponseVariantName = (variant: IProductLazadaVariantResponse, lazadaProductName: string): string => {
  const variant1Exists = 'Variation3' in variant;
  const variant2Exists = 'Variation1' in variant;
  const customVariation = getLazadaDefinedVariation(variant);

  if (customVariation) return customVariation;
  if (variant1Exists && variant2Exists) return `${variant.Variation3}, ${variant.Variation1}`;
  if (variant1Exists && !variant2Exists) return variant.Variation3;
  if (!variant1Exists && variant2Exists) return variant.Variation1;
  if (!variant1Exists && !variant2Exists) return lazadaProductName || 'N/A';
};

export const getLazadaDefinedVariation = (variant: IProductLazadaVariantResponse): string => {
  const keysOfVariation = keys(variant);
  const variationList = xor(LAZADA_DEFINED_VARIANT_LIST, keysOfVariation);
  if (!variationList?.length) return '';
  return variationList?.length === 2 ? `${variant[variationList[0]]}, ${variant[variationList[1]]}` || '' : variant[variationList[0]] || '';
};
