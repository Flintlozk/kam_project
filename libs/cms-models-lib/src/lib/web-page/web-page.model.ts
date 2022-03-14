import { CRUD_MODE } from '@reactor-room/model-lib';
import { EBackgroundPosition, ElinkType } from '../component';
import { EnumLanguageCultureUI } from '../language';

export interface IWebPage {
  _id?: string;
  pageID?: number;
  level: number;
  menuGroupId?: string;
  pages: IWebPagePage[];
}

export interface IMockWebPage extends IWebPage {
  userID: number;
}

export interface IWebPagePage {
  _id: string;
  parentID: string;
  orderNumber: number;
  masterPageID: string;
  name: string;
  isHide: boolean;
  isHomepage: boolean;
  setting: IWebPageSetting;
  permission: IWebPagePermission;
  configs: IWebPageConfiguration[];
  themeLayoutMode: IWebPageThemeLayoutMode;
}
export interface IWebPageThemeLayoutMode {
  useThemeLayoutMode: boolean;
  themeLayoutIndex: number;
}
export interface IWebPageDetails {
  setting: IWebPageSetting;
  permission: IWebPagePermission;
  configs: IWebPageConfiguration[];
}

export interface IWebPageSetting {
  isOpenNewTab: boolean;
  isMaintenancePage: boolean;
  isIcon: boolean;
  pageIcon: string;
  isMega: boolean;
  mega: IWebPageSettingMega;
  socialShare: string;
}

export interface IWebPageSettingMega {
  primaryType: EMegaMenuType;
  footerType: EMegaMenuType;
  primaryOption: IMegaOption | string;
  footerOption: IMegaFooterOption | string;
}

export type IMegaOption = IMegaOptionTextImage | IMegaOptionCustom;
export type IMegaFooterOption = IMegaFooterOptionTextImage | IMegaFooterOptionCustom;

export interface IMegaOptionTextImage {
  linkType: ElinkType;
  linkParent: string;
  linkUrl: string;
  image: string;
  imagePosition: EBackgroundPosition;
  isTopTitle: boolean;
  isHTML: boolean;
  textImage: string;
}

export interface IMegaOptionCustom {
  isHTML: boolean;
  custom: string;
}

export interface IMegaFooterOptionCustom {
  isFooterHTML: boolean;
  custom: string;
}

export interface IMegaFooterOptionTextImage {
  isFooterHTML: boolean;
  textImage: string;
}

export enum EMegaMenuType {
  CUSTOM = 'CUSTOM',
  IMAGE_TEXT = 'IMAGE_TEXT',
}

export interface IWebPagePermission {
  type: string;
  option: {
    password: string;
    onlyPaidMember: boolean;
  };
}

export enum WebPagePermissionType {
  EVERYONE = 'EVERYONE',
  PASSWORD = 'PASSWORD',
  MEMBER = 'MEMBER',
}

export interface IWebPageConfiguration {
  cultureUI: EnumLanguageCultureUI;
  displayName: string;
  seo: {
    title: string;
    shortUrl: string;
    description: string;
    keyword: string;
  };
  primaryMega: IMegaConfig | string;
  footerMega: IMegaFooterConfig | string;
  mode?: CRUD_MODE;
}

export type IMegaConfig = IMegaConfigTextImage | IMegaConfigCustom;
export type IMegaFooterConfig = IMegaFooterConfigTextImage | IMegaFooterConfigCustom;
export interface IMegaConfigTextImage {
  topTitle: string;
  description: string;
  html: string;
  textImage: string;
}

export interface IMegaConfigCustom {
  html: string;
  custom: string;
}

export interface IMegaFooterConfigTextImage {
  html: string;
  textImage: string;
}

export interface IMegaFooterConfigCustom {
  html: string;
  custom: string;
}

export interface IWebPageOrderNumber {
  level: number;
  _id: string;
  orderNumber: number;
}

export interface IWebPageFromToContainer {
  _id: string;
  parentID: string;
  level: number;
}

export interface IUpdateWebPageHomePage {
  previousLevel: number;
  previousId: string;
  currentLevel: number;
  currentId: string;
}

export interface IUpdateWebPagesHide {
  _id: string;
  level: number;
}

export interface IMenuHTML {
  sourceType: string;
  parentMenuId: string;
  menuGroupId: string;
  cultureUI: EnumLanguageCultureUI;
}

export enum EWebPageLandingName {
  CONTENTMANAGEMENT = 'CONTENTMANAGEMENT',
}
