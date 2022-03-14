import { isEmpty as empty } from 'lodash';
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const isEmpty = (obj: any): boolean => {
  //I try to duplicate this code because refactor exist code it very difficult
  return empty(obj);
};
