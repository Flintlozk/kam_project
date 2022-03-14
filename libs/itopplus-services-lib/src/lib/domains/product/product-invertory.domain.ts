import {
  IncreaseDecreaseType,
  InventoryChannel,
  IProductCartAction,
  IProductInventoryDifferent,
  IProductVariantUpdateInventoryCalcPayload,
  ProductInCartAction,
  PurchaseOrderItems,
  PurchaseOrderProducts,
} from '@reactor-room/itopplus-model-lib';

export const combineUpdateProductObject = (
  inventoryToUpdate: IProductVariantUpdateInventoryCalcPayload[],
  { lazadaInventory, shopeeInventory }: { lazadaInventory: IProductVariantUpdateInventoryCalcPayload[]; shopeeInventory: IProductVariantUpdateInventoryCalcPayload[] },
): IProductVariantUpdateInventoryCalcPayload[] => {
  if (shopeeInventory.length) inventoryToUpdate = [...inventoryToUpdate, ...shopeeInventory];
  if (lazadaInventory.length) inventoryToUpdate = [...inventoryToUpdate, ...lazadaInventory];

  return inventoryToUpdate;
};

export const getProductUnpaidListToUpdate = (products: PurchaseOrderItems[], type: IncreaseDecreaseType): IProductVariantUpdateInventoryCalcPayload[] => {
  const variantUpdatedIDInventories: IProductVariantUpdateInventoryCalcPayload[] = products
    .map((item) => {
      if (!item.purchase_status) {
        const stockObject = {
          variantID: item.product_variant_id,
          productID: item.product_id,
          operationType: type,
          stockToUpdate: Math.abs(item.item_quantity),
          inventoryChannel: InventoryChannel.MORE_COMMERCE,
        };
        return stockObject;
      }
    })
    .filter((x) => x);

  return variantUpdatedIDInventories;
};
export const getProductListToUpdate = (products: PurchaseOrderItems[], type: IncreaseDecreaseType): IProductVariantUpdateInventoryCalcPayload[] => {
  const variantUpdatedIDInventories: IProductVariantUpdateInventoryCalcPayload[] = products
    .map((item) => {
      if (item.purchase_status) {
        const stockObject = {
          variantID: item.product_variant_id,
          productID: item.product_id,
          operationType: type,
          stockToUpdate: Math.abs(item.item_quantity),
          inventoryChannel: InventoryChannel.MORE_COMMERCE,
        };
        return stockObject;
      }
    })
    .filter((x) => x);

  return variantUpdatedIDInventories;
};
export const getProductMarketplaceListToUpdate = (products: PurchaseOrderItems[], type: IncreaseDecreaseType): IProductVariantUpdateInventoryCalcPayload[] => {
  const variantUpdatedIDInventories: IProductVariantUpdateInventoryCalcPayload[] = products
    .map((item) => {
      if (item.purchase_status) {
        const stockObject = {
          variantID: item.product_variant_id,
          productID: item.product_id,
          operationType: type,
          stockToUpdate: Math.abs(item.item_quantity),
          inventoryChannel: InventoryChannel.MORE_COMMERCE,
        };
        return stockObject;
      }
    })
    .filter((x) => x);

  return variantUpdatedIDInventories;
};
export const getProductInventoryDifferentiation = (orderID: number, products: PurchaseOrderProducts[], inCart: PurchaseOrderItems[]): IProductInventoryDifferent => {
  const createList: IProductCartAction[] = [];
  const increaseList: IProductCartAction[] = [];
  const decreaseList: IProductCartAction[] = [];
  let removeList: IProductCartAction[] = [];

  if (inCart.length > 0) {
    const pendingRemove = inCart.filter((x) => !products.map((product) => product.orderItemId).includes(x.id));
    removeList = pendingRemove.map((product) => {
      return {
        orderID,
        orderItemID: product.id,
        variantID: product.product_variant_id,
        currentQuantity: 0,
        newQuantity: 0,
        action: ProductInCartAction.REMOVE,
      };
    });
  }
  products.map((product) => {
    if (product.orderItemId === null) {
      createList.push({
        orderID,
        productID: product.productId,

        variantID: product.variantId,
        currentQuantity: 0,
        newQuantity: product.quantity,
        action: ProductInCartAction.CREATE,
      });
    } else {
      if (inCart.length > 0) {
        const compareProduct = inCart.find((productInCart) => product.orderItemId === productInCart.id);
        if (compareProduct) {
          if (product.quantity > compareProduct.item_quantity)
            increaseList.push({
              orderID,
              variantID: product.variantId,
              orderItemID: product.orderItemId,
              currentQuantity: compareProduct.item_quantity,
              newQuantity: product.quantity,
              action: ProductInCartAction.INCREASE,
            });
          if (product.quantity < compareProduct.item_quantity)
            decreaseList.push({
              orderID,
              variantID: product.variantId,
              orderItemID: product.orderItemId,
              currentQuantity: compareProduct.item_quantity,
              newQuantity: product.quantity,
              action: ProductInCartAction.DECREASE,
            });
        }
      }
    }
  });

  return {
    createList,
    increaseList,
    decreaseList,
    removeList,
  };
};
