import { ITaskDetail } from '../task/task.model';

export interface IDealDetailArg {
  message: IDealDetail;
}
export interface IInsertDealArg {
  message: IInsertDeal;
}
export interface IInsertDeal {
  uuidDeal: string;
  uuidTask: string;
}
export interface IUuidDeal {
  uuidDeal: string;
}

export interface IDealDetail {
  dealtitle: string;
  projectNumber: string;
  startDate: string;
  endDate: string;
  advertiseBefore: boolean;
  paymentDetail: string;
  productService: string;
  objective: string;
  target: string;
  adsOptimizeFee: string;
  adsSpend: string;
  tagDealList: number[];
  noteDetail: string;
  uuidTask?: string;
  accountExecutive: string;
  projectManager: string;
  headOfClient: string;
  uuidDeal?: string;
  dealId?: number;
}
export interface IDealDetailWithTag {
  dealtitle: string;
  projectNumber: string;
  startDate: string;
  endDate: string;
  advertiseBefore: boolean;
  paymentDetail: string;
  productService: string;
  objective: string;
  target: string;
  adsOptimizeFee: string;
  adsSpend: string;
  tagDealList: [ITagDealId];
  noteDetail: string;
  uuidTask?: string;
  accountExecutive: string;
  projectManager: string;
  headOfClient: string;
  uuidDeal?: string;
  dealId?: number;
}
export interface ITagDeal {
  tagname: string;
  tagcolor: string;
}

export interface ICreateDealDialogData {
  uuidTask: string;
  allAssignee: IDealAssign[];
  taskItem: ITaskDetail;
  dealDetail: IDealDetailWithTag;
  uuidDeal?: string;
}
export interface IDealAssign {
  name: string;
  email: string;
  profilePic?: string;
}
export enum Department {
  ACCOUNT_EXCECUTIVE = 'ACCOUNT EXCECUTIVE',
  PROJECT_MANAGER = 'PROJECT MANAGER',
  HEAD_OF_CLIENT = 'HEAD OF CLIENT',
}
export interface ITagDeal {
  tagName: string;
  tagColor: string;
  tagDealId: number;
}
export interface ITagDealId {
  tagDealId: number;
}
export interface IDealId {
  dealId: number;
}
export interface IProjectCode {
  projectCode: string;
  uuidDeal: string;
  dealTitle: string;
  companyName: string;
}

export interface IFilterDealArg {
  message: IFilterDeal;
}

export interface IFilterDeal {
  filter: string;
  uuidTask: string;
}
export interface ITaskDeal {
  taskId: string;
  dealId: string;
}
