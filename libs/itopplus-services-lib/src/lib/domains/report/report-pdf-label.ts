import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export const reportPDFLabel = (data) => {
  const pdfObj = {
    label1: '',
    label2: '',
  };
  if (isNotEmptyValue(data) && data.length > 0) {
    pdfObj.label1 = data[0].label1;
    pdfObj.label2 = data[0].label2;
  }
  return pdfObj;
};
