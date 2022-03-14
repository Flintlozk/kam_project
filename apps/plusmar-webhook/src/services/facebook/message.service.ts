import {
  cryptoDecode,
  getDiffrentSecond,
  getUTCTimestamps,
  isAllowCaptureException,
  isEmpty,
  parseUTCTimestamp,
  transformMessageAttachmentImageURl,
} from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  IAttachmentModelPhysical,
  IAttachmentsModel,
  IAudience,
  IMessageModel,
  IMessageModelInput,
  IMessageSource,
  IPages,
  MessageSentByEnum,
  MESSAGE_RECEIVED,
} from '@reactor-room/itopplus-model-lib';
import { AudienceContactService, AudienceService, FacebookMessageService, FileService, MessageService, PagesService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { FacebookMessageHandlerError } from '../../errors';
import { SharedService } from '../shared/shared.service';
import { mapSender } from 'libs/itopplus-services-lib/src/lib/domains/message';

import * as Sentry from '@sentry/node';
import { environmentLib } from '@reactor-room/environment-services-backend';

const EMPTY_ENTRY_MESSAGE = 'EMPTY_ENTRY_MESSAGE';
export class MessageHandler {
  public webhookHelper = new WebHookHelpers();
  public messageService = new MessageService();
  public facebookMessageService = new FacebookMessageService();
  public audienceService = new AudienceService();
  public pageService = new PagesService();
  public audienceContactService = new AudienceContactService();
  public sharedService = new SharedService();
  public fileService = new FileService();
  // eslint-disable-next-line
  public start = async (webhook): Promise<boolean> => {
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
    const page = handleDefault.page; // === false Mean not to create Audience
    const isAudienceCreated = handleDefault.isAudienceCreated;
    const subscriptionID = handleDefault.page.subscription_id;

    // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
    if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()
    if (audience) {
      const messageResponse = await this.create(webhook, audience, page, subscriptionID);
      try {
        await this.messageService.upsertTraceMessage(webhook, { traceStage4: getDiffrentSecond(webhook.entry[0].time, new Date()) });
      } catch (ex) {
        //
      }

      if (messageResponse.mid == EMPTY_ENTRY_MESSAGE) return true;
      if (messageResponse) {
        const body = {
          ...messageResponse,
          createAt: getUTCTimestamps(),
        };
        const client = PlusmarService.pubsub;
        const pagePSID = this.webhookHelper.getSenderByPSID(webhook);
        const customerPSID = this.webhookHelper.getRecipientByPSID(webhook);
        const watermark = await this.messageService.getMessageWatermark(pagePSID, customerPSID);

        if (messageResponse?.sentBy === MessageSentByEnum.PAGE) {
          mapSender(body);
        }

        const message = { messageReceived: { ...body, messageWatermark: watermark } };
        try {
          if (message?.messageReceived?.attachments) {
            const attachments = JSON.parse(message?.messageReceived?.attachments as string) as IAttachmentsModel[];
            const result = transformMessageAttachmentImageURl(attachments, environmentLib.filesServer, subscriptionID);
            message.messageReceived.attachments = result;
          }
          await client.publish(MESSAGE_RECEIVED, message);
        } catch (err) {
          console.log('err [LOG]:--> ', err);
          console.log('"CAN"T PUBLISH');
        }
      }
      return true;
    } else {
      return false;
    }
  };

  // eslint-disable-next-line
  public create = async (webhook, audience: IAudience, page: IPages, subscriptionID: string): Promise<IMessageModel> => {
    try {
      if (this.webhookHelper.geteEntryMessage(webhook)) {
        const text = this.webhookHelper.getTextFromMessage(webhook);
        const attachments = this.webhookHelper.getAttachmentFromMessage(webhook) || null;
        const metaData = this.webhookHelper.getMetaDataFromMessage(webhook) || null;

        if (metaData && !isEmpty(attachments)) {
          attachments[0].payload.fileName = metaData;
        }
        const mid = this.webhookHelper.getMessageIDFromMessage(webhook);
        const midReact = this.webhookHelper.getMessageIDFromReaction(webhook);

        const pageID = this.webhookHelper.getPageID(webhook);
        const sentByPage = pageID === this.webhookHelper.getCustomerByPSID(webhook);
        const isEcho = Boolean(this.webhookHelper.getIsEchoFromMessage(webhook));
        const sentByCondition = isEcho || sentByPage ? MessageSentByEnum.PAGE : MessageSentByEnum.AUDIENCE;

        const hookTime = this.webhookHelper.getTimestampFromMessage(webhook);
        const createdAt = parseUTCTimestamp(hookTime);

        const messageData: IMessageModelInput = Object.assign({
          object: webhook.object,
          pageID: audience.page_id,
          audienceID: audience.id,
          createdAt: createdAt,
          mid: mid || midReact,
          text: text ?? null,
          attachments: attachments,
          sentBy: sentByCondition,
          payload: JSON.stringify(webhook),
          source: IMessageSource.FACEBOOK,
        }) as IMessageModelInput;

        const customAttachments = await this.checkisNullAttachment(messageData, page);
        if (customAttachments != null) {
          messageData.attachments = [
            {
              type: 'file',
              payload: {
                url: customAttachments?.file_url,
              },
            } as IAttachmentsModel,
          ] as IAttachmentsModel[];
        }

        if (audience.status === AudienceDomainStatus.COMMENT) {
          await this.audienceService.updateIncomingAudienceStatus(audience.id, audience.page_id, AudienceDomainStatus.INBOX);
        }
        return await this.sharedService.setMessageToDB(audience, mid, messageData, webhook, IMessageSource.FACEBOOK, page.subscription_id);
      } else {
        //Ignore the empty message;
        const emptyResult: IMessageModel = {
          mid: EMPTY_ENTRY_MESSAGE,
        };
        return emptyResult;
      }
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new FacebookMessageHandlerError(err));
      throw new FacebookMessageHandlerError(err);
    }
  };

  public checkisNullAttachment = async (message: IMessageModelInput, page: IPages): Promise<IAttachmentModelPhysical> => {
    const accessToken = page?.option?.access_token;
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);

    if (message.text == null && message.attachments == null) {
      return await this.facebookMessageService.getAttactmentMessage(token, message.mid);
    } else {
      return null;
    }
  };
}
