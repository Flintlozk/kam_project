import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IncreaseDecreaseType } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { ProductInventoryUpdateService } from './product-inventory-update.service';

jest.mock('../../data/product/product_inventory_update.data');
jest.mock('../../data');
jest.mock('./product-marketplace-lazada-api.service');
jest.mock('./product-marketplace-shopee-api.service');
jest.mock('@reactor-room/itopplus-back-end-helpers');

let productUpdateInvService = new ProductInventoryUpdateService();

describe('testing product update inventory', () => {
  beforeEach(() => {
    productUpdateInvService = new ProductInventoryUpdateService();
  });
  const pageID = 344;
  const queueID = 1;

  PlusmarService.writerClient = {} as unknown as Pool;
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue(new Pool()));

  mock(PostgresHelper, 'execBatchRollbackTransaction', jest.fn().mockResolvedValue(new Pool()));

  test('getProductUpdatedProductInventory -> get increase stock', () => {
    const operationType = IncreaseDecreaseType.INCREASE;
    const stockToUpdate = 2;
    const currentInventory = 40;
    const updatedInventory = 42;
    const result = productUpdateInvService.getProductUpdatedProductInventory(currentInventory, stockToUpdate, operationType);
    expect(updatedInventory).toEqual(result);
  });

  test('getProductUpdatedProductInventory -> get descrese stock', () => {
    const operationType = IncreaseDecreaseType.DECREASE;
    const stockToUpdate = 2;
    const currentInventory = 40;
    const updatedInventory = 38;
    const result = productUpdateInvService.getProductUpdatedProductInventory(currentInventory, stockToUpdate, operationType);
    expect(updatedInventory).toEqual(result);
  });

  test('getProductUpdatedProductInventory -> throw error', () => {
    try {
      const operationType = IncreaseDecreaseType.DECREASE;
      const stockToUpdate = 2;
      const currentInventory = 1;
      productUpdateInvService.getProductUpdatedProductInventory(currentInventory, stockToUpdate, operationType);
    } catch (error) {
      expect(error.message).toEqual('STOCK_TO_UPDATE_IS_GREATER_THAN_CURRENT_INVENTORY');
    }
  });
});
