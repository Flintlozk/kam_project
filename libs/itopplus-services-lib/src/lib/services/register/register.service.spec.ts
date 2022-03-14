import { RegisterService } from './register.service';
import { mock } from '../../test/mock';
import * as data from '../../data';
import * as dataAppScope from '../../data/app-scope/app-scope.data';
import { IHTTPResult } from '@reactor-room/model-lib';
import { PlusmarService } from '../plusmarservice.class';
import { RegisterError } from '../../errors';
import { EnumAuthError, EnumAuthScope, IUserCredential } from '@reactor-room/itopplus-model-lib';
import * as helpers from '@reactor-room/itopplus-back-end-helpers';
import { environmentLib } from '@reactor-room/environment-services-backend';

PlusmarService.environment = { ...environmentLib, THAI_BULK_APP_KEY: 'KEY', THAI_BULK_APP_SECRET: 'ITS_A_SECRET_:)', tokenKey: 'HELLO_WORLD' };
jest.mock('../../data');
jest.mock('../plusmarservice.class');
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('Send OTP', () => {
  const register = new RegisterService();
  test('Send otp success', async () => {
    mock(data, 'requestOTP', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(data, 'updateUserOTPToken', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));

    const result = await register.sendOTP('1', '0999999999');
    expect(data.requestOTP).toBeCalledTimes(1);
    expect(data.verifyToken).toBeCalledTimes(1);
    expect(data.updateUserOTPToken).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });

  test('Send otp fail: request otp failed', async () => {
    mock(data, 'requestOTP', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'verifyToken', jest.fn());
    mock(data, 'updateUserOTPToken', jest.fn());
    try {
      await register.sendOTP('1', '0999999999');
    } catch (err) {
      expect(data.requestOTP).toBeCalledTimes(1);
      expect(data.verifyToken).not.toBeCalled();
      expect(data.updateUserOTPToken).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError(EnumAuthError.REQUEST_OTP_FAILED));
    }
  });

  test('Send otp fail: invalid token', async () => {
    mock(data, 'requestOTP', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 500 } as IHTTPResult));
    mock(data, 'updateUserOTPToken', jest.fn());
    try {
      await register.sendOTP('1', '0999999999');
    } catch (err) {
      expect(data.requestOTP).toBeCalledTimes(1);
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.updateUserOTPToken).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError(EnumAuthError.INVALID_TOKEN));
    }
  });
});

describe('Validate OTP', () => {
  const register = new RegisterService();
  test('Validate OTP Success', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ token: 'igottoken' } as IUserCredential));
    mock(data, 'verifyOTP', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'updateUserPhoneNumberAndStatus', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(register, 'updateUserActiveStatusInContext', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(dataAppScope, 'addUserScopePermission', jest.fn().mockResolvedValue(true));

    const result = await register.validateOTP('accesstoken012', '1234', '0999999999');
    expect(data.verifyToken).toBeCalledTimes(1);
    expect(data.getUserByID).toBeCalledTimes(1);
    expect(data.verifyOTP).toBeCalledTimes(1);
    expect(data.updateUserPhoneNumberAndStatus).toBeCalledTimes(1);
    expect(register.updateUserActiveStatusInContext).toBeCalledTimes(1);
    expect(dataAppScope.addUserScopePermission).toBeCalledTimes(1);
    expect(result.status).toEqual(200);
  });

  test('Validate otp fail: invalid token', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 500 } as IHTTPResult));
    mock(data, 'getUserByID', jest.fn());
    mock(data, 'verifyOTP', jest.fn());
    mock(data, 'updateUserPhoneNumberAndStatus', jest.fn());
    mock(register, 'updateUserActiveStatusInContext', jest.fn());
    try {
      await register.validateOTP('accesstoken012', '1234', '0999999999');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getUserByID).not.toBeCalled();
      expect(data.verifyOTP).not.toBeCalled();
      expect(data.updateUserPhoneNumberAndStatus).not.toBeCalled();
      expect(register.updateUserActiveStatusInContext).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError(EnumAuthError.INVALID_TOKEN));
    }
  });

  test('Validate otp fail: no user from id', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'verifyOTP', jest.fn());
    mock(data, 'updateUserPhoneNumberAndStatus', jest.fn());
    mock(register, 'updateUserActiveStatusInContext', jest.fn());
    try {
      await register.validateOTP('accesstoken012', '1234', '0999999999');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getUserByID).toBeCalledTimes(1);
      expect(data.verifyOTP).not.toBeCalled();
      expect(data.updateUserPhoneNumberAndStatus).not.toBeCalled();
      expect(register.updateUserActiveStatusInContext).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError('NO_USER_FROM_ID'));
    }
  });

  test('Validate otp fail: user does not have token', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ token: null } as IUserCredential));
    mock(data, 'verifyOTP', jest.fn());
    mock(data, 'updateUserPhoneNumberAndStatus', jest.fn());
    mock(register, 'updateUserActiveStatusInContext', jest.fn());
    try {
      await register.validateOTP('accesstoken012', '1234', '0999999999');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getUserByID).toBeCalledTimes(1);
      expect(data.verifyOTP).not.toBeCalled();
      expect(data.updateUserPhoneNumberAndStatus).not.toBeCalled();
      expect(register.updateUserActiveStatusInContext).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError('NO_OTP_TOKEN'));
    }
  });

  test('Validate otp fail: validate otp fail', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ token: 'igottoken' } as IUserCredential));
    mock(data, 'verifyOTP', jest.fn().mockResolvedValueOnce(null));
    mock(data, 'updateUserPhoneNumberAndStatus', jest.fn());
    mock(register, 'updateUserActiveStatusInContext', jest.fn());
    try {
      await register.validateOTP('accesstoken012', '1234', '0999999999');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getUserByID).toBeCalledTimes(1);
      expect(data.verifyOTP).toBeCalledTimes(1);
      expect(data.updateUserPhoneNumberAndStatus).not.toBeCalled();
      expect(register.updateUserActiveStatusInContext).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError('VALIDATE_OTP_FAILED'));
    }
  });

  test('Validate otp fail: fail from updateUserActiveStatusInContext fail', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(data, 'getUserByID', jest.fn().mockResolvedValueOnce({ token: 'igottoken' } as IUserCredential));
    mock(data, 'verifyOTP', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(data, 'updateUserPhoneNumberAndStatus', jest.fn().mockResolvedValueOnce({ status: 200 } as IHTTPResult));
    mock(register, 'updateUserActiveStatusInContext', jest.fn().mockResolvedValueOnce(new RegisterError('UPDATE_USER_ACTIVE_STATUS_IN_CONTEXT_ERROR')));
    try {
      await register.validateOTP('accesstoken012', '1234', '0999999999');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(data.getUserByID).toBeCalledTimes(1);
      expect(data.verifyOTP).toBeCalledTimes(1);
      expect(data.updateUserPhoneNumberAndStatus).toBeCalledTimes(1);
      expect(register.updateUserActiveStatusInContext).toBeCalledTimes(1);
      expect(err).toStrictEqual(new RegisterError('UPDATE_USER_ACTIVE_STATUS_IN_CONTEXT_ERROR'));
    }
  });
});

describe('Update user active status in context', () => {
  const register = new RegisterService();
  test('Update active user status in context success', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 200, value: '123895AA54698' } as IHTTPResult));
    mock(helpers, 'getKeysFromSession', jest.fn().mockResolvedValueOnce({ status: 200 } as any));
    mock(dataAppScope, 'getUserScopePermission', jest.fn().mockResolvedValueOnce([] as EnumAuthScope[]));
    mock(helpers, 'setSessionValue', jest.fn().mockResolvedValueOnce({ status: 200 } as any));

    const result = await register.updateUserActiveStatusInContext('iamtoken');
    expect(result.status).toEqual(200);

    expect(data.verifyToken).toBeCalledTimes(1);
    expect(helpers.getKeysFromSession).toBeCalledTimes(1);
    expect(dataAppScope.getUserScopePermission).toBeCalledTimes(1);
    expect(helpers.setSessionValue).toBeCalledTimes(1);
  });

  test('Update active user status in context fail: update user status err from status 500', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce({ status: 500 } as IHTTPResult));
    mock(helpers, 'getKeysFromSession', jest.fn());
    mock(helpers, 'setSessionValue', jest.fn());
    try {
      await register.updateUserActiveStatusInContext('iamtoken');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(helpers.getKeysFromSession).not.toBeCalled();
      expect(helpers.setSessionValue).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError('UPDATE_USER_ACTIVE_STATUS_IN_CONTEXT_ERROR'));
    }
  });

  test('Update active user status in context fail: update user status err invalid token', async () => {
    mock(data, 'verifyToken', jest.fn().mockResolvedValueOnce(new Error(EnumAuthError.INVALID_TOKEN)));
    mock(helpers, 'getKeysFromSession', jest.fn());
    mock(helpers, 'setSessionValue', jest.fn());
    try {
      await register.updateUserActiveStatusInContext('iamtoken');
    } catch (err) {
      expect(data.verifyToken).toBeCalledTimes(1);
      expect(helpers.getKeysFromSession).not.toBeCalled();
      expect(helpers.setSessionValue).not.toBeCalled();
      expect(err).toStrictEqual(new RegisterError('UPDATE_USER_ACTIVE_STATUS_IN_CONTEXT_ERROR'));
    }
  });
});
