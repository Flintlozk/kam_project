import gql from 'graphql-tag';
import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
import { CRUD_MODE, IGQLFileSteam } from '@reactor-room/model-lib';

Joi.extend(JoiDate);

export interface IUpsertCompany {
  id?: number;
  selected: CustomerCompany[];
  updated: CustomerCompany[];
}

export interface CompanyMemeber {
  id: number;
  psid: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  line_user_id: string;
  totalrows: number;
  action_type?: CRUD_MODE;
}

export interface CustomerCompany {
  id: number;
  company_name: string;
  company_logo?: string;
  branch_name?: string;
  customers_amount?: string;
  totalrows?: number;
}

export interface CustomerCompanyFull {
  id: number;
  company_name: string;
  company_logo: string;
  branch_name: string;
  branch_id: string;
  tax_id: string;
  phone_number: string;
  email: string;
  fax: string;
  address: string;
  post_code: string;
  city: string;
  district: string;
  province: string;
  country: string;
  use_company_address: boolean;
  shipping_phone_number: string;
  shipping_email: string;
  shipping_fax: string;
  shipping_address: string;
  shipping: {
    post_code: string;
    city: string;
    district: string;
    province: string;
  };
  shipping_country: string;
  members: CompanyMemeber[];
}

export interface CustomerCompanyShippingInput {
  use_company_address: boolean;
  shipping_phone_number: string;
  shipping_email: string;
  shipping_fax: string;
  shipping_address: string;
  location: {
    post_code: string;
    city: string;
    district: string;
    province: string;
  };
  shipping_country: string;
}
export interface CustomerCompanyInfoInput {
  id: number;
  company_name: string;
  company_logo: string;
  company_logo_file?: IGQLFileSteam;
  branch_name: string;
  branch_id: string;
  tax_id: string;
  phone_number: string;
  email: string;
  fax: string;
  address: string;
  country: string;
  location: {
    post_code: string;
    city: string;
    district: string;
    province: string;
  };
}
export interface CustomerCompanyInputFull {
  info: CustomerCompanyInfoInput;
  shipping: CustomerCompanyShippingInput;
  stored_members: CompanyMemeber[];
  updated_members: CompanyMemeber[];
}

export interface MemebersFiltersInput {
  search: string;
  currentPage: number;
  pageSize: number;
  orderBy: string;
  orderMethod: string;
  social?: boolean[];
  id?: number;
}

export interface CustomerCompaniesFiltersInput {
  search: string;
  currentPage?: number;
  pageSize?: number;
  orderBy?: 'name' | 'branch_name' | 'customers_amount';
  orderMethod?: string;
}

export const CustomerCompaniesTypeDefs = gql`
  "Customer Companies Schema"
  type CompanyMemeber {
    id: Int
    psid: String
    first_name: String
    last_name: String
    profile_pic: String
    line_user_id: String
    totalrows: Int
  }

  type CustomerCompany {
    id: Int
    company_name: String
    company_logo: String
    branch_name: String
    customers_amount: String
    totalrows: Int
  }
  type CCShipping {
    city: String
    district: String
    province: String
    post_code: String
  }
  type CustomerCompanyFull {
    id: Int
    company_name: String
    company_logo: String
    branch_name: String
    branch_id: String
    tax_id: String
    phone_number: String
    email: String
    fax: String
    address: String
    post_code: String
    city: String
    district: String
    province: String
    country: String
    members: [CompanyMemeber]

    use_company_address: Boolean
    shipping_phone_number: String
    shipping_email: String
    shipping_fax: String
    shipping_address: String
    shipping_country: String
    shipping: CCShipping
  }

  input MemebersFiltersInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: String
    orderMethod: String
    social: [Boolean]
    id: ID
  }

  input CustomerCompaniesFiltersInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: String
    orderMethod: String
  }

  input MemberInput {
    id: Int
    psid: String
    first_name: String
    last_name: String
    profile_pic: String
    line_user_id: String
    totalrows: Int
  }

  input LocationInput {
    post_code: String
    city: String
    district: String
    province: String
  }

  input CustomerShippingLocationInput {
    post_code: String
    city: String
    district: String
    province: String
  }

  input CustomerInfoInput {
    id: ID
    company_name: String
    company_logo: String
    company_logo_file: Upload
    branch_name: String
    branch_id: String
    tax_id: String
    phone_number: String
    email: String
    fax: String
    address: String
    post_code: String
    country: String
    location: LocationInput
  }

  input CustomerShippingInput {
    use_company_address: Boolean
    shipping_phone_number: String
    shipping_email: String
    shipping_fax: String
    shipping_address: String
    shipping_post_code: String
    shipping_country: String
    location: CustomerShippingLocationInput
  }

  input CustomerCompanyFullInput {
    info: CustomerInfoInput
    shipping: CustomerShippingInput
    stored_members: [MemberInput]
    updated_members: [MemberInput]
  }

  extend type Query {
    getCompanyMembers(filters: MemebersFiltersInput): [CompanyMemeber]
    getCompanyMembersByCompanyID(filters: MemebersFiltersInput): [CompanyMemeber]
    getCustomerCompanies(filters: CustomerCompaniesFiltersInput): [CustomerCompany]
    getCustomerCompanyById(id: ID): CustomerCompanyFull
    getCustomerAssignedCompanyById(id: ID): [CustomerCompanyFull]
  }

  extend type Mutation {
    saveCustomerCompany(params: CustomerCompanyFullInput): HTTPResult
    updateCustomerCompany(params: CustomerCompanyFullInput): HTTPResult
    removeCustomerCompany(id: [Int]): HTTPResult
    addCompanyByCustomerId(id: Int, customer_company_id: Int): HTTPResult
    updateCompanyByCustomerId(id: Int, customer_company_id: Int): HTTPResult
  }
`;

export const companyMembersListResponse = {
  id: Joi.number().required(),
  first_name: Joi.string().allow(null).allow(''), // email: Joi.string().email({ minDomainSegments: 2 }),
  last_name: Joi.string().allow(null).allow(''),
  profile_pic: Joi.any(),
  psid: Joi.string().allow('').allow(null),
  line_user_id: Joi.string().allow('').allow(null),
  totalrows: Joi.number().allow(0).allow(null),
};

export const customerCompaniesListResponse = {
  id: Joi.number().required(),
  company_name: Joi.string().allow(null).allow(''),
  company_logo: Joi.string().allow(null).allow(''),
  branch_name: Joi.string().allow(null).allow(''),
  customers_amount: Joi.number().allow(0).allow(null),
  totalrows: Joi.number().allow(0).allow(null),
};

export const customerCompanyResponse = {
  id: Joi.number().required().allow(null),
  company_name: Joi.string().allow(null).allow(''),
  company_logo: Joi.string().allow(null).allow(''),
  branch_name: Joi.string().allow(null).allow(''),
  customers_amount: Joi.number().allow(0).allow(null),
  branch_id: Joi.string().allow(null).allow(''),
  tax_id: Joi.string().allow(null).allow(''),
  phone_number: Joi.string().allow(null).allow(''),
  email: Joi.string().allow(null).allow(''),
  fax: Joi.string().allow(null).allow(''),
  address: Joi.string().allow(null).allow(''),
  post_code: Joi.string().allow(null).allow(''),
  city: Joi.string().allow(null).allow(''),
  district: Joi.string().allow(null).allow(''),
  province: Joi.string().allow(null).allow(''),
  country: Joi.string().allow(null).allow(''),
  members: Joi.any(),
  use_company_address: Joi.boolean().allow(null),
  shipping_address: Joi.string().allow(null).allow(''),
  shipping_fax: Joi.string().allow(null).allow(''),
  shipping_email: Joi.string().allow(null).allow(''),
  shipping_phone_number: Joi.string().allow(null).allow(''),
  shipping: Joi.object({
    post_code: Joi.string().allow(null).allow(''),
    city: Joi.string().allow(null).allow(''),
    district: Joi.string().allow(null).allow(''),
    province: Joi.string().allow(null).allow(''),
  }),
  shipping_country: Joi.string().allow(null).allow(''),
};
