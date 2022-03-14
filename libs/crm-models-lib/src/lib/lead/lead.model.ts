import { ICrmFlowName } from '../common';

export interface IUUIDCompany {
  uuidCompany: string;
}

export interface IUpdateCompany {
  updateCompanyContact: ILead;
}
export interface IInsertCompany {
  insertCompanyContact: ILead;
}
export interface ICompanyInputList {
  companyinputlist: IUUIDCompany[];
}
export interface IDeleteCompany {
  deleteCompanyContact: ICompanyInputList;
}
export interface ICompanyId {
  companyId: number;
  uuidCompany: string;
}
export interface ICount {
  activeLead: number;
  inActiveLead: number;
}
export interface IAddress {
  address: string;
  postalcode: string;
  district: string;
  city: string;
  province: string;
  uuidAddress: string;
}
export interface ILead {
  companyid: number;
  uuidCompany: string;
  companyname: string;
  addressList: IAddress[];
  note: string;
  district: string;
  address: string;
  postalcode: string;
  province: string;
  city: string;
  primaryContactList: IContact[];
  companyContactList: IContact[];
  businesstype: string;
  businesstypelist: IBusinessType[];
  tagLeadList: ITagLead[];
  noteLeadList: INoteLead[];
  createBy: string;
  profilePic: string;
  userWorkflow: ICrmFlowName[];
  taxIdNo: string;
  website: string;
  projectNumber: string;
}
export interface ICount {
  activeLead: number;
  inActiveLead: number;
}
export interface ILeadSettings {
  hasWebsite: boolean;
  hasProjectCode: boolean;
  ownerId: number;
  projectPrefix: string;
}
export interface ITagLead {
  tagname: string;
  CRUD_TYPE: string;
  tagcolor: string;
  tagownerid: number;
}
export enum CrudType {
  ADD = 'ADD',
  EDIT = 'EDIT',
  DELETE = 'DELETE',
  NONE = 'NONE',
}
export enum TYPEFORM {
  Lead = 'LEAD',
  Task = 'TASK',
}

export interface IContact {
  uuidname: string;
  name: string;
  phoneNumber: string;
  email: string;
  primarycontact: boolean;
  position: string;
  uuidCompany: string;
  CRUD_TYPE: string;
  lineId: string;
}
export interface INoteLead {
  noteid: number;
  createby: string;
  comapanyid: number;
  favourite: boolean;
  createdate: string;
  updatedate: string;
  notedetail: string;
  readonly: boolean;
  uuidnote: string;
}
export interface ITagLeadByCompany {
  tagownerid: number;
}
export interface ITagNameByCompany {
  tagname: string;
}
export interface IBusinessType {
  businesstype: string;
}
export interface IInsertLeadRespone {
  uuidCompany: string;
  createBy: string;
  profilePic: string;
}
export interface ITagOwner {
  tagOwnerId: number;
}
