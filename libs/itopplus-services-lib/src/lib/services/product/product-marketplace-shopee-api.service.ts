import { axiosGetWithParams, axiosPostWithFormData, axiosPostWithHeader, getShopeeCommonParamsPostV2, getShopeeCommonParamsV2 } from '@reactor-room/itopplus-back-end-helpers';
import { LanguageTypes } from '@reactor-room/model-lib';
import {
  IShopeeBrandApiParams,
  IShopeeBrands,
  IShopeeCreateUpdateProductRequired,
  IShopeeEnv,
  IShopeeGetProductListParams,
  IShopeeOrderDetailListResponse,
  IShopeeOrdersRequestParams,
  IShopeeProductUpdatePayload,
  IShopeeResponseOrderList,
  IShopeeSellerDetails,
  IShopeeUpdateTierVariationPayload,
  IShopeeUpdateVariantInventoryRequest,
  IShopeeUpdateVariantPriceRequest,
  IShopeeVariationCreate,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import querystring from 'querystring';

export const getCategoryTreeFromShopeeApi = async <T>(shop_id: number, access_token: string, language: LanguageTypes, shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeGetCategoryTree: path, shopeeUrl } = shopeeEnv;
    const categoryURL = `${shopeeUrl}${path}`;

    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const shopeeResponse = await axiosGetWithParams(categoryURL, { ...commonParams, language });
    if (!isEmpty(shopeeResponse?.data?.response)) {
      return shopeeResponse?.data?.response?.category_list;
    } else {
      console.log('getCategoryTreeFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getCategoryAttributeFromShopeeApi = async <T>(shop_id: number, access_token: string, category_id: number, language: string, shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeGetAttribute: path, shopeeUrl } = shopeeEnv;
    const attributeURL = `${shopeeUrl}${path}`;

    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const shopeeResponse = await axiosGetWithParams(attributeURL, { ...commonParams, language, category_id });
    if (shopeeResponse?.data?.response?.attribute_list) {
      return shopeeResponse?.data?.response?.attribute_list;
    } else {
      console.log('getCategoryAttributeFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    console.log(' getCategoryAttributeFromShopeeApi -->', error);
    throw new Error(error);
  }
};

export const getProductListFromShopeeApi = async <T>(shop_id: number, access_token: string, params: IShopeeGetProductListParams, shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeGetProductList: path, shopeeUrl } = shopeeEnv;
    const productURL = `${shopeeUrl}${path}`;

    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const shopeeResponse = await axiosGetWithParams(productURL, { ...commonParams, ...params });
    if (!shopeeResponse?.data?.error) {
      return shopeeResponse?.data?.response;
    } else {
      console.log('getProductListFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    console.log(' getProductListFromShopeeApi -->', error);
    throw new Error(error);
  }
};

export const getLogisticsFromShopeeApi = async <T>(shop_id: number, access_token: string, shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeGetLogistics: path, shopeeUrl } = shopeeEnv;
    const logisticURL = `${shopeeUrl}${path}`;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const shopeeResponse = await axiosGetWithParams(logisticURL, commonParams);
    if (shopeeResponse?.data?.response?.logistics_channel_list) {
      return shopeeResponse?.data?.response?.logistics_channel_list;
    } else {
      console.log('getLogisticsFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getBrandsFromShopeeApi = async (shop_id: number, access_token: string, shopeeBrandParmas: IShopeeBrandApiParams, shopeeEnv: IShopeeEnv): Promise<IShopeeBrands> => {
  try {
    const { shopeeGetBrands: path, shopeeUrl } = shopeeEnv;
    const brandURL = `${shopeeUrl}${path}`;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const shopeeResponse = await axiosGetWithParams(brandURL, { ...commonParams, ...shopeeBrandParmas });
    if (shopeeResponse?.data?.response?.brand_list) {
      return shopeeResponse?.data?.response as IShopeeBrands;
    } else {
      console.log('getLogisticsFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getProductBaseInfoFromShopeeApi = async <T>(shop_id: number, access_token: string, shopeeProductID: number[], shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeGetProductBaseInfo: path, shopeeUrl } = shopeeEnv;
    const productDetailURL = `${shopeeUrl}${path}`;
    const item_id_list = shopeeProductID.join(',');
    const params = { ...getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv }), item_id_list };
    const shopeeResponse = await axiosGetWithParams(productDetailURL, params);
    if (shopeeResponse?.data?.response?.item_list) {
      return shopeeResponse?.data?.response?.item_list;
    } else {
      console.log('getProductBaseInfoFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      throw new Error(shopeeResponse?.data?.error);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getModelListFromShopeeApi = async <T>(shop_id: number, access_token: string, shopeeProductID: number, shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeGetModelList: path, shopeeUrl } = shopeeEnv;
    const modelListURL = `${shopeeUrl}${path}`;
    const item_id = shopeeProductID;
    const params = { ...getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv }), item_id };
    const shopeeResponse = await axiosGetWithParams(modelListURL, params);
    if (!shopeeResponse?.data?.error?.length) {
      return shopeeResponse?.data?.response;
    } else {
      console.log('getModelListFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      throw new Error(shopeeResponse?.data?.error);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateVariantPriceOnShopeeAPI = async <T>(shop_id: number, payload: IShopeeUpdateVariantPriceRequest, access_token: string, shopeeEnv: IShopeeEnv): Promise<void> => {
  try {
    const { shopeeUpdatePriceProduct: path, shopeeUrl } = shopeeEnv;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const params = querystring.stringify({
      ...commonParams,
    });
    const updatePriceURL = `${shopeeUrl}${path}?${params}`;
    const shopeeResponse = await axiosPostWithHeader(updatePriceURL, payload, { 'Content-Type': 'application/json' });
    if (!shopeeResponse?.data.response?.failure_list?.length) {
      return shopeeResponse?.data.response;
    } else {
      const failureReasons = shopeeResponse?.data?.response?.failure_list?.map((failure) => failure.failed_reason)?.join(',') || '';
      console.log('updateVariantPriceOnShopeeAPI --> shopeeResponse?.data :>> ', JSON.stringify(shopeeResponse?.data));
      const errMsg = `SHOPEE_PRICE_UPDATE_ERROR Error -> ${shopeeResponse?.data?.error} ${failureReasons} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateTierVariationOnShopeeAPI = async <T>(
  shop_id: number,
  payload: IShopeeUpdateTierVariationPayload,
  access_token: string,
  shopeeEnv: IShopeeEnv,
): Promise<void> => {
  try {
    const { shopeeUpdateTierVariation: path, shopeeUrl } = shopeeEnv;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const params = querystring.stringify({
      ...commonParams,
    });
    const updateTierVariationURL = `${shopeeUrl}${path}?${params}`;
    const shopeeResponse = await axiosPostWithHeader(updateTierVariationURL, payload, { 'Content-Type': 'application/json' });
    if (!shopeeResponse?.data.response?.error?.length) {
      return shopeeResponse?.data.response;
    } else {
      console.log('updateTierVariationOnShopeeAPI --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateVariantInventoryOnShopeeAPI = async <T>(
  shop_id: number,
  payload: IShopeeUpdateVariantInventoryRequest,
  access_token: string,
  shopeeEnv: IShopeeEnv,
): Promise<void> => {
  try {
    const { shopeeUpdateInventoryProduct: path, shopeeUrl } = shopeeEnv;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const params = querystring.stringify({
      ...commonParams,
    });
    const updatePriceURL = `${shopeeUrl}${path}?${params}`;
    const shopeeResponse = await axiosPostWithHeader(updatePriceURL, payload, { 'Content-Type': 'application/json' });
    if (!shopeeResponse?.data.response?.failure_list?.length) {
      return shopeeResponse?.data.response;
    } else {
      const failureReasons = shopeeResponse?.data?.response?.failure_list?.map((failure) => failure.failed_reason)?.join(',') || '';
      console.log('updateVariantInventoryOnShopeeAPI --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `SHOPEE_INVENTORY_UPDATE_ERROR Error -> ${shopeeResponse?.data?.error} ${failureReasons} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const createProductOnShopeeApi = async <T>(
  shop_id: number,
  createPayloadRequried: IShopeeCreateUpdateProductRequired,
  isUpdate: boolean,
  access_token: string,
  shopeeEnv: IShopeeEnv,
): Promise<T> => {
  try {
    const { shopeeCreateProduct, shopeeUpdateProduct, shopeeUrl } = shopeeEnv;
    const path = isUpdate ? shopeeUpdateProduct : shopeeCreateProduct;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const params = querystring.stringify({
      ...commonParams,
    });
    const createURL = `${shopeeUrl}${path}?${params}`;
    isUpdate && delete createPayloadRequried.image;
    const shopeeResponse = await axiosPostWithHeader(createURL, createPayloadRequried, { 'Content-Type': 'application/json' });
    if (shopeeResponse?.data.response?.item_id) {
      return shopeeResponse?.data.response;
    } else {
      console.log('createProductOnShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const updateProductOnShopeeApi = async <T>(shop_id: number, updatePayload: IShopeeProductUpdatePayload, access_token: string, shopeeEnv: IShopeeEnv): Promise<T> => {
  try {
    const { shopeeUpdateProduct: path, shopeeUrl } = shopeeEnv;
    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const params = querystring.stringify({
      ...commonParams,
    });
    const createURL = `${shopeeUrl}${path}?${params}`;
    const shopeeResponse = await axiosPostWithHeader(createURL, updatePayload, { 'Content-Type': 'application/json' });
    if (shopeeResponse?.data.response?.item_id) {
      return shopeeResponse?.data.response;
    } else {
      console.log('updateProductOnShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Shopee Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const addVariationOnShopeeApi = async (
  shop_id: number,
  access_token: string,
  variationPayload: IShopeeVariationCreate,
  shopeeEnv: IShopeeEnv,
): Promise<IShopeeVariationCreate> => {
  const { shopeeAddProductVariants: path, shopeeUrl } = shopeeEnv;
  const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
  const params = querystring.stringify({
    ...commonParams,
  });
  const variationURL = `${shopeeUrl}${path}?${params}`;
  const shopeeResponse = await axiosPostWithHeader(variationURL, variationPayload, { 'Content-Type': 'application/json' });
  if (shopeeResponse?.data.response?.item_id) {
    return shopeeResponse?.data?.response;
  } else {
    console.log('addVariationAPI --> shopeeResponse?.data :>> ', shopeeResponse?.data);
    const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
    throw new Error(errMsg);
  }
};

export const getOrdersListFromShopeeApi = async (
  shop_id: number,
  access_token: string,
  payload: IShopeeOrdersRequestParams,
  shopeeEnv: IShopeeEnv,
): Promise<IShopeeResponseOrderList> => {
  try {
    const { shopeeGetOrdersList: path, shopeeUrl } = shopeeEnv;
    const params = { ...getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv }), ...payload };
    const orderURL = `${shopeeUrl}${path}`;
    const shopeeResponse = await axiosGetWithParams(orderURL, params);
    if (!shopeeResponse?.data?.error) {
      return shopeeResponse?.data?.response;
    } else {
      console.log('getOrdersListFromShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getOrderDetailsFromShopeeApi = async (
  shop_id: number,
  access_token: string,
  order_sn_list: string,
  response_optional_fields: string,
  shopeeEnv: IShopeeEnv,
): Promise<IShopeeOrderDetailListResponse> => {
  try {
    const { shopeeGetOrderDetails: path, shopeeUrl } = shopeeEnv;
    const params = { ...getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv }), order_sn_list, response_optional_fields };
    const orderDetailsURL = `${shopeeUrl}${path}`;
    const shopeeResponse = await axiosGetWithParams(orderDetailsURL, params);
    if (!shopeeResponse?.data.response?.error) {
      return shopeeResponse?.data?.response;
    } else {
      throw new Error(shopeeResponse?.data?.error);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const uploadImageShopeeApi = async <T>(shop_id: number, access_token: string, shopeeEnv: IShopeeEnv, formData: any): Promise<T> => {
  try {
    const { shopeeUploadImage: path, shopeeUrl } = shopeeEnv;
    const { partner_id, timestamp, sign } = getShopeeCommonParamsPostV2({ access_token, path, shopeeEnv });
    const params = querystring.stringify({
      partner_id,
      timestamp,
      sign,
    });
    const imageUploadURL = `${shopeeUrl}${path}?${params}`;
    const shopeeResponse = await axiosPostWithFormData(imageUploadURL, formData, formData.getHeaders());
    const imageInfo = shopeeResponse?.data?.response?.image_info;
    if (imageInfo?.image_id) {
      return imageInfo;
    } else {
      console.log('uploadImageShopeeApi --> shopeeResponse?.data :>> ', shopeeResponse?.data);
      const errMsg = `Error -> ${shopeeResponse?.data?.error} : Message -> ${shopeeResponse?.data?.message}`;
      throw new Error(errMsg);
    }
  } catch (error) {
    throw new Error(error);
  }
};

export const getShopeeSellerDetailsFromShopeeApi = async (shop_id: number, access_token: string, shopeeEnv: IShopeeEnv): Promise<IShopeeSellerDetails> => {
  try {
    const { shopeeGetSeller: path, shopeeUrl } = shopeeEnv;
    const sellerDetailURL = `${shopeeUrl}${path}`;

    const commonParams = getShopeeCommonParamsV2({ shop_id, access_token, path, shopeeEnv });
    const shopeeResponse = await axiosGetWithParams(sellerDetailURL, commonParams);
    const shopeeResponseData = shopeeResponse?.data as IShopeeSellerDetails;
    if (shopeeResponseData?.shop_name) {
      return shopeeResponseData;
    } else {
      throw new Error('SELLER_DETAIL_ERROR');
    }
  } catch (error) {
    throw new Error('SELLER_DETAIL_ERROR');
  }
};
