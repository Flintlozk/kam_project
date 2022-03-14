import type { IDObject, IHTTPResult } from '@reactor-room/model-lib';
import { requireScope } from '@reactor-room/itopplus-services-lib';
import {
  CustomerOrders,
  EnumAuthScope,
  IArgsCRUDCustomerTag,
  IArgsTableCommonFilter,
  ICustomerNote,
  ICustomerTagCRUD,
  ICustomerTemp,
  ICustomerUpdateInfoInput,
  IGQLContext,
  RemoveUserResponse,
} from '@reactor-room/itopplus-model-lib';
import { CustomerService } from '@reactor-room/itopplus-services-lib';
import { validateIDNumberObject, validateResponseHTTPArray, validateResponseHTTPObject } from '../../schema/common';
import {
  validateAudienceIDListResponse,
  validateCrudCustomerTagRequest,
  validateCustomerAllTagsResponse,
  validateCustomerTagByPageByIDResponse,
  validateGetCustomerTagResponse,
  validateRequestUpdateCustomerByForm,
  validateResponseCustomer,
  validateResponseCustomerNotes,
  validateResponseCustomerOrders,
  validateResponseNewCustomer,
  validateUpdateCustomerReply,
} from '../../schema/customer';
import { graphQLHandler } from '../graphql-handler';

@requireScope([EnumAuthScope.SOCIAL])
class Customer {
  public static instance;
  public static customerService: CustomerService;
  public static getInstance() {
    if (!Customer.instance) Customer.instance = new Customer();
    return Customer.instance;
  }

  constructor() {
    Customer.customerService = new CustomerService();
  }

  async getCustomersHandler(parent, args, context: IGQLContext): Promise<ICustomerTemp[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    const data = await Customer.customerService.getCustomers(filters, pageID);
    return data;
  }

  async getCustomerByIdHandler(parent, args, context: IGQLContext): Promise<ICustomerTemp> {
    const { pageID } = context.payload;
    const data = await Customer.customerService.getCustomerByID(args.id, pageID);
    return data;
  }

  async getCustomerTagByPageByIDHandler(parent, args, context: IGQLContext): Promise<ICustomerTagCRUD[]> {
    const { id } = validateIDNumberObject(args);
    const { pageID } = context.payload;
    return await Customer.customerService.getCustomerTagByPageByID(id, pageID);
  }

  async getCustomerOrdersByIdHandler(parent, args, context: IGQLContext): Promise<CustomerOrders[]> {
    const { pageID } = context.payload;
    return await Customer.customerService.getCustomerOrdersById(args.filters, pageID);
  }

  async updateCustomerHandler(parent, args, context: IGQLContext): Promise<ICustomerTemp> {
    const { customer } = args;
    const { pageID, name, userID } = context.payload;
    // TODO : Garrett used same update method for webhook we must sperate function for save with logging and webhook
    return await Customer.customerService.update(customer.id, context.payload.page.fb_page_id, pageID, '', true);
  }

  async updateCustomerByFormHandler(parent, args: { customer: ICustomerUpdateInfoInput }, context: IGQLContext): Promise<IHTTPResult> {
    const { customer } = validateRequestUpdateCustomerByForm(args);
    const { pageID } = context.payload;
    return await Customer.customerService.updateCustomerByForm(customer, pageID);
  }

  async removeCustomerHandler(parent, args, context: IGQLContext): Promise<RemoveUserResponse> {
    const { pageID, name, userID } = context.payload;
    return await Customer.customerService.removeCustomer(args.id, pageID, name, userID);
  }

  async blockCustomerHandler(parent, args, context: IGQLContext): Promise<RemoveUserResponse> {
    const { pageID, name, userID } = context.payload;
    return await Customer.customerService.blockCustomer(args.id, pageID, name, userID);
  }

  async unblockCustomerHandler(parent, args, context: IGQLContext): Promise<RemoveUserResponse> {
    const { pageID, name, userID } = context.payload;
    return await Customer.customerService.unblockCustomer(args.id, pageID, name, userID);
  }

  async createNewCustomerHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { params } = args;
    const { pageID, name, userID } = context.payload;
    await Customer.customerService.createNewCustomer(params, pageID, name, userID);
    return { status: 200, value: 'SUCCESS' } as IHTTPResult;
  }

  async upsertNoteHandler(parent, { params }: { params: ICustomerNote }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID, userID } = context.payload;
    await Customer.customerService.upsertNote(params, pageID, userID);
    return { status: 200, value: 'SUCCESS' } as IHTTPResult;
  }

  async removeNoteHandler(parent, { params }: { params: ICustomerNote }, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = context.payload;
    await Customer.customerService.removeNote(params, pageID);
    return { status: 200, value: 'SUCCESS' } as IHTTPResult;
  }

  async getNotesHandler(parent, { id }: { id: number }, context: IGQLContext): Promise<ICustomerNote[]> {
    const { pageID, userID } = context.payload;
    return await Customer.customerService.getNotes(pageID, userID, id);
  }

  async getCustomerTagsHandler(parent, args: IArgsTableCommonFilter, context: IGQLContext): Promise<ICustomerTagCRUD[]> {
    const { filters } = args;
    const { pageID } = context.payload;
    const data = await Customer.customerService.getCustomerTags(filters, pageID);
    return data;
  }

  async getCustomerAllTagsHandler(parent, args, context: IGQLContext): Promise<ICustomerTagCRUD[]> {
    const { pageID } = context.payload;
    const data = await Customer.customerService.getCustomerAllTags(pageID);
    return data;
  }

  async crudCustomerTagDataHandler(parent, args: IArgsCRUDCustomerTag, context: IGQLContext): Promise<IHTTPResult[]> {
    const { customerTagData, operationType } = validateCrudCustomerTagRequest(args);
    const { pageID } = context.payload;
    const response = await Customer.customerService.crudCustomerTagData(pageID, customerTagData, operationType);
    return response;
  }
  //TODO: updateCustomer Can reply to False the fetch audience

  async updateCustomerCanReplyHandler(parent, args, context: IGQLContext): Promise<IHTTPResult> {
    const { canReply, id } = validateUpdateCustomerReply(args.params);
    const { pageID } = context.payload;
    await Customer.customerService.updateCustomerCanReply(canReply, id, pageID);
    return { status: 200, value: '' } as IHTTPResult;
  }

  async getNextAudienceIDbyCustomerIDHandler(parent, { customerID, index }, context: IGQLContext): Promise<IDObject[]> {
    const { pageID } = context.payload;
    return await Customer.customerService.getPreviousAudienceIDbyCustomerID(customerID, index, pageID);
  }
}
const customerObj: Customer = Customer.getInstance();
export const customerResolver = {
  Query: {
    getCustomers: graphQLHandler({
      handler: customerObj.getCustomersHandler,
      validator: validateResponseCustomer,
    }),
    getCustomerByID: graphQLHandler({
      handler: customerObj.getCustomerByIdHandler,
      validator: validateResponseCustomer,
    }),
    getCustomerOrdersById: graphQLHandler({
      handler: customerObj.getCustomerOrdersByIdHandler,
      validator: validateResponseCustomerOrders,
    }),
    getCustomerTags: graphQLHandler({
      handler: customerObj.getCustomerTagsHandler,
      validator: validateGetCustomerTagResponse,
    }),
    getCustomerTagByPageByID: graphQLHandler({
      handler: customerObj.getCustomerTagByPageByIDHandler,
      validator: validateCustomerTagByPageByIDResponse,
    }),
    getCustomerAllTags: graphQLHandler({
      handler: customerObj.getCustomerAllTagsHandler,
      validator: validateCustomerAllTagsResponse,
    }),
    getPreviousAudienceIDbyCustomerID: graphQLHandler({
      handler: customerObj.getNextAudienceIDbyCustomerIDHandler,
      validator: validateAudienceIDListResponse,
    }),
    getNotes: graphQLHandler({
      handler: customerObj.getNotesHandler,
      validator: validateResponseCustomerNotes,
    }),
  },
  Mutation: {
    removeCustomer: graphQLHandler({
      handler: customerObj.removeCustomerHandler,
      validator: validateResponseCustomer,
    }),
    blockCustomer: graphQLHandler({
      handler: customerObj.blockCustomerHandler,
      validator: validateResponseCustomer,
    }),
    unblockCustomer: graphQLHandler({
      handler: customerObj.unblockCustomerHandler,
      validator: validateResponseCustomer,
    }),
    updateCustomer: graphQLHandler({
      handler: customerObj.updateCustomerHandler,
      validator: validateResponseCustomer,
    }),
    createNewCustomer: graphQLHandler({
      handler: customerObj.createNewCustomerHandler,
      validator: validateResponseNewCustomer,
    }),
    upsertNote: graphQLHandler({
      handler: customerObj.upsertNoteHandler,
      validator: validateResponseHTTPObject,
    }),
    removeNote: graphQLHandler({
      handler: customerObj.removeNoteHandler,
      validator: validateResponseHTTPObject,
    }),
    crudCustomerTagData: graphQLHandler({
      handler: customerObj.crudCustomerTagDataHandler,
      validator: validateResponseHTTPArray,
    }),
    updateCustomerCanReply: graphQLHandler({
      handler: customerObj.updateCustomerCanReplyHandler,
      validator: validateResponseCustomer,
    }),
    updateCustomerByForm: graphQLHandler({
      handler: customerObj.updateCustomerByFormHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
