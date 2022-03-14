import { getFBToken } from '@reactor-room/itopplus-back-end-helpers';
import { IGQLFileSteam } from '@reactor-room/model-lib';
import {
  EnumAuthScope,
  FacebookMessagingType,
  IAttachmentsExpired,
  ICheckMessageActivity,
  IDeliveryModel,
  IFacebookMessageResponse,
  IFacebookUploadAttachmentResponse,
  IGQLContext,
  IMessageModel,
  IMessageModelInput,
  IMessageWatermark,
  MESSAGE_RECEIVED,
} from '@reactor-room/itopplus-model-lib';
import { FacebookMessageService, MessageService, PlusmarService, requireLogin, requireScope, validateContext } from '@reactor-room/itopplus-services-lib';
import { withFilter } from 'graphql-subscriptions';
import {
  validateAddMessageRequest,
  validateGetAttachmentUrlExpiredRequest,
  validateGetAttachmentUrlExpiredResponse,
  validateGetMessagesByPSID,
  validateGetMessageWatermark,
  validateMessageActivityChecker,
} from '../../../schema/facebook/message';
import { graphQLHandler } from '../../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class FacebookMessageController {
  public static instance;
  public static messageService: MessageService;
  public static facebookMessageService = new FacebookMessageService();

  public static getInstance() {
    if (!FacebookMessageController.instance) FacebookMessageController.instance = new FacebookMessageController();
    return FacebookMessageController.instance;
  }

  constructor() {
    FacebookMessageController.messageService = new MessageService();
  }

  async addMessageHandler(parent, args: { message: IMessageModelInput; messageType: FacebookMessagingType }, context: IGQLContext): Promise<IMessageModelInput> {
    const params = validateAddMessageRequest(args);
    return await FacebookMessageController.facebookMessageService.addMessage(params.message, context.payload, params.messageType);
  }
  async checkMessageActivityHandler(parent, args: { audienceID: number }, context: IGQLContext): Promise<ICheckMessageActivity> {
    return await FacebookMessageController.facebookMessageService.checkMessageActivity(context.payload.pageID, args.audienceID);
  }

  async updateMessageHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    return await FacebookMessageController.messageService.updateMessage(args.message, context.payload.pageID);
  }

  async sendPrivateMessageHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    return await FacebookMessageController.facebookMessageService.sendPrivateMessage(context.payload, args.message, args.commentID);
  }

  async sendAttachmentHandler(parent, args, context: IGQLContext): Promise<IFacebookMessageResponse> {
    const { audienceID, attachmentID, type } = args;
    const {
      payload: { pageID },
    } = context || {};

    return await FacebookMessageController.facebookMessageService.sendAttachment(getFBToken(context), audienceID, attachmentID, type, pageID);
  }

  async uploadAttachmentHandler(parent, args: { file: IGQLFileSteam; audienceID: number }, context: IGQLContext): Promise<IFacebookUploadAttachmentResponse> {
    const { file, audienceID } = args;
    const {
      payload: {
        pageID,
        page: { uuid: pageUUID },
      },
    } = context || {};
    return await FacebookMessageController.facebookMessageService.uploadAttachment(pageUUID, pageID, audienceID, getFBToken(context), file);
  }

  async getMessagesHandler(parent, args, context: IGQLContext): Promise<IMessageModel[]> {
    const {
      payload: { pageID, subscriptionID },
    } = context || {};
    return await FacebookMessageController.messageService.getMessages({ audienceID: args.audienceID, pageID }, subscriptionID);
  }
  async getMessagesOnScrollHandler(parent, args: { audienceID: number; index: number; limit: number }, context: IGQLContext): Promise<IMessageModel[]> {
    const {
      payload: { pageID },
    } = context || {};
    return await FacebookMessageController.messageService.getMessagesOnScroll(args.audienceID, pageID, args.index, args.limit, context.payload.subscriptionID);
  }

  async getMessageAttachmentsHandler(parent, args: { audienceID: number; limit: number }, context: IGQLContext): Promise<IMessageModel[]> {
    const {
      payload: { pageID, subscriptionID },
    } = context || {};
    return await FacebookMessageController.messageService.getMessageAttachments(args.audienceID, pageID, args.limit, subscriptionID);
  }

  async getLatestMessageHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    const {
      payload: { pageID },
    } = context || {};
    return await FacebookMessageController.messageService.getLatestMessage({ audienceID: args.audienceID, pageID });
  }

  async getLatestMessageExceptSentByPageHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    const {
      payload: { pageID },
    } = context || {};
    return await FacebookMessageController.messageService.getLatestMessageExceptSentByPage({ audienceID: args.audienceID, pageID });
  }
  async getLatestMessageIncludePageTemplateHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    const {
      payload: { pageID },
    } = context || {};
    return await FacebookMessageController.messageService.getLatestMessageIncludePageTemplate({ audienceID: args.audienceID, pageID });
  }
  async getMessageWatermarkHandler(parent, args, context: IGQLContext): Promise<IMessageWatermark> {
    const {
      payload: {
        page: { fb_page_id: pagePSID },
      },
    } = context;
    return await FacebookMessageController.messageService.getMessageWatermark(pagePSID, args.PSID);
  }
  async getAttachmentUrlExpiredHandler(parent, args, context: IGQLContext): Promise<IMessageModel> {
    const attachments = await validateGetAttachmentUrlExpiredRequest<IAttachmentsExpired>(args);
    return await FacebookMessageController.facebookMessageService.getAttachmentUrlExpired(attachments, getFBToken(context));
  }
}

const facebookMessageController: FacebookMessageController = new FacebookMessageController();
export const facebookMessageResolver = {
  Mutation: {
    updateMessage: graphQLHandler({
      handler: facebookMessageController.updateMessageHandler,
      validator: validateGetMessagesByPSID,
    }),
    addMessage: graphQLHandler({
      handler: facebookMessageController.addMessageHandler,
      validator: validateGetMessagesByPSID,
    }),
    sendPrivateMessage: graphQLHandler({
      handler: facebookMessageController.sendPrivateMessageHandler,
      validator: validateGetMessagesByPSID,
    }),
    sendAttachment: graphQLHandler({
      handler: facebookMessageController.sendAttachmentHandler,
      validator: validateGetMessagesByPSID,
    }),
    uploadAttachment: graphQLHandler({
      handler: facebookMessageController.uploadAttachmentHandler,
      validator: validateGetMessagesByPSID,
    }),
  },
  Query: {
    checkMessageActivity: graphQLHandler({
      handler: facebookMessageController.checkMessageActivityHandler,
      validator: validateMessageActivityChecker,
    }),

    getMessages: graphQLHandler({
      handler: facebookMessageController.getMessagesHandler,
      validator: validateGetMessagesByPSID,
    }),
    getMessagesOnScroll: graphQLHandler({
      handler: facebookMessageController.getMessagesOnScrollHandler,
      validator: validateGetMessagesByPSID,
    }),
    getMessageAttachments: graphQLHandler({
      handler: facebookMessageController.getMessageAttachmentsHandler,
      validator: validateGetMessagesByPSID,
    }),
    getLatestMessage: graphQLHandler({
      handler: facebookMessageController.getLatestMessageHandler,
      validator: validateGetMessagesByPSID,
    }),
    getLatestMessageExceptSentByPage: graphQLHandler({
      handler: facebookMessageController.getLatestMessageExceptSentByPageHandler,
      validator: validateGetMessagesByPSID,
    }),
    getLatestMessageIncludePageTemplate: graphQLHandler({
      handler: facebookMessageController.getLatestMessageIncludePageTemplateHandler,
      validator: validateGetMessagesByPSID,
    }),
    getMessageWatermark: graphQLHandler({
      handler: facebookMessageController.getMessageWatermarkHandler,
      validator: validateGetMessageWatermark,
    }),
    getAttachmentUrlExpired: graphQLHandler({
      handler: facebookMessageController.getAttachmentUrlExpiredHandler,
      validator: validateGetAttachmentUrlExpiredResponse,
    }),
  },
  Subscription: {
    messageReceived: {
      subscribe: withFilter(
        () => PlusmarService.pubsub.asyncIterator(MESSAGE_RECEIVED),
        async (payload, variables, context: IGQLContext) => {
          if (context.payload.pageID == undefined) {
            await validateContext(context, [EnumAuthScope.SOCIAL]);
          }
          const messageReceived = payload?.messageReceived as IDeliveryModel;
          return messageReceived.audienceID === variables.audienceID && messageReceived.pageID === context.payload.pageID;
        },
      ),
    },
  },
};
