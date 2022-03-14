import { PageMemberService } from './page-member.service';
import { mock } from '../../../test/mock';
import * as data from '../../../data';
import { IHTTPResult } from '@reactor-room/model-lib';
import { EnumPageMemberType, IPageMemberModel, IPageMemberToken, IPages, ISubscriptionIDObject, IUserCredential } from '@reactor-room/itopplus-model-lib';
jest.mock('@reactor-room/itopplus-back-end-helpers');

jest.mock('../../data');
jest.mock('../../domains');

jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('Remove Page Member', () => {
  const pageMemberService = new PageMemberService();
  test('Success: user have pages', async () => {
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ id: 1, sid: '123145s' } as IUserCredential));
    mock(data, 'getPageMemberByPageIDAndUserID', jest.fn().mockResolvedValueOnce({ role: EnumPageMemberType.STAFF } as IPageMemberModel));
    mock(data, 'deletePageMember', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'getSubscriptionIDByPageIDAndUserID', jest.fn().mockResolvedValueOnce({ id: '123asd' } as ISubscriptionIDObject));
    mock(data, 'getPagesByUserIDAndSubscriptionID', jest.fn().mockResolvedValueOnce([{}, {}] as IPages[]));

    const result = await pageMemberService.removePageMember(1, 1);
    expect(data.getUserByID).toBeCalledTimes(1);
    expect(data.getPageMemberByPageIDAndUserID).toBeCalledTimes(1);
    expect(data.deletePageMember).toBeCalledTimes(1);
    expect(data.getSubscriptionIDByPageIDAndUserID).toBeCalledTimes(1);
    expect(data.getPagesByUserIDAndSubscriptionID).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});

describe('Revoke Page Member By ID', () => {
  const pageMemberService = new PageMemberService();
  test('Success', async () => {
    mock(data, 'getPageMemberByPageIDAndUserID', jest.fn().mockResolvedValueOnce({ role: EnumPageMemberType.STAFF } as IPageMemberModel));
    mock(data, 'getPageMemberTokenByPageIDAndUserID', jest.fn().mockResolvedValueOnce({ id: 1 } as IPageMemberToken));
    mock(data, 'deletePageMemberToken', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'deletePageMember', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'getUserPageMappingCountByUserID', jest.fn().mockResolvedValueOnce(null));

    const result = await pageMemberService.revokePageMemberByID(1, 1);
    expect(data.getPageMemberByPageIDAndUserID).toBeCalledTimes(1);
    expect(data.getPageMemberTokenByPageIDAndUserID).toBeCalledTimes(1);
    expect(data.deletePageMemberToken).toBeCalledTimes(1);
    expect(data.deletePageMember).toBeCalledTimes(1);
    expect(data.getUserPageMappingCountByUserID).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});

describe('Revoke Page Member By Email', () => {
  const pageMemberService = new PageMemberService();
  test('Success', async () => {
    mock(data, 'getPageMemberByPageIDAndEmail', jest.fn().mockResolvedValueOnce({ role: EnumPageMemberType.STAFF } as IPageMemberModel));
    mock(data, 'getPageMemberTokenByPageIDAndUserEmail', jest.fn().mockResolvedValueOnce({ id: 1 } as IPageMemberToken));
    mock(data, 'deletePageMemberToken', jest.fn());
    mock(data, 'deletePageMemberByEmailAndPage', jest.fn());

    const result = await pageMemberService.revokePageMemberByEmail('test@mail.com', 1);
    expect(data.getPageMemberByPageIDAndEmail).toBeCalledTimes(1);
    expect(data.getPageMemberTokenByPageIDAndUserEmail).toBeCalledTimes(1);
    expect(data.deletePageMemberToken).toBeCalledTimes(1);
    expect(data.deletePageMemberByEmailAndPage).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});
