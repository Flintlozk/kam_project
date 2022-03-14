import * as Joi from 'joi';
import gql from 'graphql-tag';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { LeadsDomainStatus } from '../audience/audience-history.model';
import { IPages } from '../pages/pages.model';
import { ViewRenderType } from '../view-render/view-render.model';
dayjs.extend(utc);

export const LEAD_FORM_SUBMIT_WEBVIEW = 'LEAD_FORM_SUBMIT_WEBVIEW';

export enum LeadStatusEnum {
  NEW_LEAD = 'NEW_LEAD',
  DUPLICATE_NAME = 'DUPLICATE_NAME',
  DUPLICATE_NAME_EMAIL = 'DUPLICATE_NAME_EMAIL',
  DUPLICATE_NAME_MOBILE = 'DUPLICATE_NAME_MOBILE',
  DUPLICATE_EMAIL = 'DUPLICATE_EMAIL',
  DUPLICATE_EMAIL_MOBILE = 'DUPLICATE_EMAIL_MOBILE',
  DUPLICATE_MOBILE = 'DUPLICATE_MOBILE',
  DUPLICATE_ALL = 'DUPLICATE_ALL',
}
export enum LeadStatusTHEnum {
  NEW_LEAD = 'เบอร์ใหม่',
  DUPLICATE_NAME = 'ชื่อซ้ำ',
  DUPLICATE_NAME_EMAIL = 'ชื่อและอีเมล์ซ้ำ',
  DUPLICATE_NAME_MOBILE = 'ชื่อและเบอร์ซ้ำ',
  DUPLICATE_EMAIL = 'อีเมล์ซ้ำ',
  DUPLICATE_EMAIL_MOBILE = 'อีเมล์และเบอร์ซ้ำ',
  DUPLICATE_MOBILE = 'เบอร์ซ้ำ',
  DUPLICATE_ALL = 'ข้อมูลซ้ำ',
}

export interface ICustomerLeadOption {
  value: string;
  name: string;
}
export interface ICustomerLead {
  formName: string;
  audienceID: number;
  customerID: number;
  updatedAt: Date;
  options: ICustomerLeadOption[];
  isFollow: boolean;
  totalrows: number;
}

export interface ILeadsForm {
  id: number;
  name: string;
  page_id: number;
  audience_id: number;
  greeting_message: string;
  thank_you_message: string;
  button_input: string;
  created_at: Date;
}
export interface ILeadsFormWithComponents extends ILeadsForm {
  description?: string;
  components: ILeadsFormComponent[];
}
export interface ILeadsFormSubmissionSubscription {
  onLeadFormSubmitSubscription: ILeadsFormSubmission;
}

export interface AudienceLead {
  form_id: number;
  ref: string;
}

export interface ILeadFormPage {
  page: IPages;
}

export interface IFacebookLeadFormPipelineModel {
  _id?: string;
  audienceId: number;
  customerId: number;
  parentAudienceId: number | null;
  pageId: number;
  formId: number; // postgress id ( form )
  status: LeadsDomainStatus; // complete | incomplete
  psid: string;
  createdAt?: Date;
  updatedAt?: Date;
  ref?: string;
}

export interface ILeadsFormInput {
  name: string;
  page_id?: number;
  audience_id?: number;
}

export interface ILeadsUpdateQuery {
  audienceId: number;
  formId: string;
  psid?: string;
  pageId: number;
}

export interface ILeadsManualFormInput {
  name: string;
  customerId: number;
  audienceId: number;
  formId: number;
  formJson: string;
  user_id?: number;
}
export interface IManualRefFormInput extends ILeadsManualFormInput {
  ref: string;
}

export enum LeadViewMode {
  CREATE = 'CREATE',
  READONLY = 'READONLY',
  EDIT = 'EDIT',
  FILL_FORM = 'FILL_FORM',
}

export interface ILeadsFormWithComponentsSelected extends ILeadsFormWithComponents {
  selected: boolean;
}

export interface ILeadsFormSubmission {
  id: number;
  page_id: number;
  form_id: number;
  audience_id: number;
  options: string;
  created_at: string;
  name: string;
}

export enum LeadFormSubmissionType {
  MANUAL_INPUT = 'MANUAL_INPUT',
  MANUAL_FORM_REF = 'MANUAL_FORM_REF',
  AUTO_FORM_REF = 'AUTO_FORM_REF',
}

export enum EnumLeadPayloadType {
  CUSTOM_FORM = 'CUSTOM_FORM',
  PURCHASE = 'PURCHASE',
}

export interface LeadPostbackMessage {
  auth: string;
  audienceId: string;
  response_type: string;
  psid: string;
}

export interface ILeadPostbackForm {
  formId: string;
  formJson: string;
  ref: string;
  view: ViewRenderType;
}

export interface LeadPayloadOption {
  title: string;
  button: string;
  // greetingMessage: string;
  // thankYouMessage: string;
  // buttonInput: string;
}

export interface ILeadsFormSubmissionInput {
  customer_id: number;
  audience_id: number;
  form_id: number;
  options: string;
}

export interface ILeadsFormComponent {
  id: number;
  form_id: number;
  type: string;
  options: ILeadsFormComponentOptions;
  index: number;
  name?: string;
  value?: string;
}

export interface ILeadsFormComponentOptions {
  label: string;
  controlName: string;
  translation: ILeadFormControlTranslation[];
  validation: ILeadFormControlValidation[];
}

export interface ILeadFormControlValidation {
  rules: string;
  errorMessage: string;
  translation: ILeadFormControlTranslation[];
}

export interface ILeadFormControlTranslation {
  langID: string;
  langName: string;
  langValue: string;
  default?: boolean;
}

export interface ILeadsFormComponentSubmissionOptions {
  label: string;
  value: string;
  required: boolean;
  controlName: string;
}

export interface ILeadsFormComponentInput {
  created_at?: Date;
  form_id: number;
  type: string;
  options: ILeadsFormComponentOptions;
  index: number;
}
export interface IMessageFormInput {
  id: number;
  pageid: string;
  greeting_message: string;
  thank_you_message: string;
  button_input: string;
}
export interface ILeadsFormReferral {
  id: number;
  form_id: number;
  page_id: number;
  ref: string;
  created_at: Date;
}

export interface ILeadsFormReferralInput {
  form_id: number;
  page_id: number;
  audience_id?: number;
  customer_id?: number;
}

export const LeadsTypeDefs = gql`
  "Leads Schema"
  type LeadsFormModel {
    id: Int
    name: String
    page_id: Int
    audience_id: Int
    created_at: Date
  }

  type LeadsFormReferral {
    id: Int
    form_id: Int
    page_id: Int
    ref: String
    link: String
    created_at: Date
  }

  type LeadFormSubmitModel {
    id: Int
    page_id: Int
    audience_id: Int
    form_id: Int
    options: String
    created_at: String
    name: String
  }

  input LeadsFormInput {
    name: String
    audience_id: Int
  }

  type LeadsFormResult {
    components: [LeadsFormComponent]
  }

  type LeadsFormSubmission {
    id: Int
    page_id: Int
    form_id: Int
    audience_id: Int
    options: String
    created_at: Date
    user_id: ID
    name: String
  }

  input LeadsFormSubmissionInput {
    page_id: Int
    form_id: Int
    audience_id: Int
    options: String
  }

  type LeadsFormComponent {
    id: Int
    form_id: Int
    type: String
    options: LeadsFormComponentOptions
    index: Int
    created_at: Date
  }

  type LeadsFormComponentOptions {
    controlName: String
    label: String
    translation: [LeadFormControlTranslation]
    validation: [LeadFormControlValidation]
  }

  type LeadFormControlValidation {
    rules: String
    errorMessage: String
    translation: [LeadFormControlTranslation]
  }

  type LeadFormControlTranslation {
    langID: String
    langValue: String
    langName: String
    default: Boolean
  }

  input LeadsFormComponentInput {
    id: Int
    form_id: Int
    type: String
    options: LeadsFormComponentOptionsInput
    index: Int
    created_at: Date
  }
  input MessageFormInput {
    id: Int
    pageid: String
    greeting_message: String
    thank_you_message: String
    button_input: String
  }

  input LeadFormControlTranslationInput {
    langID: String
    langName: String
    langValue: String
    default: Boolean
  }

  input LeadFormControlValidationInput {
    rules: String
    errorMessage: String
    translation: [LeadFormControlTranslationInput]
  }

  input LeadsFormComponentOptionsInput {
    controlName: String
    label: String
    translation: [LeadFormControlTranslationInput]
    validation: [LeadFormControlValidationInput]
  }

  type MessageForm {
    greeting_message: String
    thank_you_message: String
  }
  type LeadsFormWithComponents {
    id: Int
    name: String
    page_id: Int
    audience_id: Int
    created_at: Date
    greeting_message: String
    thank_you_message: String
    button_input: String
    description: String
    components: [LeadsFormComponent]
  }

  input LeadsManualFormInput {
    name: String
    audienceId: Int
    customerId: Int
    formId: Int
    formJson: String
    user_id: Int
  }
  input ManualRefFormInput {
    name: String
    audienceId: Int
    formId: Int
    formJson: String
    ref: String
  }

  type AudienceLead {
    form_id: Int
    ref: String
  }
  type CustomerLeadOption {
    value: String
    name: String
  }
  type CustomerLead {
    formName: String
    audienceID: Int
    customerID: Int
    updatedAt: Date
    options: [CustomerLeadOption]
    isFollow: Boolean
    totalrows: Int
  }

  extend type Mutation {
    createForm(formInput: LeadsFormInput): LeadsFormModel
    createManualLeadForm(formInput: LeadsManualFormInput): LeadsFormModel
    manualInputAutomateForm(formInput: ManualRefFormInput): LeadsFormSubmission
    createFormComponent(component: LeadsFormComponentInput): LeadsFormComponent
    createMessageForm(message: MessageFormInput): MessageForm
    cancelCustomerLead(audienceID: Int): HTTPResult
  }

  extend type Query {
    getAllLeadFormOfCustomer(customerID: Int, filters: TableFilterInput): [CustomerLead]
    getLeadFormOfCustomer(audienceID: Int, filters: TableFilterInput): CustomerLead
    getForms: [LeadsFormWithComponents]
    getFormReferral(formID: Int): LeadsFormReferral
    getLeadOfAudienceByID(audienceID: Int): AudienceLead
    getFormByID(ID: Int): LeadsFormWithComponents
    getFormNameByID(ID: Int): LeadsFormModel
    getFormSubmissionByID(ID: Int): LeadsFormSubmission
    getFormSubmissionByFormID(ID: Int): LeadsFormSubmission
    getFormSubmissionByAudienceID(ID: Int): [LeadsFormSubmission]
  }

  extend type Subscription {
    onLeadFormSubmitSubscription(audienceID: Int): LeadFormSubmitModel
  }
`;

export interface InputCreateManualLeadFormHandler {
  formInput: {
    name: string;
    customerId: number;
    audienceId: number;
    formId: number;
    formJson: string;
    user_id: number;
  };
}

export const requestManualLeadFormInput = {
  name: Joi.string().required(),
  customerId: Joi.number().required(),
  audienceId: Joi.number().required(),
  formId: Joi.number().required(),
  formJson: Joi.string().required(),
  user_id: Joi.number(),
};

export const responseManualLeadForm = {
  id: Joi.number().required(),
  page_id: Joi.number().required(),
  form_id: Joi.number().required(),
  audience_id: Joi.number().required(),
  options: Joi.string().required(),
};
export const responseGetAllLeadFormOfCustomer = {
  formName: Joi.string().required(),
  audienceID: Joi.number().required(),
  customerID: Joi.number().required(),
  updatedAt: Joi.date().required(),
  options: Joi.array()
    .items({
      value: Joi.string(),
      name: Joi.string(),
    })
    .allow(null),
  isFollow: Joi.boolean().required(),
  totalrows: Joi.number().optional(),
};
