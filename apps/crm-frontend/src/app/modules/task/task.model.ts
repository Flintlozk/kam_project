import { ICompanyAddress, ICountDetail, ICrmFlowName, IUserDetail } from '@reactor-room/crm-models-lib';
import { IndexOptions } from 'mongoose';

export interface IFlowTask {
  id: string;
  taskCard: ITaskDetail[];
  click?: (taskItem: ITaskDetail) => void;
  uuidState?: string;
  color?: string;
  statename?: string;
}

export interface IUserAssign {
  username: string;
  email: string;
}
export interface ITaskDetail {
  id: number;
  uuidTask: string;
  title: string;
  owner: string;
  detail: string;
  tagname: string[];
  email: string;
  name: string;
  phoneNumber: string;
  companyname: string;
  statusType: string;
  companyId: number;
  uuidCompany: string;
  createDate?: Date;
  assignee?: ITaskAssign[];
  contactTask?: IContactTask[];
  appointmentTask?: IAppointmentTask[];
  noteTask?: INoteTask[];
  tagTask?: ITagTask[];
  taskDeal?: ITaskDealList[];
  companyAddress?: ICompanyAddress[];
  countDetail?: ICountDetail[];
  getAllUser?: ITaskAssign[];
  nextStateTask?: INextStateTask;
  district?: string;
  city?: string;
  province?: string;
  postralcode?: string;
  uuidState?: string;
  dueDate?: Date;
  priority?: string;
  color?: string;
  myProfilePic?: string;
  myName?: string;
  userWorkflow: ICrmFlowName[];
}

export interface INextStateTask {
  statename: string;
  stateid: number;
  uuidState?: string;
}

export interface ITaskDealList {
  dealvalue: number;
  dealtitle: string;
  uuidDeal: string;
  startDate: Date;
  endDate: Date;
}

export interface IMemberFlow {
  username: string;
  profilePic: string;
  rolename: string;
}
export interface ITaskAssign {
  name: string;
  email: string;
  profilePic?: string;
}
export interface INoteTask {
  noteDetail: string;
  favourite?: boolean;
  createBy?: string;
  createDate?: string;
  profilePic: string;
  attachments: IAttachment[];
  attachmentsIndex: number[];
  isInternalNote: boolean;
  uuidNote: string;
  flowId: number;
  uuidTask: string;
}
export interface IInsertTaskByLead {
  title: string;
  uuidCompany: string;
  allAssignee: ITaskAssign[];
  appointmentTask: IAppointmentTask[];
  noteTask: INoteTask[];
}
export interface IAttachment {
  attachmentName: string;
  attachmentLink: string;
  uuidAttachment: string;
}
export interface ITagTask {
  tagname: string;
  color: string;
  tagId: number;
}
export interface IAppointmentTask {
  appointmentStartDate: string;
  appointmentEndDate: string;
  note?: string;
  createBy: string;
  profilePic: string;
  htmlLink: string;
  uuidAppointment: string;
}
export interface TaskFilters {
  team: string;
}

export interface IDialogData {
  cardDetail: ITaskDetail;
  conditionUpdate: string;
  newState: string;
  newTeam: string;
  allUserInWorkFlow: IUserDetail[];
}
export interface IDialogDelete {
  title: string;
}
export interface IFormLayout {
  formName: string;
  formLabel: string;
}

export enum ViewTaskEnum {
  GANTT_VIEW = 'GANTT_VIEW',
  CARD_VIEW = 'CARD_VIEW',
  LIST_VIEW = 'LIST_VIEW',
}
export enum ContactCompany {
  TOOLTIP_ADD = 'Add New Contact',
  EDIT_MODE = 'Edit Mode',
  READONLY = 'Readonly',
}

export enum ManageCommentForm {
  INDEX_FILE_NAME = 1,
  PRIMARY_DISPLAY_NOTE = 3,
}
export enum TaskDetailEnum {
  UUID_TASK = 'uuidTask',
  STATUS_TYPE = 'statusType',
}
export enum StateFlowEnum {
  OPEN = 'OPEN',
  DONE = 'DONE',
}
export interface IGetTaskFiltersInput {
  team: string;
}
export interface IGetTaskDetailFiltersInput {
  uuidCompany: string;
  uuidTask?: string;
}
export interface IGetDataFiltersByIdInput {
  uuidTask: string;
}
export interface IGetAttachmentIdInput {
  uuidTask: string;
  uuidCompany: string;
}
export interface IUpdateTaskInput {
  uuidTask: string;
  statusType?: string;
  previousStatusType?: string;
  team?: string;
  uuidState?: string;
  updateCross: boolean;
}
export interface IUpdateTaskTitleInput {
  title: string;
  uuidTask: string;
}

export interface ICompanyContactUpdate {
  name: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  contactCompanyId: number;
  primaryContact?: boolean;
}

export interface ICompanyContactInsert {
  name: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  lineId: string;
  position: string;
}
export interface ICommendTask {
  noteDetail: string;
  comment: INoteTask;
  index: number;
}
export interface IInsertTagInput {
  uuidTask: string;
  tagName: string;
}
export interface IInsertAssignTaskInput {
  value: string;
  uuidTask: string;
}
export interface IInsertAppointInput {
  appointmentStartDate: string;
  appointmentEndDate: string;
  appointmentNote: string;
  uuidTask: string;
  companyName: string;
  href: string;
}
export interface IEditAppointInput {
  appointmentStartDate: string;
  appointmentEndDate: string;
  appointmentNote: string;
  uuidTask: string;
  companyName: string;
  href: string;
  uuidAppointment: string;
}
export interface IInsertNoteTaskInput {
  noteDetail: string;
  uuidTask: string;
  isInternalNote: boolean;
}
export interface ITaskDealInsertInput {
  uuidTask: string;
  dealvalue: number;
  dealtitl: string;
  startDate: Date;
  endDate: Date;
}
export interface ITaskLeadInsertInput {
  uuidCompany: string;
  title: string;
}

export interface IInsertTaskCross {
  title: string;
  team: string;
  uuidState: string;
  uuidCompany: string;
  dueDate: Date;
  parentTaskUUID: string;
  assignee: string[];
}
export interface IUpdateActiveTask {
  uuidTask: string;
  activeTask: boolean;
  uuidState: string;
}
export interface IContactTask {
  name: string;
  email: string;
  phoneNumber: string;
  contactCompanyId: number;
  primaryContact?: boolean;
}
