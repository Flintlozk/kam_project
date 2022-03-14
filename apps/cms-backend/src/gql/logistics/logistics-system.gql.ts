import gql from 'graphql-tag';

export const LogisticsSystemTypeDefs = gql`
  extend type Mutation {
    saveLogisticSystemSetting(options: PageLogisticSystemOptionInput): PageLogisticSystemOption
    toggleLogisticSystemSetting(status: Boolean): Boolean
  }
`;
