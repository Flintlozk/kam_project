import * as plusmarHelper from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import * as data from '../../data/product';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { ProductCatergoryService } from './product-category.service';

jest.mock('../../data/product');
jest.mock('@reactor-room/itopplus-back-end-helpers');
jest.mock('@reactor-room/itopplus-back-end-helpers');

describe('ProductCategory Category update', () => {
  const productCategoryService = new ProductCatergoryService();
  const updateCategoryItemError = [{ id: 1185, name: 'deactMain', subCatID: -1, type: 'UPDATE' }];
  const categoryDataError = {
    id: 1286,
    page_id: 2,
    name: 'deactMain',
    sub_category_id: -1,
    active: false,
  };

  const updateCategoryItemSuccess = [{ id: 1185, name: 'prog update', subCatID: -1, type: 'UPDATE' }];

  const categoryDataSuccess = null;

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  test('update function processUpdateProductCategory error in inactive category', async () => {
    mock(data, 'getCategoryByName', await jest.fn().mockResolvedValue(categoryDataError));
    const spy = jest.spyOn(plusmarHelper, 'generateResponseMessage');
    spy.mockImplementation((dataParam) => '{"result":null,"transCode":"pro_cat_inactive_state"}');
    const result = await productCategoryService.processUpdateProductCategory(categoryDataError.page_id, PlusmarService.writerClient, updateCategoryItemError);
    expect(result).toEqual({ status: 403, value: '{"result":null,"transCode":"pro_cat_inactive_state"}' });
  });

  test('update function processUpdateProductCategory in category name success', async () => {
    mock(data, 'getCategoryByName', await jest.fn().mockResolvedValue(categoryDataSuccess));
    mock(data, 'executeUpdateCatSubCatName', await jest.fn().mockResolvedValue({ status: 200, value: 'cat_update_success' }));
    const spy = jest.spyOn(plusmarHelper, 'generateResponseMessage');
    spy.mockImplementation((dataParam) => '{"result":null,"transCode":"cat_update_success"}');
    const result = await productCategoryService.processUpdateProductCategory(2, PlusmarService.writerClient, updateCategoryItemSuccess);
    expect(result).toEqual({ status: 200, value: '{"result":null,"transCode":"cat_update_success"}' });
  });
});

describe('ProductCategory Sub-Category update', () => {
  const productCategoryService = new ProductCatergoryService();
  const updateSubCategoryItemError = [{ id: 1274, name: 'tpro0', subCatID: 1390, type: 'UPDATE' }];
  const categorySubDataError = {
    id: 1392,
    page_id: 2,
    name: 'tpro0',
    sub_category_id: 1274,
    active: false,
  };

  const updateSubCategoryItemSuccess = [{ id: 1274, name: 'tpro11', subCatID: 1390, type: 'UPDATE' }];

  const subCategoryDataSuccess = null;

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  test('update function processUpdateSubProductCategory error in inactive sub-category', async () => {
    mock(data, 'getCategoryByName', await jest.fn().mockResolvedValue(categorySubDataError));
    const spy = jest.spyOn(plusmarHelper, 'generateResponseMessage');
    spy.mockImplementation((dataParam) => '{"result":null,"transCode":"pro_sub_attr_inactive_state"}');
    const result = await productCategoryService.processUpdateProductCategory(categorySubDataError.page_id, PlusmarService.writerClient, updateSubCategoryItemError);
    expect(result).toEqual({ status: 403, value: '{"result":null,"transCode":"pro_sub_attr_inactive_state"}' });
  });

  test('update function processUpdateProductCategory in sub-category name success', async () => {
    mock(data, 'getCategoryByName', await jest.fn().mockResolvedValue(subCategoryDataSuccess));
    mock(data, 'executeUpdateCatSubCatName', await jest.fn().mockResolvedValue({ status: 200, value: 'pro_sub_attr_update_success' }));
    const spy = jest.spyOn(plusmarHelper, 'generateResponseMessage');
    spy.mockImplementation((dataParam) => '{"result":null,"transCode":"pro_sub_attr_update_success"}');
    const result = await productCategoryService.processUpdateSubCategory(2, PlusmarService.writerClient, updateSubCategoryItemSuccess);
    expect(result).toEqual({ status: 200, value: '{"result":null,"transCode":"pro_sub_attr_update_success"}' });
  });
});
