import { FacebookLoginService } from './login-facebook.service';
import { mock } from '../../../test/mock';
import * as data from '../../../data';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { PlusmarService } from '../../plusmarservice.class';
import { IFacebookCredential, IFacebookLongLiveTokenResponse, IHTTPResult } from '@reactor-room/model-lib';
import { IPages, ISubscription, IUserCredential, ILineChannelInforAPIResponse, ILineSetting, EnumAuthScope, EnumAuthError } from '@reactor-room/itopplus-model-lib';
import { AuthError } from '../../../errors/auth.error';
import * as userDomain from '../../../domains/user';
import { environmentLib } from '@reactor-room/environment-services-backend';

PlusmarService.environment = { ...environmentLib, facebookAppID: 'facebook012', facebookAppSecret: 'secret012:)', tokenKey: 'HELLO_WORLD' };
jest.mock('../../data');
jest.mock('../plusmarservice.class');
jest.mock('../../domains/user');
jest.mock('@reactor-room/itopplus-back-end-helpers');

const credential: IFacebookCredential = {
  ID: 'AA012',
  name: 'Hello world',
  email: 'hello_world@mail.com',
  accessToken: 'access_token_1234',
  profileImg: 'hello_world.jpg',
};

const appModule = EnumAuthScope.SOCIAL;
describe('favebook login auth', () => {
  const login = new FacebookLoginService();
  test('case: old user', async () => {
    mock(data, 'getUserBySID', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'oldUserLogin', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(login, 'inactiveUserLogin', jest.fn());
    mock(login, 'newUserLogin', jest.fn());

    const result = await login.facebookLoginAuth(credential, 1, 0, appModule);
    expect(data.getUserBySID).toBeCalledTimes(1);
    expect(login.oldUserLogin).toBeCalledTimes(1);
    expect(login.inactiveUserLogin).not.toBeCalled();
    expect(login.newUserLogin).not.toBeCalled();
    expect(result.status).toEqual(200);
  });

  test('case: inactive user', async () => {
    mock(data, 'getUserBySID', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '' } as IUserCredential));
    mock(login, 'oldUserLogin', jest.fn());
    mock(login, 'inactiveUserLogin', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(login, 'newUserLogin', jest.fn());

    const result = await login.facebookLoginAuth(credential, 1, 0, appModule);
    expect(data.getUserBySID).toBeCalledTimes(1);
    expect(login.oldUserLogin).not.toBeCalled();
    expect(login.inactiveUserLogin).toBeCalledTimes(1);
    expect(login.newUserLogin).not.toBeCalled();
    expect(result.status).toEqual(200);
  });

  test('case: fail', async () => {
    mock(data, 'getUserBySID', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'oldUserLogin', jest.fn().mockResolvedValueOnce(new Error('SOME_ERROR_HAPPEND')));
    mock(login, 'inactiveUserLogin', jest.fn());
    mock(login, 'newUserLogin', jest.fn());

    try {
      await login.facebookLoginAuth(credential, 1, 0, appModule);
    } catch (err) {
      expect(data.getUserBySID).toBeCalledTimes(1);
      expect(login.oldUserLogin).toBeCalledTimes(1);
      expect(login.inactiveUserLogin).not.toBeCalled();
      expect(login.newUserLogin).not.toBeCalled();
      expect(err).toStrictEqual(new AuthError('SOME_ERROR_HAPPEND'));
    }
  });
});

describe('old user login', () => {
  const login = new FacebookLoginService();
  const subscriptions: ISubscription[] = [{ id: '1234' } as ISubscription];
  const pages: IPages[] = [{ id: 1 } as IPages, { id: 2 } as IPages];

  test('case: success , have subscriptions, have pages -> add user log', async () => {
    mock(login.UserService, 'updateProfileUser', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'updateUserLoginTime', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));

    mock(data, 'getSubscriptionByUserID', jest.fn().mockResolvedValueOnce(subscriptions));
    mock(data, 'getPagesByUserIDAndSubscriptionID', jest.fn().mockResolvedValueOnce(pages));
    mock(data, 'getLineChannelSettingByPageID', jest.fn().mockResolvedValueOnce({ channeltoken: 'xxxx', channelid: 123 } as ILineSetting));
    mock(data, 'getChannelInfo', jest.fn().mockResolvedValueOnce({ premiumId: '@sss', userId: 'xxxx', pictureUrl: 'xxxx' } as ILineChannelInforAPIResponse));
    mock(data, 'setLineChannelProfileByPageID', jest.fn().mockResolvedValueOnce(123));
    mock(login, 'addUserLoginLog', jest.fn());

    const result = await login.oldUserLogin({ id: 1 } as IUserCredential, credential, 1, 0, appModule);
    expect(login.UserService.updateProfileUser).toBeCalledTimes(1);
    expect(login.updateUserLoginTime).toBeCalledTimes(1);
    expect(data.getSubscriptionByUserID).toBeCalledTimes(1);
    expect(data.getPagesByUserIDAndSubscriptionID).toBeCalledTimes(1);
    expect(data.setLineChannelProfileByPageID).toBeCalledTimes(1);
    expect(login.addUserLoginLog).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });

  test('case: success , no subscriptions -> add user log', async () => {
    mock(login.UserService, 'updateProfileUser', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'updateUserLoginTime', jest.fn().mockResolvedValueOnce({ status: 200, value: 'mockToken' } as IHTTPResult));
    mock(data, 'getSubscriptionByUserID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'getPagesByUserIDAndSubscriptionID', jest.fn());
    mock(login, 'addUserLoginLog', jest.fn());
    try {
      await login.oldUserLogin({ id: 1 } as IUserCredential, credential, 1, 0, appModule);
    } catch (err) {
      expect(err.message).toEqual(EnumAuthError.SUBSCRIPTION_NOT_FOUND + ',mockToken');
    }
  });

  test('case: success , no page', async () => {
    mock(login.UserService, 'updateProfileUser', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'updateUserLoginTime', jest.fn().mockResolvedValueOnce({ status: 200, value: 'mockToken' } as IHTTPResult));
    mock(data, 'getSubscriptionByUserID', jest.fn().mockResolvedValueOnce(subscriptions));
    mock(data, 'getPagesByUserIDAndSubscriptionID', jest.fn().mockResolvedValueOnce([]));
    mock(login, 'addUserLoginLog', jest.fn());
    try {
      await login.oldUserLogin({ id: 1 } as IUserCredential, credential, 1, 0, appModule);
    } catch (err) {
      expect(err.message).toEqual(EnumAuthError.PAGE_NOT_FOUND + ',mockToken');
    }
  });
});

describe('inactive user login', () => {
  const login = new FacebookLoginService();

  test('case: success ', async () => {
    mock(login.UserService, 'updateProfileUser', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'updateUserLoginTime', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    const result = await login.inactiveUserLogin({ id: 1 } as IUserCredential, credential, appModule);
    expect(login.UserService.updateProfileUser).toBeCalledTimes(1);
    expect(login.updateUserLoginTime).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});

describe('new user login', () => {
  const login = new FacebookLoginService();
  test('case: success ', async () => {
    mock(data, 'createNewUser', jest.fn().mockResolvedValueOnce({ sid: '12321', tel: '0999999999' } as IUserCredential));
    mock(login, 'updateUserLoginTime', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    const result = await login.newUserLogin(credential, appModule);
    expect(data.createNewUser).toBeCalledTimes(1);
    expect(login.updateUserLoginTime).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});

describe('update user login time', () => {
  const login = new FacebookLoginService();
  test('case: success ', async () => {
    mock(helpers, 'getFacebookLongLiveAccessToken', jest.fn().mockResolvedValueOnce({ access_token: '1213aa' } as IFacebookLongLiveTokenResponse));
    mock(userDomain, 'signUserRedisStore', jest.fn().mockResolvedValueOnce('Success'));
    mock(data, 'signToken', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'updateLoginTime', jest.fn());
    mock(login, 'addAppScope', jest.fn());
    const result = await login.updateUserLoginTime({ id: 1 } as IUserCredential, credential, appModule);
    expect(helpers.getFacebookLongLiveAccessToken).toBeCalledTimes(1);
    expect(userDomain.signUserRedisStore).toBeCalledTimes(1);
    expect(login.addAppScope).toBeCalledTimes(1);
    expect(data.signToken).toBeCalledTimes(1);
    expect(data.signToken).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });
});
