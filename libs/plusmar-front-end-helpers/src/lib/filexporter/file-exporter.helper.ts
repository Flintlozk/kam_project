import { convertCurrentTimeToTimezoneFormat } from '@reactor-room/itopplus-front-end-helpers';
import { IAudienceHistoriesExport, IAudienceWithLeads, IAudienceWithPurchasing, ICustomerSLAExport, ICustomerTemp, PurchaseOrderList } from '@reactor-room/itopplus-model-lib';
import * as FileSaver from 'file-saver';
import * as XLSX from 'xlsx';

type AcceptedJsonObjectType = ICustomerTemp[] | PurchaseOrderList[] | IAudienceWithPurchasing[] | IAudienceWithLeads[] | ICustomerSLAExport[] | IAudienceHistoriesExport[];

export function convertUpdatedAtObject<T>(objects: T[], prop: string): void {
  objects.map((object) => {
    object[prop] = convertCurrentTimeToTimezoneFormat(object[prop]);
  });
}
export function removeObjectProptery<T>(
  objects: T[],
  prop1: string,
  prop2?: string,
  prop3?: string,
  prop4?: string,
  prop5?: string,
  prop6?: string,
  prop7?: string,
  prop8?: string,
  prop9?: string,
  prop10?: string,
): void {
  if (!prop1) throw new Error('atleast 1 props');
  objects.map((object) => {
    delete object[prop1];
    if (prop2) delete object[prop2];
    if (prop3) delete object[prop3];
    if (prop4) delete object[prop4];
    if (prop5) delete object[prop5];
    if (prop6) delete object[prop6];
    if (prop7) delete object[prop7];
    if (prop8) delete object[prop8];
    if (prop9) delete object[prop9];
    if (prop10) delete object[prop10];
  });
}

export function exportAndDownloadXLSX(jsonData: AcceptedJsonObjectType, filename: string): void {
  const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(jsonData);
  const wb: XLSX.WorkBook = { Sheets: { data: ws }, SheetNames: ['data'] };
  const excelBuffer = XLSX.write(wb, { bookType: 'xlsx', type: 'array' });
  saveExcelFile(excelBuffer, filename);
}

export function saveExcelFile(buffer: Buffer, fileName: string): void {
  const fileType = 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=UTF-8';
  const fileExtension = '.xlsx';

  const data: Blob = new Blob([buffer], { type: fileType });
  FileSaver.saveAs(data, fileName + fileExtension);
}
