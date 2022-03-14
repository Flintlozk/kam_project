import { IMarketPlaceOrderDetails, IMarketPlaceOrderDetailsParams } from '@reactor-room/itopplus-model-lib';
import { getMarketPlaceOrderDetails } from '../../data';
import { PlusmarService } from '../plusmarservice.class';

export class PurchaseOrderMarketPlaceService {
  constructor() {}
  async getMarketPlaceOrderDetails(params: IMarketPlaceOrderDetailsParams): Promise<IMarketPlaceOrderDetails> {
    return await getMarketPlaceOrderDetails(params, PlusmarService.readerClient);
  }
}
