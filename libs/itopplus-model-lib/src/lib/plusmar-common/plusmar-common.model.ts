import gql from 'graphql-tag';

import { ICatSubCatHolder } from '../product/product-category-model';
import { PaidFilterEnum } from '../audience/audience.model';
import { AudienceDomainType } from '../audience/audience-history.model';
import { IAudienceTagsFilter } from '../audience';
import { EPageMessageTrackMode } from '@reactor-room/itopplus-model-lib';

export interface IProductCrudItems {
  updateMainItem: ICatSubCatHolder[];
  updateSubItem: ICatSubCatHolder[];
  insertSubItem: ICatSubCatHolder[];
  deleteSubItem: ICatSubCatHolder[];
}

export interface RadioFields {
  value: any;
  label: string;
  validator: any;
  errorMessage: string;
  tooltip?: string;
  disabled?: boolean;
}

export interface IAliases {
  domain?: AudienceDomainType[];
  pageID?: number;
  startDate?: string;
  endDate?: string;
  currentPage?: number;
  search?: string;
  pageSize?: number;
  page?: number;
  status?: string;
  customer_tag?: number;
  notIncludeFilter?: boolean;
  orderBy?: string[];
  orderMethod?: string;
  exportAllRows?: boolean;
  isNotify?: boolean;
  tags?: IAudienceTagsFilter[];
  tagList?: string;
  noTag?: boolean;
  exceedSla?: boolean;
  alertTime?: string;
  exceedTime?: string;
  slaConfig?: {
    all: boolean;
    almost: boolean;
    over: boolean;
  };
}

export interface IArgGqlTableFilters {
  filters: IAliases;
  type: EPageMessageTrackMode;
}

export interface IArgGqlTableFiltersPaidType extends IArgGqlTableFilters {
  paidType: PaidFilterEnum;
}

export const PlusmarCommonTypeDefs = gql`
  input ProductFilterInput {
    search: String
    currentPage: Int
    pageSize: Int
    orderBy: [String]
    orderMethod: String
  }

  input ProductCategoryHolderInput {
    id: Int
    name: String
    subCatID: Int
    type: String
  }
`;
