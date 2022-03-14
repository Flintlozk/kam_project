import { IAutodigiSubscriptionCheckResponse, IAutodigiWebsiteList, ILinkedAutodigiWebsites, IUpdateLinkAutodigiInput } from '@reactor-room/autodigi-models-lib';
import { cryptoPublicEncode, getDayjs, PostgresHelper, randomString } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { PlusmarService } from '@reactor-room/itopplus-services-lib';
import { getAutodigiUserBySubscrptionID } from '../data/autodigi-user/get-autodigi-user.data';
import { getAutodigiWebsites, getLinkedAutodigiWebsites } from '../data/autodigi-website/get-autodigi-website.data';
import {
  resetAutodigiWebsitePrimaryLink,
  setAutodigiWebsitePrimaryLink,
  updateLinkStatusWebsiteAutodigi,
  updateLinkWebsiteAutodigi,
  updateMoreCommerceIDToAutodigiWebsite,
} from '../data/autodigi-website/set-autodigi-website.data';

export class AutodigiSubscriptionService {
  constructor() {}

  async loginToAutodigi(pageID: number, subscriptionID: string, userID: number): Promise<IHTTPResult> {
    const linkStatus = await this.checkSubscriptionLinkStatus(pageID, subscriptionID);
    if (linkStatus.isLink) {
      const primaryWebsite = linkStatus.websites.find((x) => {
        return x.isPrimary;
      });
      let websiteIDTarget = null;
      if (primaryWebsite) {
        websiteIDTarget = primaryWebsite.websiteID;
      }

      const expiredAt = getDayjs().add(30, 'minute').toDate();
      const key = userID + randomString(10);
      PlusmarService.redisClient.set(key, JSON.stringify({ websiteID: websiteIDTarget, subscriptionID: subscriptionID }));
      const token = cryptoPublicEncode<{ key: string; expiredAt: Date }>(PlusmarService.environment.publicKey, { key, expiredAt });

      return {
        status: 200,
        value: `${token}?wid=${websiteIDTarget}`,
      };
    } else {
      return {
        status: 404,
        value: 'NO_AUTODIGI_ACCOUNT_LINK',
      };
    }
  }

  async checkSubscriptionLinkStatus(pageID: number, subscriptionID: string): Promise<IAutodigiSubscriptionCheckResponse> {
    // Note: For now only return 1 row per 1 subscription
    const users = await getAutodigiUserBySubscrptionID(subscriptionID);

    if (users.length > 0) {
      const userIDs = users.map((user) => user._id);
      const pageLinks = await getLinkedAutodigiWebsites(PlusmarService.readerClient, pageID, subscriptionID);
      const websites = await getAutodigiWebsites(userIDs, { name: 1, _id: 1 });

      const mapWebsites: IAutodigiWebsiteList[] = websites.map((website) => {
        const found = pageLinks.find((link) => link.autodigiID === String(website._id) && link.linkStatus);
        return {
          websiteID: website._id,
          websiteName: website.name,
          linkStatus: found !== undefined,
          isPrimary: found.isPrimary,
        };
      });

      return {
        isLink: true,
        websites: mapWebsites,
      };
    } else {
      return {
        isLink: false,
        websites: [],
      };
    }
  }

  async getLinkedAutodigiWebsites(pageID: number, subscriptionID: string): Promise<ILinkedAutodigiWebsites> {
    const pageLinks = await getLinkedAutodigiWebsites(PlusmarService.readerClient, pageID, subscriptionID);
    return {
      websites: pageLinks.map((page) => {
        return {
          websiteID: -1,
          websiteName: 'MOCK',
        };
      }),
    };
  }

  async setPrimaryAutodigiLink(pageID: number, websiteID: string): Promise<IHTTPResult> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      await resetAutodigiWebsitePrimaryLink(client, pageID);
      await setAutodigiWebsitePrimaryLink(client, pageID, websiteID);

      await PostgresHelper.execBatchCommitTransaction(client);

      return {
        status: 200,
        value: 'OK',
      };
    } catch (ex) {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw ex;
    }
  }

  async updateLinkWebsiteAutodigi(pageID: number, { unlink, link }: IUpdateLinkAutodigiInput): Promise<IHTTPResult> {
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    try {
      if (unlink.length > 0) {
        for (let index = 0; index < unlink.length; index++) {
          const autodigiID = unlink[index];
          const linkStatus = false;
          await updateLinkStatusWebsiteAutodigi(client, pageID, autodigiID, linkStatus);
        }
        await updateMoreCommerceIDToAutodigiWebsite(unlink, null);
      }

      if (link.length > 0) {
        for (let index = 0; index < link.length; index++) {
          const autodigiID = link[index];
          await updateLinkWebsiteAutodigi(client, pageID, autodigiID);
        }
        await updateMoreCommerceIDToAutodigiWebsite(link, pageID);
      }

      await PostgresHelper.execBatchCommitTransaction(client);

      return {
        status: 200,
        value: 'OK',
      };
    } catch (ex) {
      await PostgresHelper.execBatchRollbackTransaction(client);
      throw ex;
    }
  }
}
