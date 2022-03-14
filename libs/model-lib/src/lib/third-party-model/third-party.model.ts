export interface IShopeeAccessSignParams {
  apiPath: string;
  accessToken: string;
  shopID: number;
}

export enum AudiencePlatformType {
  FACEBOOKFANPAGE = 'FACEBOOKFANPAGE',
  LINEOA = 'LINEOA',
}

export interface ILazadaDefaultAccessRequest {
  access_token: string;
  app_key: number;
  sign_method: string;
  timestamp: number;
  sign?: string;
}
