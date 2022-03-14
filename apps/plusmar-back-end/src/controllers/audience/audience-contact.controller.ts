import { AudienceDomainType, AudienceViewType, AUDIENCE_REDIS_UPDATE, EnumAuthScope, IAudienceMessageFilter, IAudienceRedisPayload } from '@reactor-room/itopplus-model-lib';
import type {
  IAudienceContacts,
  IAudienceContactsArgument,
  IAudienceContactSubscriptionArgs,
  IAudienceContactSubscriptionPayload,
  IGQLContext,
  IPayload,
} from '@reactor-room/itopplus-model-lib';
import { CONTACT_UPDATE } from '@reactor-room/itopplus-model-lib';
import { AudienceContactService, PlusmarService, validateContext } from '@reactor-room/itopplus-services-lib';
import { withFilter } from 'graphql-subscriptions';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { validateResponseCustomer } from '../../schema/customer';
import { graphQLHandler } from '../graphql-handler';
import { IHTTPResult } from '@reactor-room/model-lib';
import { validateRemoveTokenFromRadisInput } from '../../schema/audience/audience.schema';
import { customerResolver } from '../customer';

class AudienceContact {
  public static instance;
  public static audienceContactService: AudienceContactService;
  public static getInstance() {
    if (!AudienceContact.instance) AudienceContact.instance = new AudienceContact();
    return AudienceContact.instance;
  }

  constructor() {
    AudienceContact.audienceContactService = new AudienceContactService();
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getAudienceContactHandler(
    parent,
    args: { audienceID: number; domain: AudienceViewType; filters: IAudienceMessageFilter },
    context: IGQLContext,
  ): Promise<IAudienceContacts> {
    const { pageID } = context.payload;
    const result = await AudienceContact.audienceContactService.getAudienceContact(pageID, args.audienceID, args.domain, args.filters);
    return result;
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getAudienceContactsHandler(
    parent,
    args: { audienceIDs: number[]; domain: AudienceViewType; filters: IAudienceMessageFilter },
    context: IGQLContext,
  ): Promise<IAudienceContacts[]> {
    const { pageID } = context.payload;
    const result = await AudienceContact.audienceContactService.getAudienceContacts(pageID, args.audienceIDs, args.domain, args.filters);
    return result;
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getAudienceContactsWithOfftimesHandler(
    parent,
    args: { audienceIDs: number[]; domain: AudienceViewType; filters: IAudienceMessageFilter },
    context: IGQLContext,
  ): Promise<IAudienceContacts[]> {
    const { pageID } = context.payload;
    const result = await AudienceContact.audienceContactService.getAudienceContactsWithOfftimes(pageID, args.filters);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getCustomerContactsHandler(
    parent,
    args: { audienceIDs: number[]; domain: AudienceViewType; filters: IAudienceMessageFilter },
    context: IGQLContext,
  ): Promise<IAudienceContacts[]> {
    const { pageID } = context.payload;
    const result = await AudienceContact.audienceContactService.getCustomerContacts(pageID, args.audienceIDs, args.domain, args.filters);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getCustomerContactListHandler(parent, args: IAudienceContactsArgument, context: IGQLContext): Promise<IAudienceContacts[]> {
    const { pageID } = context.payload;
    const result = await AudienceContact.audienceContactService.getCustomerContactList(pageID, args.listIndex, args.skip, args.filters);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getCustomerContactsWithOfftimesHandler(
    parent,
    args: { audienceIDs: number[]; domain: AudienceViewType; filters: IAudienceMessageFilter },
    context: IGQLContext,
  ): Promise<IAudienceContacts[]> {
    const { pageID } = context.payload;
    const result = await AudienceContact.audienceContactService.getCustomerContactsWithOfftimes(pageID, args.filters);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async removeTokenFromAudienceContactListHandler(parent, args: IAudienceContactsArgument, context: IGQLContext): Promise<IHTTPResult> {
    const { pageId, token, isAddToRedis } = validateRemoveTokenFromRadisInput<IAudienceContactsArgument>(args);
    return await AudienceContact.audienceContactService.removeTokenFromAudienceContactList(pageId, token, isAddToRedis);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async setAudienceUnreadHandler(parent, args: { audienceID: number }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await AudienceContact.audienceContactService.setAudienceUnread(pageID, args.audienceID);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async setAudienceAssigneeHandler(parent, args: { audienceID: number; userID: number }, context: IGQLContext): Promise<IHTTPResult> {
    return await AudienceContact.audienceContactService.setAudienceAssignee(context.payload.pageID, args.audienceID, args.userID);
  }

  onContactUpdateSubscriptionHandler() {
    return withFilter(
      () => {
        return PlusmarService.pubsub.asyncIterator(CONTACT_UPDATE);
      },
      async (payload: IAudienceContactSubscriptionPayload, variables: IAudienceContactSubscriptionArgs, context: IGQLContext) => {
        if (context.payload.pageID == undefined) {
          await validateContext(context, [EnumAuthScope.SOCIAL]);
        }
        const params = payload?.onContactUpdateSubscription as IAudienceContactSubscriptionArgs;
        return params.pageID === context.payload.pageID;
      },
    );
  }

  onAudienceRedisUpdateSubscriptionHandler() {
    return withFilter(
      () => {
        return PlusmarService.pubsub.asyncIterator(AUDIENCE_REDIS_UPDATE);
      },
      async (payload, variables: IAudienceContactSubscriptionArgs, context: IGQLContext) => {
        if (context.payload.pageID == undefined) {
          await validateContext(context, [EnumAuthScope.SOCIAL]);
        }
        const params = payload;
        return Number(params.onAudienceRedisUpdateSubscription.pageID) === context.payload.pageID;
      },
    );
  }
}

const audienceContact: AudienceContact = AudienceContact.getInstance();
export const audienceContactResolver = {
  AudienceContacts: {
    tags(parent, args, context, info) {
      return customerResolver.Query.getCustomerTagByPageByID(parent, { id: parent.customer_id }, context);
    },
  },
  Query: {
    getCustomerContactList: graphQLHandler({
      handler: audienceContact.getCustomerContactListHandler,
      validator: validateResponseCustomer,
    }),
    getCustomerContacts: graphQLHandler({
      handler: audienceContact.getCustomerContactsHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceContact: graphQLHandler({
      handler: audienceContact.getAudienceContactHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceContacts: graphQLHandler({
      handler: audienceContact.getAudienceContactsHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceContactsWithOfftimes: graphQLHandler({
      handler: audienceContact.getAudienceContactsWithOfftimesHandler,
      validator: validateResponseCustomer,
    }),
    getCustomerContactsWithOfftimes: graphQLHandler({
      handler: audienceContact.getCustomerContactsWithOfftimesHandler,
      validator: validateResponseCustomer,
    }),
  },
  Mutation: {
    removeTokenFromAudienceContactList: graphQLHandler({
      handler: audienceContact.removeTokenFromAudienceContactListHandler,
      validator: validateResponseCustomer,
    }),
    setAudienceUnread: graphQLHandler({
      handler: audienceContact.setAudienceUnreadHandler,
      validator: validateResponseCustomer,
    }),
    setAudienceAssignee: graphQLHandler({
      handler: audienceContact.setAudienceAssigneeHandler,
      validator: validateResponseCustomer,
    }),
  },
  Subscription: {
    onContactUpdateSubscription: {
      subscribe: audienceContact.onContactUpdateSubscriptionHandler(),
    },
    onAudienceRedisUpdateSubscription: {
      subscribe: audienceContact.onAudienceRedisUpdateSubscriptionHandler(),
    },
  },
};
