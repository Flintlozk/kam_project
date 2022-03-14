import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
import { flashReportReponse, reportFlashResponse, sortCodeObj } from '@reactor-room/itopplus-model-lib';
import * as dayjs_ from 'dayjs';
const dayjs = dayjs_;
export const createObjForFlashReport = (data: flashReportReponse[]): reportFlashResponse[] => {
  const response = [];
  if (isNotEmptyValue(data) && data.length >= 1) {
    for (let i = 0; i < data.length; i++) {
      const customerData = [];
      const custoemrData2 = [];
      const sortingLineCode = [];
      let sortingLineCodeSting = '';
      const customerDetail = {
        receiptName: `${data[i].first_name} ${data[i].last_name} ${data[i].phone_number}`,
        receiptAddress: `${data[i].location.address} ${data[i].location.district} ${data[i].location.city} ${data[i].location.province} ${data[i].location.post_code}`,
        receiptTel: `${data[i].phone_number}`,
      };
      if (isNotEmptyValue(data[i].payload.data.sortingLineCode)) {
        sortingLineCodeSting = data[i].payload.data.sortingLineCode;
      }
      sortingLineCode.push({
        sortingLineCode: sortingLineCodeSting,
      });
      customerData.push(customerDetail);
      customerDetail.receiptName = `${data[i].first_name} ${data[i].last_name}`;
      custoemrData2.push(customerDetail);
      const responseObj = {
        sortCode: splitSortCode(data[i].payload.data.sortCode),
        dstStoreName: data[i].payload.data.dstStoreName,
        sortingLineCode: sortingLineCode,
        customerdata: customerData,
        customerdata2: custoemrData2,
        trackingNumber: data[i].tracking_no,
        printTime: createPrintTimeZone(),
      };
      response.push(responseObj);
    }
  } else {
    const responseObj = {
      sortCode: '',
      dstStoreName: '',
      sortingLineCode: '',
      customerdata: '',
      customerdata2: '',
      trackingNumber: '',
      printTime: '',
    };
    response.push(responseObj);
  }
  return response;
};
export const splitSortCode = (data: string): sortCodeObj => {
  const objSortCode = {
    sortCode1: '',
    sortCode2: '',
    sortCode3: '',
  };
  if (isNotEmptyValue(data)) {
    const splitString = data.split('-');
    objSortCode.sortCode1 = splitString[0];
    objSortCode.sortCode2 = splitString[1];
    objSortCode.sortCode3 = splitString[2];
  }
  return objSortCode;
};
export const createPrintTimeZone = (): string => {
  return dayjs().format('YYYY-MM-DD h:mm:ss a');
};
