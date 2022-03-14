import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { ProductInventoryService } from './product-inventory.service';

jest.mock('../../data');

describe('testing product inventory exists', () => {
  const productInventoryService = new ProductInventoryService();
  const pageID = 2;
  const notExistsVariantID = -99;
  const quantity = 2;
  const bigQuantity = 1210909090;
  const variantID = 594;

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  test('throw when product not available', async () => {
    try {
      await productInventoryService.isProductVariantAvailable(pageID, notExistsVariantID, quantity);
    } catch (error) {
      expect(error.message).toStrictEqual('Product cannot be added as the product is out of stock or not available');
    }
  });

  test('throw when pipeline not available and stock not available', async () => {
    mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
    try {
      mock(data, 'getVariantByID', jest.fn().mockResolvedValueOnce(getVariantData()));
      mock(data, 'getPurchaseOrderPipelineData', jest.fn().mockResolvedValueOnce({}));
      await productInventoryService.isProductVariantAvailable(pageID, variantID, bigQuantity);
    } catch (error) {
      expect(error.message).toStrictEqual('Error: Not able to add Aww (uir) - 1210909090 items. Items available in stock - 5 ');
    }
  });

  test('throw when pipeline available and stock not available', async () => {
    mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
    try {
      mock(data, 'getVariantByID', jest.fn().mockResolvedValueOnce(getVariantData()));
      mock(data, 'getPurchaseOrderPipelineData', jest.fn().mockResolvedValueOnce(getPipelineData()));
      mock(data, 'getPurchasingOrderItems', jest.fn().mockResolvedValueOnce(getPurchasingOrderItems()));
      mock(productInventoryService, 'listProductsInCart', jest.fn().mockResolvedValueOnce(listProductsInCart()));
      await productInventoryService.isProductVariantAvailable(pageID, variantID, bigQuantity);
    } catch (error) {
      expect(error.message).toStrictEqual('Error: Not able to add Aww (uir) - 1210909090 items. Items available in stock - 5 ');
    }
  });
});

const getVariantData = () => {
  return {
    id: 594,
    productName: 'Aww',
    attributeName: 'uir',
    sku: 'a343a',
    unit_price: 1222.0,
    inventory: 5,
  };
};
const getPipelineData = () => {
  return {
    steps: [],
    status: 'incomplete',
    updatedAt: '2020-10-13T11:19:20.669Z',
    createdAt: '2020-10-13T11:19:20.669Z',
    _id: '5f852ac8c7d4970cd25df121',
    audience_id: '873',
    page_id: '2',
    pipeline: 'FOLLOW',
    psid: '4254962181242841',
    order_id: 273,
    form_id: null,
    payment_id: null,
    bank_account_id: null,
    logistic_id: null,
    __v: 0,
  };
};

const getPurchasingOrderItems = () => {
  return [
    {
      orderId: 273,
      totalPrice: null,
      orderItemId: 213,
      variantId: 594,
      productId: 442,
      quantity: 3,
      unitPrice: '1222.00',
      isSold: false,
      images: '',
      productName: 'Aww',
      attributes: 'uir , sdfsd',
    },
  ];
};

const listProductsInCart = () => {
  return {
    items: [{ id: 594, product_id: 442, inventory: 5, status: 1, active: true }],
    checklist: [{ productId: 213, variantId: 594, quantity: 3, isSold: false }],
  };
};
