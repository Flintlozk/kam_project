import { LanguageRequest } from '@reactor-room/cms-models-lib';
import { validateArray } from '@reactor-room/itopplus-back-end-helpers';

export const validateResponseLanguage = <T>(data: T): T => {
  return validateArray<T>(LanguageRequest, data);
};
