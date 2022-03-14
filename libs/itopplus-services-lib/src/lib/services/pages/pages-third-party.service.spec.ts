import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { LAZADA_API_SUCCESS_CODE } from '@reactor-room/itopplus-back-end-helpers';
import { SocialTypes, TokenRefreshByTypes } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data/pages';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { PagesThirdPartyService } from './pages-third-party.service';

jest.mock('../../data/pages');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');

PlusmarService.environment = { ...environmentLib, pageKey: 'facebook012' };

const lazadaEnv = {
  appDomainName: environmentLib.lazada.appDomainName,
  lazadaAppID: environmentLib.lazada.lazadaAppID,
  lazadaAppSecret: environmentLib.lazada.lazadaAppSecret,
  lazadaWebUrl: 'https://www.lazada.co.th',
  lazadaAuthUrl: 'https://auth.lazada.com/oauth/authorize',
  lazadaAuthRedirectUrl: '/marketplace/lazada/auth',
  lazadaRestUrl: 'https://auth.lazada.com/rest',
  lazadaApiUrlTH: 'https://api.lazada.co.th/rest',
  lazadaTokenCreateUrl: '/auth/token/create',
  lazadaSignInMethod: 'sha256',
  lazadaCode: 'dada',
  lazadaProductGet: '/products/get',
  lazadaProductPriceQuantityUpdate: '/product/price_quantity/update',
  lazadaGetSeller: '/seller/get',
  lazadaRefreshAccessTokenPath: '/auth/token/refresh',
  accessTokenExpireInHours: 168,
  refreshTokenExpireInHours: 720,
  lazadaGetOrders: '/orders/get',
  lazadaGetOrder: '/order/get',
  lazadaGetOrderItems: '/order/items/get',
  lazadaGetCategoryTree: '/category/tree/get',
  lazadaGetCateogoryAttributes: '/category/attributes/get',
  lazadaGetCategorySuggestion: '/product/category/suggestion/get',
  lazadaCreateProduct: '/product/create',
  lazadaGetBrand: '/category/brands/query',
};
const shopeeEnv = {
  shopeeAppID: 111,
  shopeeAppSecret: '111',
  shopeeUrl: 'https://partner.uat.shopeemobile.com',
  shopeeAuthPath: '/api/v2/shop/auth_partner',
  shopeeAuthRedirectUrl: 'https://itopplus.com/marketplace/shopee/auth',
  shopeeSignInMethod: 'sha256',
  shopeeAccessTokenPath: '/api/v2/auth/token/get',
  shopeeGetSeller: '/api/v1/shop/get',
  shopeeWebUrl: 'https://shopee.co.th',
  shopeeRefreshAccessTokenPath: '/api/v2/auth/access_token/get',
  accessTokenExpireInHours: 4,
  refreshTokenExpireInHours: 720,
};
let pageThirdPartyService = new PagesThirdPartyService();

describe('Pages third party service', () => {
  beforeEach(() => {
    pageThirdPartyService = new PagesThirdPartyService();
  });
  test('get page third party by page type -> getPageThirdPartyByPageType', async () => {
    const pageThirdPartyData = {
      id: 78,
      pageID: 344,
      sellerID: '100189392074',
      name: 'Khappom Shop',
      picture: '',
      url: 'https://www.lazada.co.th/shop/khappom-shop',
      accessToken: 'aasd',
      accessTokenExpire: '2021-01-25 07:01:05',
      pageType: 'lazada',
      refreshToken: 'aasd',
      refreshTokenExpire: '2021-02-17 07:02:05',
      updatedAt: '2021-01-18 07:50:05',
      payload: '{"access_token"}',
    };
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValue('aasd'));
    mock(data, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValueOnce(pageThirdPartyData));
    const result = await pageThirdPartyService.getPageThirdPartyByPageType({ pageID: 344, pageType: [SocialTypes.LAZADA] });
    expect(helpers.cryptoDecode).toBeCalledTimes(2);
    expect(result).toEqual(pageThirdPartyData);
  });

  test('get lazada connect url -> getlazadaConnectURL', async () => {
    const pageUUID = '222';
    const connectParams = '?response_type=code&force_auth=true&redirect_uri=' + environmentLib.lazada.appDomainName + '/marketplace/lazada/auth?id=222&client_id=111&country=th';
    const connectURL = 'https://auth.lazada.com/oauth/authorize' + connectParams;

    mock(helpers, 'concatObjToParamsBackend', jest.fn().mockReturnValueOnce('?id=222').mockReturnValueOnce(connectParams));

    const result = await pageThirdPartyService.getlazadaConnectURL(pageUUID, lazadaEnv);
    expect(result).toEqual({ text: connectURL });
    expect(helpers.concatObjToParamsBackend).toBeCalledTimes(2);
  });

  test('get shopee connect url -> getShopeeConnectURL', async () => {
    const pageUUID = '222';
    const timestamp = 1610961274;
    const sign = '333';
    const connectURL =
      'https://partner.uat.shopeemobile.com/api/v2/shop/auth_partner?partner_id=111&timestamp=1610961274&redirect=https://itopplus.com/marketplace/shopee/auth?id=222&sign=333';

    mock(helpers, 'getShopeeSignCode', jest.fn().mockReturnValue([timestamp, sign]));

    mock(
      helpers,
      'concatObjToParamsBackend',
      jest.fn().mockReturnValueOnce('?id=222').mockReturnValueOnce('?partner_id=111&timestamp=1610961274&redirect=https://itopplus.com/marketplace/shopee/auth?id=222&sign=333'),
    );

    const result = await pageThirdPartyService.getShopeeConnectURL(pageUUID, shopeeEnv);
    expect(result).toEqual({ text: connectURL });
    expect(helpers.getShopeeSignCode).toBeCalled();
    expect(helpers.concatObjToParamsBackend).toBeCalled();
  });

  test('call refresh page third party token LAZADA -> refreshPageThirdPartyToken', async () => {
    const response = { status: 403, value: 'false' };

    const result = await pageThirdPartyService.refreshPageThirdPartyToken(
      344,
      { lazadaEnv: lazadaEnv, shopeeEnv: shopeeEnv },
      { pageType: SocialTypes.LAZADA, tokenType: TokenRefreshByTypes.REFRESH_TOKEN },
    );

    expect(result).toEqual(response);
  });

  test('call refresh page third party token SHOPEE -> refreshPageThirdPartyToken', async () => {
    const response = { status: 403, value: 'false' };

    const result = await pageThirdPartyService.refreshPageThirdPartyToken(
      344,
      { lazadaEnv: lazadaEnv, shopeeEnv: shopeeEnv },
      { pageType: SocialTypes.SHOPEE, tokenType: TokenRefreshByTypes.REFRESH_TOKEN },
    );

    expect(result).toEqual(response);
  });

  test('refresh Lazada token success -> refreshLazadaToken ', async () => {
    const pageID = 344;
    const responseSuccess = {
      data: {
        code: LAZADA_API_SUCCESS_CODE,
      },
    };
    mock(pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ refreshToken: 'aaa', sellerID: 111 }));
    mock(helpers, 'getUTCUnixLazadaTimestamps', jest.fn().mockReturnValueOnce(12345));
    mock(
      helpers,
      'getLazadaSignCodeAndParams',
      jest.fn().mockReturnValueOnce({
        app_key: 111,
        refresh_token: 'aaa',
        sign_method: 'sha256',
        timestamp: 12345,
        sign: 'aaa',
      }),
    );

    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValueOnce(responseSuccess));

    const refreshLazada = await pageThirdPartyService.refreshLazadaToken(pageID, lazadaEnv);

    expect(refreshLazada).toEqual({ status: 200, value: 'true' });
    expect(pageThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
    expect(helpers.getUTCUnixLazadaTimestamps).toBeCalled();
    expect(helpers.getLazadaSignCodeAndParams).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
    expect(data.addUpdatePageThirdParty).toBeCalled();
  });

  test('refresh Lazada token error -> refreshLazadaToken ', async () => {
    const pageID = 344;
    const responseSuccess = {
      data: {},
    };
    mock(pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ refreshToken: 'aaa', sellerID: 111 }));
    mock(helpers, 'getUTCUnixLazadaTimestamps', jest.fn().mockReturnValueOnce(12345));
    mock(
      helpers,
      'getLazadaSignCodeAndParams',
      jest.fn().mockReturnValueOnce({
        app_key: 111,
        refresh_token: 'aaa',
        sign_method: 'sha256',
        timestamp: 12345,
        sign: 'aaa',
      }),
    );

    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValueOnce(responseSuccess));

    const refreshLazada = await pageThirdPartyService.refreshLazadaToken(pageID, lazadaEnv);

    expect(refreshLazada).toEqual({ status: 403, value: 'false' });
    expect(pageThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
    expect(helpers.getUTCUnixLazadaTimestamps).toBeCalled();
    expect(helpers.getLazadaSignCodeAndParams).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
  });

  test('refresh Shopee token success -> refreshShopeeToken ', async () => {
    const pageID = 344;

    const connectParams = '?partner_id=111&timestamp=123456&sign=lololol';

    const responseSuccess = {
      data: {
        shop_id: 'myshop',
      },
    };

    mock(pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ refreshToken: 'aaa', sellerID: 111 }));
    mock(helpers, 'getShopeeSignCode', jest.fn().mockReturnValueOnce([123456, 'lololol']));

    mock(helpers, 'concatObjToParamsBackend', jest.fn().mockReturnValueOnce(connectParams));

    mock(helpers, 'axiosPostWithHeader', jest.fn().mockReturnValueOnce(responseSuccess));

    const refreshLazada = await pageThirdPartyService.refreshShopeeToken(pageID, shopeeEnv);

    expect(refreshLazada).toEqual({ status: 200, value: 'true' });
    expect(pageThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
    expect(helpers.getShopeeSignCode).toBeCalled();
    expect(helpers.concatObjToParamsBackend).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
    expect(data.addUpdatePageThirdParty).toBeCalled();
  });

  test('refresh Shopee token error -> refreshShopeeToken ', async () => {
    const pageID = 344;

    const connectParams = '?partner_id=111&timestamp=123456&sign=lololol';

    const responseSuccess = {
      data: {},
    };

    mock(pageThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockResolvedValue({ refreshToken: 'aaa', sellerID: 111 }));
    mock(helpers, 'getShopeeSignCode', jest.fn().mockReturnValueOnce([123456, 'lololol']));

    mock(helpers, 'concatObjToParamsBackend', jest.fn().mockReturnValueOnce(connectParams));

    mock(helpers, 'axiosPostWithHeader', jest.fn().mockReturnValueOnce(responseSuccess));

    const refreshLazada = await pageThirdPartyService.refreshShopeeToken(pageID, shopeeEnv);

    expect(refreshLazada).toEqual({ status: 403, value: 'false' });
    expect(pageThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
    expect(helpers.getShopeeSignCode).toBeCalled();
    expect(helpers.concatObjToParamsBackend).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
  });
});
