import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudienceDomainStatus, AudienceDomainType, IAudience, IAudienceDomainStatus, IAudienceStepExtraData, UserMemberType } from '@reactor-room/itopplus-model-lib';
import { Pool } from 'pg';
import { PlusmarService } from '..';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { AudienceStepService } from './audience-step.service';
jest.mock('../../data');
jest.mock('../../data/audience');
const audienceStepService = new AudienceStepService();
describe('AudienceStepService -> getUserType function', () => {
  test('getUserType - if user id is null', async () => {
    PlusmarService.readerClient = {} as unknown as Pool;
    const response = await audienceStepService.getUserType(2, null, PlusmarService.readerClient);
    expect(response).toEqual(UserMemberType.CUSTOMER);
  });

  test('getUserType - if user is OWNER', async () => {
    PlusmarService.readerClient = {} as unknown as Pool;
    mock(data, 'getPageMappingData', jest.fn().mockResolvedValue({ role: 'OWNER' }));
    const response = await audienceStepService.getUserType(2, 1, PlusmarService.readerClient);
    expect(response).toEqual(UserMemberType.OWNER);
  });

  test('getUserType - if user is ADMIN', async () => {
    PlusmarService.readerClient = {} as unknown as Pool;
    mock(data, 'getPageMappingData', jest.fn().mockResolvedValue({ role: 'ADMIN' }));
    const response = await audienceStepService.getUserType(2, 1, PlusmarService.readerClient);
    expect(response).toEqual(UserMemberType.MEMBER_ADMIN);
  });

  test('getUserType - if user is STAFF', async () => {
    PlusmarService.readerClient = {} as unknown as Pool;
    mock(data, 'getPageMappingData', jest.fn().mockResolvedValue({ role: 'STAFF' }));
    const response = await audienceStepService.getUserType(2, 1, PlusmarService.readerClient);
    expect(response).toEqual(UserMemberType.MEMBER_STAFF);
  });
  test('getUserType - if user is SYSTEM', async () => {
    PlusmarService.readerClient = {} as unknown as Pool;
    mock(data, 'getPageMappingData', jest.fn().mockResolvedValue({ role: '1' }));
    const response = await audienceStepService.getUserType(2, 1, PlusmarService.readerClient);
    expect(response).toEqual(UserMemberType.SYSTEM);
  });
});

describe('AudienceStepService -> getAudienceHistoryExtraDataForStep', () => {
  test('check function response', async () => {
    const domainData: IAudienceDomainStatus = {
      domain: AudienceDomainType.CUSTOMER,
      status: AudienceDomainStatus.FOLLOW,
      previous_domain: AudienceDomainType.AUDIENCE,
      previous_status: AudienceDomainStatus.FOLLOW,
    };
    mock(audienceStepService, 'getUserType', jest.fn().mockResolvedValue('OWNER'));
    const response = await audienceStepService.getAudienceHistoryExtraDataForStep(2, 1, domainData);
    const comparedResponse: IAudienceStepExtraData = {
      user_id: 1,
      user_type: UserMemberType.OWNER,
      current_domain: AudienceDomainType.CUSTOMER,
      current_status: AudienceDomainStatus.FOLLOW,
      previous_domain: AudienceDomainType.AUDIENCE,
      previous_status: AudienceDomainStatus.FOLLOW,
    };
    expect(response).toEqual(comparedResponse);
  });
});

describe('AudienceStepService -> createAudienceHistory', () => {
  test('check function response', async () => {
    const extraData: IAudienceStepExtraData = {
      user_id: 1,
      user_type: UserMemberType.OWNER,
      current_domain: AudienceDomainType.CUSTOMER,
      current_status: AudienceDomainStatus.FOLLOW,
      previous_domain: AudienceDomainType.AUDIENCE,
      previous_status: AudienceDomainStatus.FOLLOW,
      parent_id: null,
    };
    const comparedResponse = {
      id: 1001,
      audience_id: 1000,
      page_id: 2,
      domain: AudienceDomainType.CUSTOMER,
      status: AudienceDomainStatus.FOLLOW,
      previous_domain: AudienceDomainType.AUDIENCE,
      previous_status: AudienceDomainStatus.FOLLOW,
      user_id: 1,
      parent_id: null,
      user_type: UserMemberType.OWNER,
      created_at: new Date('2020-11-02 11:16:48'),
    };
    mock(data, 'createAudienceHistoryTransaction', jest.fn());
    mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue([comparedResponse]));
    const response = await audienceStepService.createAudienceHistory(1000, 2, extraData);
    expect(response).toEqual(comparedResponse);
  });
});

describe('AudienceStepService -> logAudienceHistory', () => {
  test('check function response', async () => {
    const comparedResponse = {
      id: 1001,
      audience_id: 1000,
      page_id: 2,
      domain: AudienceDomainType.CUSTOMER,
      status: AudienceDomainStatus.FOLLOW,
      previous_domain: AudienceDomainType.AUDIENCE,
      previous_status: AudienceDomainStatus.FOLLOW,
      user_id: 1,
      parent_id: null,
      user_type: UserMemberType.OWNER,
      created_at: new Date('2020-11-02 11:16:48'),
    };

    const currentAudience = {
      domain: AudienceDomainType.AUDIENCE,
      status: AudienceDomainStatus.FOLLOW,
    } as IAudience;

    const updatedAudience = {
      domain: AudienceDomainType.CUSTOMER,
      status: AudienceDomainStatus.FOLLOW,
    } as IAudience;

    const response = await audienceStepService.logAudienceHistory({ pageID: 2, userID: 1, audienceID: 1000, currentAudience, updatedAudience });

    expect(response).toEqual(comparedResponse);
  });
});

describe('AudienceStepService -> getAudienceHistoryByAudienceID', () => {
  test('check function response', async () => {
    const comparedResponse = [
      {
        id: 1878,
        audience_id: '1246',
        page_id: '2',
        domain: 'AUDIENCE',
        status: 'INBOX',
        previous_domain: null,
        previous_status: null,
        user_id: null,
        user_type: 'CUSTOMER',
        parent_id: null,
        created_at: '2020-11-06 12:05:07',
        action_by: 'Customer',
      },
    ];
    mock(data, 'getAudienceHistoryByAudienceID', jest.fn());
    mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(comparedResponse));
    const response = await audienceStepService.getAudienceHistoryByAudienceID(2, 1246);

    expect(response).toEqual(comparedResponse);
  });
});
