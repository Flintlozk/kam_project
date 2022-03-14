import * as dayjs from 'dayjs';

export const dateFormatter = (date: Date): string => {
  return dayjs(date).format('MMMM D, YYYY');
};
