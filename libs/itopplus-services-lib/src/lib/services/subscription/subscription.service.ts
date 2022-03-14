import { createMailOption, createTransporter, cryptoEncode, getKeysFromSession, PostgresHelper, publishMessage, setSessionValue } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { renewExpiredDateFreePackage } from '@reactor-room/itopplus-back-end-helpers';
import {
  EnumAppScopeType,
  EnumAuthError,
  EnumInvitedUserError,
  EnumSubscriptionPackageType,
  EnumUserSubscriptionType,
  EnumValidateToken,
  IFacebookThreadUserMetadata,
  IPageMemberModel,
  IPageMemberToken,
  IPages,
  IPayload,
  IPlanLimitAndDetails,
  ISubscription,
  ISubscriptionBudget,
  ISubscriptionIDObject,
  ISubscriptionLimitAndDetails,
  ISubscriptionPlan,
  ISubscriptionUserDetail,
  IUserCredential,
  IUserSubscriptionMappingModel,
  IUserSubscriptionsContext,
  SUBSCRIPTION_UPDATE,
} from '@reactor-room/itopplus-model-lib';
import {
  activePageMember,
  addSubscriptionMappingToUser,
  createSubscription,
  deletePageMemberToken,
  findInvitedUserProfile,
  getPageAppScopeByPageID,
  getPageMemberByPageIDAndEmail,
  getPageMemberByPageIDAndUserID,
  getPageMemberTokenByPageIDAndUserEmail,
  getPagesByUserIDAndSubscriptionID,
  getSubscriptionAndUserDetail,
  getSubscriptionByIDAndUserID,
  getSubscriptionByPageID,
  getSubscriptionBySubscriptionID,
  getSubscriptionByUserID,
  getSubscriptionCurrentBudget,
  getSubscriptionLimitAndDetails,
  getSubscriptionPlan,
  getSubscriptionPlanByPackageType,
  getUserBySID,
  getUserSubscriptionMappingByUserID,
  getUserSubscriptions,
  sendInvitationEmail,
  updateSubscriptionExpireDate,
  updateSubscriptionLimit,
  updateSubscriptionStatus,
  updateSubscriptionStorageAccount,
  updateSubscriptionWithPlan,
  verifyToken,
} from '../../data';
import { mapAppScopes, mapUserSubScriptionsContext, validatePageMemberToken } from '../../domains';
import { PagesError, SubscriptionError, UserNotFoundError, ValidatePageMemberTokenError } from '../../errors';
import { OrderHistoryService } from '../order-history';
import { PlusmarService } from '../plusmarservice.class';
import { SettingService } from '..';

export class SubscriptionService {
  public subscriptionOrderService: OrderHistoryService;

  constructor() {
    this.subscriptionOrderService = new OrderHistoryService();
  }

  //Main function for updated subscription the Content
  getAndUpdateSubscriptionContext = async (accessToken: string, userID: number, subscriptionIndex: number): Promise<IUserSubscriptionsContext> => {
    const subscriptions = await getUserSubscriptions(PlusmarService.readerClient, userID);
    if (!subscriptions) throw new SubscriptionError(EnumAuthError.NO_SUBSCRIPTIONS);
    const subscriptionsContext = mapUserSubScriptionsContext(subscriptions);
    const subscriptionContext = subscriptionsContext.subscriptions[subscriptionIndex];
    if (!subscriptionContext) throw new SubscriptionError(EnumAuthError.NO_SUBSCRIPTION_AT_INDEX);

    //TODO: Handle this case con forntend and add more case of expire subscription
    if (!subscriptionContext.expiredAt) throw new SubscriptionError('NULL_OR_EXPIRE_SUBSCRIPTIONS');
    if (subscriptionContext.isExpired && subscriptionContext.planId === 1) {
      await this.subscriptionOrderService.renewSubscriptionFreePackage(subscriptionContext);
    }
    let subscriptionLimit = await getSubscriptionLimitAndDetails(PlusmarService.readerClient, subscriptionContext.id);
    if (!subscriptionLimit.maximumLeads) {
      const subscriptionPlan = await getSubscriptionPlan(PlusmarService.readerClient, subscriptionContext.planId);
      await updateSubscriptionLimit(PlusmarService.writerClient, subscriptionContext.id, subscriptionPlan);
      subscriptionLimit = await getSubscriptionLimitAndDetails(PlusmarService.readerClient, subscriptionContext.id);
    }

    const { value } = await verifyToken(accessToken, PlusmarService.environment);
    const redisSessionKey = value;
    if (redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const session = {
        ...userKey,
        subscriptionID: subscriptionContext.id,
        subscription: subscriptionContext as ISubscription,
        limitResources: subscriptionLimit as IPlanLimitAndDetails,
      } as IPayload;
      // TODO:

      // Note : Set Subscrption by subscriptionindex to redis context
      setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
    }

    const userSubscriptionContext = {
      ...subscriptionsContext,
      subscription: subscriptionContext,
    } as IUserSubscriptionsContext;
    return userSubscriptionContext;
  };

  getSubscriptionBudget = async (subscriptionID: string): Promise<ISubscriptionBudget> => {
    const budget = await getSubscriptionCurrentBudget(PlusmarService.readerClient, subscriptionID);
    return budget;
  };

  changingSubscription = async (accessToken: string, userID: number, subscriptionIndex: number, triggerToken: string): Promise<ISubscription> => {
    const subscriptions: ISubscription[] = await getSubscriptionByUserID(PlusmarService.readerClient, userID);
    if (!subscriptions) throw new SubscriptionError(EnumAuthError.NO_SUBSCRIPTIONS);
    const currentSubscription = await this.returnCurrentSubscription(accessToken, subscriptions, subscriptionIndex);
    const pages = await getPagesByUserIDAndSubscriptionID(PlusmarService.readerClient, userID, currentSubscription.id);
    if (pages) {
      let page = { ...pages[0], pageAppScope: [] };
      const pageAppScopes = await getPageAppScopeByPageID(PlusmarService.readerClient, page.id);
      if (pageAppScopes) {
        const appScopes = mapAppScopes(pageAppScopes);
        page = {
          ...page,
          page_app_scope: appScopes,
        };
      }
      await this.resetPagesIndex(accessToken, page);
      const settingsService = new SettingService();
      settingsService.lineSecretPubToRedis(page.line_channel_secret, page.uuid);
    }
    await this.triggerSubscription(triggerToken);
    return currentSubscription;
  };

  resetPagesIndex = async (accessToken: string, page: IPages): Promise<IPages> => {
    const { value: redisSessionKey } = await verifyToken(accessToken, PlusmarService.environment);
    if (redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const session = { ...userKey, pageID: page.id, page: page };

      // Note : reset page in context to target page
      setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
      return page;
    } else {
      throw new PagesError('RESET_PAGE_ID_ERROR');
    }
  };

  returnCurrentSubscription = async (accessToken: string, subscriptions: ISubscription[], subscriptionIndex: number): Promise<ISubscription> => {
    const { value: redisSessionKey } = await verifyToken(accessToken, PlusmarService.environment);
    if (redisSessionKey) {
      const subscription = subscriptions[subscriptionIndex] as ISubscription;
      if (!subscription) throw new SubscriptionError('NO_SUBSCRIPTION_AT_INDEX');
      const subscriptionLimit: ISubscriptionLimitAndDetails = await getSubscriptionLimitAndDetails(PlusmarService.readerClient, subscription.id);
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const session = { ...userKey, subscriptionID: subscription.id, subscription: subscription, limitResources: subscriptionLimit as IPlanLimitAndDetails };

      // Note : reset subscription in context to target page
      setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
      return subscription;
    } else {
      throw new SubscriptionError('SET SUBSCRIPTION ID ERROR');
    }
  };

  getUserSubscription = async (userID: number): Promise<IUserSubscriptionMappingModel> => {
    const result = await getUserSubscriptionMappingByUserID(PlusmarService.readerClient, userID);
    if (!result) throw new SubscriptionError('NO_SUBSCRIPTION');
    const subscription: ISubscription = await getSubscriptionBySubscriptionID(PlusmarService.readerClient, result.subscription_id);
    if (!subscription || !subscription.planId) throw new SubscriptionError('NO_SUBSCRIPTION');
    return result;
  };
  getSubscriptionByPageID = async (pageID: number): Promise<ISubscription> => {
    return await getSubscriptionByPageID(PlusmarService.readerClient, pageID);
  };
  updateInvitedMemberSubscriptionMapping = async (SID: string, accessToken: string, token: string, email: string): Promise<ISubscription> => {
    const invitedUser: IHTTPResult = await verifyToken(token, PlusmarService.environment);
    if (invitedUser.value === EnumAuthError.INVALID_TOKEN) throw new SubscriptionError(EnumAuthError.INVALID_TOKEN);

    const userFromFB: IFacebookThreadUserMetadata = await findInvitedUserProfile(SID, accessToken);
    const user: IUserCredential = await getUserBySID(PlusmarService.readerClient, SID);

    if (!user) throw new UserNotFoundError();
    if (!userFromFB.email || userFromFB.email !== invitedUser.value.email) {
      throw new SubscriptionError(EnumInvitedUserError.EMAIL_DIFFEREN);
    }
    const pageMemberToken: IPageMemberToken = await getPageMemberTokenByPageIDAndUserEmail(PlusmarService.readerClient, invitedUser.value.page_id, invitedUser.value.email);
    const validateMemberToken: EnumValidateToken = validatePageMemberToken(token, invitedUser.value, pageMemberToken);
    if (validateMemberToken !== EnumValidateToken.VALID) {
      throw new ValidatePageMemberTokenError(validateMemberToken);
    }

    const userPageMappingByEmail: IPageMemberModel = await getPageMemberByPageIDAndEmail(PlusmarService.readerClient, invitedUser.value.page_id, email);
    const userPageMappingByID: IPageMemberModel = await getPageMemberByPageIDAndUserID(PlusmarService.readerClient, invitedUser.value.page_id, user.id);
    if (userPageMappingByEmail && userPageMappingByID && userPageMappingByEmail.id !== userPageMappingByID.id)
      throw new Error(EnumInvitedUserError.ALREADY_MEMBER_WITH_OTHER_EMAIL);

    const subscriptionIDObject: ISubscriptionIDObject = await getSubscriptionByPageID(PlusmarService.readerClient, invitedUser.value.page_id);
    if (!subscriptionIDObject) throw new SubscriptionError(EnumInvitedUserError.NO_INVITE_SUBSCRIPTION_FOUND);

    await this.activeInviteMemberMapping(userPageMappingByEmail, subscriptionIDObject.id, user.id, pageMemberToken.id);
    const result = await getSubscriptionByIDAndUserID(PlusmarService.readerClient, subscriptionIDObject.id, user.id);
    return result;
  };

  activeInviteMemberMapping = async (userPageMapping: IPageMemberModel, subscriptionID: string, userID: number, pageMemberTokenID: number): Promise<void> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const subscription: ISubscription = await getSubscriptionByIDAndUserID(PlusmarService.readerClient, subscriptionID, userID);
      if (!subscription) await addSubscriptionMappingToUser(client, userID, subscriptionID, EnumUserSubscriptionType.MEMBER);
      await activePageMember(client, userPageMapping.id, userID, true);
      await deletePageMemberToken(client, pageMemberTokenID);
      await PostgresHelper.execBatchCommitTransaction(client);
    } catch (error) {
      console.log('Err in updateInviteMemberMapping: ', error);
      throw new SubscriptionError(error.message);
    }
  };

  createUserSubscription = async (userID: number, subscriptionPlanID: number, ref: string, token: string): Promise<IUserSubscriptionMappingModel> => {
    try {
      let subscriptionID = '';
      // TODO: Nams : Get subscription using subscription ID from context to support multi subscriptions
      const userSubscription = await getUserSubscriptionMappingByUserID(PlusmarService.readerClient, userID);
      if (userSubscription) {
        const subscription = await getSubscriptionBySubscriptionID(PlusmarService.readerClient, userSubscription.subscription_id);
        if (subscription.planId) throw new SubscriptionError('ALREADY_HAVE_SUB');
        subscriptionID = subscription.id;
      } else {
        const subscriptionIDObject = await createSubscription(PlusmarService.writerClient, false, ref);
        if (!subscriptionIDObject) throw new SubscriptionError('ERROR_CREATE_SUBSCRIPTION');

        await updateSubscriptionStorageAccount(PlusmarService.writerClient, subscriptionIDObject.id, subscriptionIDObject.id);
        subscriptionID = subscriptionIDObject.id;
        await addSubscriptionMappingToUser(PlusmarService.writerClient, userID, subscriptionID, EnumUserSubscriptionType.OWNER);
      }

      const subscriptionPlan = await getSubscriptionPlan(PlusmarService.readerClient, subscriptionPlanID);
      if (!subscriptionPlan) throw new SubscriptionError('INVALID_SUBSCRIPTION_PLAN');
      await this.triggerSubscription(token);
      if (subscriptionPlanID === 1) await this.updateSubscriptionFreePlan(subscriptionID, subscriptionPlan);

      return await getUserSubscriptionMappingByUserID(PlusmarService.readerClient, userID);
    } catch (err) {
      console.log('SubscriptionService : createUserSubscription err ', err);
      throw new SubscriptionError(err.message);
    }
  };

  updateSubscriptionFreePlan = async (subscriptionID: string, subscriptionPlan: ISubscriptionPlan): Promise<void> => {
    try {
      const expireDate = renewExpiredDateFreePackage();
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await updateSubscriptionWithPlan(client, subscriptionID, subscriptionPlan, subscriptionPlan.price, 0.0);
      await updateSubscriptionExpireDate(client, subscriptionID, expireDate);
      await updateSubscriptionStatus(client, subscriptionID, true);
      await PostgresHelper.execBatchCommitTransaction(client);

      try {
        void this.sendMailOnCreateFreePlan(subscriptionID);
      } catch (err) {
        console.log('MAIL SEND FAILED');
      }
    } catch (error) {
      console.log('Err in update free plan: ');
      throw new SubscriptionError('UPDATE_FREE_PLAN_ERR');
    }
  };

  getSubscriptionLimitAndDetails = async (subscriptionID: string): Promise<ISubscriptionLimitAndDetails> => {
    const result = await getSubscriptionLimitAndDetails(PlusmarService.writerClient, subscriptionID);
    return result;
  };

  getSubscriptionPlanDetails = async (subscriptionPlanID: number): Promise<ISubscriptionPlan> => {
    const result = await getSubscriptionPlan(PlusmarService.readerClient, subscriptionPlanID);
    return result;
  };

  getSubscriptionPlanDetailsByPackageType = async (packageType: EnumSubscriptionPackageType): Promise<ISubscriptionPlan> => {
    const result = await getSubscriptionPlanByPackageType(PlusmarService.readerClient, packageType);
    return result;
  };

  getSubscriptionCurrentBudget = async (subscriptionID: string): Promise<ISubscriptionBudget> => {
    const result = await getSubscriptionCurrentBudget(PlusmarService.readerClient, subscriptionID);
    return result;
  };

  triggerSubscription = async (token: string): Promise<void> => {
    const onSubscriptionChangingSubscription = { onSubscriptionChangingSubscription: { token, status: 200 } };
    await PlusmarService.pubsub.publish(SUBSCRIPTION_UPDATE, onSubscriptionChangingSubscription);
  };
  sendMailOnCreateFreePlan = async (subscriptionID: string): Promise<void> => {
    const { name, email, tel }: ISubscriptionUserDetail = await getSubscriptionAndUserDetail(PlusmarService.readerClient, subscriptionID);

    const to = 'Phol@itopplus.com;worawut@theiconweb.com;apithana@theiconweb.com;sartiya_ning@theiconweb.com;prancharee@plusacademy.online';
    const subject = 'More-commerce Subscription Created Report';
    const htmlBody = `
    ชื่อ: ${name} <br />
    email: ${email} <br />
    เบอร์โทรศัพท์: ${tel} <br />
    วันและเวลา: ${new Date()} <br />
    plan: FREE
    `;
    const invitationEmail = createMailOption(to, subject, htmlBody, []);
    const transporter = createTransporter(PlusmarService.environment.transporterConfig);
    await sendInvitationEmail(invitationEmail, transporter);
  };
}
