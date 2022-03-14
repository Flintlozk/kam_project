import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceLeadContext,
  CustomerDomainStatus,
  EnumBankAccountType,
  IAgent,
  IAliases,
  IAudience,
  IAudienceWithCustomer,
  IAudienceWithPurchasing,
  IPayload,
  IUserCredential,
  PaidFilterEnum,
} from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import * as audienceData from '../../data/audience';
import { mock } from '../../test/mock';
import { NotificationService } from '../notification/notification.service';
import { PlusmarService } from '../plusmarservice.class';
import { AudienceService } from './audience.service';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { RedisClient } from 'redis';
import { RedisPubSub } from 'graphql-redis-subscriptions';

let audienceService = new AudienceService();
let notificationService = new NotificationService();
jest.mock('../../data');
jest.mock('../../data/audience');
jest.mock('../notification/notification.service');
jest.mock('../../data/audience-history');
jest.mock('@reactor-room/itopplus-back-end-helpers');

const mockPurchaseOrder = (status: CustomerDomainStatus, paidType: string): IAudienceWithPurchasing[] => {
  return [
    {
      bank_account_id: '',
      bank_account_name: '',
      bank_type: EnumBankAccountType.BAY,
      created_at: new Date('2020-09-22T16:17:06.780Z'),
      delivery_fee: 0,
      domain: 'CUSTOMER',
      first_name: 'Walter',
      flat_rate: false,
      id: 717,
      interested_product: '',
      is_paid: paidType === PaidFilterEnum.PAID ? true : false,
      last_name: 'O Brien',
      logistic_name: '',
      logistic_type: '',
      orderno: 111,
      page_id: 249,
      payment_name: '',
      payment_type: '',
      product_amount: 0,
      profile_pic: '',
      psid: '3176156765839703',
      status:
        status === CustomerDomainStatus.FOLLOW
          ? 'FOLLOW'
          : status === CustomerDomainStatus.WAITING_FOR_PAYMENT
          ? 'WAITING_FOR_PAYMENT'
          : status === CustomerDomainStatus.CONFIRM_PAYMENT
          ? 'CONFIRM_PAYMENT'
          : status === CustomerDomainStatus.WAITING_FOR_SHIPMENT
          ? 'WAITING_FOR_SHIPMENT'
          : 'CLOSED',
      total_price: 0,
      totalrows: 1,
      tracking_no: '',
      updated_at: new Date('2020-10-07T08:34:07.516Z'),
      isNew: false,
      shipping_fee: 0,
    },
  ] as IAudienceWithPurchasing[];
};

const mockAudienceFollowPage = (): IAudienceWithCustomer[] => {
  return <IAudienceWithCustomer[]>[
    {
      id: 880,
      first_name: 'Pariwat',
      last_name: 'Autansai',
      score: 50,
      page_id: 249,
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.FOLLOW,
      created_at: new Date('2020-10-13 09:44:41'),
      updated_at: new Date('2020-10-13 09:44:41'),
      last_platform_activity_date: new Date('2020-10-13 10:18:18'),
      profile_pic: '',
      totalrows: 1,
      latestComment: {
        _id: '',
        allowReply: false,
        attachment: null,
        isReply: false,
        source: '',
        audienceID: 880,
        commentID: '2665355050444640_2671386109841534',
        createdAt: new Date('2020-10-13 09:44:41'),
        pageID: 249,
        payload: '',
        postID: '5f7c5fbfd8e4187cd5d0c89f',
        sentBy: 'AUDIENCE',
        text: '777799999',
      },
      latestMessage: {
        attachments: null,
        audienceID: 880,
        createdAt: '1602646661732',
        mid: 'm_S2PEBdb6nkOPlxEydoU_KXi_zGpqrLZx0vtnYZy7o3x5jU3x3lbXq3gUEh7MQ73aILT3SmcMdeyZbuaZkHvHcw',
        pageID: 249,
        sentBy: 'PAGE',
        text: 'hi pariwat',
      },
    },
  ];
};

const subscriptionID = '0c95fb96-3061-4c48-90b0-1ffb04cf29ac';

describe('Audience Service setLastPlatformActivityDate Method', () => {
  beforeEach(() => {
    audienceService = new AudienceService();
    notificationService = new NotificationService();
  });
  test('Set Last Platform Activity Success', async () => {
    audienceService = new AudienceService();
    mock(
      data,
      'setLastActivityPlatformDateByAudienceID',
      jest.fn().mockResolvedValue([
        {
          id: 880,
          customer_id: 473,
          page_id: 249,
          domain: AudienceDomainType.AUDIENCE,
          status: AudienceDomainStatus.FOLLOW,
          created_at: new Date('2020-10-13 09:44:41'),
          updated_at: new Date('2020-10-13 09:44:41'),
          isNew: false,
          is_notify: false,
          can_reply: true,
          parent_id: null,
          last_platform_activity_date: new Date('2020-10-13 10:18:18'),
        },
      ] as IAudience[]),
    );
    const result = await audienceService.setLastPlatformActivityDate(249, 880);
    expect(result.status).toEqual(200);
  });

  test('Set Last Platform Activity Failed', async () => {
    audienceService = new AudienceService();
    mock(data, 'setLastActivityPlatformDateByAudienceID', jest.fn().mockResolvedValueOnce({}));
    const result = await audienceService.setLastPlatformActivityDate(249, 888);
    expect(result.status).toEqual(403);
  });
});

describe('Audience Service getAudienceListWithPurchaseOrder Method', () => {
  beforeEach(() => {
    audienceService = new AudienceService();
    notificationService = new NotificationService();
  });
  test('Get Audience List With Purchase Order Status Follow', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusFollow', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.FOLLOW, PaidFilterEnum.ALL)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.FOLLOW,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('FOLLOW');
  });

  test('Get Audience List With Purchase Order Status Wait For Payment', async () => {
    audienceService = new AudienceService();
    mock(
      data,
      'getAudienceListWithPurchaseOrderStatusWaitForPayment',
      jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.WAITING_FOR_PAYMENT, PaidFilterEnum.ALL)),
    );
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.WAITING_FOR_PAYMENT,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('WAITING_FOR_PAYMENT');
  });

  test('Get Audience List With Purchase Order Status Confirm Payment', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusConfirmPayment', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CONFIRM_PAYMENT, PaidFilterEnum.ALL)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CONFIRM_PAYMENT,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('CONFIRM_PAYMENT');
  });

  test('Get Audience List With Purchase Order Status Wait For Shipment', async () => {
    audienceService = new AudienceService();
    mock(
      data,
      'getAudienceListWithPurchaseOrderStatusWaitForShipment',
      jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.WAITING_FOR_SHIPMENT, PaidFilterEnum.ALL)),
    );
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.WAITING_FOR_SHIPMENT,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('WAITING_FOR_SHIPMENT');
  });

  test('Get Audience List With Purchase Order Status Closed', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosed', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.ALL)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Search', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosedBySearch', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.ALL)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: '111',
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Export All', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosed', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.ALL)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: true,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.ALL, 249);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Customer Paid', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosed', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.PAID)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.PAID, 249);
    expect(result[0].is_paid).toEqual(true);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Customer UnPaid', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosed', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.UNPAID)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.UNPAID, 249);
    expect(result[0].is_paid).toEqual(false);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Export All Customer Paid', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosed', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.PAID)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: true,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.PAID, 249);
    expect(result[0].is_paid).toEqual(true);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Export All Customer UnPaid', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosed', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.UNPAID)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: true,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.UNPAID, 249);
    expect(result[0].is_paid).toEqual(false);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Search Customer Paid', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosedBySearch', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.PAID)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: '111',
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.PAID, 249);
    expect(result[0].is_paid).toEqual(true);
    expect(result[0].status).toEqual('CLOSED');
  });

  test('Get Audience List With Purchase Order Status Closed Search Customer UnPaid', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListWithPurchaseOrderStatusClosedBySearch', jest.fn().mockResolvedValue(mockPurchaseOrder(CustomerDomainStatus.CLOSED, PaidFilterEnum.UNPAID)));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: '111',
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.created_at'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.CLOSED,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceListWithPurchaseOrder(alases, PaidFilterEnum.UNPAID, 249);
    expect(result[0].is_paid).toEqual(false);
    expect(result[0].status).toEqual('CLOSED');
  });
});

describe('Audience Service getAudienceListStatusFollow Method', () => {
  beforeEach(() => {
    audienceService = new AudienceService();
    notificationService = new NotificationService();
  });
  test('Get Audience List Follow Status', async () => {
    audienceService = new AudienceService();

    mock(data, 'getAudienceListStatusFollow', jest.fn().mockResolvedValue(mockAudienceFollowPage()));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: null,
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.last_platform_activity_date'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.AUDIENCE],
      status: CustomerDomainStatus.FOLLOW,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceList(alases, 249);
    expect(result[0].id).toEqual(880);
  });

  test('Get Audience List Follow Status By Search', async () => {
    audienceService = new AudienceService();
    mock(data, 'getAudienceListStatusFollow', jest.fn().mockResolvedValue(mockAudienceFollowPage()));
    const alases = {
      tags: [],
      startDate: '2020-08-07',
      endDate: '2020-10-15',
      search: 'Pariwat',
      pageSize: 10,
      currentPage: 1,
      orderBy: ['a.last_platform_activity_date'],
      orderMethod: 'desc',
      domain: [AudienceDomainType.CUSTOMER],
      status: CustomerDomainStatus.FOLLOW,
      exportAllRows: false,
    } as IAliases;
    const result = await audienceService.getAudienceList(alases, 249);
    expect(result[0].first_name).toEqual('Pariwat');
  });
});

describe('Audience Service : getAudienceByID()', () => {
  beforeEach(() => {
    audienceService = new AudienceService();
    notificationService = new NotificationService();
  });
  test('getAudienceByID() should not return null', async () => {
    const _mockAudience = {
      is_notify: false,
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.FOLLOW,
      agentList: [],
    } as IAudience;

    mock(data, 'getAudienceByID', jest.fn().mockResolvedValueOnce(_mockAudience));
    mock(audienceService, 'getAudienceAgentList', jest.fn().mockResolvedValueOnce([] as IAgent[]));
    const result = await audienceService.getAudienceByID(1, 1, { pageID: 1, name: 'Admin Name' }, 'asdf');
    expect(result).not.toBeNull();
  });

  test('getAudienceByID() should return as expect _mockAudience', async () => {
    audienceService = new AudienceService();
    const _mockAudience = {
      is_notify: false,
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.FOLLOW,
      agentList: [],
    } as IAudience;

    mock(data, 'getAudienceByID', jest.fn().mockResolvedValueOnce(_mockAudience));
    mock(audienceService, 'getAudienceAgentList', jest.fn().mockResolvedValueOnce([] as IAgent[]));
    const result = await audienceService.getAudienceByID(1, 1, { pageID: 1, name: 'Admin Name' }, 'asdf');
    expect(result).toEqual(_mockAudience);
  });
});

describe('Audience Service : getAudienceAgentList()', () => {
  PlusmarService.redisStoreClient = {
    DEL: (key: string) => jest.fn() as unknown,
    LPUSH: (key: string, item: string) => jest.fn() as unknown,
    LTRIM: (key: string, first: number, second: number) => jest.fn() as unknown,
  } as RedisClient;

  PlusmarService.pubsub = { publish: jest.fn() } as unknown as RedisPubSub;

  test('Get Audience Agent list, audience already have agent and user is new agent', async () => {
    audienceService = new AudienceService();

    mock(audienceService.audienceContactService, 'removeExpiredRedis', jest.fn());
    mock(
      audienceData,
      'getAgentsFromRedis',
      jest
        .fn()
        .mockResolvedValue([{ user_id: '1', token: 'asdfasdsa' } as IAgent])
        .mockResolvedValue([{ user_id: '1' } as IAgent]),
    );
    mock(PlusmarService.redisStoreClient, 'DEL', jest.fn());
    mock(PlusmarService.redisStoreClient, 'LPUSH', jest.fn());
    mock(PlusmarService.redisStoreClient, 'LTRIM', jest.fn());

    const result = await audienceService.getAudienceAgentList('asdf', 1, { id: 1 } as IUserCredential, 1);
    expect(audienceService.audienceContactService.removeExpiredRedis).toBeCalledTimes(1);
    expect(audienceData.getAgentsFromRedis).toBeCalledTimes(2);
    expect(PlusmarService.redisStoreClient.DEL).not.toBeCalled();
    expect(PlusmarService.redisStoreClient.LPUSH).toBeCalledTimes(1);
    expect(PlusmarService.redisStoreClient.LTRIM).toBeCalledTimes(1);
    expect(result[0].user_id).toEqual('1');
  });

  test('Get Audience Agent list, audience already have agent and user is new agent', async () => {
    audienceService = new AudienceService();

    mock(audienceService.audienceContactService, 'removeExpiredRedis', jest.fn());
    mock(
      audienceData,
      'getAgentsFromRedis',
      jest
        .fn()
        .mockResolvedValueOnce([{ user_id: '2', token: 'asdf' } as IAgent, { user_id: '3', token: 'bbbb' } as IAgent])
        .mockResolvedValueOnce([{ user_id: '3' } as IAgent]),
    );
    mock(PlusmarService.redisStoreClient, 'DEL', jest.fn());
    mock(PlusmarService.redisStoreClient, 'LPUSH', jest.fn());
    mock(PlusmarService.redisStoreClient, 'LTRIM', jest.fn());

    const result = await audienceService.getAudienceAgentList('asdf', 1, { id: 2 } as IUserCredential, 1);
    expect(audienceService.audienceContactService.removeExpiredRedis).toBeCalledTimes(1);
    expect(audienceData.getAgentsFromRedis).toBeCalledTimes(2);
    expect(PlusmarService.redisStoreClient.DEL).toBeCalledTimes(1);
    expect(PlusmarService.redisStoreClient.LPUSH).toBeCalledTimes(2);
    expect(PlusmarService.redisStoreClient.LTRIM).toBeCalledTimes(1);
    expect(result[0].user_id).toEqual('3');
  });
});

describe('Audience Service : updateAudienceStatus()', () => {
  test('should call and return expected value', async () => {
    audienceService = new AudienceService();
    notificationService = new NotificationService();
    audienceService = new AudienceService();
    PlusmarService.writerClient = {} as unknown as Pool;
    const payload = { pageID: 5, name: '5555NAME', userID: 555 } as IPayload;
    const audienceParam = {
      id: 123,
      page_id: 5,
    } as IAudience;
    const audienceID = 123;
    const _AUDIENCE = AudienceDomainType.AUDIENCE;
    const _INBOX = AudienceDomainStatus.INBOX;

    const audience = { domain: AudienceDomainType.AUDIENCE, status: AudienceDomainStatus.INBOX, id: 118, is_notify: true, name: 'NANANA' } as IAudienceWithCustomer;
    const updatedAudience = { ...audience, domain: _AUDIENCE, status: _INBOX, id: 118, is_notify: true, name: 'NANANA' } as IAudienceWithCustomer;
    mock(data, 'getAudienceByID', jest.fn().mockResolvedValue(audience));
    mock(audienceService, 'changeStatusLog', jest.fn());
    mock(audienceService.notificationService, 'toggleAudienceNotification', jest.fn());
    mock(data, 'updateAudienceDomainStatusByID', jest.fn().mockResolvedValue(audience));
    mock(data, 'updateCustomerUpdatedAt', jest.fn().mockResolvedValue(updatedAudience));
    mock(audienceService.audienceStepService, 'logAudienceHistory', jest.fn());

    const value = await audienceService.updateAudienceStatus(payload, audienceID, _AUDIENCE, _INBOX);
    expect(data.getAudienceByID).toBeCalledTimes(1);
    expect(audienceService.notificationService.toggleAudienceNotification).toBeCalledTimes(1);
    expect(data.updateAudienceDomainStatusByID).toBeCalledTimes(1);
    expect(audienceService.audienceStepService.logAudienceHistory).toBeCalledTimes(1);
    expect(audienceService.changeStatusLog).toBeCalledTimes(1);
    expect(data.updateAudienceDomainStatusByID).toBeCalledTimes(1);
    expect(value).toEqual(updatedAudience);
  });
});

describe('Audience Service : autoSetAudienceStatus()', () => {
  beforeEach(() => {
    audienceService = new AudienceService();
    notificationService = new NotificationService();
  });
  test('Incoming as Inbox,Comment should set to Follow', async () => {
    audienceService = new AudienceService();
    const payload = { imjustapayload: 'imjustapayload' } as IPayload;
    const audience = { domain: AudienceDomainType.AUDIENCE, status: AudienceDomainStatus.INBOX, id: 111 } as IAudience;
    const isInBox = true;

    mock(audienceService, 'updateAudienceStatus', jest.fn());
    await audienceService.autoSetAudienceStatus(payload, audience, isInBox);

    const _AUDIENCE = AudienceDomainType.AUDIENCE;
    const _FOLLOW = AudienceDomainStatus.FOLLOW;
    expect(audienceService.updateAudienceStatus).toBeCalledWith(payload, audience.id, _AUDIENCE, _FOLLOW);
  });
  test('Incoming as any except Inbox,Comment should turn is_notify off (parent)', async () => {
    audienceService = new AudienceService();
    PlusmarService.writerClient = {} as unknown as Pool;
    const payload = { pageID: 5 } as IPayload;
    const audienceParam = {
      id: 118,
      page_id: 5,
      domain: AudienceDomainType.AUDIENCE,
      is_notify: true,
      status: AudienceDomainStatus.FOLLOW,
    } as IAudience;
    const audience = { domain: AudienceDomainType.AUDIENCE, status: AudienceDomainStatus.FOLLOW, id: 118, is_notify: true } as IAudience;
    const isInBox = true;
    mock(audienceService.notificationService, 'toggleAudienceNotification', jest.fn().mockResolvedValue({ parent_id: 118 }));

    mock(audienceService, 'updateAudienceStatus', jest.fn());

    await audienceService.autoSetAudienceStatus(payload, audience, isInBox);

    expect(audienceService.notificationService.toggleAudienceNotification).toBeCalledWith(audienceParam, false);
  });
  test('Incoming as any except Inbox,Comment should turn is_notify on (child)', async () => {
    audienceService = new AudienceService();
    PlusmarService.writerClient = {} as unknown as Pool;
    const payload = { pageID: 5 } as IPayload;
    const audienceParam = {
      id: 118,
      page_id: 5,
      domain: AudienceDomainType.AUDIENCE,
      is_notify: true,
      status: AudienceDomainStatus.FOLLOW,
    } as IAudience;
    const audience = { domain: AudienceDomainType.AUDIENCE, status: AudienceDomainStatus.FOLLOW, id: 118, is_notify: true } as IAudience;
    const isInBox = true;

    mock(audienceService.notificationService, 'toggleAudienceNotification', jest.fn().mockResolvedValue({ parent_id: null }));
    mock(audienceService.notificationService, 'toggleChildAudienceNotification', jest.fn());

    await audienceService.autoSetAudienceStatus(payload, audience, isInBox);

    expect(audienceService.notificationService.toggleChildAudienceNotification).toBeCalledWith(audienceParam, false);
  });
  test('Incoming as any except Inbox,Comment should turn is_notify off (child)', async () => {
    audienceService = new AudienceService();
    PlusmarService.writerClient = {} as unknown as Pool;
    const payload = { pageID: 5 } as IPayload;
    const audience = { domain: AudienceDomainType.AUDIENCE, status: AudienceDomainStatus.FOLLOW, id: 118, is_notify: false } as IAudience;
    const isInBox = true;
    mock(audienceService.notificationService, 'toggleChildAudienceNotification', jest.fn());

    await audienceService.autoSetAudienceStatus(payload, audience, isInBox);

    expect(audienceService.notificationService.toggleChildAudienceNotification).not.toBeCalled();
  });

  test('getUserMadeLastChangesToStatus', async () => {
    audienceService = new AudienceService();
    PlusmarService.writerClient = {} as unknown as Pool;

    mock(data, 'getUserMadeLastChangesToStatus', jest.fn().mockResolvedValue({ id: 1, name: 'User name', created_at: '2020-11-02 07:00:39.214735' }));
    await audienceService.getUserMadeLastChangesToStatus(1, 1);
    expect(data.getUserMadeLastChangesToStatus).toBeCalled();
  });

  test('getCustomerByAudienceID', async () => {
    audienceService = new AudienceService();
    PlusmarService.writerClient = {} as unknown as Pool;

    const expectedResult = { id: 1, name: 'User name', created_at: '2020-11-02 07:00:39.214735' };
    mock(audienceData, 'getCustomerByAudienceID', jest.fn().mockResolvedValue(expectedResult));
    const result = await audienceService.getCustomerByAudienceID(1, 1);
    expect(result).toEqual(expectedResult);
    expect(audienceData.getCustomerByAudienceID).toBeCalled();
  });
  test('getAudienceLeadContext should return expect result', async () => {
    audienceService = new AudienceService();
    const expectedResult = [] as AudienceLeadContext[];
    mock(audienceData, 'getAudienceLeadContext', jest.fn().mockResolvedValue(expectedResult));
    const result = await audienceService.getAudienceLeadContext(1, 1);
    expect(result).toEqual(expectedResult[0]);
    expect(audienceData.getCustomerByAudienceID).toBeCalled();
  });

  test('getChildAudienceByAudienceId should return result with data', async () => {
    audienceService = new AudienceService();
    const expectedResult = {
      id: 1782,
      page_id: 344,
      parent_id: 1781,
      domain: 'LEADS',
      status: 'FOLLOW',
    };
    mock(audienceData, 'getChildAudienceByAudienceId', jest.fn().mockResolvedValue(expectedResult));
    const result = await audienceService.getChildAudienceByAudienceId(1781, 344);
    expect(result).toEqual(expectedResult);
    expect(audienceData.getChildAudienceByAudienceId).toBeCalled();
  });

  test('getChildAudienceByAudienceId should return expect result with empty object', async () => {
    audienceService = new AudienceService();
    const expectedResult = {};
    mock(audienceData, 'getChildAudienceByAudienceId', jest.fn().mockResolvedValue(expectedResult));
    const result = await audienceService.getChildAudienceByAudienceId(1781, 344);
    expect(result).toEqual(expectedResult);
    expect(audienceData.getChildAudienceByAudienceId).toBeCalled();
  });

  test('getAudienceByCustomerIDIncludeChild should result with data', async () => {
    audienceService = new AudienceService();
    const expectedResult = [
      {
        id: 1000,
      },
      {
        id: 1001,
      },
    ];
    mock(audienceData, 'getAudienceByCustomerIDIncludeChild', jest.fn().mockResolvedValue(expectedResult));
    const result = await audienceService.getAudienceByCustomerIDIncludeChild(344, 521);
    expect(result).toEqual(expectedResult);
    expect(audienceData.getAudienceByCustomerIDIncludeChild).toBeCalled();
  });

  test('getLastAudienceByCustomerID', async () => {
    mock(audienceData, 'getLastAudienceByCustomerID', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await audienceService.getLastAudienceByCustomerID(340, 1);
    expect(result).toEqual([{ id: 1 }]);
    expect(audienceData.getLastAudienceByCustomerID).toHaveBeenCalled();
  });

  test('getLastAudienceByCustomerID data returns object', async () => {
    mock(audienceData, 'getLastAudienceByCustomerID', await jest.fn().mockResolvedValue({ id: 1 }));
    const result = await audienceService.getLastAudienceByCustomerID(340, 1);
    expect(result).toEqual([]);
    expect(audienceData.getLastAudienceByCustomerID).toHaveBeenCalled();
  });
});

describe('Chatbox templates', () => {
  audienceService = new AudienceService();
  // PlusmarService.environment.pageKey = 'asdasdsad';
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  const imagesSets = [{ images: [{ url: 'https://heng-itopplus.com' }] }];
  test('getTemplatesByShortcut images type', async () => {
    mock(audienceData, 'getImageSetsByShortcut', await jest.fn().mockResolvedValue(imagesSets));
    const result = await audienceService.getTemplatesByShortcut('shortcut', 'images', 340, subscriptionID);
    expect(result).toEqual(imagesSets);
    expect(audienceData.getImageSetsByShortcut).toHaveBeenCalled();
  });

  test('getTemplatesByShortcut messages type', async () => {
    const imageSet = { images: [{ url: 'https://domain.com' }] };
    mock(audienceData, 'getTemplatesByShortcut', await jest.fn().mockResolvedValue([imageSet]));
    const result = await audienceService.getTemplatesByShortcut('shortcut', 'messages', 340, subscriptionID);
    expect(result).toEqual([imageSet]);
    expect(audienceData.getTemplatesByShortcut).toHaveBeenCalled();
  });

  test('getImageSets ', async () => {
    const imageSet = { images: [{ url: 'https://domain.com' }] };
    mock(audienceData, 'getImageSets', await jest.fn().mockResolvedValue([imageSet]));
    const result = await audienceService.getImageSets(
      340,
      { search: 'string;', currentPage: 1, pageSize: 1, orderBy: 'string;', orderMethod: 'string;', customer_tag: 'string;' },
      subscriptionID,
    );
    expect(result).toEqual([imageSet]);
    expect(audienceData.getImageSets).toHaveBeenCalled();
  });

  test('addImageSets fail', async () => {
    mock(audienceData, 'addImageSets', await jest.fn().mockResolvedValue({ status: 403, value: 'img_set_upd_err' }));
    mock(audienceData, 'sendImageSet', await jest.fn().mockResolvedValue({ status: 200, value: { attachment_id: 'asdsdsfddfs' } }));
    mock(helpers, 'cryptoDecode', jest.fn().mockReturnValueOnce('aasd'));
    mock(audienceService.fileService, 'saveImageSetToStorage', jest.fn());
    mock(audienceService.fileService, 'uploadAttachmentSets', jest.fn().mockResolvedValue({ failedList: [], list: [] }));
    const result = await audienceService.addImageSets(
      340,
      { images: [{ url: 'string', extension: 'jpg', attachment_id: '13123123', filename: 'string.jpg' }], shortcut: 'string;', id: 1 },
      'pageUUID',
      // eslint-disable-next-line max-len
      '602fc5cf05d21e305713feabafa681db142c55fefb9bb2f9795fe1a4e886841091050980a39a8e59cf534815e1410dbc576c036b8391598a52f36d7ba19143da804345c967b5e5121e676cbd14bf3b4c8d8bbd0b2c502bd8b3ff0e2a5186969571e1f1a937d67267a9c4d1b59807f51a3115bf9261b47f4ed436d7dc3aedb5ae1e827e4b28b524f5365f2bcc7e145f099825662631353f96043619c1234d75676d3fa5885029435a35ff66729fe85207bd655d1ea1b28705',
      subscriptionID,
    );
    expect(result).toEqual({ status: 403, value: 'img_set_upd_err', failedList: [] });
    expect(audienceData.addImageSets).not.toHaveBeenCalled();
  });

  test('deleteImageSets fail', async () => {
    mock(audienceData, 'deleteImageSets', await jest.fn().mockResolvedValue({}));
    const result = await audienceService.deleteImageSets(340, 1);
    expect(result).toEqual({
      status: 403,
      value: 'img_set_del_err',
    });
    expect(audienceData.deleteImageSets).toHaveBeenCalled();
  });

  test('deleteImageSets success', async () => {
    mock(audienceData, 'deleteImageSets', await jest.fn().mockResolvedValue([]));
    const result = await audienceService.deleteImageSets(340, 1);
    expect(result).toEqual({ status: 200, value: 'img_set_del_scc' });
    expect(audienceData.deleteImageSets).toHaveBeenCalled();
  });

  test('deleteImageFromSet success', async () => {
    mock(audienceData, 'deleteImageFromSet', await jest.fn().mockResolvedValue([]));
    const result = await audienceService.deleteImageFromSet(340, 1, 1);
    expect(result).toEqual({ status: 200, value: 'img_set_del_scc' });
    expect(audienceData.deleteImageFromSet).toHaveBeenCalled();
  });
});
