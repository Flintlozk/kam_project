/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable @typescript-eslint/explicit-module-boundary-types */
import * as Joi from 'joi';
import { SmtpConfigValidate } from '@reactor-room/model-lib';

export function validate<T>(validateObject: any, data: T, strip = true): T {
  const schema = Joi.object().keys(validateObject);
  return validateFunction(schema, data, strip);
}

export function validateArray<T>(validateObject: any, data: T, strip = true): T {
  const schema = Joi.array().items(Joi.object().keys(validateObject));
  return validateFunction(schema, data, strip);
}

const validateFunction = (schema, data, strip = true) => {
  if (strip) {
    data = JSON.parse(JSON.stringify(data));
  }
  const v = schema.validate(data, {
    stripUnknown: strip,
  });
  if (v.error) {
    throw new Error(v.error.message);
  }
  return v.value;
};

export function validateSmtpConfigValidate<T>(data: T): T {
  return validate<T>(SmtpConfigValidate, data);
}
