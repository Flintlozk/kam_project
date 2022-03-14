import { randomString, cryptoDecode } from '@reactor-room/itopplus-back-end-helpers';
import { IFacebookCredential, IFacebookLongLiveTokenResponse } from '@reactor-room/model-lib';
import { getDayTilExpired } from '@reactor-room/itopplus-back-end-helpers';
import {
  IUserContext,
  IUserCredential,
  IUserSubscriptionModel,
  IPages,
  IUserSubscriptionsContext,
  IUserAndPageFromToken,
  ISubscriptionContext,
  EnumAuthScope,
  IUserAndPage,
} from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { RedisClient } from 'redis';

export const mapUserContext = (context: IUserAndPage[], environment): IUserContext => {
  if (context) {
    const mappedContext = {
      id: context[0]?.userId,
      name: context[0]?.userName,
      profile_img: context[0]?.profileImg,
      pages: context.map((item, index) => {
        return {
          pageIndex: index,
          pageId: item?.pageId,
          pageName: item?.pageName,
          pageRole: item?.pageRole,
          picture: item?.pagePicture,
          accessToken: item?.pageOption?.access_token ? cryptoDecode(item?.pageOption?.access_token, environment?.pageKey) : 'no access token',
          wizardStep: item?.wizardStep,
          pageAppScope: item?.pageAppScope,
          pageSettings: !isEmpty(item.pageSettings)
            ? item.pageSettings.map((ps) => {
                ps.options = <string>JSON.stringify(ps.options);
                return ps;
              })
            : [],
        };
      }),
    } as IUserContext;

    return mappedContext;
  }
};

export const mapUserSubScriptionsContext = (context: IUserSubscriptionModel[]): IUserSubscriptionsContext => {
  return {
    id: context[0].userId,
    name: context[0].name,
    profileImage: context[0].profileImg,
    subscriptions: context.map((item, index) => {
      return {
        subscriptionIndex: index,
        id: item.id,
        planName: item.planName,
        packageType: item.packageType,
        planId: item.planId,
        role: item.role,
        daysRemaining: getDayTilExpired(item.expiredAt),
        expiredAt: item.expiredAt,
        isExpired: getDayTilExpired(item.expiredAt) < 0,
      };
    }) as ISubscriptionContext[],
  };
};

export const mapUserWithPageInfo = (user: IUserCredential, page: IPages): IUserAndPageFromToken => {
  return {
    id: user.id,
    email: user.email,
    pageID: page.id,
    pageName: page.page_name,
    fbPageID: page.fb_page_id,
  };
};

export const setUserCredential = (payload: IFacebookCredential, userID: number, activeStatus: boolean) => {
  return {
    ...payload,
    userID: userID,
    activeStatus: activeStatus,
  };
};

export const signUserRedisStore = (
  redisClient: RedisClient,
  user: IUserCredential,
  payload: IFacebookCredential,
  longLiveToken: IFacebookLongLiveTokenResponse,
  appModule: EnumAuthScope,
): string => {
  const userIDKeys = user.id + randomString(10);
  payload.accessToken = longLiveToken.access_token;

  const credential = setUserCredential(payload, user.id, user.status);
  redisClient.set(userIDKeys, JSON.stringify({ ...credential, appModule }));

  return userIDKeys;
};

export const setKeyOnUserSession = (redisClient: RedisClient, payload: IFacebookCredential) => {
  //TODO: setKeyOnUserSession
  console.log('Payload ', payload);
};
