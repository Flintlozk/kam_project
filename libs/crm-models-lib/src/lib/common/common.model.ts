import * as Joi from 'joi';
import { IUUIDCompany } from '../lead';

export enum RouteLinkEnum {
  TEAM = ':team',
  LEAD = 'lead',
  TASK = 'task',
  FLOWCONFIG = 'flowconfig',
  SETTING = 'setting',
  SETTING_TAG = 'tag',
}
export interface ILoginResponse {
  status: number;
  value: any;
  profilePictureUrl?: string;
  token?: string;
  expiresAt?: string;
  name: string;
  defaultWorkflow: string;
  ownerPicLink: string;
}
export interface IUploadFileResponse {
  status: number;
  values: IUploadFileResult;
}
export interface IUploadFileResult {
  fileUrl: string;
  fileName: string;
  filePath: string;
}
export interface IGQLFileSteam {
  file?: any;
  filename: string;
  mimetype: string;
  encoding: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  createReadStream?: () => any;
}
export interface IUpLoadFiles {
  files: IGQLFileSteam[];
  dataAttach: IUUIDCompany;
}
export interface IHTTPResult {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  expiresAt?: string;
}
export interface ICrmUserDetail {
  ID: string;
  username: string;
  email: string;
  ownerId: number;
  userId: number;
  is_admin: boolean;
  profilePic: string;
  uuiduser: string;
  flowId: string;
  departmentId: number;
  ownerPicLink: string;
}
export interface ICrmFlowName {
  flowname: string;
  flowId: string;
}
export interface IStateCreateCondition {
  stateId: number;
  uuidState: string;
  actionType: string;
  options?: string;
  assignee?: number;
  deal?: string;
  key?: string;
  value?: any;
  stateType: string;
}

export interface IPaginationPage {
  skip_number: number;
  limit_number: number;
}
export interface IPagination {
  pagination: IPaginationPage;
}
export interface IGoogleCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  id_token: string;
  profileImg: string;
  route: string;
  expiresAt: string;
}

export interface IGoogleCalendar {
  calendarId: string;
  htmlLink: string;
}
export interface ILoginDataGoogle {
  email: string;
  pictureUrl: string;
}
export enum StateType {
  CLOSE = 'CLOSE',
  OPEN = 'OPEN',
  NORMAL = 'NORMAL',
}
export enum LoginRespondingType {
  ACCESS_DENY = 'ACCESS_DENY',
  GRANT_ACCESS = 'GRANT_ACCESS',
  YOUR_EMAIL_IS_NOT_ALLOWED = 'YOUR_EMAIL_IS_NOT_ALLOWED',
  REDIS_CONNECTION_LOST = 'REDIS_CONNECTION_LOST',
  CANNOT_UPDATE_DATA = 'CANNOT_UPDATE_DATA',
  AUTHENTICATION_ERROR = 'AUTHENTICATION ERROR',
  NO_DATA_FROM_RADIS_KEY = 'NO_DATA_FROM_RADIS_KEY',
  WORK_FLOW_NOTE_ALLOW = 'WORKFLOW_NOT_ALLOW',
  APPLICATION_SCOPE_NOT_ALLOW = 'APPLICATION_SCOPE_NOT_ALLOW',
}

export enum ResponseValue {
  CANNOT_UPLOAD_FILE = 'CANNOT_UPLOAD_FILE',
  CANNOT_REMOVE_FILE = 'CANNOT_REMOVE_FILE',
  ASSIGNEE_REQUIRED = 'ASSIGNEE_REQUIRED',
  DEAL_REQUIRED = 'DEAL_REQUIRED',
  CREATE_AUTOMATE = 'CREATE_AUTOMATE',
  CANNOT_DELETE = 'AUTO CREATE CANNOT DELETE',
  ALLOW_MOVE_TO_NEXT_STATE_ONLY = 'ALLOW MOVE TO NEXT STATE ONLY',
  DEPARTMENT_HAVE_NO_PERMISSION = 'DEPARTMENT HAVE NO PERMISSION',
  CANNOT_DELETE_ATTACHMENT = 'CANNOT DELETE ATTACHMENT',
  CANNOT_DELETE_SHARING_NOTE = 'CANNOT DELETE SHARING NOTE',
  CANNOT_EDIT_SHARING_NOTE = 'CANNOT EDIT SHARING NOTE',
  DUPLICATE_PROJECT_CODE = 'DUPLICATE PROJECT CODE',
  DEAL_ALREADY_HAVE_THIS_PROJECT = 'DEAL ALREADY HAVE THIS PROJECT',
}

export enum StateActionType {
  REQUIRED = 'REQUIRED',
  APPROVE = 'APPROVE',
  NOTIFICATION = 'NOTIFICATION',
  CREATE_AUTOMATE = 'CREATE_AUTOMATE',
}
export enum StateOptions {
  DEAL = 'deal',
  ASSIGNEE = 'assignee',
}

export interface IUserDetail {
  name: string;
  profilePic: string;
}

export enum Action {
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
}
