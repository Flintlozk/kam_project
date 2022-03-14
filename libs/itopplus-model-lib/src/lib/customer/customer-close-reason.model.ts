import gql from 'graphql-tag';

export interface ICloseAudienceWebhookParams {
  customer_id: number;
  audience_id: number;
  topic: string;
  amount_chat: number;
  description: string;
  startdate: Date;
  enddate: Date;
}

export interface ICustomerCloseReasonMapping {
  id: number;
  page_id: number;
  audience_id: number;
  reason_id: number;
  description: string;
  created_at: Date;
}
export interface ICustomerCloseReason {
  id: number;
  reason: string;
}

export interface IInputAddAudienceReason {
  reasonID: number;
  description: string;
  closeTime: Date;
}

export interface ICustomerCloseReasonInput {
  input: { reasons: ICustomerCloseReason[] };
}

export const CustomerCloseReasonTypeDefs = gql`
  type CustomerCloseReason {
    id: Int
    reason: String
  }
  input InputCustomerCloseReason {
    id: Int
    reason: String
  }

  input InputCustomerCloseReasons {
    reasons: [InputCustomerCloseReason]
  }

  input InputAddAudienceReason {
    reasonID: Int
    description: String
  }
  extend type Query {
    getCustomerClosedReasons: [CustomerCloseReason]
  }
  extend type Mutation {
    setCustomerClosedReason(input: InputCustomerCloseReasons): Boolean
    deleteCustomerClosedReason(id: Int): Boolean
    addReasonToAudience(audienceID: Int, params: InputAddAudienceReason): Boolean
  }
`;
