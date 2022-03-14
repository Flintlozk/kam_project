import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
@Pipe({
  name: 'todayYesterdayDate',
})
export class TodayYesterdayDatePipe implements PipeTransform {
  transform(value: string): string {
    const today = dayjs().format('DD/MM/YYYY');
    const yesterday = dayjs().subtract(1, 'd').format('DD/MM/YYYY');
    const todayDisplay = 'Today';
    const yesterdayDisplay = 'Yesterday';
    const dateReceived = value as any;
    try {
      if (!dateReceived) throw new Error('Invalid Date');
      const formatTypeOfDate = isNaN(dateReceived) ? dateReceived : +dateReceived;
      const formatDate = dayjs(formatTypeOfDate).format('DD/MM/YYYY');
      switch (formatDate) {
        case today:
          return todayDisplay;
        case yesterday:
          return yesterdayDisplay;
        default:
          return formatDate as string;
      }
    } catch (error) {
      console.log('err', error);
      return 'Invalid Date' as string;
    }
  }
}
