import { ConfigFlowRequest, GetTeamConfigRequest, GroupStateRespone, StateByGroupResponse, TeamConfigResponse, WorkFlowDetailResponse } from '@reactor-room/crm-models-lib';
import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';

export function validateWorkFlowDetail<T>(data: T): T {
  return validateArray<T>(WorkFlowDetailResponse, data);
}
export function validatConfigStateRequest<T>(data: T): T {
  return validate<T>(GetTeamConfigRequest, data);
}
export function validateStateByGroup<T>(data: T): T {
  return validateArray<T>(StateByGroupResponse, data);
}
export function validateTeamConfigResponse<T>(data: T): T {
  return validateArray<T>(TeamConfigResponse, data);
}

export function validateConfigFlowRequest<T>(data: T): T {
  return validate<T>(ConfigFlowRequest, data);
}

export function validatorGroupState<T>(data: T): T {
  return validateArray<T>(GroupStateRespone, data);
}
