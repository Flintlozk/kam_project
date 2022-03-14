import { PlusmarService } from '../plusmarservice.class';
import { getOrderDetail, getLogisticLabels, getDetailPDFByUuid, getReportFlashDetail, getLogisticTypesByUuid } from '../../data';
import { calculatePriceDetail } from '../../domains/report';
import { createUuidFormatString } from '../../domains/report/create-uuid-format-string';
import { groupDataByPurchaseID } from '../../domains/report/group-data-by-order-id';
import { splitTypeLogisticByName } from '../../domains/report/split-type-logistic-by-name';
import { reportPDFLabel } from '../../domains/report/report-pdf-label';
import { createObjForFlashReport } from '../../domains/report/create-obj-for-flash';
import { groupPurchaseByInOBJ, reportPDF, reportFlashResponse, reportAllType } from '@reactor-room/itopplus-model-lib';
import { isNotEmptyValue } from '@reactor-room/itopplus-back-end-helpers';
export class ReportService {
  constructor() {}
  getOrderDetail = async (uuid): Promise<groupPurchaseByInOBJ[]> => {
    const newUuidFormat = createUuidFormatString(uuid);
    const orderDetail = await getOrderDetail(PlusmarService.readerClient, newUuidFormat);
    const groupOrderByID = await groupDataByPurchaseID(orderDetail, PlusmarService.readerClient);
    const result = calculatePriceDetail(groupOrderByID);
    return result;
  };
  getLogisticLabels = async (uuid: string): Promise<reportPDF> => {
    const detail = await getDetailPDFByUuid(PlusmarService.readerClient, uuid);
    let reportPDF = {
      label1: '',
      label2: '',
    };
    if (isNotEmptyValue(detail) && detail.length > 0) {
      const lableReport = await getLogisticLabels(detail[0].purchase_order_id, detail[0].page_id, [detail[0].id]);
      reportPDF = reportPDFLabel(lableReport);
    }
    return reportPDF;
  };
  checkFlashPDF = (reportDetail): boolean => {
    let reportPDF = false;
    if (isNotEmptyValue(reportDetail.label1)) reportPDF = true;
    return reportPDF;
  };
  getFlashReport = async (uuid: string): Promise<reportFlashResponse[]> => {
    const newUUid = createUuidFormatString(uuid);
    const response = await getReportFlashDetail(PlusmarService.readerClient, newUUid);
    const result = createObjForFlashReport(response);
    return result;
  };
  checkTypeReport = async (uuid: string): Promise<reportAllType> => {
    const newUUid = createUuidFormatString(uuid);
    const logisticDetail = await getLogisticTypesByUuid(PlusmarService.readerClient, newUUid);
    const result = splitTypeLogisticByName(logisticDetail);
    return result;
  };
}
