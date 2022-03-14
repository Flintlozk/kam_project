export interface ILogisticsBundle {
  expires_at: string;
  total: number;
  spent: number;
  id: number;
  suffix: string;
  prefix: string;
  from: string;
  to: string;
}

export interface ILogisticsOperator {
  key: string; // same as name of svg logo
  title: string;
  bundles: ILogisticsBundle[];
  logistic_operator_id: number;
  total: number;
  spent: number;
}

export enum EnumLogisticOperator {
  THAIPOST = 1,
  J_AND_T = 2,
  EMS = 3,
  THAIPOST_COD = 4,
}

export interface ILogisticsBundleSQLResponse {
  id: number;
  total: number;
  spent: number;
  expires_at: string;
  title: string;
  key: string;
  logistic_operator_id: number;
  from: string;
  to: string;
  prefix: string;
  suffix: string;
}

export interface ILogisticsBundleInput {
  expires_at: string;
  from: string;
  to: string;
  logistic_operator_id: number;
  total?: number;
  spent?: number;
  suffix?: string;
  prefix?: string;
}

export interface ILogisticOperators {
  id: number;
  title: string;
  key: string;
}

export interface IDropOffTrackingNumber {
  id: number;
  spent: number;
  from: number;
  to: number;
  suffix: string;
  prefix: string;
}
