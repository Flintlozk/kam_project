export interface IDashboardWidgets {
  total_revenue: number;
  total_unpaid: number;
  all_customers: number;
  new_customers: number;
  old_customers: number;
  inbox_audience: number;
  comment_audience: number;
  live_audience: number;
  leads_follow: number;
  leads_finished: number;
  automated_guest_leads: number;
  total_sla: number;
}
export interface IDashboardOrders {
  follow_customers: number;
  waiting_for_payment_customers: number;
  confirm_payment_customers: number;
  waiting_for_shipment_customers: number;
  closed_customers: number;
}

export interface IDashboardCustomers {
  date: string;
  customers_per_day: number;
}

export interface IDashboardAudience {
  date: string;
  audience_per_day: number;
}

export interface IDashboardLeads {
  date: string;
  leads_by_day: number;
}

export interface DashboardFilters {
  startDate: string;
  endDate: string;
}
export interface IDateGap {
  gap: number;
  unit: DateUnit;
}
export enum DateUnit {
  HOUR = 'hour',
  DAY = 'day',
  MONTH = 'month',
  YEAR = 'year',
  SECOND = 'second',
}
