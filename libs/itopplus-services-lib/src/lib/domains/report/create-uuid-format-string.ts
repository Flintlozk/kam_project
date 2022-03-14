import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export const createUuidFormatString = (uuid: string): string[] => {
  let result = [];
  if (isNotEmptyValue(uuid)) {
    result = uuid.split(',');
  }
  return result;
};
