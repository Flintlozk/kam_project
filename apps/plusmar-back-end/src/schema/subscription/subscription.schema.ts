import { validate } from '@reactor-room/itopplus-back-end-helpers';
import {
  SubscriptionObjectValidate,
  SubscriptionIndexValidate,
  CreateSubscriptionInputValidate,
  UserSubscriptionMappingModelResponseValidate,
  subscriptionLimitResponseValidate,
  SubscriptionWithExpiredStatusObjectValidate,
  ResponseSubscriptionContext,
  subsciptionPlanValidate,
  userSubscriptionContextResponseValidate,
  getSubscriptionBudgetResponseValidate,
  SubscriptionPlanFeatureTypeValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateResponseSubscription<T>(data: T): T {
  return validate<T>(SubscriptionObjectValidate, data);
}

export function validateResponseSubscriptionWithExpiredStatus<T>(data: T): T {
  return validate<T>(SubscriptionWithExpiredStatusObjectValidate, data);
}

export function validateResponseSubscriptionContext<T>(data: T): T {
  return validate<T>(ResponseSubscriptionContext, data);
}

export function validateRequestSubscriptionIndex<T>(data: T): T {
  return validate<T>(SubscriptionIndexValidate, data);
}

export function validateSubscriptionPlanID<T>(data: T): T {
  return validate<T>(CreateSubscriptionInputValidate, data);
}

export function validateSubscriptionPlanFeatureType<T>(data: T): T {
  return validate<T>(SubscriptionPlanFeatureTypeValidate, data);
}

export function validateUserSubscriptionMappingModelResponse<T>(data: T): T {
  return validate<T>(UserSubscriptionMappingModelResponseValidate, data);
}

// export function validateRequestSubscription<T>(data: T): T {
//   return validate<T>(FacebookCredentialValidate, data);
// }

export function validateSubscriptionLimitResponseValidate<T>(data: T): T {
  return validate<T>(subscriptionLimitResponseValidate, data);
}

export function validateSubscriptionPlanValidate<T>(data: T): T {
  return validate<T>(subsciptionPlanValidate, data);
}

export function validateResponseUserSubscriptionContext<T>(data: T): T {
  return validate(userSubscriptionContextResponseValidate, data);
}

export function validateResponseSubscriptionBudget<T>(data: T): T {
  return validate(getSubscriptionBudgetResponseValidate, data);
}
