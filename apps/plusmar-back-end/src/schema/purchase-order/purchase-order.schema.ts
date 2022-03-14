import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { HTTPResultObjectValidate } from '@reactor-room/model-lib';
import {
  AllPurchaseOrderResponseValidate,
  CreateCourierTrackingInfoValidator,
  CreatePurchaseOrderRequestValidate,
  GetPurchaseOrderDestinationResponseValidate,
  GetPurchaseOrderFailedHistoryResponseValidate,
  GetPurchaseOrderRefundResponseValidate,
  GetPurchaseOrderResponseValidate,
  GetPurchaseOrderShippingDetailResponseValidate,
  PoStatsResponseValidate,
  PurchaseInventoryResponseValidate,
  PurchaseOrderMarketPlaceRequestValidate,
  PurchaseOrderMarketPlaceResponseValidate,
  PurchaseOrderModelValidate,
  PurchaseOrderRequestValidate,
  PurchaseOrderResponseValidate,
  UpdateCustomerAddressValidator,
  UpdateOrderPaymentRequestValidate,
  UpdatePurchaseOrderRequestValidate,
  UpdateTrackingRequestValidator,
  CreatePurchasingQuickPayOpenAPIRequestValidate,
  CancelBillingQuickPayOpenAPIRequestValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateResponseCreateCourierTrackingInfo<T>(data: T): T {
  return validate<T>(CreateCourierTrackingInfoValidator, data);
}
export function validateRequestPurchaseOrder<T>(data: T): T {
  return validate<T>(PurchaseOrderRequestValidate, data);
}
export function validateUpdateOrderPayment<T>(data: T): T {
  return validate<T>(UpdateOrderPaymentRequestValidate, data);
}
export function validateResponseGetPurchaseOrder<T>(data: T): T {
  return validate<T>(GetPurchaseOrderResponseValidate, data);
}
export function validateResponseGetPurchaseOrderShippingDetail<T>(data: T): T {
  return validate<T>(GetPurchaseOrderShippingDetailResponseValidate, data);
}
export function validateResponseGetPurchaseOrderDestination<T>(data: T): T {
  return validate<T>(GetPurchaseOrderDestinationResponseValidate, data);
}
export function validateResponseGetPurchaseOrderFailedHistoryHandler<T>(data: T): T {
  return validateArray<T>(GetPurchaseOrderFailedHistoryResponseValidate, data);
}
export function validateResponsegetPurchasingOrderUnrefundedPaymentInfo<T>(data: T): T {
  return validateArray<T>(GetPurchaseOrderRefundResponseValidate, data);
}
export function validateResponseGetPurchaseOrderInMonth<T>(data: T): T {
  return validateArray<T>(PurchaseOrderModelValidate, data);
}
export function validateRequestCreatePurchaseOrder<T>(data: T): T {
  return validate<T>(CreatePurchaseOrderRequestValidate, data);
}
export function validateRequestUpdatePurchaseOrder<T>(data: T): T {
  return validate<T>(UpdatePurchaseOrderRequestValidate, data);
}
export function validateRequestUpdateTracking<T>(data: T): T {
  return validate<T>(UpdateTrackingRequestValidator, data);
}
export function validateRequestUpdateCustomerAddress<T>(data: T): T {
  return validate<T>(UpdateCustomerAddressValidator, data);
}
export function validateResponseUpdateCustomerAddress<T>(data: T): T {
  return validate<T>(HTTPResultObjectValidate, data);
}

export function validateResponsePurchaseOrder<T>(data: T): T {
  return validate<T>(PurchaseOrderResponseValidate, data);
}
export function validatePoStats<T>(data: T): T {
  return validate<T>(PoStatsResponseValidate, data);
}
export function validatePurchaseInventory<T>(data: T): T {
  return validateArray<T>(PurchaseInventoryResponseValidate, data);
}
export function validateResponseAllPurchaseOrder<T>(data: T): T {
  return validateArray<T>(AllPurchaseOrderResponseValidate, data);
}
export function validatePurchaseOrderMarketPlaceDetailsRequest<T>(data: T): T {
  return validate<T>(PurchaseOrderMarketPlaceRequestValidate, data);
}

export function validatePurchaseOrderMarketPlaceDetailsResponse<T>(data: T): T {
  return validate<T>(PurchaseOrderMarketPlaceResponseValidate, data);
}

export function validateRequesteCreatePurchasingQuickPayOpenAPI<T>(data: T): T {
  return validate<T>(CreatePurchasingQuickPayOpenAPIRequestValidate, data);
}

export function validateRequesteCancelBillingQuickPayOpenAPI<T>(data: T): T {
  return validate<T>(CancelBillingQuickPayOpenAPIRequestValidate, data);
}
