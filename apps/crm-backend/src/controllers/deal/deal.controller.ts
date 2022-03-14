import {
  EnumAuthScope,
  IDealDetail,
  IDealDetailArg,
  IDealId,
  IFilterDealArg,
  IGQLContext,
  IHTTPResult,
  IInsertDealArg,
  IProjectCode,
  ITagDeal,
  ITagDealId,
  IUuidDeal,
} from '@reactor-room/crm-models-lib';
import { DealService } from '@reactor-room/crm-services-lib';
import { requireScope } from '../../domains/auth.domain';
import { validateResponseHTTPObject } from '../../schema/common';
import {
  getProjectCodeOfDealRequest,
  validategetDealDetailRequest,
  validateInsertDealDetailRequest,
  validateInsertDealToTaskRequest,
  validateResponseDealDetail,
  validateResponseProjectCodeOfDeal,
  validateResponseTagDeal,
  validateResponseTagDealByDealId,
  validateUpdateDealDetailRequest,
} from '../../schema/deal';
import { graphQLHandler } from '../graphql-handler';
@requireScope([EnumAuthScope.MEMBER])
class Deal {
  public static instance;
  public static Deal: Deal;
  public static getInstance() {
    if (!Deal.instance) Deal.instance = new Deal();
    return Deal.instance;
  }
  async insertDealDetailByTaskHandler(parent, args: IDealDetailArg, context: IGQLContext): Promise<IHTTPResult> {
    const dealDetail = validateInsertDealDetailRequest(args.message);
    return await DealService.insertDealDetailByTask(dealDetail, context.payload.userLoginData.userId, context.payload.userLoginData.ownerId);
  }
  async updateDealDetailByUuidDealHandler(parent, args: IDealDetailArg, context: IGQLContext): Promise<IHTTPResult> {
    const dealDetail = validateUpdateDealDetailRequest(args.message);
    return await DealService.updateDealDetailByUuidDeal(dealDetail, context.payload.userLoginData.userId, context.payload.userLoginData.ownerId);
  }
  async getDealDetailByUuidDealHandler(parent, args: IUuidDeal, context: IGQLContext): Promise<IDealDetail> {
    const uuidDeal = validategetDealDetailRequest(args);
    return await DealService.getDealDetailByUuidDeal(uuidDeal, context.payload.userLoginData.userId, context.payload.userLoginData.ownerId);
  }
  async getTagDealByOwnerHandler(parent, args, context: IGQLContext): Promise<ITagDeal[]> {
    return await DealService.getTagDealByOwner(context.payload.userLoginData.ownerId);
  }
  async getTagDealByDealIdHandler(parent, args: IDealId, context: IGQLContext): Promise<ITagDealId[]> {
    return await DealService.getTagDealByDealId(args, context.payload.userLoginData.ownerId);
  }
  async deleteDealDetailByUuidDealHandler(parent, args: IInsertDealArg, context: IGQLContext): Promise<IHTTPResult> {
    const deleteDeal = validateInsertDealToTaskRequest(args.message);
    return await DealService.deleteDealDetailByUuidDeal(deleteDeal, context.payload.userLoginData.ownerId);
  }
  async getProjectCodeOfDealHandler(parent, args: IFilterDealArg, context: IGQLContext): Promise<IProjectCode[]> {
    const { filter, uuidTask } = getProjectCodeOfDealRequest(args.message);
    return await DealService.getProjectCodeOfDeal(filter, uuidTask, context.payload.userLoginData.ownerId);
  }
  async insertDealToTaskHandler(parent, args: IInsertDealArg, context: IGQLContext): Promise<IHTTPResult> {
    const insertDeal = validateInsertDealToTaskRequest(args.message);
    return await DealService.insertDealToTask(insertDeal, context.payload.userLoginData.ownerId);
  }
}
const deal: Deal = Deal.getInstance();
export const dealResolver = {
  DealDetail: {
    tagDealList(parent: IDealDetail, arg, context: IGQLContext): Promise<ITagDealId[]> {
      return dealResolver.Query.getTagDealByDealId(parent, { dealId: parent.dealId }, context);
    },
  },
  Query: {
    getDealDetailByUuidDeal: graphQLHandler({
      handler: deal.getDealDetailByUuidDealHandler,
      validator: validateResponseDealDetail,
    }),
    getTagDealByOwner: graphQLHandler({
      handler: deal.getTagDealByOwnerHandler,
      validator: validateResponseTagDeal,
    }),
    getTagDealByDealId: graphQLHandler({
      handler: deal.getTagDealByDealIdHandler,
      validator: validateResponseTagDealByDealId,
    }),
    getProjectCodeOfDeal: graphQLHandler({
      handler: deal.getProjectCodeOfDealHandler,
      validator: validateResponseProjectCodeOfDeal,
    }),
  },
  Mutation: {
    insertDealDetailByTask: graphQLHandler({
      handler: deal.insertDealDetailByTaskHandler,
      validator: validateResponseHTTPObject,
    }),
    updateDealDetailByUuidDeal: graphQLHandler({
      handler: deal.updateDealDetailByUuidDealHandler,
      validator: validateResponseHTTPObject,
    }),
    deleteDealDetailByUuidDeal: graphQLHandler({
      handler: deal.deleteDealDetailByUuidDealHandler,
      validator: validateResponseHTTPObject,
    }),
    insertDealToTask: graphQLHandler({
      handler: deal.insertDealToTaskHandler,
      validator: validateResponseHTTPObject,
    }),
  },
};
