import { isEmpty } from 'lodash';

export const getRouteOptionalParams = <T>(obj: T): string => {
  if (isEmpty(obj)) throw new Error('NOT_A_VALID_OBJECT');
  let paramString = '';
  for (const [key, value] of Object.entries(obj)) {
    paramString += `;${key}=${value}`;
  }
  return paramString;
};
