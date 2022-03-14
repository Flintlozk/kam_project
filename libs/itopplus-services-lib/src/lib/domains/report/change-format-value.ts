import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
import { increaseTextInfrontValue } from './increase-text-infront';
import { numberWithComma } from './number-with-comma';
export const changeFormatValue = (data: number): string => {
  let result = '฿ 0';
  if (isNotEmptyValue(data)) {
    result = increaseTextInfrontValue('฿ ', numberWithComma(data.toFixed(2)));
  }
  return result;
};
