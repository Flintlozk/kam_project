import { getDiffrentDay, getDiffrentHour, parseTimestampToDayjs, parseTimestampToDayjsWithFormat } from '@reactor-room/itopplus-back-end-helpers';
import { DateUnit, IDashboardAudience, IDashboardCustomers, IDateGap } from '@reactor-room/itopplus-model-lib';

export const generateAudienceDateTemplate = (dateRange: string[]): IDashboardAudience[] => {
  return dateRange.map((date) => {
    return { date, audience_per_day: 0 };
  });
};

export const filterAudienceDateTemplate = (dateTemplate: IDashboardAudience[], dateGap: IDateGap): IDashboardAudience[] => {
  if (dateGap.unit !== DateUnit.HOUR) {
    dateTemplate = dateTemplate.filter((date) => {
      return dateTemplate.indexOf(date) % dateGap.gap === 0;
    });
  }
  return dateTemplate;
};

export const convertToDashbordFormat = (message_result: IDashboardAudience[], diffTime: number, dateGap?: IDateGap): IDashboardAudience[] => {
  if (message_result.length > 0) {
    message_result.map((date) => {
      if (dateGap !== undefined) date.date = parseTimestampToDayjs(date.date).add(diffTime, 'hour').format('YYYY-MM-DD HH:mm:ss');
      else date.date = parseTimestampToDayjs(date.date).format('YYYY-MM-DD HH:mm:ss');
    });
  }
  return message_result;
};

export const convertDateTemplateToMap = (dateTemplate: IDashboardAudience[]): Map<string, number> => {
  const newMap = new Map();
  dateTemplate.map((date) => {
    const currentDate = parseTimestampToDayjs(date.date).format('YYYY-MM-DD HH:mm:ss');
    newMap.set(currentDate, 0);
  });

  return newMap;
};

export const assignMsgCountToDateTemplate = (message_count: IDashboardAudience[], dateGap: IDateGap, filteredMap: Map<string, number>): IDashboardAudience[] => {
  const filterArray = Array.from(filteredMap.keys());
  for (let resultIndex = 0; resultIndex < message_count.length; resultIndex++) {
    const currentDate = parseTimestampToDayjs(message_count[resultIndex].date).format('YYYY-MM-DD HH:mm:ss');
    for (let mapIndex = 0; mapIndex < filterArray.length; mapIndex++) {
      const hourDiff = getDiffrentHour(parseTimestampToDayjs(currentDate), parseTimestampToDayjs(filterArray[mapIndex]));
      const dayDiff = getDiffrentDay(parseTimestampToDayjs(currentDate), parseTimestampToDayjs(filterArray[mapIndex]));
      const dateDiff = dateGap.unit === DateUnit.HOUR ? hourDiff : dayDiff;
      if (dateDiff <= dateGap.gap) {
        if (dateDiff === 0) {
          filteredMap.set(currentDate, filteredMap.get(currentDate) + message_count[resultIndex].audience_per_day);
          break;
        } else if (dateDiff > 0) {
          const newValue = filterArray[mapIndex];
          filteredMap.set(newValue, filteredMap.get(newValue) + message_count[resultIndex].audience_per_day);
        }
      }
    }
  }
  const mapToArray: IDashboardAudience[] = Array.from(filteredMap, ([date, audience_per_day]) => ({ date, audience_per_day }));
  return mapToArray;
};

export const convertToAudienceDashboardData = (audience_data: IDashboardAudience[], dateGap: IDateGap): IDashboardAudience[] => {
  let finalString = '';
  let isHourIndex = 0;
  const dateFormat = ['', ''];
  const isDay = dateGap.gap > 1 || dateGap.unit !== DateUnit.HOUR;
  if (isDay) {
    dateFormat[0] = 'YYYY-MM-DD';
    dateFormat[1] = 'DD/MM/YY';
    isHourIndex = 0;
  } else {
    dateFormat[0] = 'HH:mm';
    dateFormat[1] = 'HH:mm';
    isHourIndex = 1;
  }

  for (let index = 0; index < audience_data.length; index++) {
    if (isDay) {
      if (index !== audience_data.length - 1) {
        const isBeforeYear = parseTimestampToDayjs(audience_data[index].date).isBefore(parseTimestampToDayjs(audience_data[index + 1].date), 'year');
        if (isBeforeYear) {
          dateFormat[1] = 'DD/MM/YY';
        } else {
          dateFormat[1] = 'DD/MM';
        }
      }
    }

    finalString = '';
    const dateSplit = audience_data[index].date.split(' ');
    finalString += parseTimestampToDayjsWithFormat(dateSplit[isHourIndex], dateFormat[0]).format(dateFormat[1]);
    audience_data[index].date = finalString;
  }

  return audience_data;
};

export const convertToCustomerDashboardData = (customer_data: IDashboardCustomers[], dateGap: IDateGap): IDashboardCustomers[] => {
  let finalString = '';
  const dateFormat = ['', ''];
  const oneDay = 1;
  const isDay = dateGap.gap > oneDay || dateGap.unit !== DateUnit.HOUR;
  if (isDay) {
    dateFormat[0] = 'YYYY-MM-DD';
    dateFormat[1] = 'DD/MM/YY';
  } else {
    dateFormat[0] = 'YYYY-MM-DD HH:mm:ss';
    dateFormat[1] = 'HH:mm';
  }
  customer_data.filter((customer_date) => {
    customer_date.date = customer_date.date.slice(1, -1);
    customer_date.date = customer_date.date.replace(/['"]+/g, '');
    customer_date.date = customer_date.date.split(',')[0];
    return customer_date;
  });

  if (!isDay) {
    customer_data.filter((customer_date) => {
      return customer_data[customer_data.indexOf(customer_date)].date.split(' ')[1];
    });
  }

  for (let index = 0; index < customer_data.length; index++) {
    if (isDay) {
      if (index !== customer_data.length - 1) {
        const isBeforeYear = parseTimestampToDayjs(customer_data[index].date).isBefore(parseTimestampToDayjs(customer_data[index + 1].date), 'year');
        if (isBeforeYear) {
          dateFormat[1] = 'DD/MM/YY';
        } else {
          dateFormat[1] = 'DD/MM';
        }
      }
    }

    finalString = '';
    finalString += parseTimestampToDayjsWithFormat(customer_data[index].date, dateFormat[0]).format(dateFormat[1]);
    customer_data[index].date = finalString;
  }

  return customer_data;
};
