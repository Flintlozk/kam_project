import { isEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export const checkEmptyValueAndParseToString = (data) => {
  if (isEmptyValue(data)) {
    data = '';
  } else {
    data.toString();
  }
  return data;
};
