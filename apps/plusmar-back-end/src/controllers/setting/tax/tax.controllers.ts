import { IHTTPResult } from '@reactor-room/model-lib';
import type { IGQLContext, IPayload, ITaxArg, ITaxModel } from '@reactor-room/itopplus-model-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { TaxService } from '@reactor-room/itopplus-services-lib';
import { requireLogin } from '@reactor-room/itopplus-services-lib';
import { requireAdmin } from '../../../domains/plusmar';
import { validateRequestPageID, validateResponseHTTPObject } from '../../../schema/common';
import { validateTaxInputWithIDValidate, validateTaxResponse, validateUpdateTaxStatusInput } from '../../../schema/setting';
import { graphQLHandler } from '../../graphql-handler';

class Tax {
  constructor() {
    Tax.taxService = new TaxService();
  }
  public static instance;
  public static taxService: TaxService;
  public static getInstance() {
    if (!Tax.instance) Tax.instance = new Tax();
    return Tax.instance;
  }

  //Muatation
  @requireLogin([EnumAuthScope.SOCIAL])
  async createTaxHandler(parent, arg: ITaxArg, context: IGQLContext): Promise<IHTTPResult> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Tax.taxService.createTax(pageID);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireAdmin
  async updateTaxHandler(parent, arg: ITaxArg, context: IGQLContext): Promise<IHTTPResult> {
    const { id, taxInputData } = validateTaxInputWithIDValidate<ITaxArg>(arg);
    return await Tax.taxService.updateTax(id, taxInputData);
  }

  @requireLogin([EnumAuthScope.SOCIAL])
  @requireAdmin
  async updateTaxStatusHandler(parent, arg: ITaxArg, context: IGQLContext): Promise<IHTTPResult> {
    const { id, status } = validateUpdateTaxStatusInput<ITaxArg>(arg);
    return await Tax.taxService.updateTaxStatus(id, status);
  }

  //Query
  @requireLogin([EnumAuthScope.SOCIAL])
  async getTaxByPageIDHandler(parent, arg: ITaxArg, context: IGQLContext): Promise<ITaxModel> {
    const { pageID } = validateRequestPageID<IPayload>(context.payload);
    return await Tax.taxService.getTaxByPageID(pageID);
  }
}

const tax: Tax = Tax.getInstance();
export const taxResolver = {
  Query: {
    getTaxByPageID: graphQLHandler({
      handler: tax.getTaxByPageIDHandler,
      validator: validateTaxResponse,
    }),
  },
  Mutation: {
    createTax: graphQLHandler({
      handler: tax.createTaxHandler,
      validator: validateResponseHTTPObject,
    }),
    updateTax: graphQLHandler({
      handler: tax.updateTaxHandler,
      validator: validateResponseHTTPObject,
    }),
    updateTaxStatus: graphQLHandler({
      handler: tax.updateTaxStatusHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
