export interface ICustomerListAdmin {
  subscriptionID: string;
  userID: number;
  status: boolean;
  planID: number;
  expiredAt: Date;
  createdAt: Date;
  currentBalance: number;
  name: string;
  email: string;
  tel: string;
  totalrows?: number;
}

export interface ICustoemrListFilter {
  startDate?: string;
  endDate?: string;
  search?: string;
  page?: number;
  pageSize?: number;
  currentPage?: number;
}
