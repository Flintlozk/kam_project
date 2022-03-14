import {
  isAllowCaptureException,
  parseUTCTimestamp,
  PostgresHelper,
  transformImageURlFormat,
  transformMediaLinkString,
  transformMessageImageURl,
} from '@reactor-room/itopplus-back-end-helpers';
import { EnumFileFolder, IGQLFileSteam, IHTTPResult } from '@reactor-room/model-lib';
import { transformLineAttachmentUrl } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceContactActionMethod,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceViewType,
  EnumLeadPayloadType,
  EnumPurchasingPayloadType,
  IAudience,
  IAudienceWithCustomer,
  ILineFlexMessage,
  ILineMessageType,
  ILinePushMessage,
  ILineReplyMessage,
  ILineSourceType,
  ILineUpload,
  ILineWebhook,
  IMessageModel,
  IMessageModelInput,
  IMessageSource,
  IMessageType,
  IMessageUsers,
  IPayload,
  MessageSentByEnum,
  NotificationStatus,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { AxiosResponse } from 'axios';
import { Types as MongooseTypes } from 'mongoose';
import { setNotificationStatusByStatus } from '../../../data';
import {
  getAudienceByID,
  setLastActivityPlatformDateByAudienceID,
  toggleAudienceNotification,
  updateAudienceDomainStatusByID,
  updateAudienceUserOpen,
  updateLatestSentBy,
} from '../../../data/audience';
import { getCustomerByaudienceID, updateCustomerUpdatedAt } from '../../../data/customer';
import { getContentFromLineByMessageID, publishReceive, pushMessage, replyMessage } from '../../../data/line/line.data';
import { addNewMessage, getLatestMessageExceptSentByPage, getMessagesByMIDAudienceAndPageID } from '../../../data/message';
import { getLineChannelTokenByPageID, getPageByID, getPageByUUID } from '../../../data/pages';
import { getPayload } from '../../../domains/line-template/message.domain';
import { checkConvertMessage, getLineCustomerFromTemplateMessage } from '../../../domains/line/line.domain';
import { AudienceStepService } from '../../audience-step/audience-step.service';
import { AudienceContactService } from '../../audience/audience-contact.service';
import { WorkingHourService } from '../../general-setting';
import { NotificationService } from '../../notification/notification.service';
import { WebhookPatternMessageService } from '../../openapi/webhook-pattern.service';
import { PlusmarService } from '../../plusmarservice.class';
import { FileService } from '../..';
import { environmentLib } from '@reactor-room/environment-services-backend';

export class LineMessageService {
  public notificationService: NotificationService;
  public audienceStepService: AudienceStepService;
  public audienceContactService: AudienceContactService;
  public workingHourService: WorkingHourService;
  public webhookPatternMessageService = new WebhookPatternMessageService();
  public fileService: FileService;
  constructor() {
    this.notificationService = new NotificationService();
    this.audienceStepService = new AudienceStepService();
    this.audienceContactService = new AudienceContactService();
    this.workingHourService = new WorkingHourService();
    this.webhookPatternMessageService = new WebhookPatternMessageService();
    this.fileService = new FileService();
  }

  async sendLineMessageFromChatbox(message: IMessageModelInput, payload: IPayload): Promise<IMessageModel> {
    if (message.messagetype !== IMessageType.FILE) {
      message.text = JSON.stringify(message.text);
    }
    const IsPushMessage = false;
    const isSuccess = await this.sendLineMessage(message, payload, IsPushMessage);

    if (isSuccess) {
      if (message.messagetype === IMessageType.FILE) {
        message.text = '';
        delete message.payload;
      }

      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const audienceArray = await setLastActivityPlatformDateByAudienceID(client, message.pageID, message.audienceID);
      const audience = audienceArray[0];

      if (audience.domain === AudienceDomainType.AUDIENCE && [AudienceDomainStatus.INBOX, AudienceDomainStatus.FOLLOW].includes(audience.status as AudienceDomainStatus)) {
        if ([AudienceDomainStatus.INBOX].includes(audience.status as AudienceDomainStatus)) await updateAudienceUserOpen(client, payload.pageID, audience.id, payload.userID);
        if (audience.assigneeID === null) await this.audienceContactService.setAudienceAssignee(payload.pageID, audience.id, payload.userID);
      }

      await updateLatestSentBy(client, message.audienceID, message.pageID, false, MessageSentByEnum.PAGE);
      await toggleAudienceNotification(client, message.audienceID, message.pageID, false);
      await setNotificationStatusByStatus(client, message.audienceID, message.pageID, NotificationStatus.READ);

      await this.workingHourService.resetAudienceOffTime(message.pageID, message.audienceID, null, client);
      await PostgresHelper.execBatchCommitTransaction(client);

      await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, message.pageID, {
        method: AudienceContactActionMethod.TRIGGER_UPDATE,
        audienceID: message.audienceID,
        customerID: audience.customer_id,
        sentBy: MessageSentByEnum.PAGE,
      });
      let reponseMessage = await this.setMessageBeforeAddToDB(message, message.audienceID, payload.pageID, payload.userID);
      reponseMessage = transformMessageImageURl(reponseMessage, environmentLib.filesServer, payload.subscriptionID);
      return reponseMessage;
    }
  }

  async sendLineMessage(message: IMessageModelInput, payload: IPayload, isPushMessage: boolean): Promise<boolean> {
    try {
      message.pageID = payload.pageID;
      message.createdAt = message.createdAt === null ? parseUTCTimestamp(Number(new Date())) : parseUTCTimestamp(Number(message.createdAt));

      if (message.attachments !== undefined && message.attachments[0] !== undefined) {
        if (typeof message.attachments[0].payload === 'string') {
          message.attachments[0].payload = message.attachments[0] !== undefined ? JSON.parse(message.attachments[0].payload as string) : '';
        }
      }
      const latestMessage = await getLatestMessageExceptSentByPage({ audienceID: message.audienceID, pageID: payload.pageID } as IMessageUsers);
      let payloadReplyMsg: ILineReplyMessage;
      let userId = '';
      const pageChannelToken = await getLineChannelTokenByPageID(PlusmarService.readerClient, payload.pageID);
      const customer = await getCustomerByaudienceID(PlusmarService.readerClient, message.audienceID, payload.pageID);
      if (latestMessage !== null && !isPushMessage) {
        const parsePayload: ILineWebhook = JSON.parse(latestMessage.payload);

        userId =
          parsePayload.events[0].source.type === ILineSourceType.USER
            ? parsePayload.events[0].source.userId
            : parsePayload.events[0].source.type === ILineSourceType.ROOM
            ? parsePayload.events[0].source.roomId
            : parsePayload.events[0].source.groupId;

        // TODO : REFACTOR IN FUTURE
        if (message.messagetype === IMessageType.FILE) {
          let { url } = JSON.parse(message.payload);
          url = url.replace('/stream/', '/');
          message.id = MongooseTypes.ObjectId().toHexString();
          const fileTargetUrl = `${url}?openExternalBrowser=1`;
          message.text = JSON.stringify(fileTargetUrl);
        }
        payloadReplyMsg = getPayload(parsePayload.events[0].replyToken, message, payload.subscriptionID);
      } else {
        if (message.messagetype === IMessageType.FILE) {
          let { url } = JSON.parse(message.payload);
          url = url.replace('/stream/', '/');
          message.id = MongooseTypes.ObjectId().toHexString();
          const fileTargetUrl = `${url}?openExternalBrowser=1`;
          message.text = JSON.stringify(fileTargetUrl);
        }
        payloadReplyMsg = getPayload('directmessage', message, payload.subscriptionID);
        userId = customer.line_user_id;
      }

      let resultMsg = await replyMessage(pageChannelToken.line_channel_accesstoken, payloadReplyMsg, PlusmarService.environment.lineMessageAPI);
      if (resultMsg.status !== 200 && resultMsg.value === 'Invalid reply token') {
        const payloadPushMsg: ILinePushMessage = JSON.parse(JSON.stringify(payloadReplyMsg));
        payloadPushMsg.to = userId;
        //Todo Check Error When Over Push Limit
        resultMsg = await pushMessage(pageChannelToken.line_channel_accesstoken, payloadPushMsg, PlusmarService.environment.lineMessageAPI);
      }
      message.sender.line_user_id = userId;

      if (resultMsg.status === 200) {
        // TODO Check Hook
        await this.webhookPatternMessageService.webhookPatternMessage(message.audienceID, payload.pageID, customer.id, null, IMessageSource.LINE, message);
        return true;
      } else {
        throw new Error(resultMsg.value);
      }
    } catch (err) {
      console.log('sendLineMessage err::', err);
      throw err;
    }
  }

  /**
   * Line Platform
   */
  sendMessageByWebview = async (
    message: IMessageModelInput,
    payload: IPayload,
    messageType: ILineMessageType,
    viewtype: EnumLeadPayloadType | EnumPurchasingPayloadType,
    option: ILineFlexMessage,
  ): Promise<IMessageModel> => {
    const formTemplate = getLineCustomerFromTemplateMessage(messageType, message.text, option);
    message.text = formTemplate;
    const IsPushMessage = false;
    const messageText = option?.button_webapp?.template?.text || 'Details';
    await this.sendLineMessage(message, payload, IsPushMessage);

    const messageConverted = checkConvertMessage(viewtype, messageText);
    if (messageConverted !== '') {
      message.text = messageConverted;
    }
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    const audienceArray = await setLastActivityPlatformDateByAudienceID(client, message.pageID, message.audienceID);
    const audience = audienceArray[0];

    await updateLatestSentBy(client, message.audienceID, message.pageID, false, MessageSentByEnum.PAGE);
    PostgresHelper.execBatchCommitTransaction(client);

    await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, message.pageID, {
      method: AudienceContactActionMethod.TRIGGER_UPDATE,
      audienceID: message.audienceID,
      customerID: audience.customer_id,
      sentBy: MessageSentByEnum.PAGE,
    });

    const result = await this.setMessageBeforeAddToDB(message, message.audienceID, payload.pageID, payload.userID);

    return result;
  };

  setMessageBeforeAddToDB = async (message: IMessageModelInput, audienceID: number, pageID: number, userID: number): Promise<IMessageModel> => {
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    return await this.addMessageToDB(audience, message, userID);
  };

  addMessageToDB = async (audience: IAudienceWithCustomer, message: IMessageModelInput, userID: number): Promise<IMessageModel> => {
    const _INBOX = true;
    if (message.sentBy === 'PAGE') {
      await this.setAudienceStatus(audience, _INBOX, userID);
      await publishReceive(message);
    }
    message?.attachments?.map((image) => {
      image.payload.url = transformImageURlFormat(image.payload.url as string);
    });
    return await addNewMessage(message, null);
  };

  setAudienceStatus = async (audience: IAudienceWithCustomer, isInbox: boolean, userID: number): Promise<IAudience> => {
    const allowSetStatus = [AudienceDomainStatus.INBOX.toString(), AudienceDomainStatus.COMMENT.toString(), AudienceDomainStatus.LIVE.toString()];
    if (audience.domain === AudienceDomainType.AUDIENCE && allowSetStatus.includes(audience.status.toString()) && isInbox) {
      const turnOffNotify = false;
      const audienceParam = {
        id: audience.id,
        page_id: audience.page_id,
      } as IAudience;
      const updatedAudience = await updateAudienceDomainStatusByID(
        PlusmarService.writerClient,
        AudienceDomainType.AUDIENCE,
        AudienceDomainStatus.FOLLOW,
        audience.page_id,
        audience.id,
      );
      await updateCustomerUpdatedAt(updatedAudience.page_id, +updatedAudience.customer_id, PlusmarService.writerClient);
      await this.notificationService.toggleAudienceNotification(audienceParam, turnOffNotify);
      await this.audienceStepService.logAudienceHistory({
        pageID: audience.page_id,
        audienceID: audience.id,
        userID: userID,
        currentAudience: audience,
        updatedAudience,
      });
    } else {
      if (audience.is_notify) {
        const OFF = false;
        const togglerAudience = await this.notificationService.toggleAudienceNotification(audience, OFF);
        if (togglerAudience.parent_id === null) {
          await this.notificationService.toggleChildAudienceNotification(audience, OFF);
          const { customer_id, page_id } = audience || {};
          await updateCustomerUpdatedAt(page_id, +customer_id, PlusmarService.readerClient);
        } else {
          audience.id = togglerAudience.parent_id;
          await this.notificationService.toggleAudienceNotification(audience, OFF);
        }
      }
    }

    return;
  };

  async getLineContentByPageAndMessageIDByUUID(UUID: string, audienceID: string, messageID: string): Promise<AxiosResponse<any>> {
    try {
      const page = await getPageByUUID(PlusmarService.readerClient, UUID);
      let content = null;
      content = await getContentFromLineByMessageID(page.line_channel_accesstoken, Number(messageID));
      return content;
    } catch (err) {
      console.log('getLineContentByPageAndMessageIDByUUID Error: ', err);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      throw err;
    }
  }

  async getLineContentByPageAndMessageID(pageID: string, audienceID: string, messageID: string): Promise<AxiosResponse<any>> {
    return await this.getLineContentByPage(pageID, audienceID, messageID);
  }

  async getLineContentByPage(pageID: string, audienceID: string, messageID: string): Promise<AxiosResponse<any>> {
    try {
      const result = await getMessagesByMIDAudienceAndPageID(Number(pageID), Number(audienceID), messageID);
      let content = null;
      if (result) {
        const pages = await getPageByID(PlusmarService.readerClient, Number(pageID));
        content = await getContentFromLineByMessageID(pages.line_channel_accesstoken, Number(messageID));
      }
      return content;
    } catch (err) {
      console.log('getLineContentByPageAndMessageID Error: ', err);
      throw err;
    }
  }

  async lineUpload(pageID, pageUUID: string, lineupload: ILineUpload, subscriptionID: string): Promise<IHTTPResult> {
    try {
      //TODO:// Check LINE UPLOAD FROM MORE
      const fileUploadResult = await this.fileService.uploadSystemFiles(
        pageID,
        [lineupload.file as IGQLFileSteam],
        subscriptionID,
        pageUUID,
        EnumFileFolder.LINE,
        lineupload.audienceID.toString(),
      );
      const file = fileUploadResult[0];
      if (file) {
        return {
          status: 200,
          value: { filename: file.name, url: transformMediaLinkString(file.mediaLink, environmentLib.filesServer, subscriptionID), extension: file.extension },
        };
      }
    } catch (err) {
      console.log('lineUpload Error: ', err);
      throw err;
    }
  }
}
