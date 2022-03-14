import { createTax, getTaxByPageID, updateTax, updateTaxStatus } from '../../../data/settings';
import { ITaxInput, ITaxModel } from '@reactor-room/itopplus-model-lib';
import { PlusmarService } from '../../plusmarservice.class';
import { IHTTPResult } from '@reactor-room/model-lib';
import { TaxInitializeService } from '../../initialize';

export class TaxService {
  createTax = async (pageID: number): Promise<IHTTPResult> => {
    return await createTax(PlusmarService.writerClient, pageID);
  };

  getTaxByPageID = async (pageID: number): Promise<ITaxModel> => {
    const tax: ITaxModel = await getTaxByPageID(PlusmarService.readerClient, pageID);
    if (!tax) {
      const initService = new TaxInitializeService();
      await initService.initTax(PlusmarService.writerClient, pageID);
      return await getTaxByPageID(PlusmarService.readerClient, pageID);
    } else {
      return tax;
    }
  };

  updateTax = async (id: number, taxInputData: ITaxInput): Promise<IHTTPResult> => {
    return await updateTax(PlusmarService.writerClient, id, taxInputData);
  };

  updateTaxStatus = async (id: number, status: boolean): Promise<IHTTPResult> => {
    return await updateTaxStatus(PlusmarService.writerClient, id, status);
  };
}
