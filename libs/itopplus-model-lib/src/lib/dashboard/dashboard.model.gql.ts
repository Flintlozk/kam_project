import gql from 'graphql-tag';

export const DashboardTypeDefs = gql`
  "Dashboard Schema"
  type DashboardWidgetsModel {
    total_revenue: Float
    total_unpaid: Float
    all_customers: Int
    new_customers: Int
    old_customers: Int
    inbox_audience: Int
    comment_audience: Int
    live_audience: Int
    leads_follow: Int
    leads_finished: Int
    follow_customers: Int
    waiting_for_payment_customers: Int
    confirm_payment_customers: Int
    waiting_for_shipment_customers: Int
    closed_customers: Int
    automated_guest_leads: Int
    total_sla: Int
  }
  type DashboardOrdersModel {
    follow_customers: Int
    waiting_for_payment_customers: Int
    confirm_payment_customers: Int
    waiting_for_shipment_customers: Int
    closed_customers: Int
  }

  type DashboardCustomersModel {
    date: String
    customers_per_day: Int
  }

  type DashboardAudienceModel {
    date: String
    audience_per_day: Int
  }

  type DashboardLeadsModel {
    date: String
    leads_by_day: Int
  }

  input DashboardFiltersInput {
    startDate: String
    endDate: String
  }

  extend type Query {
    getDashboardWidgets(filters: DashboardFiltersInput): DashboardWidgetsModel
    getDashboardOrders(filters: DashboardFiltersInput): DashboardOrdersModel
    getDashboardCustomers(filters: DashboardFiltersInput): [DashboardCustomersModel]
    getDashboardAudience(filters: DashboardFiltersInput): [DashboardAudienceModel]
    getDashboardLeads(filters: DashboardFiltersInput): [DashboardLeadsModel]
  }
`;
