import { validateArray, validate } from '@reactor-room/itopplus-back-end-helpers';
import {
  PageMemberObjectValidate,
  PageMemberInviteInputObjectValidate,
  InvitationObjectValidateion,
  TokenInputValidate,
  invitationPageMemberPayloadValidate,
  PageMemberAmount,
} from '@reactor-room/itopplus-model-lib';
import { SmtpConfigValidate } from '@reactor-room/model-lib';

export function validatePageMemberAmountResponseValidate<T>(data: T): T {
  return validate(PageMemberAmount, data);
}

export function validatePageMemberResponseValidate<T>(data: T): T {
  return validateArray(PageMemberObjectValidate, data);
}

export function validatePageMemberInviteInputValidate<T>(data: T): T {
  return validate(PageMemberInviteInputObjectValidate, data);
}

export function validateInvitationObjectValidate<T>(data: T): T {
  return validate(InvitationObjectValidateion, data);
}

export function validateSmtpConfigValidate<T>(data: T): T {
  return validate<T>(SmtpConfigValidate, data);
}

export function validateTokenInput<T>(data: T): T {
  return validate<T>(TokenInputValidate, data);
}

export function validateRequestInvitationPageMember<T>(data: T): T {
  return validate<T>(invitationPageMemberPayloadValidate, data);
}
