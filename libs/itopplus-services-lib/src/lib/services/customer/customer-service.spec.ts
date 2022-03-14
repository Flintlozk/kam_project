import * as custHelper from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { CRUD_MODE } from '@reactor-room/model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { CustomerService } from './customer.service';

jest.mock('../../data');
jest.mock('@reactor-room/itopplus-back-end-helpers');
const pageID = 2;

describe('Customer tag update update processUpdateOfCustomerTag', () => {
  const customerService = new CustomerService();
  const updateCustTagInactiveError = [{ id: 329, name: 'MolTag', color: 'CODE_FF7821', type: CRUD_MODE.UPDATE }];
  const updateCustTagExistsError = [{ id: 329, name: 'LolTag', color: 'CODE_FF7821', type: CRUD_MODE.UPDATE }];
  const updateCustTagOtherError = [{ id: 329, name: 'OtherTag', color: 'CODE_FF7821', type: CRUD_MODE.UPDATE }];
  const updateCustTagSuccess = [{ id: 329, name: 'SuccessTag', color: 'CODE_FF7821', type: CRUD_MODE.UPDATE }];
  const custTagDataInactiveError = {
    id: 373,
    page_id: '2',
    name: 'MolTag',
    color: 'CODE_FF7821',
    active: false,
  };

  const custTagDataExistsError = {
    id: 372,
    page_id: '2',
    name: 'LolTag',
    color: 'CODE_62BD4F',
    active: true,
  };

  const updatecustomerItemSuccess = [{ id: 1185, name: 'prog update', subCatID: -1, type: 'UPDATE' }];

  const customerDataSuccess = null;

  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  test('update function processUpdateOfCustomerTag error in inactive customer', async () => {
    mock(data, 'getCustomerTagByName', await jest.fn().mockResolvedValue(custTagDataInactiveError));
    const errInactive = '"isTranslateKeys":true,"translateKeys":["customer_tag_inactive_state"],"noTranslateMessage":"\'MolTag\'"}';
    const spy = jest.spyOn(custHelper, 'httpResultValueTranslate');
    spy.mockImplementation((dataParam) => errInactive);
    const result = await customerService.processUpdateOfCustomerTag(pageID, updateCustTagInactiveError, PlusmarService.writerClient);
    expect(result).toEqual({ status: 403, value: errInactive });
  });

  test('update function processUpdateOfCustomerTag error in already exists customer', async () => {
    mock(data, 'getCustomerTagByName', await jest.fn().mockResolvedValue(custTagDataExistsError));
    mock(data, 'updateCustomerTag', jest.fn().mockRejectedValue(new Error('customer_tags_unique')));
    const errInactive = '{"isTranslateKeys":true,"translateKeys":["already_exists_different_value"],"noTranslateMessage":"\'LolTag\'"}';
    const spy = jest.spyOn(custHelper, 'httpResultValueTranslate');
    spy.mockImplementation((dataParam) => errInactive);
    const result = await customerService.processUpdateOfCustomerTag(pageID, updateCustTagExistsError, PlusmarService.writerClient);
    expect(result).toEqual({ status: 403, value: errInactive });
  });

  test('update function processUpdateOfCustomerTag error in update customer', async () => {
    mock(data, 'getCustomerTagByName', await jest.fn().mockResolvedValue(custTagDataExistsError));
    mock(data, 'updateCustomerTag', jest.fn().mockRejectedValue(new Error('other error')));
    const errInactive = '{"isTranslateKeys":true,"translateKeys":["err_insert_tag"],"noTranslateMessage":"\'LolTag\'"}';
    const spy = jest.spyOn(custHelper, 'httpResultValueTranslate');
    spy.mockImplementation((dataParam) => errInactive);
    const result = await customerService.processUpdateOfCustomerTag(pageID, updateCustTagOtherError, PlusmarService.writerClient);
    expect(result).toEqual({ status: 403, value: errInactive });
  });

  test('update function processUpdateOfCustomerTag success', async () => {
    mock(data, 'getCustomerTagByName', await jest.fn().mockResolvedValue(null));
    mock(data, 'updateCustomerTag', await jest.fn().mockResolvedValue(null));
    const result = await customerService.processUpdateOfCustomerTag(pageID, updateCustTagSuccess, PlusmarService.writerClient);
    expect(result).toEqual({ status: 200, value: 'tag_update_success' });
  });

  test('getPreviousAudienceIDbyCustomerID', async () => {
    mock(data, 'getPreviousAudienceIDbyCustomerID', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await customerService.getPreviousAudienceIDbyCustomerID(1, 2, 3);
    expect(result).toEqual([{ id: 1 }]);
    expect(data.getPreviousAudienceIDbyCustomerID).toHaveBeenCalled();
  });
});

const getCustomerToUpdate = () => {
  return {
    id: '452',
    first_name: 'Kent',
    last_name: 'Wynn',
    email: 'e4411ss4@gmail.com',
    phone_number: '0999999988',
    profile_pic: 'https://platform-lookaside.fbsbx.com/platform/profilepic/?psid=3744469468914121&width=1024&ext=1603867714&hash=AeS9MQNRjqvWW1b7',
    location: {
      address: 'a33388',
      district: '',
      province: '',
      city: '',
      post_code: '',
    },
    notes: 'dffsdfs',
    social: {
      Facebook: 'err45454aaaaa',
      Line: '',
      Instagram: '',
      Twitter: '',
      Google: '',
      Youtube: '',
    },
  };
};

describe('Customer notes', () => {
  const customerService = new CustomerService();
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));

  test('upsertNote', async () => {
    mock(data, 'upsertNote', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await customerService.upsertNote({ id: 1, note: '', name: '' }, 1, 1);
    expect(result).toEqual(undefined);
    expect(data.upsertNote).toHaveBeenCalled();
  });

  test('removeNote', async () => {
    mock(data, 'removeNote', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await customerService.removeNote({ id: 1, note: '', name: '' }, 1);
    expect(result).toEqual(undefined);
    expect(data.removeNote).toHaveBeenCalled();
  });

  test('getNotes', async () => {
    mock(data, 'getNotes', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await customerService.getNotes(1, 1, 1);
    expect(result).toEqual([{ id: 1 }]);
    expect(data.getNotes).toHaveBeenCalled();
  });
});
/*
describe('Customer Service', () => {
  test('Update customer by form', async () => {
    const pageID = 2;
    const customerData = getCustomerToUpdate();
    const id = +customerData.id;
    mock(PostgresHelper, 'execBatchTransaction', jest.fn().mockResolvedValue(new Pool()));
    mock(data, 'updateCustomerByForm', jest.fn().mockResolvedValue({ status: 200, value: true } as IHTTPResult));
    mock(PostgresHelper, 'execBatchCommitTransaction', jest.fn().mockResolvedValue(true));
    const result = await customerService.updateCustomerByForm(id, customerData, pageID);

    expect(result).toEqual({ status: 200, value: true });
  });
});

*/
