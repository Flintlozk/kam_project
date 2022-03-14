import * as Joi from 'joi';
import * as JoiDate from 'joi-date-dayjs';
Joi.extend(JoiDate);

export const responseDashboardWidgets = {
  total_revenue: Joi.number(),
  total_unpaid: Joi.number(),
  all_customers: Joi.number(),
  new_customers: Joi.number(),
  old_customers: Joi.number(),
  inbox_audience: Joi.number(),
  comment_audience: Joi.number(),
  live_audience: Joi.number(),
  leads_follow: Joi.number(),
  leads_finished: Joi.number(),
  follow_customers: Joi.number(),
  waiting_for_payment_customers: Joi.number(),
  confirm_payment_customers: Joi.number(),
  waiting_for_shipment_customers: Joi.number(),
  closed_customers: Joi.number(),
  automated_guest_leads: Joi.number(),
};

export const validateResponseDashboardCustomers = {
  date: Joi.string(),
  customers_per_day: Joi.number(),
};
export const validateResponseDashboardOrder = {
  total: Joi.number().allow(null),
  step1: Joi.number().allow(null),
  step2: Joi.number().allow(null),
  step3: Joi.number().allow(null),
  step4: Joi.number().allow(null),
  step5: Joi.number().allow(null),
};

export const validateResponseDashboardMessage = {
  inbox_audience: Joi.number().allow(null),
  comment_audience: Joi.number().allow(null),
  live_audience: Joi.number().allow(null),
  order_audience: Joi.number().allow(null),
  lead_audience: Joi.number().allow(null),
  follow_audience: Joi.number().allow(null),
  unread_audience: Joi.number().allow(null),
};
