import { getLazadaDefaultAccessTokenParams, getLazadaSignCodeAndParams, getUTCUnixLazadaTimestamps } from '@reactor-room/itopplus-back-end-helpers';
import { ILazadaDefaultAccessRequest } from '@reactor-room/model-lib';
import {
  ICategoryAttributesFromLazadaUrlParams,
  ICategorySuggestionFromLazadaUrlParams,
  ILazadaBrandParams,
  ILazadaCreateProductRequest,
  ILazadaEnv,
  ILazadaGetBrandParams,
  ILazadaProductPriceQuantityUpdateParams,
  ILazadaProductUpdateRequest,
  ILazadaUpdateProductRequest,
  IOrderFromLazadaUrlParams,
  IOrderRequestParams,
  IOrdersFromLazadaUrlParams,
  IProductFromLazadaUrlParams,
} from '@reactor-room/itopplus-model-lib';

export const getLazadaProductsUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, offset = null, limit = null): IProductFromLazadaUrlParams => {
  const filter = 'live';
  const { lazadaProductGet, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const productApiParams: IProductFromLazadaUrlParams = {
    access_token,
    app_key,
    sign_method,
    timestamp,
    filter,
    offset,
    limit,
  };
  const productApiParamsSign = getLazadaSignCodeAndParams(productApiParams, lazadaProductGet, lazadaEnv);
  return productApiParamsSign;
};

export const getLazadaOrdersUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, orderRequestParams: IOrderRequestParams): IOrdersFromLazadaUrlParams => {
  const { lazadaGetOrders, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const requiredParams = {
    access_token,
    app_key,
    sign_method,
    timestamp,
  };
  const apiParams = { ...requiredParams, ...orderRequestParams };
  const ordersApiParamsSign = getLazadaSignCodeAndParams(apiParams, lazadaGetOrders, lazadaEnv);
  return ordersApiParamsSign;
};

export const getLazadaDefaultAccessUrlParams = (access_token: string, lazadaEndPoint: string, lazadaEnv: ILazadaEnv): ILazadaDefaultAccessRequest => {
  const { lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const apiParams = {
    access_token,
    app_key,
    sign_method,
    timestamp,
  };
  const defaultAccessApiParamsSign = getLazadaSignCodeAndParams(apiParams, lazadaEndPoint, lazadaEnv);
  return defaultAccessApiParamsSign;
};

export const getLazadaCategoryAttributesUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, primary_category_id: number): ICategoryAttributesFromLazadaUrlParams => {
  const { lazadaGetCateogoryAttributes, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const apiParams = {
    access_token,
    app_key,
    sign_method,
    timestamp,
    primary_category_id,
  };
  const paramsSign = getLazadaSignCodeAndParams(apiParams, lazadaGetCateogoryAttributes, lazadaEnv);
  return paramsSign;
};

export const getLazadaCategorySuggestionUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, product_name: string): ICategorySuggestionFromLazadaUrlParams => {
  const { lazadaGetCategorySuggestion, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const apiParams = {
    access_token,
    app_key,
    sign_method,
    timestamp,
    product_name,
  };
  const paramsSign = getLazadaSignCodeAndParams(apiParams, lazadaGetCategorySuggestion, lazadaEnv);
  return paramsSign;
};

export const getLazadaOrderItemsUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, order_id: number): IOrderFromLazadaUrlParams => {
  const { lazadaGetOrderItems, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
  const timestamp = getUTCUnixLazadaTimestamps();
  const apiParams = {
    app_key,
    access_token,
    sign_method,
    timestamp,
    order_id,
  };
  const orderApiParamsSign = getLazadaSignCodeAndParams(apiParams, lazadaGetOrderItems, lazadaEnv);
  return orderApiParamsSign;
};

export const getProductPriceQuantityUpdateLazadaUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, xmlPayload: string): ILazadaProductPriceQuantityUpdateParams => {
  const { lazadaProductPriceQuantityUpdate } = lazadaEnv;
  const payload = xmlPayload;
  const accessParams = getLazadaDefaultAccessTokenParams(access_token, lazadaEnv);
  const productPriceQuantityParamsSign = getLazadaSignCodeAndParams<ILazadaProductPriceQuantityUpdateParams>(
    { ...accessParams, payload },
    lazadaProductPriceQuantityUpdate,
    lazadaEnv,
  );
  return productPriceQuantityParamsSign;
};

export const getBrandFromLazadaUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, { startRow, pageSize }: ILazadaBrandParams): ILazadaGetBrandParams => {
  const { lazadaGetBrand } = lazadaEnv;
  const accessParams = getLazadaDefaultAccessTokenParams(access_token, lazadaEnv);
  const lazadaBrandParamsSign = getLazadaSignCodeAndParams<ILazadaGetBrandParams>({ ...accessParams, startRow, pageSize }, lazadaGetBrand, lazadaEnv);
  return lazadaBrandParamsSign;
};

export const getCreateProductLazadaUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, xmlPayload: string): ILazadaProductPriceQuantityUpdateParams => {
  const { lazadaCreateProduct } = lazadaEnv;
  const payload = xmlPayload;
  const accessParams = getLazadaDefaultAccessTokenParams(access_token, lazadaEnv);
  const createProductSignCode = getLazadaSignCodeAndParams<ILazadaProductPriceQuantityUpdateParams>({ ...accessParams, payload }, lazadaCreateProduct, lazadaEnv);
  return createProductSignCode;
};

export const getUpdateProductLazadaUrlParams = (access_token: string, lazadaEnv: ILazadaEnv, xmlPayload: string): ILazadaProductPriceQuantityUpdateParams => {
  const { lazadaUpdateProduct } = lazadaEnv;
  const payload = xmlPayload;
  const accessParams = getLazadaDefaultAccessTokenParams(access_token, lazadaEnv);
  const updateProductSignCode = getLazadaSignCodeAndParams<ILazadaProductPriceQuantityUpdateParams>({ ...accessParams, payload }, lazadaUpdateProduct, lazadaEnv);
  return updateProductSignCode;
};

export const getLazadaPriceInventoryUpdateRequestObj = <T>(lazadaRequestObj: T): ILazadaProductUpdateRequest<T> => {
  const lazadaPriceInventoryUpdateObj = {
    Request: {
      Product: {
        Skus: {
          Sku: lazadaRequestObj,
        },
      },
    },
  };

  return lazadaPriceInventoryUpdateObj;
};

export const getLazadaCreateProductMainObj = <T, V>(): ILazadaCreateProductRequest<T, V> => {
  const lazadaCreateProductObj = {
    Request: {
      Product: {
        PrimaryCategory: null,
        SPUId: null,
        Images: {
          Image: [],
        },
        AssociatedSku: null,
        Attributes: null,
        Skus: {
          Sku: null,
        },
      },
    },
  };

  return lazadaCreateProductObj;
};

export const getLazadaUpdateProductObj = <T>(): ILazadaUpdateProductRequest<T> => {
  const lazadaUpdateProductObj = {
    Request: {
      Product: {
        ItemId: null,
        Images: { Image: [] },
        Attributes: {
          name: null,
          description: null,
        },
        Skus: {
          Sku: [] as T[],
        },
      },
    },
  };
  return lazadaUpdateProductObj;
};
export const getLazadaDeactivateProductObj = () => {
  const lazadaDeactivateProductObj = {
    Request: {
      Product: {
        ItemId: null,
      },
    },
  };
  return lazadaDeactivateProductObj;
};
