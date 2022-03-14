import { IGoogleCredential, IHTTPResult } from '@reactor-room/model-lib';

import { getGoogleUserByAccessToken, signToken, verifyAdminToken, verifyAllowedEmail, verifyToken } from '../../../data/login';
import { PlusmarService } from '../../plusmarservice.class';
import { compaireEmailAllSystem } from '../../../domains/auth/auth.domain';
import { getKeysFromSession, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { getUserScopePermission } from '../../../data/app-scope/app-scope.data';
import { IPayload } from '@reactor-room/itopplus-model-lib';

export class GoogleLoginService {
  async loginAuth(credential: IGoogleCredential): Promise<IHTTPResult> {
    try {
      const userAccount = await verifyAllowedEmail(PlusmarService.readerClient, credential);

      if (compaireEmailAllSystem(userAccount.gmail, userAccount.email, credential.email)) {
        const profileByToken = await getGoogleUserByAccessToken(credential.accessToken);
        if (compaireEmailAllSystem(userAccount.gmail, userAccount.email, profileByToken.data.email)) {
          //TODO: Follow credential save to Context
          const token = signToken(userAccount.user_id, PlusmarService.environment);
          await this.addAppScopeContext(token, credential);
        } else {
          return { status: 404, value: 'Access denied' };
        }
      } else {
        return { status: 403, value: 'Your email is not allowed for login' };
      }
    } catch (error) {
      return { status: 500, value: error.message };
    }
  }

  addAppScopeContext = async (accessToken: string, googleCredential: IGoogleCredential): Promise<void> => {
    const { value } = await verifyToken(accessToken, PlusmarService.environment);
    const redisSessionKey = value;
    if (redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const allowScope = await getUserScopePermission(PlusmarService.readerClient, userKey.userID);
      const session = {
        ...userKey,
        allowScope,
        googleCredential,
      } as IPayload;
      // TODO:

      await setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
    }
  };

  async verifyAuth(token: string): Promise<IHTTPResult> {
    const result = await verifyAdminToken(token, PlusmarService.environment);
    return result;
  }
}
