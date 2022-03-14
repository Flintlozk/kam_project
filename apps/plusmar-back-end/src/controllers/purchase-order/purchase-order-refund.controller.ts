import type { IGQLContext, IPurchaseOrder, IPurhcaseOrderPayment, PurchaseOrderResponse } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope, EnumSubscriptionFeatureType } from '@reactor-room/itopplus-model-lib';
import { PurchaseOrderRefundService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { requirePackageValidation } from '../../domains/plusmar';
import { validateResponsegetPurchasingOrderUnrefundedPaymentInfo, validateResponsePurchaseOrder } from '../../schema/purchase-order';
import { graphQLHandler } from '../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrderRefundController {
  public static instance;

  public static PurchaseOrderRefundService: PurchaseOrderRefundService;
  public static getInstance() {
    if (!PurchaseOrderRefundController.instance) PurchaseOrderRefundController.instance = new PurchaseOrderRefundController();
    return PurchaseOrderRefundController.instance;
  }
  constructor() {
    PurchaseOrderRefundController.PurchaseOrderRefundService = new PurchaseOrderRefundService();
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async getPurchasingOrderUnrefundedPaymentInfoHandler(parent: IPurchaseOrder, args: { orderID: number }, context: IGQLContext): Promise<IPurhcaseOrderPayment[]> {
    const { pageID } = context.payload;
    const result = await PurchaseOrderRefundController.PurchaseOrderRefundService.getPurchasingOrderUnrefundedPaymentInfo(pageID, args.orderID);
    return result;
  }
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async proceedToRefundOrderHandler(parent: IPurchaseOrder, args: { orderID: number }, context: IGQLContext): Promise<PurchaseOrderResponse> {
    const { pageID } = context.payload;
    return await PurchaseOrderRefundController.PurchaseOrderRefundService.proceedToRefundOrder(pageID, args.orderID);
  }
}

const controller: PurchaseOrderRefundController = PurchaseOrderRefundController.getInstance();

export const purchaseOrderRefundResolver = {
  Query: {
    getPurchasingOrderUnrefundedPaymentInfo: graphQLHandler({
      handler: controller.getPurchasingOrderUnrefundedPaymentInfoHandler,
      validator: validateResponsegetPurchasingOrderUnrefundedPaymentInfo,
    }),
  },
  Mutation: {
    proceedToRefundOrder: graphQLHandler({
      handler: controller.proceedToRefundOrderHandler,
      validator: validateResponsePurchaseOrder,
    }),
  },
};
