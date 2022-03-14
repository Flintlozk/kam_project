import { TemplateTypeEnum } from '@reactor-room/cms-models-lib';

export enum RouteLinkEnum {
  LOGIN = 'login',
  FORGET = 'forget',
  CONTENT_DRAFT_NEW = 'draft/new',
  CONTENT_DRAFT_EDIT = 'draft/edit',
  CONTENT_CONTENT_EDIT = 'content/edit',
  CONTENT_FILE_MANAGE_DETAIL = 'file-manage/detail',
  PROFILE = 'profile',
  PREFIX_CATEGORIES = 'categories',
  PRODUCT_DETAILS = 'product-details',
  WELCOME = 'welcome',
  WELCOME_INTRO = 'intro',
  WELCOME_FEATURES = 'features',
  WELCOME_TEMPLATES = 'templates',
  DASHBOARD = 'dashboard',
  DASHBOARD_NEW_ORDER = 'new-order',
  DASHBOARD_CONFIRM_PENDING = 'confirm-pending',
  DASHBOARD_SHIPPING_PENDING = 'shipping-pending',
  DASHBOARD_FINISH_ORDER = 'finish-order',
  DASHBOARD_LOW_STOCK = 'low-stock',
  DASHBOARD_ACTIVE_USER = 'active-user',
  DASHBOARD_ECOMMERCE = 'e-commerce',
  DASHBOARD_AUDIENCE = 'audience',
  DASHBOARD_ECOMMERCE_LOW_STOCK = 'e-commerce-low-stock',
  ORDER = 'order',
  SETTING = 'settings',
  SETTING_WEBSITE = 'website',
  SETTING_ADMIN = 'admin',
  SETTING_MEMBER = 'member',
  SETTING_ADVANCE = 'advance',
  CMS = 'cms',
  CMS_PREVIEW_MODE = 'preview',
  CMS_PREVIEW_DESKTOP = 'desktop',
  CMS_PREVIEW_TABLET = 'tablet',
  CMS_PREVIEW_MOBILE = 'mobile',
  CMS_EDIT_MODE = 'edit',
  CMS_PAGE_ID = 'page_id',
  CMS_SITE_MANAGE = 'site-management',
  SHORTCUT_CONTENT_MANAGEMENT = 'content-management',
  SHORTCUT_WEBSITE_MANAGEMENT = 'cms/edit',
  SHORTCUT_CREATE_PAGE = 'cms/edit/create-page',
  SHORTCUT_PREVIEW = 'cms/preview',
  SHORTCUT_FILE_MANAGEMENT = 'file-management',
  SHORTCUT_PRODUCT_MANAGEMENT = 'products',
  SHORTCUT_SHOP_INFORMATION = 'shop-infomation',
  SHORTCUT_ORDER_MANAGEMENT = 'order-management',
  SHORTCUT_SHIPPING_SYSTEM = 'shipping-system',
  SHORTCUT_PAYMENT_SYSTEM = 'payment-system',
  SHORTCUT_PROMOTION = 'promotion',
  SHORTCUT_SALE_CHANNEL = 'sale-channel',
  SHORTCUT_TRASH = 'trash',
  SHORTCUT_INBOX = 'inbox',
  SHORTCUT_TEMPLATE_SETTING = 'template-setting',
}

export enum RouteLinkCmsEnum {
  SHOP = 'shop',
  LOGIN = 'login',
  WELCOME = 'welcome',
  WELCOME_INTRO = 'intro',
  WELCOME_FEATURES = 'features',
  WELCOME_TEMPLATES = 'templates',
  DASHBOARD = 'dashboard',
  DASHBOARD_LOW_STOCK = 'low-stock',
  ORDER = 'order',
  SETTING = 'setting',
  PAGES = 'pages',
  SETTING_WEBSITE = 'website',
  SETTING_ADMIN = 'admin',
  SETTING_MEMBER = 'member',
  SETTING_ADVANCE = 'advance',
  SETTING_INTEGRATION = 'integration',
  SETTING_SHOP = 'shop',
  CMS = 'cms',
  CMS_EDIT_MODE = 'edit',
  CMS_SITE_MANAGE = 'site-management',
  CMS_CONTENT_MANAGE = 'content-management',
  CME_PAGE_ID = 'dynamic_page_id',
}

export enum FileUploadTypeEnums {
  ACCEPT_IMAGE = 'image/png,image/jpeg,image/gif',
  ACCEPT_FILE = '.doc,.docx,.pdf,.xlsx,.xls,.csv',
  ACCEPT_IMAGE_FILE = 'image/png,image/jpeg,image/gif,.doc,.docx,.pdf,.xlsx,.xls,.csv',
}

export interface IValidationMessage {
  // TODO: We agree to remove all of Any or Object variable;
  control: string;
  rules: any;
}

export interface IDialogData {
  message: string;
}

export type ILogin = {
  email: string;
  password: string;
};

export enum UserActionEnum {
  CONFIRM = 'CONFIRM',
  CANCEL = 'CANCEL',
}
export interface ICSSParser {
  type: string;
  property: string;
  value: string;
  position: any;
}
export enum EDropzoneType {
  CONTENT = 'CONTENT',
  REMOVE = 'REMOVE',
  LAYOUT = 'LAYOUT',
  THEME_HEADER = 'THEME_HEADER',
  THEME_FOOTER = 'THEME_FOOTER',
}

export enum EnumTypeMode {
  PUBLISH = 'PUBLISH',
  PREVIEW = 'PREVIEW',
}
export enum EnumGenerateMode {
  PAGECOMPONENT = 'PAGECOMPONENT',
  THEME = 'THEME',
}
export enum EnumGenerateType {
  ANGULARHTML = 'ANGULARHTML',
  STATICHTML = 'STATICHTML',
}
export interface IUploadFile {
  filepath: string;
  plaintext: string;
}
export enum EnumContentType {
  CSS = 'text/css',
  JS = 'text/javascript',
}
export enum CreateModalTypeEnum {
  THEME = 'THEME',
  TEMPLATE = 'TEMPLATE',
}
export interface ICreateModal {
  name: string;
  type: CreateModalTypeEnum;
  templateType?: TemplateTypeEnum;
}

export interface IWebSiteData {
  html: string;
  js: string[];
  css: string;
}

export interface ICssJs {
  css: string;
  js: string[];
}

export enum EnumDevice {
  DESKTOP = 'DESKTOP',
  MOBILE = 'MOBILE',
}
