import { deltaWebPageComponentRequest, webPageThemelayoutIndexValidate } from '@reactor-room/cms-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { HTTPResultObjectValidate } from '@reactor-room/model-lib';
import { getSubscriptionBudgetResponseValidate, SubscriptionIndexValidate, subscriptionLimitResponseValidate, TokenInputValidate } from '@reactor-room/itopplus-model-lib';

export function validateResponseHTTPObject<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}

export function validateResponseHTTPArray<T>(data: T): T {
  return validateArray<T>(HTTPResultObjectValidate, data);
}

export function validateDefaultResponse<T>(data: T): T {
  return data;
}

export function validateDefaultRequest<T>(data: T): T {
  return data;
}
export function validateGetThemeComponentsRequest<T>(data: T): T {
  return validate(webPageThemelayoutIndexValidate, data);
}

export function ValidateUpdatePageComponentByWebPageID<T>(data: T): T {
  return validate(deltaWebPageComponentRequest, data);
}

export function validateTokenInput<T>(data: T): T {
  return validate<T>(TokenInputValidate, data);
}

export function validateRequestSubscriptionIndex<T>(data: T): T {
  return validate<T>(SubscriptionIndexValidate, data);
}

export function validateSubscriptionLimitResponseValidate<T>(data: T): T {
  return validate<T>(subscriptionLimitResponseValidate, data);
}

export function validateResponseSubscriptionBudget<T>(data: T): T {
  return validate(getSubscriptionBudgetResponseValidate, data);
}
