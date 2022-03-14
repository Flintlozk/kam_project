import { getProductInventoryDifferentiation } from './product-invertory.domain';
import { ProductInCartAction, PurchaseOrderItems, PurchaseOrderProducts } from '@reactor-room/itopplus-model-lib';

describe('getProductInventoryDifferentiation()', () => {
  test('Should Return as expected result', () => {
    const mockInCart = [
      {
        id: 1860,
        purchase_order_id: 1479,
        product_variant_id: 702,
        product_id: 510,
        page_id: 91,
        audience_id: 3526,
        item_price: '100.00',
        item_quantity: 49,
        purchase_status: false,
        created_at: '2021-03-16T04:10:45.674Z',
        updated_at: '2021-03-16T20:30:34.000Z',
        is_reserve: true,
        discount: 0,
      },
      {
        id: 1862,
        purchase_order_id: 1479,
        product_variant_id: 703,
        product_id: 510,
        page_id: 91,
        audience_id: 3526,
        item_price: '120.00',
        item_quantity: 10,
        purchase_status: false,
        created_at: '2021-03-16T20:30:34.859Z',
        updated_at: '2021-03-16T20:30:34.859Z',
        is_reserve: false,
        discount: 0,
      },
      {
        id: 1863,
        purchase_order_id: 1479,
        product_variant_id: 704,
        product_id: 510,
        page_id: 91,
        audience_id: 3526,
        item_price: '140.00',
        item_quantity: 10,
        purchase_status: false,
        created_at: '2021-03-16T20:30:34.958Z',
        updated_at: '2021-03-16T20:30:34.958Z',
        is_reserve: false,
        discount: 0,
      },
    ] as unknown as PurchaseOrderItems[];

    const mockProducts = [
      {
        orderItemId: 1860,
        variantId: 702,
        unitPrice: 100,
        quantity: 53,
        caution: [],
        inventory: 51,
      },
      {
        orderItemId: 1862,
        variantId: 703,
        unitPrice: 120,
        quantity: 5,
        caution: [],
        inventory: 100,
      },
      {
        orderItemId: null,
        variantId: 497,
        productId: 378,
        unitPrice: 35,
        quantity: 1,
        caution: [],
        inventory: 100,
      },
    ] as PurchaseOrderProducts[];

    const orderId = 1479;

    const { createList, decreaseList, increaseList, removeList } = getProductInventoryDifferentiation(orderId, mockProducts, mockInCart);
    expect(createList).toStrictEqual([
      {
        orderID: 1479,
        productID: 378,
        variantID: 497,
        currentQuantity: 0,
        newQuantity: 1,
        action: ProductInCartAction.CREATE,
      },
    ]);

    expect(decreaseList).toStrictEqual([
      {
        orderID: 1479,
        orderItemID: 1862,
        currentQuantity: 10,
        newQuantity: 5,
        variantID: 703,
        action: ProductInCartAction.DECREASE,
      },
    ]);
    expect(increaseList).toStrictEqual([
      {
        orderID: 1479,
        orderItemID: 1860,
        currentQuantity: 49,
        newQuantity: 53,
        variantID: 702,
        action: ProductInCartAction.INCREASE,
      },
    ]);
    expect(removeList).toStrictEqual([
      {
        orderID: 1479,
        orderItemID: 1863,
        currentQuantity: 0,
        newQuantity: 0,
        variantID: 704,
        action: ProductInCartAction.REMOVE,
      },
    ]);
  });
});
