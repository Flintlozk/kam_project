import { PurchaseOrderService } from './purchase-order.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import { OrderFilters, PurchaseOrderList, EnumPurchaseOrderStatus, PurchaseOrderStats } from '@reactor-room/itopplus-model-lib';
const purchaseOrderService = new PurchaseOrderService();
jest.mock('../../data');

describe('Purchase Order Service getAllPurchaseOrder Method', () => {
  test('Get Purchase Order By Filter Date Range', async () => {
    mock(data, 'getPoList', jest.fn().mockResolvedValue(mockReturnDataPoList()));
    const aliases = {
      pageID: 249,
      startDate: '2020-10-01',
      endDate: '2020-10-09',
      currentPage: 1,
      search: null,
      pageSize: 10,
      page: 0,
      status: '',
      orderBy: [''],
      orderMethod: '',
      exportAllRows: false,
      id: '',
    } as OrderFilters;
    const result = await purchaseOrderService.getAllPurchaseOrder(aliases, 249);
    expect(result[0].orderNo).toEqual('po123');
  });

  test('Get Purchase Order By Filter Date Range And Search', async () => {
    mock(data, 'getPoList', jest.fn().mockResolvedValue(mockReturnDataPoList()));
    const aliases = {
      pageID: 249,
      startDate: '2020-10-01',
      endDate: '2020-10-09',
      currentPage: 1,
      search: 'Pariwat',
      pageSize: 10,
      page: 0,
      status: '',
      orderBy: [''],
      orderMethod: '',
      exportAllRows: false,
      id: '',
    } as OrderFilters;
    const result = await purchaseOrderService.getAllPurchaseOrder(aliases, 249);
    expect(result[0].orderNo).toEqual('po123');
  });

  test('Get Purchase Order By Filter Date Range Export All', async () => {
    mock(data, 'getPoList', jest.fn().mockResolvedValue(mockReturnDataPoListExportAll()));
    const aliases = {
      pageID: 249,
      startDate: '2020-10-01',
      endDate: '2020-10-09',
      currentPage: 1,
      search: null,
      pageSize: 10,
      page: 0,
      status: '',
      orderBy: [''],
      orderMethod: '',
      exportAllRows: true,
      id: '',
    } as OrderFilters;
    const result = await purchaseOrderService.getAllPurchaseOrder(aliases, 249);
    expect(result[0].totalrows).toEqual(2);
  });

  test('Get Purchase Order By Filter Date Range Search Export All', async () => {
    mock(data, 'getPoList', jest.fn().mockResolvedValue(mockReturnDataPoListExportAllWithSearch()));
    const aliases = {
      pageID: 249,
      startDate: '2020-10-01',
      endDate: '2020-10-09',
      currentPage: 1,
      search: 'Pariwat',
      pageSize: 10,
      page: 0,
      status: '',
      orderBy: [''],
      orderMethod: '',
      exportAllRows: true,
      id: '',
    } as OrderFilters;
    const result = await purchaseOrderService.getAllPurchaseOrder(aliases, 249);
    expect(result[0].totalrows).toEqual(2);
  });
});

const mockReturnDataPoList = (): PurchaseOrderList[] => {
  return [
    {
      customerId: 1,
      uuid: 'abcd1234',
      audienceId: 123,
      orderNo: 'po123',
      createdOrder: '2020-10-01',
      customerName: 'Pariwat Autansai',
      customerImgUrl: 'https://itopplus.com/',
      totalPrice: '1000',
      status: EnumPurchaseOrderStatus.CLOSE_SALE,
      actionStatus: false,
      totalrows: 1,
      delivery_type: '',
      tracking_url: '',
      shipping_date: '',
      tracking_no: '',
    },
  ] as PurchaseOrderList[];
};

const mockReturnDataPoListExportAll = (): PurchaseOrderList[] => {
  return [
    {
      customerId: 1,
      uuid: 'abcd1234',
      audienceId: 123,
      orderNo: 'po123',
      createdOrder: '2020-10-01',
      customerName: 'Pariwat Autansai',
      customerImgUrl: 'https://itopplus.com/',
      totalPrice: '1000',
      status: EnumPurchaseOrderStatus.CLOSE_SALE,
      actionStatus: false,
      totalrows: 2,
      delivery_type: '',
      tracking_url: '',
      shipping_date: '',
      tracking_no: '',
    },
    {
      customerId: 2,
      uuid: 'abcd4321',
      audienceId: 321,
      orderNo: 'po321',
      createdOrder: '2020-10-01',
      customerName: 'Worawut Boontun',
      customerImgUrl: 'https://itopplus.com/',
      totalPrice: '1001',
      status: EnumPurchaseOrderStatus.CLOSE_SALE,
      actionStatus: false,
      totalrows: 2,
      delivery_type: '',
      tracking_url: '',
      shipping_date: '',
      tracking_no: '',
    },
  ] as PurchaseOrderList[];
};

const mockReturnDataPoListExportAllWithSearch = (): PurchaseOrderList[] => {
  return [
    {
      customerId: 1,
      uuid: 'abcd1234',
      audienceId: 123,
      orderNo: 'po123',
      createdOrder: '2020-10-01',
      customerName: 'Pariwat Autansai',
      customerImgUrl: 'https://itopplus.com/',
      totalPrice: '1000',
      status: EnumPurchaseOrderStatus.CLOSE_SALE,
      actionStatus: false,
      totalrows: 2,
      delivery_type: '',
      tracking_url: '',
      shipping_date: '',
      tracking_no: '',
    },
    {
      customerId: 2,
      uuid: 'abcd4321',
      audienceId: 321,
      orderNo: 'po321',
      createdOrder: '2020-10-01',
      customerName: 'Pariwat Autansai',
      customerImgUrl: 'https://itopplus.com/',
      totalPrice: '1200',
      status: EnumPurchaseOrderStatus.CLOSE_SALE,
      actionStatus: false,
      totalrows: 2,
      delivery_type: '',
      tracking_url: '',
      shipping_date: '',
      tracking_no: '',
    },
  ] as PurchaseOrderList[];
};

describe('Purchase Order Service getPoStatsCounts Method', () => {
  test('Get Po Stats Counts By Filter Date Range', async () => {
    mock(data, 'getPoStats', jest.fn().mockResolvedValue(mockReturnDatagetPoStats()));
    const aliases = {
      pageID: 249,
      startDate: '2020-10-01',
      endDate: '2020-10-09',
      currentPage: 1,
      search: null,
      pageSize: 10,
      page: 0,
      status: '',
      orderBy: [''],
      orderMethod: '',
      exportAllRows: false,
      id: '',
    } as OrderFilters;
    const result = await purchaseOrderService.getPoStatsCounts(aliases, 249);
    expect(result.all_po).toEqual(8);
  });
});

const mockReturnDatagetPoStats = (): PurchaseOrderStats => {
  return {
    all_po: 8,
    all_total: 423,
    follow_po: 2,
    follow_total: null,
    waiting_payment_po: 0,
    waiting_payment_total: null,
    confirm_po: 0,
    confirm_total: null,
    waiting_shipment_po: 1,
    waiting_shipment_total: 11,
    close_po: 1,
    close_total: 11,
    expired_po: 0,
    reject_po: 4,
  };
};
