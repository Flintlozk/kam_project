import * as Joi from 'joi';
import { LanguageTypes } from '@reactor-room/model-lib';
import gql from 'graphql-tag';
import { SocialTypes } from './pages.enum';
export interface IPagesThirdParty {
  id: number;
  pageID: number;
  sellerID: string;
  name?: string;
  url: string;
  picture?: string;
  accessToken: string;
  pageType: SocialTypes;
  payload: string;
  sellerPayload?: string;
  accessTokenExpire?: string;
  refreshToken?: string;
  refreshTokenExpire?: string;
  createdAt?: Date;
  updatedAt?: Date;
  active?: boolean;
}

export type IPagesThirdPartyActive = Pick<IPagesThirdParty, 'id' | 'pageID' | 'name' | 'sellerID' | 'pageType' | 'active'>;

export interface IPageThirdPartyConnectRedirectParams {
  code: string;
  id: string;
  shop_id?: string;
}

export type IAddPagesThirdPartyParams = Pick<IPagesThirdParty, 'pageID' | 'sellerID' | 'accessToken' | 'pageType' | 'payload'>;

export type IPagesThirdPartyPageType = Pick<IPagesThirdParty, 'pageType'>;

export interface IPagesThirdPartyByPageTypeParams {
  pageID: number;
  pageType: [SocialTypes];
}

export enum TokenRefreshByTypes {
  ACCESS_TOKEN = 'ACCESS_TOKEN',
  REFRESH_TOKEN = 'REFRESH_TOKEN',
  NO_REFRESH = 'NO_REFRESH',
}

export interface IRefreshPageThirdPartyTokenParams {
  pageType: SocialTypes;
  tokenType: TokenRefreshByTypes;
}

export interface IPageThirdPartyEnv {
  lazadaEnv?: ILazadaEnv;
  shopeeEnv?: IShopeeEnv;
}
export interface ILazadaConnectResponse {
  access_token: string;
  country: string;
  refresh_token: string;
  account_platform: string;
  account: string;
  code: string;
  request_id: string;
  expires_in: number;
  refresh_expires_in: number;
  country_user_info: ILazadaConnectResponseCountryInfo[];
}
export interface IShopeeConnectResponse {
  access_token: string;
  error: string;
  request_id: string;
  message: string;
  refresh_token: string;
  expire_in: number;
}
export interface ILazadaConnectResponseCountryInfo {
  country: string;
  user_id: string;
  seller_id: string;
  short_code: string;
}

export interface ILazadaEnv extends IAccessRefreshTokenExpire {
  lazadaAppID: number;
  lazadaAppSecret: string;
  lazadaWebUrl: string;
  lazadaAuthUrl: string;
  lazadaAuthRedirectUrl: string;
  lazadaRestUrl: string;
  lazadaTokenCreateUrl: string;
  lazadaSignInMethod: string;
  lazadaProductGet: string;
  lazadaApiUrlTH: string;
  lazadaCode?: string;
  appDomainName?: string;
  lazadaProductPriceQuantityUpdate?: string;
  lazadaGetSeller: string;
  lazadaRefreshAccessTokenPath: string;
  lazadaGetOrders: string;
  lazadaGetOrder: string;
  lazadaGetOrderItems: string;
  lazadaGetCategoryTree: string;
  lazadaGetCateogoryAttributes: string;
  lazadaGetCategorySuggestion: string;
  lazadaCreateProduct: string;
  lazadaUpdateProduct?: string;
  lazadaGetBrand: string;
}
export interface IAccessRefreshTokenExpire {
  accessTokenExpireInHours: number;
  refreshTokenExpireInHours: number;
}
export interface IShopeeEnv extends IAccessRefreshTokenExpire {
  shopeeAppID: number;
  shopeeAppSecret: string;
  shopeeUrl: string;
  shopeeAuthPath: string;
  shopeeAuthRedirectUrl: string;
  shopeeSignInMethod: string;
  shopeeAccessTokenPath: string;
  shopeeGetSeller: string;
  shopeeWebUrl: string;
  shopeeRefreshAccessTokenPath: string;
  shopeeGetCategoryTree?: string;
  shopeeGetAttribute?: string;
  shopeeGetLogistics?: string;
  shopeeGetBrands?: string;
  shopeeCreateProduct?: string;
  shopeeUpdateProduct?: string;
  shopeeUpdatePriceProduct?: string;
  shopeeUpdateInventoryProduct?: string;
  shopeeUpdateTierVariation?: string;
  shopeeGetProductList?: string;
  shopeeGetProductBaseInfo?: string;
  shopeeGetModelList?: string;
  shopeeAddProductVariants?: string;
  shopeeUploadImage?: string;
  shopeeLanguages?: LanguageTypes[];
  shopeeGetOrdersList?: string;
  shopeeGetOrderDetails?: string;
}

export const PagesThirdPartyTypeDefs = gql`
  "Pages Third Party Schema"
  type PagesThirdPartyModel {
    id: Int
    pageID: Int
    sellerID: String
    url: String
    name: String
    accessToken: String
    pageType: String
    payload: String
    accessTokenExpire: String
    refreshToken: String
    refreshTokenExpire: String
    updatedAt: Date
  }

  type PagesThirdPartyInactiveModel {
    id: Int
    pageID: Int
    name: String
    sellerID: String
    pageType: String
    active: Boolean
  }

  extend type Query {
    getPageThirdPartyByPageType(pageType: String): PagesThirdPartyModel
    getThirdPartyPages: [PagesThirdPartyModel]
    getShopeeConnectURL: TextString
    getLazadaConnectURL: TextString
    getPageThirdPartyInactive: [PagesThirdPartyInactiveModel]
  }

  extend type Mutation {
    refreshPageThirdPartyToken(pageType: String, tokenType: String): HTTPResult
  }
`;

export const pageThirdPartyPageTypeObjectValidate = {
  pageType: Joi.string().required(),
};

export const refreshPageThirdPartyTokenObjectValidate = {
  pageType: Joi.string().required(),
  tokenType: Joi.string().required(),
};

export const pageThirdPartyPageResponseValidate = {
  id: Joi.number().allow(null),
  pageID: Joi.number().allow(null),
  sellerID: Joi.string().allow(null),
  accessToken: Joi.string().allow(null),
  pageType: Joi.string().allow(null),
  payload: Joi.string().allow(null),
};

export const pageThirdPartyPageInactiveResponseValidate = {
  id: Joi.number(),
  pageID: Joi.number(),
  name: Joi.string().allow(null),
  sellerID: Joi.string().allow(null),
  pageType: Joi.string(),
  active: Joi.boolean(),
};

export const pageThirdPartyPageAllResponseValidate = {
  id: Joi.number().allow(null),
  pageID: Joi.number().allow(null),
  sellerID: Joi.string().allow(null),
  name: Joi.string().allow(null),
  accessToken: Joi.string().allow(null),
  pageType: Joi.string().allow(null),
  payload: Joi.string().allow(null),
  url: Joi.string().allow(null),
  accessTokenExpire: Joi.string().allow(null),
  refreshToken: Joi.string().allow(null),
  refreshTokenExpire: Joi.string().allow(null),
  updatedAt: Joi.string().allow(null),
};
