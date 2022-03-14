import type { IGQLContext, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { PurchaseOrderResolveService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requirePackageValidation } from '../../domains/plusmar';
import { graphQLHandler } from '../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrderResolve {
  public static instance;

  public static purchaseOrderResolveService: PurchaseOrderResolveService;
  public static getInstance() {
    if (!PurchaseOrderResolve.instance) PurchaseOrderResolve.instance = new PurchaseOrderResolve();
    return PurchaseOrderResolve.instance;
  }
  constructor() {
    PurchaseOrderResolve.purchaseOrderResolveService = new PurchaseOrderResolveService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async resolvePurchaseOrderPaidTransactionHandler(parent, args: { PSID: string; orderId: number }, context: IGQLContext): Promise<PurchaseOrderResponse> {
    return await PurchaseOrderResolve.purchaseOrderResolveService.resolvePurchaseOrderPaidTransaction(context.payload.pageID, args.orderId, context.payload.subscriptionID);
  }
}

const purchaseOrderResolve: PurchaseOrderResolve = PurchaseOrderResolve.getInstance();

export const purchaseOrderResolveResolver = {
  Mutation: {
    resolvePurchaseOrderPaidTransaction: graphQLHandler({
      handler: purchaseOrderResolve.resolvePurchaseOrderPaidTransactionHandler,
      validator: (x) => x,
    }),
  },
};
