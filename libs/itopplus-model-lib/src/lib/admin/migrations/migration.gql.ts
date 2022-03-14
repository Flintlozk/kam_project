import gql from 'graphql-tag';

export const AdminMigrationsTypeDefs = gql`
  extend type Mutation {
    doMigratePageApplicationScope: HTTPResult
  }
`;

// extend type Mutation {
//   onContactUpdateSubscription(route: AudienceViewType): UpdateContact
// }
