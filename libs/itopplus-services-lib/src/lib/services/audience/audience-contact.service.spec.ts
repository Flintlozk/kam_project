import { parseTimestampToDayjs } from '@reactor-room/itopplus-back-end-helpers';
import { AudienceDomainStatus, AudienceDomainType, CustomerDomainStatus, IAudienceContacts, IAudienceMessageFilter } from '@reactor-room/itopplus-model-lib';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { AudienceContactService } from './audience-contact.service';

jest.mock('../../data');

describe('AudienceContactService', () => {
  const pageID = 91;
  const listIndex = 0;
  const skip = 5;
  const date = new Date();
  const mockData = [
    {
      a_data: {
        id: 5015,
        domain: AudienceDomainType.CUSTOMER,
        status: CustomerDomainStatus.CONFIRM_PAYMENT,
        is_notify: false,
        parent_id: null,
        is_offtime: true,
        notify_status: 'READ',
        last_platform_activity_date: date,
      },
      customer_id: 4735,
      page_id: 91,
      first_name: 'Apithana',
      name: 'Apithana Boriboonthanarak',
      last_name: 'Boriboonthanarak',
      profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=2622191497882524&height=50&width=50&ext=1636612751&hash=AeTjkAbMnaOcIMOwODA',
      platform: 'FACEBOOKFANPAGE',
      aliases: null,
    },
  ] as unknown as IAudienceContacts[];
  const mockResult = [
    {
      id: 5015,
      domain: AudienceDomainType.CUSTOMER,
      status: CustomerDomainStatus.CONFIRM_PAYMENT,
      is_notify: false,
      parent_id: null,
      is_offtime: true,
      notify_status: 'READ',
      last_platform_activity_date: date,
      customer_id: 4735,
      page_id: 91,
      first_name: 'Apithana',
      name: 'Apithana Boriboonthanarak',
      last_name: 'Boriboonthanarak',
      profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=2622191497882524&height=50&width=50&ext=1636612751&hash=AeTjkAbMnaOcIMOwODA',
      platform: 'FACEBOOKFANPAGE',
      aliases: null,
    },
  ] as unknown as IAudienceContacts[];
  const mockExpectValue = mockResult as IAudienceContacts[];

  const mockFilter = {
    searchText: '',
    tags: [],
  } as IAudienceMessageFilter;

  test('getCustomerContactList should return expect value', async () => {
    const audience = new AudienceContactService();
    mock(data, 'getCustomerContactList', jest.fn().mockResolvedValue(mockData as IAudienceContacts[]));
    const result = await audience.getCustomerContactList(pageID, listIndex, skip, mockFilter);
    expect(result).toEqual(mockExpectValue);
    expect(data.getCustomerContactList).toBeCalled();
  });

  // test('getCustomerContactList should return expect value', async () => {
  //   const audience = new AudienceContactService();
  //   mock(data, 'getCustomerContactList', jest.fn().mockResolvedValue(mockData as IAudienceContacts[]));
  //   const result = await audience.getCustomerContactList(pageID, listIndex, skip, mockFilter);
  //   expect(result).toEqual(mockExpectValue);
  //   expect(data.getCustomerContactList).toBeCalled();
  // });

  // test('getCustomerContactList should return expect value', async () => {
  //   const audience = new AudienceContactService();
  //   mock(data, 'getCustomerContactList', jest.fn().mockResolvedValue(mockData as IAudienceContacts[]));
  //   const result = await audience.getCustomerContactList(pageID, listIndex, skip, mockFilter);
  //   expect(result).toEqual(mockExpectValue);
  //   expect(data.getCustomerContactList).toBeCalled();
  // });
});
