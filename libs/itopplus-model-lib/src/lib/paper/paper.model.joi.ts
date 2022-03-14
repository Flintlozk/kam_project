import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const PaperParamObjectValidate = {
  token: Joi.string().required(),
  paperSize: Joi.string().required(),
};
export const GetPaperParamObjectValidate = {
  token: Joi.string().required(),
  filename: Joi.string().required(),
};
