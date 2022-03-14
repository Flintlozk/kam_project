import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import * as plusmarHelpers from '@reactor-room/itopplus-back-end-helpers';
import { EnumPurchaseOrderStatus, IPagesThirdParty, LazadaOrderStatusTypes, OrderChannelTypes, SocialTypes } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import * as lazadaAPI from '../product/product-marketplace-lazada-api.service';
import { PurchaseOrderLazadaService } from './purchase-order-lazada.service';

let purchaseOrderLazadaService = new PurchaseOrderLazadaService();

jest.mock('../../data');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('../product/product-marketplace-lazada-api.service');

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
const pageMarketPlaceLazada = [
  {
    id: 146,
    pageID: 344,
    sellerID: '100189392074',
    name: 'Khappom Shop',
    picture: '',
    url: 'https://www.lazada.co.th/shop/khappom-shop',
    accessToken: '50000401332sGw0gvHMvaRxHbfgq6otzjIdKGXFTwoCx1ee6c299kpTcJa8sHiwy',
    accessTokenExpire: '2021-04-04 08:04:00',
    pageType: 'lazada',
    refreshToken: '50001401732ia0jqbWTiXBjU8oxufjfPnYdrSlEZCTOb156b3b03vparlY8yakcJ',
    refreshTokenExpire: 'string',
    updatedAt: new Date('2021-03-28T08:05:00.000Z'),
    sellerPayload: '',
    createdAt: new Date('2021-02-16T04:45:43.000Z'),
    payload:
      '{"access_token":"access_token","country":"th","account_platform":"seller_center","expires_in":604800,"account":"krischaporn@theiconweb.com","code":"0","request_id":""}',
  },
] as IPagesThirdParty[];

const pageMarketPlaceLazadaMultiple = [pageMarketPlaceLazada[0], pageMarketPlaceLazada[0]];
const update_after = '2021-03-25T03:13:29Z';
const marketPlaceOrders = [
  {
    orderID: 1656,
    marketPlaceOrderID: '375097176820935',
    orderChannel: OrderChannelTypes.LAZADA,
    pageID: 344,
    status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
    updatedAt: '2021-03-28T08:05:00.000Z',
    createdAt: '2021-02-16T04:45:43.000Z',
  },
];

const marketPlaceOrdersMultiple = [
  {
    orderID: 1656,
    marketPlaceOrderID: '375097176820935',
    orderChannel: OrderChannelTypes.LAZADA,
    pageID: 344,
    status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
    updatedAt: '2021-03-28T08:05:00.000Z',
    createdAt: '2021-02-16T04:45:43.000Z',
  },
  {
    orderID: 1656,
    marketPlaceOrderID: '375097176820935',
    orderChannel: OrderChannelTypes.LAZADA,
    pageID: 344,
    status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
    updatedAt: '2021-03-28T08:05:00.000Z',
    createdAt: '2021-02-16T04:45:43.000Z',
  },
];
const orderData = {
  data: {
    count: 1,
    orders: [
      {
        voucher_platform: 0,
        voucher: 0,
        warehouse_code: 'dropshipping',
        order_number: 375097176820935,
        voucher_seller: 0,
        created_at: '2021-03-25 10:13:29 +0700',
        voucher_code: '',
        gift_option: false,
        shipping_fee_discount_platform: 0,
        customer_last_name: '',
        updated_at: '2021-03-25 10:13:41 +0700',
        promised_shipping_times: '',
        price: '4,720.00',
        national_registration_number: '',
        shipping_fee_original: 40,
        payment_method: 'COD',
        customer_first_name: 'P************* ',
        shipping_fee_discount_seller: 0,
        shipping_fee: 40,
        items_count: 4,
        delivery_info: '',
        statuses: [LazadaOrderStatusTypes.PENDING],
        address_billing: {
          country: 'Thailand',
          address3: 'ก********************k',
          phone: '66********31',
          address2: '',
          city: 'ดินแดง/ Din Daeng',
          address1: 'I*****************************************************k',
          post_code: '10400',
          phone2: '',
          last_name: '',
          address5: '1***0',
          address4: 'ด***************g',
          first_name: 'Puneet Kushwah',
        },
        extra_attributes: '{"TaxInvoiceRequested":false}',
        order_id: 375097176820935,
        gift_message: '',
        remarks: '',
        address_shipping: {
          country: 'Thailand',
          address3: 'ก********************k',
          phone: '66********31',
          address2: '',
          city: 'ดินแดง/ Din Daeng',
          address1: 'I*****************************************************k',
          post_code: '10400',
          phone2: '',
          last_name: '',
          address5: '1***0',
          address4: 'ด***************g',
          first_name: 'Puneet Kushwah',
        },
      },
    ],
  },
  code: '0',
  request_id: '0b0df2f416170748467896763',
};

const orderDataMultiple = {
  data: {
    count: 2,
    orders: [
      {
        voucher_platform: 0,
        voucher: 0,
        warehouse_code: 'dropshipping',
        order_number: 375097176820935,
        voucher_seller: 0,
        created_at: '2021-03-25 10:13:29 +0700',
        voucher_code: '',
        gift_option: false,
        shipping_fee_discount_platform: 0,
        customer_last_name: '',
        updated_at: '2021-03-25 10:13:41 +0700',
        promised_shipping_times: '',
        price: '4,720.00',
        national_registration_number: '',
        shipping_fee_original: 40,
        payment_method: 'COD',
        customer_first_name: 'P************* ',
        shipping_fee_discount_seller: 0,
        shipping_fee: 40,
        items_count: 4,
        delivery_info: '',
        statuses: [LazadaOrderStatusTypes.PENDING],
        address_billing: {
          country: 'Thailand',
          address3: 'ก********************k',
          phone: '66********31',
          address2: '',
          city: 'ดินแดง/ Din Daeng',
          address1: 'I*****************************************************k',
          post_code: '10400',
          phone2: '',
          last_name: '',
          address5: '1***0',
          address4: 'ด***************g',
          first_name: 'Puneet Kushwah',
        },
        extra_attributes: '{"TaxInvoiceRequested":false}',
        order_id: 375097176820935,
        gift_message: '',
        remarks: '',
        address_shipping: {
          country: 'Thailand',
          address3: 'ก********************k',
          phone: '66********31',
          address2: '',
          city: 'ดินแดง/ Din Daeng',
          address1: 'I*****************************************************k',
          post_code: '10400',
          phone2: '',
          last_name: '',
          address5: '1***0',
          address4: 'ด***************g',
          first_name: 'Puneet Kushwah',
        },
      },
      {
        voucher_platform: 0,
        voucher: 0,
        warehouse_code: 'dropshipping',
        order_number: 3750971768209351,
        voucher_seller: 0,
        created_at: '2021-03-25 10:13:29 +0700',
        voucher_code: '',
        gift_option: false,
        shipping_fee_discount_platform: 0,
        customer_last_name: '',
        updated_at: '2021-03-25 10:13:41 +0700',
        promised_shipping_times: '',
        price: '4,720.00',
        national_registration_number: '',
        shipping_fee_original: 40,
        payment_method: 'COD',
        customer_first_name: 'P************* ',
        shipping_fee_discount_seller: 0,
        shipping_fee: 40,
        items_count: 4,
        delivery_info: '',
        statuses: [LazadaOrderStatusTypes.PENDING],
        address_billing: {
          country: 'Thailand',
          address3: 'ก********************k',
          phone: '66********31',
          address2: '',
          city: 'ดินแดง/ Din Daeng',
          address1: 'I*****************************************************k',
          post_code: '10400',
          phone2: '',
          last_name: '',
          address5: '1***0',
          address4: 'ด***************g',
          first_name: 'Puneet Kushwah',
        },
        extra_attributes: '{"TaxInvoiceRequested":false}',
        order_id: 3750971768209351,
        gift_message: '',
        remarks: '',
        address_shipping: {
          country: 'Thailand',
          address3: 'ก********************k',
          phone: '66********31',
          address2: '',
          city: 'ดินแดง/ Din Daeng',
          address1: 'I*****************************************************k',
          post_code: '10400',
          phone2: '',
          last_name: '',
          address5: '1***0',
          address4: 'ด***************g',
          first_name: 'Puneet Kushwah',
        },
      },
    ],
  },
  code: '0',
  request_id: '0b0df2f416170748467896763',
};

const orderItemsData = {
  data: [
    {
      tax_amount: 0,
      reason: '',
      sla_time_stamp: '2021-03-29T23:59:59+07:00',
      purchase_order_id: '',
      voucher_seller: 0,
      voucher_code_seller: '',
      voucher_code: '',
      package_id: '',
      variation: '',
      voucher_code_platform: '',
      purchase_order_number: '',
      sku: 'SKU-776431278942',
      invoice_number: '',
      order_type: 'Normal',
      cancel_return_initiator: '',
      shop_sku: '2268488943_TH-7618150905',
      stage_pay_status: '',
      tracking_code_pre: '',
      order_item_id: 375097176920935,
      shop_id: 'krischaporn reianthipayasakun',
      order_flag: 'NORMAL',
      name: 'Ram for all-ddr2',
      order_id: 375097176820935,
      status: 'pending',
      paid_price: 1220,
      product_main_image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr2_b3519c90-0d6b-492b-8f3b-d4f3efa40985_684_1612860047329.jpg',
      voucher_platform: 0,
      product_detail_url: 'https://www.lazada.co.th/products/i2268488943-s7618150905.html?urlFlag=true&mp=1',
      promised_shipping_time: '',
      warehouse_code: 'dropshipping',
      shipping_type: 'Dropshipping',
      created_at: '2021-03-25 10:13:29 +0700',
      updated_at: '2021-03-25 10:13:41 +0700',
      currency: 'THB',
      shipping_provider_type: 'standard',
      shipping_fee_original: 17.39,
      is_digital: 0,
      item_price: 1220,
      shipping_service_cost: 0,
      tracking_code: '',
      shipping_amount: 17.39,
      reason_detail: '',
      return_status: '',
      shipment_provider: '',
      voucher_amount: 0,
      digital_delivery_info: '',
      extra_attributes: '',
      quantity: 1,
    },
    {
      tax_amount: 0,
      reason: '',
      sla_time_stamp: '2021-03-29T23:59:59+07:00',
      purchase_order_id: '',
      voucher_seller: 0,
      voucher_code_seller: '',
      voucher_code: '',
      package_id: '',
      variation: 'สี:ส้มแอปริคอต, ไซส์:62',
      voucher_code_platform: '',
      purchase_order_number: '',
      sku: 'SKU-840454817024',
      invoice_number: '',
      order_type: 'Normal',
      cancel_return_initiator: '',
      shop_sku: '2270973013_TH-7628483463',
      stage_pay_status: '',
      tracking_code_pre: '',
      order_item_id: 375097177020935,
      shop_id: 'krischaporn reianthipayasakun',
      order_flag: 'NORMAL',
      name: 'Shirts For Lazada',
      order_id: 375097176820935,
      status: LazadaOrderStatusTypes.PENDING,
      paid_price: 2500,
      product_main_image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/shirt-red_b3519c90-0d6b-492b-8f3b-d4f3efa40985_698_1613473322797.jpg',
      voucher_platform: 0,
      product_detail_url: 'https://www.lazada.co.th/products/i2270973013-s7628483463.html?urlFlag=true&mp=1',
      promised_shipping_time: '',
      warehouse_code: 'dropshipping',
      shipping_type: 'Dropshipping',
      created_at: '2021-03-25 10:13:29 +0700',
      updated_at: '2021-03-25 10:13:41 +0700',
      currency: 'THB',
      shipping_provider_type: 'standard',
      shipping_fee_original: 17.39,
      is_digital: 0,
      item_price: 2500,
      shipping_service_cost: 0,
      tracking_code: '',
      shipping_amount: 17.39,
      reason_detail: '',
      return_status: '',
      shipment_provider: '',
      voucher_amount: 0,
      digital_delivery_info: '',
      quantity: 1,
      extra_attributes: '',
    },
  ],
  code: '0',
  request_id: '0be6f97c16170766128234312',
};
const pageID = 344;
PlusmarService.readerClient = {} as unknown as Pool;
const { accessToken } = pageMarketPlaceLazada[0];

describe('PurchaseOrderLazadaService tests', () => {
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  beforeEach(() => {
    purchaseOrderLazadaService = new PurchaseOrderLazadaService();
  });

  test('get Lazada update after date when order found -> getLazadaUpdateAfter', async () => {
    const createdAt = pageMarketPlaceLazada[0].createdAt;
    mock(data, 'getLatestCreatedAtMarketPlaceOrderDate', jest.fn().mockResolvedValue(update_after));
    mock(helpers, 'getUTCDateFromString', jest.fn().mockResolvedValue(update_after));
    const date = await purchaseOrderLazadaService.getLazadaUpdateAfter(createdAt, pageID);
    expect(date).toEqual(update_after);
    expect(data.getLatestCreatedAtMarketPlaceOrderDate).toBeCalledWith(pageID, OrderChannelTypes.LAZADA, PlusmarService.readerClient);

    expect(helpers.getUTCDateFromString).toBeCalledWith(update_after);
  });

  test('get Lazada update after date when order not found -> getLazadaUpdateAfter', async () => {
    const createdAt = pageMarketPlaceLazada[0].createdAt;
    const createdAtString = '2021-02-16T04:45:43.000Z';
    mock(data, 'getLatestCreatedAtMarketPlaceOrderDate', jest.fn().mockResolvedValue(null));
    mock(helpers, 'getUTCDateFromString', jest.fn().mockResolvedValue(String(createdAtString)));
    const date = await purchaseOrderLazadaService.getLazadaUpdateAfter(createdAt, pageID);
    expect(date).toEqual(createdAtString);
    expect(data.getLatestCreatedAtMarketPlaceOrderDate).toBeCalledWith(pageID, OrderChannelTypes.LAZADA, PlusmarService.readerClient);

    expect(helpers.getUTCDateFromString).toBeCalledWith(String(createdAt));
  });

  test('get orders list success -> getOrdersFromLazadaAndUpdatePurchaseOrders', async () => {
    mock(lazadaAPI, 'getOrdersFromLazadaApi', jest.fn().mockResolvedValue(orderData));
    mock(purchaseOrderLazadaService, 'updatePurchaseOrderFromLazada', jest.fn().mockResolvedValue(marketPlaceOrders));
    const marketOrders = await purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrders(pageID, accessToken, { update_after }, lazadaEnv, PlusmarService.writerClient);
    expect(marketOrders).toEqual(marketPlaceOrders);
    expect(lazadaAPI.getOrdersFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, { update_after });
    expect(purchaseOrderLazadaService.updatePurchaseOrderFromLazada).toBeCalledWith(pageID, orderData.data, PlusmarService.writerClient);
  });

  test('get orders list api error -> getOrdersFromLazadaAndUpdatePurchaseOrders', async () => {
    try {
      mock(lazadaAPI, 'getOrdersFromLazadaApi', jest.fn().mockResolvedValue({ code: 'error' }));
      const marketOrders = await purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrders(
        pageID,
        accessToken,
        { update_after },
        lazadaEnv,
        PlusmarService.writerClient,
      );
      expect(marketOrders).toEqual(marketPlaceOrders);
      expect(lazadaAPI.getOrdersFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, { update_after });
      expect(purchaseOrderLazadaService.updatePurchaseOrderFromLazada).not.toBeCalledWith(pageID, orderData.data, PlusmarService.writerClient);
    } catch (error) {
      expect(error.message).toEqual('Error: LAZADA_ORDERS_ERROR_AT_API{"code":"error"}');
    }
  });

  test('get orders list error -> getOrdersFromLazadaAndUpdatePurchaseOrders', async () => {
    try {
      mock(lazadaAPI, 'getOrdersFromLazadaApi', jest.fn().mockResolvedValue({ code: '0' }));
      const marketOrders = await purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrders(null, null, { update_after }, lazadaEnv, PlusmarService.writerClient);
      expect(marketOrders).toEqual(marketPlaceOrders);
      expect(lazadaAPI.getOrdersFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, { update_after });
      expect(purchaseOrderLazadaService.updatePurchaseOrderFromLazada).not.toBeCalledWith(pageID, orderData.data, PlusmarService.writerClient);
    } catch (error) {
      expect(error.message).toMatch('TypeError');
    }
  });

  test('get orders list multiple -> getOrderItemsFromLazadaAndUpdatePurchaseOrderItems', async () => {
    mock(lazadaAPI, 'getOrderItemsFromLazadaApi', jest.fn().mockResolvedValue(orderItemsData));
    mock(purchaseOrderLazadaService, 'updatePurchaseOrderItemsFromLazada', jest.fn().mockResolvedValue({}));
    await purchaseOrderLazadaService.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems(
      marketPlaceOrdersMultiple,
      pageMarketPlaceLazada[0],
      lazadaEnv,
      PlusmarService.writerClient,
    );
    expect(lazadaAPI.getOrderItemsFromLazadaApi).toBeCalledTimes(2);
    expect(purchaseOrderLazadaService.updatePurchaseOrderItemsFromLazada).toBeCalledTimes(2);
  });

  test('get orders list success -> getOrderItemsFromLazadaAndUpdatePurchaseOrderItems', async () => {
    const { orderID, status, marketPlaceOrderID } = marketPlaceOrders[0];
    mock(lazadaAPI, 'getOrderItemsFromLazadaApi', jest.fn().mockResolvedValue(orderItemsData));
    mock(purchaseOrderLazadaService, 'updatePurchaseOrderItemsFromLazada', jest.fn().mockResolvedValue({}));
    await purchaseOrderLazadaService.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems(marketPlaceOrders, pageMarketPlaceLazada[0], lazadaEnv, PlusmarService.writerClient);
    expect(lazadaAPI.getOrderItemsFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, +marketPlaceOrderID);
    expect(purchaseOrderLazadaService.updatePurchaseOrderItemsFromLazada).toBeCalledWith(pageID, orderID, status, orderItemsData.data, PlusmarService.writerClient);
  });

  test('get orders list api error -> getOrderItemsFromLazadaAndUpdatePurchaseOrderItems', async () => {
    try {
      const { orderID, status, marketPlaceOrderID } = marketPlaceOrders[0];

      mock(lazadaAPI, 'getOrderItemsFromLazadaApi', jest.fn().mockResolvedValue({ code: 'error' }));
      await purchaseOrderLazadaService.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems(marketPlaceOrders, pageMarketPlaceLazada[0], lazadaEnv, PlusmarService.writerClient);
      expect(lazadaAPI.getOrderItemsFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, +marketPlaceOrderID);
      expect(purchaseOrderLazadaService.updatePurchaseOrderItemsFromLazada).not.toBeCalledWith(pageID, orderID, status, orderItemsData.data);
    } catch (error) {
      expect(error.message).toEqual('LAZADA_ORDER_ITEMS_ERROR_AT_API{"code":"error"}');
    }
  });

  test('get orders list error -> getOrderItemsFromLazadaAndUpdatePurchaseOrderItems', async () => {
    try {
      const { orderID, status, marketPlaceOrderID } = marketPlaceOrders[0];
      mock(lazadaAPI, 'getOrderItemsFromLazadaApi', jest.fn().mockResolvedValue({ code: '0' }));
      await purchaseOrderLazadaService.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems(marketPlaceOrders, null, lazadaEnv, PlusmarService.writerClient);
      expect(lazadaAPI.getOrderItemsFromLazadaApi).toBeCalledWith(accessToken, lazadaEnv, +marketPlaceOrderID);
      expect(purchaseOrderLazadaService.updatePurchaseOrderItemsFromLazada).not.toBeCalledWith(pageID, orderID, status, orderItemsData.data);
    } catch (error) {
      expect(error.message).toMatch('Cannot destructure');
    }
  });

  test(' update purchase order table multiple -> updatePurchaseOrderFromLazada multiple', async () => {
    const orderParams = {
      alias_order_id: '375097176820935',
      total_price: undefined,
      page_id: 344,
      created_at: new Date('2021-03-25T03:13:29.000Z'),
      updated_at: new Date('2021-03-25T03:13:41.000Z'),
      discount: 0,
      is_paid: false,
      is_auto: false,
      order_channel: 'LAZADA',
      status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
    };

    mock(plusmarHelpers, 'getLazadaOrderUpdateParams', jest.fn().mockReturnValue(orderParams));

    mock(data, 'createPurchasingOrderMarketPlace', jest.fn().mockReturnValue(marketPlaceOrders[0]));

    const updateResult = await purchaseOrderLazadaService.updatePurchaseOrderFromLazada(pageID, orderDataMultiple.data, PlusmarService.writerClient);
    expect(updateResult).toEqual(marketPlaceOrdersMultiple);

    expect(plusmarHelpers.getLazadaOrderUpdateParams).toBeCalledTimes(2);
    expect(data.createPurchasingOrderMarketPlace).toBeCalledTimes(2);
  });

  test(' update purchase order table -> updatePurchaseOrderFromLazada', async () => {
    const orderParams = {
      alias_order_id: '375097176820935',
      total_price: undefined,
      page_id: 344,
      created_at: new Date('2021-03-25T03:13:29.000Z'),
      updated_at: new Date('2021-03-25T03:13:41.000Z'),
      discount: 0,
      is_paid: false,
      is_auto: false,
      order_channel: 'LAZADA',
      status: EnumPurchaseOrderStatus.WAITING_FOR_PAYMENT,
    };

    mock(plusmarHelpers, 'getLazadaOrderUpdateParams', jest.fn().mockReturnValue(orderParams));

    mock(data, 'createPurchasingOrderMarketPlace', jest.fn().mockReturnValue(marketPlaceOrders[0]));

    const updateResult = await purchaseOrderLazadaService.updatePurchaseOrderFromLazada(pageID, orderData.data, PlusmarService.writerClient);
    expect(updateResult).toEqual(marketPlaceOrders);
    expect(plusmarHelpers.getLazadaOrderUpdateParams).toBeCalledWith(pageID, orderData.data.orders[0]);
    expect(data.createPurchasingOrderMarketPlace).toBeCalledWith(PlusmarService.writerClient, orderParams);
  });

  test('get order and update orders -> getOrdersFromLazadaAndUpdatePurchaseOrdersCron', async () => {
    mock(purchaseOrderLazadaService, 'getLazadaUpdateAfter', jest.fn().mockResolvedValue(update_after));
    mock(purchaseOrderLazadaService, 'getOrdersFromLazadaAndUpdatePurchaseOrders', jest.fn().mockResolvedValue(marketPlaceOrders));
    mock(purchaseOrderLazadaService, 'getOrderItemsFromLazadaAndUpdatePurchaseOrderItems', jest.fn().mockResolvedValue({}));
    await purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrdersCron(pageMarketPlaceLazada, lazadaEnv, PlusmarService.writerClient);
    expect(purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrders).toBeCalledWith(pageID, accessToken, { update_after }, lazadaEnv, PlusmarService.writerClient);
    expect(purchaseOrderLazadaService.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems).toBeCalledWith(
      marketPlaceOrders,
      pageMarketPlaceLazada[0],
      lazadaEnv,
      PlusmarService.writerClient,
    );
  });

  test('get order and update orders multiple -> getOrdersFromLazadaAndUpdatePurchaseOrdersCron', async () => {
    mock(purchaseOrderLazadaService, 'getLazadaUpdateAfter', jest.fn().mockResolvedValue(update_after));
    mock(purchaseOrderLazadaService, 'getOrdersFromLazadaAndUpdatePurchaseOrders', jest.fn().mockResolvedValue(marketPlaceOrders));
    mock(purchaseOrderLazadaService, 'getOrderItemsFromLazadaAndUpdatePurchaseOrderItems', jest.fn().mockResolvedValue({}));
    await purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrdersCron(pageMarketPlaceLazadaMultiple, lazadaEnv, PlusmarService.writerClient);
    expect(purchaseOrderLazadaService.getOrdersFromLazadaAndUpdatePurchaseOrders).toBeCalledTimes(2);
    expect(purchaseOrderLazadaService.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems).toBeCalledTimes(2);
  });

  test(' update purchase order items table -> updatePurchaseOrderItemsFromLazada', async () => {
    const orderItemsResponse = [
      {
        tax_amount: 0,
        reason: 'เปลี่ยนใจ',
        sla_time_stamp: '2021-04-19T23:59:59+07:00',
        purchase_order_id: '',
        voucher_seller: 0,
        voucher_code_seller: '',
        voucher_code: '',
        package_id: '',
        variation: '',
        voucher_code_platform: '',
        purchase_order_number: '',
        sku: 'SKU-RAM1',
        invoice_number: '',
        order_type: 'Normal',
        cancel_return_initiator: 'cancellation-customer',
        shop_sku: '2292225297_TH-7709407525',
        stage_pay_status: '',
        tracking_code_pre: '',
        order_item_id: 379364035520935,
        shop_id: 'krischaporn reianthipayasakun',
        order_flag: 'NORMAL',
        name: 'RAM WOW',
        order_id: 379364035420935,
        status: LazadaOrderStatusTypes.CANCELED,
        paid_price: 40,
        product_main_image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
        voucher_platform: 0,
        product_detail_url: 'https://www.lazada.co.th/products/i2292225297-s7709407525.html?urlFlag=true&mp=1',
        promised_shipping_time: '',
        warehouse_code: 'dropshipping',
        shipping_type: 'Dropshipping',
        created_at: '2021-04-09 14:41:41 +0700',
        updated_at: '2021-04-09 14:46:54 +0700',
        currency: 'THB',
        shipping_provider_type: 'standard',
        shipping_fee_original: 30,
        is_digital: 0,
        item_price: 40,
        shipping_service_cost: 0,
        tracking_code: '',
        shipping_amount: 30,
        reason_detail: '',
        return_status: '',
        shipment_provider: '',
        voucher_amount: 0,
        digital_delivery_info: '',
        extra_attributes: '',
      },
    ];
    const orderStatus = EnumPurchaseOrderStatus.REJECT;
    const orderID = 3633;
    const pageID = 344;
    const orderItemsWithQuantity = [
      {
        tax_amount: 0,
        reason: 'เปลี่ยนใจ',
        sla_time_stamp: '2021-04-19T23:59:59+07:00',
        purchase_order_id: '',
        voucher_seller: 0,
        voucher_code_seller: '',
        voucher_code: '',
        package_id: '',
        variation: '',
        voucher_code_platform: '',
        purchase_order_number: '',
        sku: 'SKU-RAM1',
        invoice_number: '',
        order_type: 'Normal',
        cancel_return_initiator: 'cancellation-customer',
        shop_sku: '2292225297_TH-7709407525',
        stage_pay_status: '',
        tracking_code_pre: '',
        order_item_id: 379364035520935,
        shop_id: 'krischaporn reianthipayasakun',
        order_flag: 'NORMAL',
        name: 'RAM WOW',
        order_id: 379364035420935,
        status: 'canceled',
        paid_price: 40,
        product_main_image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
        voucher_platform: 0,
        product_detail_url: 'https://www.lazada.co.th/products/i2292225297-s7709407525.html?urlFlag=true&mp=1',
        promised_shipping_time: '',
        warehouse_code: 'dropshipping',
        shipping_type: 'Dropshipping',
        created_at: '2021-04-09 14:41:41 +0700',
        updated_at: '2021-04-09 14:46:54 +0700',
        currency: 'THB',
        shipping_provider_type: 'standard',
        shipping_fee_original: 30,
        is_digital: 0,
        item_price: 40,
        shipping_service_cost: 0,
        tracking_code: '',
        shipping_amount: 30,
        reason_detail: '',
        return_status: '',
        shipment_provider: '',
        voucher_amount: 0,
        digital_delivery_info: '',
        extra_attributes: '',
        quantity: 1,
        canceledQuantity: 1,
        quantityJson: [
          {
            tax_amount: 0,
            reason: 'เปลี่ยนใจ',
            sla_time_stamp: '2021-04-19T23:59:59+07:00',
            purchase_order_id: '',
            voucher_seller: 0,
            voucher_code_seller: '',
            voucher_code: '',
            package_id: '',
            variation: '',
            voucher_code_platform: '',
            purchase_order_number: '',
            sku: 'SKU-RAM1',
            invoice_number: '',
            order_type: 'Normal',
            cancel_return_initiator: 'cancellation-customer',
            shop_sku: '2292225297_TH-7709407525',
            stage_pay_status: '',
            tracking_code_pre: '',
            order_item_id: 379364035520935,
            shop_id: 'krischaporn reianthipayasakun',
            order_flag: 'NORMAL',
            name: 'RAM WOW',
            order_id: 379364035420935,
            status: 'canceled',
            paid_price: 40,
            product_main_image:
              'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
            voucher_platform: 0,
            product_detail_url: 'https://www.lazada.co.th/products/i2292225297-s7709407525.html?urlFlag=true&mp=1',
            promised_shipping_time: '',
            warehouse_code: 'dropshipping',
            shipping_type: 'Dropshipping',
            created_at: '2021-04-09 14:41:41 +0700',
            updated_at: '2021-04-09 14:46:54 +0700',
            currency: 'THB',
            shipping_provider_type: 'standard',
            shipping_fee_original: 30,
            is_digital: 0,
            item_price: 40,
            shipping_service_cost: 0,
            tracking_code: '',
            shipping_amount: 30,
            reason_detail: '',
            return_status: '',
            shipment_provider: '',
            voucher_amount: 0,
            digital_delivery_info: '',
            extra_attributes: '',
          },
        ],
      },
    ];
    const orderMarketPlaceAlready = {
      id: 3678,
      pageID: 344,
      purchaseOrderID: 3633,
      status: 'WAITING_FOR_SHIPMENT',
      orderChannel: 'LAZADA',
      orderItemJson: {
        tax_amount: 0,
        reason: '',
        sla_time_stamp: '2021-04-19T23:59:59+07:00',
        purchase_order_id: '',
        voucher_seller: 0,
        voucher_code_seller: '',
        voucher_code: '',
        package_id: '',
        variation: '',
        voucher_code_platform: '',
        purchase_order_number: '',
        sku: 'SKU-RAM1',
        invoice_number: '',
        order_type: 'Normal',
        cancel_return_initiator: '',
        shop_sku: '2292225297_TH-7709407525',
        stage_pay_status: '',
        tracking_code_pre: '',
        order_item_id: 379364035520935,
        shop_id: 'krischaporn reianthipayasakun',
        order_flag: 'NORMAL',
        name: 'RAM WOW',
        order_id: 379364035420935,
        status: 'pending',
        paid_price: 40,
        product_main_image: 'https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg',
        voucher_platform: 0,
        product_detail_url: 'https://www.lazada.co.th/products/i2292225297-s7709407525.html?urlFlag=true&mp=1',
        promised_shipping_time: '',
        warehouse_code: 'dropshipping',
        shipping_type: 'Dropshipping',
        created_at: '2021-04-09 14:41:41 +0700',
        updated_at: '2021-04-09 14:41:48 +0700',
        currency: 'THB',
        shipping_provider_type: 'standard',
        shipping_fee_original: 30,
        is_digital: 0,
        item_price: 40,
        shipping_service_cost: 0,
        tracking_code: '',
        shipping_amount: 30,
        reason_detail: '',
        return_status: '',
        shipment_provider: '',
        voucher_amount: 0,
        digital_delivery_info: '',
        extra_attributes: '',
        quantity: 1,
        canceledQuantity: 0,
        quantityJson: [[Object]],
      },
    };
    const orderChannel = OrderChannelTypes.LAZADA;
    const productDetails = { productID: '504', variantID: '683' };
    const orderItemsParams = {
      purchase_order_id: 3633,
      product_variant_id: '683',
      product_id: '504',
      page_id: 344,
      item_price: 40,
      item_quantity: 1,
      canceled_quantity: 1,
      purchase_status: false,
      order_channel: 'LAZADA',
      sku: 'SKU-RAM1',
      status: 'REJECT',
      discount: 0,
      created_at: '2021-04-09T07:41:41.000Z',
      updated_at: '2021-04-09T07:46:54.000Z',
      canceled_count: 1,
      order_item_json:
        // eslint-disable-next-line max-len
        '{"tax_amount":0,"reason":"เปลี่ยนใจ","sla_time_stamp":"2021-04-19T23:59:59+07:00","purchase_order_id":"","voucher_seller":0,"voucher_code_seller":"","voucher_code":"","package_id":"","variation":"","voucher_code_platform":"","purchase_order_number":"","sku":"SKU-RAM1","invoice_number":"","order_type":"Normal","cancel_return_initiator":"cancellation-customer","shop_sku":"2292225297_TH-7709407525","stage_pay_status":"","tracking_code_pre":"","order_item_id":379364035520935,"shop_id":"krischaporn reianthipayasakun","order_flag":"NORMAL","name":"RAM WOW","order_id":379364035420935,"status":"canceled","paid_price":40,"product_main_image":"https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg","voucher_platform":0,"product_detail_url":"https://www.lazada.co.th/products/i2292225297-s7709407525.html?urlFlag=true&mp=1","promised_shipping_time":"","warehouse_code":"dropshipping","shipping_type":"Dropshipping","created_at":"2021-04-09 14:41:41 +0700","updated_at":"2021-04-09 14:46:54 +0700","currency":"THB","shipping_provider_type":"standard","shipping_fee_original":30,"is_digital":0,"item_price":40,"shipping_service_cost":0,"tracking_code":"","shipping_amount":30,"reason_detail":"","return_status":"","shipment_provider":"","voucher_amount":0,"digital_delivery_info":"","extra_attributes":"","quantity":1,"canceledQuantity":1,"quantityJson":[{"tax_amount":0,"reason":"เปลี่ยนใจ","sla_time_stamp":"2021-04-19T23:59:59+07:00","purchase_order_id":"","voucher_seller":0,"voucher_code_seller":"","voucher_code":"","package_id":"","variation":"","voucher_code_platform":"","purchase_order_number":"","sku":"SKU-RAM1","invoice_number":"","order_type":"Normal","cancel_return_initiator":"cancellation-customer","shop_sku":"2292225297_TH-7709407525","stage_pay_status":"","tracking_code_pre":"","order_item_id":379364035520935,"shop_id":"krischaporn reianthipayasakun","order_flag":"NORMAL","name":"RAM WOW","order_id":379364035420935,"status":"canceled","paid_price":40,"product_main_image":"https://resource.more-commerce.com/staging/b3519c90-0d6b-492b-8f3b-d4f3efa40985/ram-ddr1_b3519c90-0d6b-492b-8f3b-d4f3efa40985_683_1612860047082.jpg","voucher_platform":0,"product_detail_url":"https://www.lazada.co.th/products/i2292225297-s7709407525.html?urlFlag=true&mp=1","promised_shipping_time":"","warehouse_code":"dropshipping","shipping_type":"Dropshipping","created_at":"2021-04-09 14:41:41 +0700","updated_at":"2021-04-09 14:46:54 +0700","currency":"THB","shipping_provider_type":"standard","shipping_fee_original":30,"is_digital":0,"item_price":40,"shipping_service_cost":0,"tracking_code":"","shipping_amount":30,"reason_detail":"","return_status":"","shipment_provider":"","voucher_amount":0,"digital_delivery_info":"","extra_attributes":""}]}',
    };
    const marketPlaceType = SocialTypes.LAZADA;
    const marketPlaceOrderItems = { id: 3678, pageID: 344, purchaseOrderID: 3633, status: 'REJECT', orderChannel: 'LAZADA' };
    mock(plusmarHelpers, 'getCalulateQuantityOrderItems', jest.fn().mockReturnValue(orderItemsWithQuantity));

    mock(data, 'getMarketPlaceOrderItemBySku', jest.fn().mockResolvedValue(orderMarketPlaceAlready));

    mock(data, 'getProductDetailsFromMarketPlaceSku', jest.fn().mockResolvedValue(productDetails));

    mock(plusmarHelpers, 'getLazadaOrderItemsUpdateParams', jest.fn().mockReturnValue(orderItemsParams));

    mock(data, 'createPurchasingOrderItemsMarketPlace', jest.fn().mockResolvedValue(marketPlaceOrderItems));

    await purchaseOrderLazadaService.updatePurchaseOrderItemsFromLazada(pageID, orderID, orderStatus, orderItemsResponse, PlusmarService.writerClient);

    expect(plusmarHelpers.getCalulateQuantityOrderItems).toBeCalledWith(orderItemsResponse);

    expect(data.getMarketPlaceOrderItemBySku).toBeCalledWith(pageID, orderID, orderItemsWithQuantity[0].sku, orderChannel, PlusmarService.readerClient);

    expect(data.getProductDetailsFromMarketPlaceSku).toBeCalledWith({ pageID, marketPlaceSKU: orderItemsWithQuantity[0].sku, marketPlaceType }, PlusmarService.readerClient);

    expect(plusmarHelpers.getLazadaOrderItemsUpdateParams).toBeCalledWith(
      orderID,
      pageID,
      orderStatus,
      orderItemsWithQuantity[0],
      productDetails,
      orderItemsResponse,
      orderMarketPlaceAlready?.orderItemJson,
    );

    expect(data.createPurchasingOrderItemsMarketPlace).toBeCalledWith(PlusmarService.writerClient, orderItemsParams);

    expect(data.updatePurchaseOrderItemsIsQuantityCheck).toBeCalledWith(pageID, marketPlaceOrderItems.id, false, PlusmarService.writerClient);
  });
});
