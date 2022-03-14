import { isAllowCaptureException } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceDomainStatus, AudienceDomainType, IAudience, MessageSentByEnum, PostbackPayload } from '@reactor-room/itopplus-model-lib';
import { MessageService, PlusmarService, PurchaseOrderPostbackButtonService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookPostbackHandlerError } from '../../errors';
import { SharedService } from '../shared/shared.service';

export class PostBackHandler {
  private webhookHelper = new WebHookHelpers();
  private messageService = new MessageService();
  private sharedService = new SharedService();
  private purchaseOrderPostbackButtonService: PurchaseOrderPostbackButtonService = new PurchaseOrderPostbackButtonService();

  start = async (webhook): Promise<boolean> => {
    try {
      const allowToCreateAudience = true;
      const handleDefault = await this.sharedService.start(
        webhook,
        AudienceDomainType.AUDIENCE,
        AudienceDomainStatus.INBOX,
        AudiencePlatformType.FACEBOOKFANPAGE,
        allowToCreateAudience,
      );
      if (handleDefault.isPageNotFound) return false; // isPageNotFound may be this page not belong to us.

      const audience = handleDefault.audience; // === false Mean not to create Audience
      const isAudienceCreated = handleDefault.isAudienceCreated;
      const subscriptionID = handleDefault.page.subscription_id;
      // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
      if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()

      const postback = this.webhookHelper.getPostbackFromMessage(webhook);
      if (!postback) return false;
      if (!audience) return false;

      return await this.handlePostbackPayload(webhook, postback, audience, subscriptionID);
    } catch (err) {
      console.log('PostBackHandler err [LOG]:--> ', err.message);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw new FacebookPostbackHandlerError(err);
    }
  };

  async handlePostbackPayload(webhook, postback, audience: IAudience, subscriptionID): Promise<boolean> {
    let { payload } = postback;
    if (typeof payload === 'string') {
      if (['<GET_STARTED_PAYLOAD>'].includes(payload)) payload = postback.title;
      const message = this.webhookHelper.setMessagePayloadWithoutMID(webhook, null, payload, MessageSentByEnum.AUDIENCE, payload, audience.id, audience.page_id);
      const messageData = await this.messageService.updateMessageFromHook(message);
      return isEmpty(messageData) ? false : true;
    } else {
      const responseType = this.webhookHelper.getPostbackResponseType(JSON.parse(payload) as PostbackPayload);
      // noted: response_type for accept postback from Follow's EJS pipeline
      if (responseType) {
        const { response_type, PSID, audience_id } = JSON.parse(payload) as PostbackPayload;

        // noted : not sure are this still be used ?
        await this.purchaseOrderPostbackButtonService.handlePostbackButton(response_type, PSID, audience_id, audience.page_id, subscriptionID);

        const attachment = this.webhookHelper.getAttachmentFromMessage(webhook);

        if (attachment) {
          const title = this.webhookHelper.getAttachmentFromMessageFirstButtonText(webhook);
          //Incase of Button Click Keep Message
          if (title) {
            const message = this.webhookHelper.setMessagePayloadWithoutMID(webhook, attachment, payload, MessageSentByEnum.AUDIENCE, title, audience.id, audience.page_id);
            const messageData = await this.messageService.updateMessageFromHook(message);
            return isEmpty(messageData) ? false : true;
          } else {
            return false;
          }
        } else {
          const postbackMessage = this.webhookHelper.getPostbackFromMessage(webhook);
          if (postbackMessage) {
            const title = this.webhookHelper.getTextFromPostbackMessage(webhook);
            if (title) {
              const message = this.webhookHelper.setMessagePayloadWithoutMID(webhook, null, payload, MessageSentByEnum.AUDIENCE, title, audience.id, audience.page_id);
              const messageData = await this.messageService.updateMessageFromHook(message);
              return isEmpty(messageData) ? false : true;
            } else {
              return false;
            }
          } else {
            return false;
          }
        }
      } else {
        return false;
      }
    }
  }
}
