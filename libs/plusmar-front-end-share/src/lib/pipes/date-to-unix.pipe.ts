import { Pipe, PipeTransform } from '@angular/core';
import { parseUTCToTimestamp } from '@reactor-room/itopplus-front-end-helpers';

@Pipe({
  name: 'dateToUnix',
})
export class DateToUnixPipe implements PipeTransform {
  transform(value: string): number {
    return parseUTCToTimestamp(value);
  }
}
