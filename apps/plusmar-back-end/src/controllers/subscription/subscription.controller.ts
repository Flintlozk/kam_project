import {
  IGQLContext,
  IPayload,
  ISubscriptionArg,
  ISubscription,
  ISubscriptionLimitAndDetails,
  IUserSubscriptionMappingModel,
  ISubscriptionPlan,
  IUserSubscriptionsContext,
  ISubscriptionBudget,
} from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { SubscriptionService } from '@reactor-room/itopplus-services-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import {
  validateRequestEmail,
  validateRequestUserID,
  validateuserIDAccessTokenObjectValidate,
  validateSubscriptionIDValidate,
  validateSIDAccessTokenObjectValidate,
} from '../../schema/common';
import { validateTokenInput } from '../../schema/setting';
import {
  validateRequestSubscriptionIndex,
  validateResponseSubscription,
  validateSubscriptionPlanID,
  validateUserSubscriptionMappingModelResponse,
  validateSubscriptionLimitResponseValidate,
  validateSubscriptionPlanValidate,
  validateResponseUserSubscriptionContext,
  validateResponseSubscriptionBudget,
  validateSubscriptionPlanFeatureType,
} from '../../schema/subscription';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
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

  // @checkAppScope(EnumAppScopeType.MORE_COMMERCE)
  async getAndUpdateSubscriptionContextHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<IUserSubscriptionsContext> {
    const { subscriptionIndex } = validateRequestSubscriptionIndex<ISubscriptionArg>(args);
    const { userID } = validateuserIDAccessTokenObjectValidate<IPayload>(context.payload);
    const result = await Subscription.subscriptionService.getAndUpdateSubscriptionContext(context.access_token, userID, subscriptionIndex);
    return result;
  }
  async getSubscriptionBudgetHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscriptionBudget> {
    const result = await Subscription.subscriptionService.getSubscriptionBudget(context.payload.subscription.id);
    return result;
  }

  async getUserSubscriptionHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<IUserSubscriptionMappingModel> {
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    return await Subscription.subscriptionService.getUserSubscription(userID);
  }

  async changingSubscriptionHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscription> {
    const { userID, accessToken } = validateuserIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { subscriptionIndex } = validateRequestSubscriptionIndex<ISubscriptionArg>(args);
    const result = await Subscription.subscriptionService.changingSubscription(context.access_token, userID, subscriptionIndex, accessToken);
    return result;
  }

  async getSubscriptionLimitAndDetailsHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscriptionLimitAndDetails> {
    const { subscriptionID } = validateSubscriptionIDValidate<IPayload>(context.payload);
    const result = await Subscription.subscriptionService.getSubscriptionLimitAndDetails(subscriptionID);
    return result;
  }

  async getSubscriptionPlanDetailsHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscriptionPlan> {
    const { subscriptionPlanID } = validateSubscriptionPlanID<ISubscriptionArg>(args);
    const result = await Subscription.subscriptionService.getSubscriptionPlanDetails(subscriptionPlanID);
    return result;
  }

  async getSubscriptionPlanDetailsByPackageTypeHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscriptionPlan> {
    const { packageType } = validateSubscriptionPlanFeatureType<ISubscriptionArg>(args);
    const result = await Subscription.subscriptionService.getSubscriptionPlanDetailsByPackageType(packageType);
    return result;
  }

  // Mutation

  async updateInvitedMemberSubscriptionMappingHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<ISubscription> {
    const { email } = validateRequestEmail<IPayload>(context.payload);
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { token } = validateTokenInput<ISubscriptionArg>(args);
    const result = await Subscription.subscriptionService.updateInvitedMemberSubscriptionMapping(ID, accessToken, token, email);
    return result;
  }

  async createUserSubscriptionHandler(parent, args: ISubscriptionArg, context: IGQLContext): Promise<IUserSubscriptionMappingModel> {
    const { userID, accessToken } = validateuserIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { subscriptionPlanID, ref } = validateSubscriptionPlanID<ISubscriptionArg>(args);
    const result = await Subscription.subscriptionService.createUserSubscription(userID, subscriptionPlanID, ref, accessToken);
    return result;
  }
}

const subscription: Subscription = Subscription.getInstance();
export const subscriptionResolver = {
  Query: {
    getAndUpdateSubscriptionContext: graphQLHandler({
      handler: subscription.getAndUpdateSubscriptionContextHandler,
      validator: validateResponseUserSubscriptionContext,
    }),
    getSubscriptionBudget: graphQLHandler({
      handler: subscription.getSubscriptionBudgetHandler,
      validator: validateResponseSubscriptionBudget,
    }),
    getUserSubscription: graphQLHandler({
      handler: subscription.getUserSubscriptionHandler,
      validator: validateUserSubscriptionMappingModelResponse,
    }),
    changingSubscription: graphQLHandler({
      handler: subscription.changingSubscriptionHandler,
      validator: validateResponseSubscription,
    }),
    getSubscriptionLimitAndDetails: graphQLHandler({
      handler: subscription.getSubscriptionLimitAndDetailsHandler,
      validator: validateSubscriptionLimitResponseValidate,
    }),
    getSubscriptionPlanDetails: graphQLHandler({
      handler: subscription.getSubscriptionPlanDetailsHandler,
      validator: validateSubscriptionPlanValidate,
    }),
    getSubscriptionPlanDetailsByPackageType: graphQLHandler({
      handler: subscription.getSubscriptionPlanDetailsByPackageTypeHandler,
      validator: validateSubscriptionPlanValidate,
    }),
  },
  Mutation: {
    updateInvitedMemberSubscriptionMapping: graphQLHandler({
      handler: subscription.updateInvitedMemberSubscriptionMappingHandler,
      validator: validateResponseSubscription,
    }),
    createUserSubscription: graphQLHandler({
      handler: subscription.createUserSubscriptionHandler,
      validator: validateUserSubscriptionMappingModelResponse,
    }),
  },
};
