import * as dayjs from 'dayjs';
import { Dayjs } from 'dayjs';
// import * as utc from 'dayjs/plugin/utc';

// dayjs.extend(utc);

export const convertUTCdate = <T>(values: T[], key: string, dateFormat = 'DD/MM/YYYY HH:mm:ss'): void => {
  values.map((value) => {
    if (value[key]) {
      value[key] = dayjs(new Date(convertCurrentTimeToTimezoneFormat(value[key]) as string)).format(dateFormat);
    }
  });
};

export const convertCurrentTimeToTimezoneFormat = (value: Date | string): string | Date => {
  return typeof value === 'string' ? (<string>value).split('.')[0].replace('T', ' ').replace('Z', '') + ' UTC' : value;
};

export const getUTCMongo = (): Date => {
  // BEWARE OF USES This fucntion will turn Dayjs Object into Date Object
  // ON Save to Postgres it will changes the time depends on Default Timezone of DB
  return dayjs().toDate();
};
export const getUTCDayjs = (): Dayjs => {
  return dayjs();
};
export const getUTCTimestamps = (): string => {
  return dayjs().format();
};
export const getUTCDateTimestamps = (): Date => {
  return dayjs().toDate();
};
export const parseTimestampToDayjs = (date: Date): Dayjs => {
  return dayjs(date);
};
export const parseTimestampToUTC = (time: number): number => {
  return dayjs(time).toDate().getTime();
};

export const parseUTCUnixTimestamp = (date: number | string): number => {
  return dayjs(date).unix();
};

export const parseStringToDateUTC = (date: string): Date => {
  return dayjs(date).toDate();
};

export const parseUTCToTimestamp = (date: Date | string): number => {
  return dayjs(date).unix();
};

export const getTimestamp = (): string => {
  return dayjs().format();
};

export const getUTCDateFromString = (dateString: string): string => dayjs(dateString, { utc: true }).format();

export const getUTCUnixTimestamps = (): number => {
  return dayjs().unix();
};

export const getUTCUnixLazadaTimestamps = (): number => {
  return +`${dayjs().unix()}000`;
};

export const getCurrentTime = (): string => {
  const offset = dayjs().utcOffset() / 60;
  let date = dayjs();
  if (offset > 0) date = date.subtract(offset, 'h');
  else if (offset < 0) date = date.add(offset, 'h');
  return date.format();
};

export const transformDate = (value, format = 'DD/MM/YYYY HH:mm') => {
  const offset = dayjs().utcOffset() / 60;
  let date = dayjs(parseInt(String(value), 10)).format('YYYY') === '1970' ? dayjs(value) : dayjs(parseInt(String(value), 10));

  if (offset > 0) date = date.add(offset, 'h');
  else if (offset < 0) date = date.subtract(offset, 'h');

  const time = dayjs(date).format(format);
  return time;
};

export const getTimeRange = (current: string, compare = dayjs()): number => {
  return dayjs().diff(current, 'day');
};

export const isSameDay = (start: Dayjs, end: Dayjs): boolean => {
  return dayjs(start).isSame(end, 'd');
};

export const isTimeAfter = (start: Dayjs, end: Dayjs): boolean => {
  return dayjs(start).isAfter(end);
};
export const isTimeBefore = (start: Dayjs, end: Dayjs): boolean => {
  return dayjs(start).isBefore(end);
};

export const combineHourAndMinute = (hour: number, minute: number): Dayjs => {
  const date = `1997-01-01T${hour}:${minute}:0`;
  return dayjs(date);
};
export const getTimezone = (): string => {
  const date = new Date();

  let timeZone = (-date.getTimezoneOffset() / 60).toString();
  if (Number(timeZone) > 0) {
    if (Number(timeZone) < 10) timeZone = '+' + timeZone.padStart(2, '0');
    else timeZone = '+' + timeZone;
  }
  return timeZone;
};
export const convertTimeWithTz = (value: Date): string => {
  const tz = Number(-value.getTimezoneOffset() / 60);
  const hour = String(value.getHours()).padStart(2, '0');
  const minute = String(value.getMinutes()).padStart(2, '0');
  const sign = tz >= 0 ? '+' : '-';

  return `${hour}:${minute}:${sign}${String(tz).padStart(2, '0')}:00`;
};
