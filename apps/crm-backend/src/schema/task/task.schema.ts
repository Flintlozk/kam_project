import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  CompanyValidateRequest,
  DealDateRequest,
  DeleteAppointMentValidateRequest,
  DeleteNoteTaskValidateRequest,
  EditAppointMentValidateRequest,
  FileRequest,
  FlowNameRequest,
  GetTaskByFlowValidateRequest,
  GetUserDataGoogleValidate,
  InsertAppointMentValidateRequest,
  InsertAssignTaskValidateRequest,
  InsertCompanyContactTask,
  InsertNoteTaskValidateRequest,
  InsertTagValidateRequest,
  InsertTaskCrossValidateRequest,
  InsertTaskDealValidateRequest,
  MediaAmountRequest,
  ProductAmountRequest,
  RequestNoteId,
  RequestTagId,
  ResponAttachementNote,
  ResponseAllUser,
  ResponseAppointmentTask,
  ResponseCompanyAddress,
  ResponseConditionInsertCross,
  ResponseContactTask,
  ResponseCountDetail,
  ResponseMemberFlow,
  ResponseNextStateTask,
  ResponseNoteTask,
  ResponseTagTask,
  ResponseTaskAssign,
  ResponseTaskDeal,
  TaskDetailResultArrayValidate,
  TaskResultObjectValidate,
  updateActiveTaskRequest,
  UpdateCompanyContactTask,
  UpdateNoteTaskValidateRequest,
  UpdateNoteTypeRequest,
  UpdateTaskStateValidateRequest,
  UpdateTaskTitleRequest,
  UuidAttachmentRequest,
  UuidTaskValidateRequest,
} from '@reactor-room/crm-models-lib';
export function validateResponseTaskArray<T>(data: T): T {
  return validateArray<T>(TaskResultObjectValidate, data);
}
export function validateResponseGetUserDataGoogle<T>(data: T): T {
  return validate<T>(GetUserDataGoogleValidate, data);
}
export function validateResponseTaskDetailArray<T>(data: T): T {
  return validate<T>(TaskDetailResultArrayValidate, data);
}
export function validateResponseConditionInsertCross<T>(data: T): T {
  return validate<T>(ResponseConditionInsertCross, data);
}
export function validateResponseNoteTaskArray<T>(data: T): T {
  return validateArray<T>(ResponseNoteTask, data);
}
export function validateResponseContactTaskArray<T>(data: T): T {
  return validateArray<T>(ResponseContactTask, data);
}
export function validateResponseTaskDealArray<T>(data: T): T {
  return validateArray<T>(ResponseTaskDeal, data);
}
export function validateResponseAllUserArrayk<T>(data: T): T {
  return validateArray<T>(ResponseAllUser, data);
}
export function validateResponseCompanyAddressrArray<T>(data: T): T {
  return validateArray<T>(ResponseCompanyAddress, data);
}
export function validateResponseMemberFlowArray<T>(data: T): T {
  return validateArray<T>(ResponseMemberFlow, data);
}
export function validateResponseCountDetailArray<T>(data: T): T {
  return validateArray<T>(ResponseCountDetail, data);
}
export function validateResponseAppointmentArray<T>(data: T): T {
  return validateArray<T>(ResponseAppointmentTask, data);
}
export function validateResponseTagTaskArray<T>(data: T): T {
  return validateArray<T>(ResponseTagTask, data);
}
export function validateResponseNextStateTask<T>(data: T): T {
  return validate<T>(ResponseNextStateTask, data);
}

export function validateResponAttachementNote<T>(data: T): T {
  return validateArray<T>(ResponAttachementNote, data);
}
export function validateResponseTaskAssign<T>(data: T): T {
  return validateArray<T>(ResponseTaskAssign, data);
}
export function validateGetTaskByFlowRequest<T>(data: T): T {
  return validate<T>(GetTaskByFlowValidateRequest, data);
}
export function validateUuidTaskRequest<T>(data: T): T {
  return validate<T>(UuidTaskValidateRequest, data);
}
export function validateUpdateCompanyContactTask<T>(data: T): T {
  return validate<T>(UpdateCompanyContactTask, data);
}
export function validateRequestTagId<T>(data: T): T {
  return validate<T>(RequestTagId, data);
}
export function validateRequestNoteId<T>(data: T): T {
  return validate<T>(RequestNoteId, data);
}
export function validateInsertCompanyContactTask<T>(data: T): T {
  return validate<T>(InsertCompanyContactTask, data);
}
export function validateUpdateActiveTask<T>(data: T): T {
  return validate<T>(updateActiveTaskRequest, data);
}
export function validateCompanyIdRequest<T>(data: T): T {
  return validate<T>(CompanyValidateRequest, data);
}
export function validateUpdateTaskStateRequest<T>(data: T): T {
  return validate<T>(UpdateTaskStateValidateRequest, data);
}
export function validateInsertTagRequest<T>(data: T): T {
  return validate<T>(InsertTagValidateRequest, data);
}
export function validateInsertappointMentRequest<T>(data: T): T {
  return validate<T>(InsertAppointMentValidateRequest, data);
}
export function validateEditappointMentRequest<T>(data: T): T {
  return validate<T>(EditAppointMentValidateRequest, data);
}
export function validateDeleteappointMentRequest<T>(data: T): T {
  return validate<T>(DeleteAppointMentValidateRequest, data);
}
export function validateInsertNoteTaskRequest<T>(data: T): T {
  return validate<T>(InsertNoteTaskValidateRequest, data);
}
export function validateUpdateNoteTaskRequest<T>(data: T): T {
  return validate<T>(UpdateNoteTaskValidateRequest, data);
}
export function validateDeleteNoteTaskRequest<T>(data: T): T {
  return validate<T>(DeleteNoteTaskValidateRequest, data);
}
export function validateInsertAssignTaskRequest<T>(data: T): T {
  return validate<T>(InsertAssignTaskValidateRequest, data);
}
export function validateInsertTaskDealRequest<T>(data: T): T {
  return validate<T>(InsertTaskDealValidateRequest, data);
}
export function validateInsertTaskCrossRequest<T>(data: T): T {
  return validate<T>(InsertTaskCrossValidateRequest, data);
}
export function validateFileRequest<T>(data: T): T {
  return validate<T>(FileRequest, data);
}
export function validateUpdateTaskTitleRequest<T>(data: T): T {
  return validate<T>(UpdateTaskTitleRequest, data);
}
export function validateDeleteAttachmentRequest<T>(data: T): T {
  return validate<T>(UuidAttachmentRequest, data);
}
export function validateUpdateNoteTypeRequest<T>(data: T): T {
  return validate<T>(UpdateNoteTypeRequest, data);
}
export function validateFlowNameRequest<T>(data: T): T {
  return validate<T>(FlowNameRequest, data);
}
export function validateUpdateDealDateForTaskRequest<T>(data: T): T {
  return validate<T>(DealDateRequest, data);
}
export function validateUpdateProductAmountForTaskRequest<T>(data: T): T {
  return validate<T>(ProductAmountRequest, data);
}
export function validateUpdateMediaAmountForTaskRequest<T>(data: T): T {
  return validate<T>(MediaAmountRequest, data);
}
