import { environmentLib } from '@reactor-room/environment-services-backend';
import { getDayjs, PostgresHelper, transformMessageImageURl } from '@reactor-room/itopplus-back-end-helpers';
import {
  IAggregateMessageModel,
  IAttachmentsModel,
  IAudienceWithCustomer,
  IFacebookMessagePayloadTypeEnum,
  IMessageModel,
  IMessageModelInput,
  IMessageSearchModel,
  IMessageUsers,
  IMessageWatermark,
  IPayload,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { has, isEmpty, uniq } from 'lodash';
import { getPageMembersByPageIDandUserIDs, getPreviousAudienceOfAudienceID } from '../../data';
import {
  addNewMessage,
  addTempMessage,
  aggregrateCountMessagesByRange,
  getDeliveryMessageWatermark,
  getLatestMessage,
  getLatestMessageExceptSentByPage,
  getLatestMessageIncludePageTemplate,
  getMessageAttachments,
  getMessageExistenceById,
  getMessages,
  getMessagesOnScroll,
  getReadMessageWatermark,
  getTempMessages,
  searchMessage,
  updateMessage,
  updateMessageFromHook,
  upsertTraceMessage,
} from '../../data/message';
import { mapMessageSenderDomain, mapPageMessageSender } from '../../domains/message';
import { AudienceService } from '../audience/audience.service';
import { PlusmarService } from '../plusmarservice.class';
export class MessageService {
  audienceService: AudienceService;
  constructor() {
    this.audienceService = new AudienceService();
  }

  async aggregrateTotalMessage(): Promise<void> {
    const startDate = getDayjs().startOf('y').toDate();
    const endDate = getDayjs().endOf('y').toDate();

    await aggregrateCountMessagesByRange(startDate, endDate);
  }

  searchMessage = async (input: IMessageSearchModel): Promise<IMessageModel> => {
    return await searchMessage(PlusmarService.readerClient, input);
  };

  getMessageExistenceById = async (mid: string, pageID: number): Promise<boolean> => {
    return await getMessageExistenceById(mid, pageID);
  };

  // From plusmar:webhook we need to add message to mongo only (I'm refactor from exist code i'm not sure about logic.)
  addNewMessage = async (input: IMessageModelInput): Promise<IMessageModel> => {
    return await addNewMessage(input, null);
  };

  updateMessageFromHook = async (input: IMessageModelInput): Promise<IMessageModel> => {
    return await updateMessageFromHook(input);
  };

  updateMessage = async (message: IMessageModel, pageID: number): Promise<IMessageModel> => {
    return await updateMessage(message, pageID);
  };

  getMessages = async (users: IMessageUsers, subscriptionID: string): Promise<IMessageModel[]> => {
    let messages = await getMessages(users);
    messages = await this.mapMessageSender(users.pageID, messages);
    messages.map((message) => {
      message = transformMessageImageURl(message, environmentLib.filesServer, subscriptionID);
    });
    return messages;
  };

  getMessageAttachments = async (audienceID: number, pageID: number, limit: number, subscriptionID: string): Promise<IMessageModel[]> => {
    let messages = await getMessageAttachments(audienceID, pageID, limit);
    messages.map((message) => {
      message = transformMessageImageURl(message, environmentLib.filesServer, subscriptionID);
    });
    //update
    messages = await this.mapMessageSender(pageID, messages);
    messages = messages.filter((message) => {
      const attachment = JSON.parse(message?.attachments as string) as IAttachmentsModel[];
      const attachmentWithoutSticker = attachment.filter((attach) => !has(attach?.payload, 'sticker_id'));
      return attachmentWithoutSticker?.length;
    });
    return messages;
  };

  getMessagesOnScroll = async (audienceID: number, pageID: number, index: number, limit: number, subscriptionID: string): Promise<IMessageModel[]> => {
    const audienceIDs = (await getPreviousAudienceOfAudienceID(PlusmarService.readerClient, audienceID, pageID)).map((x) => x.id);
    let messages = await getMessagesOnScroll(audienceIDs, pageID, index, limit);

    if (messages.length < 1) {
      return [];
      // throw new LastMessageRecord();
    }
    messages = await this.mapMessageSender(pageID, messages);
    messages.forEach((message) => (message = transformMessageImageURl(message, environmentLib.filesServer, subscriptionID)));
    return messages.reverse();
  };

  mapMessageSender = async (pageID: number, messages: IMessageModel[]): Promise<IMessageModel[]> => {
    try {
      const userIDs = [];
      for (const message of messages) {
        if (!isEmpty(message?.sender)) {
          userIDs.push(message?.sender.user_id);
        }
      }
      const filterIDs = uniq(userIDs.filter((x) => !!x));
      if (filterIDs.length > 0) {
        const IDs = PostgresHelper.joinInQueries(filterIDs);
        const userList = await getPageMembersByPageIDandUserIDs(PlusmarService.readerClient, pageID, IDs);

        return mapMessageSenderDomain(messages, userList);
      } else {
        return mapPageMessageSender(messages);
      }
    } catch (err) {
      return messages;
    }
  };

  getLatestMessage = async (users: IMessageUsers): Promise<IMessageModel> => {
    const latestMessage = await getLatestMessage(users);
    return latestMessage;
  };

  getLatestMessageExceptSentByPage = async (users: IMessageUsers): Promise<IMessageModel> => {
    return await getLatestMessageExceptSentByPage(users);
  };
  getLatestMessageIncludePageTemplate = async (users: IMessageUsers): Promise<IMessageModel> => {
    try {
      const pageMessage = await getLatestMessageIncludePageTemplate(users);
      if (!isEmpty(pageMessage.attachments)) {
        const parseAttachment = JSON.parse(<string>pageMessage.attachments);
        if (parseAttachment[0].type === IFacebookMessagePayloadTypeEnum.TEMPLATE) {
          return pageMessage;
        }
      }
      return await getLatestMessageExceptSentByPage(users);
    } catch (err) {
      return await getLatestMessageExceptSentByPage(users);
    }
  };

  addMessageToDB = async (payload: IPayload, audience: IAudienceWithCustomer, message: IMessageModelInput, messagingType?: string): Promise<IMessageModel> => {
    const _INBOX = true;
    if (message.sentBy === MessageSentByEnum.PAGE) {
      if (!isEmpty(message?.attachments && message?.attachments[0].type === IFacebookMessagePayloadTypeEnum.TEMPLATE)) {
        // do nothing
      } else {
        await this.audienceService.autoSetAudienceStatus(payload, audience, _INBOX);
      }
    }
    return await addNewMessage(message, messagingType);
  };

  getMessageWatermark = async (pagePSID: string, customerPSID: string): Promise<IMessageWatermark> => {
    const returnWatermark = {
      read: null,
      delivered: null,
      deliveryID: null,
    };

    const readWatermark = await getReadMessageWatermark(customerPSID, pagePSID);
    if (readWatermark !== null) {
      returnWatermark.read = String(readWatermark?.read?.watermark);
    }

    const deliveryWatermark = await getDeliveryMessageWatermark(customerPSID, pagePSID);

    if (deliveryWatermark !== null) {
      const { delivery, mid } = deliveryWatermark;
      returnWatermark.delivered = String(delivery.watermark);
      returnWatermark.deliveryID = mid;
    }

    return returnWatermark;
  };

  getTempMessages = async (): Promise<IAggregateMessageModel[]> => {
    return await getTempMessages();
  };

  addMessageToTempDB = async (message: IMessageModelInput, messagingType?: string): Promise<void> => {
    if (message.sentBy === MessageSentByEnum.AUDIENCE) {
      await addTempMessage(message, messagingType, PlusmarService.environment);
    }
  };

  async upsertTraceMessage(
    webhook,
    stage?: {
      type?: string;
      latestIncoming?: Date;
      lastTraceStage?: number;
      traceStage1?: number;
      traceStage2?: number;
      traceStage3?: number;
      traceStage4?: number;
      traceStage5?: number;
    },
  ): Promise<void> {
    const query: {
      mid?: string;
      commentID?: string;
    } = {};
    const mid = webhook?.entry?.[0]?.messaging?.[0]?.message?.mid;

    if (!isEmpty(mid)) query.mid = mid;
    const commentID = webhook?.entry?.[0]?.changes?.[0]?.value?.comment_id;
    if (!isEmpty(commentID)) query.commentID = commentID;

    if (isEmpty(mid) && isEmpty(commentID)) return;

    await upsertTraceMessage(query, webhook, stage);
  }
}
