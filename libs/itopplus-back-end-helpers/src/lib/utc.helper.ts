import type { Dayjs, OpUnitType } from 'dayjs';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
dayjs.extend(utc);

export const getUTCMongo = (): Date => {
  // BEWARE OF USES This fucntion will turn Dayjs Object into Date Object
  // ON Save to Postgres it will changes the time depends on Default Timezone of DB
  return dayjs().utc().toDate();
};
export const getUTCDayjs = (): Dayjs => {
  return dayjs().utc();
};
export const getDayjs = (): Dayjs => {
  return dayjs();
};
export const getUTCTimestamps = (): string => {
  return dayjs().utc().format();
};
export const parseTimestampToDayjs = (date: Date | string | number): Dayjs => {
  return dayjs(date);
};
export const parseTimestampToDayjsWithFormat = (date: Date | string | number, format: string): Dayjs => {
  return dayjs(date, format);
};
export const parseTimestampToUTCDayjs = (date: Date | string | number): Dayjs => {
  return dayjs(date).utc();
};
export const parseTimestampToUTC = (time: Date | string | number): number => {
  return dayjs(time).utc().toDate().getTime();
};
export const parseUTCTimestamp = (time: number): string => {
  return dayjs(time).utc().format();
};

export const getUTCUnixTimestamps = (): number => {
  return dayjs().utc().unix();
};

export const getUTCUnixTimestampByDate = (date: Date): number => {
  return dayjs(date).utc().unix();
};

export const getDiffrentTime = (start: Dayjs, end: Dayjs, unit: dayjs.QUnitType): number => {
  return dayjs(end).diff(dayjs(start), unit);
};

export const getDiffrentDay = (start: Dayjs, end: Dayjs): number => {
  return dayjs(end).diff(dayjs(start), 'day');
};

export const getDiffrentHour = (start: Dayjs, end: Dayjs): number => {
  return dayjs(end).diff(dayjs(start), 'hour');
};

export const getDiffrentSecond = (start: Date, end: Date): number => {
  return dayjs(end).diff(dayjs(start), 'millisecond');
};

export const getUTCUnixLazadaTimestamps = (): number => {
  return +`${dayjs().utc().unix()}000`;
};

export const getUTCDateFromString = (dateString: string): string => dayjs(dateString, { utc: true }).utc().format();

export const parseUTCTimestampFormat = (time: number, format: string): string => {
  return dayjs(time).utc().format(format);
};

export const getPreviousDateISOString = (count: number, format: OpUnitType): string => {
  return dayjs().subtract(count, format).toISOString();
};

export const getDateByRange = (begin: string, end: string): string[] => {
  const dateArray = [];
  const diff = dayjs(end).diff(dayjs(begin), 'day');

  let startDate = dayjs(begin);
  let round = 0;
  const absDiff = Math.abs(diff);

  if (diff > 0) {
    while (round <= absDiff) {
      dateArray.push(dayjs(startDate).format('YYYY-MM-DD') + ' 00:00:00');

      startDate = dayjs(startDate).add(1, 'day');
      round++;
    }
  } else {
    while (round < 24) {
      dateArray.push(dayjs(startDate).format('YYYY-MM-DD HH:mm:ss'));
      startDate = dayjs(startDate).add(1, 'hour');
      round++;
    }
  }
  return dateArray;
};

export const transformDate = (value, format = 'DD/MM/YYYY HH:mm') => {
  const offset = dayjs().utcOffset() / 60;
  let date = dayjs(parseInt(String(value), 10)).format('YYYY') === '1970' ? dayjs(value) : dayjs(parseInt(String(value), 10));

  if (offset > 0) date = date.add(offset, 'h');
  else if (offset < 0) date = date.subtract(offset, 'h');

  const time = dayjs(date).format(format);
  return time;
};

export const getTimeRange = (current: string): number => {
  return dayjs().diff(current, 'day');
};

export const getTimeStampFromUnix = (unix: number): number => {
  return unix * 1000;
};

export const getDifferenceOfUnixTimestamp = (from: number, to: number): number => {
  const fromDate = dayjs(getTimeStampFromUnix(from));
  const toDate = dayjs(getTimeStampFromUnix(to));
  return Math.abs(toDate.diff(fromDate, 'd'));
};

export const addDaysToTimestamp = (date: number, noOfDays: number): number => {
  return dayjs(getTimeStampFromUnix(date)).add(noOfDays, 'd').utc().unix();
};

export const getJAndTDateTimeForPickup = (sendDate: number) => {
  return {
    createordertime: dayjs().utc().format('YYYY-MM-DD HH:mm:ss'),
    sendstarttime: dayjs().utc().utc().format('YYYY-MM-DD HH:mm:ss'),
    sendendtime: dayjs().utc().add(sendDate, 'day').format('YYYY-MM-DD HH:mm:ss'),
  };
};

export const getDateDiff = (date: Date, format: dayjs.QUnitType | dayjs.OpUnitType): number => {
  return dayjs().diff(date, format);
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

export const getDayOfWeek = (): number => {
  return dayjs().day();
};
export const getDynamicDayOfWeek = (range = 0): number => {
  const day = dayjs().day();
  const newRange = day + range;
  if (newRange > 6) return 0 + (range - 2);
  else if (newRange < 0) return Math.abs(range);
  else return newRange;
};

export const getDateDifferent = (startDate: string, endDate: string): number => {
  const dateDiff = getDiffrentDay(parseTimestampToDayjs(startDate), parseTimestampToDayjs(endDate));
  return dateDiff;
};
export const getFormatedTimezone = (date: string) => {
  let times = parseInt(date.split('T')[1].split('00:00:00')[1].replace(/[0:+]/g, '')).toString();
  if (Number(times) > 0) {
    times = '+' + times;
  }
  return times;
};
export const getDateByUnitStartOrEnd = (date: Date | string | number, type: 'START' | 'END', format: OpUnitType = 'd'): string => {
  if (type === 'START') {
    return dayjs(date).startOf(format).format();
  } else if (type === 'END') {
    return dayjs(date).endOf(format).format();
  } else {
    throw new Error('Please provide type START | END');
  }
};
