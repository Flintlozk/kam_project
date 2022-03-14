import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export const checkOrderDate = (createorderdate: string): string => {
  let today = new Date();
  let dd = today.getDate();
  let mm = today.getMonth() + 1;
  let yyyy = today.getFullYear();
  if (isNotEmptyValue(createorderdate)) {
    today = new Date(createorderdate);
    dd = today.getDate();
    mm = today.getMonth() + 1;
    yyyy = today.getFullYear();
  }
  let newDate = '';
  let newMonth = '';
  if (dd < 10) {
    newDate = '0' + dd;
  } else {
    newDate = dd.toString();
  }

  if (mm < 10) {
    newMonth = '0' + mm;
  } else {
    newMonth = mm.toString();
  }
  createorderdate = `${newDate} - ${newMonth} - ${yyyy}`;
  return createorderdate;
};
