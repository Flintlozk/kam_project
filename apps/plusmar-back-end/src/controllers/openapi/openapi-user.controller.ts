import { OpenAPIService } from '@reactor-room/itopplus-services-lib';
import { expressHandler } from '../express-handler';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { requireAPIKey } from '../../domains/auth.domain';
import { validateRequesteUpdateCustomerByCustomerOpenAPIObject, validateRequesteGetCustomerInfoByCustomerOpenAPIObject } from '../../schema/customer';

class OpenAPIUser {
  public static openAPIService: OpenAPIService;
  getLineUsersList = expressHandler({ handler: this.getLineUsersListHandler, validator: (x: any) => x });
  updateCustomerByCustomerID = expressHandler({ handler: this.updateCustomerByCustomerIDHandler, validator: (x: any) => x });
  getCustomerInfoByCustomerID = expressHandler({ handler: this.getCustomerInfoByCustomerIDHandler, validator: (x: any) => x });
  constructor() {
    OpenAPIUser.openAPIService = new OpenAPIService();
  }

  @requireAPIKey
  async getLineUsersListHandler(parent, args, context: IGQLContext) {
    const page = parent.query.page !== undefined ? Number(parent.query.page) : 0;
    return await OpenAPIUser.openAPIService.getLineUserList(parent.body, page);
  }

  @requireAPIKey
  async updateCustomerByCustomerIDHandler(parent, args, context: IGQLContext) {
    const param = validateRequesteUpdateCustomerByCustomerOpenAPIObject(parent.body);
    return await OpenAPIUser.openAPIService.updateCustomerByCustomerID(param);
  }

  @requireAPIKey
  async getCustomerInfoByCustomerIDHandler(parent, args, context: IGQLContext) {
    const param = validateRequesteGetCustomerInfoByCustomerOpenAPIObject(parent.query);
    return await OpenAPIUser.openAPIService.getCustomerInfoByCustomerID(param);
  }
}

export const openAPIUserController = new OpenAPIUser();
