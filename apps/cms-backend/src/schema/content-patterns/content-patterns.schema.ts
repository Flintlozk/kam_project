import { addContentPatternRequest, getContentPatternsRequest, updateContentPatternRequest } from '@reactor-room/cms-models-lib';
import { validate } from '@reactor-room/itopplus-back-end-helpers';

export const validateGetContentPatternsRequest = <T>(data: T): T => {
  return validate<T>(getContentPatternsRequest, data);
};

export const validateAddContentPatternRequest = <T>(data: T): T => {
  return validate<T>(addContentPatternRequest, data);
};

export const validateUpdateContentPatternRequest = <T>(data: T): T => {
  return validate<T>(updateContentPatternRequest, data);
};
