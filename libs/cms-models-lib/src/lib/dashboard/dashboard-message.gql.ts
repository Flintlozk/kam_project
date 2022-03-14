import gql from 'graphql-tag';

export const DashboardMessageTypeDefs = gql`
  enum AudienceContactStatus {
    ALL
    ACTIVE
    INACTIVE
  }
  input IAudienceMessageFilter {
    searchText: String
    tags: [DashboardTagsFilter]
    noTag: Boolean
    contactStatus: AudienceContactStatus
    domainType: [String]
    domainStatus: [String]
  }
  input DashboardTagsFilter {
    id: Int
    name: String
  }
  type AudienceStats {
    inbox_audience: Int
    comment_audience: Int
    live_audience: Int
    order_audience: Int
    lead_audience: Int
    follow_audience: Int
    unread_audience: Int
  }
  extend type Query {
    getDashboardMessageStats(filter: IAudienceMessageFilter): AudienceStats
  }
`;
