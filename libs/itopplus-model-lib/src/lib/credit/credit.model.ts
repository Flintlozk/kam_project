export enum EnumCreditPaymentStatus {
  COMPLETED = 'COMPLETED',
  CANCELLED = 'CANCELLED',
  PENDING = 'PENDING',
}

export interface ICreditPaymentHistory {
  id: number;
  subscription_id: string;
  page_id: number;
  order_id: number;
  credit: string;
  credit_remain: string;
  description: string;
  status: EnumCreditPaymentStatus;
  created_at: Date;
}
