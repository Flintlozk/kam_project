import { getDateByRange, getDiffrentDay, parseTimestampToDayjs, getFormatedTimezone, getDateDifferent } from '@reactor-room/itopplus-back-end-helpers';
import {
  CustomerOrders,
  IAliases,
  IAudienceChartsArray,
  ICustomerChartsArray,
  IDashboardAudience,
  IDashboardCustomers,
  IDashboardOrders,
  IDashboardWidgets,
  IPageCustomerSlaTimeOptions,
  PageSettingType,
  DateUnit,
  IDateGap,
} from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { valueFromAST } from 'graphql';
import {
  getDategapByDateRange,
  convertToCustomerDashboardData,
  convertToAudienceDashboardData,
  generateAudienceDateTemplate,
  filterAudienceDateTemplate,
  convertToDashbordFormat,
  convertDateTemplateToMap,
  assignMsgCountToDateTemplate,
} from '../../domains';
import {
  getDashboardCustomers,
  getDashboardLeads,
  getDashboardTotalAllCustomerByFilter,
  getDashboardTotalClosedCustomerByFilter,
  getDashboardTotalCommentAudienceByFilter,
  getDashboardTotalConfirmPaymentCustomerByFilter,
  getDashboardTotalFollowCustomerByFilter,
  getDashboardTotalInboxAudienceByFilter,
  getDashboardTotalLeadFinishedByFilter,
  getDashboardTotalLeadFollowByFilter,
  getDashboardTotalLiveAudienceByFilter,
  getDashboardTotalRevenueByFilter,
  getDashboardTotalUnpaidByFilter,
  getDashboardTotalWaitingForPaymentCustomerByFilter,
  getDashboardTotalWaitingForShipmentCustomerByFilter,
  getMessageByPageID,
} from '../../data';
import { CustomerSLAService } from '../customer/customer-sla.service';
import { PageSettingsService } from '../page-settings/page-settings.service';
import { PlusmarService } from '../plusmarservice.class';

export class DashboardService {
  public pageSettingsService: PageSettingsService;
  public customerSLAService: CustomerSLAService;
  constructor() {
    this.pageSettingsService = new PageSettingsService();
    this.customerSLAService = new CustomerSLAService();
  }

  getDashboardWidgetsByDate = async (aliases: IAliases, pageID: number, subscription): Promise<IDashboardWidgets> => {
    aliases.pageID = pageID;
    const results = await Promise.all([
      getDashboardTotalRevenueByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalUnpaidByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalAllCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      // getDashboardTotalNewCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      // getDashboardTotalOldCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalInboxAudienceByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalCommentAudienceByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalLiveAudienceByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalLeadFollowByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalLeadFinishedByFilter(PlusmarService.readerClient, aliases, subscription),
      this.customerSLAService.countExceededCustomers(pageID),
      // getDashboardTotalFollowCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      // getDashboardTotalWaitingForPaymentCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      // getDashboardTotalConfirmPaymentCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      // getDashboardTotalWaitingForShipmentCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      // getDashboardTotalClosedCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
    ]);

    const result = {
      total_revenue: results[0],
      total_unpaid: results[1],
      all_customers: results[2],
      new_customers: 0,
      old_customers: 0,
      inbox_audience: results[3],
      comment_audience: results[4],
      live_audience: results[5],
      leads_follow: results[6],
      leads_finished: results[7],
      total_sla: results[8],
      // follow_customers: 0,
      // waiting_for_payment_customers: 0,
      // confirm_payment_customers: 0,
      // waiting_for_shipment_customers: 0,
      // closed_customers: 0,
    } as IDashboardWidgets;
    return result;
  };
  getDashboardOrdersByDate = async (aliases: IAliases, pageID: number, subscription): Promise<IDashboardOrders> => {
    aliases.pageID = pageID;
    const results = await Promise.all([
      getDashboardTotalFollowCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalWaitingForPaymentCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalConfirmPaymentCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalWaitingForShipmentCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
      getDashboardTotalClosedCustomerByFilter(PlusmarService.readerClient, aliases, subscription),
    ]);

    const result = {
      follow_customers: await results[0],
      waiting_for_payment_customers: await results[1],
      confirm_payment_customers: await results[2],
      waiting_for_shipment_customers: await results[3],
      closed_customers: await results[4],
    } as IDashboardOrders;

    return result;
  };

  getDashboardCustomersByDate = async (aliases: IAliases, pageID: number): Promise<IDashboardCustomers[]> => {
    aliases.pageID = pageID;
    try {
      const startDate = aliases.startDate.split('T')[0];
      const endDate = aliases.endDate + 'T23:59:59Z';
      let dateGap: IDateGap;
      const dateDiff = getDateDifferent(startDate, endDate);
      const P1 = getDateByRange(startDate, endDate);
      const dateRange = P1.length;
      if (dateDiff === 0) {
        dateGap = { gap: 1, unit: DateUnit.HOUR };
      } else {
        dateGap = getDategapByDateRange(dateRange);
      }

      const times = getFormatedTimezone(aliases.startDate);
      aliases.startDate = startDate;
      aliases.endDate = endDate;
      const getCustomerDashboardData = await getDashboardCustomers(PlusmarService.readerClient, aliases, times, dateGap);
      const dashboard_data = convertToCustomerDashboardData(getCustomerDashboardData, dateGap);

      return dashboard_data;
    } catch (error) {
      console.log(error.message);
      throw new Error('DASHBOARD CUSTOMER ERROR');
    }
  };

  getDashboardAudienceByDate = async (aliases: IAliases, pageID: number): Promise<IDashboardAudience[]> => {
    aliases.pageID = pageID;
    try {
      const startDate = aliases.startDate.split('T')[0];
      const endDate = aliases.endDate + 'T23:59:59Z';
      const times = Number(getFormatedTimezone(aliases.startDate));
      const dateDiff = getDateDifferent(startDate, endDate);
      const P1 = getDateByRange(startDate, endDate);
      const dateRange = P1.length;
      let dateGap: IDateGap;
      if (dateDiff === 0) {
        dateGap = { gap: 1, unit: DateUnit.HOUR };
      } else {
        dateGap = getDategapByDateRange(dateRange);
      }
      let dateTemplate = generateAudienceDateTemplate(P1);
      dateTemplate = filterAudienceDateTemplate(dateTemplate, dateGap);
      let message_count = await getMessageByPageID(aliases.pageID, { startDate, endDate }, dateGap);
      message_count = convertToDashbordFormat(message_count, times, dateGap.unit === DateUnit.HOUR ? dateGap : undefined);
      const filteredItem = convertDateTemplateToMap(dateTemplate);
      const dateList = assignMsgCountToDateTemplate(message_count, dateGap, filteredItem);
      const dashbord_data = convertToAudienceDashboardData(dateList, dateGap);
      return dashbord_data;
    } catch (error) {
      console.log(error.message);
      throw new Error('DASHBOARD AUDIENCE ERROR');
    }
  };

  getDashboardLeadsByDate = async (aliases: IAliases, pageID: number, subscription): Promise<CustomerOrders[]> => {
    aliases.pageID = pageID;
    return await getDashboardLeads(PlusmarService.readerClient, aliases, subscription);
  };
}
