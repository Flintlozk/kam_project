import { getUTCTimestamps, isAllowCaptureException, parseUTCTimestamp, publishMessage, transformMessageImageURl } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, EnumFileFolder, IMoreImageUrlResponse } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  IAttachmentsModel,
  IHandleDefault,
  ILineFileMessage,
  ILineMessage,
  ILineSourceType,
  ILineStickerMessage,
  ILineWebhook,
  IMessageModel,
  IMessageModelInput,
  IMessageSender,
  IMessageSource,
  MESSAGE_RECEIVED,
  WEBHOOK_FILE,
  WEBHOOK_MESSAGE_TYPE,
} from '@reactor-room/itopplus-model-lib';
import { FileService, LineService, PagesService, PlusmarService } from '@reactor-room/itopplus-services-lib';
import * as Sentry from '@sentry/node';
import { isEmpty } from 'lodash';
import { WebHookHelpers } from '../../domains/webhook.domain';
import { SharedService } from '../shared/shared.service';

import { environmentLib } from '@reactor-room/environment-services-backend';
import { getFileExtension, lineAttachmentTypeIsFileOrOther } from '../../domains/line/line-file.domain';
import { updateUrlImageMore } from 'libs/itopplus-services-lib/src/lib/data/message/set-message.data';
import { getLineSignature, getTopicLine, isNotEmpty } from '../../domains/line/line-message.domain';

export class LineMessageService {
  private sharedService = new SharedService();
  public webhookHelper = new WebHookHelpers();
  public pageService = new PagesService();
  public lineService = new LineService();
  public fileService = new FileService();

  getAudience = async (webhook: ILineWebhook): Promise<IHandleDefault> => {
    try {
      let handelerDefault = {
        audience: null,
      } as IHandleDefault;

      if (
        webhook.events[0].source.type === ILineSourceType.USER ||
        webhook.events[0].source.type === ILineSourceType.ROOM ||
        webhook.events[0].source.type === ILineSourceType.GROUP
      ) {
        const allowToCreateAudience = true;
        handelerDefault = await this.sharedService.start(webhook, AudienceDomainType.AUDIENCE, AudienceDomainStatus.INBOX, AudiencePlatformType.LINEOA, allowToCreateAudience);
      }
      return handelerDefault;
    } catch (err) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      console.log('Error ::', err);
      throw Error('getAudience message.service.ts :' + err.message);
    }
  };

  getSourceProfile = async (webhook): Promise<IMessageSender> => {
    try {
      const eventSource = this.webhookHelper.getLineEventSource(webhook);
      const userID = this.webhookHelper.getLineUserID(webhook);

      const messageSender = {
        line_user_id: userID,
        user_name: '',
      } as IMessageSender;

      if (eventSource.sourceType === ILineSourceType.GROUP) {
        const page = await this.pageService.getPageByLineUserID(webhook.destination);
        const groupID = this.webhookHelper.getLineGroupID(webhook);
        messageSender.group_id = groupID;

        const profile = await this.lineService.getGroupMemberProfile(page.line_channel_accesstoken, groupID, userID);

        if (profile) {
          messageSender.picture_url = profile.pictureUrl || null;
          messageSender.user_name = profile.displayName || null;
        } else {
        }
      }
      if (eventSource.sourceType === ILineSourceType.ROOM) {
        const page = await this.pageService.getPageByLineUserID(webhook.destination);
        const roomID = this.webhookHelper.getLineRoomID(webhook);
        messageSender.room_id = roomID;

        const profile = await this.lineService.getRoomMemberProfile(page.line_channel_accesstoken, roomID, userID);
        if (profile) {
          messageSender.picture_url = profile.pictureUrl || null;
          messageSender.user_name = profile.displayName || null;
        }
      }

      return messageSender;
    } catch (err) {
      return null;
    }
  };

  handleAPIMessageEvent = async (webhook: ILineWebhook): Promise<boolean> => {
    const handleDefault = await this.getAudience(webhook);
    if (handleDefault.isPageNotFound) {
      return false; // isPageNotFound may be this page not belong to us.
    }
    const audience = handleDefault.audience; // === false Mean not to create Audience
    const isAudienceCreated = handleDefault.isAudienceCreated;
    const subscriptionID = handleDefault.page.subscription_id;

    // such as 'Refferal / Job (Facebook) but We need to make sure our logic is right we must not keep the data without audience.
    if (!isAudienceCreated) return false; // in case not create Audience and we ignore this message by ack()

    if (audience) {
      const createdAt = parseUTCTimestamp(webhook.events[0].timestamp);
      const attachments = await this.handleAttachmentByMessageType(webhook, handleDefault.page.uuid, audience.id);
      const messageData: IMessageModelInput = Object.assign({
        object: 'line',
        pageID: audience.page_id,
        audienceID: audience.id,
        createdAt: createdAt,
        mid: webhook.events[0].message.id,
        text: webhook.events[0].message?.text ?? null,
        attachments: attachments,
        sentBy: 'AUDIENCE',
        payload: JSON.stringify(webhook),
        sender: await this.getSourceProfile(webhook),
        source: IMessageSource.LINE,
      }) as IMessageModelInput;
      let message = await this.sharedService.setMessageToDB(audience, webhook.events[0].message.id, messageData, webhook, IMessageSource.LINE, handleDefault.page.subscription_id);
      if (message) {
        message = transformMessageImageURl(message, environmentLib.filesServer, subscriptionID);
        // PUBLISH REDIS TO SUBSCRIPTION WITH ASYNCHRONOUS
        this.publishMessageReceive(message);
        // TRY TO UPDATE WITH MORE IMAGE WITH ASYNCHRONOUS
        if (attachments?.length > 0) {
          this.asynchronousSavingLineImageToStorage(webhook, attachments[0].payload.url.toString(), handleDefault);
        }
      }
      return true;
    } else {
      // audience being blocked will be null and return false as well
      return false;
    }
  };

  asynchronousSavingLineImageToStorage = async (webhook: ILineWebhook, URL: string, handleDefault: IHandleDefault) => {
    const pageID = handleDefault.page.id.toString();
    const subscriptionID = handleDefault.page.subscription_id;
    const UUID = handleDefault.page.uuid;
    const message = webhook.events[0].message as ILineFileMessage;
    const attachmentFileType = lineAttachmentTypeIsFileOrOther(message);
    let imagemoreURLRespose: IMoreImageUrlResponse[];
    if (attachmentFileType == WEBHOOK_FILE.FILE) {
      const extension = getFileExtension(message);
      imagemoreURLRespose = await this.fileService.uploadFileToFilServerWithLink(URL, message.id, pageID, subscriptionID, UUID, EnumFileFolder.LINE, message.id, true, extension);
    } else {
      imagemoreURLRespose = await this.fileService.uploadFileToFilServerWithLink(URL, message.id, pageID, subscriptionID, UUID, EnumFileFolder.LINE, message.id, true);
    }
    await updateUrlImageMore(message.id, imagemoreURLRespose[0]?.mediaLink);
  };

  handleNewFollower = async (webhook: ILineWebhook): Promise<boolean> => {
    const page = await this.pageService.getPageByLineUserID(webhook.destination);
    if (isEmpty(page)) return false;

    const lineProfile = await this.lineService.getLineProfileUser(page.line_channel_accesstoken, webhook.events[0].source.userId);
    const sourceType: ILineSourceType = webhook?.events?.[0]?.source?.type;

    const customer = await this.sharedService.createCustomerFromLine(lineProfile, page, webhook.events[0].source.userId, sourceType);
    if (isEmpty(customer)) {
      return false;
    } else {
      return true;
    }
  };

  handleAttachmentByMessageType = async (webhook: ILineWebhook, UUID: string, audienceID: number): Promise<IAttachmentsModel[]> => {
    const message = webhook.events[0].message;
    switch (message.type) {
      case WEBHOOK_MESSAGE_TYPE.TEXT:
        return null;
        break;
      case WEBHOOK_MESSAGE_TYPE.STICKER:
        return this.generateAttachmentFormat(message, UUID, audienceID);
        break;
      case WEBHOOK_MESSAGE_TYPE.IMAGE:
        return await this.generateAttachmentMoreUrlFormat(message, UUID, audienceID);
        break;
      case WEBHOOK_MESSAGE_TYPE.VIDEO:
        return await this.generateAttachmentMoreUrlFormat(message, UUID, audienceID);
        break;
      case WEBHOOK_MESSAGE_TYPE.AUDIO:
        return await this.generateAttachmentMoreUrlFormat(message, UUID, audienceID);
        break;
      case WEBHOOK_MESSAGE_TYPE.LOCATION:
        return this.generateAttachmentFormat(message, UUID, audienceID);
        break;
      case WEBHOOK_MESSAGE_TYPE.FILE:
        return await this.generateFileMoreUrlFormat(message as ILineFileMessage, UUID, audienceID);
        break;
      default:
        throw new Error(`Unknown message: ${JSON.stringify(message)}`);
    }
  };

  generateAttachmentFormat = (message: ILineMessage | ILineStickerMessage | ILineFileMessage, UUID: string, audienceID: number): IAttachmentsModel[] => {
    return [
      {
        type: message.type,
        payload: {
          url: `${PlusmarService.environment.backendUrl}/linecontentuuid/${UUID}/${audienceID}/${message.id}`,
        },
      },
    ] as IAttachmentsModel[];
  };

  generateAttachmentMoreUrlFormat = async (message: ILineMessage | ILineStickerMessage | ILineFileMessage, UUID: string, audienceID: number): Promise<IAttachmentsModel[]> => {
    const url = `${PlusmarService.environment.backendUrl}/linecontentuuid/${UUID}/${audienceID}/${message.id}`;
    return [
      {
        type: message.type,
        payload: {
          url,
        },
      },
    ] as IAttachmentsModel[];
  };
  generateFileMoreUrlFormat = async (message: ILineFileMessage, UUID: string, audienceID: number): Promise<IAttachmentsModel[]> => {
    const url = `${PlusmarService.environment.backendUrl}/linecontentuuid/${UUID}/${audienceID}/${message.id}`;
    return [
      {
        type: message.type,
        payload: {
          url,
        },
      },
    ] as IAttachmentsModel[];
  };

  publishMessageReceive = async (message: IMessageModel): Promise<void> => {
    const body = {
      ...message,
      createAt: getUTCTimestamps(),
    };
    const client = PlusmarService.pubsub;
    try {
      client.publish(MESSAGE_RECEIVED, { messageReceived: body });
    } catch (e) {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(e);
      console.log('ERR:', e);
    }
  };

  // special case trigger webhook

  async linePublishMessage(linesecret: string, body, signature): Promise<boolean> {
    if (isNotEmpty(linesecret)) {
      const signatureLine = getLineSignature(linesecret, body);
      if (signatureLine === signature) {
        return await publishMessage(body, getTopicLine(linesecret));
      } else {
        throw Error('line signature is not equal');
      }
    } else {
      throw Error('No line secret');
    }
  }
}
