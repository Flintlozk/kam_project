import { ITableFilter } from '@reactor-room/model-lib';
import { IProductLowInventoryList, IProductLowStockTotal } from '@reactor-room/itopplus-model-lib';
import * as productData from '../../data/product';
import { PlusmarService } from '../plusmarservice.class';

export class ProductLowInventoryService {

  getProductLowInventory = async (pageID: number, filters: ITableFilter): Promise<IProductLowInventoryList[]> => {
    console.log('pageID', pageID);
    const lowInventoryAmount = 20;
    const { currentPage, pageSize, orderMethod, orderBy } = filters;
    const page: number = (currentPage - 1) * pageSize;
    const orderQuery = ` ${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;

    const lowstockData = await productData.getProductLowInventory(PlusmarService.readerClient, pageID, page, pageSize, lowInventoryAmount, orderQuery);
    return lowstockData;
  };

  getProductLowStockTotal = async (pageID: number): Promise<IProductLowStockTotal[]> => {
    const lowInventoryAmount = 20;
    const lowstockTotal = await productData.getProductLowStock(PlusmarService.readerClient, pageID, lowInventoryAmount);
    
    return lowstockTotal;
  };
}
