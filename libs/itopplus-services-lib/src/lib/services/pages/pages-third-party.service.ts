import {
  axiosGetWithParams,
  axiosPostWithHeader,
  concatObjToParamsBackend,
  cryptoDecode,
  cryptoEncode,
  getLazadaSignCodeAndParams,
  getShopeeSignCode,
  getUTCUnixLazadaTimestamps,
  isAllowCaptureException,
} from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult, ITextString } from '@reactor-room/model-lib';
import { LAZADA_API_SUCCESS_CODE, SHOPEE_REFRESH_EXPIRE_IN_DAYS } from '@reactor-room/itopplus-back-end-helpers';
import {
  ILazadaConnectResponse,
  ILazadaEnv,
  IPagesThirdParty,
  IPagesThirdPartyActive,
  IPagesThirdPartyByPageTypeParams,
  IPageThirdPartyEnv,
  IRefreshPageThirdPartyTokenParams,
  IShopeeConnectResponse,
  IShopeeEnv,
  SocialTypes,
  TokenRefreshByTypes,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { addUpdatePageThirdParty, getAllPageThirdPartyByPageType, getPageThirdPartyByPageType, getPageThirdPartyInactive, pageThirdPartyChangeActive } from '../../data/pages';
import { PlusmarService } from '../plusmarservice.class';

export class PagesThirdPartyService {
  getPageThirdPartyByPageType = async ({ pageID, pageType }: IPagesThirdPartyByPageTypeParams): Promise<IPagesThirdParty> => {
    const decryptKey = PlusmarService.environment.pageKey;
    const shopeeRefreshExpireInDays = SHOPEE_REFRESH_EXPIRE_IN_DAYS;
    const pageThirdParty = await getPageThirdPartyByPageType(PlusmarService.readerClient, { pageID, pageType }, shopeeRefreshExpireInDays);
    let { accessToken, refreshToken } = pageThirdParty || {};

    accessToken = accessToken && cryptoDecode(accessToken, decryptKey);
    refreshToken = refreshToken && cryptoDecode(refreshToken, decryptKey);

    return { ...pageThirdParty, accessToken, refreshToken };
  };

  getAllPageThirdPartyByPageType = async (pageType: SocialTypes[]): Promise<IPagesThirdParty[]> => {
    const decryptKey = PlusmarService.environment.pageKey;
    const shopeeRefreshExpireInDays = SHOPEE_REFRESH_EXPIRE_IN_DAYS;
    const pageThirdParty = await getAllPageThirdPartyByPageType(PlusmarService.readerClient, pageType, shopeeRefreshExpireInDays);
    return (
      pageThirdParty?.map((thirdParty) => {
        let { accessToken, refreshToken } = thirdParty || {};
        accessToken = accessToken && cryptoDecode(accessToken, decryptKey);
        refreshToken = refreshToken && cryptoDecode(refreshToken, decryptKey);
        return { ...thirdParty, accessToken, refreshToken };
      }) || []
    );
  };

  getPageThirdPartyInactive = async (pageID: number): Promise<IPagesThirdPartyActive[]> => {
    return await getPageThirdPartyInactive(pageID, PlusmarService.readerClient);
  };

  getlazadaConnectURL = (pageUUID: string, lazadaEnv: ILazadaEnv): ITextString => {
    const { lazadaAuthUrl, lazadaAuthRedirectUrl, lazadaAppID, appDomainName } = lazadaEnv;
    const lazadaAuthURL = lazadaAuthUrl;
    const appUrl = appDomainName;
    const pageUUIDParam = concatObjToParamsBackend({ id: pageUUID });

    const lazadaRedirectURL = `${appUrl}${lazadaAuthRedirectUrl}${pageUUIDParam}`;
    const authParams = {
      response_type: 'code',
      force_auth: true,
      redirect_uri: lazadaRedirectURL,
      client_id: lazadaAppID,
      country: 'th',
    };
    const connectParams = concatObjToParamsBackend(authParams);
    const connectURL = `${lazadaAuthURL}${connectParams}`;
    return { text: connectURL };
  };

  getShopeeConnectURL = (pageUUID: string, shopeeEnv: IShopeeEnv): ITextString => {
    const { shopeeAppID, shopeeAuthRedirectUrl, shopeeAuthPath, shopeeUrl } = shopeeEnv;
    const [timestamp, sign] = getShopeeSignCode(shopeeAuthPath, shopeeEnv);
    const pageUUIDParam = concatObjToParamsBackend({ id: pageUUID });
    const authParams = {
      partner_id: shopeeAppID,
      timestamp,
      redirect: `${shopeeAuthRedirectUrl}${pageUUIDParam}`,
      sign,
    };
    const connectParams = concatObjToParamsBackend(authParams);
    const connectURL = `${shopeeUrl}${shopeeAuthPath}${connectParams}`;
    return { text: connectURL };
  };

  async refreshPageThirdPartyToken(pageID: number, { lazadaEnv, shopeeEnv }: IPageThirdPartyEnv, { pageType, tokenType }: IRefreshPageThirdPartyTokenParams): Promise<IHTTPResult> {
    if (tokenType === TokenRefreshByTypes.REFRESH_TOKEN) {
      const refreshTokenObj = {
        [SocialTypes.SHOPEE]: async () => await this.refreshShopeeToken(pageID, shopeeEnv),
        [SocialTypes.LAZADA]: async () => await this.refreshLazadaToken(pageID, lazadaEnv),
      };
      return await refreshTokenObj[pageType]();
    }
  }

  refreshLazadaToken = async (pageID: number, lazadaEnv: ILazadaEnv): Promise<IHTTPResult> => {
    const pageType = SocialTypes.LAZADA;
    const { refreshToken: refresh_token, sellerID, id } = await this.getPageThirdPartyByPageType({ pageID, pageType: [pageType] });
    try {
      const { lazadaRestUrl, lazadaRefreshAccessTokenPath, lazadaAppID: app_key, lazadaSignInMethod: sign_method } = lazadaEnv;
      const timestamp = getUTCUnixLazadaTimestamps();
      const params = {
        app_key,
        refresh_token,
        sign_method,
        timestamp,
      };

      const urlParams = getLazadaSignCodeAndParams(params, lazadaRefreshAccessTokenPath, lazadaEnv);
      const url = `${lazadaRestUrl}${lazadaRefreshAccessTokenPath}`;
      const response = await axiosGetWithParams(url, urlParams);
      if (response?.data?.code === LAZADA_API_SUCCESS_CODE) {
        const responseData = this.getEncyptAccessResponse(response.data);
        const { access_token: accessToken } = responseData;
        await addUpdatePageThirdParty(PlusmarService.readerClient, { pageID, accessToken, pageType, sellerID, payload: JSON.stringify(responseData) });
        return { status: 200, value: 'true' };
      } else {
        throw new Error('Unable to refresh lazada token');
      }
    } catch (error) {
      const active = false;
      await pageThirdPartyChangeActive(id, pageID, active, PlusmarService.readerClient);
      console.log('error at refreshLazadaToken ' + pageID, error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('error at refreshShopeeToken ' + pageID, error);
      return { status: 403, value: 'false' };
    }
  };

  refreshShopeeToken = async (pageID: number, shopeeEnv: IShopeeEnv): Promise<IHTTPResult> => {
    const pageType = SocialTypes.SHOPEE;
    const { refreshToken: refresh_token, sellerID, id } = await this.getPageThirdPartyByPageType({ pageID, pageType: [pageType] });
    try {
      const { shopeeRefreshAccessTokenPath, shopeeAppID, shopeeUrl } = shopeeEnv;
      const requestBody = {
        refresh_token,
        shop_id: +sellerID,
        partner_id: shopeeAppID,
      };

      const [timestamp, sign] = getShopeeSignCode(shopeeRefreshAccessTokenPath, shopeeEnv);

      const authParams = {
        partner_id: shopeeAppID,
        timestamp,
        sign,
      };

      const connectParams = concatObjToParamsBackend(authParams);
      const connectURL = `${shopeeUrl}${shopeeRefreshAccessTokenPath}${connectParams}`;
      const response = await axiosPostWithHeader(connectURL, requestBody, { 'Content-Type': 'application/json' });
      if (response?.data?.shop_id) {
        const responseData = this.getEncyptAccessResponse(response.data);
        const { access_token: accessToken } = responseData;
        await addUpdatePageThirdParty(PlusmarService.readerClient, { pageID, accessToken, pageType, sellerID, payload: JSON.stringify(responseData) });
        return { status: 200, value: 'true' };
      } else {
        if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('Unable to refresh shopee token');
        throw new Error('Unable to refresh shopee token');
      }
    } catch (error) {
      const active = false;
      await pageThirdPartyChangeActive(id, pageID, active, PlusmarService.readerClient);
      console.log('error at refreshShopeeToken ' + pageID, error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('error at refreshShopeeToken ' + pageID, error);
      return { status: 403, value: 'false' };
    }
  };

  getEncyptAccessResponse(accessResponse: ILazadaConnectResponse | IShopeeConnectResponse): ILazadaConnectResponse | IShopeeConnectResponse {
    const encryptKey = PlusmarService.environment.pageKey;
    let { access_token, refresh_token } = accessResponse;
    access_token = cryptoEncode(access_token, encryptKey);
    refresh_token = cryptoEncode(refresh_token, encryptKey);
    return { ...accessResponse, access_token, refresh_token };
  }
}

//to cancel the auth
/*  getShopeeCancelShopUrl = (shopeeEnv: IShopeeEnv): void => {
    const { shopeeAppID, shopeeAuthRedirectUrl, shopeeAuthPath, shopeeUrl } = shopeeEnv;
    const [timestamp, sign] = getShopeeSignCode('/api/v2/shop/cancel_auth_partner');
    const authParams = {
      partner_id: shopeeAppID,
      redirect: `${shopeeAuthRedirectUrl}`,
      timestamp,
      sign,
    };
    const connectParams = concatObjToParamsBackend(authParams);
    const connectURL = `${shopeeUrl}${'/api/v2/shop/cancel_auth_partner'}${connectParams}`;
  }; */
