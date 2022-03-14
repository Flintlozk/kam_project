import { getFacebookLongLiveAccessToken, getKeysFromSession, getUTCMongo, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';
import { EnumAuthError, EnumAuthScope, IPages, IPayload, IUserCredential } from '@reactor-room/itopplus-model-lib';
import {
  createNewUser,
  getChannelInfo,
  getLineChannelSettingByPageID,
  getPagesByUserIDAndSubscriptionID,
  getSubscriptionByUserID,
  getUserBySID,
  setLineChannelProfileByPageID,
  signToken,
  updateLoginTime,
  verifyToken,
} from '../../../data';
import { getAppRoleScopePermission, getUserScopePermission } from '../../../data/app-scope/app-scope.data';
import { signUserRedisStore } from '../../../domains/user';
import { AuthError } from '../../../errors/auth.error';
import { LogService } from '../../log/log.service';
import { PlusmarService } from '../../plusmarservice.class';
import { UserService } from '../../user';

export class FacebookLoginService {
  public LogService: LogService;
  public UserService: UserService;

  constructor() {
    this.UserService = new UserService();
    this.LogService = new LogService();
  }

  facebookLoginAuth = async (credential: IFacebookCredential, pageIndex: number, subscriptionIndex: number, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    try {
      const { ID } = credential;
      const user: IUserCredential = await getUserBySID(PlusmarService.readerClient, ID);
      if (user) {
        const HAVE_PHONE_NUMBER = user.tel.length > 0;
        const HAVE_SID = user.sid;
        if (HAVE_SID && HAVE_PHONE_NUMBER) {
          return await this.oldUserLogin(user, credential, pageIndex, subscriptionIndex, appModule);
        } else if (HAVE_SID && !HAVE_PHONE_NUMBER) {
          return await this.inactiveUserLogin(user, credential, appModule);
        }
      } else {
        return await this.newUserLogin(credential, appModule);
      }
    } catch (err) {
      console.log('-< err >- ', err);
      throw new AuthError(err.message);
    }
  };

  addAppScope = async (accessToken: string): Promise<void> => {
    const { value } = await verifyToken(accessToken, PlusmarService.environment);
    const redisSessionKey = value;
    if (redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const allowScope = await getUserScopePermission(PlusmarService.readerClient, userKey.userID);
      const allowAppRole = await getAppRoleScopePermission(PlusmarService.readerClient, userKey.userID);
      const session = {
        ...userKey,
        allowScope,
        allowAppRole,
      } as IPayload;
      await setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
    }
  };

  oldUserLogin = async (user: IUserCredential, credential: IFacebookCredential, pageIndex: number, subscriptionIndex: number, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    const { profileImg } = credential;
    await this.UserService.updateProfileUser(user.id, profileImg);
    const result = await this.updateUserLoginTime(user, credential, appModule);
    const subscriptions = await getSubscriptionByUserID(PlusmarService.readerClient, user.id);
    if (subscriptions) {
      let subscription = subscriptions[subscriptionIndex];
      if (!subscription) {
        subscription = subscriptions[0];
      }
      const pages: IPages[] = await getPagesByUserIDAndSubscriptionID(PlusmarService.readerClient, user.id, subscription.id);
      if (pages !== null && pages.length > 0) {
        const linesetting = await getLineChannelSettingByPageID(PlusmarService.readerClient, pages[pageIndex].id);
        if (linesetting.channeltoken !== null) {
          const lineChannelInfo = await getChannelInfo(linesetting.channeltoken, 'LOGIN');
          if (lineChannelInfo.userId !== 'INVALID_LINE_CHANNEL_ACCESS_TOKEN') {
            if (lineChannelInfo.pictureUrl !== undefined) {
              await setLineChannelProfileByPageID(PlusmarService.writerClient, lineChannelInfo.pictureUrl, pages[pageIndex].id);
            }
          } else {
            result.status = 203;
          }
        }

        const HAVE_PAGES_AND_VALID_PAGE_INDEX = pages.length > 0 && pageIndex < pages.length;
        if (HAVE_PAGES_AND_VALID_PAGE_INDEX) {
          await this.addUserLoginLog(credential, pages, pageIndex);
        }
      } else {
        throw new Error(EnumAuthError.PAGE_NOT_FOUND + ',' + result.value);
      }
    } else {
      throw new Error(EnumAuthError.SUBSCRIPTION_NOT_FOUND + ',' + result.value);
    }
    return result;
  };

  inactiveUserLogin = async (user: IUserCredential, credential: IFacebookCredential, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    const { profileImg } = credential;
    await this.UserService.updateProfileUser(user.id, profileImg);
    return await this.updateUserLoginTime(user, credential, appModule);
  };

  newUserLogin = async (credential: IFacebookCredential, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    const { ID, name, email, profileImg } = credential;
    const user: IUserCredential = await createNewUser(PlusmarService.writerClient, ID, name, email, '', profileImg);
    return await this.updateUserLoginTime(user, credential, appModule);
  };

  updateUserLoginTime = async (user: IUserCredential, credential: IFacebookCredential, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    const longLiveToken = await getFacebookLongLiveAccessToken(PlusmarService.environment.facebookAppID, PlusmarService.environment.facebookAppSecret, credential.accessToken);
    const userIDKeys = signUserRedisStore(PlusmarService.redisClient, user, credential, longLiveToken, appModule);
    const token = signToken(userIDKeys, PlusmarService.environment);
    await updateLoginTime(PlusmarService.writerClient, user.id);
    await this.addAppScope(token);
    const result: IHTTPResult = { expiresAt: '', value: token, status: 200 };
    return result;
  };

  addUserLoginLog = async (credential: IFacebookCredential, pages: IPages[], pageIndex: number): Promise<void> => {
    const page = pages[pageIndex];
    await this.LogService.addLog(
      { user_id: page.user_id, type: 'Auth', action: 'Login', description: credential.email, user_name: credential.name, created_at: getUTCMongo() },
      page.id,
    );
  };

  verifyAuth = async (token: string): Promise<IHTTPResult> => {
    const result = await verifyToken(token, PlusmarService.environment);
    return result;
  };
}
