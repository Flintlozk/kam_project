import gql from 'graphql-tag';

export const GET_ORDER_LIST_COUNT_WATCH_QUERY = gql`
  query getDashboardOrderStats($query: DashboardListInput) {
    getDashboardOrderStats(query: $query) {
      total
      step1
      step2
      step3
      step4
      step5
    }
  }
`;
