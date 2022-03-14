import type {
  IFacebookPageResponse,
  IFacebookPageWithBindedPageStatus,
  IGQLContext,
  IMessageSetting,
  IPages,
  IPagesAPI,
  IPagesArg,
  IPayload,
  MessageSettingObj,
  QuilDescriptionObj,
} from '@reactor-room/itopplus-model-lib';
import {
  EnumAppScopeType,
  EnumAuthScope,
  EnumPageMemberType,
  EnumResourceValidation,
  EnumSubscriptionFeatureType,
  PAGE_UPDATE,
  SUBSCRIPTION_UPDATE,
} from '@reactor-room/itopplus-model-lib';
import { PagesService, PlusmarService, requiredPagePermissionRole, requireLogin, validateContext } from '@reactor-room/itopplus-services-lib';
import { IHTTPResult } from '@reactor-room/model-lib';
import { withFilter } from 'graphql-subscriptions';
import { requireAdmin, requireOwner, requirePackageValidation, requireResourceValidation } from '../../domains/plusmar';
import {
  validateAccessTokenObjectValidate,
  validatelimitResourceObject,
  validateMessage,
  validateRequestPageID,
  validateRequestUserID,
  validateRequestUserSubscriptionObjectValidate,
  validateResponseHTTPObject,
  validateSIDAccessTokenObjectValidate,
  validateuserIDAccessTokenObjectValidate,
} from '../../schema/common';
import { validateRequestWizardStep } from '../../schema/facebook/page';
import {
  validateCredentialAndPageID,
  validateFacebookPageWithBindedPageStatus,
  validateFbPageIDValidate,
  validatePageIndex,
  validateRequestFaceBookFanPage,
  validateResponsePages,
} from '../../schema/pages';
import { graphQLHandler } from '../graphql-handler';

class Pages {
  public static instance: Pages;
  public static pagesService: PagesService;
  public static getInstance(): Pages {
    if (!Pages.instance) Pages.instance = new Pages();
    return Pages.instance;
  }

  constructor() {
    Pages.pagesService = new PagesService();
  }

  async getPageFromFacebookCredentailAndPageIDHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IFacebookPageResponse> {
    const { credential, pageID } = validateCredentialAndPageID<IPagesArg>(args);
    const result = await Pages.pagesService.getPageFromFacebookPagesByPageID(credential.ID, credential.accessToken, pageID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPictureFromFacebookFanpageByFacebookIDHandler(parent, args: IPagesArg, context: IGQLContext): Promise<string> {
    const detail = validateRequestFaceBookFanPage(context.payload);
    const result = await Pages.pagesService.getPictureFromFacebookFbPageID(detail.page.fb_page_id, context.payload?.page?.option?.access_token);
    return result;
  }

  @requireAdmin
  async updatePageAdvancedSettingsHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Pages.pagesService.updatePageAdvancedSettings(pageID, args.settings);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireOwner
  async updatePageWizardStepToSuuccessHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    const { currentStep } = validateRequestWizardStep<IPagesArg>(args);
    return await Pages.pagesService.updatePageWizardStepToSuccess(userID, pageID, currentStep);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireOwner
  async deletePageHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    return await Pages.pagesService.deletePage(userID, pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async triggerPageChangingHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IHTTPResult> {
    const { accessToken } = validateuserIDAccessTokenObjectValidate<IPayload>(context.payload);
    return await Pages.pagesService.triggerPageChanging(accessToken, args.isToCreatePage);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async saveTermsAndConditionHandler(parent, args: QuilDescriptionObj, context: IGQLContext): Promise<IMessageSetting> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const description = args.message.quill.description;
    const type = 'pipeline';
    const result = await Pages.pagesService.savePageCondition(pageID, description, type);
    return result;
  }

  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async saveCartMessageHanler(parent, args: MessageSettingObj, context: IGQLContext): Promise<IMessageSetting> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { message18, message19 } = validateMessage<IMessageSetting>(args.message);
    const type = 'pipeline';
    const result = await Pages.pagesService.saveCartMessage(pageID, message18, message19, type);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async savePageMessageHandler(parent, args: MessageSettingObj, context: IGQLContext): Promise<IMessageSetting> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const messageParams = validateMessage<IMessageSetting>(args.message);
    const result = await Pages.pagesService.savePageMessage(pageID, messageParams);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPageMessageHandler(parent, args: IMessageSetting, context: IGQLContext): Promise<IMessageSetting> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Pages.pagesService.getPageMessage(pageID, args.type);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPageByIDHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Pages.pagesService.getPageByID(pageID);
    return result;
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getUnfinishPageSettingHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Pages.pagesService.getUnfinishPageSetting(pageID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPagesHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages[] | null> {
    const { userID, subscriptionID } = validateRequestUserSubscriptionObjectValidate<IPayload>(context.payload);
    const result = await Pages.pagesService.getPages(userID, subscriptionID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async changingPageHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPages[] | null> {
    const allowPageAppScope = EnumAppScopeType.MORE_COMMERCE;
    const { userID, subscriptionID } = validateRequestUserSubscriptionObjectValidate<IPayload>(context.payload);
    const { pageIndex } = validatePageIndex<IPagesArg>(args);
    return await Pages.pagesService.changingPage(context.access_token, userID, subscriptionID, pageIndex, allowPageAppScope);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  @requiredPagePermissionRole([EnumPageMemberType.OWNER])
  async checkPageFacebookConnectedHandler(parent, args: IPagesArg, context: IGQLContext): Promise<{ isConnected: boolean }> {
    const allowPageAppScope = EnumAppScopeType.MORE_COMMERCE;
    const { userID, subscriptionID } = validateRequestUserSubscriptionObjectValidate<IPayload>(context.payload);
    const { pageIndex } = validatePageIndex<IPagesArg>(args);
    return await Pages.pagesService.checkPageFacebookConnected(userID, subscriptionID, pageIndex, allowPageAppScope);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPagesFromFacebookHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IFacebookPageResponse[]> {
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    return await Pages.pagesService.getPagesFromFacebook(ID, accessToken);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async updateFacebookPageTokenHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Pages.pagesService.updateFacebookPageToken(pageID, ID, accessToken);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPageFromFacebookByPageIdHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IFacebookPageResponse> {
    const { pageID } = validateRequestPageID<IPagesArg>(args);
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    const result = await Pages.pagesService.getPageFromFacebookPagesByPageID(ID, accessToken, pageID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPageFromFacebookByFbPageIDHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IFacebookPageResponse> {
    const { fbPageID } = validateFbPageIDValidate<IPagesArg>(args);
    const { ID, accessToken } = validateSIDAccessTokenObjectValidate<IPayload>(context.payload);
    const result = await Pages.pagesService.getPageFromFacebookByFbPageID(ID, accessToken, fbPageID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getPageFromFacebookByCurrentPageIDHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IFacebookPageResponse> {
    const { ID, accessToken } = context.payload;
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const result = await Pages.pagesService.getPageFromFacebookPagesByPageID(ID, accessToken, pageID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async checkMaxPagesHandler(parent, args: IPagesArg, context: IGQLContext) {
    const { userID } = validateRequestUserID<IPayload>(context.payload);
    const isCreatePageable = await Pages.pagesService.checkMaxPages(userID);
    return isCreatePageable;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async createClientAPIHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPagesAPI> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Pages.pagesService.createClientAPI(pageID, args.bactive);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getClientAPIKeyHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IPagesAPI> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Pages.pagesService.getClientAPIKey(pageID);
  }

  async getBindedPagesHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IFacebookPageWithBindedPageStatus[]> {
    const { fbPages } = args;
    const result = await Pages.pagesService.getBindedPages(fbPages);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireOwner
  @requireResourceValidation([EnumResourceValidation.VALIDATE_MAX_PAGES])
  async createPageHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IHTTPResult> {
    const { userID } = validateuserIDAccessTokenObjectValidate<IPayload>(context.payload);
    const { limitResources } = validatelimitResourceObject<IPayload>(context.payload);
    const { access_token } = validateAccessTokenObjectValidate<IGQLContext>(context);
    const result = await Pages.pagesService.createDefaultPage(userID, access_token, limitResources, EnumAppScopeType.MORE_COMMERCE);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updateFacebookPageFromWizardStepHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    const { pageInput } = args;
    const { access_token } = validateAccessTokenObjectValidate<IGQLContext>(context);
    return await Pages.pagesService.updateFacebookPageFromWizardStep(access_token, pageID, pageInput);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireAdmin
  @requirePackageValidation([EnumSubscriptionFeatureType.COMMERCE])
  async updatePageLogisticFromWizardStepHandler(parent, args: IPagesArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Pages.pagesService.updatePageLogisticFromWizardStep(pageID);
  }

  onPageChangingSubscriptionHandler() {
    return withFilter(
      () => {
        return PlusmarService.pubsub.asyncIterator(PAGE_UPDATE);
      },
      async (payload, _, context: IGQLContext) => {
        if (context.payload.pageID == undefined) {
          await validateContext(context, [EnumAuthScope.SOCIAL]);
        }
        const params = payload.onPageChangingSubscription;
        return params.token === context.payload.accessToken;
      },
    );
  }
  onSubscriptionChangingSubscriptionHandler() {
    return withFilter(
      () => {
        return PlusmarService.pubsub.asyncIterator(SUBSCRIPTION_UPDATE);
      },
      async (payload, _, context: IGQLContext) => {
        if (context.payload.pageID == undefined) {
          await validateContext(context, [EnumAuthScope.SOCIAL]);
        }
        const params = payload.onSubscriptionChangingSubscription;
        return params.token === context.payload.accessToken;
      },
    );
  }
}

const pages: Pages = Pages.getInstance();
export const pagesResolver = {
  Query: {
    getPageByID: graphQLHandler({
      handler: pages.getPageByIDHandler,
      validator: validateResponsePages,
    }),
    getUnfinishPageSetting: graphQLHandler({
      handler: pages.getUnfinishPageSettingHandler,
      validator: validateResponsePages,
    }),
    getPages: graphQLHandler({
      handler: pages.getPagesHandler,
      validator: validateResponsePages,
    }),
    changingPage: graphQLHandler({
      handler: pages.changingPageHandler,
      validator: validateResponsePages,
    }),
    checkPageFacebookConnected: graphQLHandler({
      handler: pages.checkPageFacebookConnectedHandler,
      validator: validateResponsePages,
    }),
    getPagesFromFacebook: graphQLHandler({
      handler: pages.getPagesFromFacebookHandler,
      validator: validateResponsePages,
    }),
    updateFacebookPageToken: graphQLHandler({
      handler: pages.updateFacebookPageTokenHandler,
      validator: validateResponsePages,
    }),
    getPageFromFacebookByPageId: graphQLHandler({
      handler: pages.getPageFromFacebookByPageIdHandler,
      validator: validateResponsePages,
    }),
    getPageFromFacebookByFbPageID: graphQLHandler({
      handler: pages.getPageFromFacebookByFbPageIDHandler,
      validator: validateResponsePages,
    }),
    checkMaxPages: graphQLHandler({
      handler: pages.checkMaxPagesHandler,
      validator: validateResponsePages,
    }),
    getBindedPages: graphQLHandler({
      handler: pages.getBindedPagesHandler,
      validator: validateFacebookPageWithBindedPageStatus,
    }),
    getPageFromFacebookCredentailAndPageID: graphQLHandler({
      handler: pages.getPageFromFacebookCredentailAndPageIDHandler,
      validator: validateResponsePages,
    }),
    getPageFromFacebookByCurrentPageID: graphQLHandler({
      handler: pages.getPageFromFacebookByCurrentPageIDHandler,
      validator: validateResponsePages,
    }),
    getPageMessage: graphQLHandler({
      // libs/itopplus-model-lib/src/lib/pages/pages.model.graphql.ts(438)
      handler: pages.getPageMessageHandler,
      validator: validateResponsePages,
    }),
    getPictureFromFacebookFanpageByFacebookID: graphQLHandler({
      handler: pages.getPictureFromFacebookFanpageByFacebookIDHandler,
      validator: validateResponsePages,
    }),
    getClientAPIKey: graphQLHandler({
      handler: pages.getClientAPIKeyHandler,
      validator: validateResponsePages,
    }),
  },
  Mutation: {
    createPage: graphQLHandler({
      handler: pages.createPageHandler,
      validator: validateResponseHTTPObject,
    }),
    updatePageAdvancedSettings: graphQLHandler({
      handler: pages.updatePageAdvancedSettingsHandler,
      validator: validateResponsePages,
    }),
    savePageMessage: graphQLHandler({
      handler: pages.savePageMessageHandler,
      validator: validateResponsePages,
    }),
    saveTermsAndCondition: graphQLHandler({
      handler: pages.saveTermsAndConditionHandler,
      validator: validateResponsePages,
    }),
    saveCartMessage: graphQLHandler({
      handler: pages.saveCartMessageHanler,
      validator: validateResponsePages,
    }),
    createClientAPI: graphQLHandler({
      handler: pages.createClientAPIHandler,
      validator: validateResponsePages,
    }),
    updateFacebookPageFromWizardStep: graphQLHandler({
      handler: pages.updateFacebookPageFromWizardStepHandler,
      validator: validateResponsePages,
    }),
    updatePageLogisticFromWizardStep: graphQLHandler({
      handler: pages.updatePageLogisticFromWizardStepHandler,
      validator: validateResponsePages,
    }),
    updatePageWizardStepToSuccess: graphQLHandler({
      handler: pages.updatePageWizardStepToSuuccessHandler,
      validator: validateResponsePages,
    }),
    deletePage: graphQLHandler({
      handler: pages.deletePageHandler,
      validator: validateResponseHTTPObject,
    }),
    triggerPageChanging: graphQLHandler({
      handler: pages.triggerPageChangingHandler,
      validator: validateResponseHTTPObject,
    }),
  },
  Subscription: {
    onPageChangingSubscription: {
      subscribe: pages.onPageChangingSubscriptionHandler(),
    },
    onSubscriptionChangingSubscription: {
      subscribe: pages.onSubscriptionChangingSubscriptionHandler(),
    },
  },
};
