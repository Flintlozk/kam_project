import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import * as helperPlusmar from '@reactor-room/itopplus-back-end-helpers';
import {
  ILazadaCategoryAttributeResponse,
  ILazadaCategorySuggestionResponse,
  ILazadaCreateProductResponse,
  ILazadaDataResponse,
  LazadaOrderStatusTypes,
} from '@reactor-room/itopplus-model-lib';
import * as queryString from 'querystring';
import * as xmljs from 'xml-js';
import * as lazadaDomains from '../../domains';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import {
  createProductOnLazadaApi,
  getBrandsFromLazadaApi,
  getCategoryAttributesFromLazadaApi,
  getCategorySuggestionFromLazadaApi,
  getOrderItemsFromLazadaApi,
  getOrdersFromLazadaApi,
  getProductFromLazadaApi,
  updateInventoryOnLazadaApi,
  updateInventoryPriceOnLazadaApi,
} from './product-marketplace-lazada-api.service';

jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('xml-js');
jest.mock('querystring');
jest.mock('../../domains');
jest.mock('../../data/pages');

PlusmarService.environment = { ...environmentLib, pageKey: 'facebook012' };
const commonLazadaParams = {
  access_token: 'access',
  app_key: 111,
  filter: 'live',
  sign_method: 'sha256',
  timestamp: 123456,
};

const lazadaEnv = {
  appDomainName: 'https://puneet.itopplus.com',
  lazadaAppID: 111,
  lazadaAppSecret: '000',
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
describe('testing product inventory exists', () => {
  test('get product from lazada -> getProductFromLazadaApi', async () => {
    const accessToken = 'aaaa';
    const params = {
      ...commonLazadaParams,
      sign: '12345678',
    };

    const productData = { data: { code: '0', products: [{ data: 'data' }], total_products: 1 } };

    mock(lazadaDomains, 'getLazadaProductsUrlParams', jest.fn().mockResolvedValueOnce(params));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue(productData));

    const result = await getProductFromLazadaApi(accessToken, lazadaEnv);
    expect(result).toEqual(productData.data);
    expect(lazadaDomains.getLazadaProductsUrlParams).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
  });

  test('get product from lazada -> getOrdersFromLazadaApi', async () => {
    const accessToken = 'aaaa';
    const apiParams = {
      ...commonLazadaParams,
      status: LazadaOrderStatusTypes.CANCELED,
      update_after: 'today',
    };

    const orderData = {
      data: {
        count: 1,
        orders: [
          {
            order_id: 111,
            order_number: 111,
            price: 111,
            payment_method: 'COD',
            status: ['CANCELED'],
            items_count: 1,
          },
        ],
      },
    };

    mock(lazadaDomains, 'getLazadaOrdersUrlParams', jest.fn().mockResolvedValueOnce(apiParams));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue(orderData));
    const result = await getOrdersFromLazadaApi(accessToken, lazadaEnv, { status: LazadaOrderStatusTypes.CANCELED, update_after: 'todau' });
    expect(result).toEqual(orderData.data);
    expect(lazadaDomains.getLazadaOrdersUrlParams).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
  });

  test('get product from lazada -> getOrderItemsFromLazadaApi', async () => {
    const accessToken = 'aaaa';
    const apiParams = {
      ...commonLazadaParams,
      order_id: 99999,
    };

    const orderData = {
      data: {
        sku: 'sku',
        reason: 'reason',
        shop_sku: 'shop_sku',
        item_price: 1000,
      },
    };

    mock(lazadaDomains, 'getLazadaOrderItemsUrlParams', jest.fn().mockResolvedValueOnce(apiParams));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue(orderData));
    const result = await getOrderItemsFromLazadaApi(accessToken, lazadaEnv, 99999);
    expect(result).toEqual(orderData.data);
    expect(lazadaDomains.getLazadaOrderItemsUrlParams).toBeCalled();
    expect(helpers.axiosGetWithParams).toBeCalled();
  });

  test('update inventory on lazada -> updatePriceInventoryOnLazada', async (): Promise<void> => {
    const SellerSku = 'PenSKU-Yellow';
    const Quantity = 120;
    const productPrice = 771.0;
    const accessToken = 'access';
    const lazadaInvObj = { Request: { Product: { Skus: { Sku: { SellerSku: 'PenSKU-Yellow', Quantity: 120 } } } } };

    const lazadaProductPriceQuantityUpdateParams = {
      access_token: 'access',
      app_key: 111,
      payload: '<Request><Product><Skus><Sku><SellerSku>PenSKU-Yellow</SellerSku><Quantity>120</Quantity></Sku></Skus></Product></Request>',
      sign_method: 'sha256',
      timestamp: 222,
      sign: '333',
    };
    const lazadaUpdateXML = lazadaProductPriceQuantityUpdateParams.payload;

    const axiosResponse = { data: { code: '0', request_id: '0b11923716110433726294477' } };

    const successHttp = { status: 200, value: true };

    mock(lazadaDomains, 'getLazadaPriceInventoryUpdateRequestObj', jest.fn().mockReturnValue(lazadaInvObj));
    mock(xmljs, 'js2xml', jest.fn().mockReturnValue(lazadaUpdateXML));

    mock(lazadaDomains, 'getProductPriceQuantityUpdateLazadaUrlParams', jest.fn().mockReturnValue(lazadaProductPriceQuantityUpdateParams));

    mock(helpers, 'axiosPostWithoutHeader', jest.fn().mockReturnValue(axiosResponse));

    mock(helperPlusmar, 'getLazadaRequestResult', jest.fn().mockReturnValue(successHttp));

    const result = await updateInventoryOnLazadaApi(accessToken, Quantity, SellerSku, lazadaEnv);

    expect(result).toEqual(successHttp);
    expect(lazadaDomains.getLazadaPriceInventoryUpdateRequestObj).toBeCalled();
    expect(xmljs.js2xml).toBeCalled();
    expect(lazadaDomains.getProductPriceQuantityUpdateLazadaUrlParams).toBeCalled();
    expect(helpers.axiosPostWithoutHeader).toBeCalled();
    expect(helperPlusmar.getLazadaRequestResult).toBeCalled();
  });

  test('get brands from lazada -> getBrandsFromLazadaApi', async () => {
    const accessToken = 'aaaa';
    const apiParams = {
      ...commonLazadaParams,
      startRow: 0,
      pageSize: 200,
    };

    const brandResponse = {
      data: {
        enable_total: true,
        start_row: 0,
        page_index: 1,
        module: [
          {
            name: '3Dconnexion',
            global_identifier: '3dconnexion',
            name_en: '3Dconnexion',
            brand_id: 1,
          },
        ],
        total_page: 400,
        page_size: 200,
        total_record: 80000,
      },
      success: true,
      code: '0',
      request_id: '0b0dfacf16147440122441941',
    };
    const { lazadaApiUrlTH, lazadaGetBrand } = lazadaEnv;
    mock(lazadaDomains, 'getBrandFromLazadaUrlParams', jest.fn().mockReturnValue(apiParams));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue(brandResponse));
    const result = await getBrandsFromLazadaApi(accessToken, { startRow: 0, pageSize: 200 }, lazadaEnv);

    expect(result).toEqual(brandResponse.data);
    expect(lazadaDomains.getBrandFromLazadaUrlParams).toBeCalledWith(accessToken, lazadaEnv, { startRow: 0, pageSize: 200 });
    expect(helpers.axiosGetWithParams).toBeCalledWith(`${lazadaApiUrlTH}${lazadaGetBrand}`, apiParams);
  });

  test('get category suggestions from lazada -> getCategorySuggestionFromLazadaApi', async () => {
    const accessToken = 'aaaa';
    const keyword = 'ram';
    const suggestionRam = {
      data: {
        categorySuggestions: [
          {
            categoryPath: 'Mobiles & Tablets>Smartphones',
            categoryName: 'Smartphones',
            categoryId: 3973,
          },
          {
            categoryPath: 'Electronics Accessories>Computer Components>RAM',
            categoryName: 'RAM',
            categoryId: 3925,
          },
        ],
      },
      code: '0',
      request_id: '0b11958316147582424452581',
    };

    const { lazadaApiUrlTH, lazadaGetCategorySuggestion } = lazadaEnv;
    const apiUrl = `${lazadaApiUrlTH}${lazadaGetCategorySuggestion}`;
    const params = { ...commonLazadaParams, sign: 'wow' };

    mock(lazadaDomains, 'getLazadaCategorySuggestionUrlParams', jest.fn().mockReturnValue(params));
    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue(suggestionRam));

    const result = await getCategorySuggestionFromLazadaApi<ILazadaCategorySuggestionResponse>(accessToken, lazadaEnv, keyword);

    expect(suggestionRam.data).toEqual(result);
    expect(lazadaDomains.getLazadaCategorySuggestionUrlParams).toBeCalledWith(accessToken, lazadaEnv, keyword);
    expect(helpers.axiosGetWithParams).toBeCalledWith(apiUrl, params);
  });

  test('get category attributes from lazada -> getCategoryAttributesFromLazadaApi', async () => {
    const accessToken = 'aaaa';
    const primary_category_id = 1;
    const lazadaCategoryAttributes = {
      data: [
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'description',
          input_type: 'richText',
          options: [],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Long Description (Lorikeet)',
        },
        {
          advanced: {
            is_key_prop: 0,
          },
          is_sale_prop: 0,
          name: 'video',
          input_type: 'text',
          options: [],
          is_mandatory: 0,
          attribute_type: 'normal',
          label: 'Video URL',
        },
      ],
      code: '0',
      request_id: '0b0d992416147604318392989',
    };

    const { lazadaApiUrlTH, lazadaGetCateogoryAttributes } = lazadaEnv;
    const attributeUrl = `${lazadaApiUrlTH}${lazadaGetCateogoryAttributes}`;
    const params = { ...commonLazadaParams, sign: 'wow', primary_category_id };

    mock(lazadaDomains, 'getLazadaCategoryAttributesUrlParams', jest.fn().mockReturnValue(params));

    mock(helpers, 'axiosGetWithParams', jest.fn().mockReturnValue(lazadaCategoryAttributes));
    const result = await getCategoryAttributesFromLazadaApi<ILazadaCategoryAttributeResponse>(accessToken, lazadaEnv, primary_category_id);

    expect(lazadaCategoryAttributes.data).toEqual(result);
    expect(lazadaDomains.getLazadaCategoryAttributesUrlParams).toBeCalledWith(accessToken, lazadaEnv, primary_category_id);
    expect(helpers.axiosGetWithParams).toBeCalledWith(attributeUrl, params);
  });

  test('create product on lazada -> createProductOnLazadaApi', async () => {
    const accessToken = 'aaaa';
    const lazadaCreateObj = { Request: { Product: { PrimaryCategory: 7082, SPUId: null, Images: { Image: [] }, AssociatedSku: null, Attributes: null, Skus: { Sku: null } } } };

    const lazadaCreateXML = `<?xml version="1.0" encoding="UTF-8" ?>
  <Request>
    <Product>
      <PrimaryCategory>7082</PrimaryCategory>
      <SPUId/>
      <Images>
        <Image/>
      </Images>
      <AssociatedSku/>
      <Attributes/>
      <Skus>
        <Sku/>
      </Skus>
    </Product>
  </Request>`;
    const lazadaAPIResponse = {
      data: {
        item_id: 2218438757,
        sku_list: [
          { shop_sku: '2218438757_TH-7432116932', seller_sku: 'SKU-704558432357', sku_id: 7432116932 },
          { shop_sku: '2218438757_TH-7432116933', seller_sku: 'SKU-840454817024', sku_id: 7432116933 },
        ],
      },
      code: '0',
      request_id: '0b1e528016147675664142644',
    };
    const xmlOptions = { compact: true, ignoreComment: true };

    mock(xmljs, 'js2xml', jest.fn().mockReturnValue(lazadaCreateXML));
    mock(lazadaDomains, 'getCreateProductLazadaUrlParams', jest.fn().mockReturnValue(JSON.stringify(lazadaCreateObj)));
    mock(queryString, 'encode', jest.fn());
    mock(helpers, 'axiosPostWithoutHeader', jest.fn().mockReturnValue(lazadaAPIResponse));
    const result = await createProductOnLazadaApi<ILazadaDataResponse<ILazadaCreateProductResponse>>(accessToken, lazadaEnv, lazadaCreateObj);

    expect(lazadaAPIResponse.data).toEqual(result);
    expect(xmljs.js2xml).toBeCalledWith(lazadaCreateObj, xmlOptions);
    expect(lazadaDomains.getCreateProductLazadaUrlParams).toBeCalledWith(accessToken, lazadaEnv, lazadaCreateXML);
    expect(queryString.encode).toBeCalledWith(JSON.stringify(lazadaCreateObj));
    expect(helpers.axiosPostWithoutHeader).toBeCalled();
  });

  test('update inventory, price on lazada -> updateInventoryPriceOnLazadaApi', async (): Promise<void> => {
    const SellerSku = 'PenSKU-Yellow';
    const Quantity = 120;
    const Price = 771.0;
    const accessToken = 'access';
    const lazadaInvObj = { Request: { Product: { Skus: { Sku: { SellerSku: 'PenSKU-Yellow', Quantity: 120 } } } } };

    const lazadaProductPriceQuantityUpdateParams = {
      access_token: 'access',
      app_key: 111,
      payload: '<Request><Product><Skus><Sku><SellerSku>PenSKU-Yellow</SellerSku><Quantity>120</Quantity><Price>771.0</Price></Sku></Skus></Product></Request>',
      sign_method: 'sha256',
      timestamp: 222,
      sign: '333',
    };
    const lazadaUpdateXML = lazadaProductPriceQuantityUpdateParams.payload;

    const axiosResponse = { data: { code: '0', request_id: '0b11923716110433726294477' } };

    const successHttp = { status: 200, value: true };

    mock(lazadaDomains, 'getLazadaPriceInventoryUpdateRequestObj', jest.fn().mockReturnValue(lazadaInvObj));
    mock(xmljs, 'js2xml', jest.fn().mockReturnValue(lazadaUpdateXML));

    mock(lazadaDomains, 'getProductPriceQuantityUpdateLazadaUrlParams', jest.fn().mockReturnValue(lazadaProductPriceQuantityUpdateParams));

    mock(helpers, 'axiosPostWithoutHeader', jest.fn().mockReturnValue(axiosResponse));

    mock(helperPlusmar, 'getLazadaRequestResult', jest.fn().mockReturnValue(successHttp));

    const result = await updateInventoryPriceOnLazadaApi(accessToken, Quantity, Price, SellerSku, lazadaEnv);

    expect(result).toEqual(successHttp);
    expect(lazadaDomains.getLazadaPriceInventoryUpdateRequestObj).toBeCalled();
    expect(xmljs.js2xml).toBeCalled();
    expect(lazadaDomains.getProductPriceQuantityUpdateLazadaUrlParams).toBeCalled();
    expect(helpers.axiosPostWithoutHeader).toBeCalled();
    expect(helperPlusmar.getLazadaRequestResult).toBeCalled();
  });
});
