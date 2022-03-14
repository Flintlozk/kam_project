import { Pipe, PipeTransform } from '@angular/core';
import { isSameDay } from '@reactor-room/itopplus-front-end-helpers';
import { IMessageModel } from '@reactor-room/itopplus-model-lib';

import { Dayjs } from 'dayjs';
import * as dayjs from 'dayjs';

@Pipe({
  name: 'chatDisplayDate',
})
export class ChatDisplayDatePipe implements PipeTransform {
  parseDate(date: string): Dayjs {
    return dayjs(parseInt(String(date), 10)).format('YYYY') === '1970' ? dayjs(date) : dayjs(parseInt(String(date), 10));
  }
  transform(currentMessage: IMessageModel, ...args: [IMessageModel, boolean]): boolean {
    const [previousMessage, lastRecord] = args;
    if (previousMessage) {
      const current = this.parseDate(currentMessage.createdAt);
      const previous = this.parseDate(previousMessage.createdAt);
      return !isSameDay(current, previous);
    } else {
      return lastRecord;
    }
  }
}
