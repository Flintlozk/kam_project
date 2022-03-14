import gql from 'graphql-tag';

export const GET_WEBSTATS = gql`
  query getWebstats($webStats: webstatsInput) {
    getWebstats(webStats: $webStats) {
      day
      clickday
      visitor_total {
        new
        return
        total
        mobile
        tablet
        desktop
        unknown
      }
      visitor_gateway {
        total
        direct
        google
        googleads
        link
        social
        others
      }
      click {
        total
        line
        messenger
        call
        form
        location
      }
    }
  }
`;
export const GET_DOMAINS = gql`
  query getDomain($webStats: webstatsInput) {
    getDomain(webStats: $webStats) {
      domain
      total
    }
  }
`;
export const GET_SUMMARY = gql`
  query getSummary {
    getSummary {
      Type
      Result {
        Date {
          Visitor
          Old
          New
        }
        Compare {
          Visitor
          Old
          New
        }
        Diff
        Percentage
        Status
      }
    }
  }
`;
