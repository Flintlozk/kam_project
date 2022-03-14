import { mock } from '../../test/mock';
import { DealService } from './deal.service';
import * as data from '../../data/deal/deal.data';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import { IHTTPResult } from '@reactor-room/model-lib';
import { IDealDetail, ResponseValue } from '@reactor-room/crm-models-lib';
import { disableExperimentalFragmentVariables } from '@apollo/client/core';
describe('test deal service ', () => {
  const writerClient = {
    readerClient: Pool,
  };
  const insertResponse: IHTTPResult = {
    status: 200,
    value: '1 75131e26-c9fd-446d-b2eb-893595479248',
  };
  const dealDetail: IDealDetail = {
    dealtitle: 'dealtitle',
    projectNumber: '123',
    startDate: '17/03/2021',
    endDate: '18/03/2021',
    advertiseBefore: false,
    paymentDetail: 'payment',
    productService: 'service',
    objective: 'objective',
    target: 'target',
    adsOptimizeFee: 'adsOpti',
    adsSpend: 'adsSpend',
    tagDealList: [3, 4, 5],
    noteDetail: 'note',
    uuidTask: '75131e26-c9fd-446d-b2eb-893595479248',
    accountExecutive: 'people1',
    projectManager: 'people2',
    headOfClient: 'people3',
    uuidDeal: '75131e26-c9fd-446d-b2eb-893595479248',
    dealId: 1,
  };
  const response: IHTTPResult = { status: 200, value: '75131e26-c9fd-446d-b2eb-893595479248' };
  const uuidDeal = { uuidDeal: '75131e26-c9fd-446d-b2eb-893595479248' };
  const insertDeal = { uuidDeal: '75131e26-c9fd-446d-b2eb-893595479248', uuidTask: '75131e26-c9fd-446d-b2eb-893595479248' };
  test('insert deal detail', async () => {
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({ writerClient }));
    mock(data, 'insertDealDetailByTask', jest.fn().mockResolvedValue(insertResponse));
    mock(data, 'insertTagDealByDealId', jest.fn().mockResolvedValue({}));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    const result = await DealService.insertDealDetailByTask(dealDetail, 1, 1);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(data.insertDealDetailByTask).toHaveBeenCalled();
    expect(data.insertTagDealByDealId).toHaveBeenCalledTimes(3);
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
    expect(result).toStrictEqual(response);
  });
  test('update deal detail', async () => {
    mock(PostgresHelper, 'execBeginBatchTransaction', jest.fn().mockResolvedValue({ writerClient }));
    mock(data, 'deleteTagDealByDealUuidId', jest.fn().mockResolvedValue({}));
    mock(data, 'insertTagDealByDealUuidId', jest.fn().mockResolvedValue({}));
    mock(data, 'updateDealDetailByUuidDeal', jest.fn().mockResolvedValue(response));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue({}));
    const result = await DealService.updateDealDetailByUuidDeal(dealDetail, 1, 1);
    expect(PostgresHelper.execBeginBatchTransaction).toHaveBeenCalled();
    expect(data.updateDealDetailByUuidDeal).toHaveBeenCalled();
    expect(data.insertTagDealByDealUuidId).toHaveBeenCalledTimes(3);
    expect(data.deleteTagDealByDealUuidId).toHaveBeenCalled();
    expect(PostgresHelper.execBatchCommitTransaction).toHaveBeenCalled();
    expect(result).toStrictEqual(response);
  });
  test('get deal detail', async () => {
    mock(data, 'getDealDetailByUuidDeal', jest.fn().mockResolvedValue({}));
    await DealService.getDealDetailByUuidDeal(uuidDeal, 1, 1);
    expect(data.getDealDetailByUuidDeal).toHaveBeenCalled();
  });
  test('get deal detail', async () => {
    mock(data, 'getDealDetailByUuidDeal', jest.fn().mockResolvedValue({}));
    await DealService.getDealDetailByUuidDeal(uuidDeal, 1, 1);
    expect(data.getDealDetailByUuidDeal).toHaveBeenCalled();
  });
  test('get tag owner', async () => {
    mock(data, 'getTagDealByOwner', jest.fn().mockResolvedValue({}));
    await DealService.getTagDealByOwner(1);
    expect(data.getTagDealByOwner).toHaveBeenCalled();
  });
  test('get tag deal', async () => {
    mock(data, 'getTagDealByDealId', jest.fn().mockResolvedValue({}));
    await DealService.getTagDealByDealId({ dealId: 1 }, 1);
    expect(data.getTagDealByDealId).toHaveBeenCalled();
  });
  test('get deal detail', async () => {
    mock(data, 'deleteDealDetailByUuidDeal', jest.fn().mockResolvedValue({}));
    await DealService.deleteDealDetailByUuidDeal(insertDeal, 1);
    expect(data.deleteDealDetailByUuidDeal).toHaveBeenCalled();
  });
  test('get project code', async () => {
    mock(data, 'getProjectCodeOfDeal', jest.fn().mockResolvedValue({}));
    await DealService.getProjectCodeOfDeal('', '75131e26-c9fd-446d-b2eb-893595479248', 1);
    expect(data.getProjectCodeOfDeal).toHaveBeenCalled();
  });
  test('insert dublicate deal', async () => {
    mock(data, 'getDealFromTask', jest.fn().mockResolvedValue({ dealId: '123' }));
    await expect(DealService.insertDealToTask(insertDeal, 1)).rejects.toThrow(ResponseValue.DEAL_ALREADY_HAVE_THIS_PROJECT);
    expect(data.getDealFromTask).toHaveBeenCalled();
  });
  test('insert dublicate deal', async () => {
    mock(data, 'getDealFromTask', jest.fn().mockResolvedValue(null));
    mock(data, 'insertDealToTask', jest.fn().mockResolvedValue({}));
    await DealService.insertDealToTask(insertDeal, 1);
    expect(data.getDealFromTask).toHaveBeenCalled();
    expect(data.insertDealToTask).toHaveBeenCalled();
  });
});
