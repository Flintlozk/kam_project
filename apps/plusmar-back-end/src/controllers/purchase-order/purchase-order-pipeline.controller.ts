import type { IGQLContext, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { PurchaseOrderPipelineService } from '@reactor-room/itopplus-services-lib';
import { requirePackageValidation } from '../../domains/plusmar';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateRequestPurchaseOrder, validateResponsePurchaseOrder } from '../../schema/purchase-order';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrderPipeline {
  public static instance;

  public static purchaseOrderPipelineService: PurchaseOrderPipelineService;
  public static getInstance() {
    if (!PurchaseOrderPipeline.instance) PurchaseOrderPipeline.instance = new PurchaseOrderPipeline();
    return PurchaseOrderPipeline.instance;
  }
  constructor() {
    PurchaseOrderPipeline.purchaseOrderPipelineService = new PurchaseOrderPipelineService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateNextPurchaseOrderStatusHandler(parent, args, context: IGQLContext): Promise<PurchaseOrderResponse> {
    const { audienceId } = validateRequestPurchaseOrder(args);
    return await PurchaseOrderPipeline.purchaseOrderPipelineService.updateNextPurchaseOrderStatus(context.payload.pageID, audienceId, context.payload.subscriptionID);
  }
}

const purchaseOrderPipeline: PurchaseOrderPipeline = PurchaseOrderPipeline.getInstance();

export const purchaseOrderPipelineResolver = {
  Mutation: {
    updateNextPurchaseOrderStatus: graphQLHandler({
      handler: purchaseOrderPipeline.updateNextPurchaseOrderStatusHandler,
      validator: validateResponsePurchaseOrder,
    }),
  },
};
