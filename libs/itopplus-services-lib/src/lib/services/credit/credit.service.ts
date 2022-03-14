import { EnumCreditPaymentStatus, ICreditPaymentHistory } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { createCreditPaymentHistory, deductCreditDropOff, getCreditPaymentHistory, updateCreditPaymentStatus } from '../../data/credit/credit.data';
import { PlusmarService } from '../plusmarservice.class';

export class CreditPaymentHistoriesService {
  async getCreditHistory(pageID: number, orderID: number, subscriptionID: string): Promise<ICreditPaymentHistory> {
    return await getCreditPaymentHistory(PlusmarService.readerClient, pageID, orderID, subscriptionID);
  }
  async createCreditHistory(pageID: number, orderID: number, subscriptionID: string, remainCredit: number, dropOffCost: number): Promise<ICreditPaymentHistory> {
    return await createCreditPaymentHistory(PlusmarService.writerClient, pageID, orderID, subscriptionID, remainCredit, dropOffCost);
  }

  async deductCreditDropOff(client: Pool = PlusmarService.writerClient, subscriptionID: string, cost: number): Promise<void> {
    await deductCreditDropOff(client, subscriptionID, cost);
  }

  async updateCreditPaymentHistory(client: Pool, pageID: number, orderID: number, subscriptionID: string, status: EnumCreditPaymentStatus): Promise<ICreditPaymentHistory> {
    return await updateCreditPaymentStatus(client, pageID, orderID, subscriptionID, status);
  }
}
