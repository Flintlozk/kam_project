import { EnumAuthScope, IGQLContext, IMarketPlaceOrderDetails, IMarketPlaceOrderDetailsParams, IPayload } from '@reactor-room/itopplus-model-lib';
import { PurchaseOrderMarketPlaceService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { validateRequestPageID } from '../../schema/common';
import { validatePurchaseOrderMarketPlaceDetailsRequest, validatePurchaseOrderMarketPlaceDetailsResponse } from '../../schema/purchase-order';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class PurchaseOrderMarketPlaceController {
  public static instance;
  public static purchaseOrderMarketPlaceService: PurchaseOrderMarketPlaceService;

  public static getInstance() {
    if (!PurchaseOrderMarketPlaceController.instance) PurchaseOrderMarketPlaceController.instance = new PurchaseOrderMarketPlaceController();
    return PurchaseOrderMarketPlaceController.instance;
  }
  constructor() {
    PurchaseOrderMarketPlaceController.purchaseOrderMarketPlaceService = new PurchaseOrderMarketPlaceService();
  }

  async getMarketPlaceOrderDetailsHandler(parents, args: IMarketPlaceOrderDetailsParams, context: IGQLContext): Promise<IMarketPlaceOrderDetails> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { marketPlaceOrderID, orderChannel } = validatePurchaseOrderMarketPlaceDetailsRequest<IMarketPlaceOrderDetailsParams>(args);
    const result = await PurchaseOrderMarketPlaceController.purchaseOrderMarketPlaceService.getMarketPlaceOrderDetails({ marketPlaceOrderID, orderChannel, pageID });
    return result;
  }
}

const purchaseMarketPlaceOrder: PurchaseOrderMarketPlaceController = PurchaseOrderMarketPlaceController.getInstance();

export const purchaseMarketPlaceOrderResolver = {
  Query: {
    getMarketPlaceOrderDetails: graphQLHandler({
      handler: purchaseMarketPlaceOrder.getMarketPlaceOrderDetailsHandler,
      validator: validatePurchaseOrderMarketPlaceDetailsResponse,
    }),
  },
};
