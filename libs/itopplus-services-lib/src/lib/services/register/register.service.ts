import { getKeysFromSession, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { EnumAuthError, EnumAuthScope, IPayload, IUserCredential } from '@reactor-room/itopplus-model-lib';
import { requestOTP, verifyOTP, getUserByID, updateUserOTPToken, updateUserPhoneNumberAndStatus, verifyToken } from '../../data';
import { addUserScopePermission, getUserScopePermission } from '../../data/app-scope/app-scope.data';

import { RegisterError } from '../../errors/auth.error';
import { PlusmarService } from '../plusmarservice.class';

export class RegisterService {
  sendOTP = async (accessToken: string, phoneNumber: string): Promise<IHTTPResult> => {
    const result: IHTTPResult = await requestOTP(PlusmarService.environment.THAI_BULK_APP_KEY, PlusmarService.environment.THAI_BULK_APP_SECRET, phoneNumber);
    if (!result) throw new RegisterError(EnumAuthError.REQUEST_OTP_FAILED);
    const tokenResult: IHTTPResult = await verifyToken(accessToken, PlusmarService.environment);
    if (tokenResult.status !== 200) throw new RegisterError(EnumAuthError.INVALID_TOKEN);
    const userID = Number(tokenResult.value.slice(0, -10));
    const updateUserTokenResult = await updateUserOTPToken(PlusmarService.writerClient, userID, result.value);
    return updateUserTokenResult;
  };

  validateOTP = async (accessToken: string, pin: string, phoneNumber: string): Promise<IHTTPResult> => {
    const tokenResult: IHTTPResult = await verifyToken(accessToken, PlusmarService.environment);
    if (tokenResult.status !== 200) throw new RegisterError(EnumAuthError.INVALID_TOKEN);
    const userID = Number(tokenResult.value.slice(0, -10));
    const user: IUserCredential = await getUserByID(PlusmarService.readerClient, userID);
    if (!user) throw new RegisterError('NO_USER_FROM_ID');
    if (!user.token) throw new RegisterError('NO_OTP_TOKEN');
    const result: IHTTPResult = await verifyOTP(PlusmarService.environment.THAI_BULK_APP_KEY, PlusmarService.environment.THAI_BULK_APP_SECRET, user.token, pin);

    if (!result) throw new RegisterError('VALIDATE_OTP_FAILED');
    await updateUserPhoneNumberAndStatus(PlusmarService.writerClient, userID, phoneNumber);
    await addUserScopePermission(PlusmarService.writerClient, EnumAuthScope.SOCIAL, user.id);
    const updateUserStatus = await this.updateUserActiveStatusInContext(accessToken);
    //TODO :: CREATE APP SCOPE
    return updateUserStatus;
  };

  updateUserActiveStatusInContext = async (accessToken: string): Promise<IHTTPResult> => {
    const { value: redisSessionKey, status } = await verifyToken(accessToken, PlusmarService.environment);
    if (status === 200 && redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const allowScope = await getUserScopePermission(PlusmarService.readerClient, userKey.userID);
      const session = { ...userKey, activeStatus: true, allowScope: allowScope };
      setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
      return { status: 200, value: 'Update active status success' } as IHTTPResult;
    } else {
      throw new RegisterError('UPDATE_USER_ACTIVE_STATUS_IN_CONTEXT_ERROR');
    }
  };
}
