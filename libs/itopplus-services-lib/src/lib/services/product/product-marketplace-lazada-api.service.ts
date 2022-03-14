import { axiosGetWithParams, axiosPostWithoutHeader } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { getLazadaRequestResult } from '@reactor-room/itopplus-back-end-helpers';
import { ILazadaBrandParams, ILazadaEnv, IOrderRequestParams } from '@reactor-room/itopplus-model-lib';
import { encode, ParsedUrlQueryInput } from 'querystring';
import { js2xml } from 'xml-js';
import {
  getBrandFromLazadaUrlParams,
  getCreateProductLazadaUrlParams,
  getLazadaCategoryAttributesUrlParams,
  getLazadaCategorySuggestionUrlParams,
  getLazadaDefaultAccessUrlParams,
  getLazadaOrderItemsUrlParams,
  getLazadaOrdersUrlParams,
  getLazadaPriceInventoryUpdateRequestObj,
  getLazadaProductsUrlParams,
  getProductPriceQuantityUpdateLazadaUrlParams,
  getUpdateProductLazadaUrlParams,
} from '../../domains';

const xmlOptions = { compact: true, ignoreComment: true, alwaysChildren: true };
export const getProductFromLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, offset = null, limit = null): Promise<T> => {
  const { lazadaApiUrlTH, lazadaProductGet } = lazadaEnv;
  const productFromLazadaUrlParams = getLazadaProductsUrlParams(accessToken, lazadaEnv, offset, limit);
  const productApiUrl = `${lazadaApiUrlTH}${lazadaProductGet}`;
  const lazadaApiResponse = await axiosGetWithParams(productApiUrl, productFromLazadaUrlParams);
  return lazadaApiResponse?.data;
};

export const getOrdersFromLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, ordersRequestParams: IOrderRequestParams): Promise<T> => {
  const { lazadaApiUrlTH, lazadaGetOrders } = lazadaEnv;
  const ordersParams = getLazadaOrdersUrlParams(accessToken, lazadaEnv, ordersRequestParams);
  const ordersApiUrl = `${lazadaApiUrlTH}${lazadaGetOrders}`;
  const lazadaApiResponse = await axiosGetWithParams(ordersApiUrl, ordersParams);
  return lazadaApiResponse?.data;
};

export const getOrderItemsFromLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, order_id: number): Promise<T> => {
  const { lazadaApiUrlTH, lazadaGetOrderItems } = lazadaEnv;
  const orderItemsParams = getLazadaOrderItemsUrlParams(accessToken, lazadaEnv, order_id);
  const orderItemsApiUrl = `${lazadaApiUrlTH}${lazadaGetOrderItems}`;
  const lazadaApiResponse = await axiosGetWithParams(orderItemsApiUrl, orderItemsParams);
  return lazadaApiResponse?.data;
};

export const getCategoryTreeFromLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv): Promise<T> => {
  const { lazadaApiUrlTH, lazadaGetCategoryTree } = lazadaEnv;
  const categoryTreeParams = getLazadaDefaultAccessUrlParams(accessToken, lazadaGetCategoryTree, lazadaEnv);
  const categoryTreeApiUrl = `${lazadaApiUrlTH}${lazadaGetCategoryTree}`;
  const lazadaApiResponse = await axiosGetWithParams(categoryTreeApiUrl, categoryTreeParams);
  return lazadaApiResponse?.data;
};

export const updateInventoryOnLazadaApi = async (accessToken: string, Quantity: number, SellerSku: string, lazadaEnv: ILazadaEnv): Promise<IHTTPResult> => {
  const lazadaUPriceInventoryUpdateObj = {
    SellerSku,
    Quantity,
  };
  const lazadaPriceInventoryUpdateRequestObj = getLazadaPriceInventoryUpdateRequestObj(lazadaUPriceInventoryUpdateObj);
  const lazadaUpdateXML = js2xml(lazadaPriceInventoryUpdateRequestObj, xmlOptions);
  const { lazadaApiUrlTH, lazadaProductPriceQuantityUpdate } = lazadaEnv;
  const productUpdateApiUrl = `${lazadaApiUrlTH}${lazadaProductPriceQuantityUpdate}`;
  const lazadaProductPriceQuantityUpdateParams = getProductPriceQuantityUpdateLazadaUrlParams(accessToken, lazadaEnv, lazadaUpdateXML);
  const productApiResponse = await axiosPostWithoutHeader(productUpdateApiUrl, lazadaProductPriceQuantityUpdateParams);
  const productApiResult = getLazadaRequestResult(productApiResponse?.data);
  return productApiResult;
};

export const updateInventoryPriceOnLazadaApi = async (accessToken: string, Quantity: number, Price: number, SellerSku: string, lazadaEnv: ILazadaEnv): Promise<IHTTPResult> => {
  const lazadaUPriceInventoryUpdateObj = {
    SellerSku,
    Quantity,
    Price,
  };
  const lazadaPriceInventoryUpdateRequestObj = getLazadaPriceInventoryUpdateRequestObj(lazadaUPriceInventoryUpdateObj);
  const lazadaUpdateXML = js2xml(lazadaPriceInventoryUpdateRequestObj, xmlOptions);
  const { lazadaApiUrlTH, lazadaProductPriceQuantityUpdate } = lazadaEnv;
  const productUpdateApiUrl = `${lazadaApiUrlTH}${lazadaProductPriceQuantityUpdate}`;
  const lazadaProductPriceQuantityUpdateParams = getProductPriceQuantityUpdateLazadaUrlParams(accessToken, lazadaEnv, lazadaUpdateXML);
  const productApiResponse = await axiosPostWithoutHeader(productUpdateApiUrl, lazadaProductPriceQuantityUpdateParams);
  const productApiResult = getLazadaRequestResult(productApiResponse?.data);
  return productApiResult;
};

export const getBrandsFromLazadaApi = async <T>(accessToken: string, { startRow, pageSize }: ILazadaBrandParams, lazadaEnv: ILazadaEnv): Promise<T> => {
  const { lazadaApiUrlTH, lazadaGetBrand } = lazadaEnv;
  const lazadaBrandParams = getBrandFromLazadaUrlParams(accessToken, lazadaEnv, { startRow, pageSize });
  const brandApiUrl = `${lazadaApiUrlTH}${lazadaGetBrand}`;
  const lazadaApiResponse = await axiosGetWithParams(brandApiUrl, lazadaBrandParams);
  return lazadaApiResponse?.data;
};

export const getCategorySuggestionFromLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, keyword: string): Promise<T> => {
  const { lazadaApiUrlTH, lazadaGetCategorySuggestion } = lazadaEnv;
  const params = getLazadaCategorySuggestionUrlParams(accessToken, lazadaEnv, keyword);
  const apiUrl = `${lazadaApiUrlTH}${lazadaGetCategorySuggestion}`;
  const lazadaApiResponse = await axiosGetWithParams(apiUrl, params);
  return lazadaApiResponse?.data;
};

export const getCategoryAttributesFromLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, primary_category_id: number): Promise<T> => {
  const { lazadaApiUrlTH, lazadaGetCateogoryAttributes } = lazadaEnv;
  const attributeParams = getLazadaCategoryAttributesUrlParams(accessToken, lazadaEnv, primary_category_id);
  const attributeUrl = `${lazadaApiUrlTH}${lazadaGetCateogoryAttributes}`;
  const lazadaApiResponse = await axiosGetWithParams(attributeUrl, attributeParams);
  return lazadaApiResponse?.data;
};

/** route : '/product/create' */
export const createProductOnLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, payload: any): Promise<T> => {
  const xmlOptions = { compact: true, ignoreComment: true };
  const { lazadaApiUrlTH, lazadaCreateProduct } = lazadaEnv;
  const createProductUrl = `${lazadaApiUrlTH}${lazadaCreateProduct}`;
  const lazadaUpdateXML = js2xml(payload, xmlOptions).toString();
  const lazadaCreateProductParams = getCreateProductLazadaUrlParams(accessToken, lazadaEnv, lazadaUpdateXML) as unknown as ParsedUrlQueryInput;
  const lazadaCreateProductParamsQueryString = encode(lazadaCreateProductParams);
  const productApiResponse = await axiosPostWithoutHeader(createProductUrl, lazadaCreateProductParamsQueryString);
  return productApiResponse?.data;
};

/** route : '/product/update' */
export const updateProductOnLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, payload: any): Promise<T> => {
  const xmlOptions = { compact: true, ignoreComment: true };
  const { lazadaApiUrlTH, lazadaUpdateProduct } = lazadaEnv;
  const updateProductUrl = `${lazadaApiUrlTH}${lazadaUpdateProduct}`;
  const lazadaUpdateXML = js2xml(payload, xmlOptions).toString();
  const lazadaUpdateProductParams = getUpdateProductLazadaUrlParams(accessToken, lazadaEnv, lazadaUpdateXML) as unknown as ParsedUrlQueryInput;
  const lazadaUpdateProductParamsQueryString = encode(lazadaUpdateProductParams);
  const productApiResponse = await axiosPostWithoutHeader(updateProductUrl, lazadaUpdateProductParamsQueryString);
  return productApiResponse?.data;
};

/**
 * route : '/product/deactivate'
 * docs : https://open.lazada.com/doc/api.htm#/api?cid=5&path=/product/deactivate
 */
export const setProductActivationOnLazadaApi = async <T>(accessToken: string, lazadaEnv: ILazadaEnv, payload: any): Promise<T> => {
  // TODO : When delete product on more-commerce would do deactivate on Marketplace instead of delete
  const xmlOptions = { compact: true, ignoreComment: true };
  const { lazadaApiUrlTH } = lazadaEnv;
  const updateProductUrl = `${lazadaApiUrlTH}/product/deactivate`;
  // apiRequestBody instead of payload
  const lazadaUpdateXML = js2xml(payload, xmlOptions).toString();
  const lazadaUpdateProductParams = getUpdateProductLazadaUrlParams(accessToken, lazadaEnv, lazadaUpdateXML) as unknown as ParsedUrlQueryInput;
  const lazadaUpdateProductParamsQueryString = encode(lazadaUpdateProductParams);
  const productApiResponse = await axiosPostWithoutHeader(updateProductUrl, lazadaUpdateProductParamsQueryString);
  return productApiResponse?.data;
};
