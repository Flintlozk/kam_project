import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as plusmarHelper from '@reactor-room/itopplus-back-end-helpers';
import { LAZADA_API_SUCCESS_CODE } from '@reactor-room/itopplus-back-end-helpers';
import {
  ILazadaConnectResponse,
  ILazadaSellerDetails,
  ILineChannelInforAPIResponse,
  ILineLiffResponse,
  ILineSetting,
  IShopeeConnectResponse,
  ShopeeShopStatusTypes,
  SocialTypes,
  IPageWebhookPatternSetting,
} from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import * as linesetting from '../../data/settings/line/line.data';
import * as datasetting from '../../data/settings/settings.data';
import * as webhookpattern from '../../data/settings/openapi/webhook-pattern.data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import * as shopeeAPI from '../product/product-marketplace-shopee-api.service';
import { SettingService } from './settings.service';
import { IHTTPResult } from '@reactor-room/model-lib';

PlusmarService.environment = { ...environmentLib, pageKey: 'facebook012' };
jest.mock('../../errors');
jest.mock('../../data/settings/settings.data');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../plusmarservice.class');
jest.mock('../../data');
jest.mock('../../data/settings/settings.data');
jest.mock('../../data/settings/line/line.data');
jest.mock('../../data/settings/openapi/webhook-pattern.data.ts');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../product/product-marketplace-shopee-api.service');

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

describe('setting service testing', () => {
  test('Set Line Channel Detail should be not dupplicate and return result', async () => {
    const setting = new SettingService();
    mock(linesetting, 'checkDuplicateLineChannel', jest.fn().mockResolvedValueOnce(0));
    mock(
      linesetting,
      'getChannelInfo',
      jest.fn().mockResolvedValueOnce({
        userId: 'xxxx',
        chatMode: '',
        displayName: 'ITOPPLUS',
        pictureUrl: 'xxxx',
        markAsReadMode: 'aaa',
        premiumId: '@asdas',
      } as ILineChannelInforAPIResponse),
    );
    mock(linesetting, 'setLineChannelDetailByPageID', jest.fn().mockResolvedValueOnce(123));
    mock(linesetting, 'checkNewChannelToken', jest.fn().mockResolvedValueOnce(true));
    mock(linesetting, 'checkLiffRegistered', jest.fn().mockResolvedValueOnce(false));
    mock(linesetting, 'registerLineLiff', jest.fn().mockResolvedValueOnce({ liffId: '1a213aw54' } as ILineLiffResponse));
    mock(linesetting, 'setLineLiffByPageID', jest.fn().mockResolvedValueOnce(1));
    const param = {
      basicid: '@1234',
      channelid: 1566405602,
      channelsecret: 'a2avgllsk9z8w5h',
      channeltoken: 'maslkpwplpwlploqkwoasd',
      is_type_edit: false,
    } as ILineSetting;
    const setLineSetting = await setting.setLineChannelDetail(param, 304);
    expect(setLineSetting.name).toEqual('ITOPPLUS');
    expect(linesetting.checkDuplicateLineChannel).toBeCalled();
    expect(linesetting.getChannelInfo).toBeCalled();
    expect(linesetting.checkNewChannelToken).toBeCalled();
    expect(linesetting.setLineChannelDetailByPageID).toBeCalled();
    expect(linesetting.checkLiffRegistered).toBeCalled();
    expect(linesetting.registerLineLiff).toBeCalled();
    expect(linesetting.setLineLiffByPageID).toBeCalled();
  });

  test('Set Line Channel Detail should be dupplicate', async () => {
    const setting = new SettingService();
    mock(linesetting, 'checkDuplicateLineChannel', jest.fn().mockResolvedValueOnce(1));
    const param = {
      basicid: '@1234',
      channelid: 1566405602,
      channelsecret: 'a2avgllsk9z8w5h',
      channeltoken: 'maslkpwplpwlploqkwoasd',
      is_type_edit: false,
    } as ILineSetting;
    let isErrors = false;
    try {
      await setting.setLineChannelDetail(param, 304);
    } catch (err) {
      isErrors = true;
    }
    expect(isErrors).toEqual(true);
    expect(linesetting.checkDuplicateLineChannel).toBeCalled();
  });

  test('updateCompanyInfo', async () => {
    const setting = new SettingService();
    const uuid = 'uuid-uuid';

    const input = {
      company_name: 'string',
      company_logo: 'string',
      company_logo_file: null,
      branch_name: 'string',
      branch_id: 'string',
      tax_identification_number: 'string',
      tax_id: 1,
      phone_number: 'string',
      email: 'string',
      fax: 'string',
      address: 'string',
      post_code: 'string',
      sub_district: 'string',
      district: 'string',
      province: 'string',
      country: 'string',
    };
    const output = {
      status: 200,
      value: true,
    };
    mock(datasetting, 'updateCompanyInfo', jest.fn().mockResolvedValueOnce(output));
    const result = await setting.updateCompanyInfo(input, 1, 'bucketName', uuid);
    expect(result).toStrictEqual(output);
    expect(datasetting.updateCompanyInfo).toBeCalled();
  });

  test('saveCompanyInfo', async () => {
    const setting = new SettingService();
    const uuid = 'uuid-uuid';

    const input = {
      company_name: 'string',
      company_logo: 'string',
      branch_name: 'string',
      branch_id: 'string',
      tax_identification_number: 'string',
      tax_id: 1,
      phone_number: 'string',
      email: 'string',
      fax: 'string',
      address: 'string',
      post_code: 'string',
      sub_district: 'string',
      district: 'string',
      province: 'string',
      country: 'string',
    };
    const output = {
      status: 200,
      value: true,
    };
    mock(datasetting, 'saveCompanyInfo', jest.fn().mockResolvedValueOnce(output));
    mock(data, 'updateTaxByPageID', jest.fn().mockResolvedValueOnce(output));

    const result = await setting.saveCompanyInfo(input, 1, 'bucketName', uuid);
    expect(result).toStrictEqual(output);
    expect(datasetting.saveCompanyInfo).toBeCalled();
    expect(data.updateTaxByPageID).toBeCalled();
  });

  test('getCompanyInfo', async () => {
    const setting = new SettingService();
    const companyInfoOutput = [
      {
        company_name: 'string',
        company_logo: 'string',
        branch_name: 'string',
        branch_id: 'string',
        phone_number: 'string',
        email: 'string',
        fax: 'string',
        address: 'string',
        post_code: 'string',
        sub_district: 'string',
        district: 'string',
        province: 'string',
        country: 'string',
      },
    ];
    const taxesOutput = {
      id: 1,
      page_id: 1,
      tax_id: 'string',
      name: 'string',
      tax: 1,
      status: true,
      created_at: new Date(),
      updated_at: new Date(),
    };
    const resultOutput = [
      {
        address: 'string',
        branch_id: 'string',
        branch_name: 'string',
        company_logo: 'string',
        company_name: 'string',
        country: 'string',
        district: 'string',
        email: 'string',
        fax: 'string',
        phone_number: 'string',
        post_code: 'string',
        province: 'string',
        sub_district: 'string',
        tax_id: 1,
        tax_identification_number: 'string',
      },
    ];
    mock(datasetting, 'getCompanyInfo', jest.fn().mockResolvedValueOnce(companyInfoOutput));
    mock(data, 'getTaxByPageID', jest.fn().mockResolvedValueOnce(taxesOutput));
    const result = await setting.getCompanyInfo(1);
    expect(result).toStrictEqual(resultOutput);
    expect(datasetting.getCompanyInfo).toBeCalled();
    expect(data.getTaxByPageID).toBeCalled();
  });

  test('connect lazada to app success -> handleLazadaConnect', async () => {
    const pageID = 344;
    const settingService = new SettingService();

    const url = lazadaEnv.lazadaAuthUrl;
    const urlParams = {
      app_key: lazadaEnv.lazadaAppID,
      code: 'code',
      sign_method: 'sha256',
      timestamp: 11111,
      sign: 'sign',
    };

    const pageParams = {
      pageID,
      sellerID: 'sellerID',
      accessToken: 'accessToken',
      pageType: 'lazada',
      payload: 'payload',
    };

    mock(settingService, 'getLazadaAccessTokenUrl', jest.fn().mockReturnValue({ url, urlParams }));

    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue({ data: { code: LAZADA_API_SUCCESS_CODE } }));

    mock(settingService.pagesService, 'getPageByUUID', jest.fn().mockReturnValue({ id: 344 }));

    mock(settingService, 'getAddPageThirdPartyLazadaParams', jest.fn().mockReturnValue(pageParams));

    mock(data, 'addUpdatePageThirdParty', jest.fn().mockReturnValue({ id: 1 }));

    mock(settingService, 'getLazadaSellerDetails', jest.fn().mockReturnValue({ name: 'myname', picture: 'my_pic' }));

    const result = await settingService.handleLazadaConnect('code', 'uuid', lazadaEnv);
    expect(result).toEqual({ result: true, source: SocialTypes.LAZADA, message: 'SUCCESS' });
    expect(settingService.getLazadaAccessTokenUrl).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
    expect(settingService.pagesService.getPageByUUID).toBeCalled();
    expect(settingService.getAddPageThirdPartyLazadaParams).toBeCalled();
    expect(data.addUpdatePageThirdParty).toBeCalled();
    expect(settingService.getLazadaSellerDetails).toBeCalled();
    expect(plusmarHelper.getPagesThirdPartySellerURL).toBeCalled();
    expect(data.updateSellerDetails).toBeCalled();
  });

  test('connect lazada to app error -> handleLazadaConnect', async () => {
    const pageID = 344;
    const settingService = new SettingService();

    const url = lazadaEnv.lazadaAuthUrl;
    const urlParams = {
      app_key: lazadaEnv.lazadaAppID,
      code: 'code',
      sign_method: 'sha256',
      timestamp: 11111,
      sign: 'sign',
    };

    const pageParams = {
      pageID,
      sellerID: 'sellerID',
      accessToken: 'accessToken',
      pageType: 'lazada',
      payload: 'payload',
    };

    const lazadaSuccessCode = !LAZADA_API_SUCCESS_CODE;

    mock(settingService, 'getLazadaAccessTokenUrl', jest.fn().mockReturnValue({ url, urlParams }));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue({ data: { code: lazadaSuccessCode } }));
    mock(settingService.pagesService, 'getPageByUUID', jest.fn().mockReturnValue({ id: 344 }));
    mock(settingService, 'getAddPageThirdPartyLazadaParams', jest.fn().mockReturnValue(pageParams));

    const result = await settingService.handleLazadaConnect('code', 'uuid', lazadaEnv);
    expect(result).toEqual({ result: false, source: SocialTypes.LAZADA, message: 'ERROR' });

    expect(settingService.getLazadaAccessTokenUrl).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
    expect(settingService.pagesService.getPageByUUID).toBeCalled();
    expect(settingService.getAddPageThirdPartyLazadaParams).toBeCalled();
  });

  test('connect lazada to throw error -> handleLazadaConnect', async () => {
    const settingService = new SettingService();
    // We must implement thorw error by manually
    mock(
      settingService,
      'getLazadaAccessTokenUrl',
      jest.fn().mockImplementation(() => {
        throw new Error('MY MANUAL THROW GETLAZADAACCESSTOKEN PROBLEM');
      }),
    );

    const result = await settingService.handleLazadaConnect('code', 'uuid', lazadaEnv);
    expect(result).toEqual({ result: false, source: SocialTypes.LAZADA, message: 'ERROR' });
    expect(settingService.getLazadaAccessTokenUrl).toBeCalled();
  });

  test('get lazada seller details success  -> getLazadaSellerDetails', async () => {
    const settingService = new SettingService();
    const pageID = 344;
    const accessParams = {
      app_key: lazadaEnv.lazadaAppID,
      access_token: 'accessToken',
      sign_method: 'sha256',
      timestamp: 11111,
    };

    const response = { name: 'myname' } as ILazadaSellerDetails;

    mock(settingService.pagesThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockReturnValue({ accessToken: 'access_token' }));
    mock(helpers, 'getLazadaDefaultAccessTokenParams', jest.fn().mockReturnValue(accessParams));
    mock(helpers, 'getLazadaSignCodeAndParams', jest.fn().mockReturnValue({ ...accessParams, sign: 'sign' }));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue({ data: { code: LAZADA_API_SUCCESS_CODE, data: { name: 'myname' } } }));

    const result = await settingService.getLazadaSellerDetails({ pageID, lazadaEnv });
    expect(result).toEqual(response);

    expect(settingService.pagesThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
    expect(helpers.getLazadaDefaultAccessTokenParams).toBeCalled();
    expect(helpers.getLazadaSignCodeAndParams).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
  });

  test('get lazada seller details error  -> getLazadaSellerDetails', async () => {
    try {
      const settingService = new SettingService();
      const pageID = 344;
      const accessParams = {
        app_key: lazadaEnv.lazadaAppID,
        access_token: 'accessToken',
        sign_method: 'sha256',
        timestamp: 11111,
      };
      mock(settingService.pagesThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockReturnValue({ accessToken: 'access_token' }));
      mock(helpers, 'getLazadaDefaultAccessTokenParams', jest.fn().mockReturnValue(accessParams));
      mock(helpers, 'getLazadaSignCodeAndParams', jest.fn().mockReturnValue({ ...accessParams, sign: 'sign' }));
      mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue({ data: { code: !LAZADA_API_SUCCESS_CODE, data: { name: 'myname' } } }));

      await settingService.getLazadaSellerDetails({ pageID, lazadaEnv });
    } catch (error) {
      expect(error.message).toBe('SELLER_DETAIL_ERROR');
    }
  });

  test('handle shopee connect success -> handleShopeeConnect', async () => {
    const settingService = new SettingService();

    const url = shopeeEnv.shopeeUrl;
    const urlParams = {
      code: 'code',
      shop_id: '1001',
      partner_id: 1000,
    };

    const accessTokenData = {
      data: {
        access_token: 'access_token',
        error: '',
        request_id: 'request_id',
        message: '',
        expire_in: 50000,
        refresh_token: 'refresh_token',
      },
    };

    const shopeeConnect = {
      id: 1,
      pageID: 344,
      sellerID: '1001',
      name: 'myshop',
      picture: '',
      url: 'myshopurl',
      accessToken: 'access_token',
    };

    mock(helpers, 'getShopeeAccessTokenUrl', jest.fn().mockReturnValue({ url, urlParams }));
    mock(helpers, 'axiosPostWithHeader', jest.fn().mockReturnValue(accessTokenData));
    mock(settingService.pagesService, 'getPageByUUID', jest.fn().mockReturnValue({ id: 344 }));
    mock(data, 'addUpdatePageThirdParty', jest.fn().mockReturnValue(shopeeConnect));
    mock(shopeeAPI, 'getShopeeSellerDetailsFromShopeeApi', jest.fn().mockReturnValue({ shop_name: 'myshop', status: ShopeeShopStatusTypes.Normal }));
    mock(plusmarHelper, 'getPagesThirdPartySellerURL', jest.fn().mockReturnValue('url'));

    const result = await settingService.handleShopeeConnect('code', 'uuid', urlParams.shop_id, shopeeEnv);
    expect(result).toEqual({ result: true, source: SocialTypes.SHOPEE, message: 'SUCCESS' });

    expect(helpers.getShopeeAccessTokenUrl).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
    expect(settingService.pagesService.getPageByUUID).toBeCalled();
    expect(data.addUpdatePageThirdParty).toBeCalled();
    expect(shopeeAPI.getShopeeSellerDetailsFromShopeeApi).toBeCalled();
    expect(plusmarHelper.getPagesThirdPartySellerURL).toBeCalled();
    expect(data.updateSellerDetails).toBeCalled();
  });

  test('handle shopee connect error -> handleShopeeConnect -> SELLER_DETAIL_ERROR', async () => {
    const settingService = new SettingService();

    const url = shopeeEnv.shopeeUrl;
    const urlParams = {
      code: 'code',
      shop_id: '1001',
      partner_id: 1000,
    };

    const accessTokenData = {
      data: {
        access_token: 'access_token',
        error: '',
        request_id: 'request_id',
        message: '',
        expire_in: 50000,
        refresh_token: 'refresh_token',
      },
    };

    const shopeeConnect = {
      id: 1,
      pageID: 344,
      sellerID: '1001',
      name: 'myshop',
      picture: '',
      url: 'myshopurl',
      accessToken: 'access_token',
    };

    const addPageParams = {
      pageID: shopeeConnect.pageID,
      sellerID: shopeeConnect.accessToken,
      accessToken: shopeeConnect.accessToken,
      pageType: SocialTypes.SHOPEE,
      payload: JSON.stringify(accessTokenData),
    };

    mock(helpers, 'getShopeeAccessTokenUrl', jest.fn().mockReturnValue({ url, urlParams }));
    mock(helpers, 'axiosPostWithHeader', jest.fn().mockReturnValue(accessTokenData));
    mock(settingService.pagesService, 'getPageByUUID', jest.fn().mockReturnValue({ id: 344 }));
    mock(settingService, 'getAddPageThirdPartyShopeeParams', jest.fn().mockReturnValue(addPageParams));
    mock(data, 'addUpdatePageThirdParty', jest.fn().mockReturnValue(shopeeConnect));
    mock(data, 'addUpdatePageThirdParty', jest.fn().mockReturnValue(shopeeConnect));
    mock(settingService.pagesThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockReturnValue(shopeeConnect));
    mock(shopeeAPI, 'getShopeeSellerDetailsFromShopeeApi', jest.fn().mockRejectedValue(new Error('SELLER_DETAIL_ERROR')));

    mock(plusmarHelper, 'getPagesThirdPartySellerURL', jest.fn().mockReturnValue('url'));

    const result = await settingService.handleShopeeConnect('code', 'uuid', urlParams.shop_id, shopeeEnv);
    expect(result).toEqual({ result: false, source: SocialTypes.SHOPEE, message: 'SELLER_DETAIL_ERROR' });

    expect(helpers.getShopeeAccessTokenUrl).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
    expect(settingService.pagesService.getPageByUUID).toBeCalled();
    expect(data.addUpdatePageThirdParty).toBeCalled();
    expect(shopeeAPI.getShopeeSellerDetailsFromShopeeApi).toBeCalled();
    expect(settingService.getAddPageThirdPartyShopeeParams).toBeCalled();
    expect(settingService.pagesThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
  });

  test('handle shopee connect error -> handleShopeeConnect -> SHOP_NOT_VALID', async () => {
    const settingService = new SettingService();

    const url = shopeeEnv.shopeeUrl;
    const urlParams = {
      code: 'code',
      shop_id: '1001',
      partner_id: 1000,
    };

    const accessTokenData = {
      data: {
        access_token: 'access_token',
        error: '',
        request_id: 'request_id',
        message: '',
        expire_in: 50000,
        refresh_token: 'refresh_token',
      },
    };

    const shopeeConnect = {
      id: 1,
      pageID: 344,
      sellerID: '1001',
      name: 'myshop',
      picture: '',
      url: 'myshopurl',
      accessToken: 'access_token',
    };

    const addPageParams = {
      pageID: shopeeConnect.pageID,
      sellerID: shopeeConnect.accessToken,
      accessToken: shopeeConnect.accessToken,
      pageType: SocialTypes.SHOPEE,
      payload: JSON.stringify(accessTokenData),
    };

    mock(helpers, 'getShopeeAccessTokenUrl', jest.fn().mockReturnValue({ url, urlParams }));
    mock(helpers, 'axiosPostWithHeader', jest.fn().mockReturnValue(accessTokenData));
    mock(settingService.pagesService, 'getPageByUUID', jest.fn().mockReturnValue({ id: 344 }));
    mock(settingService, 'getAddPageThirdPartyShopeeParams', jest.fn().mockReturnValue(addPageParams));
    mock(data, 'addUpdatePageThirdParty', jest.fn().mockReturnValue(shopeeConnect));
    mock(settingService.pagesThirdPartyService, 'getPageThirdPartyByPageType', jest.fn().mockReturnValue(shopeeConnect));
    mock(shopeeAPI, 'getShopeeSellerDetailsFromShopeeApi', jest.fn().mockResolvedValue({ shop_name: 'myshop', status: ShopeeShopStatusTypes.Frozen }));

    mock(plusmarHelper, 'getPagesThirdPartySellerURL', jest.fn().mockReturnValue('url'));

    const result = await settingService.handleShopeeConnect('code', 'uuid', urlParams.shop_id, shopeeEnv);
    expect(result).toEqual({ result: false, source: SocialTypes.SHOPEE, message: 'SHOP_NOT_VALID' });

    expect(helpers.getShopeeAccessTokenUrl).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
    expect(settingService.pagesService.getPageByUUID).toBeCalled();
    expect(data.addUpdatePageThirdParty).toBeCalled();
    expect(shopeeAPI.getShopeeSellerDetailsFromShopeeApi).toBeCalled();
    expect(settingService.getAddPageThirdPartyShopeeParams).toBeCalled();
    expect(settingService.pagesThirdPartyService.getPageThirdPartyByPageType).toBeCalled();
  });

  test('handle shopee connect error -> handleShopeeConnect', async () => {
    const settingService = new SettingService();

    const url = shopeeEnv.shopeeUrl;
    const urlParams = {
      code: 'code',
      shop_id: null,
      partner_id: 1000,
    };

    mock(helpers, 'getShopeeAccessTokenUrl', jest.fn().mockReturnValue({ url, urlParams }));
    mock(helpers, 'axiosPostWithHeader', jest.fn().mockReturnValue({}));
    mock(shopeeAPI, 'getShopeeSellerDetailsFromShopeeApi', jest.fn().mockRejectedValue(new Error('ERROR')));
    const result = await settingService.handleShopeeConnect('code', 'uuid', urlParams.shop_id, shopeeEnv);
    expect(result).toEqual({ result: false, source: SocialTypes.SHOPEE, message: 'ERROR' });

    expect(helpers.getShopeeAccessTokenUrl).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
  });

  test('handle shopee connect throw error -> handleShopeeConnect', async () => {
    const settingService = new SettingService();

    const url = shopeeEnv.shopeeUrl;
    const urlParams = {
      code: 'code',
      shop_id: '1001',
      partner_id: 1000,
    };

    const accessTokenData = {
      data: {
        access_token: 'access_token',
        error: '',
        request_id: 'request_id',
        message: '',
        expire_in: 50000,
        refresh_token: 'refresh_token',
      },
    };

    mock(helpers, 'getShopeeAccessTokenUrl', jest.fn().mockResolvedValue({ url, urlParams }));
    mock(helpers, 'axiosPostWithHeader', jest.fn().mockResolvedValue(accessTokenData));
    mock(settingService.pagesService, 'getPageByUUID', jest.fn().mockResolvedValue({ id: undefined }));
    const result = await settingService.handleShopeeConnect('code', 'uuid', undefined, shopeeEnv);
    expect(result).toEqual({ result: false, source: SocialTypes.SHOPEE, message: 'ERROR' });

    expect(helpers.getShopeeAccessTokenUrl).toBeCalled();
    expect(helpers.axiosPostWithHeader).toBeCalled();
    expect(settingService.pagesService.getPageByUUID).toBeCalled();
  });

  test('get lazada token url -> getAddPageThirdPartyLazadaParams', async () => {
    const settingService = new SettingService();

    const pageID = 344;

    const accessResponse = {
      access_token: 'access_token',
      country_user_info: [
        {
          seller_id: '1000',
        },
      ],
    } as ILazadaConnectResponse;
    const response = {
      pageID,
      sellerID: '1000',
      pageType: 'lazada',
      accessToken: 'access_token',
      payload: '{"access_token":"access_token","country_user_info":[{"seller_id":"1000"}]}',
    };

    mock(settingService.pagesThirdPartyService, 'getEncyptAccessResponse', jest.fn().mockReturnValue(accessResponse));

    const result = await settingService.getAddPageThirdPartyLazadaParams(pageID, accessResponse);

    expect(result).toEqual(response);
    expect(settingService.pagesThirdPartyService.getEncyptAccessResponse).toBeCalled();
  });

  test('get shopee token url -> getAddPageThirdPartyShopeeParams', async () => {
    const settingService = new SettingService();

    const pageID = 344;

    const sellerID = '1001';

    const accessResponse = {
      access_token: 'access_token',
      error: 'error',
      request_id: 'request_id',
      message: 'message',
      refresh_token: 'refresh_token',
      expire_in: 100,
    } as IShopeeConnectResponse;
    const response = {
      pageID: 344,
      sellerID: '1001',
      accessToken: 'access_token',
      pageType: 'shopee',
      payload: '{"access_token":"access_token","error":"error","request_id":"request_id","message":"message","refresh_token":"refresh_token","expire_in":100}',
    };

    mock(settingService.pagesThirdPartyService, 'getEncyptAccessResponse', jest.fn().mockReturnValue(accessResponse));

    const result = await settingService.getAddPageThirdPartyShopeeParams(pageID, sellerID, accessResponse);

    expect(result).toEqual(response);
    expect(settingService.pagesThirdPartyService.getEncyptAccessResponse).toBeCalled();
  });

  test('get lazada access token url -> getLazadaAccessTokenUrl', async () => {
    const code = 'code';
    const settingService = new SettingService();
    const url = 'https://auth.lazada.com/rest/auth/token/create';
    const urlParams = {
      app_key: lazadaEnv.lazadaAppID,
      code,
      sign_method: lazadaEnv.lazadaSignInMethod,
      timestamp: 16000,
      sign: 'sign',
    };

    mock(helpers, 'getUTCUnixLazadaTimestamps', jest.fn().mockReturnValue(16000));
    mock(helpers, 'getLazadaSignCodeAndParams', jest.fn().mockReturnValue(urlParams));

    const result = await settingService.getLazadaAccessTokenUrl(code, lazadaEnv);

    expect(result).toEqual({ url, urlParams });

    expect(helpers.getUTCUnixLazadaTimestamps).toBeCalled();
    expect(helpers.getLazadaSignCodeAndParams).toBeCalled();
  });

  test('getWebhookPatternList', async () => {
    const settingService = new SettingService();
    const page_id = 311;
    const output = [
      {
        id: 1,
        name: 'webhook',
        regex_pattern: '/asd/g',
        status: true,
        url: 'https://space-x.itopplus.com',
      },
    ] as IPageWebhookPatternSetting[];
    mock(webhookpattern, 'getWebhookPatternList', jest.fn().mockResolvedValueOnce(output));
    const result = await settingService.getWebhookPatternList(page_id);
    expect(result[0].id).toEqual(result[0].id);
    expect(webhookpattern.getWebhookPatternList).toBeCalled();
  });

  test('addWebhookPattern', async () => {
    const settingService = new SettingService();
    const page_id = 311;
    const param = {
      name: 'webhook',
      regex_pattern: '/asd/g',
      status: true,
      url: 'https://space-x.itopplus.com',
    } as IPageWebhookPatternSetting;

    const output = {
      status: 200,
      value: '',
    } as IHTTPResult;
    mock(webhookpattern, 'addWebhookPattern', jest.fn().mockResolvedValueOnce(output));
    const result = await settingService.addWebhookPattern(param, page_id);
    expect(result.status).toEqual(200);
    expect(webhookpattern.addWebhookPattern).toBeCalled();
  });

  test('updateWebhookPattern', async () => {
    const settingService = new SettingService();
    const page_id = 311;
    const paramAndOutput = {
      id: 1,
      name: 'webhook',
      regex_pattern: '/asd/g',
      status: true,
      url: 'https://space-x.itopplus.com',
    } as IPageWebhookPatternSetting;
    const output = {
      status: 200,
      value: '',
    } as IHTTPResult;
    mock(webhookpattern, 'updateWebhookPattern', jest.fn().mockResolvedValueOnce(output));
    const result = await settingService.updateWebhookPattern(paramAndOutput, page_id);
    expect(result.status).toEqual(200);
    expect(webhookpattern.updateWebhookPattern).toBeCalled();
  });

  test('removeWebhookPattern Success', async () => {
    const settingService = new SettingService();
    const page_id = 311;
    const param = {
      id: 1,
    } as IPageWebhookPatternSetting;
    const output = {
      status: 200,
      value: '',
    } as IHTTPResult;
    mock(webhookpattern, 'removeWebhookPattern', jest.fn().mockResolvedValueOnce(output));
    const result = await settingService.removeWebhookPattern(param.id, page_id);
    expect(result.status).toEqual(200);
    expect(webhookpattern.removeWebhookPattern).toBeCalled();
  });

  test('toggleWebhookPatternStatus Failed', async () => {
    const settingService = new SettingService();
    const page_id = 311;
    const param = {
      id: 99,
    } as IPageWebhookPatternSetting;

    const output = {
      status: 500,
      value: 'Webhook Id is not match !!',
    } as IHTTPResult;
    mock(helpers, 'isEmptyValue', jest.fn().mockReturnValue(true));
    mock(webhookpattern, 'getWebhookPatternById', jest.fn().mockResolvedValueOnce(null));
    mock(webhookpattern, 'toggleWebhookPatternStatus', jest.fn().mockResolvedValueOnce(output));
    const result = await settingService.toggleWebhookPatternStatus(param.id, page_id);
    expect(result.status).toEqual(500);
    expect(webhookpattern.toggleWebhookPatternStatus).not.toBeCalled();
  });

  test('toggleWebhookPatternStatus Success', async () => {
    const settingService = new SettingService();
    const page_id = 311;
    const param = {
      id: 1,
    } as IPageWebhookPatternSetting;
    const outputGetById = {
      id: 1,
      name: 'webhook',
      regex_pattern: '/asd/g',
      status: true,
      url: 'https://space-x.itopplus.com',
    } as IPageWebhookPatternSetting;
    const output = {
      status: 200,
      value: 'Data has been saved successfully',
    } as IHTTPResult;
    mock(helpers, 'isEmptyValue', jest.fn().mockReturnValue(false));
    mock(webhookpattern, 'getWebhookPatternById', jest.fn().mockResolvedValueOnce(outputGetById));
    mock(webhookpattern, 'toggleWebhookPatternStatus', jest.fn().mockResolvedValueOnce(output));
    const result = await settingService.toggleWebhookPatternStatus(param.id, page_id);
    expect(result.status).toEqual(200);
    expect(webhookpattern.toggleWebhookPatternStatus).toBeCalled();
  });
});
