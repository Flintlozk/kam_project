import { DashboardSummary, IAutodigiWebStats, RangeFormat, SummaryDateRange, Visitor } from '@reactor-room/autodigi-models-lib';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';

export async function dashboardSummary(values: IAutodigiWebStats[], daterange: SummaryDateRange): Promise<DashboardSummary[]> {
  try {
    if (values === null || values === undefined || values.length < 1) return returnDefault();
    const todayData = await matchingValuesToDateRange('Today', values, daterange.today);
    const yesterdayData = await matchingValuesToDateRange('Yesterday', values, daterange.yesterday);
    const sevenDaysData = await matchingValuesToWeekandMonth('Seven days ago', values, daterange.sevendaysago);
    const thirtyDaysData = await matchingValuesToWeekandMonth('Thirty days ago', values, daterange.thirtydaysago);
    const result = await Promise.all([todayData, yesterdayData, sevenDaysData, thirtyDaysData]);
    return result;
  } catch (error) {
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    return;
  }
}
async function matchingValuesToDateRange(type: string, values: IAutodigiWebStats[], dateRange: RangeFormat): Promise<DashboardSummary> {
  const compareArray = [];
  const currentArray = [];
  const defaultValue = {
    diff: 0,
    percent: '0%',
    status: '',
  };
  values.map((value) => {
    value.stats.map((stat) => {
      if (dateRange.compare !== null || dateRange.date !== null) {
        if (dayjs(stat.createdate).format('YYYY-MM-DD') === dateRange.compare) compareArray.push(stat);
        if (dayjs(stat.createdate).format('YYYY-MM-DD') === dateRange.date) currentArray.push(stat);
      }
    });
  });
  const reduceValues = await Promise.all([reduceValueBySingleDate(currentArray), reduceValueBySingleDate(compareArray)]);
  const Num1 = reduceValues[0].Visitor;
  const Num2 = reduceValues[1].Visitor;
  defaultValue.diff = Num1 - Num2;

  if (Num1 !== 0 && Num2 !== 0) defaultValue.percent = (((Num1 - Num2) / Num1) * 100).toFixed(2) + '%';
  else defaultValue.percent = '0%';

  if (defaultValue.diff > 0) defaultValue.status = 'increase';
  else if (defaultValue.diff < 0) defaultValue.status = 'decrease';
  else defaultValue.status = 'not reduced';
  const returnValue = {
    Type: type,
    Result: {
      Date: {
        Visitor: Math.abs(reduceValues[0].Visitor),
        Old: Math.abs(reduceValues[0].Old),
        New: Math.abs(reduceValues[0].New),
      },
      Compare: {
        Visitor: Math.abs(reduceValues[1].Visitor),
        Old: Math.abs(reduceValues[1].Old),
        New: Math.abs(reduceValues[1].New),
      },
      Diff: Math.abs(defaultValue.diff),
      Percentage: defaultValue.percent,
      Status: defaultValue.status,
    },
  };
  return returnValue;
}

async function reduceValueBySingleDate(arrayOfDates): Promise<Visitor> {
  const objectToReturn = {
    Visitor: 0,
    Old: 0,
    New: 0,
  };
  if (!_.isEmpty(arrayOfDates)) {
    arrayOfDates.map((item) => {
      if (!_.isEmpty(item.stats)) {
        item.stats.map((detail) => {
          if (detail.category === 'GATEWAYS') {
            detail.stats_detail.map((visitor) => {
              objectToReturn.Visitor += Number(visitor.visitor[0].new) + Number(visitor.visitor[0].old);
              objectToReturn.Old += Number(visitor.visitor[0].old);
              objectToReturn.New += Number(visitor.visitor[0].new);
            });
          }
        });
        return objectToReturn;
      }
    });
    return objectToReturn;
  } else {
    return objectToReturn;
  }
}
async function matchingValuesToWeekandMonth(type: string, values: IAutodigiWebStats[], dateRange: RangeFormat): Promise<DashboardSummary> {
  const compareArray = [];
  const currentArray = [];
  const defaultValue = {
    diff: 0,
    percent: '0%',
    status: '',
  };
  values.map((value) => {
    value.stats.map((stat) => {
      if (dateRange.compareRange !== null || dateRange.currentRange !== null) {
        if (dateRange.compareRange.includes(dayjs(stat.createdate).format('YYYY-MM-DD'))) compareArray.push(stat);
        if (dateRange.currentRange.includes(dayjs(stat.createdate).format('YYYY-MM-DD'))) currentArray.push(stat);
      }
    });
  });
  const reduceValues = await Promise.all([reduceValuesByDateArray(currentArray), reduceValuesByDateArray(compareArray)]);
  const Num1 = reduceValues[0].Visitor;
  const Num2 = reduceValues[1].Visitor;
  defaultValue.diff = Num1 - Num2;

  if (Num1 !== 0 && Num2 !== 0) defaultValue.percent = (((Num1 - Num2) / Num1) * 100).toFixed(2) + '%';
  else defaultValue.percent = '0%';

  if (defaultValue.diff > 0) defaultValue.status = 'increase';
  else if (defaultValue.diff < 0) defaultValue.status = 'decrease';

  const returnValue = {
    Type: type,
    Result: {
      Date: {
        Visitor: Math.abs(reduceValues[0].Visitor),
        Old: Math.abs(reduceValues[0].Old),
        New: Math.abs(reduceValues[0].New),
      },
      Compare: {
        Visitor: Math.abs(reduceValues[1].Visitor),
        Old: Math.abs(reduceValues[1].Old),
        New: Math.abs(reduceValues[1].New),
      },
      Diff: Math.abs(defaultValue.diff),
      Percentage: defaultValue.percent,
      Status: defaultValue.status,
    },
  };
  return returnValue;
}
export async function reduceValuesByDateArray(result): Promise<Visitor> {
  const objectToReturn = {
    Visitor: 0,
    Old: 0,
    New: 0,
  };
  if (!_.isEmpty(result)) {
    result.map((item) => {
      if (!_.isEmpty(item.stats)) {
        item.stats.map((detail) => {
          if (detail.category === 'GATEWAYS') {
            detail.stats_detail.map((visitor) => {
              objectToReturn.Visitor += Number(visitor.visitor[0].new) + Number(visitor.visitor[0].old);
              objectToReturn.Old += Number(visitor.visitor[0].old);
              objectToReturn.New += Number(visitor.visitor[0].new);
            });
          }
        });
      } else {
        objectToReturn.Visitor += 0;
        objectToReturn.Old += 0;
        objectToReturn.New += 0;
      }
    });
    return objectToReturn;
  } else {
    return objectToReturn;
  }
}
const returnDefault = () => {
  return [
    {
      Type: 'Today',
      Result: {
        Date: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Compare: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Diff: 0,
        Percentage: 'null',
        Status: 'not reduced',
      },
    },
    {
      Type: 'Yesterday',
      Result: {
        Date: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Compare: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Diff: 0,
        Percentage: '0%',
        Status: 'not reduced',
      },
    },
    {
      Type: 'Seven days ago',
      Result: {
        Date: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Compare: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Diff: 0,
        Percentage: '0%',
        Status: 'not reduced',
      },
    },
    {
      Type: 'Thirty days ago',
      Result: {
        Date: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Compare: {
          Visitor: 0,
          Old: 0,
          New: 0,
        },
        Diff: 0,
        Percentage: '0%',
        Status: 'not reduced',
      },
    },
  ];
};
