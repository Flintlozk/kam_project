import { cryptoDecode, isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceDomainStatus, AudienceDomainType, IAudience, IHandleDefault, MessageReferral, MessageReferralSource } from '@reactor-room/itopplus-model-lib';
import { AudienceService, CustomerService, FacebookMessageService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookReferralHandlerError } from '../../errors';
import { SharedService } from '../shared/shared.service';

export class ReferralOthersHandler {
  private webhookHelper = new WebHookHelpers();
  public sharedService = new SharedService();
  public audienceService = new AudienceService();
  public facebookMessageService = new FacebookMessageService();
  public customerService = new CustomerService();

  public handleCreateAudience = async (webhook): Promise<IHandleDefault> => {
    const allowToCreateAudience = true;
    return await this.sharedService.start(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.INBOX, AudiencePlatformType.FACEBOOKFANPAGE, allowToCreateAudience);
  };

  public start = async (webhook): Promise<boolean> => {
    try {
      const source = this.webhookHelper.getReferralSourceFromMessage(webhook);
      const referal = this.webhookHelper.getReferralFromMessage(webhook);
      const referalUpsert: MessageReferral = { ...referal, timestamp: this.webhookHelper.getReferralTimestampFromMessage(webhook) };

      const handleDefault = await this.handleCreateAudience(webhook);
      if (handleDefault.isPageNotFound) return false; // isPageNotFound may be this page not belong to us.

      let audience = handleDefault.audience; // === false Mean not to create Audience
      const isAudienceCreated = handleDefault.isAudienceCreated;
      // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
      if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()
      if (isEmpty(audience)) return false; // in case not create Audience and we ignore this message by ack()

      if (handleDefault.customer === null) {
        const userRefID = this.webhookHelper.getCustomerUserRefID(webhook);
        if (userRefID) {
          const accessToken = handleDefault.page?.option?.access_token;
          const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
          const userRef = await this.facebookMessageService.getPSIDformUserRef(token, userRefID);
          if (userRef === null) return false;

          const psid = userRef?.psid.id;
          const facebookPageID = this.webhookHelper.getPageID(webhook);
          const customer = await this.sharedService.createCustomerFromFacebook(webhook, facebookPageID, handleDefault.page, psid);
          if (customer === null) return false;

          const domain = AudienceDomainType.AUDIENCE;
          const status = AudienceDomainStatus.INBOX;

          audience = await this.sharedService.createAudienceFromFacebook(customer, domain, status, webhook, handleDefault.page);
        } else {
          if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException('UserRef Failed : ' + new Error(JSON.stringify(webhook, null, 2)));
          return false; // in case cannot determined the ID
        }
      }

      switch (source) {
        case MessageReferralSource.SHORTLINK:
        case MessageReferralSource.ADS:
        case MessageReferralSource.CUSTOMER_CHAT_PLUGIN: {
          return await this.upsertReferral(webhook, audience, referalUpsert);
        }
        default: {
          referalUpsert.source = MessageReferralSource.UNKNOWN;
          return await this.upsertReferral(webhook, audience, referalUpsert);
        }
      }
    } catch (err) {
      console.log('err [LOG]:--> ', err);
      throw new FacebookReferralHandlerError(err);
    }
  };

  private upsertReferral = async (webhook, audience: IAudience, referalUpsert: MessageReferral): Promise<boolean> => {
    return await this.audienceService.upsertAudienceReferral(audience, referalUpsert);
  };
}

// Example Hook from Shortlink
// Type 1 : m.me?ref=###########
// {
//   "sender":{
//     "id":"<PSID>"
//   },
//   "recipient":{
//     "id":"<PAGE_ID>"
//   },
//   "timestamp":1458692752478,
//   "referral": {
//     "ref": <REF_DATA_PASSED_IN_M.ME_PARAM>,
//     "source": "SHORTLINK",
//     "type": "OPEN_THREAD",
//   }
// }

// Type 2 : Ad Click
// {
//   "sender":{
//     "id":"<PSID>" <------------------- SENDER
//   },
//   "recipient":{
//     "id":"<PAGE_ID>
// "
//   },
//   "timestamp":1458692752478,
//   "referral": {
//     "ref": <REF_DATA_IF_SPECIFIED_IN_THE_AD>,
//     "ad_id": <ID_OF_THE_AD>,
//     "source": "ADS",
//     "type": "OPEN_THREAD",
//     "ads_context_data": {
//       "ad_title": <TITLE_OF_THE_AD>,
//       "photo_url": <URL_OF_THE_IMAGE_FROM_AD_THE_USER_IS_INTERESTED_IN>,
//       "video_url": <THUMBNAIL_URL_OF_THE_VIDEO_FROM_THE_AD>,
//       "post_id": <ID_OF_THE_POST>
//     }
//   }
// }

// Type 3 : New Chat Plugin (API 7.0+ -> Nov 2 2020)
// {
//   "sender":{
//     "user_ref":"<USER_REF>"
//   },
//   "recipient":{
//     "id":"<PAGE_ID>"
//   },
//   "timestamp":1458692752478,
//   "referral": {
//      "ref": "<REF_DATA_PASSED_IN_CODE>",
//      "source": "CUSTOMER_CHAT_PLUGIN",
//      "type": "OPEN_THREAD",
//      "referer_uri": "<WEBSITE_URL>"
//   }
// }

// Type 4 : Old Chat Plugin (API <=6.0+ until Nov 2 2020)
// {
//   "sender":{
//     "id":"<PSID>"
//   },
//   "recipient":{
//     "id":"<PAGE_ID>"
//   },
//   "timestamp":1458692752478,
//   "referral": {
//      "ref": "<REF_DATA_PASSED_IN_CODE>",
//      "source": "CUSTOMER_CHAT_PLUGIN",
//      "type": "OPEN_THREAD",
//      "referer_uri": "<WEBSITE_URL>"
//   }
// }
