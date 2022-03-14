import gql from 'graphql-tag';

export const AdminLogisticsTypeDefs = gql`
  enum LogisticSystemType {
    PRICING_TABLE
    FLAT_RATE
    FIXED_RATE
  }

  type LogisticsBundle {
    expires_at: Date
    total: Int
    spent: Int
    id: Int
    from: String
    to: String
    suffix: String
    prefix: String
  }

  type LogisticsOperator {
    key: String
    title: String
    bundles: [LogisticsBundle]
    total: Int
    spent: Int
    logistic_operator_id: Int
  }

  input LogisticsBundleInput {
    expires_at: String
    from: String
    to: String
    logistic_operator_id: Int
  }

  extend type Query {
    getLogisticBundles: [LogisticsOperator]
  }

  extend type Mutation {
    addLogisticBundle(input: LogisticsBundleInput): HTTPResult
    deleteBundle(id: Int): HTTPResult
  }
`;

// extend type Mutation {
//   onContactUpdateSubscription(route: AudienceViewType): UpdateContact
// }
