import { requireScope } from '@reactor-room/itopplus-services-lib';
import { ReportService } from '@reactor-room/itopplus-services-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { groupPurchaseByInOBJ, reportPDF, reportFlashResponse } from '@reactor-room/itopplus-model-lib';
class Report {
  public static instance;
  public static reportService: ReportService;
  public static getInstance() {
    if (!Report.instance) {
      Report.instance = new Report();
    }
    return Report.instance;
  }
  constructor() {
    Report.reportService = new ReportService();
  }
  async getOrderDetailHandler(uuid: string): Promise<groupPurchaseByInOBJ[]> {
    const dataReport = await Report.reportService.getOrderDetail(uuid);
    return dataReport;
  }
  async getLogisticByIDHandler(uuid: string): Promise<reportPDF> {
    const data = await Report.reportService.getLogisticLabels(uuid);
    return data;
  }
  async getFlashReportHanddler(uuid: string): Promise<reportFlashResponse[]> {
    const data = await Report.reportService.getFlashReport(uuid);
    return data;
  }
}

const report: Report = Report.getInstance();
export async function reportResolver(uuid: string) {
  return await report.getOrderDetailHandler(uuid);
}
export async function reportLabelPDF(uuid: string) {
  return await report.getLogisticByIDHandler(uuid);
}
export async function reportFlash(uuid: string) {
  return await report.getFlashReportHanddler(uuid);
}
