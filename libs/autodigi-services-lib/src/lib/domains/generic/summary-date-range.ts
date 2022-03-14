import { RangeFormat, SummaryDateRange } from '@reactor-room/autodigi-models-lib';
import * as dayjs from 'dayjs';

export async function getSummaryDateRange(): Promise<SummaryDateRange> {
  const range = {
    today: await getCompareRange('today'),
    yesterday: await getCompareRange('yesterday'),
    sevendaysago: await getCompareRange('7days'),
    thirtydaysago: await getCompareRange('30days'),
  };
  return range;
}

export async function getCompareRange(type: string): Promise<RangeFormat> {
  switch (type) {
    case 'today': {
      const range = {
        date: dayjs().format('YYYY-MM-DD'),
        compare: dayjs().subtract(7, 'day').format('YYYY-MM-DD'),
      };
      return range;
    }
    case 'yesterday': {
      const range = {
        date: dayjs().subtract(1, 'day').format('YYYY-MM-DD'),
        compare: dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
      };
      return range;
    }
    case '7days': {
      const range = {
        date: dayjs().subtract(8, 'day').format('YYYY-MM-DD'),
        compare: dayjs().subtract(15, 'day').format('YYYY-MM-DD'),
        currentRange: await getDateByRange(dayjs().subtract(7, 'day').format('YYYYMMDD'), dayjs().subtract(1, 'day').format('YYYYMMDD')),
        compareRange: await getDateByRange(dayjs().subtract(14, 'day').format('YYYYMMDD'), dayjs().subtract(8, 'day').format('YYYYMMDD')),
      };
      return range;
    }
    case '30days': {
      const range = {
        date: dayjs().subtract(31, 'day').format('YYYY-MM-DD'),
        compare: dayjs().subtract(61, 'day').format('YYYY-MM-DD'),
        currentRange: await getDateByRange(dayjs().subtract(30, 'day').format('YYYYMMDD'), dayjs().subtract(1, 'day').format('YYYYMMDD')),
        compareRange: await getDateByRange(dayjs().subtract(60, 'day').format('YYYYMMDD'), dayjs().subtract(31, 'day').format('YYYYMMDD')),
      };
      return range;
    }
  }
  return;
}
export async function getDateByRange(begin: string, end: string): Promise<string[]> {
  const dateArray = [];
  const dayDiff = dayjs(end).diff(dayjs(begin), 'day');
  let startDate = dayjs(begin);
  let round = 0;
  while (round <= Math.abs(dayDiff)) {
    dateArray.push(dayjs(startDate).format('YYYY-MM-DD'));
    startDate = dayjs(startDate).add(1, 'day');
    round++;
  }
  return dateArray;
}
