import gql from 'graphql-tag';

export const AdminCustomersTypeDefs = gql`
  type CustomersListAdmin {
    subscriptionID: String
    userID: Int
    planID: Int
    status: Boolean
    createdAt: Date
    expiredAt: Date
    currentBalance: Int
    name: String
    email: String
    tel: String
    totalrows: Int
  }

  input CustoemrListFilter {
    startDate: String
    endDate: String
    search: String
    pageSize: Int
    currentPage: Int
  }

  extend type Query {
    getCustomersListAdmin(filters: CustoemrListFilter): [CustomersListAdmin]
  }
`;

// extend type Mutation {
//   onContactUpdateSubscription(route: AudienceViewType): UpdateContact
// }
