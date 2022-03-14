import { OpenAPIService } from '@reactor-room/itopplus-services-lib';
import { expressHandler } from '../express-handler';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { requireAPIKey } from '../../domains/auth.domain';
import { validateRequesteCreatePurchasingQuickPayOpenAPI, validateRequesteCancelBillingQuickPayOpenAPI } from '../../schema/purchase-order';

class OpenAPIPurchasing {
  public static openAPIService: OpenAPIService;
  createPurchasingQuickPay = expressHandler({ handler: this.createPurchasingQuickPayHandler, validator: (x: any) => x });
  cancelBilligQuickPay = expressHandler({ handler: this.cancelBilligQuickPayHandler, validator: (x: any) => x });
  constructor() {
    OpenAPIPurchasing.openAPIService = new OpenAPIService();
  }

  @requireAPIKey
  async createPurchasingQuickPayHandler(parent, args, context: IGQLContext) {
    const param = validateRequesteCreatePurchasingQuickPayOpenAPI(parent.body);
    return await OpenAPIPurchasing.openAPIService.createPurchasingQuickPay(param);
  }

  @requireAPIKey
  async cancelBilligQuickPayHandler(parent, args, context: IGQLContext) {
    const param = validateRequesteCancelBillingQuickPayOpenAPI(parent.body);
    return await OpenAPIPurchasing.openAPIService.cancelBilligQuickPay(param);
  }
}

export const openAPIPurchasingController = new OpenAPIPurchasing();
