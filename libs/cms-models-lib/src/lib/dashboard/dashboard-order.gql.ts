import gql from 'graphql-tag';

export const OrderListTypeDefs = gql`
  input DashboardSlaConfigInput {
    all: Boolean
    almost: Boolean
    over: Boolean
  }
  input DashboardListInput {
    startDate: String
    endDate: String
    search: String
    pageSize: Int
    currentPage: Int
    orderBy: [String]
    orderMethod: String
    domain: [String]
    status: String
    # page_id: Int
    exportAllRows: Boolean
    isNotify: Boolean
    tags: [DashboardTagsFilter]
    noTag: Boolean
    exceedSla: Boolean
    slaConfig: DashboardSlaConfigInput
  }
  type AudienceCounter {
    total: Int
    step1: Int
    step2: Int
    step3: Int
    step4: Int
    step5: Int
  }
  extend type Query {
    getDashboardOrderStats(query: DashboardListInput): AudienceCounter
  }
`;
