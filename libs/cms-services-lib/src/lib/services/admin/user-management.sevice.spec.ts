import { IUserResponseData } from '@reactor-room/cms-models-lib';
import { getAllUser, setInvitationUser } from './user-management.service';
import * as data from '../../data/admin/admin.data';
jest.mock('../../data/admin/admin.data');
import { mock } from '../test/mock';
import { EnumUserAppRole } from '@reactor-room/model-lib';
describe('user-management-test-case', () => {
  test('getAllUser Success', async () => {
    const mockdata: IUserResponseData[] = [
      {
        name: 'china',
        email: 'china@hotmail.com',
        role: EnumUserAppRole.CMS_ADMIN,
      },
    ];
    mock(data, 'getAllUserService', jest.fn().mockResolvedValue(mockdata));
    const result = await getAllUser();
    expect(result[0].name).toBe(mockdata[0].name);
    expect(result[0].email).toBe(mockdata[0].email);
    expect(result[0].role).toBe(mockdata[0].role);
    expect(data.getAllUserService).toBeCalled();
  });
  test('getAllUser fail', async () => {
    const mockErrorMessage = 'Something wrong';
    let exception = false;
    mock(data, 'getAllUserService', jest.fn().mockRejectedValue(new Error(mockErrorMessage)));
    try {
      await getAllUser();
    } catch (err) {
      exception = true;
      expect(err.message).toBe('Error: ' + mockErrorMessage);
    }
    expect(exception).toBe(true);
    expect(data.getAllUserService).toBeCalled();
  });
});
