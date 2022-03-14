import { environmentLib } from '@reactor-room/environment-services-backend';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import * as plusmarHelpers from '@reactor-room/itopplus-back-end-helpers';
import {
  IPagesThirdParty,
  IPurchaseOrderMarketPlace,
  IShopeeOrderDetailList,
  IShopeeOrderList,
  IShopeeOrdersRequestParams,
  OrderChannelTypes,
  ShopeeOrderDetailsOptionalFieldTypes,
  ShopeeOrdersTimeRangeField,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import * as shopeeApi from '../product/product-marketplace-shopee-api.service';
import { PurchaseOrderShopeeService } from './purchase-order-shopee.service';
jest.mock('../../data');
jest.mock('../product/product-marketplace-shopee-api.service');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');

let purchaseOrderShopeeService = new PurchaseOrderShopeeService();

const shopeeEnv = environmentLib.shopee;
const pageID = 344;
const reader = PlusmarService.readerClient;
const writer = PlusmarService.writerClient;
describe('PurchaseOrderShopeeService tests', () => {
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  beforeEach(() => {
    purchaseOrderShopeeService = new PurchaseOrderShopeeService();
  });

  test('get shopee update after date when order found -> getLazadaUpdateAfter', async () => {
    const createdAt = new Date('2021-04-20T06:24:43.000');
    const updateAfter = new Date('2021-05-11T10:53:44.000');
    const updatedAfterUNIX = 1620730424;
    mock(data, 'getLatestCreatedAtMarketPlaceOrderDate', jest.fn().mockResolvedValue(updateAfter));
    mock(helpers, 'getUTCUnixTimestampByDate', jest.fn().mockReturnValue(updatedAfterUNIX));

    const result = await purchaseOrderShopeeService.getShopeeUpdateAfter(createdAt, pageID);
    expect(result).toEqual(updatedAfterUNIX);
    expect(data.getLatestCreatedAtMarketPlaceOrderDate).toBeCalledWith(pageID, OrderChannelTypes.SHOPEE, reader);
    expect(helpers.getUTCUnixTimestampByDate).toBeCalledWith(updateAfter);
  });

  test('get shopee update after date when order found -> getLazadaUpdateAfter', async () => {
    const createdAt = new Date('2021-04-20T06:24:43.000');
    const createdAtUNIX = 1620730424;
    mock(data, 'getLatestCreatedAtMarketPlaceOrderDate', jest.fn().mockResolvedValue(createdAt));
    mock(helpers, 'getUTCUnixTimestampByDate', jest.fn().mockReturnValue(createdAtUNIX));

    const result = await purchaseOrderShopeeService.getShopeeUpdateAfter(createdAt, pageID);
    expect(result).toEqual(createdAtUNIX);
    expect(data.getLatestCreatedAtMarketPlaceOrderDate).toBeCalledWith(pageID, OrderChannelTypes.SHOPEE, reader);
    expect(helpers.getUTCUnixTimestampByDate).toBeCalledWith(createdAt);
  });

  test('calling get orders from shopee and update -> getOrdersFromShopeeAndUpdatePurchaseOrdersCron', async () => {
    const pageMarketPlaceShopee = [
      {
        id: 197,
        pageID: 344,
        sellerID: '59575129',
        name: 'Geldtonner',
        picture: '',
        url: 'https://shopee.co.th/shop/geldtonner',
        accessToken: '90bbb823ae7e902f9c207d283693bc51',
        accessTokenExpire: '2021-05-12 07:05:01',
        pageType: 'shopee',
        refreshToken: '7abf2cd5102baabd2bafb51ce8386eae',
        refreshTokenExpire: '2021-06-11 03:06:01',
        updatedAt: new Date('2021-05-12T03:10:01.000'),
        createdAt: new Date('2021-04-20T06:24:43.000'),
        payload: '',
      },

      {
        id: 198,
        pageID: 345,
        sellerID: '59575120',
        name: 'Geldtonner1',
        picture: '',
        url: 'https://shopee.co.th/shop/geldtonner1',
        accessToken: '90bbb823ae7e902f9c207d283693bc51',
        accessTokenExpire: '2021-05-12 07:05:01',
        pageType: 'shopee',
        refreshToken: '7abf2cd5102baabd2bafb51ce8386eae',
        refreshTokenExpire: '2021-06-11 03:06:01',
        updatedAt: new Date('2021-05-12T03:10:01.000'),
        createdAt: new Date('2021-04-20T06:24:43.000'),
        payload: '',
      },
    ] as IPagesThirdParty[];

    const { sellerID, createdAt, pageID } = pageMarketPlaceShopee[0];
    const { sellerID: sellerID2, createdAt: createdAt2, pageID: pageID2 } = pageMarketPlaceShopee[1];

    const updatedFrom1 = 1111111;
    const updatedTo1 = 2222222;

    const timeSlots = [
      {
        update_time_from: 1212121,
        update_time_to: 1212121,
      },
      {
        update_time_from: 1212121,
        update_time_to: 1212121,
      },
    ];
    const writer = PlusmarService.writerClient;

    mock(purchaseOrderShopeeService, 'getShopeeUpdateAfter', jest.fn().mockResolvedValue(updatedFrom1));
    mock(helpers, 'getUTCUnixTimestamps', jest.fn().mockReturnValue(updatedTo1));
    mock(helpers, 'getShopeeTwoWeekDateSlots', jest.fn().mockReturnValue(timeSlots));
    mock(purchaseOrderShopeeService, 'getOrdersFromShopeeAndUpdatePurchaseOrders', jest.fn().mockResolvedValue({}));

    await purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrdersCron(pageMarketPlaceShopee, shopeeEnv, writer);

    expect(purchaseOrderShopeeService.getShopeeUpdateAfter).toBeCalledTimes(2);
    expect(helpers.getUTCUnixTimestamps).toBeCalledTimes(2);
    expect(purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrders).toBeCalledTimes(4);

    expect(purchaseOrderShopeeService.getShopeeUpdateAfter).toHaveBeenNthCalledWith(1, createdAt, pageID);
    expect(purchaseOrderShopeeService.getShopeeUpdateAfter).toHaveBeenNthCalledWith(2, createdAt2, pageID2);

    expect(purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrders).toHaveBeenNthCalledWith(
      1,
      pageID,
      +sellerID,
      pageMarketPlaceShopee[0].accessToken,
      timeSlots[0].update_time_from,
      timeSlots[0].update_time_to,
      shopeeEnv,
      writer,
    );
    expect(purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrders).toHaveBeenNthCalledWith(
      2,
      pageID,
      +sellerID,
      pageMarketPlaceShopee[0].accessToken,
      timeSlots[0].update_time_from,
      timeSlots[0].update_time_to,
      shopeeEnv,
      writer,
    );
    expect(purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrders).toHaveBeenNthCalledWith(
      3,
      pageID2,
      +sellerID2,
      pageMarketPlaceShopee[1].accessToken,
      timeSlots[1].update_time_from,
      timeSlots[1].update_time_to,
      shopeeEnv,
      writer,
    );
    expect(purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrders).toHaveBeenNthCalledWith(
      4,
      pageID2,
      +sellerID2,
      pageMarketPlaceShopee[1].accessToken,
      timeSlots[1].update_time_from,
      timeSlots[1].update_time_to,
      shopeeEnv,
      writer,
    );
  });

  test('getting orders from shopee api -> getOrdersFromShopeeAndUpdatePurchaseOrders', async () => {
    const dateSlot2Weeks = [
      { update_time_from: 1618899883, update_time_to: 1620109483 },
      { update_time_from: 1620109483, update_time_to: 1620794898 },
    ];

    const shopeePage = {
      id: 197,
      pageID: 344,
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '90bbb823ae7e902f9c207d283693bc51',
      accessTokenExpire: '2021-05-12 07:05:01',
      pageType: 'shopee',
      refreshToken: '7abf2cd5102baabd2bafb51ce8386eae',
      refreshTokenExpire: '2021-06-11 03:06:01',
      updatedAt: new Date('2021-05-12T03:10:01.000'),
      createdAt: new Date('2021-04-20T06:24:43.000'),
      payload: '',
    };

    const shopID = +shopeePage.sellerID;
    const accessToken = shopeePage.accessToken;

    const payload: IShopeeOrdersRequestParams = {
      time_from: 1618899883,
      time_to: 1620109483,
      time_range_field: ShopeeOrdersTimeRangeField.UPDATE_TIME,
      page_size: 100,
    };
    const shopeeOrderList = [] as IShopeeOrderList[];

    mock(purchaseOrderShopeeService, 'getOrderListRecursive', jest.fn().mockResolvedValue({}));

    mock(purchaseOrderShopeeService, 'getOrderDetailsFromShopeeAndUpdatePurchaseOrders', jest.fn().mockResolvedValue({}));

    await purchaseOrderShopeeService.getOrdersFromShopeeAndUpdatePurchaseOrders(pageID, shopID, accessToken, payload.time_from, payload.time_to, shopeeEnv, writer);

    expect(purchaseOrderShopeeService.getOrderListRecursive).toBeCalledWith(shopID, accessToken, payload, shopeeOrderList, shopeeEnv);

    expect(purchaseOrderShopeeService.getOrderDetailsFromShopeeAndUpdatePurchaseOrders).toBeCalledWith(pageID, shopID, accessToken, shopeeOrderList, shopeeEnv, writer);
  });

  test('get order list recursive -> getOrderListRecursive', async () => {
    const shopeePage = {
      id: 197,
      pageID: 344,
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '90bbb823ae7e902f9c207d283693bc51',
      accessTokenExpire: '2021-05-12 07:05:01',
      pageType: 'shopee',
      refreshToken: '7abf2cd5102baabd2bafb51ce8386eae',
      refreshTokenExpire: '2021-06-11 03:06:01',
      updatedAt: new Date('2021-05-12T03:10:01.000'),
      createdAt: new Date('2021-04-20T06:24:43.000'),
      payload: '',
    };

    const shopID = +shopeePage.sellerID;
    const accessToken = shopeePage.accessToken;
    const payload: IShopeeOrdersRequestParams = {
      time_from: 1618899883,
      time_to: 1620109483,
      time_range_field: ShopeeOrdersTimeRangeField.UPDATE_TIME,
      page_size: 100,
    };
    const shopeeOrderList = [] as IShopeeOrderList[];

    const orderListResponse = {
      more: true,
      next_cursor: '20',
      order_list: [
        {
          order_sn: '201218V2Y6E59M',
        },
        {
          order_sn: '201218V2W2SG1E',
        },
      ],
    };

    mock(shopeeApi, 'getOrdersListFromShopeeApi', jest.fn().mockResolvedValue(orderListResponse));
    mock(purchaseOrderShopeeService, 'getOrderListRecursive', jest.fn().mockResolvedValue({}));
    await purchaseOrderShopeeService.getOrderListRecursive(shopID, accessToken, payload, shopeeOrderList, shopeeEnv);
    expect(purchaseOrderShopeeService.getOrderListRecursive).toBeCalledWith(shopID, accessToken, payload, shopeeOrderList, shopeeEnv);
    expect(purchaseOrderShopeeService.getOrderListRecursive).toBeCalledTimes(1);
  });

  test('getting orders items from shopee api -> getOrderDetailsFromShopeeAndUpdatePurchaseOrders', async () => {
    const shopeeOrders = [
      {
        order_sn: '201218V2Y6E59M',
      },
      {
        order_sn: '201218V2W2SG1E',
      },
      {
        order_sn: '201218V2VJJC70',
      },
    ];

    const shopeePage = {
      id: 197,
      pageID: 344,
      sellerID: '59575129',
      name: 'Geldtonner',
      picture: '',
      url: 'https://shopee.co.th/shop/geldtonner',
      accessToken: '90bbb823ae7e902f9c207d283693bc51',
      accessTokenExpire: '2021-05-12 07:05:01',
      pageType: 'shopee',
      refreshToken: '7abf2cd5102baabd2bafb51ce8386eae',
      refreshTokenExpire: '2021-06-11 03:06:01',
      updatedAt: new Date('2021-05-12T03:10:01.000'),
      createdAt: new Date('2021-04-20T06:24:43.000'),
      payload: '',
    };

    const shopID = +shopeePage.sellerID;
    const accessToken = shopeePage.accessToken;

    const { ITEM_LIST, TOTAL_AMOUNT, ESTIMATED_SHIPPING_FEE } = ShopeeOrderDetailsOptionalFieldTypes;
    const response_optional_fields = `${ITEM_LIST},${TOTAL_AMOUNT},${ESTIMATED_SHIPPING_FEE}`;

    const orderSlots = [shopeeOrders.map(({ order_sn }) => order_sn).join(',')];
    const shopeeOrderDetails = { order_list: [] };

    mock(plusmarHelpers, 'getOrderIDSlots', jest.fn().mockReturnValue(orderSlots));
    mock(helpers, 'getShopeeOrderDetailsResponseFields', jest.fn().mockReturnValue(response_optional_fields));
    mock(shopeeApi, 'getOrderDetailsFromShopeeApi', jest.fn().mockResolvedValue(shopeeOrderDetails));
    mock(purchaseOrderShopeeService, 'updatePurchaseOrderAndItemsFromShopee', jest.fn().mockResolvedValue({}));

    await purchaseOrderShopeeService.getOrderDetailsFromShopeeAndUpdatePurchaseOrders(pageID, shopID, accessToken, shopeeOrders, shopeeEnv, writer);
    expect(plusmarHelpers.getOrderIDSlots).toBeCalledWith(shopeeOrders);
    expect(shopeeApi.getOrderDetailsFromShopeeApi).toBeCalledWith(shopID, accessToken, orderSlots[0], response_optional_fields, shopeeEnv);
    expect(purchaseOrderShopeeService.updatePurchaseOrderAndItemsFromShopee).toBeCalledWith(pageID, shopeeOrderDetails.order_list, writer);
  });

  test('create purchase order and call order items updatePurchaseOrderAndItemsFromShopee', async () => {
    const pageID = 344;
    const recipient_address = {
      town: '',
      city: 'เขตดินแดง',
      name: 'Puneet Kushwah',
      district: '',
      country: 'TH',
      zipcode: '10400',
      full_address: '89 AIA Capital Center 32 Floor, Room 3204-3207, Ratchadaphisek Road เขตดินแดง จังหวัดกรุงเทพมหานคร 10400',
      phone: '66825475131',
      state: 'จังหวัดกรุงเทพมหานคร',
    };
    const shopeeOrderDetails = [
      {
        estimated_shipping_fee: '22',
        update_time: 1618977615,
        message_to_seller: '',
        currency: 'THB',
        create_time: 1618977110,
        note: '',
        credit_card_number: '',
        days_to_ship: 2,
        is_split_up: false,
        ship_by_date: 0,
        plp_number: '',
        escrow_tax: '0',
        tracking_no: '',
        order_status: 'CANCELLED',
        note_update_time: 0,
        fm_tn: '',
        dropshipper_phone: '',
        cancel_reason: '',
        checkout_shipping_carrier: 'Standard Delivery - ส่งธรรมดาในประเทศ',
        recipient_address,
        cancel_by: 'buyer',
        escrow_amount: '492',
        buyer_cancel_reason: '',
        goods_to_declare: false,
        lm_tn: '',
        total_amount: '502',
        service_code: '',
        items: [
          {
            group_id: 0,
            weight: 0.1,
            item_name: 'Camera Adapter Camera Adapter',
            is_wholesale: false,
            promotion_type: '',
            item_sku: 'More-934343',
            variation_discounted_price: '200',
            variation_id: 44999771197,
            variation_name: 'LM to LT',
            is_set_item: false,
            is_add_on_deal: false,
            item_id: 8345300415,
            promotion_id: 0,
            add_on_deal_id: 0,
            variation_quantity_purchased: 2,
            variation_sku: 'SKU-1315314699442',
            variation_original_price: '200',
            is_main_item: false,
            order_item_id: 8345300415,
          },
          {
            group_id: 0,
            weight: 0.1,
            item_name: 'RAM WOW - shopee thailand ',
            is_wholesale: false,
            promotion_type: '',
            item_sku: 'Ram-more',
            variation_discounted_price: '40',
            variation_id: 54999737452,
            variation_name: 'ddr1',
            is_set_item: false,
            is_add_on_deal: false,
            item_id: 9345294835,
            promotion_id: 0,
            add_on_deal_id: 0,
            variation_quantity_purchased: 2,
            variation_sku: 'SKU-RAM1',
            variation_original_price: '40',
            is_main_item: false,
            order_item_id: 9345294835,
          },
        ],
        actual_shipping_cost: '',
        cod: true,
        country: 'TH',
        ordersn: '210421KNUJRW54',
        dropshipper: '',
        is_actual_shipping_fee_confirmed: false,
        buyer_username: 'puneet20',
      },
      {
        estimated_shipping_fee: '22',
        update_time: 1618975807,
        message_to_seller: '',
        currency: 'THB',
        create_time: 1618918524,
        note: '',
        credit_card_number: '',
        days_to_ship: 2,
        is_split_up: false,
        ship_by_date: 1619093125,
        plp_number: '',
        escrow_tax: '0',
        tracking_no: '',
        order_status: 'CANCELLED',
        note_update_time: 0,
        fm_tn: '',
        dropshipper_phone: '',
        cancel_reason: 'Others / change of mind',
        checkout_shipping_carrier: 'Standard Delivery - ส่งธรรมดาในประเทศ',
        recipient_address,
        cancel_by: 'buyer',
        escrow_amount: '923',
        buyer_cancel_reason: 'Others / change of mind',
        goods_to_declare: false,
        lm_tn: '',
        total_amount: '942',
        service_code: '',
        items: [
          {
            group_id: 0,
            weight: 0.1,
            item_name: 'Camera Adapter Camera Adapter',
            is_wholesale: false,
            promotion_type: '',
            item_sku: 'More-934343',
            variation_discounted_price: '200',
            variation_id: 44999771197,
            variation_name: 'LM to LT',
            is_set_item: false,
            is_add_on_deal: false,
            item_id: 8345300415,
            promotion_id: 0,
            add_on_deal_id: 0,
            variation_quantity_purchased: 4,
            variation_sku: 'SKU-1315314699442',
            variation_original_price: '200',
            is_main_item: false,
            order_item_id: 8345300415,
          },
          {
            group_id: 0,
            weight: 0.1,
            item_name: 'RAM WOW - shopee thailand ',
            is_wholesale: false,
            promotion_type: '',
            item_sku: 'Ram-more',
            variation_discounted_price: '40',
            variation_id: 54999737452,
            variation_name: 'ddr1',
            is_set_item: false,
            is_add_on_deal: false,
            item_id: 9345294835,
            promotion_id: 0,
            add_on_deal_id: 0,
            variation_quantity_purchased: 3,
            variation_sku: 'SKU-RAM1',
            variation_original_price: '40',
            is_main_item: false,
            order_item_id: 9345294835,
          },
        ],
        actual_shipping_cost: '',
        cod: true,
        country: 'TH',
        ordersn: '210420HY9PVF8R',
        dropshipper: '',
        is_actual_shipping_fee_confirmed: false,
        buyer_username: 'puneet20',
      },
      {
        estimated_shipping_fee: '22',
        update_time: 1618912025,
        message_to_seller: '',
        currency: 'THB',
        create_time: 1618901190,

        note: '',
        credit_card_number: '',
        days_to_ship: 2,
        is_split_up: false,
        ship_by_date: 1619075791,
        plp_number: '',
        escrow_tax: '0',
        tracking_no: '',
        order_status: 'CANCELLED',
        note_update_time: 0,
        fm_tn: '',
        dropshipper_phone: '',
        cancel_reason: 'Others / change of mind',
        checkout_shipping_carrier: 'Standard Delivery - ส่งธรรมดาในประเทศ',
        recipient_address,
        cancel_by: 'buyer',
        escrow_amount: '2609',
        buyer_cancel_reason: 'Others / change of mind',
        goods_to_declare: false,
        lm_tn: '',
        total_amount: '2662',
        service_code: '',
        items: [
          {
            group_id: 0,
            weight: 0.1,
            item_name: 'RAM WOW - shopee thailand ',
            is_wholesale: false,
            promotion_type: '',
            item_sku: 'Ram-more',
            variation_discounted_price: '40',
            variation_id: 91545450152,
            variation_name: 'ddr1',
            is_set_item: false,
            is_add_on_deal: false,
            item_id: 4586502600,
            promotion_id: 0,
            add_on_deal_id: 0,
            variation_quantity_purchased: 6,
            variation_sku: 'SKU-RAM1',
            variation_original_price: '40',
            is_main_item: false,
            order_item_id: 4586502600,
          },
          {
            group_id: 0,
            weight: 0.1,
            item_name: 'Camera Adapter Camera Adapter',
            is_wholesale: false,
            promotion_type: '',
            item_sku: 'More-934343',
            variation_discounted_price: '800',
            variation_id: 34991954816,
            variation_name: 'LM to LT',
            is_set_item: false,
            is_add_on_deal: false,
            item_id: 7786500437,
            promotion_id: 0,
            add_on_deal_id: 0,
            variation_quantity_purchased: 3,
            variation_sku: 'SKU-1315314699442',
            variation_original_price: '800',
            is_main_item: false,
            order_item_id: 7786500437,
          },
        ],
        actual_shipping_cost: '',
        cod: true,
        country: 'TH',
        ordersn: '210420HF53H9FV',
        dropshipper: '',
        is_actual_shipping_fee_confirmed: false,
        buyer_username: 'puneet20',
      },
    ] as unknown as IShopeeOrderDetailList[];

    const orderParmas = [
      {
        alias_order_id: '210421KNUJRW54',
        total_price: 502,
        page_id: 344,
        created_at: new Date('2021-04-21T03:51:50.000Z'),
        updated_at: new Date('2021-04-21T04:00:15.000Z'),
        discount: 0,
        is_paid: false,
        is_auto: false,
        order_channel: 'SHOPEE',
        status: 'REJECT',
        order_json: '',
      },
      {
        alias_order_id: '210420HY9PVF8R',
        total_price: 942,
        page_id: 344,
        created_at: new Date('2021-04-20T11:35:24.000Z'),
        updated_at: new Date('2021-04-21T03:30:07.000Z'),
        discount: 0,
        is_paid: false,
        is_auto: false,
        order_channel: 'SHOPEE',
        status: 'REJECT',
        order_json: '',
      },
      {
        alias_order_id: '210420HF53H9FV',
        total_price: 2662,
        page_id: 344,
        created_at: new Date('2021-04-20T06:46:30.000Z'),
        updated_at: new Date('2021-04-20T09:47:05.000Z'),
        discount: 0,
        is_paid: false,
        is_auto: false,
        order_channel: 'SHOPEE',
        status: 'REJECT',
        order_json: '',
      },
    ];
    const marketOrders1 = {
      orderID: 9150,
      marketPlaceOrderID: '210421KNUJRW54',
      orderChannel: 'SHOPEE',
      pageID: 344,
      status: 'REJECT',
      createdAt: new Date('2021-04-21T03:51:50.000Z'),
      updatedAt: new Date('2021-04-21T04:00:15.000Z'),
    };

    mock(plusmarHelpers, 'getShopeeOrderUpdateParams', jest.fn().mockReturnValue(orderParmas[0]));
    mock(data, 'createPurchasingOrderMarketPlace', jest.fn().mockResolvedValue(marketOrders1));

    mock(purchaseOrderShopeeService, 'updatePurchaseOrderItemsFromShopee', jest.fn().mockResolvedValue({}));

    await purchaseOrderShopeeService.updatePurchaseOrderAndItemsFromShopee(pageID, shopeeOrderDetails, writer);

    expect(plusmarHelpers.getShopeeOrderUpdateParams).toBeCalledTimes(3);
    expect(data.createPurchasingOrderMarketPlace).toBeCalledTimes(3);
    expect(purchaseOrderShopeeService.updatePurchaseOrderItemsFromShopee).toBeCalledTimes(3);
  });

  test('create purchase order items for shopee updatePurchaseOrderItemsFromShopee', async () => {
    const update_time = 1632631153;
    const create_time = 1632629352;
    const orderItems = [
      {
        item_id: 13514857061,
        item_name: 'Temp product from shopee for everyone 333',
        item_sku: '',
        model_id: 0,
        model_name: '',
        model_sku: '',
        model_quantity_purchased: 3,
        model_original_price: 120,
        model_discounted_price: 120,
        wholesale: false,
        weight: 0.2,
        add_on_deal: false,
        main_item: false,
        add_on_deal_id: 0,
        promotion_type: '',
        promotion_id: 0,
        order_item_id: 13514857061,
        promotion_group_id: 0,
        image_info: { image_url: 'https://cf.shopee.co.th/file/5786e5b4bc8614a062d17f913813d96f_tn' },
      },
    ];
    const marketOrders = {
      orderID: 115472,
      marketPlaceOrderID: '2109269HYKKVCG',
      orderChannel: 'SHOPEE',
      pageID: 344,
      status: 'WAITING_FOR_SHIPMENT',
      createdAt: '2021-09-26T04:09:12.000Z',
      updatedAt: '2021-09-26T04:39:13.000Z',
    } as IPurchaseOrderMarketPlace;
    const orderMarketPlaceAlready = {
      id: 120125,
      pageID: 344,
      purchaseOrderID: 115472,
      status: 'WAITING_FOR_SHIPMENT',
      orderChannel: 'SHOPEE',
      orderItemJson: {
        item_id: 13514857061,
        item_name: 'Temp product from shopee for everyone 333',
        item_sku: '',
        model_id: 0,
        model_name: '',
        model_sku: '',
        model_quantity_purchased: 3,
        model_original_price: 120,
        model_discounted_price: 120,
        wholesale: false,
        weight: 0.2,
        add_on_deal: false,
        main_item: false,
        add_on_deal_id: 0,
        promotion_type: '',
        promotion_id: 0,
        order_item_id: 13514857061,
        promotion_group_id: 0,
        image_info: {
          image_url: 'https://cf.shopee.co.th/file/5786e5b4bc8614a062d17f913813d96f_tn',
        },
      },
    };
    const productDetails = { productID: null, variantID: null };
    const orderItemsParams = {
      purchase_order_id: 115472,
      product_variant_id: null,
      product_id: null,
      page_id: 344,
      item_price: 120,
      item_quantity: 3,
      purchase_status: false,
      order_channel: 'SHOPEE',
      sku: 'SHOPEE-V-ID-13514857061',
      status: 'WAITING_FOR_SHIPMENT',
      discount: 0,
      created_at: new Date('2021-09-26T04:09:12.000Z'),
      updated_at: new Date('2021-09-26T04:39:13.000Z'),
      canceled_quantity: 0,
      canceled_count: 0,
      marketplace_type: 'shopee',
      order_item_json: '',
      marketplace_variant_id: '0',
    };
    const marketPlaceOrderItems = {
      id: 120125,
      pageID: 344,
      purchaseOrderID: 115472,
      status: 'WAITING_FOR_SHIPMENT',
      orderChannel: 'SHOPEE',
    };
    const { orderID } = marketOrders;
    const orderChannel = OrderChannelTypes.SHOPEE;
    const marketPlaceType = SocialTypes.SHOPEE;
    const orderItem = orderItems[0];
    const { item_id } = orderItem;
    const sku = `SHOPEE-V-ID-${item_id}`;
    mock(data, 'getMarketPlaceOrderItemBySku', jest.fn().mockResolvedValue(orderMarketPlaceAlready));
    mock(data, 'getProductDetailsFromMarketPlaceSku', jest.fn().mockResolvedValue(productDetails));
    mock(plusmarHelpers, 'getShopeeCustomVariantID', jest.fn().mockReturnValue(sku));
    mock(plusmarHelpers, 'getShopeeOrderItemsUpdateParams', jest.fn().mockReturnValue(orderItemsParams));
    mock(data, 'createPurchasingOrderItemsMarketPlace', jest.fn().mockResolvedValue(marketPlaceOrderItems));
    await purchaseOrderShopeeService.updatePurchaseOrderItemsFromShopee(pageID, marketOrders, orderItems, create_time, update_time, writer);
    expect(data.getMarketPlaceOrderItemBySku).toBeCalledWith(pageID, orderID, sku, orderChannel, reader);
    expect(data.getProductDetailsFromMarketPlaceSku).toBeCalledWith({ pageID, marketPlaceSKU: sku, marketPlaceType }, reader);
    expect(plusmarHelpers.getShopeeOrderItemsUpdateParams).toBeCalledWith(
      orderID,
      pageID,
      orderItems[0],
      productDetails,
      marketOrders,
      create_time,
      update_time,
      orderMarketPlaceAlready,
    );
    expect(data.createPurchasingOrderItemsMarketPlace).toBeCalledWith(writer, orderItemsParams);
  });
});
