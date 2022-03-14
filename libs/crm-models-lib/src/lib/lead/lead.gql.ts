import gql from 'graphql-tag';

export const LeadTypeDefs = gql`
  type CompanyContact {
    uuidCompany: String
    uuidname: String
    name: String
    email: String
    phoneNumber: String
    primarycontact: Boolean
    lineId: String
    position: String
  }
  type InsertResult {
    uuidCompany: String
    createBy: String
    profilePic: String
  }
  input Pagination_PageInput {
    skip_number: Int
    limit_number: Int
  }

  type Lead {
    uuidCompany: String
    companyname: String
    note: String
    addressList: [AddressList]
    primaryContactList: [CompanyContact]
    companyContactList: [CompanyContact]
    businesstype: String
    tagLeadList: [TagLead]
    noteLeadList: [NoteLead]
    contactTask: [CompanyContact]
    getAllUser: [getAllUser]
    createBy: String
    profilePic: String
    active: Boolean
    userWorkflow: [UserWorkflow]
    website: String
    projectNumber: String
    taxIdNo: String
  }
  type AddressList {
    address: String
    postalcode: String
    district: String
    city: String
    province: String
    uuidAddress: String
  }
  type UserWorkflow {
    flowname: String
  }

  type TagLeadCompany {
    tagownerid: Int
  }
  type TagLead {
    tagownerid: Int
    tagname: String
    tagcolor: String
  }
  type BusinessType {
    businesstype: String
  }
  type tagcompany {
    tagname: String
  }
  type NoteLead {
    uuidnote: String
    notedetail: String
    createby: String
    createdate: String
    updatedate: String
    readonly: Boolean
  }
  type LeadSettings {
    hasProjectCode: Boolean
    hasWebsite: Boolean
    projectPrefix: String
  }

  type CountLead {
    activeLead: Int
    inActiveLead: Int
  }
  input CompanyInput {
    uuidCompany: String
    companyname: String
    website: String
    taxIdNo: String
    businesstype: String
    tagLeadList: [TagLeadInput]
    noteLeadList: [NoteLeadInput]
    addressList: [AddressListInput]
    companyContactList: [ContactInput]
    projectNumber: String
  }
  input AddressListInput {
    address: String
    postalcode: String
    district: String
    city: String
    province: String
    uuidAddress: String
  }

  input NoteLeadInput {
    createby: String
    createdate: Date
    favourite: Boolean
    notedetail: String
    readonly: Boolean
    updatedate: Date
    uuidnote: String
  }
  input TagLeadInput {
    tagname: String
    CRUD_TYPE: String
  }
  input ContactInput {
    uuidname: String
    name: String
    email: String
    phoneNumber: String
    primarycontact: Boolean
    uuidCompany: String
    CRUD_TYPE: String
    lineId: String
    position: String
  }
  input ConmpanyInputList {
    companyinputlist: [CompanyInput]
  }
  input UUIDCompanyInput {
    uuidCompany: String
  }

  extend type Query {
    getTotalLead: CountLead
    getLeadsContact(pagination: Pagination_PageInput): [Lead]
    getInActiveLeadsContact(pagination: Pagination_PageInput): [Lead]
    getContactByLead(uuidCompany: String): [CompanyContact]
    getPrimaryContactByLead(uuidCompany: String): [CompanyContact]
    getLeadsContactByUUIDCompany(uuidCompany: String): [Lead]
    getBusinessTypeByOwnerId: [BusinessType]
    getTagLeadByCompanyId(uuidCompany: String): [TagLeadCompany]
    getTagLeadByOwnerId: [TagLead]
    uploads: [File]
    getNoteLeadByComapnyId(uuidCompany: String): [NoteLead]
    getAdressByLead(uuidCompany: String): [AddressList]
    getLeadSettingsByOwnerId: LeadSettings
  }

  extend type Mutation {
    insertCompanyContact(insertCompanyContact: CompanyInput): InsertResult
    updateCompanyContact(updateCompanyContact: CompanyInput): HTTPResult
    deleteCompanyContact(deleteCompanyContact: ConmpanyInputList): HTTPResult
    multipleUpload(files: [Upload!]!, dataAttach: UUIDCompanyInput): [HTTPResult!]!
  }
`;
