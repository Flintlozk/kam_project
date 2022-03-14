import { getUTCTimestamps, parseUTCTimestamp, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { transformLineAttachmentUrl } from '@reactor-room/itopplus-back-end-helpers';
import {
  AudienceContactActionMethod,
  AudienceViewType,
  IAudienceWithCustomer,
  ILinePushMessage,
  ILineReplyMessage,
  ILineSourceType,
  ILineWebhook,
  IMessageModel,
  IMessageModelInput,
  IMessageType,
  IMessageUsers,
  IOpenAPIMessagingPayload,
  MessageSentByEnum,
  MESSAGE_RECEIVED,
} from '@reactor-room/itopplus-model-lib';
import { Types as MongooseTypes } from 'mongoose';
import {
  addNewMessage,
  getAudienceByID,
  getCustomerByaudienceID,
  getLatestMessageExceptSentByPage,
  getLineChannelTokenByPageID,
  pushMessage,
  replyMessage,
  setLastActivityPlatformDateByAudienceID,
  updateLatestSentBy,
} from '../../../data';
import { getPayload } from '../../../domains/line-template/message.domain';
import { AudienceContactService } from '../../audience';
import { PlusmarService } from '../../plusmarservice.class';

export class LineAutomateMessageService {
  public audienceContactService: AudienceContactService;
  //   public lineMessageService: LineMessageService;
  constructor() {
    this.audienceContactService = new AudienceContactService();
    // this.lineMessageService = new LineMessageService();
  }

  async sendLineAutomateMessage(
    pageID: number,
    message: IMessageModelInput,
    subscriptionID: string,
    isPushMessage = false,
    openPayload?: IOpenAPIMessagingPayload,
  ): Promise<boolean> {
    try {
      if (message.messagetype !== IMessageType.FILE) {
        message.text = JSON.stringify(message.text);
      }

      const payload = { pageID };
      message.pageID = pageID;
      message.createdAt = message.createdAt === null ? parseUTCTimestamp(Number(new Date())) : parseUTCTimestamp(Number(message.createdAt));
      if (message.attachments !== undefined && message.attachments !== null && message.attachments[0] !== undefined) {
        if (typeof message.attachments[0].payload === 'string') {
          message.attachments[0].payload = message.attachments[0] !== undefined ? JSON.parse(message.attachments[0].payload as string) : '';
        }
      }

      const latestMessage = await getLatestMessageExceptSentByPage({ audienceID: message.audienceID, pageID: payload.pageID } as IMessageUsers);
      let payloadReplyMsg: ILineReplyMessage;
      let userId = '';
      const pageChannelToken = await getLineChannelTokenByPageID(PlusmarService.readerClient, payload.pageID);

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
          const { url } = JSON.parse(message.payload);
          const decodeFileName = transformLineAttachmentUrl(url);
          message.id = MongooseTypes.ObjectId().toHexString();
          const fileTargetUrl = `${PlusmarService.environment.backendUrl}/file/${message.audienceID}/${message.id}/${decodeFileName}`;
          message.text = JSON.stringify(fileTargetUrl);
        }

        payloadReplyMsg = getPayload(parsePayload.events[0].replyToken, message, subscriptionID);
      } else {
        const customer = await getCustomerByaudienceID(PlusmarService.readerClient, message.audienceID, payload.pageID);

        if (message.messagetype === IMessageType.FILE) {
          const { url } = JSON.parse(message.payload);
          const decodeFileName = transformLineAttachmentUrl(url);
          message.id = MongooseTypes.ObjectId().toHexString();
          const fileTargetUrl = `${PlusmarService.environment.backendUrl}/file/${message.audienceID}/${message.id}/${decodeFileName}`;
          message.text = JSON.stringify(fileTargetUrl);
        }

        payloadReplyMsg = getPayload('directmessage', message, subscriptionID);
        userId = customer.line_user_id;
      }

      let resultMsg = await replyMessage(pageChannelToken.line_channel_accesstoken, payloadReplyMsg, PlusmarService.environment.lineMessageAPI);

      if (resultMsg.status !== 200 && resultMsg.value === 'Invalid reply token') {
        const payloadPushMsg: ILinePushMessage = JSON.parse(JSON.stringify(payloadReplyMsg));
        payloadPushMsg.to = userId;
        //Todo Check Error When Over Push Limit
        resultMsg = await pushMessage(pageChannelToken.line_channel_accesstoken, payloadPushMsg, PlusmarService.environment.lineMessageAPI);
      }
      this.publishMessageReceive(message);
      if (message.messagetype === IMessageType.FILE) {
        message.text = '';
        delete message.payload;
      }

      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const audience = await setLastActivityPlatformDateByAudienceID(client, message.pageID, message.audienceID);
      await updateLatestSentBy(client, message.audienceID, message.pageID, false, MessageSentByEnum.PAGE);
      await PostgresHelper.execBatchCommitTransaction(client);

      await this.audienceContactService.publishOnContactUpdateSubscription(AudienceViewType.MESSAGE, message.pageID, {
        method: AudienceContactActionMethod.TRIGGER_UPDATE,
        audienceID: audience[0].id,
        customerID: audience[0].customer_id,
        sentBy: MessageSentByEnum.PAGE,
      });

      if (openPayload) {
        message.text = openPayload.type === IMessageType.TEXT_BUBBLE ? 'template message' : message.text;
      }

      await this.setMessageBeforeAddToDB(message, message.audienceID, payload.pageID);

      return true;
    } catch (err) {
      console.log('sendLineAutomateMessage err [LOG]:--> ', err);
      return false;
    }
  }

  setMessageBeforeAddToDB = async (message: IMessageModelInput, audienceID: number, pageID: number): Promise<IMessageModel> => {
    const audience = await getAudienceByID(PlusmarService.readerClient, audienceID, pageID);
    return await this.addMessageToDB(audience, message);
  };

  addMessageToDB = async (audience: IAudienceWithCustomer, message: IMessageModelInput): Promise<IMessageModel> => {
    return await addNewMessage(message, null);
  };
  publishMessageReceive = async (message: IMessageModel): Promise<void> => {
    const body = {
      ...message,
      createAt: getUTCTimestamps(),
    };
    const client = PlusmarService.pubsub;
    client.publish(MESSAGE_RECEIVED, { messageReceived: body });
  };
}
