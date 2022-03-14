import { getShopeeOrderDetailsResponseFields, getShopeeTwoWeekDateSlots, getUTCUnixTimestampByDate, getUTCUnixTimestamps, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import { getOrderIDSlots, getShopeeCustomVariantID, getShopeeOrderItemsUpdateParams, getShopeeOrderUpdateParams, increaseStatuses } from '@reactor-room/itopplus-back-end-helpers';
import {
  IPagesThirdParty,
  IPurchaseOrderMarketPlace,
  IShopeeEnv,
  IShopeeOrderDetailItems,
  IShopeeOrderDetailList,
  IShopeeOrderList,
  IShopeeOrdersRequestParams,
  OrderChannelTypes,
  ShopeeOrdersTimeRangeField,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import {
  createPurchasingOrderItemsMarketPlace,
  createPurchasingOrderMarketPlace,
  getLatestCreatedAtMarketPlaceOrderDate,
  getMarketPlaceOrderItemBySku,
  getProductDetailsFromMarketPlaceSku,
  updatePurchaseOrderItemsIsQuantityCheck,
} from '../../data';
import { PlusmarService } from '../plusmarservice.class';
import { getOrderDetailsFromShopeeApi, getOrdersListFromShopeeApi } from '../product/product-marketplace-shopee-api.service';

const SHOPEE_ORDER_PAGE_SIZE = 100;

export class PurchaseOrderShopeeService {
  constructor() {}

  async getShopeeUpdateAfter(createdAt: Date, pageID: number): Promise<number> {
    const updateAfterDate: Date = (await getLatestCreatedAtMarketPlaceOrderDate(pageID, OrderChannelTypes.SHOPEE, PlusmarService.readerClient)) || createdAt;
    return getUTCUnixTimestampByDate(updateAfterDate);
  }

  async getOrdersFromShopeeAndUpdatePurchaseOrdersCron(pageMarketPlaceShopee: IPagesThirdParty[], shopeeEnv: IShopeeEnv, clientBatch: Pool): Promise<void> {
    for (let index = 0; index < pageMarketPlaceShopee?.length; index++) {
      const shopeeMarketPlace = pageMarketPlaceShopee[index];
      const { sellerID, createdAt, pageID, accessToken } = shopeeMarketPlace;
      const update_time_from = await this.getShopeeUpdateAfter(createdAt, pageID);
      const update_time_to = getUTCUnixTimestamps();
      const timeSlots = getShopeeTwoWeekDateSlots({ update_time_from, update_time_to });
      for (let index = 0; index < timeSlots?.length; index++) {
        const { update_time_from: time_from, update_time_to: time_to } = timeSlots[index];
        await this.getOrdersFromShopeeAndUpdatePurchaseOrders(pageID, +sellerID, accessToken, time_from, time_to, shopeeEnv, clientBatch);
      }
    }
  }

  async getOrdersFromShopeeAndUpdatePurchaseOrders(
    pageID: number,
    shopID: number,
    accessToken: string,
    time_from: number,
    time_to: number,
    shopeeEnv: IShopeeEnv,
    clientBatch: Pool,
  ): Promise<void> {
    const payload: IShopeeOrdersRequestParams = {
      time_from,
      time_to,
      time_range_field: ShopeeOrdersTimeRangeField.UPDATE_TIME,
      page_size: SHOPEE_ORDER_PAGE_SIZE,
    };

    const shopeeOrderList = [] as IShopeeOrderList[];
    await this.getOrderListRecursive(shopID, accessToken, payload, shopeeOrderList, shopeeEnv);
    await this.getOrderDetailsFromShopeeAndUpdatePurchaseOrders(pageID, shopID, accessToken, shopeeOrderList, shopeeEnv, clientBatch);
  }

  async getOrderListRecursive(shopID: number, accessToken: string, payload: IShopeeOrdersRequestParams, shopeeOrderList: IShopeeOrderList[], shopeeEnv: IShopeeEnv): Promise<void> {
    const orderList = await getOrdersListFromShopeeApi(shopID, accessToken, payload, shopeeEnv);
    if (!isEmpty(orderList)) {
      const { order_list, more, next_cursor } = orderList;
      shopeeOrderList.push(...order_list);
      if (more) {
        payload = { ...payload, cursor: next_cursor };
        await this.getOrderListRecursive(shopID, accessToken, payload, shopeeOrderList, shopeeEnv);
      }
    }
  }

  async getOrderDetailsFromShopeeAndUpdatePurchaseOrders(
    pageID: number,
    shopID: number,
    accessToken: string,
    shopeeOrders: IShopeeOrderList[],
    shopeeEnv: IShopeeEnv,
    clientBatch: Pool,
  ): Promise<void> {
    const orderSlots = getOrderIDSlots(shopeeOrders);
    const response_optional_fields = getShopeeOrderDetailsResponseFields();
    for (let index = 0; index < orderSlots.length; index++) {
      const orderSlot = orderSlots[index];
      const { order_list } = await getOrderDetailsFromShopeeApi(shopID, accessToken, orderSlot, response_optional_fields, shopeeEnv);
      await this.updatePurchaseOrderAndItemsFromShopee(pageID, order_list, clientBatch);
    }
  }

  async updatePurchaseOrderAndItemsFromShopee(pageID: number, shopeeOrderDetails: IShopeeOrderDetailList[], clientBatch: Pool): Promise<void> {
    for (let index = 0; index < shopeeOrderDetails.length; index++) {
      const order = shopeeOrderDetails[index];
      const orderParmas = getShopeeOrderUpdateParams(pageID, order);
      const marketOrders = await createPurchasingOrderMarketPlace(clientBatch, orderParmas);
      const { item_list, create_time, update_time } = order;
      await this.updatePurchaseOrderItemsFromShopee(pageID, marketOrders, item_list, create_time, update_time, clientBatch);
    }
  }

  async updatePurchaseOrderItemsFromShopee(
    pageID: number,
    marketOrders: IPurchaseOrderMarketPlace,
    orderItems: IShopeeOrderDetailItems[],
    create_time: number,
    update_time: number,
    clientBatch: Pool,
  ): Promise<void> {
    const orderChannel = OrderChannelTypes.SHOPEE;
    const marketPlaceType = SocialTypes.SHOPEE;
    const { orderID, status } = marketOrders;
    for (let index = 0; index < orderItems.length; index++) {
      const orderItem = orderItems[index];
      const { model_id, item_id } = orderItem;
      const sku = model_id ? String(model_id) : getShopeeCustomVariantID(item_id);
      const orderMarketPlaceAlready = await getMarketPlaceOrderItemBySku(pageID, orderID, sku, orderChannel, PlusmarService.readerClient);
      const isNoNeedToInventoryUpdateQueue = isEmpty(orderMarketPlaceAlready) && increaseStatuses.includes(status);
      const productDetails = await getProductDetailsFromMarketPlaceSku({ pageID, marketPlaceSKU: sku, marketPlaceType }, PlusmarService.readerClient);
      const orderItemsParams = getShopeeOrderItemsUpdateParams(orderID, pageID, orderItem, productDetails, marketOrders, create_time, update_time, orderMarketPlaceAlready);
      const marketPlaceOrderItems = await createPurchasingOrderItemsMarketPlace(clientBatch, orderItemsParams);
      const { id } = marketPlaceOrderItems;
      if (orderItemsParams.canceled_count) {
        const isQuantityCheck = false;
        await updatePurchaseOrderItemsIsQuantityCheck(pageID, id, isQuantityCheck, clientBatch);
      }
      isNoNeedToInventoryUpdateQueue && (await updatePurchaseOrderItemsIsQuantityCheck(pageID, id, isNoNeedToInventoryUpdateQueue, clientBatch));
    }
  }
}
