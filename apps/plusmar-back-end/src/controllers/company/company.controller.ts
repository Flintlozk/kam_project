import type { IDObject, IHTTPResult } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import { CustomerCompany, CustomerCompanyFull, CustomerCompanyInputFull, EnumAuthScope, IGQLContext, IUpsertCompany, MemebersFiltersInput } from '@reactor-room/itopplus-model-lib';
import { CompanyService } from '@reactor-room/itopplus-services-lib';
import { environment } from '../../environments/environment';
import { validateResponseHTTPObject } from '../../schema/common';
import {
  validateCompanyInput,
  validateCompanyMembersByCompanyIDResponse,
  validateCompanyMembersResponse,
  validateCustomerCompaniesResponse,
  validateCustomerCompanyByIdResponse,
} from '../../schema/customer';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class Company {
  public static instance;
  public static companyService: CompanyService;
  public static getInstance() {
    if (!Company.instance) Company.instance = new Company();
    return Company.instance;
  }

  constructor() {
    Company.companyService = new CompanyService();
  }
  async getCompanyMembersHandler(parent, args: { filters: MemebersFiltersInput }, context: IGQLContext): Promise<IDObject[]> {
    const { pageID } = context.payload;
    return await Company.companyService.getCompanyMembers(args.filters, pageID);
  }

  async getCompanyMembersByCompanyIDHandler(parent, args: { filters: MemebersFiltersInput }, context: IGQLContext): Promise<IDObject[]> {
    const { pageID } = context.payload;
    return await Company.companyService.getCompanyMembersByCompanyID(args.filters, pageID);
  }

  async getCustomerCompaniesHandler(parent, args: { filters: MemebersFiltersInput }, context: IGQLContext): Promise<CustomerCompany[]> {
    const { pageID } = context.payload;
    return await Company.companyService.getCustomerCompanies(args.filters, pageID);
  }

  async getCustomerCompanyByIdHandler(parent, args: { id: number }, context: IGQLContext): Promise<CustomerCompanyFull> {
    const { pageID } = context.payload;
    return await Company.companyService.getCustomerCompanyById(args.id, pageID);
  }

  async getCustomerAssignedCompanyByIdHandler(parent, args: { id: number }, context: IGQLContext): Promise<CustomerCompany[]> {
    const { pageID } = context.payload;
    return await Company.companyService.getCustomerAssignedCompanyById(args.id, pageID);
  }

  async saveCustomerCompanyHandler(parent, args: { params: CustomerCompanyInputFull }, context: IGQLContext): Promise<IHTTPResult> {
    const {
      pageID,
      page: { uuid: pageUUID },
      subscriptionID,
    } = context.payload;
    const companyInput = validateCompanyInput(args.params);
    return await Company.companyService.saveCustomerCompany(companyInput, pageID, subscriptionID, pageUUID);
  }

  async updateCustomerCompanyHandler(parent, args: { params: CustomerCompanyInputFull }, context: IGQLContext): Promise<IHTTPResult> {
    const {
      pageID,
      page: { uuid: pageUUID },
      subscriptionID,
    } = context.payload;
    return await Company.companyService.updateCustomerCompany(args.params, pageID, subscriptionID, pageUUID);
  }

  async removeCustomerCompanyHandler(parent, args: { id: number[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await Company.companyService.removeCustomerCompany(args.id, pageID);
  }

  async updateCompanyByCustomerIdHandler(parent, args: { id: number; customer_company_id: number }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await Company.companyService.updateCompanyByCustomerId(args.id, args.customer_company_id, pageID);
  }

  async addCompanyByCustomerIdHandler(parent, args: { id: number; customer_company_id: number[] }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await Company.companyService.addCompanyByCustomerId(args.id, args.customer_company_id, pageID);
  }
  async upsertCustomerCompanyHandler(parent, args: { customer: IUpsertCompany }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    return await Company.companyService.upsertCustomerCompany(args.customer, pageID);
  }
}
const companyObj: Company = Company.getInstance();
export const companyResolver = {
  Query: {
    getCompanyMembers: graphQLHandler({
      handler: companyObj.getCompanyMembersHandler,
      validator: validateCompanyMembersResponse,
    }),
    getCompanyMembersByCompanyID: graphQLHandler({
      handler: companyObj.getCompanyMembersByCompanyIDHandler,
      validator: validateCompanyMembersByCompanyIDResponse,
    }),
    getCustomerCompanies: graphQLHandler({
      handler: companyObj.getCustomerCompaniesHandler,
      validator: validateCustomerCompaniesResponse,
    }),
    getCustomerCompanyById: graphQLHandler({
      handler: companyObj.getCustomerCompanyByIdHandler,
      validator: validateCustomerCompanyByIdResponse,
    }),
    getCustomerAssignedCompanyById: graphQLHandler({
      handler: companyObj.getCustomerAssignedCompanyByIdHandler,
      validator: validateCustomerCompaniesResponse,
    }),
  },
  Mutation: {
    saveCustomerCompany: graphQLHandler({
      handler: companyObj.saveCustomerCompanyHandler,
      validator: validateResponseHTTPObject,
    }),
    updateCustomerCompany: graphQLHandler({
      handler: companyObj.updateCustomerCompanyHandler,
      validator: validateResponseHTTPObject,
    }),
    removeCustomerCompany: graphQLHandler({
      handler: companyObj.removeCustomerCompanyHandler,
      validator: validateResponseHTTPObject,
    }),
    updateCompanyByCustomerId: graphQLHandler({
      handler: companyObj.updateCompanyByCustomerIdHandler,
      validator: validateResponseHTTPObject,
    }),
    addCompanyByCustomerId: graphQLHandler({
      handler: companyObj.addCompanyByCustomerIdHandler,
      validator: validateResponseHTTPObject,
    }),
    upsertCustomerCompany: graphQLHandler({
      handler: companyObj.upsertCustomerCompanyHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
