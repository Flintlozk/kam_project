import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import * as plsumarBackend from '@reactor-room/itopplus-back-end-helpers';
import { EnumPurchasingPayloadType, IProductCatalogSession, ISalePageProductFilter, ViewRenderType, WebhookProductCatalogTemplateQueries } from '@reactor-room/itopplus-model-lib';
import * as lodash from 'lodash';
import { Pool } from 'pg';
import { RedisClient } from 'redis';
import { ProductCatalogService } from '.';
import * as data from '../../data/';
import * as domains from '../../domains';
import * as numberWithComma from '../../domains/report/number-with-comma';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { environmentLib } from '@reactor-room/environment-services-frontend';

jest.mock('../../data');
jest.mock('../../domains');
jest.mock('@reactor-room/itopplus-back-end-helpers');

let catalogService = new ProductCatalogService();

const pageID = 344;
const subscriptionID = '8ce4d20f-d980-4127-8560-9523650d5f72';
const reader = PlusmarService.readerClient;
PlusmarService.redisClient = {
  set: (key: string, item: string) => jest.fn() as unknown,
  get: (key: string) => jest.fn() as unknown,
  DEL: (key: string) => jest.fn() as unknown,
  LPUSH: (key: string, item: string) => jest.fn() as unknown,
  LTRIM: (key: string, first: number, second: number) => jest.fn() as unknown,
} as RedisClient;
describe('Product catalog  service', () => {
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  beforeEach(() => {
    catalogService = new ProductCatalogService();
  });

  test('sendProductCatalogToChatBox success', async () => {
    const catalogPaylaod = {
      catalogID: 1,
      audienceID: 1,
      PSID: '1',
    };
    const response = { status: 200, value: true };

    mock(catalogService.pipelineProductCatalogService, 'sendProductCatalogToChatBox', await jest.fn().mockResolvedValue(response));

    const result = await catalogService.sendProductCatalogToChatBox(pageID, catalogPaylaod, subscriptionID);
    expect(response).toEqual(result);
    expect(catalogService.pipelineProductCatalogService.sendProductCatalogToChatBox).toBeCalledWith(pageID, catalogPaylaod, subscriptionID);
  });

  test('sendProductCatalogToChatBox error', async () => {
    const catalogPaylaod = {
      catalogID: 1,
      audienceID: 1,
      PSID: '1',
    };
    const errorMessage = 'ERROR';

    mock(catalogService.pipelineProductCatalogService, 'sendProductCatalogToChatBox', await jest.fn().mockRejectedValue(new Error(errorMessage)));

    const result = await catalogService.sendProductCatalogToChatBox(pageID, catalogPaylaod, subscriptionID);
    expect({ status: 403, value: errorMessage }).toEqual(result);
    expect(catalogService.pipelineProductCatalogService.sendProductCatalogToChatBox).toBeCalledWith(pageID, catalogPaylaod, subscriptionID);
  });

  //   test('', async () => {
  // });

  // test('', async () => {
  // });

  test('getProductsForSalePage success', async () => {
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
      },
      {
        id: 485,
        name: 'Ken',
        count: '4',
        minPrice: '4.00',
        maxPrice: '30.00',
        variantCount: '4',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ken_344_485_1606905261864.jpg/1606905262374146',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fken_344_485_1606905261864.jpg',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fken_344_485_1606905261864.jpg?generation=1606905262374146&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
      },
    ];
    const transformedProducts = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            mediaLink: 'https://resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png',
          },
        ],
        imageURL:
          'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
      },
      {
        id: 485,
        name: 'Ken',
        count: '4',
        minPrice: '4.00',
        maxPrice: '30.00',
        variantCount: '4',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ken_344_485_1606905261864.jpg/1606905262374146',
            mediaLink: 'https://resource.more-commerce.com/staging/344/ken_344_485_1606905261864.jpg',
          },
        ],
        imageURL:
          'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fken_344_485_1606905261864.jpg?generation=1606905262374146&alt=media',
      },
    ];

    const filters = {} as ISalePageProductFilter;
    const catalogID = 0;
    const currentPage = 1;
    const pageSize = 8;
    const page: number = (currentPage - 1) * pageSize;
    const categoryString = '';
    const tagString = '';
    const searchString = '';

    mock(catalogService, 'getProductsForSaleCondition', await jest.fn().mockResolvedValue(products));
    mock(plsumarBackend, 'transformImageUrlArray', jest.fn().mockReturnValueOnce(transformedProducts[0].images).mockReturnValueOnce(transformedProducts[1].images));
    mock(plsumarBackend, 'transformMediaLinkString', jest.fn().mockReturnValueOnce(transformedProducts[0].imageURL).mockReturnValueOnce(transformedProducts[1].imageURL));
    const result = await catalogService.getProductsForSalePage(pageID, currentPage, catalogID, filters, subscriptionID);
    expect(transformedProducts).toEqual(result);
    expect(catalogService.getProductsForSaleCondition).toBeCalledWith(pageID, page, pageSize, categoryString, tagString, searchString);
    expect(plsumarBackend.transformImageUrlArray).toHaveBeenNthCalledWith(1, products[0].images, environmentLib.filesServer, subscriptionID);
    expect(plsumarBackend.transformImageUrlArray).toHaveBeenNthCalledWith(2, products[1].images, environmentLib.filesServer, subscriptionID);
  });

  test('getProductsForSalePage error no catalog products', async () => {
    try {
      const filters = {} as ISalePageProductFilter;
      const catalogID = 1;
      const currentPage = 1;
      await catalogService.getProductsForSalePage(pageID, currentPage, catalogID, filters, subscriptionID);
      expect(catalogService.getProductsForSaleCondition).not.toBeCalled();
    } catch (error) {
      expect(error.message).toEqual('Error: IMPLEMENT_PRODUCT_CATALOG_OTHER_PRODUCTS');
    }
  });

  test('getProductsForSalePage error', async () => {
    const filters = {} as ISalePageProductFilter;
    const catalogID = 0;
    const currentPage = 1;
    const pageSize = 2;
    const page: number = (currentPage - 1) * pageSize;
    const categoryString = '';
    const tagString = '';
    const searchString = '';
    try {
      mock(catalogService, 'getProductsForSaleCondition', await jest.fn().mockRejectedValue(new Error('Error')));
      await catalogService.getProductsForSalePage(pageID, currentPage, catalogID, filters, subscriptionID);
      expect(catalogService.getProductsForSaleCondition).toBeCalledWith(pageID, page, pageSize, categoryString, tagString, searchString);
    } catch (error) {
      expect(error.message).toEqual('Error: Error');
    }
  });

  test('get tags and category', async () => {
    const tags = [
      { id: 671, name: 'red', active: false },
      { id: 672, name: 'blue', active: false },
      { id: 675, name: 'Camera', active: false },
    ];
    const categories = [
      {
        categoryID: 1447,
        category: 'red',
        status: false,
        subCategory: [
          { subCategory: 'bu', subCategoryID: 1448, subCategoryActive: false },
          { subCategory: 'cdcdcd', subCategoryID: 1493, subCategoryActive: false },
        ],
      },
      { categoryID: 1450, category: 'blue', status: false, subCategory: [{ subCategory: 'bb', subCategoryID: 1451, subCategoryActive: false }] },
      { categoryID: 1452, category: 'Camera', status: false, subCategory: [{ subCategory: 'Adapters', subCategoryID: 1453, subCategoryActive: false }] },
    ];
    mock(data, 'getProductTagsForSalePage', await jest.fn().mockResolvedValue(tags));
    mock(data, 'getProductCategoriesForSalePage', await jest.fn().mockResolvedValue(categories));

    const response = [tags, categories];

    const result = await catalogService.getTagsCategories(pageID);
    expect(response).toEqual(result);
    expect(data.getProductTagsForSalePage).toBeCalledWith(pageID, reader);
    expect(data.getProductCategoriesForSalePage).toBeCalledWith(pageID, reader);
  });

  test('catalog page', async () => {
    const params = {
      catalogID: '0',
      auth: 'auth:auth',
      page: 2,
      categoryIDs: null,
      tagIDs: null,
      search: null,
      psid: 'psid',
      audienceId: '0000',
      type: EnumPurchasingPayloadType.SEND_PRODUCT_CATALOG,
      view: ViewRenderType.FACEBOOK_WEBVIEW,
    } as WebhookProductCatalogTemplateQueries;
    const filter = {
      search: null,
      tagIDs: null,
      categoryIDs: null,
    } as ISalePageProductFilter;
    const credential = { pageID, subscriptionID };
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            mediaLink: 'https://resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png',
          },
        ],
        imageURL:
          'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
      },
      {
        id: 485,
        name: 'Ken',
        count: '4',
        minPrice: '4.00',
        maxPrice: '30.00',
        variantCount: '4',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ken_344_485_1606905261864.jpg/1606905262374146',
            mediaLink: 'https://resource.more-commerce.com/staging/344/ken_344_485_1606905261864.jpg',
          },
        ],
        imageURL:
          'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fken_344_485_1606905261864.jpg?generation=1606905262374146&alt=media',
      },
    ];
    mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
    mock(catalogService, 'getProductsForSalePage', await jest.fn().mockResolvedValue(products));
    const result = await catalogService.handlePurchaseCatalogPage(params);
    expect(products).toEqual(result);
    expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(params.auth);
    expect(catalogService.getProductsForSalePage).toBeCalledWith(pageID, params.page, +params.catalogID, filter, subscriptionID);
  });

  test('handleSessionSet success', async () => {
    const params = {
      cart: [],
      filter: {},
      startPoint: 'start',
    } as IProductCatalogSession;
    const credential = { pageID };
    const auth = 'auth';
    const result = { status: 200, value: true };
    const key = 'key';
    const catalogStorage = JSON.stringify(params);
    mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
    mock(domains, 'getProductCatalogRedisKey', jest.fn().mockReturnValue(key));
    mock(data, 'setCatalogStorage', jest.fn());
    const response = await catalogService.handleSessionSet(auth, params);
    expect(result).toEqual(response);
    expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
    expect(data.setCatalogStorage).toBeCalledWith(key, catalogStorage, PlusmarService.redisClient);
    expect(domains.getProductCatalogRedisKey).toBeCalledWith(auth, credential.pageID);
  });

  test('handleSessionSet not a valid request', async () => {
    try {
      const params = {
        cart: [],
        filter: {},
        startPoint: 'start',
      } as IProductCatalogSession;
      const credential = null;
      const auth = 'auth';
      const key = 'key';
      const catalogStorage = JSON.stringify(params);

      mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
      mock(domains, 'getProductCatalogRedisKey', jest.fn().mockReturnValue(key));
      mock(data, 'setCatalogStorage', jest.fn());
      await catalogService.handleSessionSet(auth, params);
      expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
      expect(domains.getProductCatalogRedisKey).not.toBeCalledWith(auth, credential.pageID);
      expect(data.setCatalogStorage).toBeCalledWith(key, catalogStorage, PlusmarService.redisClient);
    } catch (error) {
      expect(error.message).toEqual('Error: NOT_A_VALID_REQUEST');
    }
  });

  test('handleSessionSet -> error', async () => {
    const params = null as IProductCatalogSession;
    const credential = { pageID };
    const auth = 'auth';
    const key = 'key';
    const catalogStorage = JSON.stringify(params);
    try {
      mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
      mock(domains, 'getProductCatalogRedisKey', jest.fn().mockReturnValue(key));
      await catalogService.handleSessionSet(auth, params);
    } catch (error) {
      expect(error.message).toEqual('Error: NOT_A_VALID_REQUEST');
      expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
      expect(domains.getProductCatalogRedisKey).toBeCalledWith(auth, credential.pageID);
      expect(data.setCatalogStorage).toBeCalledWith(key, catalogStorage, PlusmarService.redisClient);
    }
  });

  test('handleSessionGet -> get session data', async () => {
    const catalogStorage = {
      cart: [],
      filter: {},
      startPoint: 'start',
    } as IProductCatalogSession;
    const credential = { pageID };
    const auth = 'auth';
    const key = 'key';
    mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
    mock(domains, 'getProductCatalogRedisKey', jest.fn().mockReturnValue(key));
    mock(data, 'getCatalogStorage', jest.fn().mockReturnValue(catalogStorage));

    const result = await catalogService.handleSessionGet(auth);
    expect(result).toEqual(catalogStorage);

    expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
    expect(domains.getProductCatalogRedisKey).toBeCalledWith(auth, credential.pageID);
    expect(data.getCatalogStorage).toBeCalledWith(key, PlusmarService.redisClient);
  });

  test('handleSessionGet -> get session data error', async () => {
    const catalogStorage = {
      cart: [],
      filter: {},
      startPoint: 'start',
    } as IProductCatalogSession;
    const credential = null;
    const auth = 'auth';
    const key = 'key';
    try {
      mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
      mock(domains, 'getProductCatalogRedisKey', jest.fn().mockReturnValue(key));
      mock(data, 'getCatalogStorage', jest.fn().mockReturnValue(catalogStorage));
      await catalogService.handleSessionGet(auth);
    } catch (error) {
      expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
      expect(domains.getProductCatalogRedisKey).not.toBeCalled();
      expect(data.getCatalogStorage).not.toBeCalledWith(key, PlusmarService.redisClient);
      expect(error.message).toEqual('Error: NOT_A_VALID_REQUEST');
    }
  });

  test('deleteCatalogSession -> delete session', async () => {
    const audienceID = 1;
    const redisClient = PlusmarService.redisClient;
    const redisKey = `${audienceID}:*`;
    const dataList = ['asas', 'dsds'];
    const auth1 = dataList[0];
    const auth2 = dataList[1];
    const catalogRedisKey1 = `CATALOG_${pageID}_${dataList[0]}`;
    const catalogRedisKey2 = `CATALOG_${pageID}_${dataList[0]}`;
    mock(data, 'getCatalogStorageByMatchedKeys', await jest.fn().mockResolvedValue(dataList));
    mock(domains, 'getProductCatalogRedisKey', jest.fn().mockReturnValue(catalogRedisKey1).mockReturnValue(catalogRedisKey2));
    mock(data, 'deleteCatalogStorage', jest.fn().mockResolvedValue({}).mockResolvedValue({}));

    await catalogService.deleteCatalogSession(pageID, audienceID);
    expect(data.getCatalogStorageByMatchedKeys).toBeCalledWith(redisKey, redisClient);
    expect(domains.getProductCatalogRedisKey).toHaveBeenNthCalledWith(1, auth1, pageID);
    expect(domains.getProductCatalogRedisKey).toHaveBeenNthCalledWith(2, auth2, pageID);
    expect(data.deleteCatalogStorage).toHaveBeenNthCalledWith(1, catalogRedisKey1, redisClient);
    expect(data.deleteCatalogStorage).toHaveBeenNthCalledWith(2, catalogRedisKey2, redisClient);
  });

  test('handlePurchaseCatalogCart -> get cart data', async () => {
    const credential = { pageID };
    const auth = 'auth';
    const cartPayload = {
      cart: [{ productID: 484, variantID: 649, quantity: 1 }],
      filter: {},
      startPoint:
        'https://086f-2405-201-3005-9147-ac2b-8204-6c37-7c74.au.ngrok.io/purchase?type=SEND_PRODUCT_CATALOG&audienceId=6225&catalogID=0&psid=4254962181242841&view=FACEBOOK_WEBVIEW&auth=6225%3A5035514c01880ebc&page=1',
    };
    const variants = [
      {
        variantID: 649,
        variantSold: 0,
        variantInventory: 1,
        variantStatus: 1,
        ref: '2427b15e-6014-45ac-b359-641d88407c72__v',
        variantStatusValue: 'Selling',
        variantImages: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantAttributes: '',
        variantUnitPrice: '2.00',
        productID: 484,
        productName: 'test',
      },
    ];

    const cartList = [
      {
        productID: 484,
        variantID: 649,
        quantity: 1,
        attributes: '',
        unitPrice: '2.00',
        productName: 'test',
        displayPrice: '฿2',
        price: 2,
        imageURL:
          'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
      },
    ];
    mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
    mock(data, 'getVariantsOfProductByVariantID', await jest.fn().mockResolvedValue(variants));
    mock(numberWithComma, 'numberWithComma', jest.fn().mockReturnValue('2'));
    mock(plsumarBackend, 'transformMediaLinkString', jest.fn().mockReturnValueOnce(variants[0].variantImages[0].mediaLink));
    const result = await catalogService.handlePurchaseCatalogCart(auth, cartPayload);
    expect(cartList).toEqual(result);
    expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
    expect(data.getVariantsOfProductByVariantID).toBeCalledWith(PlusmarService.readerClient, pageID, cartPayload.cart[0].productID, cartPayload.cart[0].variantID);
    expect(numberWithComma.numberWithComma).toBeCalledWith(cartPayload?.cart[0].quantity * +variants[0].variantUnitPrice);
    expect(plsumarBackend.transformMediaLinkString).toBeCalled();
  });

  test('handlePurchaseCatalogCart -> get cart data -> error', async () => {
    try {
      const credential = null;
      const auth = 'auth';
      const cartPayload = null;
      const variants = [
        {
          variantID: 649,
          variantSold: 0,
          variantInventory: 1,
          variantStatus: 1,
          ref: '2427b15e-6014-45ac-b359-641d88407c72__v',
          variantStatusValue: 'Selling',
          variantImages: [
            {
              id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
              selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
              mediaLink:
                'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
              bucket: 'resource.more-commerce.com',
            },
          ],
          variantAttributes: '',
          variantUnitPrice: '2.00',
          productID: 484,
          productName: 'test',
        },
      ];
      mock(catalogService.authService, 'getCredentialFromToken', await jest.fn().mockResolvedValue(credential));
      mock(data, 'getVariantsOfProductByVariantID', await jest.fn().mockResolvedValue(variants));
      mock(numberWithComma, 'numberWithComma', jest.fn().mockReturnValue('2'));

      await catalogService.handlePurchaseCatalogCart(auth, cartPayload);

      expect(catalogService.authService.getCredentialFromToken).toBeCalledWith(auth);
    } catch (error) {
      expect(error.message).toMatch('TypeError');
      expect(data.getVariantsOfProductByVariantID).not.toBeCalled();
      expect(numberWithComma.numberWithComma).not.toBeCalled();
    }
  });

  test('getVariantProductAttributeForSalePage -> get variant attributes', async () => {
    const productID = 484;
    const variantOfProducts = [
      {
        variantID: 649,
        variantSold: 0,
        variantInventory: 1,
        variantStatus: 1,
        variantImages: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantAttributes: '',
        variantUnitPrice: '2.00',
        productID: 484,
        productVariantID: null,
        variantMarketPlaceType: 'more_commerce',
        variantMarketPlaceID: null,
        ref: '2427b15e-6014-45ac-b359-641d88407c72__v',
        variantStatusValue: 'Selling',
        variantReserved: 0,
        variantAttributeIDs: [-1],
        mergedVariantData: null,
      },
    ];
    const variants = [
      {
        variantID: 649,
        variantSold: 0,
        variantInventory: 1,
        variantStatus: 1,
        variantImages: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            mediaLink: 'https://resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png',
          },
        ],
        variantAttributes: '',
        variantUnitPrice: '2.00',
        productID: 484,
        productVariantID: null,
        variantMarketPlaceType: 'more_commerce',
        variantMarketPlaceID: null,
        ref: '2427b15e-6014-45ac-b359-641d88407c72__v',
        variantStatusValue: 'Selling',
        variantReserved: 0,
        variantAttributeIDs: [-1],
        mergedVariantData: null,
        imageURL: 'https://resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png',
      },
    ];
    const attributes = [{ attributeID: -1, attributeName: '', subAttributes: [{ subAttributeID: -1, subAttributeName: '' }] }];
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
      },
    ];
    const transformedProducts = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            mediaLink: 'https://resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png',
          },
        ],
        imageURL:
          'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
      },
    ];
    mock(data, 'getVariantsOfProduct', await jest.fn().mockResolvedValue(variantOfProducts));
    mock(data, 'getAttributesByProductID', await jest.fn().mockResolvedValue(attributes));
    mock(data, 'getProductByIDForSalePage', await jest.fn().mockResolvedValue(products));
    mock(numberWithComma, 'numberWithComma', jest.fn().mockReturnValue('2.00').mockReturnValue('2.00'));
    mock(plsumarBackend, 'transformImageUrlArray', jest.fn().mockReturnValue(transformedProducts[0].images));
    mock(plsumarBackend, 'transformMediaLinkString', jest.fn().mockReturnValueOnce(transformedProducts[0].imageURL));
    const result = await catalogService.getVariantProductAttributeForSalePage(pageID, productID, subscriptionID);
    expect(result).toEqual([variants, attributes, transformedProducts[0]]);
    expect(data.getVariantsOfProduct).toBeCalledWith(PlusmarService.readerClient, pageID, productID);
    expect(data.getAttributesByProductID).toBeCalledWith(pageID, productID, PlusmarService.readerClient);
    expect(data.getProductByIDForSalePage).toBeCalledWith(pageID, productID, PlusmarService.readerClient);
    expect(numberWithComma.numberWithComma).toHaveBeenNthCalledWith(1, products[0].minPrice);
    expect(numberWithComma.numberWithComma).toHaveBeenNthCalledWith(2, products[0].maxPrice);
    expect(plsumarBackend.transformImageUrlArray).toHaveBeenNthCalledWith(1, [products[0]?.images[0]], environmentLib.filesServer, subscriptionID);
  });

  test('getProductsForSaleCondition -> get sale products on search ', async () => {
    const searchString = "AND upper(p.name) LIKE upper('%test%')";
    const tagString = null;
    const categoryString = null;
    const pageSize = 8;
    const page = 0;
    const pageID = 344;
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantQuantity: 1,
      },
    ];

    mock(data, 'getProductsForSalePage', await jest.fn().mockResolvedValue(products));
    mock(lodash, 'uniqBy', await jest.fn().mockResolvedValue(products));
    const result = await catalogService.getProductsForSaleCondition(pageID, page, pageSize, categoryString, tagString, searchString);
    expect(result).toEqual(products);
    expect(lodash.uniqBy).toBeCalledWith(products, 'id');
    expect(data.getProductsForSalePage).toBeCalledWith(pageID, page, pageSize, searchString, '', '', reader);
  });

  test('getProductsForSaleCondition -> get sale products on category ', async () => {
    const searchString = null;
    const tagString = null;
    const categoryString = '20';
    const pageSize = 8;
    const page = 0;
    const pageID = 344;
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantQuantity: 1,
      },
    ];
    mock(data, 'getProductsForSalePage', await jest.fn().mockResolvedValue(products));
    mock(lodash, 'uniqBy', await jest.fn().mockResolvedValue(products));
    const result = await catalogService.getProductsForSaleCondition(pageID, page, pageSize, categoryString, tagString, searchString);
    expect(result).toEqual(products);
    expect(lodash.uniqBy).toBeCalledWith(products, 'id');
    expect(data.getProductsForSalePage).toBeCalledWith(pageID, page, pageSize, '', categoryString, '', reader);
  });

  test('getProductsForSaleCondition -> get sale products on tags ', async () => {
    const searchString = null;
    const tagString = '20';
    const categoryString = null;
    const pageSize = 8;
    const page = 0;
    const pageID = 344;
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantQuantity: 1,
      },
    ];
    mock(data, 'getProductsForSalePage', await jest.fn().mockResolvedValue(products));
    mock(lodash, 'uniqBy', await jest.fn().mockResolvedValue(products));
    const result = await catalogService.getProductsForSaleCondition(pageID, page, pageSize, categoryString, tagString, searchString);
    expect(result).toEqual(products);
    expect(lodash.uniqBy).toBeCalledWith(products, 'id');
    expect(data.getProductsForSalePage).toBeCalledWith(pageID, page, pageSize, '', '', tagString, reader);
  });

  test('getProductsForSaleCondition -> get sale products on tags, search, category ', async () => {
    const searchString = "AND upper(p.name) LIKE upper('%test%')";
    const tagString = '20';
    const categoryString = '20';
    const pageSize = 8;
    const page = 0;
    const pageID = 344;
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantQuantity: 1,
      },
    ];
    mock(data, 'getProductsForSalePage', await jest.fn().mockResolvedValue(products).mockResolvedValue(products).mockResolvedValue(products));
    mock(lodash, 'uniqBy', await jest.fn().mockResolvedValue(products));
    const result = await catalogService.getProductsForSaleCondition(pageID, page, pageSize, categoryString, tagString, searchString);
    expect(result).toEqual(products);
    expect(data.getProductsForSalePage).toHaveBeenNthCalledWith(1, pageID, page, pageSize, '', categoryString, '', reader);
    expect(data.getProductsForSalePage).toHaveBeenNthCalledWith(2, pageID, page, pageSize, '', '', tagString, reader);
    expect(data.getProductsForSalePage).toHaveBeenNthCalledWith(3, pageID, page, pageSize, searchString, '', '', reader);
    expect(data.getProductsForSalePage).toBeCalledTimes(3);
    expect(lodash.uniqBy).toBeCalledWith([...products, ...products, ...products], 'id');
  });

  test('getProductsForSaleCondition -> no filter ', async () => {
    const searchString = null;
    const tagString = null;
    const categoryString = null;
    const pageSize = 8;
    const page = 0;
    const pageID = 344;
    const products = [
      {
        id: 484,
        name: 'test',
        count: '1',
        minPrice: '2.00',
        maxPrice: '2.00',
        variantCount: '1',
        images: [
          {
            id: 'resource.more-commerce.com/staging/344/ch_344_484_1606895989272.png/1606895990332047',
            selfLink: 'https://www.googleapis.com/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png',
            mediaLink:
              'https://storage.googleapis.com/download/storage/v1/b/resource.more-commerce.com/o/staging%2F344%2Fch_344_484_1606895989272.png?generation=1606895990332047&alt=media',
            bucket: 'resource.more-commerce.com',
          },
        ],
        variantQuantity: 1,
      },
    ];
    mock(data, 'getProductsForSalePage', await jest.fn().mockResolvedValue(products));
    mock(lodash, 'uniqBy', await jest.fn().mockResolvedValue(products));
    const result = await catalogService.getProductsForSaleCondition(pageID, page, pageSize, categoryString, tagString, searchString);
    expect(result).toEqual(products);
    expect(lodash.uniqBy).toBeCalledWith(products, 'id');
    expect(data.getProductsForSalePage).toBeCalledWith(pageID, page, pageSize, '', '', '', reader);
  });
});
