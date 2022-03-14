import {
  asyncNatsPublisher,
  EnumNatsJobname,
  EnumNatsSupportFeature,
  getJobNameByFeature,
  getStreamNameByFeature,
  getUTCDayjs,
  natsOnWaitToStartProcess,
  PostgresHelper,
  triggerNextPublisher,
} from '@reactor-room/itopplus-back-end-helpers';
import {
  CheckProductsAvaliable,
  IFacebookPipelineModel,
  IncreaseDecreaseType,
  IProductCartAction,
  IProductCheckList,
  IProductInventoryCronPayload,
  IProductInventoryCronUpdateCartPayload,
  ProductInCartAction,
  PurchaseOrderProducts,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { NatsConnection } from 'nats';
import { Pool } from 'pg';
import {
  checkItemsAvaliableByIDs,
  createPurchasingOrderItems,
  deletePurchaseOrderItems,
  getOrderItemList,
  getProductVariantsGroup,
  getPurchasingOrderItems,
  getUnpaidProductByPurchaseOrderID,
  getUnreservedProductByPurchaseOrderID,
  getVariantByID,
  reservedPurchaseOrderItem,
  singleUpdatePurchaseOrderItemStatus,
  updateProductReserveExpiration,
  updatePurchasingOrderItems,
  updatePurchasingTotalPrice,
} from '../../data';
import { combineUpdateProductObject, getProductInventoryDifferentiation, getProductUnpaidListToUpdate } from '../../domains/product/product-invertory.domain';
import { InsufficientProductSupply, InsufficientReseveProduct } from '../../errors';
import { PipelineService } from '../pipeline/pipeline.service';
import { PlusmarService } from '../plusmarservice.class';
import { PurchaseOrderFailedService } from '../purchase-order/purchase-order-failed.service';
import { ProductInventoryUpdateService } from './product-inventory-update.service';
import { ProductMarketPlaceService } from './product-marketplace.service';

export class ProductInventoryService {
  productInventoryUpdateService: ProductInventoryUpdateService;
  purchaseOrderFailedService: PurchaseOrderFailedService;
  productMarketPlaceService: ProductMarketPlaceService;
  pipelineService: PipelineService;
  constructor() {
    this.productInventoryUpdateService = new ProductInventoryUpdateService();
    this.purchaseOrderFailedService = new PurchaseOrderFailedService();
    this.productMarketPlaceService = new ProductMarketPlaceService();
    this.pipelineService = new PipelineService();
  }
  async updatePurchasingTotalPrice(Client: Pool = PlusmarService.writerClient, pageID: number, orderID: number): Promise<number> {
    const orderItems = await getOrderItemList(Client, pageID, orderID);
    let totalPrice = 0;
    orderItems.forEach((item) => {
      totalPrice += item.item_price * item.item_quantity;
    });
    await updatePurchasingTotalPrice(Client, totalPrice, pageID, orderID);
    return totalPrice;
  }

  async checkReservedProductInventory(pageID: number, orderID: number, audienceID: number): Promise<void> {
    const insufficient = await this.checkInsufficientProductInCart(pageID, orderID, audienceID);
    if (insufficient.length > 0) {
      throw new InsufficientReseveProduct('INSUFFICIENT_SUPPLY');
    }
  }

  async checkActualProductInventory(pageID: number, orderID: number, audienceID: number): Promise<void> {
    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, orderID);
    const checklist = this.getChecklist(products);
    const listID = checklist.map((item) => Number(item.variantID)) as [number];
    const items = await getProductVariantsGroup(PlusmarService.readerClient, pageID, listID);

    for (let idx = 0; idx < checklist.length; idx++) {
      const variant = checklist[idx];
      if (!variant.isSold) {
        const filter = items.filter((item) => variant.variantID === item.id);
        if (filter[0].inventory < variant.quantity) {
          throw new InsufficientProductSupply('OUT_OF_STOCK');
        }
      }
    }
  }

  async checkInsufficientProductInCart(pageID: number, orderID: number, audienceID: number): Promise<number[]> {
    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, orderID);
    const { checklist, items } = await this.listProductsInCart(products, pageID);
    const InsufficientID = [];

    for (let idx = 0; idx < checklist.length; idx++) {
      const variant = checklist[idx];
      const filter = items.find((item) => variant.variantID === item.id);
      if (filter.inventory < variant.quantity) {
        InsufficientID.push(variant.variantID);
      }
    }
    return InsufficientID;
  }

  async checkOrderItemsAvaliable(pageID: number, audienceID: number): Promise<void> {
    // TODO : Unused function, prepared to delete
    const pipeline = await this.pipelineService.checkPurchaseOrderPipelineByAudienceID(pageID, audienceID);
    const { order_id: orderID } = pipeline;

    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, orderID);
    const { checklist, items } = await this.listProductsInCart(products, pageID);

    for (let idx = 0; idx < checklist.length; idx++) {
      const variant = checklist[idx];
      const filter = items.find((item) => variant.variantID === item.id);
      if (filter.inventory < variant.quantity) {
        throw new InsufficientProductSupply('OUT_OF_STOCK');
      }
    }
    return;
  }

  async listProductsInCart(
    products: PurchaseOrderProducts[],
    pageID: number,
  ): Promise<{
    checklist: IProductCheckList[];
    items: CheckProductsAvaliable[];
  }> {
    if (products?.length === 0) return { checklist: [], items: [] };
    const checklist = this.getChecklist(products);
    const listID = checklist.map((item) => Number(item.variantID)) as [number];
    const items = await checkItemsAvaliableByIDs(PlusmarService.readerClient, pageID, listID);
    return {
      checklist,
      items,
    };
  }

  getChecklist(products: PurchaseOrderProducts[]): IProductCheckList[] {
    const checklist = [] as IProductCheckList[];
    for (let i = 0; i < products.length; i++) {
      const item = products[i];
      checklist.push({
        productID: item.orderItemId,
        variantID: item.variantId,
        quantity: item.quantity,
        isSold: item.isSold,
      });
    }
    return checklist;
  }

  async checkProductInCart(pipeline: IFacebookPipelineModel, variantId: number, quantity: number): Promise<void> {
    const { page_id: pageID, audience_id: audienceID, order_id: orderID } = pipeline;
    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, orderID);
    if (isEmpty(products)) {
      return;
    }

    const { checklist, items } = (await this.listProductsInCart(products, pageID)) || {};
    let variantCartInventory = checklist.find(({ variantID }) => variantID === variantID)?.quantity;
    const variantInventory = items.find(({ id }) => id === variantId)?.inventory;

    variantCartInventory = variantCartInventory ? variantCartInventory : 0;

    if (quantity > variantInventory || quantity > variantCartInventory) {
      const variantData = await getVariantByID(pageID, variantId, PlusmarService.readerClient);

      if (isEmpty(variantData) || +variantData?.inventory === 0) {
        throw new Error('Product cannot be added as the product is out of stock or not available');
      }

      const variantName = `${variantData?.productName} (${variantData?.attributeName})`;
      this.handleMaxInventoryReachedError(variantCartInventory, quantity, variantInventory, variantName);
    }
  }

  async isProductVariantAvailable(pageId: number, variantId: number, quantity: number): Promise<void> {
    const variantData = await getVariantByID(pageId, variantId, PlusmarService.readerClient);
    if (isEmpty(variantData) || +variantData?.inventory === 0) {
      throw new Error('Product cannot be added as the product is out of stock or not available');
    }

    const variantName = `${variantData?.productName} (${variantData?.attributeName})`;

    if (quantity > variantData.inventory) {
      this.handleMaxInventoryReachedError(0, quantity, variantData.inventory, variantName);
    }
  }

  handleMaxInventoryReachedError(variantCartInventory: number, quantity: number, variantInventory: number, variantName: string): void {
    const inventoryAvailableSlot = variantInventory - variantCartInventory;
    let leftInventoryMessage = '';
    inventoryAvailableSlot > 0 ? (leftInventoryMessage = `Items available in stock - ${inventoryAvailableSlot} `) : (leftInventoryMessage = 'No more items available');
    const errorMessage = `Error: Not able to add ${variantName} - ${quantity} items. ${leftInventoryMessage}`;
    throw new Error(errorMessage);
  }

  async updatePurchaseCart(products: PurchaseOrderProducts[], pageID: number, orderID: number, audienceID: number, subscriptionID: string): Promise<void> {
    // ? updatePurchaseCart[1]
    let isThereAreReservedProduct = false;
    const inCart = await getOrderItemList(PlusmarService.readerClient, pageID, orderID);
    if (inCart.length > 0) {
      const reserveItem = inCart.filter((item) => item.is_reserve);
      isThereAreReservedProduct = reserveItem.length > 0;
    }

    const different = getProductInventoryDifferentiation(orderID, products, inCart);
    const payload = { pageID, orderID, audienceID, different, isRecursion: true, subscriptionID } as IProductInventoryCronPayload;

    if (isThereAreReservedProduct) {
      const { createList: CREATE, increaseList: INCREASE } = different;
      await Promise.all([this.checkSupplyBeforeUpdateProductInCart(CREATE, pageID), this.checkSupplyBeforeUpdateProductInCart(INCREASE, pageID)]);

      const uniqKey = `${orderID !== null ? orderID : ''}${audienceID}`;
      const stream = getStreamNameByFeature(EnumNatsSupportFeature.PRODUCT_INVENTORY, pageID);
      const jobName = getJobNameByFeature(EnumNatsJobname.RESERVE_INVENTORY, uniqKey.toString());
      const data = {
        jobName,
        data: payload,
      };

      const timeout = 60;
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const listener = asyncNatsPublisher(PlusmarService.natsConnection, stream, pageID, data, timeout);
      const handler = this.updatePurchaseCartSubscriptionWithNats(client, PlusmarService.natsConnection, jobName, payload);
      const result = await Promise.all([listener, handler]);

      const handlerResult = result[1];
      if (handlerResult) {
        await PostgresHelper.execBatchCommitTransaction(client);
      } else {
        await PostgresHelper.execBatchRollbackTransaction(client);
        throw new Error('updatePurchaseCartFail');
      }
    } else {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await this.updatePurchaseCartSubscription(client, payload);
      await PostgresHelper.execBatchCommitTransaction(client);
    }
  }

  async updatePurchaseCartSubscriptionWithNats(client: Pool, natsConnection: NatsConnection, jobName: string, params: IProductInventoryCronUpdateCartPayload): Promise<boolean> {
    try {
      // ? updatePurchaseCart[2]
      const timeout = 60;
      const { status } = await natsOnWaitToStartProcess(natsConnection, jobName, timeout);
      if (status) {
        await this.updatePurchaseCartSubscription(client, params);
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

  async updatePurchaseCartSubscription(client: Pool, { pageID, orderID, audienceID, different }: IProductInventoryCronUpdateCartPayload): Promise<void> {
    // ? updatePurchaseCart[3]
    // # requested by Plusmar-Cron-job after cart are reserved
    const { createList: CREATE, increaseList: INCREASE, decreaseList: DECREASE, removeList: REMOVE } = different;
    await Promise.all([this.checkSupplyBeforeUpdateProductInCart(CREATE, pageID), this.checkSupplyBeforeUpdateProductInCart(INCREASE, pageID)]);

    if (!isEmpty(CREATE)) await this.updateCartOnActionDefined(client, pageID, orderID, audienceID, CREATE);
    if (!isEmpty(INCREASE)) await this.updateCartOnActionDefined(client, pageID, orderID, audienceID, INCREASE);
    if (!isEmpty(DECREASE)) await this.updateCartOnActionDefined(client, pageID, orderID, audienceID, DECREASE);
    if (!isEmpty(REMOVE)) await this.updateCartOnActionDefined(client, pageID, orderID, audienceID, REMOVE);
    await this.updatePurchasingTotalPrice(client, pageID, orderID);
  }

  async reservedProduct(orderID: number, pageID: number, audienceID: number, subscriptionID: string): Promise<boolean> {
    // ? reservedProduct[1]
    const checkResult = await getUnreservedProductByPurchaseOrderID(PlusmarService.readerClient, pageID, orderID, audienceID);
    if (isEmpty(checkResult)) {
      return true;
    }

    const payload: IProductInventoryCronPayload = { pageID, orderID, audienceID, isRecursion: true, subscriptionID };

    const uniqKey = `${orderID !== null ? orderID : ''}${audienceID}`;
    const stream = getStreamNameByFeature(EnumNatsSupportFeature.PRODUCT_INVENTORY, pageID);
    const jobName = getJobNameByFeature(EnumNatsJobname.RESERVE_INVENTORY, uniqKey.toString());
    const data = {
      jobName,
      data: payload,
    };

    const timeout = 60;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const listener = asyncNatsPublisher(PlusmarService.natsConnection, stream, pageID, data, timeout);
    const handler = this.reservedStockSubscriptionWithNats(client, PlusmarService.natsConnection, jobName, payload);
    const result = await Promise.all([listener, handler]);

    const handlerResult = result[1];
    if (handlerResult) {
      await PostgresHelper.execBatchCommitTransaction(client);
    } else {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw new Error('reservedProduct');
    }
  }

  async reservedStockSubscriptionWithNats(client: Pool, natsConnection: NatsConnection, jobName: string, params: IProductInventoryCronPayload) {
    // ? reservedProduct[2]
    try {
      const { status } = await natsOnWaitToStartProcess(natsConnection, jobName);
      if (status) {
        await this.reservedStockSubscription(client, params);
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

  async reservedStockSubscription(client: Pool, { pageID, orderID, audienceID }: IProductInventoryCronPayload): Promise<void> {
    // ? reservedProduct[3]
    await this.checkReservedProductInventory(pageID, orderID, audienceID);

    const expiredIn = PlusmarService.environment.cronJobConfig.reservedProductExpireInHour;
    const expiredAt = getUTCDayjs().add(expiredIn, 'hour');
    await updateProductReserveExpiration(client, expiredAt, orderID, pageID, audienceID);
    await reservedPurchaseOrderItem(client, pageID, orderID);
  }

  async subtractProduct(pageID: number, orderID: number, audienceID: number, subscriptionID: string): Promise<boolean> {
    const checkResult = await getUnpaidProductByPurchaseOrderID(PlusmarService.readerClient, pageID, orderID, audienceID);
    if (isEmpty(checkResult)) {
      return true;
    }
    const productList = getProductUnpaidListToUpdate(checkResult, IncreaseDecreaseType.DECREASE);
    const variantIDs = productList.map((item) => item.variantID);
    const updateProducts = combineUpdateProductObject(productList, await this.productInventoryUpdateService.getProductMarketplaceToUpdate(pageID, variantIDs, productList));

    await this.productInventoryUpdateService.updateProductInventoryV2Publisher(pageID, orderID, updateProducts, subscriptionID);

    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    await this.setPurchaseOrderItemsToSold(pageID, orderID, audienceID, client);
    await PostgresHelper.execBatchCommitTransaction(PlusmarService.writerClient);
  }

  async setPurchaseOrderItemsToSold(pageID: number, orderID: number, audienceID: number, Client: Pool = PlusmarService.writerClient): Promise<void> {
    const products = await getPurchasingOrderItems(PlusmarService.readerClient, pageID, audienceID, orderID);
    const checklist = this.getChecklist(products);
    for (let i = 0; i < checklist.length; i++) {
      const item = checklist[i];
      if (!item.isSold) {
        await singleUpdatePurchaseOrderItemStatus(Client, pageID, orderID, item.variantID);
      }
    }
  }

  async checkSupplyBeforeUpdateProductInCart(products: IProductCartAction[], pageID: number): Promise<void> {
    const variantIDs = products.map((product) => product.variantID);

    if (variantIDs.length) {
      const items = await checkItemsAvaliableByIDs(PlusmarService.readerClient, pageID, variantIDs);

      for (let index = 0; index < products.length; index++) {
        const product = products[index];
        const filter = items.find((item) => product.variantID === item.id);
        if (filter.inventory + product.currentQuantity < product.newQuantity) throw new InsufficientProductSupply('NOT_ENOUGH');
      }
    }
  }

  async updateCartOnActionDefined(client: Pool = PlusmarService.writerClient, pageID: number, orderID: number, audienceID: number, products: IProductCartAction[]): Promise<void> {
    for (let index = 0; index < products.length; index++) {
      const { variantID, orderItemID, productID, newQuantity, action: ACTION } = products[index];
      switch (ACTION) {
        case ProductInCartAction.CREATE:
          await createPurchasingOrderItems(client, orderID, variantID, newQuantity, pageID, audienceID, productID);
          break;
        case ProductInCartAction.DECREASE:
          await updatePurchasingOrderItems(client, orderID, variantID, newQuantity, orderItemID, pageID);
          break;
        case ProductInCartAction.INCREASE:
          await updatePurchasingOrderItems(client, orderID, variantID, newQuantity, orderItemID, pageID);
          break;
        case ProductInCartAction.REMOVE:
          await deletePurchaseOrderItems(client, orderID, orderItemID, pageID);
          break;
        default:
      }
    }
  }
}
