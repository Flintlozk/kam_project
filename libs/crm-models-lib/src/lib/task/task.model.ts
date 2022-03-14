import { IGQLFileSteam } from '../common';
import { IUpdateCompany } from '../lead';

export interface ITaskAssign {
  userId: number;
  taskId: number;
}
export interface IInsertAssign {
  name: string;
}
export interface ITaskAssignDetail {
  email: string;
  username: string;
  profilePic: string;
}
export interface IContactTask {
  name: string;
  email: string;
  pictureUrl?: string;
  phoneNumber: string;
  contactCompanyId: number;
  primaryContact?: boolean;
  companyId?: number;
}

export interface IUserRoleFlowDetail {
  username: string;
  profilePic: string;
  rolename: string;
}

export interface IInsertCompanyContactTask {
  name: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  lineId: string;
  position: string;
}
export interface IVerifyRequiredField {
  assignee: number;
  deal: number;
}

export interface ICountDetail {
  count: number;
  counttable: string;
}
export interface IStateConfigDetail {
  priority: number;
  team: string;
}

export interface INextStateTask {
  statename: string;
  stateid: number;
  uuidState?: string;
}
export interface IONextStateTask {
  getNextStateTask: INextStateTask;
}

export interface ITaskDealList {
  dealtitle: string;
  uuiddeal: string;
  startDate: Date;
  endDate: Date;
  objective: string;
  name: string;
  profilePic: string;
}

export interface IAttachmentList {
  fileName: string;
}
export interface ITaskDetail {
  id: number;
  title: string;
  owner: string;
  detail: string;
  tagname: string[];
  email: string;
  name: string;
  companyId: number;
  phoneNumber: string;
  statusType: string;
  distric?: string;
  city?: string;
  dueDate?: Date;
  postalcode?: string;
  priority?: string;
  taskId: number;
  uuidTask?: string;
  uuidCompany?: string;
  assignee?: ITaskAssign[];
  myProfilePic?: string;
  myName?: string;
  startDate: string;
  endDate: string;
  productAmount: string;
  mediaAmount: string;
}
export interface INoteTask {
  noteId: number;
  companyId: number;
  noteDetail: string;
  favourite: boolean;
  createDate: string;
  createBy: string;
  attachmentsIndex: number[];
  uuidNote: string;
}

export interface ICompanyAddress {
  companyname: string;
  district: string;
  address: string;
  postalcode: string;
  province: string;
  city: string;
  businesstype: string;
}
export interface ICalendarDetail {
  calendarId: string;
  description: string;
  href: string;
}
export interface ITaskId {
  taskId: number;
  parentTaskId: number;
}
export interface IGoogleCalendarResponse {
  noteDetail: string;
  startDate: string;
  endDate: string;
}
export interface IAttachment {
  attachmentName: string;
  attachmentLink: string;
  attachementPath: string;
  uuidAttachment: string;
}
export interface IPathAttachment {
  companyId: number;
  taskId: number;
  ownerId: number;
  ownerName: string;
  companyName: string;
}
export interface IAppointmentTask {
  appointmentDate: Date;
  note: string;
  appointmentId: number;
  createBy: string;
  profilePic: string;
  htmlLink: string;
}
export interface IConditionCross {
  conditions: string;
  newState: number;
  stateId: number;
  uuidState: string;
  stateName: string;
  team: string;
}
export interface ITagTask {
  tagname: string;
  color: string;
  tagId: number;
}
export interface ITaskFilter {
  flowId: string;
}
export interface ITagFilter {
  tagId: number;
}
export interface ITaskDetailFilter {
  uuidCompany: string;
  uuidTask: string;
}
export interface IContactTaskFilter {
  companyId: string;
}
export interface ITaskUpdate {
  statusType: string;
  uuidTask: string;
  team: string;
  uuidState: string;
  statusCreate?: string;
  previousStatusType?: string;
  updateCross?: boolean;
  updateCrossRequired?: IConditionCross;
}
export interface IMetatData {
  userId: number;
  ownerId: number;
}

export interface ICompanyContactUpdate {
  name: string;
  email: string;
  phoneNumber: string;
  companyId: number;
  contactCompanyId: number;
  primaryContact: boolean;
  lineId: string;
  position: string;
}

export interface IArgTaskUpdate {
  message: ITaskUpdate;
}
export interface IArgCompanyContactInsert {
  message: IInsertCompanyContactTask;
}
export interface IArgUpdateActiveTask {
  message: IUpdateActiveTask;
}
export interface IUpdateActiveTask {
  activeTask: boolean;
  uuidTask: string;
}
export interface IUpdateTaskTitle {
  title: string;
  uuidTask: string;
}
export interface IArgUpdateTaskTitle {
  message: IUpdateTaskTitle;
}
export interface IArgUpdateCompanyContact {
  message: ICompanyContactUpdate;
}
export interface IAttachData {
  uuidTask: string;
  uuidCompany: string;
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
export interface IArgInsertTaskCross {
  message: IInsertTaskCross;
}
export interface IUpdateTaskInput {
  uuidTask: string;
  statusType?: string;
  previousStatusType?: string;
  team?: string;
  uuidState?: string;
  updateCross: boolean;
}

export interface IResultVerifyAuthen {
  actionType: string;
  value: boolean;
}
export interface IPriorityState {
  priority: number;
}
export interface IArgGetFileTask {
  dataAttach: IAttachData;
}

export interface IFilterByTaskId {
  uuidTask: string;
}
export interface IFilterByFlowId {
  flowId: string;
}
export interface ITaskLeadInsert {
  title: string;
  uuidCompany: string;
  allAssignee: IInsertAssign[];
  appointmentTask: IAppointmentInsert[];
  noteTask: INoteTask[];
  stateId: number;
}
export interface ITaskLeadInsertInput {
  message: ITaskLeadInsert;
  files: IGQLFileSteam[];
}
export interface IArgFlowName {
  flowName: string;
}
export interface ITagInsert {
  tagName: string;
  uuidTask: string;
}
export interface IArgTagInsert {
  message: ITagInsert;
}
export interface INoteTaskInsert {
  uuidTask: string;
  noteDetail: string;
  isInternalNote: boolean;
  flowId: number;
}
export interface INoteTaskUpdate {
  uuidNote: string;
  noteDetail: string;
  flowId: number;
}
export interface INoteId {
  noteId: number;
  uuidNote: string;
}
export interface IArgNoteTaskInsert {
  message: INoteTaskInsert;
  files: IGQLFileSteam[];
}
export interface IArgNoteTaskUpdate {
  message: INoteTaskUpdate;
}
export interface IArgNoteTaskDelete {
  message: INoteTaskDelete;
}
export interface INoteTaskDelete {
  uuidNote: string;
  flowId: number;
}
export interface IUuidAppointment {
  uuidAppointmennt: string;
}
export interface IUuidAttachment {
  uuidAttachment: string;
}
export interface IInternalNote {
  isInternalNote: boolean;
  uuidNote: string;
}
export interface IInternalNoteArg {
  message: IInternalNote;
}
export interface IDealDateArg {
  message: IDealDate;
}
export interface IDealDate {
  startDate: string;
  endDate: string;
  uuidTask: string;
}
export interface IProductAmountArg {
  message: IProductAmount;
}
export interface IProductAmount {
  productAmount: string;
  uuidTask: string;
}
export interface IMediaAmountArg {
  message: IMediaAmount;
}
export interface IMediaAmount {
  mediaAmount: string;
  uuidTask: string;
}
export interface IInsertTaskAssign {
  value: string;
  uuidTask: string;
  taskId: number;
}
export interface IArgInsertTaskAssign {
  message: IInsertTaskAssign;
}
export interface IAppointmentInsert {
  appointmentStartDate: string;
  appointmentEndDate: string;
  appointmentNote: string;
  uuidTask: string;
  companyName: string;
  href: string;
}
export interface IAppointmentEdit {
  appointmentStartDate: string;
  appointmentEndDate: string;
  appointmentNote: string;
  uuidTask: string;
  companyName: string;
  href: string;
  uuidAppointment: string;
}
export interface IArgAppointmentInsert {
  message: IAppointmentInsert;
}
export interface IArgAppointmentEdit {
  message: IAppointmentEdit;
}
export interface IUuidAppointment {
  uuidAppointment: string;
}
export interface IFileDownload {
  file: File;
}
export interface ITaskDealInsert {
  uuidTask: string;
  dealvalue: number;
  dealtitle: string;
  startDate: Date;
  endDate: Date;
}
export interface IArgTaskDealInsert {
  message: ITaskDealInsert;
}
