import { EnumLanguageCultureUI } from '../language/language.model';
export enum ConfigGenerals {
  EMAIL_SENDER_NAME = 'generalSetting.email_sender_name',
  FAVICON = 'generalSetting.favicon',
  GENERAL = 'generalSetting.general',
  LANGUAGE = 'generalSetting.language',
  MOBILE_VIEW = 'generalSetting.mobile_view',
  NOTIFICATION = 'generalSetting.notification',
  SEARCH = 'generalSetting.search',
  TEMPORARY_CLOSE = 'generalSetting.temporary_close',
}
export enum EnumColorType {
  TEXT_COLOR = 'text_color',
  ICON_COLOR = 'icon_color,',
}
export enum EnumConfigGeneral {
  GENERAL_VIEW = 'General view',
  ICON_UPLOAD = 'Icon Upload',
  TEMPORARY_CLOSE = 'Temporary Close',
  EMAIL_SENDER = 'Email Sender',
  MOBILE_VIEW = 'Mobile View',
  SEARCH = 'Search',
  NOTIFICATION = 'Notification',
  LANGUAGE = 'Language',
}
export enum EnumConfigLinkTypes {
  LINK = 'Link',
  TEL = 'Tel',
  MAILTO = 'Mail to',
  JAVASCRIPT = 'Javascript',
  ID = '#',
}
export enum EnumCurrency {
  THB = 'THB',
  USD = 'USD',
  JPY = 'JPY',
}
export enum EnumConfigTargetHref {
  NEW_WINDOW = 'New Window',
  CURRENT_WINDOW = 'Current Window',
}
export interface TargetRefModel {
  selected_target_href?: EnumConfigTargetHref;
  target_href?: EnumConfigTargetHref[];
}
export interface linkType {
  selected_link_type: EnumConfigLinkTypes;
  link_types: EnumConfigLinkTypes[];
  target_url: string;
  target_href: TargetRefModel;
}
export interface IWebsiteConfig {
  page_id?: number;
  theme_id?: string;
  updatedAt?: string;
  upload_folder?: string;
  style?: string;
  shortcuts?: string[];
  general?: IWebsiteConfigGeneral;
  seo_setting?: IWebsiteConfigSEO;
  meta_tags?: IWebsiteConfigMeta;
  css_setting?: IWebsiteConfigCSS;
  datause_privacy_policy_setting?: IWebsiteConfigDataPrivacy;
}

export interface IWebsiteConfigTheme {
  theme_id: string;
  updatedAt: string;
}
export interface IWebsiteConfigDataPrivacy {
  is_active?: boolean;
  data_use?: string;
  privacy_policy?: string;
}
///////////////////////////////////SEO////////////////////////////
export interface IWebsiteConfigSEO {
  culture_ui?: string;
  title?: string;
  keyword?: string[];
  description?: string;
}

//////////////////////////////////////////////////////////////////
/////////////////////////////////META////////////////////////////
export interface IWebsiteConfigMeta {
  meta_tag?: string;
  body_tag?: string;
  javascript?: string;
}
//////////////////////////////////////////////////////////////////

/////////////////////////////////CSS////////////////////////////
export interface IWebsiteConfigCSS {
  global?: string;
  css_with_language?: IWebsiteConfigCSSWithLanguage[];
}

export interface IWebsiteConfigCSSWithLanguage {
  language?: string;
  stylesheet?: string;
}
//////////////////////////////////////////////////////////////////

//OUTER GENERAL SETTINGS
export interface IWebsiteConfigGeneral {
  language?: IWebsiteConfigGeneralLanguage;
  general?: IWebsiteConfigGeneralGeneral;
  temporary_close?: boolean;
  search?: IWebsiteConfigGeneralSearch;
  mobile_view?: IWebsiteConfigGeneralMobileView;
  email_sender_name?: string;
  notification?: IWebsiteConfigGeneralNotification;
  favicon?: IWebsiteConfigGeneralFavicon;
}

//FAVICON
export interface IWebsiteConfigGeneralFavicon {
  image_url?: string;
}
//NOTIFICATION
export interface IWebsiteConfigGeneralNotification {
  push_notifications?: IWebsiteConfigGeneralNotificationPushNotifications;
  activity?: IWebsiteConfigGeneralNotificationActivity;
}

//NOTIFICAITION -> ACTIVITY
export interface IWebsiteConfigGeneralNotificationActivity {
  new_order?: boolean;
  new_messages?: boolean;
  new_comments?: boolean;
  reject_order?: boolean;
  submit_form?: boolean;
  field_update?: boolean;
}

//NOTIFICATION -> PUSH_NOTIFICATION
export interface IWebsiteConfigGeneralNotificationPushNotifications {
  line_notify?: IWebsiteConfigGeneralNotificationPushNotificationsLineNotify;
  email?: IWebsiteConfigGeneralNotificationPushNotificationsEmail;
}

//NOTIFICATION -> PUSH_NOTIFICATION -> LINE_NOTIFY
export interface IWebsiteConfigGeneralNotificationPushNotificationsLineNotify {
  is_active?: boolean;
  line_notify_token?: string;
}
//NOTIFICATION -> PUSH_NOTIFICATION -> EMAIL
export interface IWebsiteConfigGeneralNotificationPushNotificationsEmail {
  is_active: boolean;
  emails: string[];
}

//END EMAIL_SENDER_NAME

//END TEMP->TEMPORARY CLOSE
//MOBILE VIEW
export interface IWebsiteConfigGeneralMobileView {
  header?: IWebsiteConfigGeneralMobileViewHeader;
  sidebar_menu?: IWebsiteConfigGeneralMobileViewSidebarMenu;
  content?: IWebsiteConfigGeneralMobileViewContent;
}
export interface IWebsiteConfigGeneralMobileViewHeader {
  fixed_top_menu?: boolean;
}
export interface IWebsiteConfigGeneralMobileViewSidebarMenu {
  sidebar_menu?: boolean;
  sidebar_submenu_auto?: boolean;
}
export interface IWebsiteConfigGeneralMobileViewContent {
  search_button?: boolean;
  side_information?: boolean;
  increase_image_size?: boolean;
}

//END MOBILE VIEW
//SEARCH
export interface IWebsiteConfigGeneralSearch {
  maximun_search_results?: IWebsiteConfigGeneralSearchMaximunSearchResults;
  define_search_score?: number;
  search_pattern?: IWebsiteConfigGeneralSearchPattern;
  search_pattern_setting?: IWebsiteConfigGeneralSearchPatternSetting;
  search_landing_page?: IWebsiteConfigGeneralSearchSearchLandingPage;
  search_type?: IWebsiteConfigGeneralSearchSearchType;
}
//maximun_search_results
export interface IWebsiteConfigGeneralSearchMaximunSearchResults {
  selected_maximum_result?: number;
  maximum_results?: number[];
}
//search_pattern
export interface IWebsiteConfigGeneralSearchPattern {
  pattern_index: number;
}
//search_pattern_setting
export interface IWebsiteConfigGeneralSearchPatternSetting {
  button: IWebsiteConfigGeneralSearchPatternSettingButton;
  search_icon: IWebsiteConfigGeneralSearchPatternSettingSearchIcon;
  icon_color: IWebsiteRGBA;
  text_color: IWebsiteRGBA;
  background_color: IWebsiteConfigGeneralSearchPatternSettingBackgroundColor;
}
export interface IWebsiteConfigGeneralSearchPatternSettingButton {
  selected_button?: string;
  button_types?: string[];
}
export interface IWebsiteConfigGeneralSearchPatternSettingSearchIcon {
  selected_search_icon: string;
  search_icons: string[];
}
export interface IWebsiteConfigGeneralSearchPatternSettingBackgroundColor {
  alpha?: string;
  type?: string;
  solid?: IWebsiteRGBA;
  linear?: IWebsiteRGBALinear;
  image?: IWebsiteConfigGeneralSearchPatternSettingBackgroundColorImage;
}
export interface IWebsiteConfigGeneralSearchPatternSettingBackgroundColorLinear {
  rgb?: string[];
  alpha?: number;
}
export interface IWebsiteConfigGeneralSearchPatternSettingBackgroundColorImage {
  url?: string;
  alpha?: number;
}
//search_landing_page
export interface IWebsiteConfigGeneralSearchSearchLandingPage {
  landing_page_index: number;
}
//search_type
export interface IWebsiteConfigGeneralSearchSearchType {
  default_search_type: string;
  search_types: string[];
}

//END SEARCH

//GENERAL VIEW->CONTENT
export interface IWebsiteConfigGeneralGeneralContent {
  advertising_display?: boolean;
  advertising_display_setting?: IWebsiteConfigGeneralGeneralContentAdvertisingDisplaySetting;
  back_to_top_button?: boolean;
  back_to_top_button_setting?: IWebsiteConfigGeneralGeneralContentBackToTopButtonSetting;
  disable_right_click?: boolean;
  facebook_comment_tab?: boolean;
  facebook_comment_tab_setting?: IWebsiteConfigGeneralGeneralContentFacebookCommentTabSetting;
  preview_custom_form?: boolean;
  printer?: boolean;
  scrollbar?: boolean;
  webp_format_system?: boolean;
}

export interface IWebsiteConfigGeneralGeneralContentFacebookCommentTabSetting {
  comment_tab?: boolean;
  allow_member_only?: boolean;
}
export interface IWebsiteConfigGeneralGeneralContentBackToTopButtonSetting {
  image_url?: string;
  position: string;
}
export interface IWebsiteConfigGeneralGeneralContentAdvertisingDisplaySetting {
  position?: string;
  size?: string;
  upload?: IWebsiteConfigGeneralGeneralContentAdvertisingDisplaySettingUpload;
  share_clip?: IWebsiteConfigGeneralGeneralContentAdvertisingDisplaySettingShareClip;
}
export interface IWebsiteConfigGeneralGeneralContentAdvertisingDisplaySettingShareClip {
  embedded_link?: string;
}
export interface IWebsiteConfigGeneralGeneralContentAdvertisingDisplaySettingUpload {
  image_url?: string;
  link_type?: linkType;
}
//END GENERAL VIEW->CONTENT

//GENERAL VIEW-> HEADER

export interface IWebsiteConfigGeneralGeneralHeader {
  language_flag?: boolean;
  fixed_top_menu?: boolean;
  fixed_top_menu_setting?: IWebsiteConfigGeneralGeneralHeaderFixedTopMenuSetting;
  shop_cart?: boolean;
  shop_cart_setting?: IWebsiteConfigGeneralGeneralHeaderShopCartSetting;
  currency_converter?: boolean;
  currency_converter_setting?: IWebsiteConfigGeneralGeneralHeaderCurrencyConverterSetting;
}
export interface IWebsiteConfigGeneralGeneralHeaderCurrencyConverterSetting {
  main_converter?: EnumCurrency;
  selected_main_converter?: EnumCurrency[];
}
export interface IWebsiteConfigGeneralGeneralHeaderFixedTopMenuSetting {
  full_screen?: boolean;
  image_url?: string;
  link_type?: linkType;
}
export interface IWebsiteConfigGeneralGeneralHeaderShopCartSetting {
  shopcart_icon?: number;
  icon_color?: IWebsiteRGBA;
  text_color?: IWebsiteRGBA;
}
export interface IWebsiteRGBA {
  rgb?: string;
  alpha?: number;
}
export interface IWebsiteRGBALinear {
  rgb?: string[];
  alpha?: number;
}

//END GENERAL VIEW-> HEADER

//GENERAL VIEW-> NOTIFICATION
export interface IWebsiteConfigGeneralGeneralNotificaition {
  show_as_modal: boolean;
}

export interface IWebsiteConfigGeneralGeneralLogin {
  social_login: boolean;
}
//END GENERAL VIEW-> NOTIFICATION

//GENERAL VIEW-> VIEW
export interface IWebsiteConfigGeneralGeneralView {
  support_responsive?: boolean;
  picture_display?: boolean;
  picture_display_setting?: IWebsiteConfigGeneralGeneralViewPictureDisplaySetting;
  shortened_url_display?: boolean;
}
export interface IWebsiteConfigGeneralGeneralViewPictureDisplaySetting {
  width?: number;
  height?: number;
  units?: string;
  image_url?: string;
  end_time?: IWebsiteConfigGeneralGeneralViewPictureDisplaySettingEndTime;
  display_on_mobile?: IWebsiteConfigGeneralGeneralViewPictureDisplaySettingDisplayOnMobile;
  selected_upload?: string;
  image?: IWebsiteConfigGeneralGeneralViewPictureDisplayImageSetting;
}

export interface IWebsiteConfigGeneralGeneralViewPictureDisplayImageSetting {
  link_type?: linkType;
}
export interface IWebsiteConfigGeneralGeneralViewPictureDisplaySettingEndTime {
  is_active?: boolean;
  duration?: number;
}
export interface IWebsiteConfigGeneralGeneralViewPictureDisplaySettingDisplayOnMobile {
  is_active?: boolean;
}
//END GENERAL VIEW-> VIEW
//OUTER GENERAL VIEW SETTING
export interface IWebsiteConfigGeneralGeneral {
  content?: IWebsiteConfigGeneralGeneralContent;
  header?: IWebsiteConfigGeneralGeneralHeader;
  notification?: IWebsiteConfigGeneralGeneralNotificaition;
  login?: IWebsiteConfigGeneralGeneralLogin;
  view?: IWebsiteConfigGeneralGeneralView;
}
export interface IWebsiteConfigGeneralLanguage {
  defaultCultureUI?: EnumLanguageCultureUI;
  selectedCultureUIs?: EnumLanguageCultureUI[];
}

export enum EnumShortcut {
  WEBSITE_MANAGEMENT = 'Website Management',
  CONTENT_MANAGEMENT = 'Content Management',
  CREATE_PAGE = 'Create Page',
  PREVIEW = 'Preview',
  FILE_MANAGEMENT = 'File Management',
  E_COMMERCE = 'E-Commerce',
  PRODUCT_MANAGEMENT = 'Product Management',
  SHOP_INFORMATION = 'Shop Information',
  ORDER_MANAGEMENT = 'Order Management',
  SHIPPING_SYSTEM = 'Shipping System',
  PAYMENT_SYSTEM = 'Payment System',
  PROMOTION = 'Promotion',
  SALE_CHANNEL = 'Sale Channel',
  TRASH = 'Trash',
  INBOX = 'Inbox',
  THEME_SETTING = 'Theme Setting',
}
