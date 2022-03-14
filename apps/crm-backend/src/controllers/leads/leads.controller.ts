import {
  IBusinessType,
  IContact,
  ILead,
  INoteLead,
  ITagLead,
  ITaskDealList,
  IUUIDCompany,
  IHTTPResult,
  EnumAuthScope,
  EnumFeatureScope,
  IUpLoadFiles,
  IInsertLeadRespone,
  ITagNameByCompany,
  IPagination,
  ICount,
  IAddress,
  ILeadSettings,
} from '@reactor-room/crm-models-lib';
import { LeadService } from '@reactor-room/crm-services-lib';
import { validateResponseHTTPObject } from '../../schema/common';
import { graphQLHandler } from '../graphql-handler';
import type { IInsertCompany, IGQLContext, IUpdateCompany, IDeleteCompany } from '@reactor-room/crm-models-lib';
import {
  validatadeleteCompanyContactRequest,
  validataInsertCompanyContactRequest,
  validataUpdateCompanyContactRequest,
  validateGetAdressByLeadHandlerRespone,
  validateGetBusinessTypeByOwnerIdRespone,
  validateGetContactByLeadRequest,
  validateGetContactByLeadRespone,
  validateGetLeadsContactByUUIDCompanyRequest,
  validateGetLeadsContactByUUIDCompanyRespone,
  validateGetLeadsContactListResponse,
  validateGetLeadSettingsByOwnerIdRespone,
  validateGetNoteLeadByComapnyIdRequest,
  validateGetNoteLeadByComapnyIdRespone,
  validateGetPrimaryContactByLeadRequest,
  validateGetPrimaryContactByLeadRespone,
  validateGetTagLeadByCompanyIdRespone,
  validateGetTagLeadByOwnerIdRespone,
  validateGetTotalLeadListResponse,
  validateInsertCompanyContactResponse,
} from '../../schema/lead/lead.schema';
import { taskResolver } from '../task/task.controller';
import { environment } from '../../environments/environment';
import { requireFeature, requireScope } from '../../domains/auth.domain';

@requireScope([EnumAuthScope.ADMIN])
class Leads {
  public static instance;
  public static leads: Leads;
  public static getInstance() {
    if (!Leads.instance) Leads.instance = new Leads();
    return Leads.instance;
  }

  async getLeadsContactListHandler(parent, args: IPagination, context: IGQLContext): Promise<ILead[]> {
    return await LeadService.getLeadsContact(args.pagination, context.payload.userLoginData.ownerId);
  }
  async getInActiveLeadsContactListHandler(parent, args: IPagination, context: IGQLContext): Promise<ILead[]> {
    return await LeadService.getInActiveLeadsContact(args.pagination, context.payload.userLoginData.ownerId);
  }

  async getContactByLeadHandler(parent, args: IUUIDCompany, context: IGQLContext): Promise<IContact[]> {
    const { uuidCompany } = validateGetContactByLeadRequest(args);
    return await LeadService.getContactsByLead(uuidCompany, context.payload.userLoginData.ownerId);
  }
  async getAdressByLeadHandler(parent, args: IUUIDCompany, context: IGQLContext): Promise<IAddress[]> {
    const { uuidCompany } = validateGetContactByLeadRequest(args);
    return await LeadService.getAdressByLead(uuidCompany, context.payload.userLoginData.ownerId);
  }
  async getPrimaryContactByLeadHandler(parent, args: IUUIDCompany, context: IGQLContext): Promise<IContact[]> {
    const { uuidCompany } = validateGetPrimaryContactByLeadRequest(args);
    return await LeadService.getPrimaryContactsbyLead(uuidCompany, context.payload.userLoginData.ownerId);
  }

  async getLeadsContactByUUIDCompanyHandler(parent, args: IUUIDCompany, context: IGQLContext): Promise<ILead[]> {
    const { uuidCompany } = validateGetLeadsContactByUUIDCompanyRequest(args);
    const LeadsContact = await LeadService.getLeadsContactByUUIDCompany(uuidCompany, context.payload.userLoginData.ownerId);
    LeadsContact[0].userWorkflow = context.payload.userWorkflow;
    return LeadsContact;
  }
  @requireFeature([EnumFeatureScope.IMPORTLEAD])
  async updateCompanyContactHandler(parent, args: IUpdateCompany, context: IGQLContext): Promise<IHTTPResult> {
    const ILead = validataUpdateCompanyContactRequest(args.updateCompanyContact);
    return await LeadService.updateCompanyContact(ILead, context.payload.userLoginData.ownerId);
  }
  @requireFeature([EnumFeatureScope.IMPORTLEAD])
  async insertCompanyContactHandler(parent, args: IInsertCompany, context: IGQLContext): Promise<IInsertLeadRespone> {
    const ILead = validataInsertCompanyContactRequest(args.insertCompanyContact);
    return await LeadService.insertCompanyContact(ILead, context.payload.userLoginData);
  }
  @requireFeature([EnumFeatureScope.IMPORTLEAD])
  async deleteCompanyContactHandler(parent, args: IDeleteCompany, context: IGQLContext): Promise<IHTTPResult> {
    const LeadRequestList = validatadeleteCompanyContactRequest(args.deleteCompanyContact.companyinputlist);
    return await LeadService.deleteCompanyContact(LeadRequestList, context.payload.userLoginData.ownerId);
  }

  async getBusinessTypeByOwnerIdHandler(parent, args, context: IGQLContext): Promise<IBusinessType[]> {
    return await LeadService.getBusinessTypeByOwnerId(context.payload.userLoginData.ownerId);
  }

  async getTagLeadByCompanyIdHandler(parent, args: IUUIDCompany, context: IGQLContext): Promise<ITagNameByCompany[]> {
    const { uuidCompany } = validateGetPrimaryContactByLeadRequest(args);
    return await LeadService.getTagLeadByCompanyId(uuidCompany, context.payload.userLoginData.ownerId);
  }

  async getTagLeadByOwnerIdHandler(parent, arg, context: IGQLContext): Promise<ITagLead[]> {
    return await LeadService.getTagLeadByOwner(context.payload.userLoginData.ownerId);
  }

  async getNoteLeadByComapnyIdHandler(parent, args: IUUIDCompany, context: IGQLContext): Promise<INoteLead[]> {
    const { uuidCompany } = validateGetNoteLeadByComapnyIdRequest(args);
    return await LeadService.getNoteLeadByCompanyId(uuidCompany, context.payload.userLoginData.ownerId);
  }
  async multipleUploadHandler(parent, args: IUpLoadFiles, context: IGQLContext): Promise<IHTTPResult> {
    return await LeadService.multipleUpload(args.files, args.dataAttach, context.payload.userLoginData.ownerId, environment.production);
  }
  async getTotalLeadHandler(parent, args, context: IGQLContext): Promise<ICount> {
    return await LeadService.getTotalLead(context.payload.userLoginData.ownerId);
  }
  async getLeadSettingsByOwnerIdHandler(parent, args, context: IGQLContext): Promise<ILeadSettings> {
    return await LeadService.getLeadSettingsByOwner(context.payload.userLoginData.ownerId);
  }
}

const leads: Leads = Leads.getInstance();

export const leadResolver = {
  Lead: {
    primaryContactList(parent: ILead, arg, context: IGQLContext): Promise<IContact[]> {
      return leadResolver.Query.getPrimaryContactByLead(parent, { uuidCompany: parent.uuidCompany }, context);
    },
    companyContactList(parent: ILead, arg, context: IGQLContext): Promise<IContact[]> {
      return leadResolver.Query.getContactByLead(parent, { uuidCompany: parent.uuidCompany }, context);
    },
    tagLeadList(parent: ILead, arg, context: IGQLContext): Promise<ITagLead[]> {
      return leadResolver.Query.getTagLeadByCompanyId(parent, { uuidCompany: parent.uuidCompany }, context);
    },
    noteLeadList(parent: ILead, arg, context: IGQLContext): Promise<INoteLead[]> {
      return leadResolver.Query.getNoteLeadByComapnyId(parent, { uuidCompany: parent.uuidCompany }, context);
    },
    contactTask(parent: ILead, arg, context: IGQLContext): Promise<IContact[]> {
      return leadResolver.Query.getContactByLead(parent, { uuidCompany: parent.uuidCompany }, context);
    },
    getAllUser(parent: ILead, args, context: IGQLContext): Promise<ITaskDealList[]> {
      return taskResolver.Query.getAllUser(parent, { companyId: parent.uuidCompany }, context);
    },
    addressList(parent: ILead, arg, context: IGQLContext): Promise<IAddress[]> {
      return leadResolver.Query.getAdressByLead(parent, { uuidCompany: parent.uuidCompany }, context);
    },
  },
  Query: {
    getLeadsContact: graphQLHandler({
      handler: leads.getLeadsContactListHandler,
      validator: validateGetLeadsContactListResponse,
    }),
    getInActiveLeadsContact: graphQLHandler({
      handler: leads.getInActiveLeadsContactListHandler,
      validator: validateGetLeadsContactListResponse,
    }),
    getTotalLead: graphQLHandler({
      handler: leads.getTotalLeadHandler,
      validator: validateGetTotalLeadListResponse,
    }),
    getAdressByLead: graphQLHandler({
      handler: leads.getAdressByLeadHandler,
      validator: validateGetAdressByLeadHandlerRespone,
    }),
    getContactByLead: graphQLHandler({
      handler: leads.getContactByLeadHandler,
      validator: validateGetContactByLeadRespone,
    }),
    getPrimaryContactByLead: graphQLHandler({
      handler: leads.getPrimaryContactByLeadHandler,
      validator: validateGetPrimaryContactByLeadRespone,
    }),
    getLeadsContactByUUIDCompany: graphQLHandler({
      handler: leads.getLeadsContactByUUIDCompanyHandler,
      validator: validateGetLeadsContactByUUIDCompanyRespone,
    }),
    getBusinessTypeByOwnerId: graphQLHandler({
      handler: leads.getBusinessTypeByOwnerIdHandler,
      validator: validateGetBusinessTypeByOwnerIdRespone,
    }),
    getTagLeadByCompanyId: graphQLHandler({
      handler: leads.getTagLeadByCompanyIdHandler,
      validator: validateGetTagLeadByCompanyIdRespone,
    }),
    getTagLeadByOwnerId: graphQLHandler({
      handler: leads.getTagLeadByOwnerIdHandler,
      validator: validateGetTagLeadByOwnerIdRespone,
    }),
    getNoteLeadByComapnyId: graphQLHandler({
      handler: leads.getNoteLeadByComapnyIdHandler,
      validator: validateGetNoteLeadByComapnyIdRespone,
    }),
    getLeadSettingsByOwnerId: graphQLHandler({
      handler: leads.getLeadSettingsByOwnerIdHandler,
      validator: validateGetLeadSettingsByOwnerIdRespone,
    }),
  },
  Mutation: {
    updateCompanyContact: graphQLHandler({
      handler: leads.updateCompanyContactHandler,
      validator: validateResponseHTTPObject,
    }),
    insertCompanyContact: graphQLHandler({
      handler: leads.insertCompanyContactHandler,
      validator: validateInsertCompanyContactResponse,
    }),
    deleteCompanyContact: graphQLHandler({
      handler: leads.deleteCompanyContactHandler,
      validator: validateResponseHTTPObject,
    }),
    multipleUpload: graphQLHandler({
      handler: leads.multipleUploadHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
