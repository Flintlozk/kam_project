import gql from 'graphql-tag';

export const GET_AUDIENCE_ALL_STATS = gql`
  query getDashboardMessageStats($filter: IAudienceMessageFilter) {
    getDashboardMessageStats(filter: $filter) {
      inbox_audience
      comment_audience
      live_audience
      order_audience
      lead_audience
      follow_audience
      unread_audience
    }
  }
`;
