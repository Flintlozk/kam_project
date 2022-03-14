import { EnumAuthError, EnumSubscriptionFeatureType, IGQLContext, IPayload, IPlanLimitAndDetails } from '@reactor-room/itopplus-model-lib';
import { AuthError } from '@reactor-room/itopplus-services-lib';

export function requirePackageValidation(pacakges: EnumSubscriptionFeatureType[]) {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;

    propertyDesciptor.value = function (...args: any[]) {
      const context: IGQLContext = args[2];
      const payload: IPayload = context.payload;
      if (!payload) throw new Error('NO_PAY_LOAD');
      const limit: IPlanLimitAndDetails = payload.limitResources;
      if (!limit) throw new Error('NO_PLAN_DETAILS');

      for (let index = 0; index < pacakges.length; index++) {
        const validation = pacakges[index];
        switch (validation) {
          case EnumSubscriptionFeatureType.BUSINESS:
            if (limit.featureType !== EnumSubscriptionFeatureType.BUSINESS && limit.featureType !== EnumSubscriptionFeatureType.FREE)
              throw new AuthError(EnumAuthError.PACKAGE_INVALID);
            break;
          case EnumSubscriptionFeatureType.COMMERCE:
            if (limit.featureType !== EnumSubscriptionFeatureType.COMMERCE && limit.featureType !== EnumSubscriptionFeatureType.FREE)
              throw new AuthError(EnumAuthError.PACKAGE_INVALID);
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
