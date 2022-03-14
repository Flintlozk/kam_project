import { getUTCDayjs } from '../../utc.helper';

export function downloadFile(data: BlobPart, namePrefix = 'Leads Report ', type = 'text/csv', name: string = getUTCDayjs().format('DD-MM-YYYY'), extension = '.csv'): void {
  const blob = new Blob([data], { type });
  const url = window.URL.createObjectURL(blob);

  const a = document.createElement('a');
  a.href = url;
  a.download = `${namePrefix}${name}${extension}`;
  a.click();
  window.URL.revokeObjectURL(url);
}
