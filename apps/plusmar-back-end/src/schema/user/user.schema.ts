import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import {
  userCredentialResponseValidate,
  userContextResponseValidate,
  userListResponseValidate,
  userCredentialFromTokenResponseValidate,
  sidAndEmailInputObjectValidate,
  userAndPageFromTokenResponseValidate,
} from '@reactor-room/itopplus-model-lib';

export function validateResponseUserCredential<T>(data: T): T {
  return validate(userCredentialResponseValidate, data);
}

export function validateResponseUserContext<T>(data: T): T {
  return validate(userContextResponseValidate, data);
}
export function validateResponseUserList<T>(data: T): T {
  return validateArray(userListResponseValidate, data);
}

export function validateResponseUserCredentialFromToken<T>(data: T): T {
  try {
    return validate(userCredentialFromTokenResponseValidate, data);
  } catch (err) {
    console.log('Error ::', err);
    return data;
  }
}

export function validateSIDAndEmailInput<T>(data: T): T {
  return validate(sidAndEmailInputObjectValidate, data);
}

export function validateUserAndPageFromTokenResponse<T>(data: T): T {
  return validate(userAndPageFromTokenResponseValidate, data);
}
