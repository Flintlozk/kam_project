import { OpenAPIService } from '@reactor-room/itopplus-services-lib';
import { expressHandler } from '../express-handler';
import type { IGQLContext } from '@reactor-room/itopplus-model-lib';
import { requireAPIKey } from '../../domains/auth.domain';
import { validateRequesteSetTagsByCustomerOpenAPIObject } from '../../schema/customer';

class OpenAPITags {
  public static openAPIService: OpenAPIService;
  getAllTags = expressHandler({ handler: this.getAllTagsHandler, validator: (x: any) => x });
  setTagsByCustomerID = expressHandler({ handler: this.setTagsByCustomerIDHandler, validator: (x: any) => x });

  constructor() {
    OpenAPITags.openAPIService = new OpenAPIService();
  }

  @requireAPIKey
  async getAllTagsHandler(parent, args, context: IGQLContext) {
    return await OpenAPITags.openAPIService.getAllTags(parent.body);
  }

  @requireAPIKey
  async setTagsByCustomerIDHandler(parent, args, context: IGQLContext) {
    const param = validateRequesteSetTagsByCustomerOpenAPIObject(parent.body);
    return await OpenAPITags.openAPIService.setTagsByCustomerID(param);
  }
}

export const openAPITagsController = new OpenAPITags();
