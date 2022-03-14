import * as dayjs from 'dayjs';
export const generateMTUIdHelper = (): string => {
  const today = dayjs().format('HHMMss');
  // return today;
  const randNum = String(Math.floor(10000 + Math.random() * 90000));
  const result = `${today}${randNum}`;
  return result;
};
