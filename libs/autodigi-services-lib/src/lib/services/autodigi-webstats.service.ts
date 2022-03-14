import { DashboardDomain, DashboardSummary, DashboardWebstat, IAutodigiWebStats, IAutodigiWebStatsEachDay, webstatsInput } from '@reactor-room/autodigi-models-lib';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { getLinkedAutodigiWebsite, getAutodigiWebstat } from '../data/autodigi-webstat/get-autodigi-webstat.data';
import * as dayjs from 'dayjs';
import * as _ from 'lodash';
import { dashboard_Webstat } from '../domains/webstat-calculation.domain';
import { dashboard_Domain } from '../domains/dashboard-calculation-domain';
import { getSummaryDateRange } from '../domains/generic/summary-date-range';
import { dashboardSummary } from '../domains/summary-calculation.domain';

import { isAllowCaptureException, isEmpty } from '@reactor-room/itopplus-back-end-helpers';
import * as Sentry from '@sentry/node';
export class AutodigiWebstatService {
  constructor() {}
  async getAutodigiWebstats(pageID: number, subscriptionID: string, param?: webstatsInput): Promise<IAutodigiWebStats[]> {
    try {
      const pageLinks = await getLinkedAutodigiWebsite(PlusmarService.readerClient, pageID, subscriptionID);
      if (pageLinks === null || pageLinks === undefined) return;
      let startOfMonth: string;
      let endOfMonth: string;
      if (param) {
        startOfMonth = dayjs(param.start_date).startOf('month').format('YYYY-MM-DD');
        endOfMonth = dayjs(param.end_date).endOf('month').format('YYYY-MM-DD');
      } else {
        startOfMonth = dayjs().subtract(60, 'day').startOf('month').format('YYYY-MM-DD');
        endOfMonth = dayjs().endOf('month').format('YYYY-MM-DD');
      }
      const begindate = new Date(startOfMonth);
      const enddate = new Date(endOfMonth);
      begindate.setHours(0, 0, 0, 0);
      enddate.setHours(23, 59, 59, 59);
      const findParams = {
        website_id: pageLinks.autodigiID,
        createdate: {
          $gte: begindate,
          $lte: enddate,
        },
      };
      const result = await getAutodigiWebstat(findParams);
      if (result === null || result === undefined) return;
      return result;
    } catch (error) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      return;
    }
  }
  async getFormattedWebstats(data: IAutodigiWebStats[], param: webstatsInput): Promise<DashboardWebstat> {
    const result_format = await this.setStats(data);
    const result = await dashboard_Webstat(result_format, param.date_range, param.start_date, param.end_date);
    return result ? result[0] : null;
  }
  async getFormattedDomain(data: IAutodigiWebStats[], param: webstatsInput): Promise<DashboardDomain> {
    const result_format = await this.setStats(data);
    const result = await dashboard_Domain(result_format, param.date_range, param.start_date, param.end_date);
    return result ? result[0] : null;
  }
  async getFormattedSummary(data: IAutodigiWebStats[]): Promise<DashboardSummary[]> {
    const dateRange = await getSummaryDateRange();
    const result = await dashboardSummary(data, dateRange);
    return result;
  }

  async setStats(param: IAutodigiWebStats[]): Promise<IAutodigiWebStatsEachDay[]> {
    let concat_result: IAutodigiWebStatsEachDay[] = [];

    if (isEmpty(param)) return;
    if (param.length > 1) {
      param.map((item) => {
        concat_result = _.concat(concat_result, item.stats);
      });
    } else {
      concat_result = param[0].stats;
    }
    return concat_result;
  }
}
