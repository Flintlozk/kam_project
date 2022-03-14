import { getUTCDayjs, parseTimestampToDayjs } from '@reactor-room/itopplus-back-end-helpers';

export const getDayTilExpired = (expiredAt: Date): number => {
  const currentDate = getUTCDayjs();
  const expiredDate = parseTimestampToDayjs(expiredAt);
  const isBefore = expiredDate.isBefore(currentDate);
  if (isBefore) return -1;

  return expiredDate.diff(currentDate, 'day');
};

export const countDaysToToday = (startCountDate: Date): number => {
  const currentDate = getUTCDayjs();
  const startDate = parseTimestampToDayjs(startCountDate);

  return startDate.diff(currentDate, 'day');
};

export const createExpiredDate = (planID: number): Date => {
  const currentDate = getUTCDayjs();
  switch (planID) {
    case 1:
      return getUTCDayjs().endOf('month').toDate();
    default:
      return currentDate.add(1, 'year').toDate();
  }
};

export const renewExpiredDate = (oldExpireDate: Date): Date => {
  return parseTimestampToDayjs(oldExpireDate).add(1, 'year').toDate();
};

export const renewExpiredDateFreePackage = (): Date => {
  return getUTCDayjs().endOf('month').toDate();
};
