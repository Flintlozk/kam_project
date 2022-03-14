import { environmentLib } from '@reactor-room/environment-services-backend';
import { cryptoPrivateDecode, removeBearerText } from '@reactor-room/itopplus-back-end-helpers';
import { EnumUserAppRole, IFacebookCredential, IHTTPResult } from '@reactor-room/model-lib';
import { getDayTilExpired } from '@reactor-room/itopplus-back-end-helpers';
import type { EnumAppScopeType, EnumPageMemberType, IFacebookThreadUserMetadata, IGQLContext, IPayload } from '@reactor-room/itopplus-model-lib';
import { EnumAuthError, EnumAuthScope, EnumLoginType, EnumUserSubscriptionType, WebhookQueries, WebviewToken, WebviewTokenPayload } from '@reactor-room/itopplus-model-lib';
import axios from 'axios';
import dayjs from 'dayjs';
import { Request, Response } from 'express';
import * as jwt from 'jsonwebtoken';
import { RedisClient } from 'redis';
import { getRedisForWebViewToken, setRedisForWebViewToken } from '../../data/auth/auth.data';
import { signWebViewToken, validateWebViewToken } from '../../domains';
import { TokenExpired, TokenInvalid } from '../../errors/auth.error';
import { PlusmarService } from '../../itopplus-services-lib';
import { AuthError } from './auth.error';
import { AppScopeError } from '../../errors/scope.error';

export function requireScope(allowScope: EnumAuthScope[]) {
  return function (target: any): void {
    for (const key of Object.getOwnPropertyNames(target.prototype)) {
      let descriptor = Object.getOwnPropertyDescriptor(target.prototype, key);
      if (descriptor) {
        descriptor = requireLogin(allowScope)(target, key, descriptor);
        Object.defineProperty(target.prototype, key, descriptor);
      }
    }
  };
}

export function checkAppScope(allowAppScope: EnumAppScopeType): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = async function (...args: any[]) {
      const context: IGQLContext = args[2];
      const payload = await verifyAndExtractPayload(context.access_token, PlusmarService.redisClient);
      const pageAppScope = payload?.page?.page_app_scope;

      if (!pageAppScope?.length) throw new AppScopeError(EnumAuthError.PAGE_APPLICATION_SCOPE_EMPTY);
      if (!pageAppScope?.includes(allowAppScope)) throw new AppScopeError(EnumAuthError.PAGE_APPLICATION_SCOPE_NOT_ALLOW);

      const result = method.apply(this, args);
      return result;
    };
    return propertyDesciptor;
  };
}
export function checkAuthScope(allowType: EnumLoginType): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = async function (...args: any[]) {
      const argument = args[1];

      switch (allowType) {
        case EnumLoginType.FACEBOOK: {
          const credential: IFacebookCredential = argument.credential;
          const { id: sid } = await findUserProfile(credential.ID, credential.accessToken);
          if (sid !== credential.ID) throw new AuthError('AUTHENICATION_FACEBOOK_AUTH_ACCESS_VILOLENT');
        }
      }

      const result = method.apply(this, args);
      return result;
    };
    return propertyDesciptor;
  };
}
export async function findUserProfile(PSID: string, accessToken: string): Promise<IFacebookThreadUserMetadata> {
  try {
    const fields = ['id'].join(',');
    const url = `https://graph.facebook.com/v8.0/${PSID}?access_token=${accessToken}&fields=${fields}`;
    const { data } = await axios.get(url);
    return data;
  } catch (err) {
    throw new AuthError('AUTHENICATION_FACEBOOK_AUTH_FAILED');
  }
}
export function requireLogin(allowScope?: EnumAuthScope[]): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;

      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        //Mutation context from parameter
        await validateContext(context, allowScope);
        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      console.log('err: ', err);
      throw Error(err);
    }
  };
}

export async function validateContext(context: IGQLContext, allowScope?: EnumAuthScope[]) {
  const payload = await verifyAndExtractPayload(context.access_token, PlusmarService.redisClient);
  context.payload = payload;
  if (!context.payload.activeStatus) {
    throw new AuthError(EnumAuthError.INACTIVE_USER);
  }
  if (allowScope.length > 0 && context.payload?.allowScope?.length > 0) {
    // TODO: Wait for finish migrate CHECK SCOPE
    if (!verifyAllowApplicationScope(allowScope, context.payload.allowScope)) {
      throw new AuthError('APPLICATION_SCOPE_NOT_ALLOW');
    }
  } else {
    throw new AuthError('APPLICATION_SCOPE_NOT_ALLOW');
  }
}

export function requiredPagePermissionRole(
  allowPermission: EnumPageMemberType[],
): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = async function (...args: [void, void, IGQLContext]) {
      const context: IGQLContext = args[2];
      const payload = await verifyAndExtractPayload(context.access_token, PlusmarService.redisClient);
      context.payload = payload;
      if (!context.payload.activeStatus) {
        throw new AuthError(EnumAuthError.INACTIVE_USER);
      }

      if (allowPermission.length > 0) {
        if (!verifyAllowPagePermissionScope(allowPermission, context.payload?.page?.page_role)) {
          throw new AuthError('PAGE_PERMISSION_SCOPE_NOT_ALLOW');
        }
      } else {
        throw new AuthError('PAGE_PERMISSION_SCOPE_NOT_PROVIDED');
      }

      const result = method.apply(this, args);
      return result;
    };

    return propertyDesciptor;
  };
}
export function requiredPermissionRole(
  allowPermission: EnumUserSubscriptionType[],
): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = async function (...args: [void, void, IGQLContext]) {
      const context: IGQLContext = args[2];
      const payload = await verifyAndExtractPayload(context.access_token, PlusmarService.redisClient);
      context.payload = payload;
      if (!context.payload.activeStatus) {
        throw new AuthError(EnumAuthError.INACTIVE_USER);
      }

      if (allowPermission.length > 0 && context.payload?.allowScope?.length > 0) {
        if (!verifyAllowPermissionScope(allowPermission, context.payload.subscription.role)) {
          throw new AuthError('PERMISSION_SCOPE_NOT_ALLOW');
        }
      } else {
        throw new AuthError('PERMISSION_SCOPE_NOT_PROVIDED');
      }

      const result = method.apply(this, args);
      return result;
    };

    return propertyDesciptor;
  };
}

export function validateAutodigiRequest(): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    const method = propertyDesciptor.value;
    propertyDesciptor.value = async function (...args: [void, { hash: string }, IGQLContext]) {
      const context: IGQLContext = args[2];
      if (context.app_module !== EnumAuthScope.AUTODIGI) throw new AuthError('APPLICATION_REQUEST_INVALID_MODULE');

      const input = args[1];
      const inputHash = input.hash;

      try {
        cryptoPrivateDecode(PlusmarService.environment.cms.CMSPrivateKey, Buffer.from(inputHash, 'hex'));
      } catch (ex) {
        throw new AuthError('INVALID_HASH_VALIDATE');
      }

      const result = method.apply(this, args);
      return result;
    };

    return propertyDesciptor;
  };
}

export function requireAutodigiLogin(allowScope?: EnumAuthScope[]): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;

      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        if (context.app_module !== EnumAuthScope.AUTODIGI) throw new AuthError('APPLICATION_REQUEST_INVALID_MODULE');

        const payload = await verifyAndExtractPayload(context.access_token, PlusmarService.redisClient);
        context.payload = payload;
        if (!context.payload.activeStatus) {
          throw new AuthError(EnumAuthError.INACTIVE_USER);
        }
        if (allowScope.length > 0 && context.payload?.allowScope?.length > 0) {
          if (!verifyAllowApplicationScope(allowScope, context.payload.allowScope)) {
            throw new AuthError(EnumAuthError.APPLICATION_SCOPE_NOT_ALLOW);
          }
        } else {
          throw new AuthError(EnumAuthError.APPLICATION_SCOPE_NOT_ALLOW);
        }

        const result = method.apply(this, args);
        return result;
      };
      return propertyDesciptor;
    } catch (err) {
      console.log('err: ', err);
      throw Error(err);
    }
  };
}

export function requiredPermission(allowScopeList?: EnumUserAppRole[]): (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor) => PropertyDescriptor {
  return function (target: unknown, propertyName: string, propertyDesciptor: PropertyDescriptor): PropertyDescriptor {
    try {
      const method = propertyDesciptor.value;
      propertyDesciptor.value = async function (...args: any[]) {
        const context: IGQLContext = args[2];
        const payload = await verifyAndExtractPayload(context.access_token, PlusmarService.redisClient);
        context.payload = payload;
        //TO DO WAITING FOR REFACTOR THIS CODE TO CHECK CONTEXT P.TONMAN
        const isAdminCMSList = [];
        for (const allowScope of allowScopeList) {
          const isAsminCMS = await checkPermissionScope(payload.allowAppRole, allowScope);
          isAdminCMSList.push(isAsminCMS);
        }
        if (!isAdminCMSList.includes(true)) {
          throw new AuthError('APPLICATION_PERMISSION_NOT_ALLOW');
        }

        const result = method.apply(this, args);
        return result;
      };

      return propertyDesciptor;
    } catch (err) {
      console.log('err: ', err);
      throw Error(err);
    }
  };
}
async function verifyAndExtractPayload(access_token: string, redisClient: RedisClient): Promise<IPayload> {
  const token = removeBearerText(access_token);
  const verifyTokenResult = verifyToken(token);
  if (verifyTokenResult.value === EnumAuthError.INVALID_TOKEN) {
    throw new AuthError(verifyTokenResult.value);
  }

  const value = await getAccessTokenRedis(verifyTokenResult.value, redisClient);
  if (!value) {
    await removeRedisKey(verifyTokenResult.value, redisClient);
    throw new AuthError('NO_DATA_FROM_RADIS_KEY');
  }
  return value;
}
export function getAccessTokenRedis(userIDKeys: string, redisClient: RedisClient): Promise<IPayload> {
  return new Promise((resolve, reject) => {
    redisClient.get(userIDKeys, (err, val) => {
      if (err) reject(err);
      else {
        resolve(JSON.parse(val));
      }
    });
  });
}
export function removeRedisKey(userIDKeys: string, redisClient: RedisClient): Promise<number> {
  return new Promise((resolve, reject) => {
    redisClient.del(userIDKeys, (err, val) => {
      if (err) {
        reject(err);
      } else {
        resolve(val);
      }
    });
  });
}
export function verifyToken(token: string): IHTTPResult {
  let result: IHTTPResult = { value: EnumAuthError.INVALID_TOKEN, status: 500 };
  try {
    token = removeBearerText(token);
    result = { value: jwt.verify(token, environmentLib.tokenKey), status: 200 };
  } catch (err) {
    console.log(err);
  }
  return result;
}
function verifyAllowApplicationScope(allowScope: EnumAuthScope[], userScope: EnumAuthScope[]): boolean {
  for (let i = 0; i < userScope.length; i++) {
    if (allowScope.includes(userScope[i])) {
      return true;
    }
  }
  return false;
}
function verifyAllowPagePermissionScope(allowPermission: EnumPageMemberType[], permissionScope: EnumPageMemberType): boolean {
  for (let i = 0; i < permissionScope.length; i++) {
    if (allowPermission.includes(permissionScope)) {
      return true;
    }
  }
  return false;
}
function verifyAllowPermissionScope(allowPermission: EnumUserSubscriptionType[], permissionScope: EnumUserSubscriptionType): boolean {
  for (let i = 0; i < permissionScope.length; i++) {
    if (allowPermission.includes(permissionScope)) {
      return true;
    }
  }
  return false;
}
export function checkSubscriptionExpired(expriedAt: Date): void {
  if (!expriedAt) throw new Error('SUBSCRIPTION_HAVE_NO_EXPIRED_DATE');
  const dayTilExpired = getDayTilExpired(expriedAt);
  if (dayTilExpired < 0) throw new Error('SUBSCRIPTION_EXPIRED');
}
export const checkPermissionScope = (allowpermissionScopeList: EnumUserAppRole[], permissionScope: EnumUserAppRole): boolean => {
  if (allowpermissionScopeList.includes(permissionScope)) {
    return true;
  } else {
    return false;
  }
};
export class AuthService {
  webViewAuthenticator(pageID: number, audienceID: number, subscriptionID: string): string {
    const { hashKey, token, expiredIn } = signWebViewToken(pageID, audienceID, subscriptionID, PlusmarService.environment.webViewKey);
    setRedisForWebViewToken(PlusmarService.redisClient, hashKey, { token, expiredIn });
    return hashKey;
  }

  async webViewPostbackValidator(req: Request, res: Response): Promise<void> {
    try {
      await this.webViewAuthValidator(req);
      res.sendStatus(200);
    } catch (err) {
      res.sendStatus(500);
    }
  }
  async webViewAuthValidator(req: Request): Promise<void> {
    const { audienceId: audienceID, auth: KEY } = new Object(req.query) as WebhookQueries;
    const { token, expiredIn } = (await getRedisForWebViewToken(PlusmarService.redisClient, KEY)) as WebviewToken;

    const isStoreExpired = dayjs(expiredIn).isBefore(dayjs());
    if (isStoreExpired) throw new TokenExpired();

    const validate = validateWebViewToken(token, PlusmarService.environment.webViewKey);

    const isTokenExpired = dayjs(validate.expiredIn).isBefore(dayjs());
    if (isTokenExpired) throw new TokenExpired();

    if (validate.audienceID !== Number(audienceID)) throw new TokenInvalid();
  }

  async getCredentialFromToken(KEY: string): Promise<WebviewTokenPayload> {
    const { token } = (await getRedisForWebViewToken(PlusmarService.redisClient, KEY)) as WebviewToken;
    const validate = validateWebViewToken(token, PlusmarService.environment.webViewKey);
    return validate;
  }
}
