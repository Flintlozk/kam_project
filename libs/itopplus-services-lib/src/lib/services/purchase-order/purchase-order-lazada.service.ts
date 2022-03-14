import { getUTCDateFromString, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import {
  getCalulateQuantityOrderItems,
  getLazadaOrderItemsUpdateParams,
  getLazadaOrderUpdateParams,
  increaseStatuses,
  LAZADA_API_SUCCESS_CODE,
} from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumPurchaseOrderStatus,
  ILazadaDataResponse,
  ILazadaEnv,
  ILazadaOrderItemsResponse,
  ILazadaOrdersData,
  IOrderRequestParams,
  IPagesThirdParty,
  IPurchaseOrderMarketPlace,
  OrderChannelTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
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
import { getOrderItemsFromLazadaApi, getOrdersFromLazadaApi } from '../product/product-marketplace-lazada-api.service';

export class PurchaseOrderLazadaService {
  constructor() {}

  async getLazadaUpdateAfter(createdAt: Date, pageID: number): Promise<string> {
    const updateAfterDate = (await getLatestCreatedAtMarketPlaceOrderDate(pageID, OrderChannelTypes.LAZADA, PlusmarService.readerClient)) || createdAt;
    return getUTCDateFromString(String(updateAfterDate));
  }

  async getOrdersFromLazadaAndUpdatePurchaseOrders(
    pageID: number,
    accessToken: string,
    orderParams: IOrderRequestParams,
    lazadaEnv: ILazadaEnv,
    clientBatch: Pool,
  ): Promise<IPurchaseOrderMarketPlace[]> {
    try {
      const orders = await getOrdersFromLazadaApi<ILazadaDataResponse<ILazadaOrdersData>>(accessToken, lazadaEnv, orderParams);
      if (orders?.code === LAZADA_API_SUCCESS_CODE) {
        return await this.updatePurchaseOrderFromLazada(pageID, orders.data, clientBatch);
      } else {
        throw new Error('LAZADA_ORDERS_ERROR_AT_API' + JSON.stringify(orders));
      }
    } catch (error) {
      console.log('error getOrdersFromLazadaAndUpdatePurchaseOrders :>> ', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('err in getOrdersFromLazadaAndUpdatePurchaseOrders', error);
      throw new Error(error);
    }
  }

  async getOrdersFromLazadaAndUpdatePurchaseOrdersCron(pageMarketPlaceLazada: IPagesThirdParty[], lazadaEnv: ILazadaEnv, clientBatch: Pool): Promise<void> {
    for (let index = 0; index < pageMarketPlaceLazada?.length; index++) {
      const lazadaMarketPlace = pageMarketPlaceLazada[index];
      const { accessToken, createdAt, pageID } = lazadaMarketPlace;
      const update_after = await this.getLazadaUpdateAfter(createdAt, pageID);
      const marketPlaceOrders = await this.getOrdersFromLazadaAndUpdatePurchaseOrders(pageID, accessToken, { update_after }, lazadaEnv, clientBatch);
      await this.getOrderItemsFromLazadaAndUpdatePurchaseOrderItems(marketPlaceOrders, lazadaMarketPlace, lazadaEnv, clientBatch);
    }
  }

  async getOrderItemsFromLazadaAndUpdatePurchaseOrderItems(
    marketPlaceOrders: IPurchaseOrderMarketPlace[],
    lazadaMarketPlace: IPagesThirdParty,
    lazadaEnv: ILazadaEnv,
    clientBatch: Pool,
  ): Promise<void> {
    for (let index = 0; index < marketPlaceOrders?.length; index++) {
      const marketPlaceOrder = marketPlaceOrders[index];
      const { pageID, marketPlaceOrderID, orderID, status } = marketPlaceOrder;
      const { accessToken } = lazadaMarketPlace;
      const orderItemsResponse = await getOrderItemsFromLazadaApi<ILazadaDataResponse<ILazadaOrderItemsResponse[]>>(accessToken, lazadaEnv, +marketPlaceOrderID);
      if (orderItemsResponse?.code === LAZADA_API_SUCCESS_CODE) {
        await this.updatePurchaseOrderItemsFromLazada(pageID, orderID, status, orderItemsResponse.data, clientBatch);
      } else {
        throw new Error('LAZADA_ORDER_ITEMS_ERROR_AT_API' + JSON.stringify(orderItemsResponse));
      }
    }
  }

  async updatePurchaseOrderFromLazada(pageID: number, ordersReponse: ILazadaOrdersData, clientBatch: Pool): Promise<IPurchaseOrderMarketPlace[]> {
    const { orders } = ordersReponse;
    const marketPlaceOrders = [] as IPurchaseOrderMarketPlace[];
    for (let index = 0; index < orders?.length; index++) {
      const order = orders[index];
      const orderParams = getLazadaOrderUpdateParams(pageID, order);
      const marketOrders = await createPurchasingOrderMarketPlace(clientBatch, orderParams);
      !isEmpty(marketOrders) && marketPlaceOrders.push(marketOrders);
    }
    return marketPlaceOrders;
  }

  async updatePurchaseOrderItemsFromLazada(
    pageID: number,
    orderID: number,
    orderStatus: EnumPurchaseOrderStatus,
    orderItemsResponse: ILazadaOrderItemsResponse[],
    clientBatch: Pool,
  ): Promise<void> {
    const orderItemsWithQuantity = getCalulateQuantityOrderItems(orderItemsResponse);
    const marketPlaceType = SocialTypes.LAZADA;
    const orderChannel = OrderChannelTypes.LAZADA;

    for (let index = 0; index < orderItemsWithQuantity?.length; index++) {
      const orderItem = orderItemsWithQuantity[index];
      const orderMarketPlaceAlready = await getMarketPlaceOrderItemBySku(pageID, orderID, orderItem.sku, orderChannel, PlusmarService.readerClient);
      const isNoNeedToInventoryUpdateQueue = isEmpty(orderMarketPlaceAlready) && increaseStatuses.includes(orderStatus);
      const productDetails = await getProductDetailsFromMarketPlaceSku({ pageID, marketPlaceSKU: orderItem.sku, marketPlaceType }, PlusmarService.readerClient);
      const orderItemsParams = getLazadaOrderItemsUpdateParams(orderID, pageID, orderStatus, orderItem, productDetails, orderItemsResponse, orderMarketPlaceAlready?.orderItemJson);
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
