import { Pipe, PipeTransform } from '@angular/core';
import { convertCurrentTimeToTimezoneFormat } from '@reactor-room/itopplus-front-end-helpers';
import * as dayjs from 'dayjs';
import en from 'dayjs/locale/en';
import th from 'dayjs/locale/th';
import * as relativeTime from 'dayjs/plugin/relativeTime';
// import localizedFormat from 'dayjs/plugin/localizedFormat';

// import * as utc from 'dayjs/plugin/utc';

const i18n = { en, th };
const lang = localStorage.getItem('language') || 'en';

dayjs.extend(relativeTime, i18n[lang]);
dayjs.locale(lang);

// dayjs.extend(utc);
// dayjs.extend(localizedFormat);

@Pipe({
  name: 'timeAgo',
  pure: false,
})
export class TimeAgoPipe implements PipeTransform {
  constructor() {}

  transform(value: Date | string, type?: string, format?: string): Date | string {
    const newDate = convertCurrentTimeToTimezoneFormat(value);
    const date = dayjs(new Date(newDate));

    switch (type) {
      case 'singletime-utc': {
        const offset = dayjs().utcOffset() / 60;
        let time = dayjs(`11-11-1999 ${value}`, 'DD-MM-YYYY HH:mm');

        if (offset > 0) {
          time = time.add(offset, 'h');
        } else if (offset < 0) {
          time = time.subtract(offset, 'h');
        }

        const converted = time.format('HH:mm');
        if (converted !== 'Invalid Date') {
          return converted;
        } else {
          return value;
        }
      }
      case 'utc':
        if (format) {
          const time = date.format(format);
          return time;
        } else {
          const time = date.format('DD/MM/YYYY HH:mm');
          return time;
        }
      case 'unix':
        return dayjs.unix(parseInt(String(value), 10)).format('DD/MM/YYYY HH:mm');
      default: {
        let toDate = dayjs().to(date, true);
        if (value === null) {
          toDate = '';
        }
        return toDate;
      }
    }
  }
}
