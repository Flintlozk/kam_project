import type { IGQLContext, IPayload, ISubscriptionArg, ISubscriptionBudget, ISubscriptionLimitAndDetails, IUserSubscriptionsContext } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { requireLogin, requireScope, SubscriptionService } from '@reactor-room/itopplus-services-lib';
import { validateSubscriptionIDValidate } from '../../schema';
import { validateDefaultResponse, validateSubscriptionLimitResponseValidate, validateResponseSubscriptionBudget } from '../../schema/default/default.schema';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.CMS])
class Subscription {
  public static instance;
  public static subscriptionService: SubscriptionService;

  public static getInstance() {
    if (!Subscription.instance) Subscription.instance = new Subscription();
    return Subscription.instance;
  }

  constructor() {
    Subscription.subscriptionService = new SubscriptionService();
  }
  async getSubscriptionBudgetHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscriptionBudget> {
    const result = await Subscription.subscriptionService.getSubscriptionBudget(context.payload.subscription.id);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async getAndUpdateSubscriptionContextHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<IUserSubscriptionsContext> {
    const result = await Subscription.subscriptionService.getAndUpdateSubscriptionContext(context.access_token, context.payload.userID, args.subscriptionIndex);
    return result;
  }
  @requireLogin([EnumAuthScope.CMS])
  async getSubscriptionLimitAndDetailsHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscriptionLimitAndDetails> {
    const { subscriptionID } = validateSubscriptionIDValidate<IPayload>(context.payload);
    const result = await Subscription.subscriptionService.getSubscriptionLimitAndDetails(subscriptionID);
    return result;
  }
}

const subscription: Subscription = Subscription.getInstance();
export const subscriptionResolver = {
  Query: {
    getAndUpdateSubscriptionContext: graphQLHandler({
      handler: subscription.getAndUpdateSubscriptionContextHandler,
      validator: validateDefaultResponse,
    }),
    getSubscriptionLimitAndDetails: graphQLHandler({
      handler: subscription.getSubscriptionLimitAndDetailsHandler,
      validator: validateSubscriptionLimitResponseValidate,
    }),
    getSubscriptionBudget: graphQLHandler({
      handler: subscription.getSubscriptionBudgetHandler,
      validator: validateResponseSubscriptionBudget,
    }),
  },
};
