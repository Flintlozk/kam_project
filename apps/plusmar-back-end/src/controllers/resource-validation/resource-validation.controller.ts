import { EnumAuthScope, IGQLContext, IPayload, IResourceLimitArgs, IResourcesValidationResponse } from '@reactor-room/itopplus-model-lib';
import { ResourceValidationService } from '@reactor-room/itopplus-services-lib';
import { validateRequestResourceValidate, validateResponseRequestResourceValidate } from '../../schema/resource-limit-validation';
import { graphQLHandler } from '../graphql-handler';
import { validatelimitResourceObject, validateRequestPageID, validateSubscriptionIDValidate } from '../../schema/common';
import { requireScope } from '@reactor-room/itopplus-services-lib';

@requireScope([EnumAuthScope.SOCIAL])
class ResourceValidation {
  constructor() {
    ResourceValidation.resourceValidationService = new ResourceValidationService();
  }
  public static instance;
  public static resourceValidationService: ResourceValidationService;

  public static getInstance() {
    if (!ResourceValidation.instance) ResourceValidation.instance = new ResourceValidation();
    return ResourceValidation.instance;
  }

  async validateResourcesHandler(parent, args: IResourceLimitArgs, context: IGQLContext): Promise<IResourcesValidationResponse> {
    const { requestValidations } = validateRequestResourceValidate<IResourceLimitArgs>(args);
    const { limitResources } = validatelimitResourceObject<IPayload>(context.payload);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { subscriptionID } = validateSubscriptionIDValidate<IPayload>(context.payload);
    const result = await ResourceValidation.resourceValidationService.validateResources(subscriptionID, pageID, requestValidations, limitResources);
    return result;
  }
}

const resourceValidation: ResourceValidation = ResourceValidation.getInstance();
export const resourceValidationResolver = {
  Query: {
    validateResources: graphQLHandler({
      handler: resourceValidation.validateResourcesHandler,
      validator: validateResponseRequestResourceValidate,
    }),
  },
};
