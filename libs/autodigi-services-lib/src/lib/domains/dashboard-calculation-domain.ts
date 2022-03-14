import { DashboardDomain, IAutodigiWebStatsEachDay, IAutodigiWebStatsTypeDetail } from '@reactor-room/autodigi-models-lib';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import { checking_date_range } from './generic/check-date-range';

export async function dashboard_Domain(
  concat_result: IAutodigiWebStatsEachDay[],
  date_range: string,
  custom_date_from: string,
  custom_date_to: string,
): Promise<DashboardDomain[]> {
  try {
    const condition = checking_date_range(date_range, custom_date_from, custom_date_to);
    const actual_data: IAutodigiWebStatsEachDay[] = _.filter(concat_result, (item) => {
      const start_date = new Date(condition.start_date);
      const end_date = new Date(condition.end_date);
      return item.createdate >= start_date && item.createdate <= end_date;
    });

    const unTrimmedData = await setFormat_Domain(actual_data);
    const result = await reduceDomain(unTrimmedData);
    return result;
  } catch (error) {
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    return;
  }
}
export async function reduceDomain(unTrimmedData: DashboardDomain[]): Promise<DashboardDomain[]> {
  const trimmedData: DashboardDomain[] = [{ day: [] as string[], domain: [] as string[], total: [] as number[] }];
  for (let i = 0; i < unTrimmedData[0].domain.length; i++) {
    const filteredDomain = unTrimmedData[0].domain[i];
    const filteredTotal = unTrimmedData[0].total[i];
    if (filteredDomain !== '') {
      if (trimmedData[0].domain.includes(filteredDomain)) {
        const index = trimmedData[0].domain.indexOf(filteredDomain);
        trimmedData[0].total[index] += filteredTotal;
      } else {
        trimmedData[0].domain.push(filteredDomain);
        trimmedData[0].total.push(filteredTotal);
      }
    }
  }
  return trimmedData;
}
export async function setFormat_Domain(actual_data: IAutodigiWebStatsEachDay[]): Promise<DashboardDomain[]> {
  const item_stats_default = return_default_stats();
  const return_webstat: DashboardDomain[] = [{ day: [] as string[], domain: [] as string[], total: [] as number[] }];
  for (let index = 0; index < actual_data.length; index++) {
    const item_day = actual_data[index];
    const date = dayjs(item_day.createdate).format('YYYY-MM-DD');
    return_webstat[0].day.push(date);
    await check_Condition(item_stats_default, item_day, return_webstat, date);
  }

  return return_webstat;
}
async function check_Condition(item_stats_default: unknown[], item_day: IAutodigiWebStatsEachDay, return_webstat: DashboardDomain[], createdate: string) {
  if (item_day.stats.length > 0) {
    for (let item_stats = 0; item_stats < item_day.stats.length; item_stats++) {
      if (item_day.stats[item_stats].category === 'GATEWAYS') {
        await setFormat_Domain_Toltal(return_webstat, item_day.stats[item_stats].stats_detail, createdate);
      }
    }
  }
}
async function setFormat_Domain_Toltal(return_webstat: DashboardDomain[], stats_detail: IAutodigiWebStatsTypeDetail[], createdate: string) {
  let stats = 0;
  let domain = '';
  if (stats_detail[0].visitor[0].reference) {
    if (stats_detail[0].visitor[0].reference.length > 0) {
      stats = stats_detail[0].visitor[0].reference[0].stats[0].new + stats_detail[0].visitor[0].reference[0].stats[0].old;
      domain = stats_detail[0].visitor[0].reference[0].domain;
    }
  }

  if (!return_webstat[0].total) {
    if (return_webstat[0].total[checkIndexOfArr(return_webstat[0].day, createdate)] !== undefined) {
      return_webstat[0].total[checkIndexOfArr(return_webstat[0].day, createdate)] += stats;
      return_webstat[0].domain[checkIndexOfArr(return_webstat[0].day, createdate)] += stats;
    } else {
      return_webstat[0].total.push(stats);
      return_webstat[0].domain.push(domain);
    }
  } else {
    return_webstat[0].total.push(stats);
    return_webstat[0].domain.push(domain);
  }
}
const return_default_stats = () => {
  const name = ['Google (SEO)', 'Google (Ads)', 'Facebook', 'Display Network', 'Undetermine', 'Other', 'YouTube Videos', 'YouTube Search', 'Direct', 'Referral'];
  const item_stats_default = [];
  name.map((item) => {
    const default_data = {
      name: item,
      stats_detail: [
        {
          line: [
            {
              new: 0,
              old: 0,
              device: {
                mobile: [{ old: 0, new: 0 }],
                desktop: [{ old: 0, new: 0 }],
                tablet: [{ old: 0, new: 0 }],
                unknown: [{ old: 0, new: 0 }],
              },
            },
          ],
          call: [
            {
              new: 0,
              old: 0,
              device: {
                mobile: [{ old: 0, new: 0 }],
                desktop: [{ old: 0, new: 0 }],
                tablet: [{ old: 0, new: 0 }],
                unknown: [{ old: 0, new: 0 }],
              },
            },
          ],
          form: [
            {
              new: 0,
              old: 0,
              device: {
                mobile: [{ old: 0, new: 0 }],
                desktop: [{ old: 0, new: 0 }],
                tablet: [{ old: 0, new: 0 }],
                unknown: [{ old: 0, new: 0 }],
              },
            },
          ],
          messenger: [
            {
              new: 0,
              old: 0,
              device: {
                mobile: [{ old: 0, new: 0 }],
                desktop: [{ old: 0, new: 0 }],
                tablet: [{ old: 0, new: 0 }],
                unknown: [{ old: 0, new: 0 }],
              },
            },
          ],
          visitor: [
            {
              new: 0,
              old: 0,
              device: {
                mobile: [{ old: 0, new: 0 }],
                desktop: [{ old: 0, new: 0 }],
                tablet: [{ old: 0, new: 0 }],
                unknown: [{ old: 0, new: 0 }],
              },
              reference: [
                {
                  domain: '',
                  ipAddress: '',
                  stats: [
                    {
                      new: 0,
                      old: 0,
                    },
                  ],
                },
              ],
            },
          ],
          location: [
            {
              new: 0,
              old: 0,
              device: {
                mobile: [{ old: 0, new: 0 }],
                desktop: [{ old: 0, new: 0 }],
                tablet: [{ old: 0, new: 0 }],
                unknown: [{ old: 0, new: 0 }],
              },
            },
          ],
        },
      ],
    };
    item_stats_default.push(default_data);
  });
  return item_stats_default;
};
const checkIndexOfArr = (arr, param) => {
  return _.findIndex(arr, (o) => {
    return o === param;
  });
};
