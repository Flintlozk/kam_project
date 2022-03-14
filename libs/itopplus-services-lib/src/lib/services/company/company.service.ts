import { isAllowCaptureException, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { IHTTPResult } from '@reactor-room/model-lib';
import { CompanyMemeber, CustomerCompany, CustomerCompanyFull, CustomerCompanyInputFull, IUpsertCompany, MemebersFiltersInput } from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { differenceWith } from 'lodash';
import {
  addCompanyByCustomerId,
  deleteCompanyByCustomerId,
  deleteCustomerCompanyMembers,
  getCompanyMembers,
  getCompanyMembersByCompanyID,
  getCustomerAssignedCompanyById,
  getCustomerCompanies,
  getCustomerCompanyById,
  insertCustomerCompanyMembers,
  removeCustomerCompany,
  saveCustomerCompany,
  updateCompanyByCustomerId,
  updateCustomerCompany,
} from '../../data';
import { FileService } from '../file/file.service';
import { LogService } from '../log/log.service';
import { PagesService } from '../pages/pages.service';
import { PlusmarService } from '../plusmarservice.class';
import { ProductService } from '../product/product.service';

export class CompanyService {
  public LogService: LogService;
  public pageService: PagesService;
  public productService: ProductService;
  public fileService: FileService;
  constructor() {
    this.LogService = new LogService();
    this.fileService = new FileService();
    this.pageService = new PagesService();
    this.productService = new ProductService();
  }

  getCompanyMembers = async ({ search, currentPage, pageSize, orderBy, orderMethod, social }: MemebersFiltersInput, pageID: number): Promise<CompanyMemeber[]> => {
    try {
      const params = { search: search ? `${search.toLowerCase()}%` : null, currentPage: (currentPage - 1) * pageSize, pageSize, orderBy, orderMethod, social, pageID };
      const searchBy = ['first_name', 'last_name', 'email', 'phone_number'];
      const socialFilter = ['psid', 'line_user_id'].filter((media, i) => social[i]);

      const queries = {
        search: search ? ` AND (${searchBy.map((column, i) => `lower(${column}) LIKE :search ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})` : '',
        socials: `${socialFilter.length ? ' AND (' + socialFilter.join(' IS NOT NULL OR ') + ' IS NOT NULL)' : ''}`,
      };

      return await getCompanyMembers(PlusmarService.writerClient, params, queries);
    } catch (error) {
      return error;
    }
  };

  getCompanyMembersByCompanyID = async (aliases: MemebersFiltersInput, pageID: number): Promise<CompanyMemeber[]> => {
    try {
      const { search, currentPage, pageSize, orderBy, orderMethod, social, id } = aliases;
      const params = { search: search ? `${search.toLowerCase()}%` : null, currentPage: (currentPage - 1) * pageSize, pageSize, orderBy, orderMethod, social, pageID, id };
      const searchBy = ['first_name', 'last_name', 'email', 'phone_number'];
      const socialFilter = ['psid', 'line_user_id'].filter((media, i) => social[i]);

      const queries = {
        search: search ? ` AND (${searchBy.map((column, i) => `lower(${column}) LIKE :search ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})` : '',
        socials: `${socialFilter.length ? ' AND (' + socialFilter.join(' IS NOT NULL OR ') + ' IS NOT NULL)' : ''}`,
      };
      const members = await getCompanyMembersByCompanyID(PlusmarService.writerClient, params, queries, id);
      return members;
    } catch (error) {
      return error;
    }
  };

  getCustomerCompanies = async ({ search, currentPage, pageSize, orderBy, orderMethod }: MemebersFiltersInput, pageID: number): Promise<CustomerCompany[]> => {
    try {
      const params = { search: search ? `${search.toLowerCase()}%` : null, currentPage: (currentPage - 1) * pageSize, pageSize, orderBy, orderMethod, pageID };
      const searchBy = ['company_name', 'branch_name'];

      const queries = {
        search: search ? ` AND (${searchBy.map((column, i) => `lower(${column}) LIKE :search ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})` : '',
      };
      return await getCustomerCompanies(PlusmarService.writerClient, params, queries);
    } catch (error) {
      return error;
    }
  };

  getCustomerCompanyById = async (id: number, pageID: number): Promise<CustomerCompanyFull> => {
    try {
      const data = await getCustomerCompanyById(PlusmarService.writerClient, id, pageID);
      return data;
    } catch (error) {
      return error;
    }
  };

  getCustomerAssignedCompanyById = async (id: number, pageID: number): Promise<CustomerCompany[]> => {
    try {
      const data = await getCustomerAssignedCompanyById(PlusmarService.writerClient, id, pageID);
      return data;
    } catch (error) {
      return error;
    }
  };

  saveCustomerCompany = async (params: CustomerCompanyInputFull, pageID: number, subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const link = params.info.company_logo_file ? await this.fileService.uploadToGoogle(pageID, params.info.company_logo_file, pageUUID, subscriptionID) : null;
      const data = await saveCustomerCompany(PlusmarService.writerClient, params, pageID, link);
      if (params?.updated_members?.length) {
        await insertCustomerCompanyMembers(
          PlusmarService.writerClient,
          params?.updated_members?.map((param) => param.id),
          pageID,
          data.id,
        );
      }

      if (data?.id) {
        return { status: 200, value: 'Saved' };
      } else {
        return { status: 403, value: 'Save fail' };
      }
    } catch (error) {
      console.log('error', error);
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(error);
      throw error;
    }
  };

  isEqualById = (a, b) => a.id === b.id;

  updateCustomerCompany = async (params: CustomerCompanyInputFull, pageID: number, subscriptionID: string, pageUUID: string): Promise<IHTTPResult> => {
    try {
      const link = params.info.company_logo_file ? await this.fileService.uploadToGoogle(pageID, params.info.company_logo_file, pageUUID, subscriptionID) : null;

      const updatedCustomerCompany = await updateCustomerCompany(PlusmarService.writerClient, params, pageID, link);

      const inserted = differenceWith(params.updated_members, params.stored_members, this.isEqualById);
      const deleted = differenceWith(params.stored_members, params.updated_members, this.isEqualById);

      const deletedMembers = deleted?.length
        ? await deleteCustomerCompanyMembers(
            PlusmarService.writerClient,
            deleted.map((param) => param.id),
            pageID,
            params.info.id,
          )
        : null;
      const insertedMembers = inserted?.length
        ? await insertCustomerCompanyMembers(
            PlusmarService.writerClient,
            inserted.map((param) => param.id),
            pageID,
            params.info.id,
          )
        : null;

      if (updatedCustomerCompany?.id || insertedMembers?.length || deletedMembers?.length) {
        return { status: 200, value: 'Updated' };
      } else {
        return { status: 403, value: 'Update fail' };
      }
    } catch (error) {
      console.log('error', error);
      return error;
    }
  };

  removeCustomerCompany = async (id: number[], pageID: number): Promise<IHTTPResult> => {
    try {
      await removeCustomerCompany(PlusmarService.writerClient, id, pageID);
      return { status: 200, value: 'Removed' };
    } catch (error) {
      console.log('error', error);
      return error;
    }
  };

  updateCompanyByCustomerId = async (id: number, customer_company_id: number, pageID: number): Promise<IHTTPResult> => {
    try {
      await updateCompanyByCustomerId(PlusmarService.writerClient, id, customer_company_id, pageID);
      return { status: 200, value: 'Updated' };
    } catch (error) {
      console.log('error', error);
      return { status: 403, value: '' };
    }
  };

  addCompanyByCustomerId = async (id: number, companies: number[], pageID: number): Promise<IHTTPResult> => {
    try {
      await addCompanyByCustomerId(PlusmarService.writerClient, id, companies, pageID);
      return { status: 200, value: 'Added' };
    } catch (error) {
      console.log('error', error);
      return { status: 403, value: '' };
    }
  };

  async upsertCustomerCompany(customer: IUpsertCompany, pageID: number): Promise<IHTTPResult> {
    try {
      const customerID = customer.id;
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
      const inserted = differenceWith(customer.updated, customer.selected, this.isEqualById);
      const deleted = differenceWith(customer.selected, customer.updated, this.isEqualById);

      if (deleted.length) {
        await deleteCompanyByCustomerId(
          client,
          customerID,
          deleted.map((company) => company.id),
          pageID,
        );
      }

      if (inserted.length) {
        await addCompanyByCustomerId(
          client,
          customerID,
          inserted.map((company) => company.id),
          pageID,
        );
      }
      await PostgresHelper.execBatchCommitTransaction(client);

      return { status: 200, value: 'OK' };
    } catch (err) {
      console.log('err [LOG]:--> ', err);
      return { status: 403, value: false };
    }
  }
}
