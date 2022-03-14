import { Pipe, PipeTransform } from '@angular/core';
import * as dayjs from 'dayjs';
@Pipe({ name: 'datediff' })
export class DateDiffPipe implements PipeTransform {
  transform(value: Date): string {
    const now = dayjs();
    const difference = now.diff(value, 'day');
    if (difference === 0) {
      return '(Today)';
    } else {
      return `(${difference} days ago)`;
    }
  }
}
