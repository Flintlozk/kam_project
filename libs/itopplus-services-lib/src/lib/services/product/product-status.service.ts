import { IProductStatus } from '@reactor-room/itopplus-model-lib';
import * as productService from '../../data/product';
import { PlusmarService } from '../plusmarservice.class';

export class ProductStatusService {
  getProductStatus = async (): Promise<IProductStatus[]> => {
    return await productService.getProductStatus(PlusmarService.readerClient);
  };
}
