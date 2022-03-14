import gql from 'graphql-tag';

export const CustomerTypeDefs = gql`
  "Customer Schema"
  type CustomerModel {
    id: String
    first_name: String
    last_name: String
    psid: String
    nickname: String
    notes: String
    email: String
    location: CustomerLocationModel
    phone_number: String
    customer_type: String
    profile_pic: String
    social: CustomerSocialModel
    Facebook: CustomerFacebookModel
    tags: [CustomerTagModel]
    active: Boolean
    blocked: Boolean
    totalrows: Int
    created_at: Date
    updated_at: Date
    deleted_at: Date
    platform: String
    aliases: String
  }

  type CustomerLocationModel {
    address: String
    district: String
    province: String
    city: String
    amphoe: String
    post_code: String
    country: String
  }

  type CustomerSocialModel {
    Facebook: String
    Line: String
    Instagram: String
    Twitter: String
    Google: String
    Youtube: String
  }

  type CustomerFacebookModel {
    PSID: String
    ASID: String
    pageID: String
    first_name: String
    last_name: String
    nickname: String
    email: String
    profile_pic: String
    accessToken: String
    pageAccessToken: String
  }

  type AudienceListIDByCustomer {
    id: Int
  }

  type NewUserResponse {
    status: Int
    value: String
  }

  type RemoveUserResponse {
    id: String
    status: Int
    value: String
  }

  type CustomerOrdersModel {
    id: Int
    total_price: String
    created_at: String
    po_status: String
    a_status: String
    payment_type: String
    totalrows: Int
  }

  type Note {
    id: Int
    note: String
    name: String
    updated_at: Date
  }

  input CustomerFilterTagsInput {
    id: Int
    name: String
  }

  input CustomerFiltersInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: [String]
    orderMethod: String
    customer_tag: Int
    exportAllRows: Boolean
    noTag: Boolean
    tags: [CustomerFilterTagsInput]
  }

  input CustomerOrdersFilters {
    id: Int
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: String
    orderMethod: String
  }

  input CustomerFacebookInput {
    PSID: String
    ASID: String
    pageID: String
    first_name: String
    last_name: String
    nickname: String
    email: String
    profile_pic: String
    accessToken: String
    pageAccessToken: String
  }

  input CustomerIdInput {
    id: String
  }

  input CustomerSocialInput {
    Facebook: String
    Line: String
    Instagram: String
    Twitter: String
    Google: String
    Youtube: String
  }

  input CustomerCompanyInput {
    id: Int
    company_name: String
  }

  input CustomerCompanyUpdateInput {
    selected: [CustomerCompanyInput]
    updated: [CustomerCompanyInput]
  }

  input CustomerModelInput {
    id: String
    company: CustomerCompanyUpdateInput
    first_name: String
    last_name: String
    email: String
    phone_number: String
    customer_type: String
    profile_pic: String
    location: CustomerLocationInput
    notes: String
    social: CustomerSocialInput
    nickname: String
    Facebook: CustomerFacebookInput
    canReply: Boolean
    platform: String
    aliases: String
  }
  input CompanyUpsertInput {
    id: String
    selected: [CustomerCompanyInput]
    updated: [CustomerCompanyInput]
  }

  input UpdateCustomerInput {
    id: Int
    first_name: String
    last_name: String
    phone_number: String
    email: String
    profile_pic: String
    aliases: String
    location: CustomerLocationInput
  }

  input NoteInput {
    id: ID
    note: String
    name: String
    updated_at: String
    customer_id: ID
  }

  input CustomerLocationInput {
    address: String
    district: String
    province: String
    city: String
    post_code: String
    country: String
  }

  extend type Query {
    getCustomers(filters: CustomerFiltersInput): [CustomerModel]
    getCustomerByID(id: Int): CustomerModel
    getCustomerByASID(ASID: String): CustomerModel
    getCustomerOrdersById(filters: CustomerOrdersFilters): [CustomerOrdersModel]
    getNotes(id: ID): [Note]
  }

  extend type Mutation {
    addCustomer(customer: CustomerModelInput): CustomerModel
    removeCustomer(id: String): RemoveUserResponse
    blockCustomer(id: String): RemoveUserResponse
    unblockCustomer(id: String): RemoveUserResponse
    updateCustomer(customer: CustomerModelInput): CustomerModel
    updateCustomerByForm(customer: UpdateCustomerInput): HTTPResult
    upsertCustomerCompany(customer: CompanyUpsertInput): HTTPResult
    createNewCustomer(params: CustomerModelInput): NewUserResponse
    upsertNote(params: NoteInput): HTTPResult
    removeNote(params: NoteInput): HTTPResult
    updateCustomerCanReply(params: CustomerModelInput): HTTPResult
  }
`;
