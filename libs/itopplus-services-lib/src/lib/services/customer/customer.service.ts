import { cryptoDecode, getUTCMongo, getUTCTimestamps, httpResultValueTranslate, isAllowCaptureException, isEmpty, PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { AudiencePlatformType, IDObject, IHTTPResult, ITableFilter } from '@reactor-room/model-lib';
import {
  CustomerAddress,
  CustomerOrders,
  CustomerOrdersFilters,
  CustomerShippingAddress,
  CustomersListFilters,
  CUSTOMER_TAG_OBJECT_TYPE,
  EnumLogDescription,
  IAliases,
  ICustomerCrudOperation,
  ICustomerNote,
  ICustomerTagCRUD,
  ICustomerTemp,
  ICustomerTempInput,
  ICustomerUpdate,
  ICustomerUpdateInfoInput,
  IFacebookPipelineModel,
  IPages,
  PurchaseCustomerDetail,
  RemoveUserResponse,
} from '@reactor-room/itopplus-model-lib';
import * as Sentry from '@sentry/node';
import { Pool } from 'pg';
import {
  addCustomerShippingAddress,
  blockCustomer,
  createCustomer,
  createNewCustomerWithForm,
  deleteCustomerTag,
  deleteCustomerTagMapping,
  getAudienceByCustomerID,
  getCustomerAllTags,
  getCustomerAudienceByID,
  getCustomerByID,
  getCustomerByLineUserID,
  getCustomerByPSID,
  getCustomerOrders,
  getCustomers,
  getCustomerShippingAddressByOrder,
  getCustomerTagByName,
  getCustomerTagByPageByID,
  getCustomerTagCount,
  getCustomerTags,
  getFacebookUserProfile,
  getMappedTags,
  getNotes,
  getPageByFacebookPageID,
  getPreviousAudienceIDbyCustomerID,
  insertCustomerMappingTag,
  insertCustomerTag,
  newCustomerMethod,
  removeCustomer,
  removeNote,
  unblockCustomer,
  updateCustomer,
  updateCustomerByForm,
  updateCustomerCanReply,
  updateCustomerFromLineOA,
  updateCustomerProfilePicture,
  updateCustomerShippingAddress,
  updateCustomerTag,
  updatePDPAConsentAcceptance,
  upsertNote,
  updateCustomerFromOpenAPI,
  getCustomerIDByOrderID,
} from '../../data';
import { LineService } from '../line/line.service';
import { LogService } from '../log/log.service';
import { PagesService } from '../pages/pages.service';
import { PlusmarService } from '../plusmarservice.class';

export class CustomerService {
  public LogService: LogService;
  public lineService: LineService;
  public pageService: PagesService;

  constructor() {
    this.LogService = new LogService();
    this.lineService = new LineService();
    this.pageService = new PagesService();
  }
  async getCustomerAudienceByID(pageID: number, audienceID: number): Promise<PurchaseCustomerDetail> {
    // ? being used at webhook-template.service
    return await getCustomerAudienceByID(PlusmarService.readerClient, audienceID, pageID);
  }
  async getCustomerShippingAddressByOrder(pageID: number, orderID: number, customerID: number): Promise<CustomerShippingAddress[]> {
    // ? being used at webhook-template.service
    return await getCustomerShippingAddressByOrder(PlusmarService.readerClient, customerID, pageID, orderID);
  }

  create = async (customerData: ICustomerTempInput, page: IPages): Promise<ICustomerTemp | null> => {
    if (page) {
      try {
        return await createCustomer(PlusmarService.writerClient, customerData.psid, page.id);
      } catch (err) {
        // in case of conflict customer from another machine
        return await getCustomerByPSID(PlusmarService.writerClient, customerData.psid, page.id);
      }
    } else {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new Error('PAGE_NOT_FOUND'));
      return null;
    }
  };

  createNewCustomerFromLineOa = async (customerData: ICustomerTemp, page: IPages): Promise<ICustomerTemp> => {
    if (page) {
      try {
        return await newCustomerMethod(PlusmarService.writerClient, customerData, page.id);
      } catch (err) {
        // in case of conflict customer from another machine
        return await getCustomerByLineUserID(PlusmarService.writerClient, customerData.line_user_id, page.id);
      }
    } else {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new Error('PAGE_NOT_FOUND'));
      return null;
    }
  };

  updateCustomerFromLineOA = async (customerData: ICustomerTemp, page: IPages): Promise<ICustomerTemp> => {
    if (page) {
      return await updateCustomerFromLineOA(PlusmarService.writerClient, customerData, page.id);
    } else {
      if (isAllowCaptureException(PlusmarService.environment)) Sentry.captureException(new Error('PAGE_NOT_FOUND'));
      return null;
    }
  };

  // with form
  createNewCustomer = async (customer: ICustomerTemp, pageID: number, user_name: string, user_id: number): Promise<void> => {
    const audience = await getAudienceByCustomerID(PlusmarService.readerClient, customer.id, pageID);
    await createNewCustomerWithForm(PlusmarService.writerClient, customer, pageID);
    await this.LogService.addLog(
      {
        user_id,
        type: 'Customer',
        action: 'Create',
        description: `${customer.first_name} ${customer.last_name}, ${customer.email}`,
        user_name,
        audience_id: audience.id,
        audience_name: `${customer.first_name} ${customer.last_name}`,
        subject: `${customer.first_name} ${customer.last_name}`,
        created_at: getUTCMongo(),
      },
      pageID,
    );
  };

  upsertNote = async (note: ICustomerNote, pageID: number, userID: number): Promise<void> => {
    await upsertNote(PlusmarService.writerClient, note, pageID, userID);
  };

  removeNote = async (note: ICustomerNote, pageID: number): Promise<void> => {
    await removeNote(PlusmarService.writerClient, note, pageID);
  };

  getNotes = async (pageID: number, userID: number, customer_id: number): Promise<ICustomerNote[]> => {
    const notes = await getNotes(PlusmarService.writerClient, pageID, userID, customer_id);
    return notes;
  };

  update = async (customerID: number, fb_page_id: string, pageID: number, fromName: string, isNew: boolean): Promise<ICustomerTemp> => {
    const page = await getPageByFacebookPageID(PlusmarService.readerClient, fb_page_id);
    const accessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);
    const result = await updateCustomer(PlusmarService.readerClient, customerID, accessToken, pageID, fromName, isNew);
    return result;
  };

  updateProfilePicture = async (pageID: number, customerID: number, platform: AudiencePlatformType, credential: string, profileID?: string): Promise<void> => {
    switch (platform) {
      case AudiencePlatformType.FACEBOOKFANPAGE: {
        const page = await getPageByFacebookPageID(PlusmarService.readerClient, credential);
        const accessToken = cryptoDecode(page.option.access_token, PlusmarService.environment.pageKey);

        const customer = await getCustomerByID(PlusmarService.readerClient, customerID, pageID);
        const fields = await getFacebookUserProfile(customer.psid, accessToken, ['picture']);

        const picture = fields?.picture?.data?.url;
        if (picture) {
          await this.updateCustomerProfilePicture(pageID, customerID, picture);
        }
        break;
      }
      case AudiencePlatformType.LINEOA: {
        break;
      }
      default:
        return;
    }
  };

  async updateCustomerProfilePicture(pageID: number, customerID: number, picture: string): Promise<void> {
    await updateCustomerProfilePicture(PlusmarService.writerClient, pageID, customerID, picture);
  }

  updateCustomerCanReply = async (canReply: boolean, customerID: number, pageID: number): Promise<void> => {
    await updateCustomerCanReply(PlusmarService.writerClient, canReply, customerID, pageID);
  };

  getPreviousAudienceIDbyCustomerID = async (customerID: number, index: number, pageID: number): Promise<IDObject[]> => {
    return await getPreviousAudienceIDbyCustomerID(PlusmarService.writerClient, customerID, index, pageID);
  };

  removeCustomer = async (id: string, pageID: number, user_name: string, user_id: number): Promise<RemoveUserResponse> => {
    const customer = await getCustomerByID(PlusmarService.readerClient, Number(id), pageID);
    const audience = await getAudienceByCustomerID(PlusmarService.readerClient, customer.id, pageID);
    const result = await removeCustomer(PlusmarService.readerClient, id, pageID);
    await this.LogService.addLog(
      {
        user_id,
        type: 'Customer',
        action: 'Delete',
        description: EnumLogDescription.DELETE_CUSTOMER,
        user_name,
        audience_id: audience.id,
        audience_name: `${customer.first_name} ${customer.last_name}`,
        subject: `${customer.first_name} ${customer.last_name}`,
        created_at: getUTCMongo(),
      },
      pageID,
    );
    return result;
  };

  blockCustomer = async (id: string, pageID: number, user_name: string, user_id: number): Promise<RemoveUserResponse> => {
    const customer = await getCustomerByID(PlusmarService.readerClient, Number(id), pageID);
    const audience = await getAudienceByCustomerID(PlusmarService.readerClient, Number(id), pageID);
    const result = await blockCustomer(PlusmarService.readerClient, id, pageID);
    await this.LogService.addLog(
      {
        user_id,
        type: 'Customer',
        action: 'Block',
        description: EnumLogDescription.BLOCK_CUSTOMER,
        user_name,
        audience_id: audience.id,
        audience_name: `${customer.first_name} ${customer.last_name}`,
        subject: `${customer.first_name} ${customer.first_name}`,
        created_at: getUTCMongo(),
      },
      pageID,
    );
    return result;
  };

  unblockCustomer = async (id: string, pageID: number, user_name: string, user_id: number): Promise<RemoveUserResponse> => {
    const customer = await getCustomerByID(PlusmarService.readerClient, Number(id), pageID);
    const audience = await getAudienceByCustomerID(PlusmarService.readerClient, Number(id), pageID);
    const result = await unblockCustomer(PlusmarService.readerClient, id, pageID);
    await this.LogService.addLog(
      {
        user_id,
        type: 'Customer',
        action: 'Unblock',
        description: EnumLogDescription.UNBLOCK_CUSTOMER,
        user_name,
        audience_id: audience.id,
        audience_name: `${customer.first_name} ${customer.last_name}`,
        subject: `${customer.first_name} ${customer.first_name}`,
        created_at: getUTCMongo(),
      },
      pageID,
    );
    return result;
  };

  getCustomerByPSID = async (PSID: string, pageID: number): Promise<ICustomerTemp> => {
    return await getCustomerByPSID(PlusmarService.readerClient, PSID, pageID);
  };

  getCustomerByLineUserID = async (userID: string, pageID: number): Promise<ICustomerTemp> => {
    return await getCustomerByLineUserID(PlusmarService.readerClient, userID, pageID);
  };

  getCustomerByID = async (ID: number, pageID: number): Promise<ICustomerTemp> => {
    const customer = await getCustomerByID(PlusmarService.readerClient, ID, pageID);
    return customer;
  };

  getCustomerTagByPageByID = async (customerID: number, pageID: number): Promise<ICustomerTagCRUD[]> => {
    const customer = await getCustomerTagByPageByID(PlusmarService.readerClient, customerID, pageID);
    return customer;
  };

  getCustomers = async (filters: CustomersListFilters, pageID: number): Promise<ICustomerTemp[]> => {
    const { currentPage = 1, orderBy = ['first_name', 'last_name'], orderMethod = 'DESC', search = '', pageSize = 10, customer_tag = null, exportAllRows, noTag, tags } = filters;
    const page = (currentPage - 1) * pageSize;

    const aliases = {
      pageID,
      currentPage,
      search: search ? `%${search.toLowerCase()}%` : null,
      pageSize,
      page,
    } as IAliases;
    let searchTags = null;
    if (!noTag) {
      if (tags?.length) {
        searchTags = PostgresHelper.joinInQueries(tags.map((tag) => tag.id));
      }
    }

    const searchBy = ['first_name', 'last_name', 'email', 'phone_number', 'aliases'];
    const searchQuery = search ? ` AND (${searchBy.map((column, i) => `lower(${column}) LIKE :search ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')})` : '';

    const orderQuery: string = orderBy.map((i) => `${i} ${orderMethod.toUpperCase()} NULLS LAST`).join(', ');
    const customers = await getCustomers(
      PlusmarService.readerClient,
      aliases,
      { searchQuery, orderQuery, exportAllRows },
      { pageID, page, pageSize, search: aliases.search },
      noTag,
      searchTags,
    );
    return customers;
  };

  getCustomerOrdersById = async (
    { currentPage = 1, orderBy = ['created_at'], orderMethod = 'DESC', search = null, pageSize = 10 }: CustomerOrdersFilters,
    pageID: number,
  ): Promise<CustomerOrders[]> => {
    // prepare bindings
    const page = (currentPage - 1) * pageSize;

    // prepare search
    const searchBy = ['a.status', 'po.status'];
    const addORclause = (i) => (searchBy.length - 1 > i ? 'OR' : '');
    const getSearchClause = (column, i) => `UPPER(${column}::text) LIKE UPPER(:search) ${addORclause(i)}`;
    search = search ? `AND (${searchBy.map(getSearchClause).join(' ')})` : '';
    search = `WHERE a.page_id = ${pageID} ` + search;
    const result = await getCustomerOrders(PlusmarService.readerClient, { search, orderBy, orderMethod, pageSize, page } as IAliases);
    return Array.isArray(result) ? result : [];
  };

  getUpdateCustomerFormColumns(customer: ICustomerUpdate): {
    set: string;
    value: ICustomerUpdate;
  } {
    delete customer.id;
    delete customer.company;
    const columnValuePair = [];
    const sqlBidingValue: ICustomerUpdate = customer;

    for (const key in customer) {
      if (Object.prototype.hasOwnProperty.call(customer, key)) {
        let value = customer[key];
        if (customer[key] !== null) {
          if (key === 'location' || key === 'social') {
            // eslint-disable-next-line
            value = customer[key] ? `${JSON.stringify(customer[key]).replace(',', '\,')}` : null; // prettier-ignore
          } else {
            value = customer[key] ? `${customer[key]}` : null;
          }
        } else {
          value = null;
        }
        const sqlSetGroup = `${key} = :${key}`;
        sqlBidingValue[key] = value;
        columnValuePair.push(sqlSetGroup);
      }
    }
    return { set: columnValuePair.join(' , '), value: sqlBidingValue };
  }

  async updateCustomerByForm(customer: ICustomerUpdateInfoInput, pageID: number): Promise<IHTTPResult> {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      const result = await updateCustomerByForm(pageID, customer, client);
      await PostgresHelper.execBatchCommitTransaction(client);
      return result;
    } catch (error) {
      console.log('update by form ', error);
      return { status: 403, value: false };
    }
  }

  async updateCustomerInfoFromOpenAPI(customer: ICustomerUpdateInfoInput, pageID: number): Promise<IHTTPResult> {
    try {
      const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);

      const result = await updateCustomerFromOpenAPI(pageID, customer, client);
      await PostgresHelper.execBatchCommitTransaction(client);
      return result;
    } catch (error) {
      console.log('update by open api ', error);
      return { status: 403, value: 'Error update customer from openapi.' };
    }
  }

  getCustomerTags(filters: ITableFilter, pageID: number): Promise<ICustomerTagCRUD[]> {
    const searchBy = ['name'];
    const { search, currentPage, orderBy, orderMethod, pageSize } = filters;
    const searchQuery = search ? ` AND ${searchBy.map((column, i) => `UPPER(${column}) LIKE UPPER('%${search}%') ${searchBy.length - 1 > i ? 'OR' : ''}`).join(' ')}` : '';
    const orderQuery = `${orderBy.join()} ${orderMethod.toUpperCase()} NULLS LAST`;
    const page: number = (currentPage - 1) * pageSize;
    return getCustomerTags(PlusmarService.readerClient, pageID, searchQuery, orderQuery, page, pageSize);
  }

  crudCustomerTagData = async (pageID: number, customerTagData: ICustomerTagCRUD[], operationType: string): Promise<IHTTPResult[]> => {
    try {
      let responseMessage: IHTTPResult[] = [];
      const { updateCustTag, insertCustTag, deleteCustTag } = seperateCustomerCRUDOperation(customerTagData);
      switch (operationType) {
        case CUSTOMER_TAG_OBJECT_TYPE.TAG:
          responseMessage = await this.performCustomerTagOperation(pageID, { updateCustTag, insertCustTag, deleteCustTag });
          break;
        case CUSTOMER_TAG_OBJECT_TYPE.MAPPING:
          responseMessage = await this.performCustomerTagMappingOperation(pageID, { insertCustTag, deleteCustTag });
          break;
        default:
          throw new Error('Not a valid operation, try again later');
      }
      return responseMessage;
    } catch (err) {
      return [{ status: 403, value: 'Error on performing operaion. Try again later' }];
    }
  };

  performCustomerTagOperation = async (pageID: number, tagOperations: ICustomerCrudOperation): Promise<IHTTPResult[]> => {
    const responseMessage: IHTTPResult[] = [];
    const { updateCustTag, insertCustTag, deleteCustTag } = tagOperations;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const insertResponse = await this.processInsertOfCustomerTag(pageID, insertCustTag, client);

    const updateResponse = await this.processUpdateOfCustomerTag(pageID, updateCustTag, client);

    const deleteResponse = await this.processDeleteOfCustomerTag(pageID, deleteCustTag, client);

    if (insertResponse?.status) responseMessage.push(insertResponse);

    if (updateResponse?.status) responseMessage.push(updateResponse);

    if (deleteResponse?.length > 0) responseMessage.push(...deleteResponse);

    await PostgresHelper.execBatchCommitTransaction(client);

    return responseMessage;
  };

  processDeleteOfCustomerTag = async (pageID: number, deleteCustTag: ICustomerTagCRUD[], client: Pool, checkMapping = false): Promise<IHTTPResult[]> => {
    try {
      if (deleteCustTag.length > 0) {
        const responseMessage = [] as IHTTPResult[];
        if (checkMapping) {
          const { tagNames, deleteCustTagUnMapped } = await this.getTagMappedNames(pageID, deleteCustTag, client);

          if (tagNames) responseMessage.push(this.showTagDeleteAssociatedError(tagNames));

          if (deleteCustTagUnMapped?.length > 0) {
            const deletedTagName = deleteCustTagUnMapped.map(({ name }) => name);
            for (let i = 0; i < deleteCustTagUnMapped.length; i++) {
              const customerTagItem = deleteCustTagUnMapped[i];
              const { id } = customerTagItem;
              await deleteCustomerTag(pageID, id, client);
            }
            const value = httpResultValueTranslate({
              isTranslateKeys: true,
              translateKeys: ['Tag deleted successfully'],
              noTranslateMessage: deletedTagName.join(' ,'),
            });
            responseMessage.push({ status: 200, value });
            return responseMessage;
          } else {
            const value = httpResultValueTranslate({
              isTranslateKeys: false,
              translateKeys: ['No Tags deleted'],
              noTranslateMessage: null,
            });
            responseMessage.push({ status: 200, value });
            return responseMessage;
          }
        } else {
          const deletedTagName = [];
          for (let index = 0; index < deleteCustTag.length; index++) {
            const customerTagItem = deleteCustTag[index];
            const { id, name } = customerTagItem;
            await deleteCustomerTag(pageID, id, client);
            deletedTagName.push(name);
          }
          const value = httpResultValueTranslate({
            isTranslateKeys: true,
            translateKeys: ['Tag deleted successfully'],
            noTranslateMessage: deletedTagName.join(' ,'),
          });
          responseMessage.push({ status: 200, value });
          return responseMessage;
        }
      }
    } catch (error) {
      console.log('error', error);
      const value = httpResultValueTranslate({
        isTranslateKeys: false,
        translateKeys: ['Error removing tags'],
        noTranslateMessage: null,
      });
      return [{ status: 403, value }];
    }
  };

  showTagDeleteAssociatedError(tagNames: string): IHTTPResult {
    const value = httpResultValueTranslate({
      isTranslateKeys: true,
      noTranslateMessage: tagNames,
      translateKeys: ['cannot be deleted as it is associated to customers'],
    });
    return { status: 403, value };
  }

  getTagMappedNames = async (pageID: number, deleteCustTag: ICustomerTagCRUD[], client: Pool): Promise<{ tagNames: string; deleteCustTagUnMapped: ICustomerTagCRUD[] }> => {
    try {
      const tag_id = deleteCustTag.map(({ id }) => id);
      const tagMappedIDs = await getMappedTags(pageID, tag_id, client);
      const tagNamesArray = tagMappedIDs
        ?.map((id) => {
          const names = deleteCustTag.filter((tag) => tag.id === +id)[0]?.name;
          deleteCustTag = deleteCustTag.filter((tag) => tag.id !== +id);
          return names;
        })
        .filter((ele) => ele);
      const tagNames = tagNamesArray.length > 0 ? tagNamesArray.join(', ') : null;
      return {
        tagNames,
        deleteCustTagUnMapped: deleteCustTag,
      };
    } catch (error) {
      console.log('error getting mapped tags -> error', error);
      throw new Error('Error in deletings customer tags');
    }
  };

  processUpdateOfCustomerTag = async (pageID: number, updateCustTag: ICustomerTagCRUD[], client: Pool): Promise<IHTTPResult> => {
    let currentTag = '';
    try {
      if (updateCustTag.length > 0) {
        for (let i = 0; i < updateCustTag.length; i++) {
          const customerTagItem = updateCustTag[i];
          const { id, name, color } = customerTagItem;
          const isCustTagExists = await getCustomerTagByName(pageID, name, client);
          currentTag = name;
          if (isCustTagExists && !isCustTagExists.active) throw new Error('CUST_TAG_INACTIVE_STATE');
          await updateCustomerTag(pageID, id, name, color, client);
        }
        return { status: 200, value: 'tag_update_success' };
      }
    } catch (error) {
      const errorMessage = error?.message?.toString();
      return this.insertUpdateErrorResponse(errorMessage, currentTag, 'update_tag_error');
    }
  };

  processInsertOfCustomerTag = async (pageID: number, insertCustTag: ICustomerTagCRUD[], client: Pool): Promise<IHTTPResult> => {
    let currentTag = '';
    try {
      const tagInserted = [] as ICustomerTagCRUD[];
      if (insertCustTag.length > 0) {
        const insertTagLength = insertCustTag.length;
        const isTagsLimitReached = await this.getTagLimitReachedStatus(pageID, client, insertTagLength);
        if (!isTagsLimitReached?.status) {
          for (let i = 0; i < insertTagLength; i++) {
            const customerTagItem = insertCustTag[i];
            const { name, color } = customerTagItem;
            currentTag = name;
            const data = await insertCustomerTag(pageID, name, color, client);
            tagInserted.push(data);
          }
        } else {
          return { status: 403, value: 'tag_max_limit_message' };
        }
        const responseMessage = {
          message: 'tag_added_successfully',
          data: tagInserted,
        };
        return { status: 200, value: JSON.stringify(responseMessage) };
      }
    } catch (error) {
      const errorMessage = error?.message?.toString();
      return this.insertUpdateErrorResponse(errorMessage, currentTag, 'err_insert_tag');
    }
  };

  insertUpdateErrorResponse(errorMessage: string, currentTag: string, translateKey: string): IHTTPResult {
    if (errorMessage.includes('customer_tags_unique')) {
      const value = httpResultValueTranslate({
        isTranslateKeys: true,
        translateKeys: ['already_exists_different_value'],
        noTranslateMessage: `'${currentTag}'`,
      });
      return { status: 403, value };
    } else if (errorMessage.includes('CUST_TAG_INACTIVE_STATE')) {
      const value = httpResultValueTranslate({
        isTranslateKeys: true,
        translateKeys: ['customer_tag_inactive_state'],
        noTranslateMessage: `'${currentTag}'`,
      });
      return { status: 403, value };
    } else {
      const value = httpResultValueTranslate({
        isTranslateKeys: false,
        translateKeys: [translateKey],
        noTranslateMessage: null,
      });
      return { status: 403, value };
    }
  }

  performCustomerTagMappingOperation = async (pageID: number, tagOperations: { insertCustTag: ICustomerTagCRUD[]; deleteCustTag: ICustomerTagCRUD[] }): Promise<IHTTPResult[]> => {
    const responseMessage: IHTTPResult[] = [];
    const { insertCustTag, deleteCustTag } = tagOperations;
    const client = await PostgresHelper.execBeginBatchTransaction(PlusmarService.writerClient);
    const deleteResponse = await this.processDeleteOfCustomerMappingTag(pageID, deleteCustTag, client);
    const insertResponse = await this.processInsertOfCustomerMappingTag(pageID, insertCustTag, client);
    if (insertResponse?.status) responseMessage.push(insertResponse);
    if (deleteResponse?.status) responseMessage.push(deleteResponse);
    await PostgresHelper.execBatchCommitTransaction(client);
    return responseMessage;
  };

  processDeleteOfCustomerMappingTag = async (pageID: number, deleteCustTagMaping: ICustomerTagCRUD[], client: Pool): Promise<IHTTPResult> => {
    try {
      if (deleteCustTagMaping.length > 0) {
        for (let i = 0; i < deleteCustTagMaping.length; i++) {
          const customerTagMappingItem = deleteCustTagMaping[i];
          const { tagMappingID, id } = customerTagMappingItem;
          await deleteCustomerTagMapping(pageID, tagMappingID, id, client);
        }
        return { status: 200, value: 'Removed tags from customer successfully' };
      }
    } catch (error) {
      return { status: 403, value: 'Error in removing tag from customer' };
    }
  };

  processInsertOfCustomerMappingTag = async (pageID: number, insertCustMappingTag: ICustomerTagCRUD[], client: Pool): Promise<IHTTPResult> => {
    try {
      if (insertCustMappingTag.length > 0) {
        for (let i = 0; i < insertCustMappingTag.length; i++) {
          const customerTagMappingItem = insertCustMappingTag[i];
          const { id, customerID } = customerTagMappingItem;
          await insertCustomerMappingTag(pageID, id, customerID, client);
        }
        return { status: 200, value: 'Tags added to customer successfully' };
      }
    } catch (error) {
      return error.message.includes('customer_tag_mapping_unique')
        ? { status: 403, value: 'Tag already associated to customer' }
        : { status: 403, value: 'Error associating tags to customer' };
    }
  };

  async getTagLimitReachedStatus(pageID: number, client: Pool, insertCount: number): Promise<{ status: boolean; tagCount: number }> {
    const tagDataCount = await getCustomerTagCount(pageID, client);
    const totalCount = tagDataCount + insertCount;
    const response = {
      status: totalCount > 40 ? true : false,
      tagCount: tagDataCount,
    };
    return response;
  }

  async getCustomerAllTags(pageID: number): Promise<ICustomerTagCRUD[]> {
    return await getCustomerAllTags(pageID, PlusmarService.readerClient);
  }

  async updateCustomerAddressToCurrentOrder(pipeline: IFacebookPipelineModel, address: CustomerAddress): Promise<void> {
    const customerDetail = await getCustomerAudienceByID(PlusmarService.readerClient, pipeline.audience_id, pipeline.page_id);

    const addressObject = {
      customer_id: customerDetail.customer_id,
      purchase_order_id: pipeline.order_id,
      page_id: pipeline.page_id,
      name: address.name,
      phone_number: address.phone_number,
      location: address.location,
      is_confirm: true,
    } as CustomerShippingAddress;

    const shippingAddress = await getCustomerShippingAddressByOrder(PlusmarService.readerClient, customerDetail.customer_id, pipeline.page_id, pipeline.order_id);
    if (!isEmpty(shippingAddress)) {
      await updateCustomerShippingAddress(PlusmarService.writerClient, addressObject);
    } else {
      await addCustomerShippingAddress(PlusmarService.writerClient, addressObject);
    }
  }
  async updatePDPAConsentAcceptance(
    pageID: number,
    customerID: number,
    consents: {
      TERMS: boolean;
      PRIVACY: boolean;
      DATA_USE: boolean;
    },
  ): Promise<void> {
    await updatePDPAConsentAcceptance(PlusmarService.writerClient, customerID, pageID, consents);
  }

  updateUserProfile(platform) {
    const binding = {
      profile_pic: '',
      profile_pic_updated_at: getUTCTimestamps(),
    };
  }
  getCustomerIDByOrderID = async (pageID: number, orderID: number): Promise<number> => {
    return await getCustomerIDByOrderID(PlusmarService.writerClient, pageID, orderID);
  };
}

const seperateCustomerCRUDOperation = (customerTagData: ICustomerTagCRUD[]): ICustomerCrudOperation => {
  const updateCustTag = customerTagData?.filter((custTag) => custTag.type === 'UPDATE');
  const insertCustTag = customerTagData?.filter((custTag) => custTag.type === 'INSERT');
  const deleteCustTag = customerTagData?.filter((custTag) => custTag.type === 'DELETE');
  return {
    updateCustTag,
    insertCustTag,
    deleteCustTag,
  };
};
