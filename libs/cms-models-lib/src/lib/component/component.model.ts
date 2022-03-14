import { EnumLanguageCultureUI, EnumThemeRenderingSettingColorType, EnumThemeRenderingSettingFontType, ShoppingCartPatternBottomTypes } from '@reactor-room/cms-models-lib';
import { ShoppingCartPatternPaginationTypes } from '../shopping-cart';

export type CmsComponent = {
  name: string;
  picture: string;
};

export enum EMediaSources {
  UPLOAD = 'UPLOAD',
  DELETED = 'DELETED',
  FREEPIK = 'FREEPIK',
  SHUTTERSTOCK = 'SHUTTERSTOCK',
  UNSPLASH = 'UNSPLASH',
}

export enum EBorderAttributes {
  COLOR = 'border-color',
  OPACITY = 'border-opacity',
}
export enum EShadowAttributes {
  IS_SHADOW = 'shadow-is-shadow',
  COLOR = 'shadow-color',
  OPACITY = 'shadow-opacity',
  XAXIS = 'shadow-x-axis',
  YAXIS = 'shadow-y-axis',
  DISTANCE = 'shadow-distance',
  BLUR = 'shadow-blur',
}
export enum EPosition {
  LEFT = 'flex-start',
  JUSTIFY_CENTER = 'center',
  RIGHT = 'flex-end',
  TOP = 'flex-start',
  ITEM_CENTER = 'center',
  BOTTOM = 'flex-end',
}
export enum EPositionAttributes {
  HORIZONTAL = 'align-horizontal',
  VERTICAL = 'align-vertical',
}
export enum EBackground {
  COLOR = 'COLOR',
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO',
}
export enum EBackgroundPosition {
  CENTER_CENTER = 'center center',
  CENTER_TOP = 'center top',
  CENTER_BOTTOM = 'center bottom',
  RIGHT_TOP = 'right top',
  RIGHT_CENTER = 'right center',
  RIGHT_BOTTOM = 'right bottom',
  LEFT_TOP = 'left top',
  LEFT_CENTER = 'left center',
  LEFT_BOTTOM = 'left bottom',
}
export enum EBackgroundSize {
  AUTO = 'auto',
  CONTAIN = 'contain',
  COVER = 'cover',
  UNSET = 'unset',
}
export enum EBackgroundSizeTitle {
  AUTO = 'Auto',
  CONTAIN = 'Contain',
  COVER = 'Cover',
  UNSET = 'Unset',
}
export enum EVideoSPeedPlay {
  NORMAL = 1,
  X05 = 0.5,
  X075 = 0.75,
  X125 = 1.25,
  X15 = 1.5,
  X2 = 2.0,
}
export enum EVideoSPeedPlayTitle {
  NORMAL = 'Normal',
  X05 = 'x0.50',
  X075 = 'x0.75',
  X125 = 'x1.25',
  X15 = 'x1.50',
  X2 = 'x2.00',
}
export enum ELayoutAttributes {
  COLUMN = 'column-grid',
  GAP = 'column-gap',
}
export enum EBackgroundAttributes {
  BACKGROUND_CURRENT = 'background-current',
  BACKGROUND_COLOR = 'background-color',
  BACKGROUND_COLOR_OPACITY = 'background-color-opacity',
  BACKGROUND_IMAGE = 'background-image',
  BACKGROUND_IMAGE_URL = 'background-image-url',
  BACKGROUND_IMAGE_POSITION = 'background-image-position',
  BACKGROUND_IMAGE_SCALE = 'background-image-scale',
  BACKGROUND_IMAGE_OPACITY = 'background-image-opacity',
  BACKGROUND_IMAGE_COLOR_OVERLAY = 'background-image-color-overlay',
  BACKGROUND_IMAGE_COLOR_OVERLAY_OPACITY = 'background-image-color-overlay-opacity',
  BACKGROUND_IMAGE_WIDTH = 'background-image-width',
  BACKGROUND_IMAGE_HEIGHT = 'background-image-height',
  BACKGROUND_IMAGE_REPEAT = 'background-image-repeat',
  BACKGROUND_IMAGE_OVERLAY = 'background-image-overlay',
  BACKGROUND_VIDEO = 'background-video',
  BACKGROUND_VIDEO_URL = 'background-video-url',
  BACKGROUND_VIDEO_POSITION = 'background-video-position',
  BACKGROUND_VIDEO_LOOP = 'background-video-loop',
  BACKGROUND_VIDEO_SPEED = 'background-video-speed',
  BACKGROUND_VIDEO_SCALE = 'background-video-scale',
  BACKGROUND_VIDEO_OPACITY = 'background-video-opacity',
  BACKGROUND_VIDEO_COLOR_OVERLAY = 'background-video-color-overlay',
  BACKGROUND_VIDEO_COLOR_OVERLAY_OPACITY = 'background-video-color-overlay-opacity',
  BACKGROUND_VIDEO_WIDTH = 'background-video-width',
  BACKGROUND_VIDEO_HEIGHT = 'background-video-height',
  BACKGROUND_VIDEO_TAG = 'background-video-tag',
  BACKGROUND_VIDEO_OVERLAY = 'background-video-overlay',
}
export enum EHoverAttributes {
  STYLE = 'hover-style',
}
export enum ELayoutColumns {
  ONE_COLUMN = '1fr',
  THREE_COLUMN = 'repeat(3, 1fr)',
  FOUR_COLUMN = 'repeat(4, 1fr)',
  FIVE_FIVE_COLUMN = 'repeat(2, 1fr)',
  SIX_FOUR_COLUMN = '6fr 4fr',
  FOUR_SIX_COLUMN = '4fr 6fr',
  SEVEN_THREE_COLUMN = '7fr 3fr',
  THREE_SEVEN_COLUMN = '3fr 7fr',
}
export enum ELayoutColumnTitles {
  ONE_COLUMN = '1 Column',
  THREE_COLUMN = '3 Columns',
  FOUR_COLUMN = '4 Columns',
  FIVE_FIVE_COLUMN = '50 : 50',
  SIX_FOUR_COLUMN = '60 : 40',
  FOUR_SIX_COLUMN = '40 : 60',
  SEVEN_THREE_COLUMN = '70 : 30',
  THREE_SEVEN_COLUMN = '30 : 70',
}
export enum ETextHoverStyle {
  STYLE_1 = 'text-hover-style-1',
  STYLE_2 = 'text-hover-style-2',
  STYLE_3 = 'text-hover-style-3',
  STYLE_4 = 'text-hover-style-4',
  STYLE_5 = 'text-hover-style-5',
  STYLE_6 = 'text-hover-style-6',
  STYLE_7 = 'text-hover-style-7',
}
export enum EScrollEffect {
  NONE = 'None',
  PARALAX = 'Paralax',
  REVEAL = 'Reveal',
  ZOOM_IN = 'Zoom In',
  FADE_IN = 'Fade In',
}
export enum EFontFamily {
  RACING_SANS_ONE = 'Racing Sans One',
  PROMPT = 'Prompt',
  QUANTICO = 'Quantico',
  POST_NO_BILLS_COLOMBO = 'Post No Bills Colombo',
  NEUCHA = 'Neucha',
}
export enum EFontFamilyCode {
  RACING_SANS_ONE = 'racing',
  PROMPT = 'prompt',
  QUANTICO = 'quantico',
  POST_NO_BILLS_COLOMBO = 'colombo',
  NEUCHA = 'neucha',
}
export enum UnitEnum {
  PX = 'px',
  EM = 'em',
}
export enum EFontStyle {
  REGULAR = 'Regular',
  BOLD = 'Bold',
  ITALIC = 'Italic',
}

export enum ETextStyle {
  REGULAR = 'regular',
  UNDERLINE = 'underline',
  BOLD = 'bold',
  ITALIC = 'italic',
}

export enum ETextTransform {
  UPPERCASE = 'uppercase',
  LOWERCASE = 'lowercase',
  CAPITALIZE = 'capitalize',
}

export enum ButtonEffectType {
  NO_EFFECT = '',
  BUTTON_FOCUS_IN = 'text-focus-in',
  BUTTON_BLUR_OUT = 'text-blur-out',
  BUTTON_FLICKER_IN_GLOW = 'text-flicker-in-glow',
  BUTTON_SHADOW_DROP_CENTER = 'text-shadow-drop-center',
  BUTTON_SHADOWN_POP_TOP = 'text-shadow-pop-top',
  BUTTON_POP_UP_TOP = 'text-pop-up-top',
}
export enum ButtonEffectTitleType {
  NO_EFFECT = 'No Effect',
  BUTTON_FOCUS_IN = 'Text Focus In',
  BUTTON_BLUR_OUT = 'Text Blur Out',
  BUTTON_FLICKER_IN_GLOW = 'Text Flicker In Glow',
  BUTTON_SHADOW_DROP_CENTER = 'Text Shadow Drop Center',
  BUTTON_SHADOWN_POP_TOP = 'Text Shadow Pop Top',
  BUTTON_POP_UP_TOP = 'Text Pop Up Top',
}

export enum HoverAnimationTypes {
  NONE = 'NONE',
  SWAP = 'SWAP',
  ZOOM_IN = 'ZOOM_IN',
}

export enum ETextAlignment {
  LEFT = '',
  CENTER = 'center',
  RIGHT = 'right',
  JUSTIFY = 'justify',
}
export enum EDecoration {
  DASH = 'dash',
  UNDERLINE = 'underline',
  CROSSWORD = 'crossword',
}
export enum ENumberPosition {
  SCRIPT = '',
  SUPERSCRIPT = 'super',
  SUBSCRIPT = 'sub',
}
export enum EBullet {
  NONE = '',
  NUMBERED_LIST = 'ordered',
  BULLETED_LIST = 'bullet',
}
export enum ElinkType {
  URL = 'link-to-url',
  PAGE = 'link-to-page',
  PRODUCT = 'link-to-product-page',
  CONTENT = 'link-to-content',
  POPUP = 'link-to-pop-up',
  ANCHOR = 'link-to-anchor',
  EMAIL = 'link-to-email',
}
export enum ElinkTypeTitle {
  URL = 'Link to URL',
  PAGE = 'Link to Page',
  PRODUCT = 'Link to Product Page',
  CONTENT = 'Link to Content',
  POPUP = 'Link to Pop-up',
  ANCHOR = 'Link to Anchor',
  EMAIL = 'Link to Email',
}
export enum ETextPosition {
  LEFT = 'left',
  JUSTIFY_CENTER = 'justify-center',
  RIGHT = 'right',
  TOP = 'top',
  ITEM_CENTER = 'item-center',
  BOTTOM = 'bottom',
}
export enum OverlayEffectType {
  NONE = '',
  FADE = 'overlay-fade',
  ZOOM_IN = 'overlay-zoom-in',
  ZOOM_OUT = 'overlay-zoom-out',
  SLIDE_IN = 'overlay-slide-in',
  MOVE_UP = 'overlay-move-up',
}
export enum OverlayEffectTitleType {
  NONE = '',
  FADE = 'Fade',
  ZOOM_IN = 'Zoom In',
  ZOOM_OUT = 'Zoom Out',
  SLIDE_IN = 'Slide In',
  MOVE_UP = 'Move Up',
}
export enum TextEffectType {
  NO_EFFECT = '',
  TRACKING_IN_EXPAND = 'tracking-in-expand',
  TRACKING_OUT_CONTRACT = 'tracking-out-contract',
  TEXT_FOCUS_IN = 'text-focus-in',
  TEXT_BLUR_OUT = 'text-blur-out',
  TEXT_FLICKER_IN_GLOW = 'text-flicker-in-glow',
  TEXT_SHADOW_DROP_CENTER = 'text-shadow-drop-center',
  TEXT_SHADOWN_POP_TOP = 'text-shadow-pop-top',
  TEXT_POP_UP_TOP = 'text-pop-up-top',
}
export enum TextEffectTitleType {
  NO_EFFECT = 'No Effect',
  TRACKING_IN_EXPAND = 'Tracking In Expand',
  TRACKING_OUT_CONTRACT = 'Tracking Out Contract',
  TEXT_FOCUS_IN = 'Text Focus In',
  TEXT_BLUR_OUT = 'Text Blur Out',
  TEXT_FLICKER_IN_GLOW = 'Text Flicker In Glow',
  TEXT_SHADOW_DROP_CENTER = 'Text Shadow Drop Center',
  TEXT_SHADOWN_POP_TOP = 'Text Shadow Pop Top',
  TEXT_POP_UP_TOP = 'Text Pop Up Top',
}
export enum ECmsEditRenderingMode {
  CONTENT_MANAGE = 'content-manage',
  SITE_MANAGE = 'site-manage',
}
export enum ColumnType {
  COLUMN_1 = '0',
  COLUMN_2 = '1',
  COLUMN_3 = '2',
  COLUMN_4 = '3',
}
export enum TextType {
  Text1 = 'Text1',
  Text2 = 'Text2',
  Text3 = 'Text3',
  Text4 = 'Text4',
  Text5 = 'Text5',
}
export enum TextID {
  Text1 = 'text-1',
  Text2 = 'text-2',
  Text3 = 'text-3',
  Text4 = 'text-4',
  Text5 = 'text-5',
  Text6 = 'text-6',
  Text7 = 'text-7',
}

export enum OpenWindowTypes {
  NEW = 'NEW',
  CURRENT = 'CURRENT',
}

export enum ShoppingCartTypes {
  SHOPPING_CART_1 = 'SHOPPING_CART_1',
  SHOPPING_CART_2 = 'SHOPPING_CART_2',
  SHOPPING_CART_3 = 'SHOPPING_CART_3',
}
export enum MediaGalleryType {
  GALLERY_1 = 'GALLERY_1',
  GALLERY_2 = 'GALLERY_2',
  GALLERY_3 = 'GALLERY_3',
  GALLERY_4 = 'GALLERY_4',
  GALLERY_5 = 'GALLERY_5',
  GALLERY_6 = 'GALLERY_6',
  GALLERY_7 = 'GALLERY_7',
  GALLERY_8 = 'GALLERY_8',
  GALLERY_9 = 'GALLERY_9',
  GALLERY_10 = 'GALLERY_10',
  GALLERY_11 = 'GALLERY_11',
  GALLERY_12 = 'GALLERY_12',
  GALLERY_13 = 'GALLERY_13',
  GALLERY_14 = 'GALLERY_14',
  GALLERY_15 = 'GALLERY_15',
  GALLERY_16 = 'GALLERY_16',
  GALLERY_17 = 'GALLERY_17',
  GALLERY_18 = 'GALLERY_18',
  GALLERY_19 = 'GALLERY_19',
  GALLERY_20 = 'GALLERY_20',
  GALLERY_21 = 'GALLERY_21',
  GALLERY_22 = 'GALLERY_22',
  GALLERY_23 = 'GALLERY_23',
  GALLERY_24 = 'GALLERY_24',
  GALLERY_25 = 'GALLERY_25',
  GALLERY_26 = 'GALLERY_26',
  GALLERY_27 = 'GALLERY_27',
  GALLERY_28 = 'GALLERY_28',
  GALLERY_29 = 'GALLERY_29',
  GALLERY_30 = 'GALLERY_30',
  GALLERY_31 = 'GALLERY_31',
  GALLERY_32 = 'GALLERY_32',
  GALLERY_33 = 'GALLERY_33',
  GALLERY_34 = 'GALLERY_34',
  GALLERY_35 = 'GALLERY_35',
  GALLERY_36 = 'GALLERY_36',
  GALLERY_37 = 'GALLERY_37',
  GALLERY_38 = 'GALLERY_38',
  GALLERY_39 = 'GALLERY_39',
  GALLERY_40 = 'GALLERY_40',
  GALLERY_41 = 'GALLERY_41',
  GALLERY_42 = 'GALLERY_42',
  GALLERY_43 = 'GALLERY_43',
  GALLERY_44 = 'GALLERY_44',
  GALLERY_45 = 'GALLERY_45',
  GALLERY_46 = 'GALLERY_46',
  GALLERY_47 = 'GALLERY_47',
  GALLERY_48 = 'GALLERY_48',
  GALLERY_49 = 'GALLERY_49',
  GALLERY_50 = 'GALLERY_50',
  GALLERY_51 = 'GALLERY_51',
  GALLERY_52 = 'GALLERY_52',
}
export enum MediaSliderType {
  SLIDER_1 = 'SLIDER_1',
}

export enum ButtonType {
  TYPE_1 = 'TYPE_1',
}

export enum MenuRenderingType {
  MENU_TYPE_1 = 'MENU_TYPE_1',
}

export enum ThemeElementsType {
  TEMPLATE_1 = 'template_1',
  TEMPLATE_2 = 'template_2',
  TEMPLATE_3 = 'template_3',
  TEMPLATE_4 = 'template_4',
  TEMPLATE_5 = 'template_5',
  TEMPLATE_6 = 'template_6',
  TEMPLATE_7 = 'template_7',
  TEMPLATE_8 = 'template_8',
  TEMPLATE_9 = 'template_9',
  TEMPLATE_10 = 'template_10',
  TEMPLATE_11 = 'template_11',
  TEMPLATE_12 = 'template_12',
  TEMPLATE_13 = 'template_13',
  TEMPLATE_14 = 'template_14',
  TEMPLATE_15 = 'template_15',
  TEMPLATE_16 = 'template_16',
  TEMPLATE_17 = 'template_17',
  TEMPLATE_18 = 'template_18',
  TEMPLATE_19 = 'template_19',
  TEMPLATE_20 = 'template_20',
}

export enum MenuGenericType {
  TEXT = 'Text',
  LAYOUT = 'Layout',
  MEDIA_GALLERY = 'MEDIA_GALLERY',
  MEDIA_SLIDER = 'MEDIA_SLIDER',
  CONTENT_MANAGEMENT = 'CONTENT_MANAGEMENT',
  CONTENT_MANAGEMENT_LANDING = 'CONTENT_MANAGEMENT_LANDING',
  TEMPLATE_ELEMENTS = 'TEMPLATE_ELEMENTS',
  BUTTON = 'BUTTON',
  MENU = 'MENU',
  SHOPPING_CART = 'SHOPPING_CART',
}

export const enum UndoRedoEnum {
  Undo = 'UNDO',
  Redo = 'REDO',
}
export type UndoRedoDropped = { undoRedoDropped?: UndoRedoEnum };
export type MenuType = TextType | ELayoutColumns | MediaGalleryType | MediaSliderType | ButtonType | ThemeElementsType | MenuRenderingType | ShoppingCartTypes | string;
export enum ComponentTypeEnum {
  CMS_NEXT_CMS_THEME_RENDERING = 'cms-next-cms-theme-rendering',
  CMS_NEXT_CMS_LAYOUT_RENDERING = 'cms-next-cms-layout-rendering',
  CMS_NEXT_CMS_CONTAINER_RENDERING = 'cms-next-cms-container-rendering',
  CMS_NEXT_CMS_TEXT_RENDERING = 'cms-next-cms-text-rendering',
  CMS_NEXT_CMS_BUTTON_RENDERING = 'cms-next-cms-button-rendering',
  CMS_NEXT_CMS_MEDIA_GALLERY_RENDERING = 'cms-next-cms-media-gallery-rendering',
  CMS_NEXT_CMS_MEDIA_GALLERY_ITEM_RENDERING = 'cms-next-cms-media-gallery-item-rendering',
  CMS_NEXT_CMS_CONTENT_MANAGEMENT_RENDERING = 'cms-next-cms-content-management-rendering',
  CMS_NEXT_CMS_CONTENT_MANAGEMENT_LANDING_RENDERING = 'cms-next-cms-content-management-landing-rendering',
  CMS_NEXT_CMS_CONTENT_HEADER_LANDING = 'cms-next-cms-content-header-landing',
  CMS_NEXT_CMS_CONTENT_SUB_HEADER_LANDING = 'cms-next-cms-content-sub-header-landing',
  CMS_NEXT_CMS_CONTENT_SHARE_LANDING = 'cms-next-cms-content-share-landing',
  CMS_NEXT_CMS_CONTENT_VIEW_COUNT_LANDING = 'cms-next-cms-content-view-count-landing',
  CMS_NEXT_CMS_CONTENT_COMMENT_COUNT_LANDING = 'cms-next-cms-content-comment-count-landing',
  CMS_NEXT_CMS_CONTENT_DATE_LANDING = 'cms-next-cms-content-date-landing',
  CMS_NEXT_CMS_CONTENT_COVER_IMAGE_LANDING = 'cms-next-cms-content-cover-image-landing',
  CMS_NEXT_CMS_CONTENT_COMMENT_LANDING = 'cms-next-cms-content-comment-landing',
  CMS_NEXT_CMS_CONTENT_SIDEBAR_LANDING = 'cms-next-cms-content-sidebar-landing',
  CMS_NEXT_CMS_MENU_RENDERING = 'cms-next-cms-menu-rendering',
  //theme
  CMS_NEXT_CMS_PLAIN_DIV_RENDERING = 'cms-next-cms-plain-html-rendering',
  CMS_NEXT_CMS_PLAIN_P_RENDERING = 'cms-next-cms-plain-p-rendering',
  CMS_NEXT_CMS_PLAIN_SPAN_RENDERING = 'cms-next-cms-plain-span-rendering',
  CMS_NEXT_CMS_PLAIN_IMG_RENDERING = 'cms-next-cms-plain-img-rendering',
  CMS_NEXT_CMS_PLAIN_TEXT_RENDERING = 'cms-next-cms-text-html-rendering',
  //section
  CMS_NEXT_CMS_HEADER_CONTAINER_RENDERING = 'cms-next-cms-header-container-rendering',
  CMS_NEXT_CMS_SIDEBAR_CONTAINER_RENDERING = 'cms-next-cms-sidebar-container-rendering',
  CMS_NEXT_CMS_CONTENT_CONTAINER_RENDERING = 'cms-next-cms-content-container-rendering',
  CMS_NEXT_CMS_FOOTER_CONTAINER_RENDERING = 'cms-next-cms-footer-container-rendering',
  CMS_NEXT_CMS_SHOPPING_CART_RENDERING = 'cms-next-cms-shopping-cart-rendering',
}

export enum LandingAreaType {
  LANDING_AREA = '[LANDING_AREA]',
}

export enum ContentLandingElementType {
  HEADER = '[HEADER]',
  SUB_HEADER = '[SUB_HEADER]',
  SHARE = '[SHARE]',
  VIEW_COUNT = '[VIEW_COUNT]',
  COMMENT_COUNT = '[COMMENT_COUNT]',
  DATE = '[DATE]',
  COVER_IMAGE = '[COVER_IMAGE]',
  CONTENT = '[CONTENT]',
  COMMENT = '[COMMENT]',
  SIDEBAR = '[SIDEBAR]',
}
export enum HTMLTypeEnum {
  DIV = 'DIV',
  P = 'P',
  SPAN = 'SPAN',
  IMG = 'IMG',
}
export type ComponentOptions =
  | ITextRenderingSetting
  | ILayoutRenderingSetting
  | IMediaGalleryRenderingSetting
  | IMediaGalleryItemRenderingSetting
  | IContentManagementRenderingSetting
  | ILandingContentManagementRenderingSetting
  | IButtonRenderingSetting
  | IMenuRenderingSetting
  | IShoppingCartRenderingSetting;

export enum EMenuSourceType {
  ROOT_MENU = 'ROOT_MENU', // Page Structure belong to z_cms_web_pages
  CHILD_MENU = 'CHILD_MENU', // Page Structure belong to z_cms_web_pages
  CUSTOM_MENU = 'CUSTOM_MENU', // // Page Structure belong to z_cms_menu_custom
}
export interface IMenuCssJs {
  css: string;
  js: string;
}

export interface ILandingContentManagementRenderingSetting {
  landing: IContentManagementLanding;
  pattern: IContentManagementLandingPattern;
}
export interface IMenuRenderingSetting {
  source: IMenuRenderingSettingSource;
  setting: IMenuRenderingSettingSetting;
  mobile: IMenuRenderingSettingMobile;
  level: IMenuRenderingSettingLevel;
}

export interface IMenuRenderingSettingSource {
  menuGroupId: string;
  sourceType: EMenuSourceType;
  parentMenuId: string;
}

export interface IMenuRenderingSettingSetting
  extends IMenuRenderingSettingSettingSticky,
    IMenuRenderingSettingSettingAnimation,
    IMenuRenderingSettingSettingAlignment,
    IMenuRenderingSettingSettingStyle {
  icon: IMenuRenderingSettingSettingIcon;
  mega: IMenuRenderingSettingSettingMega;
}

export interface IMenuRenderingSettingSettingSticky {
  sticky: EStickyMode;
}

export interface IMenuRenderingSettingSettingAnimation {
  animation: OverlayEffectType;
}

export interface IMenuRenderingSettingSettingAlignment {
  alignment: ETextAlignment;
}

export interface IMenuRenderingSettingSettingStyle {
  style: EMenuStyle;
}

export interface IMenuRenderingSettingSettingMega {
  size: string;
  color: {
    value: string;
    opacity: number;
  };
}

export interface IMenuRenderingSettingLevel {
  one: IMenuRenderingSettingLevelOptions;
  two: IMenuRenderingSettingLevelOptions;
  three: IMenuRenderingSettingLevelOptions;
  four: IMenuRenderingSettingLevelOptions;
}

export interface IMenuRenderingSettingLevelOptions {
  size: string;
  style: EFontStyle;
  text: {
    normal: IColorStyle;
    hover: IColorStyle;
    active: IColorStyle;
  };
  backGround: {
    normal: IColorStyle;
    hover: IColorStyle;
    active: IColorStyle;
  };
  shadow: ILayoutSettingShadow;
  textAnimation: ETextHoverStyle;
  backgroundAnimation: OverlayEffectType;
}

export interface IColorStyle {
  style?: EColorStyle;
  color?: {
    value: string;
    opacity: number;
  };
  gradientColor?: {
    type: EGradientColorType;
    colors: string[];
  };
  image?: string;
}

export enum EColorStyle {
  COLOR = 'COLOR',
  IMAGE = 'IMAGE',
  GRADIENT = 'GRADIENT',
}

export enum EGradientColorType {
  LINEAR = 'LINEAR',
}

export interface IDropDown {
  title: string;
  value: string;
  status?: boolean;
}

export interface IMenuRenderingSettingMobile {
  hamburger: IMenuRenderingSettingMobileHamburger;
  featureIcon: IMenuRenderingSettingMobileIcon;
}

export interface IMenuRenderingSettingMobileHamburger {
  icon: {
    iconGroup: EMenuHamburgerGroup;
    activeIcon: string;
    inactiveIcon: string;
  };
  isText: boolean;
  text: string;
  position: ETextPosition; // Only working with LEFT and RIGHT
}

export enum EMenuHamburgerGroup {
  GROUP_1 = 'GROUP_1',
  GROUP_2 = 'GROUP_2',
  GROUP_3 = 'GROUP_3',
  GROUP_4 = 'GROUP_4',
}

export interface IMenuRenderingSettingMobileIcon {
  icons: EFeatureIcon[];
  isSearch: boolean;
  isLanguage: boolean;
}

export enum EFeatureIcon {
  FACEBOOK = 'fab fa-facebook',
  LINE = 'fab fa-line',
  MOBILE = 'fas fa-phone-square',
  WE_CHAT = 'fab fa-weixin',
}

export enum EMenuStyle {
  HORIZONTAL = 'HORIZONTAL',
  VERTICAL = 'VERTICAL',
}
export interface IMenuRenderingSettingSettingIcon {
  isIcon: boolean;
  size: string;
  color: {
    value: string;
    opacity: number;
  };
  status: boolean;
  position: ETextPosition;
}

export enum EStickyMode {
  NONE = 'NONE',
  AUTO = 'AUTO',
  FIXED = 'FIXED',
  SMART = 'SMART',
}
export interface IContentManagementRenderingSetting {
  general: IContentManagementGeneral;
  contents: IContentManagementContents;
  landing: IContentManagementLanding;
}

export interface IShoppingCartRenderingSetting {
  pattern: IShoppingCartPatternSetting;
}

export interface IShoppingCartPatternSetting {
  type: ShoppingCartTypes;
  advanceSetting: ICmsLayoutBottomTypes;
}
export interface IButtonSetting {
  background: IButtonSettingBackground;
  padding: IButtonSettingPadding;
}
export interface IButtonRenderingSetting {
  buttonSetting: IButtonSetting;
  buttonBorder: IButtonBorder;
  buttonText: IButtonText;
  generalLinkSetting: IGeneralLink;
  buttonHover: IButtonHover;
}

export interface IButtonSettingPadding {
  left: number;
  top: number;
  right: number;
  bottom: number;
}

export interface IButtonSettingBackground {
  backgroundColor: string;
  backgroundColorOpacity: number;
}

export interface IButtonBorder {
  corner: IButtonBorderCorner;
  color: string;
  opacity: number;
  thickness: number;
  position: IButtonBorderPosition;
}

export interface IButtonBorderPosition {
  left: boolean;
  top: boolean;
  right: boolean;
  bottom: boolean;
}

export interface IButtonBorderCorner {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}

export interface IButtonText {
  text: string;
  isFontDefault: boolean;
  isFontIndexDefault: number;
  isStyleDefault: boolean;
  isTextColorDefault: boolean;
  isTextOpacityDefault: boolean;
  isLineHeightDefault: boolean;
  isLetterSpacingDefault: boolean;
  fontFamily: EFontFamilyCode;
  fontStyle: EFontStyle;
  fontSize: string;
  textColor: string;
  textOpacity: string;
  textAlignment: string;
  lineHeight: string;
  letterSpacing: string;
  isIcon: boolean;
  iconCode: string;
  iconBeforeText: boolean;
  iconSize: number;
  iconColor: string;
  iconColorOpacity: number;
}

export interface IButtonHover {
  isHover: boolean;
  buttonHoverColor: string;
  buttonHoverColorOpacity: number;
  borderHoverColor: string;
  borderHoverColorOpacity: number;
  textHoverColor: string;
  textHoverColorOpacity: number;
  textHoverTransform: ETextStyle;
  hoverEffect: ButtonEffectType;
}
export interface IContentManagementGeneral {
  pattern: IContentManagementGeneralPattern;
  advance: IContentManagementGeneralAdvance;
}

export interface IContentManagementLanding {
  _id: string;
  option: IContentManagementLandingOption;
}

export interface IContentManagementLandingPattern {
  _id: string;
  patternUrl: string;
  patternName: string;
  html: string;
  css: string;
}

export interface IContentManagementLandingOption {
  isView: boolean;
  isComment: boolean;
  isPublishDate: boolean;
  isSocialShare: boolean;
  isRightContent: boolean;
  rightContent: IContentManagementLandingOptionRightContent;
}

export interface IContentManagementLandingOptionRightContent {
  type: RightContentType;
  title: string;
  categoryIds: string[];
  contentSortBy: EContentSortBy;
  isPinContentFirst: boolean;
  isMaxItem: boolean;
  maxItemNumber: number;
  moreTitle: string;
}

export enum RightContentType {
  TYPE_1 = 'TYPE_1',
  TYPE_2 = 'TYPE_2',
}

export interface IContentManagementGeneralAdvance {
  display: IContentManagementGeneralDisplay;
  isContentGroup: boolean;
  bottom: IContentManagementGeneralBottom;
}

export type IContentManagementGeneralDisplay = IContentManagementGeneralDisplayTab | IContentManagementGeneralDisplayLink | IContentManagementGeneralDisplayNone;

export interface IContentManagementGeneralDisplayNone {
  displayType: EContentManagementGeneralDisplay;
}
export interface IContentManagementGeneralDisplayLink {
  displayType: EContentManagementGeneralDisplay;
  array: IContentManagementGeneralDisplayTabLinkArray[];
}

export interface IContentManagementGeneralDisplayTab {
  displayType: EContentManagementGeneralDisplay;
  array: IContentManagementGeneralDisplayTabLinkArray[];
}

export interface IContentManagementGeneralDisplayTabLinkArray {
  title: string;
  value: string;
}

export type IContentManagementGeneralBottom = IContentManagementGeneralBottomButton | IContentManagementGeneralBottomPagination | IContentManagementGeneralBottomNone;

export interface IContentManagementGeneralBottomNone {
  bottomType: EContentManagementGeneralBottomType;
}
export interface IContentManagementGeneralBottomButton {
  bottomType: EContentManagementGeneralBottomType;
  name: string;
  link: ILink;
  isNewWindow: boolean;
}

export interface IContentManagementGeneralBottomPagination {
  bottomType: EContentManagementGeneralBottomType;
  type: EContentManagementGeneralBottomPaginationType;
  position: ETextAlignment;
}

export enum EContentManagementGeneralBottomPaginationType {
  TYPE_1 = 'TYPE_1',
  TYPE_2 = 'TYPE_2',
  TYPE_3 = 'TYPE_3',
  TYPE_4 = 'TYPE_4',
}

export enum EContentManagementGeneralDisplay {
  NONE = 'NONE',
  TAB = 'TAB',
  LINK = 'LINK',
}

export enum EContentManagementGeneralBottomType {
  NONE = 'NONE',
  BUTTON = 'BUTTON',
  PAGINATION = 'PAGINATION',
}
export interface IContentManagementGeneralPattern {
  _id: string;
  patternName: string;
  patternUrl: string;
  patternStyle: IContentManagementPatternStyle;
}
export interface IContentManagementPatternStyle {
  container: IContentManagementPaternGrid;
  primary: IContentManagementPaternItem;
  secondary: IContentManagementPaternItem;
  css: string;
}
export interface IContentManagementPaternItem {
  maxContent: number;
  grid: IContentManagementPaternGrid;
  status: boolean;
}
export interface IContentManagementPaternGrid {
  gridTemplateColumns: string;
  gridTemplateRows?: string;
  gridGap: string;
}

export interface IContentManagementContents {
  categoryIds: string[];
  contentSortBy: EContentSortBy;
  isPinContentFirst: boolean;
  isShortDescription: boolean;
  isView: boolean;
  isPublishedDate: boolean;
  isShare: boolean;
}

export enum EContentSortBy {
  NAME = 'NAME',
  RECENT_EDIT = 'RECENT_EDIT',
  PUBLISH_DATE = 'PUBLISH_DATE',
  VIEW = 'VIEW',
  RATING = 'RATING',
  MOST_COMMENT = 'MOST_COMMENT',
  RANDOM = 'RANDOM',
}

export interface IPageSliderControl {
  isPageSlide: boolean;
  isAutoSlide: boolean;
  slideSpeed: number;
  isPageButton: boolean;
  pageButtonSize: number;
  pageButtonOffset: number;
  isPageArrow: boolean;
  pageArrowSize: number;
  pageArrowOffset: number;
}

export interface IMediaButtonAction {
  title: string;
  action: EMediaSources;
  status: boolean;
}
export interface ILayoutSettingBorder {
  corner: ILayoutSettingBorderCorner;
  color: string;
  opacity: number;
  thickness: number;
  position: ILayoutSettingBorderPosition;
}
export interface ILayoutSettingBorderCorner {
  topLeft: number;
  topRight: number;
  bottomLeft: number;
  bottomRight: number;
}
export interface ILayoutSettingBorderPosition {
  left: boolean;
  top: boolean;
  right: boolean;
  bottom: boolean;
}
export interface ILayoutSettingShadow {
  isShadow: boolean;
  color: string;
  opacity: number;
  xAxis: number;
  yAxis: number;
  distance: number;
  blur: number;
}
export interface ILayoutDesignEffect {
  scrollEffect: string;
  xAxis: number;
  yAxis: number;
  isStretch: boolean;
  margin: number;
}
export interface ILayoutDesignLayoutEffect {
  scrollEffect: string;
  xAxis: number;
  yAxis: number;
  isStretch: boolean;
  margin: number;
}
export interface ILayoutSettingHover {
  style: string;
  textHover: string;
}
export interface ILayoutSettingAdvance {
  margin: ILayoutSettingAdvanceDetail;
  padding: ILayoutSettingAdvanceDetail;
  horizontalPosition: string;
  verticalPosition: string;
}
export interface ILayoutSettingAdvanceDetail {
  left: number;
  top: number;
  right: number;
  bottom: number;
}
export interface ILayoutSettingBackground {
  currentStyle: string;
  layoutSettingBackgroundColorForm: ILayoutSettingBackgroundColor;
  layoutSettingBackgroundImageForm: ILayoutSettingBackgroundImage;
  layoutSettingBackgroundVideoForm: ILayoutSettingBackgroundVideo;
}
export interface ILayoutSettingBackgroundColor {
  color: string;
  opacity: number;
}

export interface ILayoutSettingBackgroundImage {
  imgUrl: string;
  position: string;
  imageScale: string;
  opacity: number;
  colorOverlay: string;
  colorOverlayOpacity: number;
  width: number;
  height: number;
  repeat: boolean;
}
export interface ILayoutSettingBackgroundVideo {
  videoUrl: string;
  position: string;
  playInLoop: boolean;
  videoSpeed: number;
  videoScale: string;
  opacity: number;
  colorOverlay: string;
  colorOverlayOpacity: number;
  width: number;
  height: number;
}
export interface ILayoutSettingCustomize {
  cssStyle: string;
  elementId: string;
}
export interface ILayoutColumn {
  column: ELayoutColumns;
  gap: number;
}
export interface IMediaGallery {
  gallery: IMediaGallerySetting;
  control: IMediaGalleryControl;
}

export interface IShoppingCart {
  type: ShoppingCartTypes;
  previewImgUrl: string;
}
export interface IMediaGallerySetting {
  galleryPatternId: MediaGalleryType;
  galleryPatternUrl: string;
  galleryGap?: number;
  galleryMaxHeight?: number;
  isChangePattern?: boolean; //no
  gallleryList?: IMediaGalleryList[];
}

export interface IMediaGalleryListIndex {
  item: IMediaGalleryList;
  index: number;
}

export interface IMediaGalleryList {
  url: string; //no
  fileType: EBackground; //no
  title: string; //no
  description?: string; //no
  status?: boolean; //no
  setting?: IMediaGalleryItem;
  source?: EMediaSources; //no
  isBookmark?: boolean; //no
}
export type IMediaGalleryControl = IPageSliderControl;

export interface IGridRowStyle {
  display: string;
  gridTemplateColumns: string;
  gridAutoRows: string;
  gap: string;
}

export interface IGridColumnStyle {
  display: string;
  gap: string;
}
export interface IText {
  fontFamily: EFontFamilyCode;
  fontStyle: EFontStyle;
  fontSize: string;
  textColor: string;
  colorStyle: EnumThemeRenderingSettingColorType;
  textOpacity: string;
  textAlignment: ETextAlignment;
}
export interface ITypography {
  lineHeight: string;
  letterSpacing: string;
  decoration: EDecoration;
  numberPosition: ENumberPosition;
  bullet: EBullet;
  horizontalPosition: ETextPosition;
  verticalPosition: ETextPosition;
}
export interface ILink {
  linkType: ElinkType;
  linkValue: string;
  parentID: string;
}
export interface IContentManageText {
  themeStyle: EnumThemeRenderingSettingFontType;
  text: IText;
  typography: ITypography;
  link: ILink;
  isThemeFontSize: boolean;
  isThemeFontFamily: boolean;
  isThemeStyle: boolean;
  isThemeTextColor: boolean;
  isThemeTextOpacity: boolean;
  isThemeLineHeight: boolean;
  isThemeLetterSpacing: boolean;
}
export interface IGeneralLink {
  linkType: ElinkType; //no
  linkValue: string; //no
  parentID: string; //no
}
export interface IGeneralText {
  text: IGeneralTextText;
  overlay: IGeneralTextOverlay;
  horizontalPosition: EPosition;
  verticalPosition: EPosition;
  isApplyAll: boolean; //yes
}
export interface IGeneralTextOverlay {
  isOverlay: boolean;
  isOverlayFullWidth: boolean;
  overlayColor: string;
  overlayOpacity: string;
  overlayAnimation: OverlayEffectType;
}
export interface IGeneralTextText {
  isText: boolean;
  text: IGeneralTextTextCultureUI[];
  isFontDefault: boolean;
  isFontIndexDefault: number;
  isStyleDefault: boolean;
  isTextColorDefault: boolean;
  isTextOpacityDefault: boolean;
  isLineHeightDefault: boolean;
  isLetterSpacingDefault: boolean;
  fontFamily: EFontFamilyCode;
  fontStyle: EFontStyle;
  titleFontSize: string; //save unit
  descriptionFontSize: string; //save unit
  textColor: string;
  textOpacity: string;
  textAlignment: ETextAlignment;
  lineHeight: string; // no have in UI
  letterSpacing: string; // no have in UI
  textAnimation: TextEffectType;
}

export interface IGeneralTextTextCultureUI {
  cultureUI: EnumLanguageCultureUI;
  title: string;
  description: string;
}
export interface IMediaGalleryItem {
  generalBackgroundSetting: ILayoutSettingBackground;
  generalTextSetting: IGeneralText;
  generalLinkSetting: IGeneralLink;
}
export interface ITextSettingInit {
  color: string;
  font: EFontFamilyCode;
  size: string;
}
export interface IFont {
  title: string;
  key?: string;
  fontFamilyCode: EFontFamilyCode;
}

// TODO: Refactor
export interface IWebPageComponentDelta {
  themeComponentsDelta: IDeltaRenderingComponentData;
  componentsDelta: IDeltaRenderingComponentData;
}
export interface IDeltaRenderingComponentData {
  webPageID: string;
  added: string[];
  moved: string[];
  movedWithMutated: string[];
  removed: string[];
  mutated: string[];
  lastId: string;
  lastHeaderId: string;
  lastFooterId: string;
}

// TODO: Refactor
export interface IDeltaRenderingComponentDataArg {
  deltaPageComponent: IDeltaRenderingComponentData;
}

export interface IPageComponent {
  components: IRenderingComponentData[];
  themeComponents?: IRenderingComponentData[];
  webPageID: string;
  angularHTML?: string;
  pageID?: number;
  startID: string;
}
export interface IMockPageComponent extends IPageComponent {
  userID?: number;
  subscriptionID?: string;
}
export interface IThemeComponent {
  themeComponents: IRenderingComponentData[];
  angularHTML: string;
}
export interface IWebPageThemelayoutIndex {
  webPageID: string;
  themeLayoutIndex: number;
}
export interface IPageComponentArg {
  pageComponent: IPageComponent;
}

export interface IRenderingComponentData {
  _id: string;
  componentType: ComponentTypeEnum; // change name from htmlTagName to ComponentType
  themeOption?: IThemeOption;
  commonSettings?: ICommonSettings;
  options?: ComponentOptions;
  section?: ComponentTypeEnum;
  outterHTML?: string;
  orderNumber?: number;
  themeLayoutChildIds?: string[];
  layoutID?: string; // -1 0 null
  themeLayoutID?: string;
  layoutPosition: number; // 0 1 2
  isActive: boolean;
  prevId?: string;
  nextId?: string;
}

export interface IThemeOption {
  themeIdentifier: string;
}
export interface ITextRenderingSetting {
  quillHTMLs: ITextRenderingSettingCultureUI[];
}
export interface ITextRenderingSettingCultureUI {
  cultureUI: EnumLanguageCultureUI;
  quillHTML: string;
}
export interface ILayoutRenderingSetting {
  setting: ILayoutColumn;
  containerSettings: ICommonSettings[];
}
export interface IMediaGalleryRenderingSetting {
  gallery: IMediaGallerySetting;
  control: IMediaGalleryControl;
}
export interface IMediaGalleryItemRenderingSetting {
  link: IGeneralLink;
  text: IGeneralText;
}
export enum MenuOptionEnum {
  //section for Menu
  SOURCE = 'menu-source',
  SETTING = 'setting',
  MOBILE = 'mobile',
  LEVEL = 'level',
  _CSS = 'css',
  CULTUREUIHTML = 'culture-ui-html',
  //section for Menu source
  MENUGROUPID = 'menu-group-id',
  SOURCETYPE = 'source-type',
  PARENTMENUID = 'parent-menu-id',
  //section for Menu setting
  STICKY = 'sticky',
  ANIMATION = 'animation',
  ALIGNMENT = 'alignment',
  ICON = 'icon',
  MEGA = 'mega',
  //section for Menu setting icon
  ISICON = 'is-icon',
  SIZE = 'size',
  COLOR = 'color',
  VALUE = 'value',
  OPACITY = 'opacity',
  STATUS = 'status',
  POSITION = 'position',
  //section for Menu setting mega

  //section for Menu setting mobile
  HAMBURGER = 'hamburger',
  FEATUREICON = 'feature-icon',
  //section for Menu setting mobile hamburger
  ICONGROUP = 'icon-group',
  ACTIVEICON = 'active-icon',
  INACTIVEICON = 'in-active-icon',
  ISTEXT = 'is-text',
  TEXT = 'text',

  //section for Menu setting mobile feature-icon
  ICONS = 'icons',
  ISSEARCH = 'is-search',
  ISLANGUAGE = 'is-language',
  //section for Menu setting level
  ONE = 'one',
  TWO = 'two',
  THREE = 'three',
  FOUR = 'four',
  //section for Menu setting level setting
  STYLE = 'style',
  NORMAL = 'normal',
  HOVER = 'hover',
  ACTIVE = 'active',
  BACKGROUND = 'background',
  SHADOW = 'shadow',
  TEXTANIMATION = 'text-animation',
  BACKGROUNDANIMATION = 'background-animation',
  //section for Menu setting level setting colorstyle

  GRADIENTCOLOR = 'gradient-color',
  TYPE = 'type',
  COLORS = 'colors',
  IMAGE = 'menu-image',
  //section for Menu setting level setting shadow
  ISSHADOW = 'is-shadow',
  XAXIS = 'x-axis',
  YAXIS = 'y-axis',
  DISTACNE = 'distance',
  BLUR = 'blur',
}
export enum MedaiGalleryOptionEnum {
  GALLERY = 'gallery',
  CONTROL = 'control',
  GALLERYPATTERNID = 'gallery-pattern-id',
  GALLERYPATTERNURL = 'gallery-pattern-url',
  GALLERYGAP = 'gallery-gap',
  GALLERYMAXHEIGHT = 'gallery-max-height',
  ISCHANGEPATTERN = 'is-change-pattern',
  ISPAGESLIDE = 'is-page-slide',
  ISAUTOSLIDE = 'is-auto-slide',
  SLIDESPEED = 'slide-speed',
  ISPAGEBUTTON = 'is-page-button',
  PAGEBUTTONSIZE = 'page-button-size',
  PAGEBUTTONOFFSET = 'page-button-offset',
  ISPAGEARROW = 'is-page-arrow',
  PAGEARROWSIZE = 'page-arrow-size',
  PAGEARROWOFFSET = 'page-arrow-offset',
  MEDIAGALLERYCONTROL = 'media-gallery-control',
  GALLERYLIST = 'gallery-list',
  URL = 'url',
  FILETYPE = 'file-type',
  TITLE = 'title',
  SETTING = 'setting',
  GENERALBACKGROUNDSETTING = 'general-background-setting',
  GENERALTEXTSETTING = 'general-text-setting',
  GENERALLINKSETTING = 'general-link-setting',
  LINKTYPE = 'link-type',
  LINKVALUE = 'link-value',
  PARENTID = 'parent-id',
  TEXT = 'text',
  OVERLAY = 'overlay',
  HORIZONTALPOSITION = 'horizontal-position',
  VERTICALPOSITION = 'vertical-position',
  ISAPPLYALL = 'is-apply-all',
  ISOVERLAY = 'is-overlay',
  ISOVERLAYFULLWIDTH = 'is-overlay-full-width',
  OVERLAYCOLOR = 'overlay-color',
  OVERLAYOPACITY = 'overlay-opacity',
  OVERLAYANIMATION = 'overlay-animation',
  VIDEOURL = 'video-url',
  POSITION = 'position',
  PLAYINLOOP = 'play-in-loop',
  VIDEOSPEED = 'video-speed',
  VIDEOSCALE = 'video-scale',
  OPACITY = 'opacity',
  COLOROVERLAY = 'color-overlay',
  COLOROVERLAYOPACITY = 'color-overlay-opacity',
  WIDTH = 'width',
  HEIGHT = 'height',
  IMGURL = 'img-url',
  IMAGESCALE = 'image-scale',
  REPEAT = 'repeat',
  ISTEXT = 'is-text',
  DESCRIPTION = 'description',
  ISFONTDEFUALT = 'is-font-defualt',
  ISFONTINDEXDEFAULT = 'is-font-index-defualt',
  ISSTYLEDEFAULT = 'is-style-default',
  ISTEXTCOLORDEFUALT = 'is-text-color-default',
  ISTEXTOPACITYDEFAULT = 'is-text-opacity-default',
  ISLINEHEIGHTDEFAULT = 'is-line-height-default',
  ISLETTERSPACINGDEFAULT = 'is-letter-spacing-default',
  FONTFAMILY = 'font-family',
  FONTSTYLE = 'font-style',
  TITILEFONTSIZE = 'title-font-size',
  DESCRIPTIONFONTSIZE = 'description-font-size',
  TEXTCOLOR = 'text-color',
  TEXTOPACITY = 'text-opacity',
  TEXTALIGNMENT = 'text-alignment',
  LINEHEIGHT = 'line-height',
  LETTERSPACING = 'letter-spacing',
  TEXTANIMATION = 'text-animation',
  CURRENTSTYLE = 'current-style',
  LAYOUTSETTINGBACKGROUNDCOLORFORM = 'layout-setting-background-color-form',
  LAYOUTSETTINGBACKGROUNDIMAGEFORM = 'layout-setting-background-image-form',
  LAYOUTSETTINGBACKGROUNDVIDEOFORM = 'layout-setting-background-video-form',
  COLOR = 'color',
}

export interface ICommonSettings {
  border: ILayoutSettingBorder;
  shadow: ILayoutSettingShadow;
  hover: ILayoutSettingHover;
  effect: ILayoutDesignEffect;
  background: ILayoutSettingBackground;
  advance: ILayoutSettingAdvance;
  customize: ILayoutSettingCustomize;
  className?: string;
}

export interface IWebPageData {
  html: string;
  css: string;
}

export const fontList = [EFontFamilyCode.RACING_SANS_ONE, EFontFamilyCode.QUANTICO, EFontFamilyCode.PROMPT, EFontFamilyCode.POST_NO_BILLS_COLOMBO, EFontFamilyCode.NEUCHA];

export const fontSizeEm = [
  '0.1em',
  '0.2em',
  '0.3em',
  '0.4em',
  '0.5em',
  '0.6em',
  '0.7em',
  '0.8em',
  '0.9em',
  '1em',
  '1.1em',
  '1.2em',
  '1.3em',
  '1.4em',
  '1.5em',
  '2em',
  '2.1em',
  '2.2em',
  '2.3em',
  '2.4em',
  '2.5em',
  '3em',
  '3.1em',
  '3.2em',
  '3.3em',
  '3.4em',
  '3.5em',
  '4em',
];
export const fontSizePx = [
  '8px',
  '9px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '46px',
  '48px',
  '50px',
  '52px',
  '54px',
  '56px',
  '58px',
  '60px',
  '62px',
  '64px',
  '68px',
  '70px',
  '70px',
  '72px',
  '74px',
];
export const fontSize = [...fontSizeEm, ...fontSizePx];
export const lineHeight = [
  'normal',
  '0px',
  '1px',
  '2px',
  '3px',
  '4px',
  '5px',
  '9px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '46px',
  '48px',
  '50px',
  '52px',
  '54px',
  '56px',
  '58px',
  '60px',
  '62px',
  '64px',
  '66px',
  '68px',
  '70px',
  '72px',
  '74px',
];
export const letterSpacing = [
  'normal',
  '0px',
  '1px',
  '2px',
  '3px',
  '4px',
  '5px',
  '9px',
  '10px',
  '11px',
  '12px',
  '14px',
  '16px',
  '18px',
  '20px',
  '22px',
  '24px',
  '26px',
  '28px',
  '30px',
  '32px',
  '34px',
  '36px',
  '38px',
  '40px',
  '42px',
  '46px',
  '48px',
  '50px',
  '52px',
  '54px',
  '56px',
  '58px',
  '60px',
  '62px',
  '64px',
  '66px',
  '68px',
  '70px',
  '72px',
  '74px',
];
export const emojiList = [
  '😀',
  '😬',
  '😁',
  '😂',
  '😃',
  '😄',
  '😅',
  '😆',
  '😇',
  '😉',
  '😊',
  '🙂',
  '🙃',
  '😋',
  '😌',
  '😍',
  '😘',
  '😗',
  '😙',
  '😚',
  '😜',
  '😝',
  '😛',
  '🤑',
  '🤓',
  '😎',
  '🤗',
  '😏',
];
export const textOpacity = ['0', '0.05', '0.1', '0.2', '0.3', '0.4', '0.5', '0.6', '0.7', '0.8', '0.9', '1'];
export const mediaGalleryList = [
  {
    gallery: {
      galleryPatternId: MediaGalleryType.GALLERY_1,
      galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-1.png',
    },
  },
  {
    gallery: {
      galleryPatternId: MediaGalleryType.GALLERY_2,
      galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-2.png',
    },
  },
  {
    gallery: {
      galleryPatternId: MediaGalleryType.GALLERY_3,
      galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-3.png',
    },
  },
  {
    gallery: {
      galleryPatternId: MediaGalleryType.GALLERY_4,
      galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-4.png',
    },
  },
  {
    gallery: {
      galleryPatternId: MediaGalleryType.GALLERY_5,
      galleryPatternUrl: 'assets/cms/media-style/gallery/gallery-5.png',
    },
  },
] as IMediaGallery[];

export const shoppingCartTypeList: IShoppingCart[] = [
  {
    type: ShoppingCartTypes.SHOPPING_CART_1,
    previewImgUrl: 'assets/cms/media-style/shopping-cart/cart-1.svg',
  },
  {
    type: ShoppingCartTypes.SHOPPING_CART_2,
    previewImgUrl: 'assets/cms/media-style/shopping-cart/cart-2.svg',
  },
  {
    type: ShoppingCartTypes.SHOPPING_CART_3,
    previewImgUrl: 'assets/cms/media-style/shopping-cart/cart-3.svg',
  },
];

export interface IHistoryType {
  _id: string;
  componentType: ComponentTypeEnum;
  layoutPositionNumber?: number;
}

export interface IGenerateCloseTagUntillFoundParent {
  html: string;
  history: IHistoryType[];
}

export interface ICmsLayoutBottomTypes {
  options: ShoppingCartPatternBottomTypes;
  button: ICmsLayoutBottomButton;
  pagination: ICmsLayoutBottomPagination;
}

export interface ICmsLayoutBottomButton {
  name: string;
  link: IGeneralLink;
  openType: string;
}

export interface ICmsLayoutBottomPagination {
  type: ShoppingCartPatternPaginationTypes;
  postion?: string;
}
