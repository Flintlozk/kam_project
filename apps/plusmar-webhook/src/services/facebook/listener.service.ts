import { getDiffrentSecond } from '@reactor-room/itopplus-back-end-helpers';
import { ReferralTypes } from '@reactor-room/itopplus-model-lib';
import { MessageService } from '@reactor-room/itopplus-services-lib';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { MessageHandler } from './message.service';
import { PostHandler } from './post.service';
import { PostBackHandler } from './postback.service';
import { ReferralProductHandler } from './referral-products.service';
import { ReferralOthersHandler } from './referral.others.service';
import { ReferralHandler } from './referral.service';

enum WEBHOOK_TYPE {
  PAGE_CONTENT_CHANGE = 'PAGE_CONTENT_CHANGE', // comment /like / con page content change
  REFFERAL = 'REFFERAL',
  POST_BACK = 'POST_BACK',
  INBOX = 'INBOX', // default case should be inbox message
  ECHO = 'ECHO', // Echo message for action card
}

export class FacebookListenerService {
  public webhookHelper = new WebHookHelpers();
  public postHandler = new PostHandler();
  public messageHandler = new MessageHandler();
  public referralHandler = new ReferralHandler();
  public referralOthersHandler = new ReferralOthersHandler();
  public referralProductHandler = new ReferralProductHandler();
  public postBackHandler = new PostBackHandler();
  public messageService = new MessageService();

  listen = async (webhook): Promise<boolean> => {
    try {
      await this.messageService.upsertTraceMessage(webhook, { latestIncoming: new Date() });
    } catch (ex) {
      //
    }

    let webhookType: WEBHOOK_TYPE;
    const changes = this.webhookHelper.getChangesFromMessage(webhook);
    const referral = this.webhookHelper.getReferralFromMessage(webhook);
    const postback = this.webhookHelper.getPostbackFromMessage(webhook);
    // https://developers.facebook.com/docs/messenger-platform/reference/send-api

    if (changes) webhookType = WEBHOOK_TYPE.PAGE_CONTENT_CHANGE;
    else if (referral) webhookType = WEBHOOK_TYPE.REFFERAL;
    else if (postback) webhookType = WEBHOOK_TYPE.POST_BACK;
    else webhookType = WEBHOOK_TYPE.INBOX;

    switch (webhookType) {
      case WEBHOOK_TYPE.POST_BACK: {
        return await this.postBackHandler.start(webhook);
      }
      case WEBHOOK_TYPE.PAGE_CONTENT_CHANGE: {
        return await this.postHandler.start(webhook);
      }
      case WEBHOOK_TYPE.REFFERAL: {
        const { ref } = this.webhookHelper.getReferralFromMessage(webhook);
        let refType = ReferralTypes.OTHER; // DEFAULT;
        if (ref !== null) refType = this.webhookHelper.getReferralTypeFromRef(ref);

        switch (refType) {
          case ReferralTypes.OTHER:
            return await this.referralOthersHandler.start(webhook);
          case ReferralTypes.FORM:
            return await this.referralHandler.start(webhook);
          case ReferralTypes.PRODUCTS:
            return await this.referralProductHandler.start(webhook);
          default:
            break;
        }
        break;
      }

      case WEBHOOK_TYPE.INBOX: {
        const inboxResult = await this.messageHandler.start(webhook);

        try {
          await this.messageService.upsertTraceMessage(webhook, { lastTraceStage: getDiffrentSecond(webhook.entry[0].time, new Date()) });
        } catch (ex) {
          //
        }
        return inboxResult;
      }
      default: {
        console.log('DEFAULT');
      }
    }

    // We try to implement retransmit message but we ignore that case.;

    return true;
  };
}
