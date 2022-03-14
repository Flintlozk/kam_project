import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
import gql from 'graphql-tag';
import { EnumPurchaseOrderStatus } from '../purchase-order/purchase-order.enum';
import { IAudience } from './audience.model';

Joi.extend(JoiDate);

export enum UserMemberType {
  OWNER = 'OWNER',
  MEMBER_ADMIN = 'MEMBER_ADMIN',
  MEMBER_STAFF = 'MEMBER_STAFF',
  SYSTEM = 'SYSTEM',
  CUSTOMER = 'CUSTOMER',
}
export interface IAudienceStep {
  id?: number;
  audience_id: number;
  reason?: string;
  closeDescription?: string;
  page_id: number;
  domain: AudienceDomainType;
  status: AudienceStepStatus;
  previous_domain: AudienceDomainType;
  previous_status: AudienceStepStatusOrNull;
  user_id: number;
  user_type: UserMemberType;
  created_at: Date;
  action_by?: string;
}

export interface IIDInterface {
  id: number;
}

export interface ICustIDIsChildInterface {
  customerID: number;
  isChild: boolean;
}

export interface IAudienceStepExtraData {
  user_id: number;
  user_type: UserMemberType;
  current_domain?: AudienceDomainType;
  current_status?: AudienceStepStatusOrNull;
  previous_domain?: AudienceDomainType;
  previous_status?: AudienceStepStatusOrNull;
  parent_id?: number;
  date_current?: Date;
  date_previous?: Date;
}
export interface IAudienceHistoryParams {
  pageID: number;
  userID: number;
  audienceID: number;
  currentAudience: IAudience;
  updatedAudience: IAudience;
  userIsSystem?: boolean;
}

export interface IAudienceHistoryInput {
  domain: AudienceDomainType;
  status: AudienceStepStatus;
}

export type AudienceStepStatus = CustomerDomainStatus | AudienceDomainStatus | LeadsDomainStatus | CustomerServiceDomainStatus | PendingDomainStatus | EnumPurchaseOrderStatus;

export type AudienceStepStatusOrNull = AudienceStepStatus | null;

export interface IAudienceDomainStatus {
  domain: AudienceDomainType;
  status: AudienceStepStatus;
  previous_status?: AudienceStepStatus;
  previous_domain?: AudienceDomainType;
}

export enum AudienceDomainType {
  LEADS = 'LEADS',
  CUSTOMER = 'CUSTOMER',
  AUDIENCE = 'AUDIENCE',
  CUSTOMER_SERVICE = 'CUSTOMER_SERVICE',
  PENDING = 'PENDING',
}

export enum CustomerDomainStatus {
  FOLLOW = 'FOLLOW', // STEP 1
  WAITING_FOR_PAYMENT = 'WAITING_FOR_PAYMENT', // STEP 2
  CONFIRM_PAYMENT = 'CONFIRM_PAYMENT', // STEP 3
  WAITING_FOR_SHIPMENT = 'WAITING_FOR_SHIPMENT', // STEP 4
  CLOSED = 'CLOSED', // STEP 5
}

export enum AudienceUpdateOperation {
  UPDATE = 'UPDATE',
  REMOVE = 'REMOVE',
}

export enum AudienceDomainStatus {
  FOLLOW = 'FOLLOW',
  LEAD = 'LEAD',
  INBOX = 'INBOX',
  COMMENT = 'COMMENT',
  LIVE = 'LIVE',
  REJECT = 'REJECT',
  EXPIRED = 'EXPIRED',
  CLOSED = 'CLOSED',
}

export enum LeadsDomainStatus {
  FOLLOW = 'FOLLOW', // Step 1
  FINISHED = 'FINISHED', // Step 2
  REJECT = 'REJECT',
}

export enum CustomerServiceDomainStatus {
  ISSUES = 'ISSUES', // Step 1
  CLOSED = 'CLOSED', // Step 2
}

export enum PendingDomainStatus {
  DEFAULT = 'DEFAULT',
}

export interface IAudienceStepInput {
  audience_id: number;
  page_id: number;
  user_id?: number;
}

export const AudienceStepListTypeDefs = gql`
  "Audience Step Schema"
  type AudienceStepModel {
    id: Int
    audience_id: Int
    page_id: String
    domain: String
    reason: String
    closeDescription: String
    status: String
    created_at: Date
    previous_domain: String
    previous_status: String
    user_id: Int
    user_type: String
    action_by: String
  }

  input AudienceStepInput {
    audience_id: Int
  }

  extend type Query {
    getSteps(audienceID: Int): AudienceModel
    getAudienceHistoryByAudienceID(id: Int): [AudienceStepModel]
  }

  extend type Mutation {
    createOrUpdate(audienceID: Int): AudienceModel
    backToPreviousStep(audienceID: Int): AudienceModel
  }
`;

export const GetStepInputValidate = {
  audienceID: Joi.number().required(),
};

export const audienceHistoryValidateResponse = {
  id: Joi.number().required(),
  audience_id: Joi.number().required(),
  page_id: Joi.number().required(),
  domain: Joi.string().required(),
  reason: Joi.string().allow(null).allow(''),
  closeDescription: Joi.string().allow(null).allow(''),
  status: Joi.string().required(),
  previous_domain: Joi.string().allow(null).allow(''),
  previous_status: Joi.string().allow(null).allow(''),
  user_id: Joi.number().allow(null).allow(''),
  user_type: Joi.string().allow(null).required(),
  created_at: Joi.string().required(),
  action_by: Joi.string().allow(null).allow(''),
};
