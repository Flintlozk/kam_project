import gql from 'graphql-tag';

export interface ISubscriptionActiveHistoryModel {
  subscription_id: string;
  actived_date: Date;
  expired_date: Date;
}

export interface IRequestToken {
  from: string;
  request: string;
}

export const SubscriptionActiveHistoryTypeDefs = gql`
  "SubscriptionActiveHistory Schema"
  type SubscriptionModel {
    id: String
    planId: Int
    planName: String
    status: Boolean
    role: EnumUserSubscriptionType
    expiredAt: Date
    isExpired: Boolean
  }

  extend type Mutation {
    createSubscriptionActiveHistory(subscriptionID: String): HTTPResult
  }
`;
