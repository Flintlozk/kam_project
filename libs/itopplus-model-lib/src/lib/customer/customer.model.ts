import { AudiencePlatformType } from '@reactor-room/model-lib';
import { CustomerCompany, IAudienceTagsFilter, ICustomerTagCRUD } from '@reactor-room/itopplus-model-lib';
import { IUpsertCompany } from './customer-companies';
declare const Buffer;
export interface ICustomerMissing {
  Facebook: {
    ASID: string | null;
  };
}

export interface IArgsCustomerUpdateByForm {
  customer: ICustomerUpdate;
}

export interface ICustomerImage {
  data: typeof Buffer;
  mimeType: string;
  fileName: string;
}

export interface ICustomerNote {
  id: number;
  note: string;
  updated_at?: string;
  name: string;
  customer_id?: number;
  searchText?: boolean; // for client text-search
}

export interface ICustomerAddressData {
  field: string;
  value: string;
  label: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  validator: any[];
  errorMessage: string;
  readonly?: boolean;
}

export interface ICustomerUpdateInfoInput {
  id: number;
  first_name: string;
  last_name: string;
  phone_number: string;
  email: string;
  profile_pic: string;
  location: {
    post_code: string;
    district: string;
    city: string;
    province: string;
    address: string;
  };
  aliases: string;
}

export interface ICustomerOffTimeDetail {
  customerID: number;
  audienceID: number;
  platform: AudiencePlatformType;
  profilePic: string;
  firstName: string;
  lastName: string;
  name: string;
  aliases: string;
  shopName: string;
  shopPicture: string;
}

// TEMP
export interface ICustomerTemp {
  id: number;
  psid: string;
  page_id: number;
  name: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  tags?: ICustomerTagCRUD[];
  location?: {
    address?: string;
    amphoe?: string;
    city?: string;
    district?: string;
    post_code?: string;
    province?: string;
    country?: string;
  };
  active: boolean;
  customer: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile_pic: any;
  profile_pic_updated_at: Date;
  notes: string;
  social: ICustomerSocial;
  customer_type: string;
  nickname: string;
  created_at: Date;
  updated_at: Date;
  Facebook?: ICustomerFacebook;
  totalrows?: number;
  deleted_at?: Date;
  country?: string;
  address?: string;
  blocked?: boolean;
  can_reply?: boolean;
  line_user_id?: string;
  platform?: AudiencePlatformType;
  aliases?: string;
}

export interface ICustomerOpenAPI {
  customers: ICustomerTemp[];
  next?: number;
}

export interface ICustomerUpdate {
  id?: string;
  first_name: string;
  last_name: string;
  email: string;
  phone_number: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile_pic: any;
  notes: string;
  social: ICustomerSocial;
  aliases?: string;
  location?: ShippingAddressLocation;
  company?: IUpsertCompany;
}

export interface SourceShippingAddressLocation {
  amphoe: string;
  address: string;
  district: string;
  lastname: string;
  province: string;
  firstname: string;
  postCode: string;
}
export interface ShippingAddressLocation {
  address?: string;
  amphoe?: string;
  district?: string;
  post_code?: string;
  province?: string;
  country?: string;
  city?: string;
}
export interface CustomerShippingAddress extends CustomerAddress {
  id: number;
  customer_id: number;
  purchase_order_id: number;
  page_id: number;
  is_confirm: boolean;
  created_at: Date;
}

export interface CustomerAddress {
  name: string;
  first_name: string;
  last_name: string;
  phone_number: string;
  location: ShippingAddressLocation;
}
export interface CustomerAddressFromGroup {
  address: string;
  city: string;
  country: string;
  district: string;
  name: string;
  phoneNo: string;
  postalCode: string;
  province: string;
}

export interface ICustomerTempInput {
  psid?: string;
  fb_page_id?: string;
  name?: string;
  email?: string;
  phone_number?: string;
  address?: string;
  district?: string;
  province?: string;
  country?: string;
  active?: boolean;
  canReply?: boolean;
  line_user_id?: string;
}

export interface ICustomerSocial {
  Facebook?: string;
  Line?: string;
  Instagram?: string;
  Twitter?: string;
  Google?: string;
  Youtube?: string;
}

export interface ICustomerFacebook {
  pageID?: string;
  PSID?: string;
  ASID?: string;
  firstName?: string;
  lastName?: string;
  nickname?: string;
  email?: string;
  picture?: string;
  accessToken?: string;
  pageAccessToken?: string;
}

export interface ICustomerList {
  id: string;
  first_name: string;
  last_name: string;
  nickname: string;
  phoneNumber: string;
  customerType?: string;
  customerTypeLabel?: string;
  email: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  profile_pic: any;
  updatedAt: string;
  totalrows: number;
}

export interface RemoveUserResponse {
  id: string;
  status: number;
  value: string;
}

export interface CustomerFilters {
  search: string;
  currentPage: number;
  pageSize: number;
  orderBy: string[];
  orderMethod: string;
  customer_tag?: string;
  exportAllRows: boolean;
  noTag?: boolean;
  tags?: IAudienceTagsFilter[];
}

export interface CustomerOrders {
  id: number;
  total_price: string;
  created_at: string;
  po_status: string;
  a_status: string;
  payment_type: string;
  totalrows: number;
}

export interface ICustomerChartsArray {
  date: string;
  customers_per_day: number;
}
export interface IAudienceChartsArray {
  date: string;
  audience_per_day: number;
}

export interface CustomerOrdersFilters {
  id?: number;
  search: string;
  currentPage: number;
  pageSize: number;
  orderBy: string[];
  orderMethod: string;
}

export interface CustomersListFilters {
  currentPage: number;
  orderBy: string[];
  orderMethod: string;
  search: string;
  pageSize: number;
  customer_tag: null | number;
  exportAllRows: boolean;
  noTag: boolean;
  tags?: IAudienceTagsFilter[];
}

export interface ICustomerWebEditShippingAddress {
  psid: string;
  name: string;
  phoneNumber: string;
  address: string;
  post_code: string;
  remark: string;
  parent_id: string;
}

export interface ICustomerWebViewSelectLogistic {
  psid: string;
  id: string;
  name: string;
  parent_id: string;
}
