import * as custHelper from '@reactor-room/itopplus-back-end-helpers';
import { PostgresHelper } from '@reactor-room/itopplus-back-end-helpers';
import { CRUD_MODE } from '@reactor-room/model-lib';
import { Pool } from 'pg';
import * as data from '../../data';
import { mock } from '../../test/mock';
import { PlusmarService } from '../plusmarservice.class';
import { CompanyService } from './company.service';

jest.mock('../../data');
jest.mock('@reactor-room/itopplus-back-end-helpers');
const pageID = 2;

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

describe('Customer companies', () => {
  const companyService = new CompanyService();
  mock(PostgresHelper, 'execQuery', jest.fn().mockResolvedValue(new Pool()));
  const filtersInput = { search: '', currentPage: 1, pageSize: 10, orderBy: 'company_name', orderMethod: 'asc', social: [true, true] };
  const newCompany = {
    info: {
      id: 1,
      company_name: 'string;',
      company_logo: 'string;',
      branch_name: 'string;',
      branch_id: 'string;',
      tax_id: 'string;',
      phone_number: 'string;',
      email: 'string;',
      fax: 'string;',
      address: 'string;',
      country: 'string;',
      location: {
        post_code: 'string;',
        city: 'string;',
        district: 'string;',
        province: 'string;',
      },
    },
    shipping: {
      use_company_address: true,
      shipping_phone_number: 'string;',
      shipping_email: 'string;',
      shipping_fax: 'string;',
      shipping_address: 'string;',
      location: {
        post_code: 'string;',
        city: 'string;',
        district: 'string;',
        province: 'string;',
      },
      shipping_country: 'string;',
    },
    stored_members: [
      {
        id: 1,
        psid: 'string;',
        first_name: 'string;',
        last_name: 'string;',
        profile_pic: 'string;',
        line_user_id: 'string;',
        totalrows: 1,
      },
    ],
    updated_members: [
      {
        id: 2,
        psid: 'string;',
        first_name: 'string;',
        last_name: 'string;',
        profile_pic: 'string;',
        line_user_id: 'string;',
        totalrows: 1,
      },
    ],
  };
  test('getCompanyMembers', async () => {
    mock(data, 'getCompanyMembers', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.getCompanyMembers(filtersInput, 340);
    expect(result).toEqual([{ id: 1 }]);
    expect(data.getCompanyMembers).toHaveBeenCalled();
  });

  test('getCompanyMembersByCompanyID', async () => {
    mock(data, 'getCompanyMembersByCompanyID', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.getCompanyMembersByCompanyID(filtersInput, 340);
    expect(result).toEqual([{ id: 1 }]);
    expect(data.getCompanyMembersByCompanyID).toHaveBeenCalled();
  });

  test('getCustomerCompanies', async () => {
    mock(data, 'getCustomerCompanies', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.getCustomerCompanies(filtersInput, 340);
    expect(result).toEqual([{ id: 1 }]);
    expect(data.getCustomerCompanies).toHaveBeenCalled();
  });

  test('getCustomerCompanyById', async () => {
    mock(data, 'getCustomerCompanyById', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.getCustomerCompanyById(1, 340);
    expect(result).toEqual([{ id: 1 }]);
    expect(data.getCustomerCompanyById).toHaveBeenCalled();
  });

  test('saveCustomerCompany fail', async () => {
    const uuid = 'uuid-uuid';
    mock(data, 'saveCustomerCompany', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.saveCustomerCompany(newCompany, 2, 'bucket', uuid);
    expect(result).toEqual({ status: 403, value: 'Save fail' });
    expect(data.saveCustomerCompany).toHaveBeenCalled();
  });

  test('updateCustomerCompany fail', async () => {
    const uuid = 'uuid-uuid';

    mock(data, 'updateCustomerCompany', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.updateCustomerCompany(newCompany, 2, 'bucket', uuid);
    expect(result).toEqual({ status: 403, value: 'Update fail' });
    expect(data.updateCustomerCompany).toHaveBeenCalled();
  });

  test('saveCustomerCompany success', async () => {
    const uuid = 'uuid-uuid';
    mock(data, 'saveCustomerCompany', await jest.fn().mockResolvedValue({ id: 1 }));
    const result = await companyService.saveCustomerCompany(newCompany, 2, 'bucket', uuid);
    expect(result).toEqual({ status: 200, value: 'Saved' });
    expect(data.saveCustomerCompany).toHaveBeenCalled();
  });

  test('updateCustomerCompany success', async () => {
    const uuid = 'uuid-uuid';
    mock(data, 'updateCustomerCompany', await jest.fn().mockResolvedValue({ id: 1 }));
    const result = await companyService.updateCustomerCompany(newCompany, 2, 'bucket', uuid);
    expect(result).toEqual({ status: 200, value: 'Updated' });
    expect(data.updateCustomerCompany).toHaveBeenCalled();
  });

  test('removeCustomerCompany', async () => {
    mock(data, 'removeCustomerCompany', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.removeCustomerCompany([1], 340);
    expect(result).toEqual({ status: 200, value: 'Removed' });
    expect(data.removeCustomerCompany).toHaveBeenCalled();
  });

  test('updateCompanyByCustomerId', async () => {
    mock(data, 'updateCompanyByCustomerId', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.updateCompanyByCustomerId(1, 2, 3);
    expect(result).toEqual({ status: 200, value: 'Updated' });
    expect(data.updateCompanyByCustomerId).toHaveBeenCalled();
  });

  test('addCompanyByCustomerId', async () => {
    mock(data, 'addCompanyByCustomerId', await jest.fn().mockResolvedValue([{ id: 1 }]));
    const result = await companyService.addCompanyByCustomerId(1, [1, 2, 3], 3);
    expect(result).toEqual({ status: 200, value: 'Added' });
    expect(data.addCompanyByCustomerId).toHaveBeenCalled();
  });
});
