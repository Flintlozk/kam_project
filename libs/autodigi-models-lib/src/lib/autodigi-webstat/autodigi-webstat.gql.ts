import gql from 'graphql-tag';
export const AutodigiWebstatTypeDefs = gql`
  type DashboardWebstat {
    day: [String]
    clickday: [String]
    visitor_total: [visitor_total]
    visitor_gateway: [visitor_gateway]
    click: [click]
  }
  type visitor_total {
    new: [Int]
    return: [Int]
    total: [Int]
    mobile: [Int]
    tablet: [Int]
    desktop: [Int]
    unknown: [Int]
  }
  type visitor_gateway {
    total: [Int]
    google_seo: [Int]
    google_ads: [Int]
    social: [Int]
    link: [Int]
    direct: [Int]
    unknown: [Int]
    displaynetwork: [Int]
    youtubesearch: [Int]
    youtubevideo: [Int]
    other: [Int]
    google: [Int]
    googleads: [Int]
    others: [Int]
  }
  type click {
    total: [Int]
    line: [Int]
    messenger: [Int]
    form: [Int]
    call: [Int]
    location: [Int]
  }

  input webstatsInput {
    start_date: String
    end_date: String
    date_range: String
    custom_date_from: String
    custom_date_to: String
    mode: String
  }
  type DashboardDomain {
    domain: [String]
    total: [Int]
  }
  type DashboardSummary {
    Type: String
    Result: VisitorResult
  }
  type VisitorResult {
    Date: Visitor
    Compare: Visitor
    Diff: Int
    Percentage: String
    Status: String
  }
  type Visitor {
    Visitor: Int
    Old: Int
    New: Int
  }
  extend type Query {
    getWebstats(webStats: webstatsInput): DashboardWebstat
    getDomain(webStats: webstatsInput): DashboardDomain
    getSummary: [DashboardSummary]
  }
`;
