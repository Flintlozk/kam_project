import { AudienceContactStatus, IAudienceTagsFilter, IComment, IMessageModel, NotificationStatus } from '@reactor-room/itopplus-model-lib';
import { IGQLFileSteam } from '@reactor-room/model-lib';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { Observable } from 'rxjs';
import { ICustomerTagCRUD } from '../customer';
import { IPost, MessageReferral, MessageSentByEnum } from '../facebook';
import { ILeadsFormSubmission } from '../leads/leads.model';
import { IPages } from '../pages/pages.model';
import { EnumBankAccountType } from '../payment/payment.enum';
import { EnumPurchaseOrderStatus } from '../purchase-order/purchase-order.enum';
import { AudienceDomainStatus, AudienceDomainType, CustomerDomainStatus, LeadsDomainStatus } from './audience-history.model';

export type AudienceStatusType = AudienceDomainStatus | CustomerDomainStatus | LeadsDomainStatus;

export enum AudienceViewType {
  FOLLOW = 'FOLLOW',
  MESSAGE = 'MESSAGE',
  LEAD = 'LEAD',
  ORDER = 'ORDER',
  QUOTATION = 'QUOTATION',
  REJECT = 'REJECT',
  CLOSE = 'CLOSE',
}

export interface AudienceContactResolver {
  audience: IAudienceWithCustomer;
}
export interface AudienceChatResolver extends AudienceContactResolver {
  pages: IPages;
  posts: IPost[];
  latestComment: IComment;
  route: AudienceViewType;
  token?: string;
  context: { pidx: number; sidx: number };
}

export interface AudienceLeadContext {
  audienceID: number;
  parentID: number;
  formID: number;
  submissionID: number;
  refID: string;
}

export interface AudienceOrderRouteParams {
  audienceId: number;
}

export interface IAudienceHistorySingleRow {
  audience_id: number;
  open_by: string;
  close_by: string;
  created_at: Date;
  closed_at: Date;
  reason: string;
  close_detail: string;
}

export interface IAudienceHistory {
  profile_pic: string;
  audience_id: number;
  customer_id: number;
  first_name: string;
  aliases: string;
  last_name: string;
  open_by: string;
  close_by: string;
  assignee: string;
  domain: AudienceDomainType;
  status: AudienceStatusType;
  platform: AudiencePlatformType;
  created_at: Date;
  closed_at: Date;
  reason: string;
  close_detail: string;
  tags: { name: string; color: string }[];
  notes: string[];
  totalrows: number;
}
export interface IAudienceHistoriesExport {
  id: number;
  cid: number;
  name: string;
  domain: AudienceDomainType;
  status: AudienceStatusType;
  created_at: string;
  open_by: string;
  closed_at: string;
  closed_by: string;
  reason: string;
  detail: string;
  tags: string;
  notes: string;
}

export interface IAudience {
  id: number;
  customer_id: number;
  page_id: number;
  domain: AudienceDomainType;
  status: AudienceStatusType;
  reason?: string;
  created_at: Date;
  score?: number;
  parent_id?: number;
  updated_at: Date;
  is_notify: boolean;
  is_offtime: boolean;
  last_platform_activity_date: Date;
  last_incoming_date: Date;
  last_send_offtime?: Date;
  user_id?: number;
  isNew?: boolean;
  is_select?: boolean;
  can_reply?: boolean;
  totalrows?: number;
  notify_status: NotificationStatus;
  platform: AudiencePlatformType;
  aliases?: string;
  agentList?: IAgent[];
  latest_sent_by?: MessageSentByEnum;
  referral?: MessageReferral;
  assigneeID?: number;
}
export interface IAudiencePagination extends IAudience {
  pagination?: number;
}

export interface IAudienceWithAgentList {
  audienceID: number;
  agentList: IAgent[];
}
export interface IAgent {
  user_id: string;
  name: string;
  alias: string;
  picture: string;
  audience_id: string;
  token?: string;
  create_at: Date;
}

export interface IAudienceWithInteractableStatus {
  id: number;
  customer_id: number;
  page_id: number;
  domain: AudienceDomainType;
  status: AudienceStatusType;
  created_at: Date;
  isInteractable: boolean;
}

export interface IDomainAndStatus {
  domain: AudienceDomainType;
  status: CustomerDomainStatus | AudienceDomainStatus | EnumPurchaseOrderStatus | LeadsDomainStatus;
}

export interface LeadsListStatsInput {
  page_id: number;
  end: string;
  start: string;
}

export interface IPagesAudience {
  pageID: number;
}

export interface IAudienceWithPurchasing extends IAudience {
  first_name: string;
  last_name: string;
  profile_pic: string;
  psid: string;
  name: string;
  uuid: string;
  created_at: Date;
  updated_at: Date;
  interested_product: string;
  total_price: number;
  flat_rate: boolean;
  is_paid: boolean;
  is_confirm: boolean;
  payment_name: string;
  payment_type: string;
  logistic_name: string;
  logistic_type: string;
  delivery_fee: number;
  shipping_fee: number;
  tracking_no: string;
  product_amount: number;
  bank_account_id: string;
  bank_account_name: string;
  bank_type: EnumBankAccountType;
  totalrows?: number;
  totalpaidrows?: number;
  totalunpaidrows?: number;
  orderno: number;
  aliasOrderId: string;
}
export interface IAudienceWithCustomer extends IAudience {
  psid: string;
  name: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  last_platform_activity_date: Date;
  //TODO: What is it why we need this properties
  submissions?: Observable<ILeadsFormSubmission[]>;
  latestComment?: IComment;
  latestMessage?: IMessageModel;
  latestUpdate?: Date;
  score?: number;
  totalrows?: number;
  offtimes?: number;
  token?: string;
  displayLatestActivity?: IMessageModel | IComment;
  tags?: ICustomerTagCRUD[];
  assigneeID?: number;
}

export interface IHistoriesPipeline extends IAudienceWithCustomer {
  startColor: string;
  endColor: string;
}

export interface multiplePrintingSelected {
  orderno: number;
}

export interface IAudienceWithLeads extends IAudience {
  name: string;
  psid: string;
  first_name: string;
  last_name: string;
  profile_pic: string;
  form_id: number;
  submission_id: number;
  ref: string;
  form_name: string;
  submit_name: string;
  submit_mobile: string;
  submit_email: string;
  submit_status: string;
  totalrows?: number;
}

export interface AudienceStats {
  inbox_audience: number;
  comment_audience: number;
  live_audience: number;
  order_audience: number;
  lead_audience: number;
  follow_audience: number;
  unread_audience: number;
}

export interface IAudienceCardChildrenSteps {
  label: string;
  class: string;
  routeParam: string;
  total: number;
}
export interface IAudienceCardSteps {
  label: string;
  total: number;
  route: string;
  routeBase: string;
  routeFirstSub: string;
  image: string;
  icon: string;
  children: IAudienceCardChildrenSteps[];
}

export interface LeadsFilters {
  domain: AudienceDomainType[];
  status?: string | LeadsDomainStatus;
  contactStatus?: AudienceContactStatus;
  startDate?: string;
  endDate?: string;
  search?: string;
  pageSize?: number;
  currentPage?: number;
  orderBy?: string[];
  orderMethod?: string;
  page_id?: number;
  exportAllRows?: boolean;
  isNotify?: boolean;
  statusBy?: string[];
  tags?: IAudienceTagsFilter[];
  noTag?: boolean;
  exceedSla?: boolean;
  slaConfig?: {
    all: boolean;
    almost: boolean;
    over: boolean;
  };
}

export interface DeletedAudience {
  status: number;
  value: string;
  id: number;
}

export interface LeadStatsFilter {
  start: string;
  end: string;
  page_id: number;
  last_name: string;
  first_name: string;
  profile_pic: string;
  latestComment?: Observable<IComment>;
}

export interface NullFilter {
  'IS NOT NULL': 'IS NOT NULL';
}
export interface IAudienceListInput {
  domain?: NullFilter | AudienceDomainType;
  status?: NullFilter | EnumPurchaseOrderStatus | AudienceDomainStatus | CustomerDomainStatus | LeadsDomainStatus;
  page_id?: number;
  page_index?: number;
}

export interface IAudienceListInputData {
  domain?: NullFilter | AudienceDomainType;
  status?: NullFilter | EnumPurchaseOrderStatus | AudienceDomainStatus | CustomerDomainStatus | LeadsDomainStatus;
  pageID?: number;
}

export interface AudienceStepResponse {
  audience_id: number;
  page_id: number;
}

export interface UserMadeLastChangesToStatus {
  id: number;
  name: string;
  created_at: string;
}
export interface OrderDetailResponse {
  purchase_order_id: number;
  product_variant_id: number;
  item_quantity: number;
  sku: string;
  proudct_id: number;
  name: string;
  customer_id: number;
  delivery_fee: number;
  tracking_no: string;
  tax_included: boolean;
  first_name: string;
  last_name: string;
  phone_number: string;
  paid_amount: number;
}

export enum PaidFilterEnum {
  PAID = 'PAID',
  UNPAID = 'UNPAID',
  ALL = 'ALL',
}

export enum AudienceStepType {
  CUSTOMER_FOLLOW = 'CUSTOMER_FOLLOW',
  CUSTOMER_PENDING = 'CUSTOMER_PENDING',
  CUSTOMER_PAYMENT_CONFIRMED = 'CUSTOMER_PAYMENT_CONFIRMED',
  CUSTOMER_UNFULFILLED = 'CUSTOMER_UNFULFILLED',
  CUSTOMER_CLOSED = 'CUSTOMER_CLOSED',
  AUDIENCE_NEW = 'AUDIENCE_NEW',
  AUDIENCE_OLD = 'AUDIENCE_OLD',
}

export interface IAudienceInput {
  customer_id: number;
  page_id: string;
  domain: string;
  status: string;
}

export interface AudienceCounter {
  total: number;
  step1: number;
  step2: number;
  step3: number;
  step4: number;
  step5: number;
}

export interface MessageTemplatesFilters {
  search: string;
  currentPage: number;
  pageSize: number;
  orderBy: string;
  orderMethod: string;
  customer_tag?: string;
}

export interface Image {
  name?: string;
  url: string;
  attachment_id?: string;
  extension?: string;
}

export interface Message {
  id?: number;
  text: string;
  shortcut: string;
  images?: Image[];
}

export interface MessageTemplates {
  id: number;
  totalrows: number;
  messages: Message;
}

export interface ImageSetArray {
  file?: IGQLFileSteam;
  url: string;
  extension: string;
  filename: string;
  attachment_id: string;
}

export interface ImageSetTemplateInput {
  images: ImageSetArray[];
  shortcut: string;
  id?: number;
}

export interface ImageSetSaved {
  origin: string;
  url: string;
  attachment_id: string;
  extension: string;
  filename: string;
}
export interface ImageSetTemplate {
  images: { url: string }[];
  shortcut: string;
  id?: number;
  totalrows: number;
}

export interface FormTemplate {
  id: number;
  name: string;
  totalrows: number;
}

export interface FormTemplates {
  id: number;
  name: string;
}

export interface Socials {
  social_facebook: string;
  social_line: string;
  social_shopee?: string;
  social_lazada?: string;
}

export interface SocialsInput {
  pageID: number;
  social_facebook: string;
  social_line: string;
  social_shopee: string;
  social_lazada: string;
}

export interface IAnalyScore {
  analyscore: number;
}

export interface UpdateFollowAudienceStatusArguments {
  PSID: string;
  domain: AudienceDomainType;
  status: AudienceDomainStatus;
  update: boolean;
  orderId: number;
}

export interface RejectAudienceValidateRequestArguments {
  PSID: string;
  audienceID: number;
  route: AudienceViewType;
}
export interface GetLogisticDetailValidateRequest {
  ID: number;
}
export interface ValidateLogisticResponse {
  cod_status: boolean;
}
export interface GetTrackIDValidateRequest {
  uuid: string;
}
