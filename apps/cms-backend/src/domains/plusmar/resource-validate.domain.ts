import { EnumAuthError, EnumResourceValidation, EnumResourceValidationError, IGQLContext, IPayload, IPlanLimitAndDetails } from '@reactor-room/itopplus-model-lib';
import { ResourceValidationService } from '@reactor-room/itopplus-services-lib';

export function requireResourceValidation(validations: EnumResourceValidation[]) {
  const resourceLimitService = new ResourceValidationService();
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;

    propertyDesciptor.value = async function (...args: any[]) {
      const context: IGQLContext = args[2];
      const payload: IPayload = context.payload;
      if (!payload) throw new Error('NO_PAY_LOAD');
      const limit: IPlanLimitAndDetails = payload.limitResources;
      if (!limit) throw new Error('NO_PLAN_DETAILS');

      for (let index = 0; index < validations.length; index++) {
        const validation = validations[index];
        let isCreatable;
        switch (validation) {
          case EnumResourceValidation.VALIDATE_MAX_PAGE_MEMBERS:
            isCreatable = await resourceLimitService.isPageMemberCreatable(limit.maximumMembers, context.payload.pageID);
            if (!isCreatable) throw new Error(EnumResourceValidationError.MEMBER_REACHED_LIMIT);
            break;
          case EnumResourceValidation.VALIDATE_MAX_PAGES:
            isCreatable = await resourceLimitService.isPageCreatable(limit.maximumPages, context.payload.subscriptionID);
            if (!isCreatable) throw new Error(EnumAuthError.PAGE_REACHED_LIMIT);
            break;
          case EnumResourceValidation.VALIDATE_MAX_AUDIENCES:
            isCreatable = await resourceLimitService.isAudienceCreatable(limit.maximumLeads, payload.pageID);
            if (!isCreatable) throw new Error(EnumResourceValidationError.AUDIENCE_REACHED_LIMIT);
            break;
          case EnumResourceValidation.VALIDATE_MAX_ORDERS:
            isCreatable = await resourceLimitService.isOrderCreatable(payload.pageID);
            if (!isCreatable) throw new Error(EnumResourceValidationError.ORDER_REACHED_LIMIT);
            break;
          case EnumResourceValidation.VALIDATE_MAX_PRODUCTS:
            isCreatable = await resourceLimitService.isProductCreatable(limit.maximumProducts, payload.pageID);
            if (!isCreatable) throw new Error(EnumResourceValidationError.PRODUCT_REACHED_LIMIT);
            break;
          default:
            break;
        }
      }

      const result = method.apply(this, args);
      return result;
    };
    return propertyDesciptor;
  };
}
