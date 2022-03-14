import gql from 'graphql-tag';

export enum EnumCloudMessageQueueAttribute {
  RUNNING = 'RUNNING',
  TIMEOUT = 'TIMEOUT',
}
export interface IUploadImageSetResult {
  status: number;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  value: any;
  expiresAt?: string;
  failedList?: string[];
}

export enum EnumDayOfWeek {
  sunday,
  monday,
  tuesday,
  wednesday,
  thursday,
  friday,
  saturday,
  // SUNDAY = 0,
  // MONDAY = 1,
  // TUESDAY = 2,
  // WEDNESDAY = 3,
  // THURSDAY = 4,
  // FRIDAY = 5,
  // SATURDAY = 6,
}

export const PagesCreatedTypeDefs = gql`
  type PageCreatedResponse {
    created_at: String
  }

  extend type Query {
    getDateOfPageCreation: PageCreatedResponse
  }
`;

export enum ELocalStorageType {
  CHAT_STATUS = 'CHAT_STATUS',
}

export interface IBankAccountDetails {
  KBANK: IBankAccountDetailsItem;
  SCB: IBankAccountDetailsItem;
  KTB: IBankAccountDetailsItem;
  BBL: IBankAccountDetailsItem;
  TMB: IBankAccountDetailsItem;
  GSB: IBankAccountDetailsItem;
  BAY: IBankAccountDetailsItem;
}

export interface IBankAccountDetailsItem {
  imgUrl: string;
  title: string;
  type: string;
}

export interface IStepChild {
  label: string;
  text: string;
  total: number;
  route: string;
}
export interface IStep {
  label: string;
  text: string;
  total: number;
  image: string;
  route: string;
  children?: IStepChild[];
}
