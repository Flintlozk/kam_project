import * as Joi from 'joi';
export const validateStaticHtmlResponse = (data: string): { value: string } => {
  return Joi.string().validate(data);
};
