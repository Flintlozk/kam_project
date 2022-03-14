import { isEmpty } from 'lodash';

export const concatObjToParams = <T>(obj: T): string => {
  if (typeof obj === 'object' && isEmpty(obj)) {
    throw new Error('NOT_A_VALID_OBJECT');
  }
  let concatStr = '';
  for (const [key, value] of Object.entries(obj)) {
    concatStr += `${key}=${value}&`;
  }
  concatStr = '?' + concatStr.substr(0, concatStr?.length - 1);
  return concatStr;
};
