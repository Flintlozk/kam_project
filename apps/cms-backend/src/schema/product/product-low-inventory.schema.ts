import { validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { IProductLowInventoryListValidate, IProductLowStockTotalValidate } from 'libs/itopplus-model-lib/src/lib/product/product-low-inventory.joi';

export function validateResponseProductList<T>(data: T): T {
  return validateArray(IProductLowInventoryListValidate, data);
}

export function validateResponseProductLowStock<T>(data: T): T {
  return validateArray(IProductLowStockTotalValidate, data);
}
