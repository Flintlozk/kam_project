import { IAliases } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { DashboardService } from './dashboard.service';
jest.genMockFromModule('dayjs');
jest.mock('../../data');

describe('Dashboard Service getDashboardWidgetsByDate Method', () => {
  beforeEach(() => {
    jest.fn().mockReset();
  });
  test('Get Dashboard Widgets By Filter Date Range', async () => {
    const dashboardService = new DashboardService();
    mock(data, 'getDashboardTotalRevenueByFilter', jest.fn().mockResolvedValue(199));
    mock(data, 'getDashboardTotalUnpaidByFilter', jest.fn().mockResolvedValue(1991));
    mock(data, 'getDashboardTotalAllCustomerByFilter', jest.fn().mockResolvedValue(20));
    // mock(data, 'getDashboardTotalNewCustomerByFilter', jest.fn().mockResolvedValue(10));
    // mock(data, 'getDashboardTotalOldCustomerByFilter', jest.fn().mockResolvedValue(20));
    mock(data, 'getDashboardTotalInboxAudienceByFilter', jest.fn().mockResolvedValue(25));
    mock(data, 'getDashboardTotalCommentAudienceByFilter', jest.fn().mockResolvedValue(30));
    mock(data, 'getDashboardTotalLiveAudienceByFilter', jest.fn().mockResolvedValue(51));
    mock(data, 'getDashboardTotalLeadFollowByFilter', jest.fn().mockResolvedValue(7));
    mock(data, 'getDashboardTotalLeadFinishedByFilter', jest.fn().mockResolvedValue(61));
    mock(dashboardService.customerSLAService, 'countExceededCustomers', jest.fn().mockResolvedValue(61));
    // mock(data, 'getDashboardTotalFollowCustomerByFilter', jest.fn().mockResolvedValue(50));
    // mock(data, 'getDashboardTotalWaitingForPaymentCustomerByFilter', jest.fn().mockResolvedValue(17));
    // mock(data, 'getDashboardTotalConfirmPaymentCustomerByFilter', jest.fn().mockResolvedValue(21));
    // mock(data, 'getDashboardTotalWaitingForShipmentCustomerByFilter', jest.fn().mockResolvedValue(16));
    // mock(data, 'getDashboardTotalClosedCustomerByFilter', jest.fn().mockResolvedValue(30));
    const aliases = {
      startDate: '2020-10-01',
      endDate: '2020-10-09',
    } as IAliases;
    const result = await dashboardService.getDashboardWidgetsByDate(aliases, 249, 5);
    expect(result.total_revenue).toEqual(199);
    expect(result.total_unpaid).toEqual(1991);
    // expect(result.closed_customers).toEqual(30);
  });
});

describe('Test getDashboardAudienceByDate()', () => {
  test('function should get Result as expected', async () => {
    const dashboardService = new DashboardService();
    const mockAliases: IAliases = {
      startDate: '2020-10-01T00:00:00+07:00',
      endDate: '2020-10-09',
    };
    const message_result = [
      { date: '2020-10-01', audience_per_day: 1 },
      { date: '2020-10-03', audience_per_day: 20 },
      { date: '2020-10-05', audience_per_day: 450 },
    ];
    const mocked_result = [
      { date: '01/10', audience_per_day: 1 },
      { date: '03/10', audience_per_day: 20 },
      { date: '05/10', audience_per_day: 450 },
      { date: '07/10', audience_per_day: 0 },
      { date: '09/10', audience_per_day: 0 },
    ];
    const mockPageID = 123;

    mock(data, 'getMessageByPageID', jest.fn().mockResolvedValue(message_result));
    const result = await dashboardService.getDashboardAudienceByDate(mockAliases, mockPageID);

    expect(result).toStrictEqual(mocked_result);
  });
});
