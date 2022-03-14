import { IHTTPResult } from '@reactor-room/model-lib';
import {
  EnumAuthScope,
  IAllPageCountNotification,
  IArgGqlTableFilters,
  ICountNotification,
  IGQLContext,
  INotificationSubScription,
  NOTIFICATION_COUNT,
} from '@reactor-room/itopplus-model-lib';
import { NotificationService, PlusmarService, validateContext } from '@reactor-room/itopplus-services-lib';
import { withFilter } from 'graphql-subscriptions';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import {
  validateArrayResponseNotification,
  validateRequestSetStatusNotiInput,
  validateResponseAllPageCountNotification,
  validateResponseCountNotification,
  validateResponseNotification,
} from '../../schema/notification';
import { facebookCommentResolver } from '../facebook/comments';
import { facebookMessageResolver } from '../facebook/message';
import { graphQLHandler } from '../graphql-handler';
import { purchaseOrderResolver } from '../purchase-order';
@requireScope([EnumAuthScope.SOCIAL])
class Notification {
  public static instance;
  public static notificationService: NotificationService;
  public static getInstance() {
    if (!Notification.instance) Notification.instance = new Notification();
    return Notification.instance;
  }

  constructor() {
    Notification.notificationService = new NotificationService();
  }

  async getNotificationInboxHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<any> {
    const { filters } = args;
    return await Notification.notificationService.getNotificationInbox(filters, context.payload.pageID);
  }

  async getCountNotificationInboxHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<ICountNotification> {
    const { filters } = args;
    return await Notification.notificationService.getCountNotificationInbox(filters, context.payload.pageID);
  }
  async getAllPageCountNotificationInboxHandler(parent, args: void, context: IGQLContext): Promise<IAllPageCountNotification[]> {
    return await Notification.notificationService.getAllPageCountNotificationInbox(context.payload.subscriptionID);
  }

  async setStatusNotifyByStatusHandler(parent, args, context: IGQLContext): Promise<any> {
    const { audienceID, statusNotify, platform } = await validateRequestSetStatusNotiInput(args);
    return await Notification.notificationService.setStatusNotifyByStatus(audienceID, context.payload.pageID, statusNotify, platform);
  }
  async markAllNotificationAsReadHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    return await Notification.notificationService.markAllNotificationAsRead(context.payload.pageID);
  }
}
const notification: Notification = Notification.getInstance();
export const notificationResolver = {
  NotificationInbox: {
    latestMessage(parent, args, context, info) {
      return facebookMessageResolver.Query.getLatestMessageIncludePageTemplate(parent, { audienceID: parent.id }, context);
    },
    latestComment(parent, args, context, info) {
      return facebookCommentResolver.Query.getLatestCommentExceptSentByPage(parent, { audienceID: parent.id }, context);
    },
    latestOrderPipeline(parent, args, context, info) {
      return purchaseOrderResolver.Query.getPurchaseOrderPipeline(parent, { audienceID: parent.id }, context);
    },
  },
  Query: {
    getNotificationInbox: graphQLHandler({
      handler: notification.getNotificationInboxHandler,
      validator: validateArrayResponseNotification,
    }),
    getCountNotificationInbox: graphQLHandler({
      handler: notification.getCountNotificationInboxHandler,
      validator: validateResponseCountNotification,
    }),
    getAllPageCountNotificationInbox: graphQLHandler({
      handler: notification.getAllPageCountNotificationInboxHandler,
      validator: validateResponseAllPageCountNotification,
    }),
  },
  Mutation: {
    setStatusNotifyByStatus: graphQLHandler({
      handler: notification.setStatusNotifyByStatusHandler,
      validator: validateResponseNotification,
    }),
    markAllNotificationAsRead: graphQLHandler({
      handler: notification.markAllNotificationAsReadHandler,
      validator: (x) => x,
    }),
  },
  Subscription: {
    countNotificationSubscription: {
      subscribe: withFilter(
        () => PlusmarService.pubsub.asyncIterator(NOTIFICATION_COUNT),
        async (payload: INotificationSubScription, variables, context: IGQLContext) => {
          if (context.payload.pageID == undefined) {
            await validateContext(context, [EnumAuthScope.SOCIAL]);
          }
          return payload.page_id === context.payload.pageID;
        },
      ),
    },
  },
};
