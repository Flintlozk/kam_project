import { validate, validateArray } from '@reactor-room/itopplus-back-end-helpers';
import { LogEntityValidate, LogReturn, UsersListValidate } from '@reactor-room/itopplus-model-lib';

export function validateLogEntity<T>(data: T): any {
  return validate(LogEntityValidate, data);
}

export function validateLog<T>(data: T): any {
  return validate(LogReturn, data);
}

export function validateUsersList<T>(data: T): any {
  return validateArray(UsersListValidate, data);
}
