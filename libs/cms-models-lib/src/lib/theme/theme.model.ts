import * as Joi from 'joi';
import { EFontFamilyCode, EFontStyle, IRenderingComponentData, UnitEnum } from '../component/component.model';
import { IGQLFileSteam } from '@reactor-room/model-lib';

export interface IThemeCategoryModel {
  _id: string;
  name: string;
}

export enum EnumThemeDeviceIcon {
  EXTRA_WILD = 'EXTRA_WILD',
  WILD = 'WILD',
  NORMAL = 'NORMAL',
  TABLET = 'TABLET',
  MOBILE = 'MOBILE',
  CUSTOM = 'CUSTOM',
}
export enum EnumThemeMode {
  DARK = 'dark',
  LIGHT = 'light',
}

export interface IThemeDevice {
  minwidth: number;
  icon: EnumThemeDeviceIcon;
  default: boolean;
  baseFontSize: number; // Default 16,
}

export interface IThemeRendering {
  _id: string;
  name: string;
  catagoriesID: string[];
  image: IThemeAssets[];
  html: IThemeRenderingHtml[];
  style: IThemeAssets[];
  javascript: IThemeAssets[];
  themeComponents?: { themeComponent: IRenderingComponentData[] }[];
  isActive: boolean;
  devices: IThemeDevice[];
  settings?: IThemeRenderingSettings;
  themeLayoutLength?: number;
}
export interface IThemeUpdateErrorModal {
  dataId: string;
  difference: string;
  componentType: string;
}
export interface IThemeAssets {
  _id?: string;
  type: EnumAssetsThemeType;
  url?: string;
  name?: string;
  plaintext?: string;
  html?: string;
  javascript?: any;
  style?: any;
  image?: any;
  index?: number;
}
export interface IUpdateThumnail {
  _id: string;
  index: number;
  thumbnail: {
    path: string;
    stream: IGQLFileSteam;
  };
}
export interface IThemeRenderingSettingTheme {
  screenShortUrl: string;
  name: string;
  previousThemeId: string;
}
/*

Render : {
  text: [
    {
      type : "HEADER",
      fontFamilyCode: EFontFamilyCode;
      fontSize: number;
      fontUnit: UnitEnum; // REM
    },
    {
      type : "SUB_HEADER",
      fontFamilyCode: EFontFamilyCode;
      fontSize: number;
      fontUnit: UnitEnum; // REM
    }

  ]
}

*/

//TODO: Change the admin UI with same name over here.
export enum EnumThemeRenderingSettingFontType {
  NONE = '',
  HEADER = 'HEADER',
  SUB_HEADER = 'SUB_HEADER',
  DETAIL = 'DETAIL',
  SUB_DETAIL = 'SUB_DETAIL',
}

export enum EnumThemeRenderingSettingColorType {
  NONE = '',
  DEFAULT_COLOR = 'DEFAULT_COLOR',
  HEADER = 'HEADER',
  SUB_HEADER = 'SUB_HEADER',
  DETAIL = 'DETAIL',
  SUB_DETAIL = 'SUB_DETAIL',
  ASSERT1 = 'ASSERT1',
  ASSERT2 = 'ASSERT2',
  ASSERT3 = 'ASSERT3',
}

export enum EnumThemeClass {
  HEADER = 'itp-header-true',
  SUB_HEADER = 'itp-sub-header-true',
  DETAIL = 'itp-detail-true',
  SUB_DETAIL = 'itp-sub-detail-true',
  DEFAULT_COLOR = 'itp-default-color-true',
  ASSERT1 = 'itp-assert-1-true',
  ASSERT2 = 'itp-assert-2-true',
  ASSERT3 = 'itp-assert-3-true',
}

export enum FontFamily {
  RACING_SANS_ONE = 'Racing Sans One',
  PROMPT = 'Prompt',
  QUANTICO = 'Quantico',
  POST_NO_BILLS_COLOMBO = 'Post No Bills Colombo',
  NEUCHA = 'Neucha',
}

export type EnumThemeRenderingSettingType = EnumThemeRenderingSettingFontType | EnumThemeRenderingSettingColorType;
export interface IThemeRenderingSettingColorsDetail {
  color: string;
  opacity: number;
  bgColor: string;
  bgOpacity: number;
}
export interface IThemeRenderingSettingColors {
  type: EnumThemeRenderingSettingColorType;
  dark: IThemeRenderingSettingColorsDetail;
  light: IThemeRenderingSettingColorsDetail;
}
export interface IThemeRenderingSettingFont {
  type: EnumThemeRenderingSettingFontType;
  familyCode: EFontFamilyCode;
  size: number;
  unit: UnitEnum;
  style: EFontStyle;
  lineHeight: string;
  letterSpacing: string;
  status?: boolean;
}
export interface IThemeRenderingSettingCustomize {
  cssStyle: string;
  elementId: string;
}

export interface IThemeGeneralInfo {
  _id: string;
  html: IThemeRenderingHtml[];
  isSelected?: boolean;
}

export interface IThemeRenderingImage {
  type: { type: string };
  url: string;
  storage_id: string;
}
export interface IThemeRenderingResource {
  type: { type: string };
  url: string;
  storage_id: string;
}
export interface IThemeRenderingAssert {
  type?: { type: string };
  url?: string;
  storage_id?: string;
}
export interface IThemeRenderingHtml {
  _id?: string;
  name: string;
  html: string;
  thumbnail: {
    path: string;
    stream?: IGQLFileSteam;
  };
}
export interface IPageParam {
  pageID: number;
}

export interface IThemeRenderingSettings {
  font: IThemeRenderingSettingFont[];
  color: IThemeRenderingSettingColors[];
  integration: IThemeRenderingSettingIntregration;
  defaultFontFamily: string;
  //TODO ::::::
  //menu: IThemeRenderingSettingMenu;
}

// export interface IThemeRenderingSettingMenu {
// one: IMenuRenderingSettingLevelOptions;
// two: IMenuRenderingSettingLevelOptions;
// three: IMenuRenderingSettingLevelOptions;
// four: IMenuRenderingSettingLevelOptions;
// desktopRenderingMode: EMenuDesktopRenderingMode;
// mobileRenderingMode: EMenuMobileRenderingMode;
// }

export enum EMenuDesktopRenderingMode {
  MODAL = 'MODAL',
  EXPAND = 'EXPAND',
}
export enum EMenuMobileRenderingMode {
  TOP_DOWN = 'TOP_DOWN',
  DRILL_DOWN = 'DRILL_DOWN',
}

export interface IThemeRenderingSettingIntregration {
  googleFont: boolean;
  fontAwesome: boolean;
}
export interface IID {
  _id: string;
  index: number;
}
export interface IHostingData {
  position: number;
  status: StatusTypeEnum;
  ownerID: string;
  domainName: string;
  domainExpireDate: string;
  domainService: string;
  systemExpireData: string;
  usedHarddisk: number;
  createDate: string;
  package: string[];
}
export enum StatusTypeEnum {
  COMPLETE = 'COMPLETE',
  SUSPEND = 'SUSPEND',
  EXPIRED = 'EXPIRED',
}

type EnumAssetsThemeType = EnumThemeAssertType | EmumThemeResourceType | EnumThemeImageType | EnumThemeHtmlType;

export enum ThemeTypeEnum {
  CMS_NEXT_CMS_THEME_RENDERING = 'cms-next-cms-theme-rendering',
}

export enum EnumThemeAssertType {
  FILE = 'FILE',
  ICON = 'ICON',
  IMAGE = 'IMAGE',
}

export enum EmumThemeResourceType {
  CSS = 'CSS',
  JS = 'JS',
}

export enum EnumThemeImageType {
  MOBILE = 'MOBILE',
  DESKTOP = 'DESKTOP',
  TABLET = 'TABLET',
}

export enum EnumThemeHtmlType {
  HTML = 'HTML',
  ANGULAHTML = 'ANGULAHTML',
}

export enum EnumThemeComponentsType {
  TEXT = 'THEME_TEXT',
  LAYOUT = 'THEME_LAYOUT',
  MEDIA_GALLERY = 'THEME_MEDIA_GALLERY',
  MENU = 'THEME_MENU',
}
export enum EnumThemeAttribute {
  DATACMP = 'data-cmp',
  DATAID = 'data-id',
  DATAMODE = 'data-mode',
}
export enum EnumSelectThemeSetting {
  SELECTTHEMEINFO = 'SELECTTHEMEINFO',
  SELECTMENU = 'SELECTMENU',
  SELECTGLOBALSETTING = 'SELECTGLOBALSETTING',
}
export enum EnumActionThemeMode {
  SAVE = 'SAVE',
  PREVIEW = 'PREVIEW',
}

export const themeModelValidate = {
  result: Joi.string().required(),
};

export const defaultHTMLTag = ['div', 'span', 'p', 'img'];
