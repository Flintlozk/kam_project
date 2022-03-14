import type { EnumPurchaseOrderSubStatus, IGQLContext, IPurchaseOrder, IPurchaseOrerErrors, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { PurchaseOrderFailedService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requirePackageValidation } from '../../domains/plusmar';
import { validateResponseGetPurchaseOrderFailedHistoryHandler, validateResponsePurchaseOrder } from '../../schema/purchase-order';
import { graphQLHandler } from '../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrderFailedController {
  public static instance;

  public static purchaseOrderFailedService: PurchaseOrderFailedService;
  public static getInstance() {
    if (!PurchaseOrderFailedController.instance) PurchaseOrderFailedController.instance = new PurchaseOrderFailedController();
    return PurchaseOrderFailedController.instance;
  }
  constructor() {
    PurchaseOrderFailedController.purchaseOrderFailedService = new PurchaseOrderFailedService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchaseOrderFailedHistoryHandler(parent: IPurchaseOrder, args: { orderID: number }, context: IGQLContext): Promise<IPurchaseOrerErrors[]> {
    const { pageID } = context.payload;
    return await PurchaseOrderFailedController.purchaseOrderFailedService.getPurchaseOrderFailedHistory({
      pageID,
      orderID: parent?.orderId || args?.orderID,
    });
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async resolvePurchaseOrderProblemHandler(
    parent,
    args: { audienceID: number; orderID: number; typename: EnumPurchaseOrderSubStatus },
    context: IGQLContext,
  ): Promise<PurchaseOrderResponse> {
    const { pageID } = context.payload;
    return await PurchaseOrderFailedController.purchaseOrderFailedService.resolvePurchaseOrderProblem({
      pageID,
      orderID: args.orderID,
      typename: args.typename,
    });
  }
}

const controller: PurchaseOrderFailedController = PurchaseOrderFailedController.getInstance();

export const purchaseOrderFailedHistoryResolver = {
  Query: {
    getPurchaseOrderFailedHistory: graphQLHandler({
      handler: controller.getPurchaseOrderFailedHistoryHandler,
      validator: validateResponseGetPurchaseOrderFailedHistoryHandler,
    }),
  },
  Mutation: {
    resolvePurchaseOrderProblem: graphQLHandler({
      handler: controller.resolvePurchaseOrderProblemHandler,
      validator: validateResponsePurchaseOrder,
    }),
  },
};
