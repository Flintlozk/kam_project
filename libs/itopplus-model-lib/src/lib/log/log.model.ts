export const EnumLogDescription = {
  FOLLOW_TO_WAIT_FOR_PAYMENT: 'FOLLOW_TO_WAIT_FOR_PAYMENT',
  WAIT_FOR_PAYMENT_TO_CONFIRM: 'WAIT_FOR_PAYMENT_TO_CONFIRM',
  CONFIRM_TO_WAIT_FOR_SHIPMENT: 'CONFIRM_TO_WAIT_FOR_SHIPMENT',
  WAIT_FOR_SHIPMENT_TO_CLOSE: 'WAIT_FOR_SHIPMENT_TO_CLOSE',

  CUSTOMER_TO_CUSTOMER: 'CUSTOMER_TO_CUSTOMER', //Move customer to open order
  INBOX_TO_FOLLOW: 'INBOX_TO_FOLLOW',
  INBOX_TO_LEAD: 'INBOX_TO_LEAD',

  AUDIENCE_TO_CLOSE: 'AUDIENCE_TO_CLOSE',
  CUSTOMER_TO_CLOSE: 'CUSTOMER_TO_CLOSE',

  AUDIENCE_TO_REJECTED: 'AUDIENCE_TO_REJECTED',
  CUSTOMER_TO_REJECTED: 'CUSTOMER_TO_REJECTED',

  ADD_CUSTOMER: 'ADD_CUSTOMER',
  BLOCK_CUSTOMER: 'BLOCK_CUSTOMER',
  UNBLOCK_CUSTOMER: 'UNBLOCK_CUSTOMER',
  DELETE_CUSTOMER: 'DELETE_CUSTOMER',
  UPDATE_CUSTOMER: 'UPDATE_CUSTOMER',
};

export const logTypeEnum = {
  CHANGE_STATUS: 'Change status',
  READ_NEW_MESSAGE: 'Read new message',
  REJECT_AUDIENCE: 'Reject audience',
  CLOSE_AUDIENCE: 'Close audience',
  AUTH: 'Auth',
  CUSTOMER: 'Customer',
  PURCHASE_ORDER: 'Purchase Order',
};

export const logActionEnum = {
  CREATE: 'Create',
  UPDATE: 'Update',
  DELETE: 'Delete',
  BLOCK: 'Block',
  UNBLOCK: 'Unblock',
  LOGIN: 'Login',
};

export const { CHANGE_STATUS, READ_NEW_MESSAGE, REJECT_AUDIENCE, CLOSE_AUDIENCE } = logTypeEnum;
export const { CREATE, UPDATE, DELETE } = logActionEnum;

export type LogType = 'Auth' | 'Customer' | 'Purchase Order' | 'Change status' | 'Read new message' | 'Reject audience' | 'Close audience';
export type LogAction = 'Create' | 'Update' | 'Delete' | 'Block' | 'Unblock' | 'Login';

export interface ILog {
  _id?: any;
  pageID?: number;
  user_id?: number;
  type?: LogType;
  action?: LogAction;
  description?: string;
  user_name?: string;
  audience_id?: number;
  audience_name?: string;
  created_at?: Date;
  total_rows?: number;
}

export interface ILogReturn {
  logs: ILog[];
  total_rows: number;
}

export interface ILogUser {
  user_id: number;
  user_name: string;
}

export interface ILogInput {
  user_id: number; // User ID Context
  type: LogType; // DOMAIN
  action: LogAction; // C R U D
  description: string; // ANY
  user_name: string; // User Context
  audience_id?: number; // ID of Audience who interact with this activity
  audience_name?: string; // Name of Audience who interact with this activity
  created_at: Date;
  subject?: string | number; // Modified customer
}

export interface LogFilters {
  currentPage: number;
  startDate: string;
  endDate: string;
  modifiedBy: string;
  orderBy: string;
  orderMethod: string;
  pageSize: number;
}
export interface ILogFilterInput {
  currentPage: number;
  pageSize: number;
  startDate: string;
  endDate: string;
  modifiedBy: string;
  orderBy: string;
  orderMethod: string;
}
