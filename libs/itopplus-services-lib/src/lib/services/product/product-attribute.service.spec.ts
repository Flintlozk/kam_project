import * as attrHelper from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { Pool } from 'pg';
import * as data from '../../data/product';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { ProductAttributeService } from './product-attribute.service';

jest.mock('../../data/product');
jest.mock('@reactor-room/itopplus-back-end-helpers');
describe('ProductAttribute attribute update', () => {
  const productAttributeService = new ProductAttributeService();
  const updateAttributeItemError = [{ id: 645, name: 'ken', subCatID: -1, type: 'UPDATE' }];
  const updateAttributeItemSuccess = [{ id: 645, name: 'fruit', subCatID: -1, type: 'UPDATE' }];
  const attributeDataError = { id: 643, page_id: 2, name: 'ken', active: false };

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  test('update function processUpdateAttribute error in inactive attribute', async () => {
    mock(data, 'getAttributeByName', await jest.fn().mockResolvedValue(attributeDataError));
    const spy = jest.spyOn(attrHelper, 'httpResultValueTranslate');
    const errorResponse = "{ isTranslateKeys: false, translateKeys: ['pro_attr_inactive_state'], noTranslateMessage: null }";
    spy.mockImplementation((dataParam) => errorResponse);
    const result = await productAttributeService.processUpdateAttribute(attributeDataError.page_id, PlusmarService.writerClient, updateAttributeItemError);
    expect(result).toEqual({ status: 403, value: errorResponse });
  });

  test('update function processUpdateAttribute in attribute name success', async () => {
    mock(data, 'getAttributeByName', await jest.fn().mockResolvedValue(null));
    mock(data, 'executeUpdateProductAttribName', await jest.fn().mockResolvedValue({ status: 200, value: 'pro_attr_update_success' }));
    const spy = jest.spyOn(attrHelper, 'httpResultValueTranslate');
    const successResponse = '{"isTranslateKeys":false,"translateKeys":["pro_attr_update_success"],"noTranslateMessage":null}';
    spy.mockImplementation((dataParam) => successResponse);
    const result = await productAttributeService.processUpdateAttribute(2, PlusmarService.writerClient, updateAttributeItemSuccess);
    expect(result).toEqual({ status: 200, value: successResponse });
  });
});

describe('ProductAttribute Sub-Attribute update', () => {
  const productAttributeService = new ProductAttributeService();
  const updateSubAttributeItemError = [{ id: 645, name: 'banana', subCatID: 748, type: 'UPDATE' }];
  const attributeSubDataError = { id: 750, page_id: 2, type_id: 645, name: 'banana', active: false };
  const updateSubCategoryItemSuccess = [{ id: 645, name: 'apple', subCatID: 749, type: 'UPDATE' }];

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  test('update function processUpdateSubAttribute error in inactive sub-category', async () => {
    mock(data, 'getSubAttributeByName', await jest.fn().mockResolvedValue(attributeSubDataError));
    const spy = jest.spyOn(attrHelper, 'httpResultValueTranslate');
    const errMessage = '{"isTranslateKeys":false,"translateKeys":["pro_sub_attr_inactive_state"],"noTranslateMessage":null}';
    spy.mockImplementation((dataParam) => errMessage);
    const result = await productAttributeService.processUpdateSubAttribute(attributeSubDataError.page_id, PlusmarService.writerClient, updateSubAttributeItemError);
    expect(result).toEqual({ status: 403, value: errMessage });
  });

  test('update function processUpdateSubAttribute update sub-category', async () => {
    mock(data, 'getSubAttributeByName', await jest.fn().mockResolvedValue(null));
    const spy = jest.spyOn(attrHelper, 'httpResultValueTranslate');
    const successMessage = '"isTranslateKeys":false,"translateKeys":["pro_sub_attr_success"],"noTranslateMessage":null}';
    spy.mockImplementation((dataParam) => successMessage);
    const result = await productAttributeService.processUpdateSubAttribute(attributeSubDataError.page_id, PlusmarService.writerClient, updateSubAttributeItemError);
    expect(result).toEqual({ status: 200, value: successMessage });
  });
});
