import {
  cryptoDecode,
  cryptoEncode,
  getKeysFromSession,
  isAllowCaptureException,
  isEmpty,
  PostgresHelper,
  publishMessage,
  setSessionValue,
} from '@reactor-room/itopplus-back-end-helpers';
import { ENV_TYPE, IHTTPResult, LanguageTypes } from '@reactor-room/model-lib';
import {
  GenericErrorType,
  IAddNewShopProfile,
  IAddShopProfile,
  IFacebookPageResponse,
  IFacebookPageWithBindedPageStatus,
  IMessageSetting,
  IPageAdvancedSettings,
  IPages,
  IPagesAPI,
  IPayload,
  IPlanLimitAndDetails,
  IUserPageMapInput,
  IUserSubscriptionMappingModel,
} from '@reactor-room/itopplus-model-lib';
import {
  PAGE_UPDATE,
  EnumAppScopeType,
  EnumAuthError,
  EnumForceUpdateRoute,
  EnumPageMemberType,
  EnumPagesError,
  EnumPaymentType,
  EnumWizardStepError,
  EnumWizardStepType,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Pool } from 'pg';
import {
  addPageSubscriptionsMappings,
  connectFacebookPageToPage,
  countPagesBySubscription,
  createClientAPI,
  createDefaultPage,
  createUserPageMapping,
  deleteBankAccountById,
  deleteLogisticSystem,
  deletePage,
  deletePageApplicationScope,
  deletePageChatTemplates,
  deletePageCustomerTags,
  deletePageLeadForms,
  deletePageLogistics,
  deletePageMember,
  deletePagePayments,
  deletePageSubscriptionMapping,
  deletePageTax,
  getAPIKeyByUUIDAndSecret,
  getBankAccount,
  getBindedPagesAndOwner,
  getMaximumPageByUserID,
  getPageAPISettingByID,
  getPageAppScopeByPageID,
  getPageByFacebookPageID,
  getPageByID,
  getPageByLineUserID,
  getPageByUUID,
  getPageMessage,
  getPagePicutreFromFacebookByFanpageID,
  getPagesByUserIDAndSubscriptionID,
  getPagesFromFacebookUser,
  getPagesUsername,
  getShopFanPageByFbPageID,
  getUnfinishPageSetting,
  getUserByID,
  getUserSubscriptionMappingByUserID,
  listAllPayment,
  saveCartMessage,
  savePageCondition,
  savePageMessage,
  setClientAPIStatus,
  setPageAppScopeByPageID,
  setShopFanPageAccessTokenByPageID,
  subscribePageToApp,
  updatePageAdvancedSettings,
  updatePageCondition,
  updatePageMessage,
  updatePageName,
  updatePageWizardStep,
  updateProfile,
  verifyToken,
} from '../../data';
import { checkMaxPagesAndPageUsing, getFbPageFromFbPagesByFbPageID, getPagePicture, mapAppScopes, updateFbPagesWithPages } from '../../domains';
import { defaultEnglishTextPageMessage, defaultThaiTextPageMessage } from '../../domains/pages/page-message-default.domain';
import { PagesError, PagesNotExistError, SubscriptionError } from '../../errors';
import { AppScopeError } from '../../errors/scope.error';
import { PageSettingsService } from '../page-settings/page-settings.service';
import { PlusmarService } from '../plusmarservice.class';
import { InitPageService } from './init-page.service';
import { SettingService } from '../settings/settings.service';

export class PagesService {
  public pageSettingService: PageSettingsService;
  public initPageService: InitPageService;

  constructor() {
    this.pageSettingService = new PageSettingsService();
    this.initPageService = new InitPageService();
  }

  getPageByID = async (pageID: number): Promise<IPages> => {
    return await getPageByID(PlusmarService.readerClient, pageID);
  };

  getUnfinishPageSetting = async (pageID: number): Promise<IPages> => {
    return await getUnfinishPageSetting(PlusmarService.readerClient, pageID);
  };

  getPageByUUID = async (pageUUID: string): Promise<IPages> => {
    return await getPageByUUID(PlusmarService.readerClient, pageUUID);
  };

  createDefaultPage = async (userId: number, access_token: string, subscriptionDetail: IPlanLimitAndDetails, appScope: EnumAppScopeType): Promise<IHTTPResult> => {
    // BEFORE CALL THIS FROM OTHERS BUT MORE_COMMERCE
    // HAVE TO ADD CONDITION TO CHECK PAGE_APPLICATION_SCOPE

    let page;
    try {
      const userSub = await getUserSubscriptionMappingByUserID(PlusmarService.readerClient, userId);
      if (!userSub) throw new SubscriptionError(EnumAuthError.NO_SUBSCRIPTIONS);

      const user = await getUserByID(PlusmarService.readerClient, userId);

      page = await createDefaultPage(PlusmarService.writerClient, user.email, user.tel);
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      await this.initPageService.setPageCommonDefault(client, subscriptionDetail, page);
      await addPageSubscriptionsMappings(client, userSub.subscription_id, page.id);

      await setPageAppScopeByPageID(client, page.id, appScope);

      const userPageMapInput: IUserPageMapInput = {
        user_id: userId,
        page_id: page.id,
        email: user.email,
        role: EnumPageMemberType.OWNER,
        is_active: true,
      };
      await createUserPageMapping(client, userPageMapInput);
      await PostgresHelper.execBatchCommitTransaction(client);
      const { value: redisSessionKey } = await verifyToken(access_token, PlusmarService.environment);
      if (redisSessionKey) {
        const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
        const session = { ...userKey, pageID: page.id, page: page };
        // Note: Change to default page for creating shop
        setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
        await getKeysFromSession(PlusmarService.redisClient, redisSessionKey);
      }
      return {
        status: 200,
        value: 'Create new shop success',
      } as IHTTPResult;
    } catch (err) {
      console.error(`ADD_SHOP_FANPAGE ERROR: ${err}`);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(err);
      if (page) {
        console.log('ADD_SHOP_FANPAGE ERROR at PAGE_ID : ', page.id);
        await deletePage(PlusmarService.writerClient, page.id);
      }
      throw err;
    }
  };

  updateFacebookPageFromWizardStep = async (userAccessToken: string, pageId: number, fbPage: IFacebookPageResponse): Promise<IHTTPResult> => {
    // encode accesstoken
    fbPage.access_token = cryptoEncode(fbPage.access_token, PlusmarService.environment.pageKey);

    // Check Duplicate Page
    const bindedPage = await getShopFanPageByFbPageID(PlusmarService.readerClient, fbPage.id);
    if (bindedPage) throw new PagesError(EnumPagesError.FB_PAGE_ALREADY_BINDED);

    const pageInput = {
      shopName: fbPage.name,
      facebookid: fbPage.id,
      facebookpic: fbPage.picture,
      access_token: fbPage.access_token,
    } as IAddShopProfile;
    await connectFacebookPageToPage(PlusmarService.writerClient, pageId, pageInput);

    // add page username
    await this.pageSettingService.addPageUsername(pageInput as IAddNewShopProfile, pageId);

    const page = await getPageByID(PlusmarService.readerClient, pageId);

    const { value: redisSessionKey } = await verifyToken(userAccessToken, PlusmarService.environment);
    if (redisSessionKey) {
      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const session = { ...userKey, pageID: page.id, page: page };

      // Note : Update page on connect to Facebook
      setSessionValue(PlusmarService.redisClient, redisSessionKey, session);
      await getKeysFromSession(PlusmarService.redisClient, redisSessionKey);
    }
    return { status: 200, value: 'OK' };
  };

  updatePageWizardStep = async (client: Pool, pageId: number, step: EnumWizardStepType): Promise<IHTTPResult> => {
    return await updatePageWizardStep(PlusmarService.writerClient, pageId, step);
  };

  updatePageLogisticFromWizardStep = async (pageID: number): Promise<IHTTPResult> => {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const page = await getPageByID(PlusmarService.readerClient, pageID);
      if (page.wizard_step === EnumWizardStepType.STEP_SET_LOGISTIC) {
        await this.updatePageWizardStep(client, pageID, EnumWizardStepType.STEP_SET_PAYMENT);
      }
      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: '' } as IHTTPResult;
    } catch (err) {
      console.log('err', err);
      throw new Error(err);
    }
  };

  updatePageWizardStepToSuccess = async (userId: number, pageId: number, currentStep: EnumWizardStepType): Promise<IHTTPResult> => {
    const page = await getPageByID(PlusmarService.readerClient, pageId);
    if (page.wizard_step !== EnumWizardStepType.STEP_SET_PAYMENT || currentStep !== EnumWizardStepType.STEP_SET_PAYMENT) {
      throw new Error(EnumWizardStepError.INVALID_WIZARD_STEP);
    }
    // encode accesstoken
    const pageAccessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    // call Facebook API (POST) subscribed_apps (invoke Webhook)
    await subscribePageToApp(page.fb_page_id, pageAccessToken);
    // call Facebook API (POST) to create whitelist for Webview
    await this.pageSettingService.setPageWhitelist(Number(page.fb_page_id), pageAccessToken);

    const clientTransaction = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

    await updatePageWizardStep(clientTransaction, pageId, EnumWizardStepType.SETUP_SUCCESS);

    await PostgresHelper.execBatchCommitTransaction(clientTransaction);

    const user = await getUserByID(PlusmarService.readerClient, userId);
    const pagesUsed = await getMaximumPageByUserID(PlusmarService.readerClient, user.id);
    if (process.env.NODE_ENV === ENV_TYPE.PRODUCTION) {
      await this.initPageService.sendAddNewPageReport(user, page, pagesUsed.length);
    }

    return { status: 200, value: 'Setting page success!' } as IHTTPResult;
  };

  // Be carefull when call this
  deletePage = async (userId: number, pageId: number): Promise<IHTTPResult> => {
    try {
      const page = await getPageByID(PlusmarService.readerClient, pageId);
      if (page.wizard_step === EnumWizardStepType.SETUP_SUCCESS) {
        throw new Error(EnumWizardStepError.CANNOT_REMOVE_SETUP_SUCCESS_PAGE);
      }
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      await deletePageTax(client, pageId);
      await deletePageLeadForms(client, pageId);
      await deletePageChatTemplates(client, pageId);
      await deletePageLogistics(client, pageId);
      await deleteLogisticSystem(client, pageId);

      const payments = await listAllPayment(PlusmarService.readerClient, pageId);
      const bankPayment = !isEmpty(payments) ? payments.find((x) => x.type === EnumPaymentType.BANK_ACCOUNT) : null;
      if (bankPayment) {
        const bankAccounts = await getBankAccount(PlusmarService.readerClient, pageId);
        for (const account of bankAccounts) {
          await deleteBankAccountById(client, bankPayment.id, account.id);
        }
      }
      await deletePagePayments(client, pageId);
      await deletePageSubscriptionMapping(client, pageId);
      await deletePageMember(client, userId, pageId);
      await deletePageCustomerTags(client, pageId);
      await deletePageApplicationScope(client, pageId, EnumAppScopeType.MORE_COMMERCE);
      await deletePage(client, pageId);

      await PostgresHelper.execBatchCommitTransaction(client);
      return { status: 200, value: 'Delete page success' } as IHTTPResult;
    } catch (err) {
      console.log('Delete page  ===> err: ', err);
      throw err;
    }
  };

  updateFacebookPageToken = async (pageID: number, fbUserID: string, userToken: string): Promise<IHTTPResult> => {
    try {
      const pageKey = PlusmarService.environment.pageKey;
      const page: IPages = await getPageByID(PlusmarService.readerClient, pageID);

      const facebookpages = await getPagesFromFacebookUser(fbUserID, userToken);
      const targetPage: IFacebookPageResponse = facebookpages.find((facebookpage) => facebookpage.id === page.fb_page_id);
      const newAccessToken = cryptoEncode(targetPage.access_token, pageKey);

      await setShopFanPageAccessTokenByPageID(PlusmarService.writerClient, pageID, newAccessToken);
      await subscribePageToApp(page.fb_page_id, targetPage.access_token);

      return { status: 200, value: 'OK' };
    } catch (err) {
      console.log('updateFacebookPageToken ===> err: ', err);
      throw new Error(err);
    }
  };

  updatePageAdvancedSettings = async (pageID: number, settings: IPageAdvancedSettings): Promise<IPages> => {
    return await updatePageAdvancedSettings(PlusmarService.readerClient, pageID, settings);
  };
  savePageMessage = async (pageID: number, messages: IMessageSetting): Promise<IMessageSetting> => {
    const { type } = messages;
    const findMessageBefore = await getPageMessage(PlusmarService.readerClient, pageID, type);
    let result;
    if (findMessageBefore) {
      result = await updatePageMessage(PlusmarService.readerClient, pageID, messages);
    } else {
      result = await savePageMessage(PlusmarService.readerClient, pageID, messages);
    }
    return result;
  };

  updatePageCondition = (pageID: number, description: string): Promise<IMessageSetting> => {
    const result = updatePageCondition(PlusmarService.readerClient, pageID, description);
    return result;
  };
  savePageCondition = async (pageID: number, description: string, type: string): Promise<IMessageSetting> => {
    const findMessageBefore = await getPageMessage(PlusmarService.readerClient, pageID, type);
    let result;
    if (findMessageBefore) {
      result = await updatePageCondition(PlusmarService.readerClient, pageID, description);
    } else {
      result = await savePageCondition(PlusmarService.readerClient, pageID, description);
    }
    return result;
  };
  saveCartMessage = async (pageID: number, message18: string, message19: string, type: string): Promise<IMessageSetting> => {
    const result = await saveCartMessage(PlusmarService.readerClient, pageID, message18, message19, type);
    return result[0];
  };
  updatePageMessage = async (pageID: number, messages: IMessageSetting): Promise<IMessageSetting> => {
    const result = await updatePageMessage(PlusmarService.readerClient, pageID, messages);
    return result;
  };
  getPageMessage = async (pageID: number, type: string, language = LanguageTypes.THAI): Promise<IMessageSetting> => {
    const messages = await getPageMessage(PlusmarService.readerClient, pageID, type, language);
    if (!isEmpty(messages)) return messages;
    else {
      switch (language) {
        case LanguageTypes.THAI: {
          const defaultMessage = defaultThaiTextPageMessage();
          return await savePageMessage(PlusmarService.readerClient, pageID, defaultMessage, language);
        }
        case LanguageTypes.ENGLISH: {
          const defaultMessage = defaultEnglishTextPageMessage();
          return await savePageMessage(PlusmarService.readerClient, pageID, defaultMessage, language);
        }
      }
    }
  };

  getPages = async (userID: number, subscriptionID: string): Promise<IPages[] | null> => {
    const pages = await getPagesByUserIDAndSubscriptionID(PlusmarService.readerClient, userID, subscriptionID);

    if (!isEmpty(pages)) {
      return pages;
    } else {
      throw new PagesNotExistError(EnumAuthError.NO_PAGES);
    }
  };

  checkPageUsername = async (page: IPages, userID: number) => {
    try {
      if (page.page_username === null) {
        const accessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
        const pagesInfo = await getPagesUsername(page.fb_page_id, accessToken);
        if (pagesInfo.hasOwnProperty('username')) {
          await updatePageName(PlusmarService.writerClient, pagesInfo.username, page.id);
        }
      }
      return;
    } catch (err) {
      // Just return it
      return;
    }
  };

  changingPage = async (accessToken: string, userID: number, subscriptionID: string, pageIndex: number, pageAppScope: EnumAppScopeType): Promise<IPages[]> => {
    const pages = await getPagesByUserIDAndSubscriptionID(PlusmarService.readerClient, userID, subscriptionID);

    if (!isEmpty(pages)) {
      const currentPage = await this.returnCurrentPage(accessToken, pages, pageIndex, pageAppScope);
      return currentPage;
    } else {
      throw new PagesNotExistError(EnumAuthError.NO_PAGES);
    }
  };
  checkPageFacebookConnected = async (userID: number, subscriptionID: string, pageIndex: number, pageAppScope: EnumAppScopeType): Promise<{ isConnected: boolean }> => {
    const pages = await getPagesByUserIDAndSubscriptionID(PlusmarService.readerClient, userID, subscriptionID);

    if (!isEmpty(pages)) {
      const page = pages[pageIndex] as IPages;
      if (!isEmpty(page.fb_page_id)) {
        const pageAppScopes = await getPageAppScopeByPageID(PlusmarService.readerClient, page.id);

        if (!mapAppScopes(pageAppScopes)?.includes(pageAppScope)) {
          await setPageAppScopeByPageID(PlusmarService.writerClient, page.id, pageAppScope);
        }
        return { isConnected: true };
      } else {
        return { isConnected: false };
      }
    } else {
      throw new PagesNotExistError(EnumAuthError.NO_PAGES);
    }
  };

  returnCurrentPage = async (accessToken: string, pages: IPages[], pageIndex: number, pageAppScope: EnumAppScopeType): Promise<IPages[]> => {
    const { value: redisSessionKey } = await verifyToken(accessToken, PlusmarService.environment);
    if (redisSessionKey) {
      let page = pages[pageIndex] as IPages;
      if (!page) throw new PagesError(EnumAuthError.NO_PAGE_AT_INDEX);
      // const shopPicture = await this.getPictureFromFacebookFbPageID(page.fb_page_id, page.option.access_token);
      // if (shopPicture) {
      //   page.shop_picture = shopPicture;
      // }

      page = { ...page, page_app_scope: [] };
      const pageAppScopes = await getPageAppScopeByPageID(PlusmarService.readerClient, page.id);
      if (pageAppScopes) {
        const appScopes = mapAppScopes(pageAppScopes);
        page = {
          ...page,
          page_app_scope: appScopes,
        };
      }

      const userKey = await getKeysFromSession<IPayload>(PlusmarService.redisClient, redisSessionKey);
      const session = { ...userKey, pageID: page.id, page: page };

      // Note : Set Page by pageindex to redis context
      setSessionValue(PlusmarService.redisClient, redisSessionKey, session);

      await getKeysFromSession(PlusmarService.redisClient, redisSessionKey);

      const settingsService = new SettingService();
      settingsService.lineSecretPubToRedis(page.line_channel_secret, page.uuid);

      if (page.wizard_step !== EnumWizardStepType.SETUP_SUCCESS && page.wizard_step !== EnumWizardStepType.CMS_DEFAULT) {
        throw new PagesError(EnumWizardStepError.SETUP_FLOW_NOT_SUCCESS);
      }

      if (pageAppScope === EnumAppScopeType.MORE_COMMERCE) {
        if (page.page_role === EnumPageMemberType.OWNER && !isEmpty(page.fb_page_id) && !page.page_app_scope?.includes(pageAppScope)) {
          throw new AppScopeError(EnumAuthError.PAGE_APPLICATION_SCOPE_MISSING);
        }
      }

      if (!page.page_app_scope?.includes(pageAppScope)) {
        console.log('FATAL ERROR : PAGE_APPLICATION_SCOPE_NOT_ALLOW_(', page.id, ')');
        throw new AppScopeError(EnumAuthError.PAGE_APPLICATION_SCOPE_NOT_ALLOW);
      }

      return pages;
    } else {
      throw new PagesError('SET_PAGE_ID_ERROR');
    }
  };

  getPageByFacebookPageID = async (facebookPageID: string): Promise<IPages> => {
    return await getPageByFacebookPageID(PlusmarService.readerClient, facebookPageID);
  };

  getPageByLineUserID = async (lineUserID: string): Promise<IPages> => {
    return await getPageByLineUserID(PlusmarService.readerClient, lineUserID);
  };

  checkMaxPages = async (userID: number): Promise<boolean> => {
    const getMaxPages = await getMaximumPageByUserID(PlusmarService.readerClient, userID);
    const userSubscription: IUserSubscriptionMappingModel = await getUserSubscriptionMappingByUserID(PlusmarService.readerClient, userID);
    const countPageUsing = await countPagesBySubscription(PlusmarService.readerClient, userSubscription.subscription_id);
    const checkCanCreateNewShop = checkMaxPagesAndPageUsing(getMaxPages, countPageUsing);
    return checkCanCreateNewShop;
  };

  getBindedPages = async (fbPages: IFacebookPageResponse[]): Promise<IFacebookPageWithBindedPageStatus[]> => {
    const fbPageIDs = [];
    for (const page of fbPages) {
      fbPageIDs.push(page.id.toString());
    }
    const bindedPages = await getBindedPagesAndOwner(PlusmarService.readerClient, fbPageIDs);
    const result = updateFbPagesWithPages(fbPages, bindedPages);
    return result;
  };

  getPagesFromFacebook = async (sid: string, accessToken: string): Promise<IFacebookPageResponse[]> => {
    const facebookPages = await getPagesFromFacebookUser(sid, accessToken);
    if (facebookPages.length > 0) {
      return getPagePicture(facebookPages);
    } else {
      throw new Error(GenericErrorType.FACEBOOK_FANPAGE_NOT_FOUND);
    }
  };

  getPageFromFacebookByFbPageID = async (sid: string, accessToken: string, fbPageID: string): Promise<IFacebookPageResponse> => {
    const facebookPages = await getPagesFromFacebookUser(sid, accessToken);
    const pagePicture = getPagePicture(facebookPages);
    const result = getFbPageFromFbPagesByFbPageID(pagePicture, fbPageID);
    if (result.length < 1) throw new PagesError(EnumAuthError.FB_PAGE_NOT_FOUND);
    return result[0];
  };

  getPictureFromFacebookFbPageID = async (facebookID: string, accessToken: string): Promise<string> => {
    const token = cryptoDecode(accessToken, PlusmarService.environment.pageKey);
    const result = await getPagePicutreFromFacebookByFanpageID(facebookID, token);
    let picture = '';
    if (result?.url) {
      picture = result?.url;
    }
    return picture;
  };

  getPageFromFacebookPagesByPageID = async (sid: string, accessToken: string, pageID: number): Promise<IFacebookPageResponse> => {
    if (accessToken === PlusmarService.environment.TEST_USER_TOKEN) return {} as IFacebookPageResponse;
    const facebookPages: IFacebookPageResponse[] = await getPagesFromFacebookUser(sid, accessToken);

    const facebookPagesProfile = getPagePicture(facebookPages);
    const page: IPages = await getPageByID(PlusmarService.readerClient, pageID);
    const activePage = facebookPagesProfile.filter((x) => x.id === page.fb_page_id);
    if (activePage.length > 0) {
      await updateProfile(PlusmarService.writerClient, activePage[0].picture, page.id);
    }
    const result = getFbPageFromFbPagesByFbPageID(facebookPagesProfile, page.fb_page_id);
    if (result.length < 1) throw new PagesError(EnumAuthError.FB_PAGE_NOT_FOUND);
    return result[0];
  };

  updateProfile = async (profile: string, pageID: number): Promise<[IPages]> => {
    return await updateProfile(PlusmarService.writerClient, profile, pageID);
  };

  createClientAPI = async (pageID: number, bactive: boolean): Promise<IPagesAPI> => {
    const page = await getPageByID(PlusmarService.readerClient, pageID);
    const apiSetting: IPagesAPI = {
      benabled_api: bactive,
      api_client_id: '',
      api_client_secret: '',
    };
    if (page.api_client_id === null && page.api_client_secret === null && bactive) {
      const date = new Date();
      const clientID = cryptoEncode(`${page.uuid}.${date.getTime()}`, PlusmarService.environment.more_api_key);
      const characters = `${page.page_name}.${page.uuid}.${date.getTime()}`;
      const charLength = characters.length;
      let randKey = '';
      for (let index = 0; index < charLength; index++) {
        randKey += characters.charAt(Math.floor(Math.random() * charLength));
      }
      const clientSecret = cryptoEncode(`${randKey}`, PlusmarService.environment.more_api_key);
      apiSetting.api_client_id = clientID;
      apiSetting.api_client_secret = clientSecret;
      return await createClientAPI(PlusmarService.writerClient, pageID, apiSetting);
    } else {
      return await setClientAPIStatus(PlusmarService.writerClient, pageID, bactive);
    }
  };

  getClientAPIKey = async (pageID: number): Promise<IPagesAPI> => {
    return await getPageAPISettingByID(PlusmarService.readerClient, pageID);
  };

  getAPIKeyByUUIDAndSecret = async (page_uuid: string, page_secret: string): Promise<IPagesAPI> => {
    return await getAPIKeyByUUIDAndSecret(PlusmarService.readerClient, page_uuid, page_secret);
  };

  triggerPageChanging = async (token: string, isToCreatePage: boolean): Promise<IHTTPResult> => {
    const onPageChangingSubscription = {
      onPageChangingSubscription: { token, isToCreatePage, status: 200, value: isToCreatePage ? EnumForceUpdateRoute.TO_CREATE : EnumForceUpdateRoute.TO_DEFAULT },
    };

    await PlusmarService.pubsub.publish(PAGE_UPDATE, onPageChangingSubscription);
    return {
      status: 200,
      value: '123',
    } as IHTTPResult;
  };
}
