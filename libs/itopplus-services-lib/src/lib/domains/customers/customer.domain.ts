import { getUTCDayjs, parseTimestampToDayjsWithFormat } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { IAliases, ICustomerTemp, DateUnit, IDashboardCustomers, IDashboardAudience, IDateGap } from '@reactor-room/itopplus-model-lib';

export const compositeGetCustomerParameter = (aliases: IAliases, exportAllRows: boolean): (string | number)[] => {
  const param =
    !exportAllRows && !aliases.search
      ? [aliases.pageID, aliases.pageID, aliases.pageID, aliases.page, aliases.pageSize]
      : aliases.search && !exportAllRows
      ? [aliases.pageID, aliases.pageID, aliases.pageID, aliases.page, aliases.pageSize, aliases.search, aliases.search, aliases.search, aliases.search, aliases.search]
      : exportAllRows && aliases.search
      ? [aliases.pageID, aliases.pageID, aliases.pageID, aliases.search, aliases.search, aliases.search, aliases.search, aliases.search]
      : [aliases.pageID, aliases.pageID, aliases.pageID];
  return param;
};

export const convertSLAStringToTime = (hour: number, minute: number): string => {
  const time = getUTCDayjs().subtract(hour, 'h').subtract(minute, 'm').format('YYYY-MM-DD HH:mm:ss');
  return time;
};

export const getCustomerNameByPlatform = (customer: ICustomerTemp): string => {
  if (customer.platform === AudiencePlatformType.LINEOA) {
    return customer.first_name + ' ' + (customer.aliases !== null ? customer.aliases : '');
  } else if (customer.platform === AudiencePlatformType.FACEBOOKFANPAGE) {
    return customer.first_name + ' ' + (customer.last_name !== null ? customer.last_name : '') + ' ' + (customer.aliases !== null ? customer.aliases : '');
  } else {
    return customer.first_name + ' ' + customer.last_name;
  }
};

export const getDategapByDateRange = (dateRange: number): IDateGap => {
  const dateGap = { gap: 1, unit: DateUnit.DAY };
  switch (true) {
    case dateRange <= 1: {
      dateGap.gap = 1;
      dateGap.unit = DateUnit.HOUR;
      break;
    }
    case dateRange <= 7: {
      dateGap.gap = 1;
      dateGap.unit = DateUnit.DAY;
      break;
    }
    case dateRange > 7 && dateRange < 30: {
      dateGap.gap = Math.ceil(dateRange / 8);
      dateGap.unit = DateUnit.DAY;
      break;
    }
    case dateRange <= 180 && dateRange >= 30: {
      dateGap.gap = Math.ceil(dateRange / 12);
      dateGap.unit = DateUnit.DAY;
      break;
    }
    case dateRange > 180: {
      dateGap.gap = Math.ceil(dateRange / 12);
      dateGap.unit = DateUnit.DAY;
      break;
    }
  }
  return dateGap;
};
