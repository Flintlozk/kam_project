import type {
  ICustomerLead,
  IGQLContext,
  ILeadsForm,
  ILeadsFormReferral,
  ILeadsFormSubmission,
  ILeadsFormSubmissionSubscription,
  ILeadsFormWithComponents,
  InputCreateManualLeadFormHandler,
  IPayload,
} from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { AudienceLead, LEAD_FORM_SUBMIT_WEBVIEW } from '@reactor-room/itopplus-model-lib';
import { LeadsService, PlusmarService, validateContext } from '@reactor-room/itopplus-services-lib';
import { withFilter } from 'graphql-subscriptions';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import {
  validateAttachPagetoApp,
  validateCreateManualLeadForm,
  validategetAllLeadFormOfCustomer,
  validategetLeadFormOfCustomer,
  validateResponseCreateManualLeadForm,
} from '../../schema/facebook/page';
import { graphQLHandler } from '../graphql-handler';
import { IHTTPResult, ITableFilter } from '@reactor-room/model-lib';

class Leads {
  public static instance;
  public static leadsService: LeadsService;
  public static getInstance() {
    if (!Leads.instance) Leads.instance = new Leads();
    return Leads.instance;
  }

  constructor() {
    Leads.leadsService = new LeadsService();
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async createFormHandler(parent, args, context: IGQLContext) {
    return await Leads.leadsService.createForm({
      name: args.formInput.name,
      audience_id: args.formInput.audience_id,
      page_id: context.payload.pageID,
    });
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async createManualLeadFormHandler(parent, args: InputCreateManualLeadFormHandler, context: IGQLContext): Promise<ILeadsFormSubmission> {
    const { pageID, userID } = context.payload || {};
    const { name, audienceId, customerId, formId, formJson, user_id } = await validateCreateManualLeadForm(args.formInput);
    return await Leads.leadsService.createManualLeadForm(pageID, userID, {
      name,

      customerId,
      audienceId,
      formId,
      formJson,
      user_id,
    });
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async manualInputAutomateFormHandler(parent, args, context: IGQLContext) {
    const { pageID, userID } = context.payload;
    return await Leads.leadsService.manualInputAutomateForm(args.formInput, pageID, userID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async createFormComponentHandler(parent, args) {
    return await Leads.leadsService.createFormComponent(args.component);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async createMessageFormHandler(parent, args, context: IGQLContext) {
    return await Leads.leadsService.createMessageForm(args.message, context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormByIDHandler(parent, args, context: IGQLContext): Promise<ILeadsFormWithComponents> {
    const result = await Leads.leadsService.getFormByID(args.ID, context.payload.pageID);
    return result;
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormNameByIDHandler(parent, args, context: IGQLContext): Promise<ILeadsForm> {
    return await Leads.leadsService.getFormNameByID(args.ID, context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormsHandler(parent, args, context: IGQLContext): Promise<ILeadsFormWithComponents> {
    return await Leads.leadsService.getForms(context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormSubmissionByIDHandler(parent, args, context: IGQLContext) {
    return await Leads.leadsService.getFormSubmissionByID(args.ID, context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormSubmissionByFormIDHandler(parent, args, context: IGQLContext) {
    return await Leads.leadsService.getFormSubmissionByFormID(args.ID, context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormSubmissionByAudienceIDHandler(parent, args, context: IGQLContext) {
    return await Leads.leadsService.getFormSubmissionByAudienceID(args.ID, context.payload.pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  async getFormReferralHandler(parent, args, context: IGQLContext): Promise<ILeadsFormReferral> {
    return await Leads.leadsService.getFormReferral(args.formID, context.payload.pageID);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getLeadOfAudienceByIDHandler(parent, args, context: IGQLContext): Promise<AudienceLead> {
    return await Leads.leadsService.getLeadOfAudienceByID(context.payload.pageID, args.audienceID);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getAllLeadFormOfCustomerHandler(parent, args: { customerID: number; filters: ITableFilter }, context: IGQLContext): Promise<ICustomerLead[]> {
    return await Leads.leadsService.getAllLeadFormOfCustomer(context.payload.pageID, args.customerID, args.filters);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async getLeadFormOfCustomerHandler(parent, args: { audienceID: number }, context: IGQLContext): Promise<ICustomerLead> {
    return await Leads.leadsService.getLeadFormOfCustomer(context.payload.pageID, args.audienceID);
  }
  @requireLogin([EnumAuthScope.SOCIAL])
  async cancelCustomerLeadHandler(parent, args: { audienceID: number }, context: IGQLContext): Promise<IHTTPResult> {
    return await Leads.leadsService.cancelCustomerLead(context.payload.pageID, args.audienceID);
  }

  onLeadFormSubmitSubscriptionHandler() {
    return withFilter(
      () => PlusmarService.pubsub.asyncIterator(LEAD_FORM_SUBMIT_WEBVIEW),
      async (payload: ILeadsFormSubmissionSubscription, variables: { audienceID: number }, context: IGQLContext) => {
        if (context.payload.pageID == undefined) {
          await validateContext(context, [EnumAuthScope.SOCIAL]);
        }
        const { audienceID } = variables || {};
        const { onLeadFormSubmitSubscription } = payload || {};
        const { audience_id, page_id } = onLeadFormSubmitSubscription;
        return context.payload.pageID === page_id && audienceID === audience_id;
      },
    );
  }
}

const leads: Leads = new Leads();
export const leadsResolver = {
  Query: {
    getForms: graphQLHandler({
      handler: leads.getFormsHandler,
      validator: validateAttachPagetoApp,
    }),
    getFormByID: graphQLHandler({
      handler: leads.getFormByIDHandler,
      validator: validateAttachPagetoApp,
    }),
    getFormNameByID: graphQLHandler({
      handler: leads.getFormNameByIDHandler,
      validator: validateAttachPagetoApp,
    }),
    getFormSubmissionByID: graphQLHandler({
      handler: leads.getFormSubmissionByIDHandler,
      validator: validateAttachPagetoApp,
    }),
    getFormSubmissionByFormID: graphQLHandler({
      handler: leads.getFormSubmissionByFormIDHandler,
      validator: validateAttachPagetoApp,
    }),
    getFormSubmissionByAudienceID: graphQLHandler({
      handler: leads.getFormSubmissionByAudienceIDHandler,
      validator: validateAttachPagetoApp,
    }),
    getFormReferral: graphQLHandler({
      handler: leads.getFormReferralHandler,
      validator: validateAttachPagetoApp,
    }),
    getLeadOfAudienceByID: graphQLHandler({
      handler: leads.getLeadOfAudienceByIDHandler,
      validator: validateAttachPagetoApp,
    }),
    getAllLeadFormOfCustomer: graphQLHandler({
      handler: leads.getAllLeadFormOfCustomerHandler,
      validator: validategetAllLeadFormOfCustomer,
    }),
    getLeadFormOfCustomer: graphQLHandler({
      handler: leads.getLeadFormOfCustomerHandler,
      validator: validategetLeadFormOfCustomer,
    }),
  },
  Mutation: {
    cancelCustomerLead: graphQLHandler({
      handler: leads.cancelCustomerLeadHandler,
      validator: (x) => x,
    }),
    createForm: graphQLHandler({
      handler: leads.createFormHandler,
      validator: validateAttachPagetoApp,
    }),
    createManualLeadForm: graphQLHandler({
      handler: leads.createManualLeadFormHandler,
      validator: validateResponseCreateManualLeadForm,
    }),
    manualInputAutomateForm: graphQLHandler({
      handler: leads.manualInputAutomateFormHandler,
      validator: validateAttachPagetoApp,
    }),
    createFormComponent: graphQLHandler({
      handler: leads.createFormComponentHandler,
      validator: validateAttachPagetoApp,
    }),
    createMessageForm: graphQLHandler({
      handler: leads.createMessageFormHandler,
      validator: validateAttachPagetoApp,
    }),
  },
  Subscription: {
    onLeadFormSubmitSubscription: {
      subscribe: leads.onLeadFormSubmitSubscriptionHandler(),
    },
  },
};
