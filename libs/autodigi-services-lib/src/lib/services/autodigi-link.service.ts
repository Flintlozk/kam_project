import { IAutodigiLinkKey, ILinkAutodigiSubscriptionResponse } from '@reactor-room/autodigi-models-lib';
import { cryptoPublicEncode, getDayjs, PostgresHelper, randomString } from '@reactor-room/itopplus-back-end-helpers';
import { EnumAppScopeType } from '@reactor-room/itopplus-model-lib';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { deleteLinkSubscriptionInAutodigiUser, updateAutodigiUserSubscpritionID } from '../data/autodigi-user';
import { getAutodigiUser, getAutodigiUserBySubscrptionID } from '../data/autodigi-user/get-autodigi-user.data';
import { getAutodigiWebsites } from '../data/autodigi-website/get-autodigi-website.data';
import {
  deleteLinkPageInAutodigiWebsite,
  deleteLinkWebsiteAutodigiOfPage,
  deletePageAutodigiAppScopeAppScope,
  setPageAutodigiAppScopeByPageID,
  updateLinkWebsiteAutodigi,
  updateMoreCommerceIDToAutodigiWebsite,
} from '../data/autodigi-website/set-autodigi-website.data';
import { getUserByID } from '../data/user/get-user.data';
import { mapAutodigiWebsiteLink } from '../domains/autodigi-website-link.domain';

export class AutodigiLinkService {
  constructor() {}

  testCallFromOutside() {
    console.log('HELLO WORLD');
  }

  async generateAutodigiLink(subscriptionID: string, userID: number, accessToken: string): Promise<IAutodigiLinkKey> {
    const autodigiUser = await getAutodigiUserBySubscrptionID(subscriptionID);
    if (autodigiUser.length > 0)
      return {
        linkKey: null,
        linkStatus: true,
      };

    const user = await getUserByID(PlusmarService.readerClient, userID);
    const expiredAt = getDayjs().add(30, 'minute').toDate();
    const key = userID + randomString(10);
    PlusmarService.redisClient.set(key, JSON.stringify({ name: user.name, email: user.email, accessToken, subscriptionID: subscriptionID }));
    const linkKey = cryptoPublicEncode<{ key: string; expiredAt: Date }>(PlusmarService.environment.publicKey, { key, expiredAt });

    return {
      linkKey: linkKey,
      linkStatus: false,
    };
  }

  async linkAutodigiSubscription(userID: string, pageID: number, subscriptionID: string): Promise<ILinkAutodigiSubscriptionResponse> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const user = await getAutodigiUser(userID);
    const websites = await getAutodigiWebsites([userID], { name: 1, _id: 1 });
    const link = mapAutodigiWebsiteLink(websites);

    try {
      if (websites.length > 0) {
        for (let index = 0; index < link.length; index++) {
          const autodigiID = link[index];
          await updateLinkWebsiteAutodigi(client, pageID, autodigiID);
        }
        await updateMoreCommerceIDToAutodigiWebsite(link, pageID);
      }
      await updateAutodigiUserSubscpritionID(user._id, subscriptionID);

      await setPageAutodigiAppScopeByPageID(client, pageID, EnumAppScopeType.AUTO_DIGI);

      await PostgresHelper.execBatchCommitTransaction(client);

      return {
        status: 200,
        message: 'OK',
      };
    } catch (ex) {
      // TODO : Capture Sentry

      await PostgresHelper.execBatchRollbackTransaction(client);

      await updateMoreCommerceIDToAutodigiWebsite(link, null);
      await updateAutodigiUserSubscpritionID(user._id, null);

      return {
        status: 500,
        message: 'UNEXCEPTION_ERROR',
      };
    }
  }

  async doUnlinkAutodigi(pageID: number, subscriptionID: string): Promise<IHTTPResult> {
    const pgClient = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const mongoSession = await PlusmarService.mongoAutodigiConnector.startSession();
    mongoSession.startTransaction();
    try {
      await deleteLinkPageInAutodigiWebsite(pageID, mongoSession);
      await deleteLinkSubscriptionInAutodigiUser(subscriptionID, mongoSession);
      await deleteLinkWebsiteAutodigiOfPage(pgClient, pageID);
      await deletePageAutodigiAppScopeAppScope(pgClient, pageID, EnumAppScopeType.AUTO_DIGI);

      await PostgresHelper.execBatchCommitTransaction(pgClient);
      await mongoSession.commitTransaction();

      mongoSession.endSession();

      return {
        status: 200,
        value: '123',
      };
    } catch (ex) {
      await PostgresHelper.execBatchRollbackTransaction(pgClient);
      await mongoSession.abortTransaction();
      mongoSession.endSession();

      console.log('ex', ex);
      throw ex;
    }
  }
}
