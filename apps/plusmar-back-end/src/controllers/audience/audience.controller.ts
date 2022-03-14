import type { IArgsAllAudience, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import type {
  AudienceCounter,
  AudienceStats,
  FormTemplates,
  IArgGqlTableFilters,
  IArgGqlTableFiltersPaidType,
  IAudience,
  IAudienceHistory,
  IAudienceHistorySingleRow,
  IAudienceWithCustomer,
  IAudienceWithLeads,
  IAudienceWithPurchasing,
  ICustIDIsChildInterface,
  IFacebookMessageResponse,
  IGQLContext,
  IIDInterface,
  IUploadImageSetResult,
  LeadsFilters,
  Message,
  MessageTemplates,
  RejectAudienceValidateRequestArguments,
  Socials,
  UpdateFollowAudienceStatusArguments,
  UserMadeLastChangesToStatus,
} from '@reactor-room/itopplus-model-lib';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  EnumAuthScope,
  EnumResourceValidation,
  ICustomerTemp,
  ImageSetTemplate,
  ImageSetTemplateInput,
  NotificationStatus,
} from '@reactor-room/itopplus-model-lib';
import { AudienceService, AudienceUpdateDomainService, ReportService, requireScope } from '@reactor-room/itopplus-services-lib';
import { requireResourceValidation } from '../../domains/plusmar/resource-validate.domain';
import {
  validateAddImageSetsInput,
  validateDeleteImageFromSetInput,
  validateDeleteImageSetsInput,
  validateIDIsChild,
  validateRequestAllAudience,
  validateRequestAllPaginationAudience,
  validateRequestCloseAudience,
  validateRequestLastAudience,
  validateRequestRejectAudience,
  validateRequestupdateFollowAudienceStatus,
  validateResponseAllAudience,
  validateResponseAllPaginationAudience,
  validateResponseAudience,
  validateResponseAudienceChild,
  validateResponseImageSets,
  validateResponseLastAudience,
  validateSendImageSetRequestInput,
} from '../../schema/audience/audience.schema';
import { validateIDNumberObject, validateIDResourceArr, validateResponseHTTPObject } from '../../schema/common';
import { validateResponseCustomer, validateResponseCustomerObject, validateUserMadeLastChanges } from '../../schema/customer';
import { customerResolver } from '../customer';
import { facebookCommentResolver } from '../facebook/comments';
import { facebookMessageResolver } from '../facebook/message';
import { graphQLHandler } from '../graphql-handler';
@requireScope([EnumAuthScope.SOCIAL])
class Audience {
  public static instance;
  public static audienceService: AudienceService;
  public static audienceUpdateDomainService: AudienceUpdateDomainService;
  public static reportService: ReportService;
  public static getInstance() {
    if (!Audience.instance) Audience.instance = new Audience();
    return Audience.instance;
  }

  constructor() {
    Audience.audienceService = new AudienceService();
    Audience.audienceUpdateDomainService = new AudienceUpdateDomainService();
    Audience.reportService = new ReportService();
  }

  async updateAudienceStatusHandler(parent, args, context: IGQLContext): Promise<any> {
    return await Audience.audienceService.updateAudienceStatus(context.payload, args.audienceID, args.domain, args.status);
  }

  @requireResourceValidation([EnumResourceValidation.VALIDATE_MAX_ORDERS])
  async moveAudienceDomainHandler(parent, args, context: IGQLContext): Promise<any> {
    return await Audience.audienceUpdateDomainService.moveAudienceDomain(args.audienceID, context.payload, args.domain);
  }

  async updateFollowAudienceStatusHandler(parent, args: UpdateFollowAudienceStatusArguments, context: IGQLContext): Promise<IAudience> {
    const { pageID, userID } = context.payload;
    const { update, orderId } = validateRequestupdateFollowAudienceStatus(args);
    return await Audience.audienceService.updateFollowAudienceStatus(pageID, userID, update, orderId, context.payload.subscriptionID);
  }

  async rejectAudienceHandler(parent, args: RejectAudienceValidateRequestArguments, context: IGQLContext): Promise<any> {
    const { audienceID, route } = validateRequestRejectAudience(args);
    return await Audience.audienceService.rejectAudience(context.payload, audienceID, route);
  }

  async closeAudienceHandler(parent, args: RejectAudienceValidateRequestArguments, context: IGQLContext): Promise<any> {
    const { audienceID } = validateRequestCloseAudience(args);
    return await Audience.audienceService.closeAudience(context.payload, audienceID);
  }

  async getCustomerByAudienceIDHandler(parent, args, context: IGQLContext): Promise<ICustomerTemp> {
    return await Audience.audienceService.getCustomerByAudienceID(args.audienceID, context.payload.pageID);
  }

  async getAudienceByIDHandler(parent, args: { ID: number; token: string }, context: IGQLContext): Promise<IAudience> {
    return await Audience.audienceService.getAudienceByID(context.payload.userID, args.ID, context.payload, args.token);
  }

  async deleteAudienceByIdHandler(parent, args, context: IGQLContext): Promise<IAudience[]> {
    const { pageID, userID } = context.payload || {};
    return await Audience.audienceService.deleteAudienceById(args.ID, pageID, userID);
  }

  async moveToLeadsHandler(parent, args, context: IGQLContext): Promise<IAudience[]> {
    const { pageID, userID } = context.payload || {};
    return await Audience.audienceService.moveToLeads(args.ID, pageID, userID);
  }

  async moveToCustomersHandler(parent, args, context: IGQLContext): Promise<IAudience[]> {
    const { pageID, userID } = context.payload || {};
    return await Audience.audienceService.moveToCustomers(args.ID, pageID, userID);
  }

  async getAudienceListHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<IAudienceWithCustomer[]> {
    const { filters } = args;
    return await Audience.audienceService.getAudienceList(filters, context.payload.pageID);
  }
  async getAudienceSLAListHandler(parent, args: IArgGqlTableFilters, context: IGQLContext): Promise<IAudienceWithCustomer[]> {
    const { filters, type } = args;
    return await Audience.audienceService.getAudienceSLAList(filters, context.payload.pageID, type);
  }

  async getAudienceListWithPurchaseOrderHandler(parent, args: IArgGqlTableFiltersPaidType, context: IGQLContext): Promise<IAudienceWithPurchasing[]> {
    const { filters, paidType } = args;
    return await Audience.audienceService.getAudienceListWithPurchaseOrder(filters, paidType, context.payload.pageID);
  }

  async getAudienceListWithLeadsHandler(parent, args, context: IGQLContext): Promise<IAudienceWithLeads[]> {
    const query: LeadsFilters = { page_id: context.payload.pageID, ...args.query };
    return await Audience.audienceService.getAudienceListWithLeads(query);
  }

  async getLeadsListTotalHandler(parent, { filter }, context: IGQLContext): Promise<{ follow: number; finished: number }> {
    return await Audience.audienceService.getLeadsListTotal(filter, context.payload.pageID);
  }

  // number for menu bubble

  async getAudienceTotalHandler(parent, args, context: IGQLContext): Promise<{ audience_total: number }> {
    const { pageID } = context.payload;
    return await Audience.audienceService.getAudienceTotal(pageID);
  }

  async getAudienceStatsHandler(parent, args, context: IGQLContext): Promise<AudienceStats> {
    const { pageID } = context.payload;
    return await Audience.audienceService.getAudienceStatsService(pageID);
  }
  async getAudienceAllStatsHandler(parent, args, context: IGQLContext): Promise<AudienceStats> {
    const { pageID } = context.payload;
    return await Audience.audienceService.getAudienceAllStatsService(pageID, args.filter);
  }

  async getAudienceListCounterHandler(parent, args, context: IGQLContext): Promise<AudienceCounter> {
    const { pageID } = context.payload;
    return await Audience.audienceService.getAudienceListCounter(pageID);
  }

  // MESSAGE TEMPLATES

  async getMessageTemplatesHandler(parent, { filters }, context: IGQLContext): Promise<MessageTemplates[]> {
    const { pageID } = context.payload;
    return await Audience.audienceService.getMessageTemplates(pageID, filters);
  }

  async addMessageTemplateHandler(parent, { message }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await Audience.audienceService.addMessageTemplate(pageID, message);
  }

  async deleteMessageTemplateHandler(parent, { id }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await Audience.audienceService.deleteMessageTemplate(pageID, id);
  }

  // IMAGE SETS TEMPLATES

  async getImageSetsHandler(parent, { filters }, context: IGQLContext): Promise<ImageSetTemplate[]> {
    const { pageID, subscriptionID } = context.payload;
    return await Audience.audienceService.getImageSets(pageID, filters, subscriptionID);
  }

  async addImageSetsHandler(parent, args: { images_set: ImageSetTemplateInput }, context: IGQLContext): Promise<IUploadImageSetResult> {
    const {
      pageID,
      page: {
        uuid: pageUUID,
        option: { access_token },
      },
    } = context.payload;
    const { images_set } = validateAddImageSetsInput(args);
    return await Audience.audienceService.addImageSets(pageID, images_set, pageUUID, access_token, context.payload.subscriptionID);
  }

  async deleteImageSetsHandler(parent, args: { id: number }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    const { id } = validateDeleteImageSetsInput(args);
    return await Audience.audienceService.deleteImageSets(pageID, id);
  }

  async deleteImageFromSetHandler(parent, args: { set_id: number; image_index: number }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    const { set_id, image_index } = validateDeleteImageFromSetInput(args);
    return await Audience.audienceService.deleteImageFromSet(pageID, set_id, image_index);
  }

  async sendImageSetHandler(
    parent,
    args: { image: { url: string; attachment_id: string; extension: string; filename: string }; psid: string },
    context: IGQLContext,
  ): Promise<IHTTPResult | IFacebookMessageResponse[]> {
    const {
      page: {
        option: { access_token },
      },
    } = context.payload;
    const { image, psid } = validateSendImageSetRequestInput(args);
    return await Audience.audienceService.sendImageSet(image, access_token, psid);
  }

  // FORM TEMPLATES
  async getFormsHandler(parent, { filters }, context: IGQLContext): Promise<FormTemplates[]> {
    const { pageID } = context.payload;
    const result = await Audience.audienceService.getForms(pageID, filters);
    return result;
  }

  async getSocialsHandler(parent, args, context: IGQLContext): Promise<Socials> {
    const { pageID } = context.payload;

    const result = await Audience.audienceService.getSocials(pageID);
    return result;
  }

  async getTemplatesByShortcutHandler(parent, { shortcut, type }: { shortcut: string; type: string }, context: IGQLContext): Promise<Message[]> {
    const { pageID, subscriptionID } = context.payload;

    const result = await Audience.audienceService.getTemplatesByShortcut(shortcut, type, pageID, subscriptionID);
    return result;
  }

  async updateSocialsHandler(parent, { socials }: { socials: Socials }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    const result = await Audience.audienceService.updateSocials(pageID, socials);
    return result;
  }

  async getUserMadeLastChangesToStatusHandler(parent, { audienceID }, context: IGQLContext): Promise<UserMadeLastChangesToStatus> {
    const { pageID } = context.payload;

    return await Audience.audienceService.getUserMadeLastChangesToStatus(audienceID, pageID);
  }

  async getAllAudienceByCustomerIDHandler(parent, args: IArgsAllAudience, context: IGQLContext): Promise<IAudience[]> {
    const { pageID } = context.payload || {};
    const { id, filters } = validateRequestAllAudience(args);
    const result = await Audience.audienceService.getAllAudienceByCustomerID(pageID, id, filters);
    return result;
  }

  async getPaginationNumberByAudienceIDHandler(parent, args: { id: number; paginator: number; audienceID: number }, context: IGQLContext): Promise<{ pagination: number }> {
    const { pageID } = context.payload || {};
    const { id, paginator, audienceID } = validateRequestAllPaginationAudience(args);
    const result = await Audience.audienceService.getPaginationNumberByAudienceID(pageID, id, paginator, audienceID);
    return result;
  }

  async getLastAudienceByCustomerIDHandler(parent, args: { id: number }, context: IGQLContext): Promise<IAudience[]> {
    const { pageID } = context.payload || {};
    const { id } = validateRequestLastAudience(args);
    const result = await Audience.audienceService.getLastAudienceByCustomerID(pageID, id);
    return result;
  }

  async getAudienceLeadContextHandler(parent, args, context: IGQLContext) {
    return await Audience.audienceService.getAudienceLeadContext(context.payload.pageID, args.audienceID);
  }

  async getChildAudienceByAudienceIdHandler(parent, args: IIDInterface, context: IGQLContext) {
    const { id } = validateIDNumberObject(args);
    return await Audience.audienceService.getChildAudienceByAudienceId(id, context.payload.pageID);
  }

  async getAudienceByCustomerIDIncludeChildHandler(parent, args: ICustIDIsChildInterface, context: IGQLContext) {
    const { customerID, isChild } = validateIDIsChild(args);
    const { payload: { pageID } = {} } = context;
    return await Audience.audienceService.getAudienceByCustomerIDIncludeChild(pageID, customerID, isChild);
  }

  async triggerAgentChangingHandler(parent, args: ICustIDIsChildInterface, context: IGQLContext) {
    const { payload: { pageID } = {} } = context;
    return await Audience.audienceService.triggerAgentChanging(pageID);
  }

  async createNewAudienceHandler(
    parent,
    args: { customerID: number; pageID: number; domain: AudienceDomainType; status: AudienceDomainStatus },
    context: IGQLContext,
  ): Promise<IAudience> {
    const { payload } = context;
    const { customerID, domain, status } = args;
    return await Audience.audienceService.createNewAudience(customerID, payload.pageID, domain, status, NotificationStatus.READ, payload.userID);
  }

  async getAudienceHistoriesHandler(parent, args: { filters: ITableFilter; dateFilter: { start: string; end: string } }, context: IGQLContext): Promise<IAudienceHistory[]> {
    return await Audience.audienceService.getAudienceHistories(context.payload.pageID, args.filters, args.dateFilter);
  }

  async getAudienceHistoryByIDHandler(parent, args: { audienceID: number }, context: IGQLContext): Promise<IAudienceHistorySingleRow> {
    return await Audience.audienceService.getAudienceHistoryByID(context.payload.pageID, args.audienceID);
  }
}

const audience: Audience = Audience.getInstance();
export const audienceResolver = {
  AudienceCustomerJoinLastActivity: {
    latestMessage(parent, args, context: IGQLContext, info) {
      return facebookMessageResolver.Query.getLatestMessage(parent, { audienceID: parent.id }, context);
    },
    latestComment(parent, args, context: IGQLContext, info) {
      return facebookCommentResolver.Query.getLatestComment(parent, { audienceID: parent.id }, context);
    },
    agentList(parent, args, context: IGQLContext, info) {
      return Audience.audienceService.triggerAgentChanging(context.payload.pageID);
    },
    tags(parent, args, context: IGQLContext, info) {
      return customerResolver.Query.getCustomerTagByPageByID(parent, { id: parent.customer_id }, context);
    },
  },
  Query: {
    getAudienceHistoryByID: graphQLHandler({
      handler: audience.getAudienceHistoryByIDHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceHistories: graphQLHandler({
      handler: audience.getAudienceHistoriesHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceLeadContext: graphQLHandler({
      handler: audience.getAudienceLeadContextHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceByID: graphQLHandler({
      handler: audience.getAudienceByIDHandler,
      validator: validateResponseCustomer,
    }),
    getCustomerByAudienceID: graphQLHandler({
      handler: audience.getCustomerByAudienceIDHandler,
      validator: validateResponseCustomerObject,
    }),
    deleteAudienceById: graphQLHandler({
      handler: audience.deleteAudienceByIdHandler,
      validator: validateResponseCustomer,
    }),
    moveToLeads: graphQLHandler({
      handler: audience.moveToLeadsHandler,
      validator: validateResponseCustomer,
    }),
    moveToCustomers: graphQLHandler({
      handler: audience.moveToCustomersHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceListCounter: graphQLHandler({
      handler: audience.getAudienceListCounterHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceList: graphQLHandler({
      handler: audience.getAudienceListHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceSLAList: graphQLHandler({
      handler: audience.getAudienceSLAListHandler,
      validator: validateResponseCustomer,
    }),
    getLeadsListTotal: graphQLHandler({
      handler: audience.getLeadsListTotalHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceTotal: graphQLHandler({
      handler: audience.getAudienceTotalHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceStats: graphQLHandler({
      handler: audience.getAudienceStatsHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceAllStats: graphQLHandler({
      handler: audience.getAudienceAllStatsHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceListWithPurchaseOrder: graphQLHandler({
      handler: audience.getAudienceListWithPurchaseOrderHandler,
      validator: validateResponseCustomer,
    }),
    getAudienceListWithLeads: graphQLHandler({
      handler: audience.getAudienceListWithLeadsHandler,
      validator: validateResponseCustomer,
    }),
    getMessageTemplates: graphQLHandler({
      handler: audience.getMessageTemplatesHandler,
      validator: validateResponseCustomer,
    }),
    getImageSets: graphQLHandler({
      handler: audience.getImageSetsHandler,
      validator: validateResponseImageSets,
    }),
    getFormsTemplates: graphQLHandler({
      handler: audience.getFormsHandler,
      validator: validateResponseCustomer,
    }),
    getSocials: graphQLHandler({
      handler: audience.getSocialsHandler,
      validator: validateResponseCustomer,
    }),
    getTemplatesByShortcut: graphQLHandler({
      handler: audience.getTemplatesByShortcutHandler,
      validator: validateResponseCustomer,
    }),
    getAllAudienceByCustomerID: graphQLHandler({
      handler: audience.getAllAudienceByCustomerIDHandler,
      validator: validateResponseAllAudience,
    }),
    getPaginationNumberByAudienceID: graphQLHandler({
      handler: audience.getPaginationNumberByAudienceIDHandler,
      validator: validateResponseAllPaginationAudience,
    }),
    getLastAudienceByCustomerID: graphQLHandler({
      handler: audience.getLastAudienceByCustomerIDHandler,
      validator: validateResponseLastAudience,
    }),
    getUserMadeLastChangesToStatus: graphQLHandler({
      handler: audience.getUserMadeLastChangesToStatusHandler,
      validator: validateUserMadeLastChanges,
    }),
    getChildAudienceByAudienceId: graphQLHandler({
      handler: audience.getChildAudienceByAudienceIdHandler,
      validator: validateResponseAudienceChild,
    }),
    getAudienceByCustomerIDIncludeChild: graphQLHandler({
      handler: audience.getAudienceByCustomerIDIncludeChildHandler,
      validator: validateIDResourceArr,
    }),
  },
  Mutation: {
    updateAudienceStatus: graphQLHandler({
      handler: audience.updateAudienceStatusHandler,
      validator: validateResponseCustomer,
    }),
    moveAudienceDomain: graphQLHandler({
      handler: audience.moveAudienceDomainHandler,
      validator: validateResponseCustomer,
    }),
    updateFollowAudienceStatus: graphQLHandler({
      handler: audience.updateFollowAudienceStatusHandler,
      validator: validateResponseCustomer,
    }),

    rejectAudience: graphQLHandler({
      handler: audience.rejectAudienceHandler,
      validator: validateResponseCustomer,
    }),
    closeAudience: graphQLHandler({
      handler: audience.closeAudienceHandler,
      validator: validateResponseCustomer,
    }),
    createNewAudience: graphQLHandler({
      handler: audience.createNewAudienceHandler,
      validator: validateResponseAudience,
    }),
    addMessageTemplate: graphQLHandler({
      handler: audience.addMessageTemplateHandler,
      validator: validateResponseCustomer,
    }),
    deleteMessageTemplate: graphQLHandler({
      handler: audience.deleteMessageTemplateHandler,
      validator: validateResponseCustomer,
    }),

    addImageSets: graphQLHandler({
      handler: audience.addImageSetsHandler,
      validator: (x) => x,
    }),
    deleteImageSets: graphQLHandler({
      handler: audience.deleteImageSetsHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteImageFromSet: graphQLHandler({
      handler: audience.deleteImageFromSetHandler,
      validator: validateResponseHTTPObject,
    }),
    sendImageSet: graphQLHandler({
      handler: audience.sendImageSetHandler,
      validator: validateResponseHTTPObject,
    }),

    updateSocials: graphQLHandler({
      handler: audience.updateSocialsHandler,
      validator: validateResponseCustomer,
    }),
    triggerAgentChanging: graphQLHandler({
      handler: audience.triggerAgentChangingHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
