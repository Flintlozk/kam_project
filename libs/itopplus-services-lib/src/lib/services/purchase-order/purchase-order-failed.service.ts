import { IPurchaseOrderFailedParams, IPurchasingOrderFailedHistory, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { getPurchaseOrderFailedHistory, upsertFailPurchaseOrderStatus } from '../../data';

export class PurchaseOrderFailedService {
  constructor() {}

  async getPurchaseOrderFailedHistory(params: IPurchaseOrderFailedParams): Promise<IPurchasingOrderFailedHistory[]> {
    const result = await getPurchaseOrderFailedHistory(params);
    if (!isEmpty(result)) return result;
    else return [];
  }

  async upsertFailPurchaseOrderStatus(params: IPurchaseOrderFailedParams, isFixed = false): Promise<void> {
    await upsertFailPurchaseOrderStatus(params, isFixed);
  }

  async resolvePurchaseOrderProblem(params: IPurchaseOrderFailedParams): Promise<PurchaseOrderResponse> {
    const isFixed = true;
    await upsertFailPurchaseOrderStatus(params, isFixed);
    return {
      status: 200,
      message: 'COMPLETE',
    };
  }
}
