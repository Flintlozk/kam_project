import * as Joi from 'joi';

export const LeadResultArrayValidate = {
  companyname: Joi.string().required(),
  note: Joi.string().required(),
  district: Joi.string().required(),
  province: Joi.string().required(),
  city: Joi.string().required(),
  postalcode: Joi.string().required(),
  address: Joi.string().required(),
  title: Joi.string(),
  uuidCompany: Joi.string().required(),
};
export const UUIDCompanyRequest = {
  uuidCompany: Joi.string().required(),
};

export const ContactRequest = {
  name: Joi.string().required(),
  email: Joi.string().allow(''),
  phoneNumber: Joi.string().allow(''),
  primarycontact: Joi.boolean().required(),
  CRUD_TYPE: Joi.string().required(),
};
export const LeadRequest = {
  uuidCompany: Joi.string().allow(''),
  companyname: Joi.string().required(),
  taxIdNo: Joi.string().required(),
  website: Joi.string().required(),
  projectNumber: Joi.string().required(),
  addressList: Joi.array().items({
    address: Joi.string().allow(''),
    district: Joi.string().allow(''),
    postalcode: Joi.string().allow(''),
    province: Joi.string().allow(''),
    city: Joi.string().allow(''),
    uuidAddress: Joi.string().required(),
  }),
  businesstype: Joi.string().required(),
  companyContactList: Joi.array().items({
    uuidname: Joi.string().allow(null).allow(''),
    name: Joi.string().required(),
    email: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
    primarycontact: Joi.boolean().required(),
    CRUD_TYPE: Joi.string().required(),
    lineId: Joi.string().allow(''),
    position: Joi.string().allow(''),
  }),
  tagLeadList: Joi.array().items({
    tagname: Joi.string().allow(null),
    CRUD_TYPE: Joi.string().allow(''),
  }),
  noteLeadList: Joi.array().items({
    createby: Joi.string().required(),
    createdate: Joi.date().required(),
    favourite: Joi.boolean().required(),
    notedetail: Joi.string().allow(''),
    readonly: Joi.boolean().required(),
    updatedate: Joi.date().required(),
    uuidnote: Joi.string().allow(''),
  }),
};
export const InsertLeadRequest = {
  uuidCompany: Joi.string().allow(''),
  companyname: Joi.string().required(),
  addressList: Joi.array().items({
    address: Joi.string().allow(''),
    district: Joi.string().allow(''),
    postalcode: Joi.string().allow(''),
    province: Joi.string().allow(''),
    city: Joi.string().allow(''),
  }),
  businesstype: Joi.string().required(),
  taxIdNo: Joi.string().required(),
  website: Joi.string().required(),
  projectNumber: Joi.string().required(),
  companyContactList: Joi.array().items({
    name: Joi.string().required(),
    email: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
    primarycontact: Joi.boolean().required(),
    CRUD_TYPE: Joi.string().required(),
    lineId: Joi.string().allow(''),
    position: Joi.string().allow(''),
  }),
  tagLeadList: Joi.array().items({
    tagname: Joi.string().required(),
    CRUD_TYPE: Joi.string().allow(''),
  }),
  noteLeadList: Joi.array().items({
    createby: Joi.string().required(),
    createdate: Joi.date().required(),
    favourite: Joi.boolean().required(),
    notedetail: Joi.string().allow(''),
    readonly: Joi.boolean().required(),
    updatedate: Joi.date().required(),
    uuidnote: Joi.string().allow(''),
  }),
};
export const CompanyContactRespone = {
  name: Joi.string().required(),
  email: Joi.string().allow(''),
  phoneNumber: Joi.string().allow(''),
  primarycontact: Joi.boolean().required(),
  uuidname: Joi.string().required(),
  lineId: Joi.string().allow(''),
  position: Joi.string().allow(''),
};
export const AddressRespone = {
  address: Joi.string().allow(''),
  postalcode: Joi.string().allow(''),
  district: Joi.string().allow(''),
  city: Joi.string().allow(''),
  province: Joi.string().allow(''),
  uuidAddress: Joi.string().required(),
};

export const PrimaryContactRespone = {
  name: Joi.string().required(),
  email: Joi.string().required(),
  phoneNumber: Joi.string().required(),
};

export const CompanyInputListRequest = {
  uuidCompany: Joi.string().allow(''),
};

export const UUIDCompanyRespone = {
  uuidCompany: Joi.string().required(),
  companyname: Joi.string().allow(null),
  createBy: Joi.string().required(),
  profilePic: Joi.string().required(),
  active: Joi.boolean().required(),
};
export const UUIDInsertCompanyRespone = {
  uuidCompany: Joi.string().required(),
  companyname: Joi.string().allow(null),
  createBy: Joi.string().required(),
  profilePic: Joi.string().required(),
};
export const CountRespone = {
  activeLead: Joi.number().required(),
  inActiveLead: Joi.number().required(),
};
export const LeadRespone = {
  uuidCompany: Joi.string().allow(''),
  companyname: Joi.string().required(),
  website: Joi.string().required(),
  taxIdNo: Joi.string().required(),
  projectNumber: Joi.string().required(),
  addressList: Joi.array().items({
    district: Joi.string().required(),
    address: Joi.string().required(),
    postalcode: Joi.string().required(),
    province: Joi.string().required(),
    city: Joi.string().required(),
  }),
  businesstype: Joi.string().required(),
  companycontact: Joi.array().items({
    name: Joi.string().required(),
    email: Joi.string().allow(''),
    phoneNumber: Joi.string().allow(''),
    primarycontact: Joi.boolean().required(),
    CRUD_TYPE: Joi.string().required(),
  }),
  tagleadlist: Joi.array().items({
    tagownerid: Joi.number().allow(null),
    CRUD_TYPE: Joi.string().allow(''),
  }),
  notelead: Joi.array().items({
    createby: Joi.string().required(),
    createdate: Joi.date().required(),
    favourite: Joi.boolean().required(),
    notedetail: Joi.string().allow(''),
    readonly: Joi.boolean().required(),
    updatedate: Joi.date().required(),
    uuidnote: Joi.string().allow(''),
  }),
  userWorkflow: Joi.array().items(),
};

export const BusinessTypeRespone = {
  businesstype: Joi.string().required(),
};
export const TagLead = {
  tagname: Joi.string().allow(null),
};
export const TagOwner = {
  tagownerid: Joi.number().required(),
  tagname: Joi.string().required(),
  tagcolor: Joi.string().required(),
};
export const NoteLead = {
  uuidnote: Joi.string().required(),
  notedetail: Joi.string().allow(null).allow(''),
  createdate: Joi.string().required(),
  readonly: Joi.boolean().required(),
};
export const LeadSettings = {
  hasProjectCode: Joi.boolean(),
  hasWebsite: Joi.boolean(),
  projectPrefix: Joi.string(),
};
