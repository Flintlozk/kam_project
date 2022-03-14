import { IDealDetail, IDealId, IHTTPResult, IInsertDeal, IProjectCode, ITagDeal, ITagDealId, IUuidDeal, ResponseValue } from '@reactor-room/crm-models-lib';
import { CrmService } from '../../services/crmservice.class';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import {
  deleteDealDetailByUuidDeal,
  deleteTagDealByDealUuidId,
  getDealDetailByUuidDeal,
  getDealFromTask,
  getProjectCodeOfDeal,
  getTagDealByDealId,
  getTagDealByOwner,
  insertDealDetailByTask,
  insertDealToTask,
  insertTagDealByDealId,
  insertTagDealByDealUuidId,
  updateDealDetailByUuidDeal,
} from '../../data/deal';

export class DealService {
  constructor() {}
  public static insertDealDetailByTask = async (dealDetail: IDealDetail, userId: number, ownerId: number): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
    const insertResponse = await insertDealDetailByTask(client, dealDetail, userId, ownerId);
    const response = insertResponse.value.split(' ');
    for (const tagDealId of dealDetail.tagDealList) {
      await insertTagDealByDealId(client, response[0], tagDealId, ownerId);
    }
    await PostgresHelper.execBatchCommitTransaction(client);
    return { status: 200, value: response[1] };
  };
  public static updateDealDetailByUuidDeal = async (dealDetail: IDealDetail, userId: number, ownerId: number): Promise<IHTTPResult> => {
    const client = await PostgresHelper.execBeginBatchTransaction(CrmService.writerClient);
    await deleteTagDealByDealUuidId(client, dealDetail.uuidDeal, ownerId);
    for (const tagDealId of dealDetail.tagDealList) {
      await insertTagDealByDealUuidId(client, dealDetail.uuidDeal, tagDealId, ownerId);
    }
    const updateResponse = await updateDealDetailByUuidDeal(CrmService.writerClient, dealDetail, userId, ownerId);
    await PostgresHelper.execBatchCommitTransaction(client);
    return updateResponse;
  };
  public static getDealDetailByUuidDeal = async (uuidDeal: IUuidDeal, userId: number, ownerId: number): Promise<IDealDetail> => {
    return await getDealDetailByUuidDeal(CrmService.readerClient, uuidDeal, userId, ownerId);
  };
  public static getTagDealByOwner = async (ownerId: number): Promise<ITagDeal[]> => {
    return await getTagDealByOwner(CrmService.readerClient, ownerId);
  };
  public static getTagDealByDealId = async (dealId: IDealId, ownerId: number): Promise<ITagDealId[]> => {
    return await getTagDealByDealId(CrmService.readerClient, dealId, ownerId);
  };
  public static deleteDealDetailByUuidDeal = async (dealId: IInsertDeal, ownerId: number): Promise<IHTTPResult> => {
    return await deleteDealDetailByUuidDeal(CrmService.readerClient, dealId, ownerId);
  };
  public static getProjectCodeOfDeal = async (filter: string, uuidTask, ownerId): Promise<IProjectCode[]> => {
    return await getProjectCodeOfDeal(CrmService.readerClient, filter, uuidTask, ownerId);
  };
  public static insertDealToTask = async (insertDeal: IInsertDeal, ownerId: number): Promise<IHTTPResult> => {
    const project = await getDealFromTask(CrmService.readerClient, insertDeal, ownerId);
    if (project) {
      throw Error(ResponseValue.DEAL_ALREADY_HAVE_THIS_PROJECT);
    }
    return await insertDealToTask(CrmService.readerClient, insertDeal, ownerId);
  };
}
