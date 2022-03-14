import gql from 'graphql-tag';

import { FacebookTemplateButtonType, FacebookWebViewHeight } from '../message-model/message.model';
import { PipelineStepTypeEnum, IFacebookPipelineStepTemplateType } from './pipeline-steps.enum';

export interface IFacebookPipelineStepModel {
  _id?: string;
  type: PipelineStepTypeEnum;
  text: string;
  template_type: IFacebookPipelineStepTemplateType;
  elements: IFacebookPipelineStepElements[];
  recipient_name: string;
  order_number: string;
  currency: string;
  payment_method: string;
  order_url: string;
  timestamp: string;
  address: IFacebookPipelineStepAddress;
  summary: IFacebookPipelineStepSummary;
  adjustments: IFacebookPipelineStepAdjustments[];
  status: string;
}

export interface IFacebookPipelineStepElements {
  title: string;
  subtitle: string;
  url: string;
  image_url: string;
  buttons: IFacebookPipelineStepElementButtons[];
}

export interface IFacebookPipelineStepElementButtons {
  type?: FacebookTemplateButtonType;
  url?: string;
  title?: string;
  payload?: string;
  webview_height_ratio?: FacebookWebViewHeight;
  messenger_extensions?: boolean;
  template_type?: IFacebookPipelineStepTemplateType;
}

export interface IFacebookPipelineStepAddress {
  street_1: string;
  street_2: string;
  city: string;
  postal_code: string;
  state: string;
  country: string;
}

export interface IFacebookPipelineStepSummary {
  subtotal: string;
  shipping_cost: string;
  total_tax: string;
  total_cost: string;
}

export interface IFacebookPipelineStepAdjustments {
  name: string;
  amount: string;
}

export const FacebookPipelineStepsTypeDefs = gql`
  "Facebook Pipeline Steps"
  type FacebookPipelineStepModel {
    _id: ID
    type: String
    elements: [FacebookPipelineStepElements]
    template_type: String
    status: String
  }

  type FacebookPipelineStepElements {
    title: String
    subtitle: String
    url: String
    image_url: String
    message_type: String
    buttons: [FacebookPipelineStepElementButtons]
    default_action: FacebookPipelineStepDefaultAction
    media_type: String
    attachment_id: String
    quantity: Float
    price: Float
    currency: String
  }

  type FacebookPipelineStepDefaultAction {
    type: String
    url: String
    webview_height_ratio: String
  }

  type FacebookPipelineStepElementButtons {
    url: String
    type: String
    title: String
    payload: String
    messenger_extensions: Boolean
    webview_height_ratio: String
  }

  input FacebookPipelineStepElementsInput {
    title: String
    subtitle: String
    url: String
    image_url: String
    message_type: String
    buttons: [FacebookPipelineStepElementButtonsInput]
    default_action: FacebookPipelineStepDefaultActionInput
    media_type: String
    attachment_id: String
    quantity: Float
    price: Float
    currency: String
  }

  input FacebookPipelineStepDefaultActionInput {
    type: String
    url: String
    webview_height_ratio: String
  }

  input FacebookPipelineStepElementButtonsInput {
    url: String
    type: String
    title: String
    payload: String
    messenger_extensions: Boolean
    webview_height_ratio: String
  }

  input FacebookPipelineStepInput {
    type: String
    text: String
    elements: [FacebookPipelineStepElementsInput]
    template_type: String
    status: String
    recipient_name: String
    order_number: String
    currency: String
    payment_method: String
    order_url: String
    timestamp: String
    address: FacebookPipelineAddressInput
    summary: FacebookPipelineSummaryInput
    adjustments: [FacebookPipelineAdjustmentInput]
  }

  input FacebookPipelineSummaryInput {
    subtotal: Float
    shipping_cost: Float
    total_tax: Float
    total_cost: Float
  }

  input FacebookPipelineAddressInput {
    street_1: String
    street_2: String
    city: String
    postal_code: String
    state: String
    country: String
  }

  input FacebookPipelineAdjustmentInput {
    name: String
    amount: Float
  }

  extend type Query {
    getStepByID(ID: String): FacebookPipelineStepModel
  }

  extend type Mutation {
    addPipelineStep(step: FacebookPipelineStepInput): FacebookPipelineStepModel
  }
`;
