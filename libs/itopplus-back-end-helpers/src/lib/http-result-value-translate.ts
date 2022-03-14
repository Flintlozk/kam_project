import { IHTTPResultValueTranslate } from '@reactor-room/model-lib';

export const httpResultValueTranslate = (translateData: IHTTPResultValueTranslate): string => {
  return JSON.stringify(translateData);
};
