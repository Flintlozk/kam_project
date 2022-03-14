import * as Joi from 'joi';
import gql from 'graphql-tag';
import * as dayjs from 'dayjs';
import * as utc from 'dayjs/plugin/utc';
import { FacebookMessageTagEvent, FacebookMessagingType, IFacebookMessagePayloadTypeEnum } from '../../facebook/message-model/message.model';
import { IFacebookPipelineStepElementButtons, IFacebookPipelineStepElements } from '../../facebook/pipeline-model/pipeline-steps.model';
import { EnumLeadPayloadType } from '../../leads/leads.model';
import { EnumPurchaseOrderStatus, EnumPurchasingPayloadType } from '../../purchase-order/purchase-order.enum';
import { ViewRenderType } from '../../view-render/view-render.model';
import { IFacebookPipelineStepTemplateType } from './pipeline-steps.enum';
dayjs.extend(utc);

export interface IPayloadContainer {
  name: string;
  json: IFormPayloadData; // TODO : Messages interface
  mid?: string;
}

export interface IFormPayloadSummary {
  subtotal: number;
  shipping_cost: number;
  total_tax: number;
  total_cost: number;
}
export interface IFormPayloadAddress {
  street_1?: string;
  street_2?: string; //optional
  city?: string;
  postal_code?: string;
  state?: string;
  country?: string;
}
export interface IPromotions {
  name: string;
  amount: number;
}
export interface ITemplateCard {
  attachment_id?: string;
  template_type?: IFacebookPipelineStepTemplateType;
  order_number?: string;
  recipient_name?: string;
  merchant_name?: string;
  adjustments?: IPromotions[];
  address?: IFormPayloadAddress;
  summary?: IFormPayloadSummary;
  currency?: string;
  payment_method?: string;
  order_url?: string;
  timestamp?: number;
  text?: string;
  buttons?: IFacebookPipelineStepElementButtons[];
  elements?: [
    {
      title?: string;
      subtitle?: string;
      price?: number;
      quantity?: number;
      image_url?: string;
      default_action?: IFacebookPipelineStepElementButtons;
      buttons?: IFacebookPipelineStepElementButtons[];
    },
  ];
}

export interface IFormPayloadData {
  recipient: {
    id?: string;
    comment_id?: string;
  };
  message: {
    text?: string;
    attachment?: {
      payload?: ITemplateCard;
      text?: string;
      template_type?: IFacebookPipelineStepTemplateType;
      type?: IFacebookMessagePayloadTypeEnum;
    };
    metadata?: string;
  };
  messaging_type?: FacebookMessagingType;
  tag?: FacebookMessageTagEvent;
}

export interface IFacebookPipelineModel {
  _id?: string;
  audience_id: number;
  page_id: number;
  form_id: string | null; // postgress id ( form )
  steps: []; // array of object pipline step id // the flow of step
  // Keep the _id from pipeline_step
  status: string; // complete | incomplete
  pipeline: EnumPurchaseOrderStatus; // follow step
  payment_id: number;
  bank_account_id: number;
  logistic_id: number;
  psid: string;
  order_id: number;
  createdAt: Date;
  updatedAt: Date;
  is_auto: boolean;
  is_flat_rate: boolean;
  customer_id: number;
}

// export interface IFacebookPipelineModelInput {
//   form_id?: number;
//   page_id?: number;
//   audience_id: number;
// }

export interface IFacebookPipelineStepPayload {
  recipient: {
    id: string;
  };
  message: {
    attachment: {
      type: string;
      payload: {
        template_type: string;
        elements: IFacebookPipelineStepElements[];
      };
    };
  };
  // Send message outside of window, always
  tag: FacebookMessageTagEvent;
  messaging_type: FacebookMessagingType;
}

export interface WebhookQueries {
  // type: EnumPurchasingPayloadType; // will implement on each route
  psid: string;
  audienceId: string;
  auth: string;
  view: ViewRenderType;
  hash?: string;
}
export interface WebhookPurchaseTemplateQueries extends WebhookQueries {
  type: EnumPurchasingPayloadType;
  productId: string;
}

export interface WebhookQuickPayTemplateQueries extends WebhookQueries {
  type: EnumPurchasingPayloadType;
  quickPayId: string;
}

export interface WebhookProductCatalogTemplateQueries extends WebhookQueries {
  type: EnumPurchasingPayloadType;
  catalogID: string;
  page: number;
  categoryIDs: any;
  tagIDs: any;
  search: string;
}

export interface WebhookProductCatalogCartTemplateQueries extends WebhookQueries {
  type: EnumPurchasingPayloadType;
  catalogID: string;
}

export interface WebhookProductCatalogFilterTemplateQueries extends WebhookQueries {
  type: EnumPurchasingPayloadType;
  catalogID: string;
  categoryIDs: [];
  tagIDs: [];
  search: string;
}

export interface WebhookProductCatalogVariantTemplateQueries extends WebhookQueries {
  type: EnumPurchasingPayloadType;
  catalogID: string;
  productID: number;
}

export interface WebhookLeadTemplateQueries extends WebhookQueries {
  type: EnumLeadPayloadType;
  formId: string;
  ref: string;
}

export enum EnumQuationPayloadType {
  // should move to its model
  SAMPLE = 'SAMPLE', // should delete SAMPLE upon type defines
}

export interface WebhookQuotationTemplateQueries extends WebhookQueries {
  type: EnumQuationPayloadType;
}

export enum WebviewType {
  LEAD_FORM = 'LEAD_FORM',
  PURCHASE = 'PURCHASE',
}

// Additional payload keys to attach
export const IFacebookPipelineStepAdditionalKeys = [
  'text',
  'adjustments',
  'address',
  'summary',
  'recipient_name',
  'order_number',
  'currency',
  'payment_method',
  'order_url',
  'timestamp',
];

export enum PipelineStepFiles {
  CONTACT_INFO_FORM = 'https://www.facebook.com/greanapp/photos/a.1651632451641480/1664369440367781',
  SELECT_PAYMENT = 'https://www.facebook.com/DSRepair/photos/a.3118685791547691/3118685741547696',
  // eslint-disable-next-line max-len
  RECEIVE_ORDER = 'https://scontent.fbkk12-4.fna.fbcdn.net/v/t1.0-9/109502388_3118692284880375_4790269069668458914_n.png?_nc_cat=110&_nc_sid=8024bb&_nc_eui2=AeH__6ROzV5rBgaw1IHxl58b_LR2A2Piy_38tHYDY-LL_axn-v4fQwXux8G1QS-KjMI&_nc_ohc=-uxX0nEN0CMAX9XQkl3&_nc_ht=scontent.fbkk12-4.fna&oh=54bf62c7ec1a82f8e2ba18aade607a91&oe=5F37272C',
}

export const FacebookPipelineTypeDefs = gql`
  "Facebook Pipeline Messages"
  type FacebookPipelineModel {
    _id: ID
    audience_id: Int
    page_id: Int
    form_id: Int
    steps: [String]
    status: String
    createdAt: Date
    updatedAt: Date
    pipeline: String
    payment_id: Int
    bank_account_id: Int
    logistic_id: Int
    psid: String
    order_id: Int
    is_auto: Boolean
  }

  input FacebookPipelineModelInput {
    _id: ID
    audience_id: Int
    page_id: Int
    form_id: Int
    steps: [String]
    status: String
    createdAt: Date
  }

  extend type Mutation {
    sendPayload(audienceID: Int, psid: String, step: String, platform: String): FacebookPipelineStepModel
    sendFormPayload(audienceID: Int, psid: String, formID: Int): FacebookPipelineStepModel
    sendFormLinePayload(audienceID: Int, formID: Int): FacebookMessageModel
  }
`;

export interface InputSendFormPayloadHandler {
  audienceID: number;
  psid: string;
  formID: number;
}

export const requestSendFormPayloadInput = {
  audienceID: Joi.number().required(),
  psid: Joi.string().required(),
  formID: Joi.number().required(),
};

export const requestSendFormLinePayloadInput = {
  audienceID: Joi.number().required(),
  formID: Joi.number().required(),
};
