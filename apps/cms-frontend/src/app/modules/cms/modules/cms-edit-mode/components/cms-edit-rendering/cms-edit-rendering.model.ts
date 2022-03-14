import { DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Point } from '@angular/cdk/drag-drop/drag-ref';
import { ElementRef, ViewContainerRef, ViewRef } from '@angular/core';
import {
  ButtonType,
  IButtonBorder,
  IButtonHover,
  IButtonSetting,
  IButtonText,
  IContentManagementContents,
  IContentManagementGeneral,
  IContentManagementLanding,
  IGeneralLink,
  IGeneralText,
  ILayoutColumn,
  ILayoutDesignEffect,
  ILayoutSettingAdvance,
  ILayoutSettingBackground,
  ILayoutSettingBorder,
  ILayoutSettingCustomize,
  ILayoutSettingHover,
  ILayoutSettingShadow,
  IMediaGalleryControl,
  IMediaGallerySetting,
  IMenuRenderingSettingLevelOptions,
  IMenuRenderingSettingMobileHamburger,
  IMenuRenderingSettingMobileIcon,
  IMenuRenderingSettingSettingAlignment,
  IMenuRenderingSettingSettingAnimation,
  IMenuRenderingSettingSettingIcon,
  IMenuRenderingSettingSettingMega,
  IMenuRenderingSettingSettingSticky,
  IMenuRenderingSettingSettingStyle,
  IMenuRenderingSettingSource,
  IShoppingCartPatternSetting,
  IThemeDevice,
  IThemeGeneralInfo,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingCustomize,
  IThemeRenderingSettingFont,
  MediaGalleryType,
  MediaSliderType,
  MenuGenericType,
  MenuRenderingType,
  MenuType,
  ShoppingCartTypes,
  TextType,
  UndoRedoDropped,
} from '@reactor-room/cms-models-lib';
import QuillType from 'quill';
import Delta from 'quill-delta';
import { CmsButtonRenderingComponent } from '../../../../components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { CmsContainerRenderingComponent } from '../../../../components/cms-rendering-component/cms-container-rendering/cms-container-rendering.component';
import { CmsContentContainerRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-container-rendering/cms-content-container-rendering.component';
import { CmsContentManagementLandingRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-management-landing-rendering.component';
import { CmsContentManagementRenderingComponent } from '../../../../components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { CmsFooterContainerRenderingComponent } from '../../../../components/cms-rendering-component/cms-footer-container-rendering/cms-footer-container-rendering.component';
import { CmsHeaderContainerRenderingComponent } from '../../../../components/cms-rendering-component/cms-header-container-rendering/cms-header-container-rendering.component';
import { CmsLayoutRenderingComponent } from '../../../../components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.component';
import { CmsMediaGalleryItemRenderingComponent } from '../../../../components/cms-rendering-component/cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.component';
import { CmsMediaGalleryRenderingComponent } from '../../../../components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMediaSliderRenderingComponent } from '../../../../components/cms-rendering-component/cms-media-slider-rendering/cms-media-slider-rendering.component';
import { CmsMenuRenderingComponent } from '../../../../components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { CmsTextRenderingComponent } from '../../../../components/cms-rendering-component/cms-text-rendering/cms-text-rendering.component';
import { CmsThemeRenderingComponent } from '../../../../components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { CmsShoppingCartRenderingComponent } from './../../../../components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';

export interface Dropped {
  item: DragRef<DragRefData & UndoRedoDropped>;
  currentIndex: number;
  previousIndex: number;
  container: DropListRef<LayoutData>;
  previousContainer: DropListRef<LayoutData>;
  isPointerOverContainer: boolean;
  distance: Point;
  component: any;
}

export type InsertPoint = { insertPoint: ViewContainerRef };
export type DragRefs = { dragRefs: DragRef<DragRefData>[] };
export interface ViewRefAndElementRefAndComponent {
  component: {
    dragRef?: DragRef<DragRefData>;
    viewRef: ViewRef;
    el: ElementRef<HTMLElement>;
    insertPoint1?: ViewContainerRef;
    insertPoint2?: ViewContainerRef;
    insertPoint3?: ViewContainerRef;
    insertPoint4?: ViewContainerRef;
  };
}

export enum EDropzoneType {
  CONTENT = 'CONTENT',
  REMOVE = 'REMOVE',
  LAYOUT = 'LAYOUT',
  THEME_HEADER = 'THEME_HEADER',
  THEME_FOOTER = 'THEME_FOOTER',
}

export type ViewRefAndElementRefs = { viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[] };
export type DropZoneData = DragRefs & ViewRefAndElementRefs & { dropzoneType: EDropzoneType };
export type LayoutData = InsertPoint & DropZoneData;

export interface DragRefData {
  dropListRef: DropListRef;
  type: MenuType | TextType | MediaGalleryType | MediaSliderType | ButtonType | MenuRenderingType | ShoppingCartTypes | string;
  genericType: MenuGenericType;
  component?: ComponentType;
}

export interface QuillUndoRedo {
  html: string;
  quill: QuillType;
  delta: Delta;
}

export interface LayoutMove {
  element: HTMLElement;
  sortBy: 'desc' | 'asc';
}

export interface LayoutColumn extends ILayoutColumn {
  component: CmsLayoutRenderingComponent;
}

export interface LayoutSettingBorder extends ILayoutSettingBorder {
  component: ComponentTypeWithBorder;
}

export interface LayoutSettingShadow extends ILayoutSettingShadow {
  component: ComponentTypeWithShadow;
}

export interface LayoutDesignEffect extends ILayoutDesignEffect {
  component: ComponentTypeWithEffect;
}

export interface LayoutSettingAdvance extends ILayoutSettingAdvance {
  component: ComponentTypeWithAdvance;
}

export interface LayoutSettingCustomize extends ILayoutSettingCustomize {
  component: ComponentTypeWithCustomize;
}

export interface LayoutSettingBackground extends ILayoutSettingBackground {
  component: ComponentTypeWithBackground;
}

export interface MediaGalleryControl extends IMediaGalleryControl {
  component: CmsMediaGalleryRenderingComponent;
  mediaGalleryControl: string;
}

export interface MediaGallerySetting extends IMediaGallerySetting {
  component: CmsMediaGalleryRenderingComponent;
}

export interface GeneralLink extends IGeneralLink {
  component: ComponentTypeWithLink;
}

export interface GeneralText extends IGeneralText {
  component: ComponentTypeWithText;
}
export interface ThemeSettingCustomize extends IThemeRenderingSettingCustomize {
  component: CmsThemeRenderingComponent;
  themeCustomize: string;
}

export interface ThemeSettingFont {
  component: CmsThemeRenderingComponent;
  font: IThemeRenderingSettingFont[];
  themeFont: string;
}

export interface ThemeSettingColor {
  component: CmsThemeRenderingComponent;
  color: IThemeRenderingSettingColors[];
  themeColor: string;
}

export interface ThemeSettingDevice {
  component: CmsThemeRenderingComponent;
  devices: IThemeDevice[];
  themeDevice: string;
}

export interface ThemeSettingGeneral extends IThemeGeneralInfo {
  component: CmsThemeRenderingComponent;
  themeGeneral: string;
}

export interface LayoutSettingHover extends ILayoutSettingHover {
  component: ComponentTypeWithHover;
}

export interface ContentManagementGeneral extends IContentManagementGeneral {
  component: CmsContentManagementRenderingComponent;
  contentManagementGeneral: string;
}
export interface ContentManagementContents extends IContentManagementContents {
  component: CmsContentManagementRenderingComponent;
  contentManagementContents: string;
}

export interface ContentManagementLanding extends IContentManagementLanding {
  component: CmsContentManagementRenderingComponent;
  contentManagementLanding: string;
}

export interface ButtonSetting extends IButtonSetting {
  component: CmsButtonRenderingComponent;
  buttonSetting: string;
}

export interface ShoppingCartPatternSetting extends IShoppingCartPatternSetting {
  component: CmsShoppingCartRenderingComponent;
  shoppingCartPatternSetting: string;
}

export interface MenuRenderingSettingSource extends IMenuRenderingSettingSource {
  component: CmsMenuRenderingComponent;
  menuSource: string;
}

export interface MenuRenderingSettingMobileHamburger extends IMenuRenderingSettingMobileHamburger {
  component: CmsMenuRenderingComponent;
  menuMobileHamburger: string;
}

export interface MenuRenderingSettingMobileIcon extends IMenuRenderingSettingMobileIcon {
  component: CmsMenuRenderingComponent;
  menuMobileIcon: string;
}

export interface MenuRenderingSettingSticky extends IMenuRenderingSettingSettingSticky {
  component: CmsMenuRenderingComponent;
  menuSettingSticky: string;
}

export interface MenuRenderingSettingAnimation extends IMenuRenderingSettingSettingAnimation {
  component: CmsMenuRenderingComponent;
  menuSettingAnimation: string;
}

export interface MenuRenderingSettingAlignment extends IMenuRenderingSettingSettingAlignment {
  component: CmsMenuRenderingComponent;
  menuSettingAlignment: string;
}

export interface MenuRenderingSettingStyle extends IMenuRenderingSettingSettingStyle {
  component: CmsMenuRenderingComponent;
  menuSettingStyle: string;
}

export interface MenuRenderingSettingIcon extends IMenuRenderingSettingSettingIcon {
  component: CmsMenuRenderingComponent;
  menuSettingIcon: string;
}
export interface MenuRenderingSettingMega extends IMenuRenderingSettingSettingMega {
  component: CmsMenuRenderingComponent;
  menuSettingMega: string;
}
export interface MenuRenderingSettingLevelOptions extends IMenuRenderingSettingLevelOptions {
  component: CmsMenuRenderingComponent;
  menuLevel1?: string;
  menuLevel2?: string;
  menuLevel3?: string;
  menuLevel4?: string;
}

export interface ButtonBorder extends IButtonBorder {
  component: CmsButtonRenderingComponent;
  buttonBorder: string;
}

export interface ButtonText extends IButtonText {
  component: CmsButtonRenderingComponent;
  buttonText: string;
}

export interface ButtonHover extends IButtonHover {
  component: CmsButtonRenderingComponent;
  buttonHover: string;
}

export type ContentChildrenType =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsShoppingCartRenderingComponent
  | CmsMenuRenderingComponent;
export type ThemeContentChildren =
  | CmsTextRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsShoppingCartRenderingComponent
  | CmsHeaderContainerRenderingComponent
  | CmsContentContainerRenderingComponent
  | CmsFooterContainerRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentType = (
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaGalleryItemRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContentManagementLandingRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsThemeRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMenuRenderingComponent
  | CmsShoppingCartRenderingComponent
) & { dragRef?: DragRef<DragRefData> };

export type ComponentTypeWithBorder =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentTypeWithShadow =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentTypeWithAdvance =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentTypeWithCustomize =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentTypeWithEffect = CmsLayoutRenderingComponent;

export type ComponentTypeWithHover = CmsTextRenderingComponent;

export type ComponentTypeWithBackground =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsButtonRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentCommonType =
  | CmsTextRenderingComponent
  | CmsMediaGalleryRenderingComponent
  | CmsMediaSliderRenderingComponent
  | CmsContentManagementRenderingComponent
  | CmsContainerRenderingComponent
  | CmsLayoutRenderingComponent
  | CmsButtonRenderingComponent
  | CmsShoppingCartRenderingComponent
  | CmsMenuRenderingComponent;

export type ComponentTypeWithLink = CmsMediaGalleryItemRenderingComponent | CmsButtonRenderingComponent;
export type ComponentTypeWithText = CmsMediaGalleryItemRenderingComponent;

export type UndoRedo =
  | Dropped
  | QuillUndoRedo
  | LayoutColumn
  | LayoutMove
  | LayoutSettingBorder
  | LayoutSettingShadow
  | LayoutDesignEffect
  | LayoutSettingAdvance
  | LayoutSettingCustomize
  | LayoutSettingBackground
  | LayoutSettingHover
  | MediaGalleryControl
  | MediaGallerySetting
  | GeneralLink
  | GeneralText
  | ContentManagementGeneral
  | ContentManagementContents
  | ContentManagementLanding
  | ThemeSettingCustomize
  | ThemeSettingFont
  | ThemeSettingColor
  | ThemeSettingGeneral
  | ThemeSettingDevice
  | ButtonSetting
  | ButtonBorder
  | ButtonText
  | ButtonHover
  | MenuRenderingSettingSource
  | MenuRenderingSettingLevelOptions
  | MenuRenderingSettingMobileHamburger
  | MenuRenderingSettingMobileIcon
  | MenuRenderingSettingSticky
  | MenuRenderingSettingAnimation
  | MenuRenderingSettingAlignment
  | MenuRenderingSettingStyle
  | MenuRenderingSettingIcon
  | MenuRenderingSettingMega
  | ShoppingCartPatternSetting;
