import { IFacebookCredential, IGQLFileSteam, LanguageTypes } from '@reactor-room/model-lib';
import { AudienceDomainType } from '../audience';
import { PipelineStepTypeEnum } from '../facebook/pipeline-model/pipeline-steps.enum';
import { EnumPageMemberType } from '../page-member/page-member.model';
import { IPageSettings } from '../page-settings';
import { IPagesThirdParty } from './pages-third-model';
import { EnumAppScopeType, EnumWizardStepType, SocialTypes } from './pages.enum';
export interface ISocialConnectResponse {
  source: SocialTypes;
  result: boolean;
  message: string;
}

export interface IPagesSchema {
  id: number;
  page_name: string;
  tel: string;
  line_id: string;
  facebook: string;
  email: string;
  address: string;
  // option: JSON
  flat_status: boolean;
  delivery_fee: number;
  created_at: Date;
  updated_at: Date;
}

export interface IPagesArg {
  pageID: number;
  pageIndex: number;
  fbPageID: string;
  fbPages: [IFacebookPageResponse];
  settings: IPageAdvancedSettings;
  pageInput: IFacebookPageResponse;
  credential: IFacebookCredential;
  bactive: boolean;
  currentStep: EnumWizardStepType;
  flatInput: IPageFlatStatusWithFee;
  isToCreatePage: boolean;
}
export interface IPagesContext {
  pageIndex: number;
  pageId: number;
  pageName: string;
  pageRole: EnumPageMemberType;
  picture: string;
  accessToken?: string;
  wizardStep: EnumWizardStepType;
  pageSettings?: IPageSettings[];
  pageAppScope: [EnumAppScopeType];
}

export interface IPages {
  id: number;
  user_id: number;
  page_name: string;
  page_username: string;
  page_role: EnumPageMemberType;
  tel: string;
  email: string;
  address: string;
  option: {
    access_token: string;
    advanced_settings: IPageAdvancedSettings;
  };
  created_at: Date;
  updated_at: Date;
  fb_page_id: string;
  language: string;
  currency: string;
  firstname: string;
  lastname: string;
  flat_status: boolean;
  delivery_fee: number;
  district: string;
  province: string;
  post_code: string;
  country: string;
  amphoe: string;
  shop_picture: string;
  social_facebook: string;
  social_line: string;
  social_shopee?: string;
  social_lazada?: string;
  uuid: string;
  line_channel_accesstoken: string;
  line_channel_secret: string;
  benabled_api: boolean;
  api_client_id: string;
  api_client_secret: string;
  wizard_step?: EnumWizardStepType;
  page_app_scope?: EnumAppScopeType[];
  subscription_id?: string;
}

export interface IPageAppScope {
  id: number;
  page_id: number;
  app_scope: EnumAppScopeType;
}

export interface IPagesAPI {
  benabled_api: boolean;
  api_client_id: string;
  api_client_secret: string;
}
export interface IPageWithStatus {
  pageID?: number;
  pageIndex: number;
  pageImgUrl: string;
  pageTitle: string;
  pageActiveStatus: boolean;
  pageWizardStep: EnumWizardStepType;
  pageTotalNotify?: number;
}

export interface IPageFlatStatusWithFee {
  flatStatus: boolean;
  fee: number;
}

export interface IPageInfoWithOwnerInfo {
  fb_page_id: string;
  user_id: number;
  email: string;
  page_id: string;
}

export interface IPageFeeInfo {
  flat_status: boolean;
  delivery_fee: number;
}

export interface IUserPageMapModel {
  user_id: number;
  page_id: number;
  role: EnumPageMemberType;
  is_active: boolean;
  created_at: Date;
  updated_at: Date;
}

export interface IUserSubScrip {
  id: number;
  user_id: string;
  subscription_id: string;
}

export interface ISubscriptionPeriod {
  expired_at: Date;
  plan_name: string;
  maximum_pages: number;
}

export interface IPlanName {
  user_id: number;
  plan_id: number;
  maximum_pages: number;
  maximum_members: number;
}

export interface IFacebookPageDataCategoryList {
  id: number;
  name: string;
}

export interface ISocialPagesResponse {
  id: string;
  name: string;
  picture: string;
}

export interface IFacebookPageGetProfileResponse {
  height: number;
  is_silhouette: boolean;
  url: string;
  width: number;
}

export interface IFacebookPageResponse extends ISocialPagesResponse {
  access_token: string;
  category: string;
  category_list: [IFacebookPageDataCategoryList];
  username: string;
  tasks: [string];
  matchOwner?: boolean;
}

export interface ILineResponse extends ISocialPagesResponse {
  line_basic_id: string;
}

export interface IFacebookPageWithBindedPageStatus {
  facebook_page: IFacebookPageResponse;
  is_binded: boolean;
  email: string;
}

export interface IUserPageMapInput {
  user_id: number;
  page_id: number;
  email: string;
  role: EnumPageMemberType;
  is_active: boolean;
}

export interface AddNewPageCurrencyInput {
  currencyImgUrl: string;
  currencyTitle: string;
}

export interface AddNewPageLanguageInput {
  languageImgUrl: string;
  languageTitle: string;
}

export interface AddNewPageAddressInput {
  mainAddress: string;
  district: string;
  province: string;
  postCode: string;
  country: string;
}

export interface LocationAddressInput {
  city: string;
  district: string;
  post_code: string;
  province: string;
}

export interface IShopProfile {
  firstname: string;
  lastname: string;
  tel: string;
  page_name: string;
  email: string;
  address: string;
  currency: string;
  language: string;
  fb_page_id: string;
}

export interface IGetSocialNetWork {
  social_facebook: string;
  social_line: string;
  ////:: marketplace functionality commenting now
  // social_shopee: string;
  // social_lazada: string;
}
export interface ICompanyInfo {
  company_name: string;
  company_logo?: string;
  company_logo_file?: IGQLFileSteam;
  branch_name: string;
  branch_id: string;
  tax_identification_number: string;
  tax_id: number;
  phone_number: string;
  email: string;
  fax: string;
  address: string;
  post_code: string;
  sub_district: string;
  district: string;
  province: string;
  country: string;
}

export interface IGetShopProfile extends IPages {
  lineId: string;
  social_facebook: string;
  social_line: string;
  social_shopee?: string;
  social_lazada?: string;
}

export interface IGetUserPhone {
  tel: string;
}
export interface ILogisticTrackingDetail {
  delivery_type: string;
  tracking_type: string;
  cod_status: boolean;
  uuid: string;
}

export interface IAddShopProfile {
  firstName: string;
  lastName: string;
  phoneNo: string;
  shopName: string;
  email: string;
  lineId: string;
  facebookid: string;
  facebookpic: string;
  access_token: string;
  address: string;
  location: LocationAddressInput;
  country: string;
  currency: AddNewPageCurrencyInput;
  language: AddNewPageLanguageInput;
  socialFacebook: string;
  socialLine: string;
  socialShopee?: string;
  socialLazada?: string;
  basicid: string;
  channelid: number;
  channelsecret: string;
  channeltoken: string;
  premiumid: string;
  userid: string;
  pictureurl: string;
  displayname: string;
  is_type_edit: boolean;
}

export type IAddShopSocialProfile = Pick<IAddShopProfile, 'socialFacebook' | 'socialLazada' | 'socialShopee' | 'socialLine'>;

export interface ISocialConnectDialog {
  social_facebook: string;
  social_line: string;
  social_shopee?: string;
  social_lazada?: string;
}

export interface IGetShopDetail {
  firstName: string;
  lastName: string;
  phoneNo: string;
  shopName: string;
  email: string;
  lineId: string;
  facebookid: string;
  facebookpic: string;
  access_token: string;
  address: string;
  location: LocationAddressInput;
  country: string;
  currency: AddNewPageCurrencyInput;
  language: AddNewPageLanguageInput;
  social_facebook: string;
  social_line: string;
  social_shopee?: string;
  social_lazada?: string;
}

export interface IShopDetail {
  firstname: string;
  lastname: string;
  tel: string;
  page_name: string;
  email: string;
  lineId: string;
  fb_page_id: string;
  shop_picture: string;
  currency: string;
  language: string;
  post_code: string;
  address: string;
  amphoe: string;
  district: string;
  province: string;
  country: string;
  socialFacebook: string;
  socialLine: string;
  socialShopee?: string;
  socialLazada?: string;
}

export interface IAddNewPage {
  shopProfileUrl: string;
  firstName: string;
  lastName: string;
  phoneNo: string;
  shopName: string;
  email: string;
  lineId: string;
  facebook: string;
  address: AddNewPageAddressInput;
  currency: AddNewPageCurrencyInput;
  language: AddNewPageLanguageInput;
  facebookPage: IFacebookPageResponse;
}

export interface IAddNewShopProfile extends IAddShopProfile {
  id: number;
}

export interface LocationInput {
  amphoe: string;
  district: string;
  post_code: string;
  province: string;
}

export interface IPagesDetail {
  id: number;
  page_name: string;
}
export interface IPageSubscriptionMapping {
  page_id: number;
  subscription_id: string;
}

export interface ISettingSubscriptionDetail {
  package: string;
  pagelimit: number;
  pageusing: number;
  daysRemaining: number;
  expiredDate: string;
}

export interface ISettingPageMember {
  memberlimit: number;
  memberusing: number;
}

export interface IFacebookDomainWhitelisted {
  whitelisted_domains: [string];
}
export interface IFacebookPageUsername {
  id: string;
  name: string;
  username: string;
}

export interface IFacebookAttachmentUploadResponse {
  attachment_id: string;
}

export interface IPageAdvancedSettings {
  auto_reply: boolean;
  direct_message: IAdvancedPageSettingsDirectMessageSteps[];
}
export interface MessageSettingObj {
  message: IMessageSetting;
}
export interface QuilDescriptionObj {
  message: IQuillObj;
}
export interface IQuillObj {
  quill: IQuilDescription;
  type: string;
}
export interface IQuilDescription {
  description: string;
}
export interface IMessageSetting {
  message1: string;
  message2: string;
  message3: string;
  message4: string;
  message5: string;
  message6: string;
  message7: string;
  message8: string;
  message9: string;
  message10: string;
  message11: string;
  message12: string;
  message13: string;
  message14: string;
  message15: string;
  message16: string;
  message17: string;
  message18: string;
  message19: string;
  terms_condition: string;
  type: AudienceDomainType;
  locale: LanguageTypes;
}
export interface IQuilDescriptionInput {
  quill: IQuillDescription;
}
export interface IQuillDescription {
  description: string;
}
export interface IAdvancedPageSettingsDirectMessageSteps {
  type: PipelineStepTypeEnum;
  class: string;
  label: string;
  title: string;
  image: string;
  defaultLabel: string;
  defaultTitle: string;
}
export interface ISocialConnect {
  facebook: IFacebookPageResponse;
  line: ILineResponse;
  shopee?: IPagesThirdParty;
  lazada?: IPagesThirdParty;
}
export interface ISocialCard {
  type: SocialTypes;
  id: string;
  picture: string;
  name: string;
  logoUrl: string;
  label: string;
  notLinkMessage: string;
}

export interface ILineSetting {
  basicid: string;
  channelid: number;
  channelsecret: string;
  channeltoken: string;
  premiumid: string;
  userid: string;
  pictureurl: string;
  displayname: string;
  is_type_edit: boolean;
  id: number;
  uuid: string;
}
export interface ILineChannelInforAPIResponse {
  userId: string;
  basicId: string;
  premiumId: string;
  displayName: string;
  pictureUrl: string;
  chatMode: string;
  markAsReadMode: string;
}

export interface ILineLiffResponse {
  liffId: string;
}
