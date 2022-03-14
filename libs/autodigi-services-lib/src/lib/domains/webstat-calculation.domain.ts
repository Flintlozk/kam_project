import { DashboardWebstat, IAutodigiWebStatsEachDay, IAutodigiWebStatsTypeDetail } from '@reactor-room/autodigi-models-lib';
import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import { checking_date_range } from './generic/check-date-range';
import { reduceClicksValues, reduceGatewayValues } from './generic/reduce-summary';

export async function dashboard_Webstat(
  concat_result: IAutodigiWebStatsEachDay[],
  date_range: string,
  custom_date_from: string,
  custom_date_to: string,
): Promise<DashboardWebstat[]> {
  let actual_data: IAutodigiWebStatsEachDay[];
  try {
    const condition = checking_date_range(date_range, custom_date_from, custom_date_to);
    actual_data = _.filter(concat_result, (item) => {
      const start_date = new Date(condition.start_date);
      const end_date = new Date(condition.end_date);
      return item.createdate >= start_date && item.createdate <= end_date;
    });

    const result = await setFormat_Webstat(actual_data);
    result[0].click[0] = await reduceClicksValues(result[0].day, result[0].click[0]);
    result[0].clickday = result[0].day;
    result[0].visitor_gateway[0] = await reduceGatewayValues(result[0].day, result[0].visitor_gateway[0]);

    return result;
  } catch (error) {
    if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
    return;
  }
}

export async function setFormat_Webstat(actual_data: IAutodigiWebStatsEachDay[]): Promise<DashboardWebstat[]> {
  const item_stats_default = return_default_stats();
  const return_webstat: DashboardWebstat[] = [
    {
      day: [] as string[],
      visitor_total: [
        {
          new: [] as number[],
          return: [] as number[],
          total: [] as number[],
          mobile: [] as number[],
          tablet: [] as number[],
          desktop: [] as number[],
          unknown: [] as number[],
        },
      ],
      visitor_gateway: [
        {
          google_seo: [] as number[],
          google_ads: [] as number[],
          social: [] as number[],
          link: [] as number[],
          direct: [] as number[],
          displaynetwork: [] as number[],
          youtubesearch: [] as number[],
          youtubevideo: [] as number[],
          unknown: [] as number[],
          other: [] as number[],
        },
      ],
      click: [
        {
          line: [] as number[],
          messenger: [] as number[],
          form: [] as number[],
          call: [] as number[],
          location: [] as number[],
        },
      ],
    },
  ];
  for (let index = 0; index < actual_data.length; index++) {
    const item_day = actual_data[index];
    const date = dayjs(item_day.createdate).format('YYYY-MM-DD');
    return_webstat[0].day.push(date);
    await check_Condition(item_stats_default, item_day, return_webstat, date);
  }

  return return_webstat;
}

async function check_Condition(item_stats_default: unknown[], item_day: IAutodigiWebStatsEachDay, return_webstat: DashboardWebstat[], createdate: string) {
  if (item_day.stats.length > 0) {
    for (let item_stats = 0; item_stats < item_day.stats.length; item_stats++) {
      if (item_day.stats[item_stats].category === 'GATEWAYS') {
        await setFormat_Webstat_Visitor_Toltal(return_webstat, item_day.stats[item_stats].stats_detail, createdate);
        await setFormat_Webstat_By_Gateway_Name(return_webstat, item_day.stats[item_stats].name, item_day.stats[item_stats].stats_detail, item_stats_default, createdate);
        await setFormat_Webstat_Click(return_webstat, item_day.stats[item_stats].stats_detail, createdate);
      } else {
        await setFormat_WhiteOutGateway(return_webstat, item_stats_default, createdate);
      }
    }
  } else {
    await setFormat_WhiteOutGateway(return_webstat, item_stats_default, createdate);
  }
}

async function setFormat_WhiteOutGateway(return_webstat: DashboardWebstat[], item_stats_default, createdate: string) {
  await setFormat_Webstat_Visitor_Toltal(return_webstat, item_stats_default[0].stats_detail, createdate);
  await setFormat_Webstat_Click(return_webstat, item_stats_default[0].stats_detail, createdate);
  for (let item_default = 0; item_default < item_stats_default.length; item_default++) {
    await setFormat_Webstat_By_Gateway_Name(return_webstat, item_stats_default[item_default].name, item_stats_default[item_default].stats_detail, item_stats_default, createdate);
  }
}

async function setFormat_Webstat_Click(return_webstat: DashboardWebstat[], stats_detail: IAutodigiWebStatsTypeDetail[], createdate: string) {
  const field = ['line', 'messenger', 'call', 'form', 'location'];
  field.map((item) => {
    if (return_webstat[0].click[0][item] != '') {
      if (return_webstat[0].click[0][item][checkIndexOfArr(return_webstat[0].day, createdate)] !== undefined) {
        if (stats_detail[0][item] !== undefined) {
          return_webstat[0].click[0][item][checkIndexOfArr(return_webstat[0].day, createdate)] += stats_detail[0][item][0].new + stats_detail[0][item][0].old;
        } else {
          return_webstat[0].click[0][item][checkIndexOfArr(return_webstat[0].day, createdate)] += 0;
        }
      } else {
        if (stats_detail[0][item] !== undefined) {
          return_webstat[0].click[0][item].push(stats_detail[0][item][0].new + stats_detail[0][item][0].old);
        } else {
          return_webstat[0].click[0][item].push(0);
        }
      }
    } else {
      if (stats_detail[0][item] !== undefined) {
        return_webstat[0].click[0][item].push(stats_detail[0][item][0].new + stats_detail[0][item][0].old);
      } else {
        return_webstat[0].click[0][item].push(0);
      }
    }
  });
}

async function setFormat_Webstat_Visitor_Toltal(return_webstat: DashboardWebstat[], stats_detail: IAutodigiWebStatsTypeDetail[], createdate: string) {
  const field = ['new', 'return', 'total', 'mobile', 'tablet', 'desktop', 'unknown'];
  field.map((item) => {
    let stats = 0;
    switch (item) {
      case 'return': {
        stats = stats_detail[0].visitor[0].old;
        break;
      }
      case 'total': {
        stats = stats_detail[0].visitor[0].new + stats_detail[0].visitor[0].old;
        break;
      }
      case 'mobile': {
        if (stats_detail[0].visitor[0].device) {
          stats = (stats_detail[0].visitor[0].device[item][0]['new'] + stats_detail[0].visitor[0].device[item][0].old) | 0;
        }
        break;
      }
      case 'desktop': {
        if (stats_detail[0].visitor[0].device) {
          stats = (stats_detail[0].visitor[0].device[item][0]['new'] + stats_detail[0].visitor[0].device[item][0].old) | 0;
        }
        break;
      }
      case 'tablet': {
        if (stats_detail[0].visitor[0].device) {
          stats = (stats_detail[0].visitor[0].device[item][0]['new'] + stats_detail[0].visitor[0].device[item][0].old) | 0;
        }
        break;
      }
      case 'unknown': {
        if (stats_detail[0].visitor[0].device) {
          stats = (stats_detail[0].visitor[0].device[item][0]['new'] + stats_detail[0].visitor[0].device[item][0].old) | 0;
        }
        break;
      }
      default: {
        stats = stats_detail[0].visitor[0][item];
        break;
      }
    }
    if (return_webstat[0].visitor_total[0][item] != '') {
      if (return_webstat[0].visitor_total[0][item][checkIndexOfArr(return_webstat[0].day, createdate)] !== undefined) {
        return_webstat[0].visitor_total[0][item][checkIndexOfArr(return_webstat[0].day, createdate)] += stats;
      } else {
        return_webstat[0].visitor_total[0][item].push(stats);
      }
    } else {
      return_webstat[0].visitor_total[0][item].push(stats);
    }
  });
}

async function setFormat_Webstat_By_Gateway_Name(
  return_webstat: DashboardWebstat[],
  name_gateway: string,
  stats_detail: IAutodigiWebStatsTypeDetail[],
  item_stats_default: unknown[],
  createdate: string,
) {
  await push_main_gateway(return_webstat, name_gateway, stats_detail, createdate);
  await push_other_gateway(return_webstat, name_gateway, item_stats_default, createdate);
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
            },
          ],
          call: [
            {
              new: 0,
              old: 0,
            },
          ],
          form: [
            {
              new: 0,
              old: 0,
            },
          ],
          messenger: [
            {
              new: 0,
              old: 0,
            },
          ],
          visitor: [
            {
              new: 0,
              old: 0,
            },
          ],
          location: [
            {
              new: 0,
              old: 0,
            },
          ],
        },
      ],
    };
    item_stats_default.push(default_data);
  });
  return item_stats_default;
};

async function push_main_gateway(return_webstat: DashboardWebstat[], name_gateway: string, stats_detail: IAutodigiWebStatsTypeDetail[], createdate: string) {
  switch (name_gateway) {
    case 'Google (SEO)':
      setMainGateway(return_webstat, stats_detail, 'google_seo', createdate);
      break;
    case 'Google (Ads)':
      setMainGateway(return_webstat, stats_detail, 'google_ads', createdate);
      break;
    case 'Facebook':
      setMainGateway(return_webstat, stats_detail, 'social', createdate);
      break;
    case 'Referral':
      setMainGateway(return_webstat, stats_detail, 'link', createdate);
      break;
    case 'Direct':
      setMainGateway(return_webstat, stats_detail, 'direct', createdate);
      break;
    case 'Undetermine':
      setMainGateway(return_webstat, stats_detail, 'unknown', createdate);
      break;
    case 'Display Network':
      setMainGateway(return_webstat, stats_detail, 'displaynetwork', createdate);
      break;
    case 'YouTube Search':
      setMainGateway(return_webstat, stats_detail, 'youtubesearch', createdate);
      break;
    case 'YouTube Videos':
      setMainGateway(return_webstat, stats_detail, 'youtubevideo', createdate);
      break;
    case 'Other':
      setMainGateway(return_webstat, stats_detail, 'other', createdate);
      break;
  }
}

async function setMainGateway(return_webstat: DashboardWebstat[], stats_detail: IAutodigiWebStatsTypeDetail[], stats_name: string, createdate: string) {
  if (return_webstat[0].visitor_gateway[0][stats_name] != '') {
    if (return_webstat[0].visitor_gateway[0][stats_name][checkIndexOfArr(return_webstat[0].day, createdate)] !== undefined) {
      return_webstat[0].visitor_gateway[0][stats_name][checkIndexOfArr(return_webstat[0].day, createdate)] += stats_detail[0].visitor[0].new + stats_detail[0].visitor[0].old;
    } else {
      return_webstat[0].visitor_gateway[0][stats_name].push(stats_detail[0].visitor[0].new + stats_detail[0].visitor[0].old);
    }
  } else {
    return_webstat[0].visitor_gateway[0][stats_name].push(stats_detail[0].visitor[0].new + stats_detail[0].visitor[0].old);
  }
}

async function push_other_gateway(return_webstat: DashboardWebstat[], name_gateway: string, item_stats_default: unknown[], createdate: string) {
  const filter_gateway = _.filter(item_stats_default, (item) => {
    return item.name !== name_gateway;
  });
  for (let item_default = 0; item_default < filter_gateway.length; item_default++) {
    await push_main_gateway(return_webstat, filter_gateway[item_default].name, filter_gateway[item_default].stats_detail, createdate);
  }
}

const checkIndexOfArr = (arr, param) => {
  return _.findIndex(arr, (o) => {
    return o === param;
  });
};
