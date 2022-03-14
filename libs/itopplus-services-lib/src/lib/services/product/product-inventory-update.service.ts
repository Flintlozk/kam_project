import {
  asyncNatsPublisher,
  EnumNatsJobname,
  EnumNatsSupportFeature,
  getJobNameByFeature,
  getProductUpdateInventoryMarketOrderParams,
  getRedisOnRecursive,
  getStreamNameByFeature,
  groupBy,
  isAllowCaptureException,
  natsOnWaitToStartProcess,
  PostgresHelper,
  setRedisOnRecursive,
  triggerNextPublisher,
} from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumProductStatus,
  IncreaseDecreaseType,
  InventoryChannel,
  IProductInventoryCronUpdateInventoryPayload,
  IProductUpateInventoryLazadaOrders,
  IProductUpdateInventory,
  IProductUpdateInventoryQueueItemsPayload,
  IProductUpdateInventoryQueueResponse,
  IProductVariantCurrentInventory,
  IProductVariantIDInventory,
  IProductVariantUpdateInventoryCalcPayload,
  IProductVariantUpdateInventoryMarketPlace,
  IVariantConnectedMarketPlaces,
  OrderChannelTypes,
  PRODUCT_UPDATE_INVENTORY_QUEUE_MAX_RETRY,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { EnumGenericRecursiveStatus, GenericRecursiveMessageType } from '@reactor-room/model-lib';
import * as Sentry from '@sentry/node';
import { uniq } from 'lodash';
import { NatsConnection } from 'nats';
import { Pool } from 'pg';
import { estimateProductsQuantity, getPurchaseOrderItemsToUpdateInventory, updatePurchaseOrderItemsIsQuantityCheck } from '../../data';
import {
  decreaseProductVariantInventory,
  getProductUpdateInventoryQueueItemByQueueID,
  getVariantConnectedMarketPlaces,
  getVariantInventoryByVariantID,
  increaseProductVariantInventory,
  productUpdateInventoryItemQueueInsert,
  productUpdateInventoryQueueInsert,
  updateProductStatus,
  updateProductUpdateInventoryQueueRetry,
  updateProductUpdateInventoryQueueStatus,
  updateProductVariantStatus,
} from '../../data/product/product_inventory_update.data';
import { PagesThirdPartyService } from '../pages/pages-third-party.service';
import { PlusmarService } from '../plusmarservice.class';

export class ProductInventoryUpdateService {
  public pageThirdPartyService: PagesThirdPartyService;

  constructor() {
    this.pageThirdPartyService = new PagesThirdPartyService();
  }

  /* ------------------- V2 ---------------------------------------------------------------------------- */

  async updateProductInventoryV2Publisher(pageID: number, orderID: number, inventory: IProductVariantUpdateInventoryCalcPayload[], subscriptionID: string): Promise<void> {
    // ? u_pdateProductInventoryV2Publisher[1]
    const params = { pageID, orderID, inventory } as IProductUpdateInventory;

    const uniqKey = `${orderID !== null ? orderID : ''}${Date.now()}`;
    const stream = getStreamNameByFeature(EnumNatsSupportFeature.PRODUCT_INVENTORY, pageID);
    const jobName = getJobNameByFeature(EnumNatsJobname.UPDATE_INVENTORY, uniqKey.toString());

    const data = {
      jobName,
      data: params,
    };

    const timeout = 60;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const listener = asyncNatsPublisher(PlusmarService.natsConnection, stream, pageID, data, timeout);
    const handler = this.updateProductInventoryV2SubscriptionWithNats(client, PlusmarService.natsConnection, jobName, params);
    const result = await Promise.all([listener, handler]);

    const handlerResult = result[1];
    if (handlerResult) {
      await PostgresHelper.execBatchCommitTransaction(client);
      return;
    } else {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw new Error('reservedProduct');
    }
  }

  async updateProductInventoryV2SubscriptionWithNats(client: Pool, natsConnection: NatsConnection, jobName: string, params: IProductUpdateInventory) {
    try {
      // ? u_pdateProductInventoryV2Publisher[2]
      const { status } = await natsOnWaitToStartProcess(natsConnection, jobName);
      if (status) {
        await this.updateProductInventoryV2Subscription(client, params);
        triggerNextPublisher(natsConnection, jobName, 'OK');
        return true;
      } else {
        triggerNextPublisher(natsConnection, jobName, 'FAIL');
        return false;
      }
    } catch (ex) {
      triggerNextPublisher(natsConnection, jobName, ex.message);
      return false;
    }
  }

  async updateProductInventoryV2Subscription(client: Pool, params: IProductUpdateInventory): Promise<boolean> {
    // ? u_pdateProductInventoryV2Publisher[3]
    try {
      const { pageID, orderID, inventory: inventories } = params;
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      const setSellingProductIDs = [];
      const setOutOfStockProductIDs = [];

      for (let index = 0; index < inventories.length; index++) {
        const inventory = inventories[index];
        console.log('OPTS', inventory.operationType, ' TO ', inventory.stockToUpdate, ' OF ', inventory.productID, inventory.variantID);

        if (inventory.operationType === IncreaseDecreaseType.INCREASE) {
          const increaseResult = await increaseProductVariantInventory(client, pageID, inventory.productID, inventory.variantID, inventory.stockToUpdate);
          if (increaseResult !== null && increaseResult.inventory > 0 && increaseResult.status === EnumProductStatus.OUT_OF_STOCK) {
            await updateProductVariantStatus(client, pageID, inventory.productID, inventory.variantID, EnumProductStatus.SELLING);
            setSellingProductIDs.push(inventory.productID);
          }
        }

        if (inventory.operationType === IncreaseDecreaseType.DECREASE) {
          const decreaseResult = await decreaseProductVariantInventory(client, pageID, inventory.productID, inventory.variantID, inventory.stockToUpdate);
          if (decreaseResult !== null && decreaseResult.inventory === 0 && decreaseResult.status === EnumProductStatus.SELLING) {
            await updateProductVariantStatus(client, pageID, inventory.productID, inventory.variantID, EnumProductStatus.OUT_OF_STOCK);
            setOutOfStockProductIDs.push(inventory.productID);
          }
        }
      }

      if (setSellingProductIDs.length) {
        const uniq = [...new Set(setSellingProductIDs)];

        for (let index = 0; index < uniq.length; index++) {
          const productID = uniq[index];
          const estimate = await estimateProductsQuantity(client, pageID, productID);
          const isOut = estimate.productStatus === EnumProductStatus.OUT_OF_STOCK;

          if (isOut && estimate.estimated > 0) {
            await updateProductStatus(client, pageID, productID, EnumProductStatus.SELLING);
          }
        }
      }

      if (setOutOfStockProductIDs.length) {
        const uniq = [...new Set(setOutOfStockProductIDs)];

        for (let index = 0; index < uniq.length; index++) {
          const productID = uniq[index];
          const estimate = await estimateProductsQuantity(client, pageID, productID);
          const isSelling = estimate.productStatus === EnumProductStatus.SELLING;

          if (isSelling && estimate.estimated <= 0) {
            await updateProductStatus(client, pageID, productID, EnumProductStatus.OUT_OF_STOCK);
          }
        }
      }

      await PostgresHelper.execBatchCommitTransaction(client);

      if (orderID !== null) await this.updateSubtractStatusOnInventoryChanged(orderID);

      return true;
    } catch (err) {
      console.log('updateProductInventoryV2Subscription error', err);
      return false;
    }
  }

  async calculateProductToUpdate(pageID: number, variantIDInventoryArr: IProductVariantIDInventory[]): Promise<IProductVariantUpdateInventoryCalcPayload[]> {
    const variantIDs = variantIDInventoryArr.map(({ variantID }) => variantID);
    const variantCurrentIDInventories: IProductVariantCurrentInventory[] = await getVariantInventoryByVariantID(variantIDs, pageID, PlusmarService.readerClient);
    const inventoryToUpdate = variantIDInventoryArr.map((variantUpdated) => {
      const { variantID: variantUpdatedID, inventory: variantUpdatedInventory, currentInventory: variantCurrentInventory } = variantUpdated;
      const variantCurrent = variantCurrentIDInventories.find(({ variantID: variantCurrentID }) => variantCurrentID === variantUpdatedID);
      const { productID } = variantCurrent;
      const variantDifference = variantUpdatedInventory - variantCurrentInventory;
      const increaseOrDescrease = variantDifference > 0 ? IncreaseDecreaseType.INCREASE : IncreaseDecreaseType.DECREASE;

      const stockObject = {
        variantID: variantUpdatedID,
        productID,
        operationType: increaseOrDescrease,
        stockToUpdate: Math.abs(variantDifference),
        inventoryChannel: InventoryChannel.MORE_COMMERCE,
      };
      return stockObject;
    });

    return inventoryToUpdate;
  }

  async getProductMarketplaceToUpdate(
    pageID: number,
    variantIDs: number[],
    inventoryToUpdate: IProductVariantUpdateInventoryCalcPayload[],
  ): Promise<{
    lazadaInventory: IProductVariantUpdateInventoryCalcPayload[];
    shopeeInventory: IProductVariantUpdateInventoryCalcPayload[];
  }> {
    const marketPlaceConnected = await getVariantConnectedMarketPlaces(variantIDs, pageID, PlusmarService.readerClient);
    const lazadaInventory = [];
    const shopeeInventory = [];
    if (marketPlaceConnected.length) {
      for (let index = 0; index < marketPlaceConnected.length; index++) {
        const item = marketPlaceConnected[index];
        const moreInventoryCompare = inventoryToUpdate.find((x) => x.variantID === item.variantID);
        const param = {
          variantID: item.variantID,
          productID: item.productID,
          operationType: moreInventoryCompare.operationType,
          stockToUpdate: moreInventoryCompare.stockToUpdate,
          inventoryChannel: InventoryChannel.MORE_COMMERCE,
        };
        if (moreInventoryCompare) {
          if (item.marketPlaceType === SocialTypes.LAZADA) {
            param.inventoryChannel = InventoryChannel.MARKETPLACE_LAZADA;
            lazadaInventory.push(param);
          }
          if (item.marketPlaceType === SocialTypes.SHOPEE) {
            param.inventoryChannel = InventoryChannel.MARKETPLACE_SHOPEE;
            shopeeInventory.push(param);
          }
        }
      }
    }

    return { lazadaInventory, shopeeInventory };
  }

  /* ------------------- V2 ---------------------------------------------------------------------------- */

  async updateProductInventoryPublisher(pageID: number, queueID: number, subscriptionID: string): Promise<void> {
    // ? updateProductInventoryPublisher[1]
    const payload = { pageID, queueID, isRecursion: true, subscriptionID } as IProductInventoryCronUpdateInventoryPayload;

    const uniqKey = Date.now();
    const stream = getStreamNameByFeature(EnumNatsSupportFeature.PRODUCT_INVENTORY, pageID);
    const jobName = getJobNameByFeature(EnumNatsJobname.UPDATE_INVENTORY, uniqKey.toString());
    const data = {
      jobName,
      data: payload,
    };
    const timeout = 60;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const listener = asyncNatsPublisher(PlusmarService.natsConnection, stream, pageID, data, timeout);
    const handler = this.updateProductInventorySubscriptionWithNats(client, PlusmarService.natsConnection, jobName, payload);
    const result = await Promise.all([listener, handler]);

    const handlerResult = result[1];
    if (handlerResult) {
      await PostgresHelper.execBatchCommitTransaction(client);
    } else {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw new Error('reservedProduct');
    }
  }

  async updateProductInventorySubscriptionWithNats(client: Pool, natsConnection: NatsConnection, jobName: string, params: IProductInventoryCronUpdateInventoryPayload) {
    // ? updateProductInventoryPublisher[2]
    try {
      const { status } = await natsOnWaitToStartProcess(natsConnection, jobName);
      if (status) {
        await this.updateProductInventorySubscription(client, params);
        triggerNextPublisher(natsConnection, jobName, 'OK');
        return true;
      } else {
        triggerNextPublisher(natsConnection, jobName, 'FAIL');
        return false;
      }
    } catch (ex) {
      triggerNextPublisher(natsConnection, jobName, ex.message);
      return false;
    }
  }

  async updateProductInventorySubscription(client: Pool, { pageID, queueID, orderID }: IProductInventoryCronUpdateInventoryPayload): Promise<boolean> {
    // ? updateProductInventoryPublisher[3]
    try {
      if (orderID !== null) await this.updateSubtractStatusOnInventoryChanged(orderID); // update subtract order
      return this.checkAndUpdateIfInventoryQueueSuccess(client, { pageID, queueID });
    } catch (error) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      return false;
    }
  }

  async updateSubtractStatusOnInventoryChanged(orderID: number): Promise<void> {
    const redisKey = `${GenericRecursiveMessageType.SUBTRACT}_${orderID}`;
    const redisMessage = await getRedisOnRecursive(PlusmarService.redisClient, redisKey);
    if (redisMessage !== null) {
      setRedisOnRecursive(PlusmarService.redisClient, redisKey, { ...redisMessage, messageStatus: EnumGenericRecursiveStatus.SUCCESS });
    }
  }

  async checkAndUpdateIfInventoryQueueSuccess(client: Pool, { pageID, queueID }: IProductUpdateInventoryQueueResponse): Promise<boolean> {
    const queueItems = await getProductUpdateInventoryQueueItemByQueueID({ pageID, queueID }, client);
    const isAllQueueItemSuccess = !queueItems?.map(({ isSuccess }) => isSuccess).some((success) => !success);
    await updateProductUpdateInventoryQueueStatus(pageID, isAllQueueItemSuccess, queueID, client);
    !isAllQueueItemSuccess && updateProductUpdateInventoryQueueRetry({ pageID, queueID }, client);
    return isAllQueueItemSuccess;
  }

  async getVariantConnectedMarketPlaces(pageID: number, variantIDs: number[]): Promise<IVariantConnectedMarketPlaces[]> {
    const uniqVariantIDs = uniq(variantIDs);
    const marketPlaceConnected = await getVariantConnectedMarketPlaces(uniqVariantIDs, pageID, PlusmarService.readerClient);
    const moreCommerceConnected = uniqVariantIDs.map((variantID) => ({
      variantID,
      productID: 1,
      marketPlaceType: SocialTypes.MORE_COMMERCE,
    }));
    return [...moreCommerceConnected, ...(marketPlaceConnected?.length ? marketPlaceConnected : [])];
  }

  async getProductInventoryCalcPayload(
    pageID: number,
    variantIDInventoryArr: IProductVariantIDInventory[],
    variantIDs: number[],
    orderChannelType: OrderChannelTypes,
  ): Promise<IProductVariantUpdateInventoryCalcPayload[]> {
    const variantCurrentIDInventories: IProductVariantCurrentInventory[] = await getVariantInventoryByVariantID(variantIDs, pageID, PlusmarService.readerClient);
    const inventoryToUpdate = variantIDInventoryArr.map((variantUpdated) => {
      const { variantID: variantUpdatedID, inventory: variantUpdatedInventory } = variantUpdated;
      const variantCurrent = variantCurrentIDInventories.find(({ variantID: variantCurrentID }) => variantCurrentID === variantUpdatedID);
      const { inventory: variantCurrentInventory, productID } = variantCurrent;
      const variantDifference = variantUpdatedInventory - variantCurrentInventory;
      const increaseOrDescrease = variantDifference > 0 ? IncreaseDecreaseType.INCREASE : IncreaseDecreaseType.DECREASE;

      const stockObject = {
        variantID: variantUpdatedID,
        productID,
        operationType: increaseOrDescrease,
        stockToUpdate: orderChannelType === OrderChannelTypes.FACEBOOK_CHAT ? variantUpdated.inventory : Math.abs(variantDifference),
        inventoryChannel: InventoryChannel.MORE_COMMERCE,
      };
      return stockObject;
    });
    return inventoryToUpdate;
  }
  getProductUpdatedProductInventory(currentInventory: number, stockToUpdate: number, operationType: IncreaseDecreaseType): number {
    if (operationType === IncreaseDecreaseType.INCREASE) {
      return currentInventory + stockToUpdate;
    }
    if (operationType === IncreaseDecreaseType.DECREASE) {
      if (stockToUpdate > currentInventory) throw new Error('STOCK_TO_UPDATE_IS_GREATER_THAN_CURRENT_INVENTORY');
      return currentInventory - stockToUpdate;
    }
  }

  // ! PREPARE TO DELETE
  // inventory update from marketplaces like shopee and lazada
  async updateProductInventoryMarketPlace(clientBatch: Pool): Promise<IProductUpdateInventoryQueueResponse[]> {
    const productUpdateInvQueueResponse = [] as IProductUpdateInventoryQueueResponse[];

    const queueResponse = await this.insertProductUpdateInventoryQueueByMarketPlace(clientBatch);

    if (queueResponse) productUpdateInvQueueResponse.push(...queueResponse);
    return productUpdateInvQueueResponse;
  }

  // ! PREPARE TO DELETE
  async insertProductUpdateInventoryQueueByMarketPlace(clientBatch: Pool): Promise<IProductUpdateInventoryQueueResponse[]> {
    try {
      const marketPlaceOrdersToUpdate = await getPurchaseOrderItemsToUpdateInventory(clientBatch);
      const productUpdateInvOrderParams = getProductUpdateInventoryMarketOrderParams(marketPlaceOrdersToUpdate);
      const productUpdateInvQueueResponse = [] as IProductUpdateInventoryQueueResponse[];
      for (let index = 0; index < productUpdateInvOrderParams?.length; index++) {
        const { orderID, pageID, orderItems, orderChannelType } = productUpdateInvOrderParams[index];
        const inventoryQueueResult = await productUpdateInventoryQueueInsert(
          { orderID, pageID, toUpdate: false, maxRetry: PRODUCT_UPDATE_INVENTORY_QUEUE_MAX_RETRY, orderChannelType },
          clientBatch,
        );
        const { id: queueID } = inventoryQueueResult;
        await this.insertProductUpdateInventoryQueueItemByMarketPlace(pageID, queueID, orderItems, clientBatch);
        productUpdateInvQueueResponse.push({ pageID, queueID });
      }
      return productUpdateInvQueueResponse;
    } catch (error) {
      console.log('insertProductUpdateInventoryQueueByMarketPlace :>> ', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    }
  }

  // ! PREPARE TO DELETE
  async insertProductUpdateInventoryQueueItemByMarketPlace(pageID: number, queueID: number, orderItems: IProductUpateInventoryLazadaOrders[], clientBatch: Pool): Promise<void> {
    const variantIDs = orderItems.map(({ variantID }) => variantID);
    const variantInventoryPayloads = orderItems.map(({ variantID, productID, operationType, stockToUpdate }) => ({
      variantID,
      productID,
      operationType,
      stockToUpdate,
      inventoryChannel: InventoryChannel.MARKETPLACE_LAZADA,
    }));
    const variantConnectedMarketPlaces = await this.getVariantConnectedMarketPlaces(pageID, variantIDs);
    const variantInventoryMarketPlaces = this.getMergeVariantInventoryMarketPlace(variantInventoryPayloads, variantConnectedMarketPlaces);
    for (let index = 0; index < variantInventoryMarketPlaces.length; index++) {
      const orderItemPayload: IProductUpdateInventoryQueueItemsPayload = {
        queueID,
        pageID,
        ...variantInventoryMarketPlaces[index],
      };
      await productUpdateInventoryItemQueueInsert(orderItemPayload, clientBatch);
    }

    for (let index = 0; index < orderItems.length; index++) {
      const { purchaseOrderItemID } = orderItems[index];
      const isQuantityCheck = true;
      await updatePurchaseOrderItemsIsQuantityCheck(pageID, purchaseOrderItemID, isQuantityCheck, clientBatch);
    }
  }

  // ! PREPARE TO DELETE
  getMergeVariantInventoryMarketPlace(
    variantInventoryPayloads: IProductVariantUpdateInventoryCalcPayload[],
    variantConnectedMarketPlaces: IVariantConnectedMarketPlaces[],
  ): IProductVariantUpdateInventoryMarketPlace[] {
    const variantInventoryMarketPlaces = [];
    const variantConnectedMarketPlaceGroup = groupBy(variantConnectedMarketPlaces, 'variantID');
    for (const [variantID, variantMarketPlaces] of Object.entries(variantConnectedMarketPlaceGroup)) {
      const variantInventory = variantInventoryPayloads.find((variantInventoryPayload) => variantInventoryPayload.variantID === +variantID);
      variantMarketPlaces.forEach((variantMarketPlace) => {
        const mergedVariantInvMarketPlace = { ...variantMarketPlace, ...variantInventory };
        variantInventoryMarketPlaces.push(mergedVariantInvMarketPlace);
      });
    }
    return variantInventoryMarketPlaces;
  }
}
