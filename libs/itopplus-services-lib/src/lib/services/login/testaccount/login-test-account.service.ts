import { getKeysFromSession, getUTCMongo, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { IFacebookCredential, IFacebookLongLiveTokenResponse, IHTTPResult } from '@reactor-room/model-lib';
import { EnumAuthScope, IPages, IPayload, IUserCredential } from '@reactor-room/itopplus-model-lib';
import { createNewUser, getUserByID, signToken, updateLoginTime, verifyToken } from '../../../data';
import { getUserScopePermission } from '../../../data/app-scope/app-scope.data';
import { signUserRedisStore } from '../../../domains/user';
import { AuthError } from '../../../errors/auth.error';
import { LogService } from '../../log/log.service';
import { PlusmarService } from '../../plusmarservice.class';
import { UserService } from '../../user';

export class LoginTestAccountService {
  public UserService: UserService;
  public LogService: LogService;

  constructor() {
    this.UserService = new UserService();
    this.LogService = new LogService();
  }
  getUserId = (loginIndex: number): number => {
    switch (loginIndex) {
      case 2:
        return 544;
      case 3:
        return 428;
      case 6:
        return 429;
      case 61:
        return 545;
      default:
        throw new Error('PAGE_ID_NOT_MAP');
    }
  };

  loginTestAuth = async (loginIndex: number, pageIndex: number, subscriptionIndex: number, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    if (PlusmarService.environment.IS_PRODUCTION || appModule !== EnumAuthScope.SOCIAL) {
      throw new Error('QUIT!');
    }
    const credential: IFacebookCredential = {
      ID: 'no',
      name: 'User' + loginIndex,
      email: 'no',
      accessToken: PlusmarService.environment.TEST_USER_TOKEN,
      profileImg: 'https://picsum.photos/200',
    };
    pageIndex = 0;
    subscriptionIndex = 0;
    try {
      const ID = this.getUserId(loginIndex);
      const user: IUserCredential = await getUserByID(PlusmarService.readerClient, ID);
      return await this.loginTestUser(user, credential, pageIndex, subscriptionIndex, appModule);
    } catch (err) {
      //   console.log('-< err >- ', err);
      throw new AuthError(err.message);
    }
  };

  loginTestUser = async (user: IUserCredential, credential: IFacebookCredential, pageIndex: number, subscriptionIndex: number, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    return await this.updateUserLoginTime(user, credential, appModule);
  };

  updateUserLoginTime = async (user: IUserCredential, credential: IFacebookCredential, appModule: EnumAuthScope): Promise<IHTTPResult> => {
    const longLiveTokenTest = { access_token: PlusmarService.environment.TEST_USER_TOKEN } as IFacebookLongLiveTokenResponse;
    const userIDKeys = signUserRedisStore(PlusmarService.redisClient, user, credential, longLiveTokenTest, appModule);
    const token = signToken(userIDKeys, PlusmarService.environment);
    await updateLoginTime(PlusmarService.writerClient, user.id);
    await this.addAppScope(token);
    const result: IHTTPResult = { expiresAt: '', value: token, status: 200 };
    return result;
  };

  addAppScope = async (accessToken: string): Promise<void> => {
    const { value } = await verifyToken(accessToken, PlusmarService.environment);
    const redisSessionKey = value;
    if (redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const allowScope = await getUserScopePermission(PlusmarService.readerClient, userKey.userID);
      const session = {
        ...userKey,
        allowScope: allowScope,
      } as IPayload;

      await setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
    }
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
