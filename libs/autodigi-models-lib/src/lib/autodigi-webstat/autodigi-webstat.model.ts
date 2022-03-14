import * as Joi from 'joi';
export interface DashboardWebstat {
  day: string[];
  visitor_total: Visitortotal[];
  visitor_gateway: Visitorgateway[];
  clickday?: string[];
  click: Click[];
}
export interface Visitortotal {
  new: number[];
  return: number[];
  total: number[];
  mobile: number[];
  tablet: number[];
  desktop: number[];
  unknown: number[];
}
export interface Visitorgateway {
  google_seo?: number[];
  google_ads?: number[];
  social: number[];
  link: number[];
  direct: number[];
  unknown: number[];
  displaynetwork: number[];
  youtubesearch: number[];
  youtubevideo: number[];
  other: number[];
  others?: number[];
  google?: number[];
  googleads?: number[];
  total?: number[];
}

export interface Click {
  line: number[];
  messenger: number[];
  form: number[];
  call: number[];
  location: number[];
  total?: number[];
}
export interface DateData {
  start_date: string;
  end_date: string;
}
export interface webstatsInput {
  start_date: string;
  end_date: string;
  date_range: string;
}

export interface FindWebstat {
  website_id: string;
  createdate?: FilterData;
}
export interface FilterData {
  $gte: Date;
  $lte: Date;
}
export interface DashboardDomain {
  day?: string[];
  domain: string[];
  total: number[];
}
export interface Visitor {
  Visitor: number;
  New: number;
  Old: number;
}
export interface VisitorResult {
  Date: Visitor;
  Compare: Visitor;
  Diff: number;
  Percentage: string;
  Status: string;
}
export interface DashboardSummary {
  Type: string;
  Result: VisitorResult;
}

export interface RangeFormat {
  date: string;
  compare: string;
  currentRange?: string[];
  compareRange?: string[];
}
export interface SummaryDateRange {
  today: RangeFormat;
  yesterday: RangeFormat;
  sevendaysago: RangeFormat;
  thirtydaysago: RangeFormat;
}
export const schemaVisitor = {
  Visitor: Joi.number(),
  Old: Joi.number(),
  New: Joi.number(),
};
export const schemaResult = {
  Date: schemaVisitor,
  Compare: schemaVisitor,
  Diff: Joi.number(),
  Percentage: Joi.string().empty(''),
  Status: Joi.string().empty(''),
};
export const getSummarySchema = {
  Type: Joi.string(),
  Result: schemaResult,
};
export const schemaVisitorGateway = {
  total: Joi.array().items(Joi.number()),
  social: Joi.array().items(Joi.number()),
  link: Joi.array().items(Joi.number()),
  direct: Joi.array().items(Joi.number()),
  google: Joi.array().items(Joi.number()),
  googleads: Joi.array().items(Joi.number()),
  others: Joi.array().items(Joi.number()),
};

export const schemaVisitorTotal = {
  new: Joi.array().items(Joi.number()),
  return: Joi.array().items(Joi.number()),
  total: Joi.array().items(Joi.number()),
  mobile: Joi.array().items(Joi.number()),
  tablet: Joi.array().items(Joi.number()),
  desktop: Joi.array().items(Joi.number()),
  unknown: Joi.array().items(Joi.number()),
};

export const schemaClick = {
  total: Joi.array().items(Joi.number()),
  line: Joi.array().items(Joi.number()),
  messenger: Joi.array().items(Joi.number()),
  form: Joi.array().items(Joi.number()),
  call: Joi.array().items(Joi.number()),
  location: Joi.array().items(Joi.number()),
};

export const getAllWebstatSchema = {
  day: Joi.array().items(Joi.string()),
  clickday: Joi.array().items(Joi.string()),
  visitor_total: Joi.array().items(schemaVisitorTotal),
  visitor_gateway: Joi.array().items(schemaVisitorGateway),
  click: Joi.array().items(schemaClick),
};

export const getAllDomainsSchema = {
  domain: Joi.array().items(Joi.string()),
  total: Joi.array().items(Joi.number()),
};
