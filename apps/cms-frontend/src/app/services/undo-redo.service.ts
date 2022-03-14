import { Injectable } from '@angular/core';
import { UndoRedoEnum } from '@reactor-room/cms-models-lib';
import Scope from 'parchment';
import QuillType from 'quill';
import Delta from 'quill-delta';
import { CmsButtonRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { CmsContainerRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-container-rendering/cms-container-rendering.component';
// eslint-disable-next-line max-len
import { CmsContentManagementRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { CmsLayoutRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.component';
// eslint-disable-next-line max-len
import { CmsMediaGalleryItemRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.component';
import { CmsMediaGalleryRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMediaSliderRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-media-slider-rendering/cms-media-slider-rendering.component';
import { CmsMenuRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { CmsShoppingCartRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';
import { CmsTextRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-text-rendering/cms-text-rendering.component';
import { CmsThemeRenderingComponent } from '../modules/cms/components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ESidebarElement, ESidebarMode } from '../modules/cms/containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../modules/cms/containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { EMenuCustomTab } from '../modules/cms/containers/cms-sidebar/components/cms-menu-custom/cms-menu-custom.model';
import {
  ButtonBorder,
  ButtonHover,
  ButtonSetting,
  ButtonText,
  ComponentType,
  ContentManagementContents,
  ContentManagementGeneral,
  ContentManagementLanding,
  Dropped,
  GeneralLink,
  GeneralText,
  LayoutColumn,
  LayoutDesignEffect,
  LayoutMove,
  LayoutSettingAdvance,
  LayoutSettingBackground,
  LayoutSettingBorder,
  LayoutSettingCustomize,
  LayoutSettingHover,
  LayoutSettingShadow,
  MediaGalleryControl,
  MediaGallerySetting,
  MenuRenderingSettingAlignment,
  MenuRenderingSettingAnimation,
  MenuRenderingSettingIcon,
  MenuRenderingSettingLevelOptions,
  MenuRenderingSettingMega,
  MenuRenderingSettingMobileHamburger,
  MenuRenderingSettingMobileIcon,
  MenuRenderingSettingSource,
  MenuRenderingSettingSticky,
  MenuRenderingSettingStyle,
  QuillUndoRedo,
  ShoppingCartPatternSetting,
  ThemeSettingColor,
  ThemeSettingCustomize,
  ThemeSettingDevice,
  ThemeSettingFont,
  ThemeSettingGeneral,
  UndoRedo,
} from '../modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../modules/cms/services/cms-edit.service';
import { CmsSidebarService } from '../modules/cms/services/cms-sidebar.service';
import { CmsEditThemeService } from '../modules/cms/services/cms-theme.service';

function endsWithNewlineChange(scroll, delta) {
  const lastOp = delta.ops[delta.ops.length - 1];
  if (lastOp == null) return false;
  if (lastOp.insert != null) {
    return typeof lastOp.insert === 'string' && lastOp.insert.endsWith('\n');
  }
  if (lastOp.attributes != null) {
    return Object.keys(lastOp.attributes).some((attr) => {
      return scroll.query(attr, Scope.Block) != null;
    });
  }
  return false;
}

function getLastChangeIndex(scroll, delta): number {
  const deleteLength = delta.reduce((length, op) => {
    return length + (op.delete || 0);
  }, 0);
  let changeIndex = delta.length() - deleteLength;
  if (endsWithNewlineChange(scroll, delta)) {
    changeIndex -= 1;
  }
  return changeIndex;
}

@Injectable()
export class UndoRedoService {
  past: UndoRedo[] = [];
  future: UndoRedo[] = [];
  constructor(private sidebarService: CmsSidebarService, private editService: CmsEditService, private themeService: CmsEditThemeService) {}
  // TODO: refactor duplicated code
  undo(): void {
    const pastDrops = this.past;
    const length = pastDrops.length;
    if (length) {
      const previousDrop = pastDrops.pop();
      if ('themeCustomize' in previousDrop) {
        const { component } = previousDrop;
        const { cssStyle, elementId } = component.themeSettingCustomizeValue;
        const themeCustomize: ThemeSettingCustomize = {
          component,
          cssStyle,
          elementId,
          themeCustomize: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_CUSTOMIZE, true);
        this.future.push(themeCustomize);
        this.sidebarService.setThemeSettingCustomizeValue(previousDrop);
        this.sidebarService.setThemeSettingCustomizeFormValue(previousDrop);
      } else if ('themeColor' in previousDrop) {
        const { component } = previousDrop;
        const { color } = component.renderingThemeData.settings;
        const themeColor: ThemeSettingColor = {
          component,
          color,
          themeColor: '',
        };
        this.future.push(themeColor);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_COLOR, true);
        this.themeService.setThemeColorSetting(previousDrop);
        this.themeService.setThemeColorSettingFormValue(previousDrop);
      } else if ('themeDevice' in previousDrop) {
        const { component } = previousDrop;
        const { devices } = component.renderingThemeData;
        const themeColor: ThemeSettingDevice = {
          component,
          devices,
          themeDevice: '',
        };
        this.future.push(themeColor);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_DEVICE, true);
        this.themeService.setThemeDeviceSetting(previousDrop);
        this.themeService.setThemeDeviceSettingFormValue(previousDrop);
      } else if ('themeFont' in previousDrop) {
        const { component } = previousDrop;
        const { font } = component.renderingThemeData.settings;
        const themeFont: ThemeSettingFont = {
          component,
          font,
          themeFont: '',
        };
        this.future.push(themeFont);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_TEXT, true);
        this.themeService.setThemeFontSetting(previousDrop);
        this.themeService.setThemeFontSettingFormValue(previousDrop);
      } else if ('quill' in previousDrop) {
        const { html, quill, delta } = previousDrop;
        const inverseDelta = this.invertDelta(quill, delta);
        this.future.push({ html, quill, delta: inverseDelta });
        this.updateQuill(previousDrop);
      } else if ('column' in previousDrop) {
        const { component } = previousDrop;
        const { column, gap } = component.layoutColumnValue;
        const layoutColumn: LayoutColumn = {
          component,
          column,
          gap,
        };
        this.future.push(layoutColumn);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setLayoutColumnValue(previousDrop);
        this.sidebarService.setLayoutColumnFormValue(previousDrop);
      } else if ('sortBy' in previousDrop) {
        const { element, sortBy } = previousDrop;
        this.editService.onChangeLayoutIndex(element, sortBy);
        const layoutMove: LayoutMove = {
          element,
          sortBy: sortBy === 'desc' ? 'asc' : 'desc',
        };
        this.future.push(layoutMove);
      } else if ('corner' in previousDrop && !('buttonBorder' in previousDrop)) {
        const { component } = previousDrop;
        const { corner, color, opacity, thickness, position } = component.layoutSettingBorderValue;
        const layoutSettingBorder: LayoutSettingBorder = {
          component,
          corner,
          color,
          opacity,
          thickness,
          position,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.BORDER, true);
        this.future.push(layoutSettingBorder);
        this.sidebarService.setLayoutSettingBorderValue(previousDrop);
        this.sidebarService.setLayoutSettingBorderFormValue(previousDrop);
      } else if ('isShadow' in previousDrop) {
        const { component } = previousDrop;
        const { isShadow, color, opacity, xAxis, yAxis, distance, blur } = component.layoutSettingShadowValue;
        const layoutSettingShadow: LayoutSettingShadow = {
          component,
          isShadow,
          color,
          opacity,
          xAxis,
          yAxis,
          distance,
          blur,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.SHADOW, true);
        this.future.push(layoutSettingShadow);
        this.sidebarService.setLayoutSettingShadowValue(previousDrop);
        this.sidebarService.setLayoutSettingShadowFormValue(previousDrop);
      } else if ('isStretch' in previousDrop) {
        const { component } = previousDrop;
        const { scrollEffect, xAxis, yAxis, isStretch, margin } = component.layoutEffectValue;
        const layoutDesignEffect: LayoutDesignEffect = {
          component,
          scrollEffect,
          xAxis,
          yAxis,
          isStretch,
          margin,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.EFFECT, true);
        this.future.push(layoutDesignEffect);
        this.sidebarService.setLayoutDesignEffectValue(previousDrop);
        this.sidebarService.setLayoutDesignEffectFormValue(previousDrop);
      } else if ('cssStyle' in previousDrop) {
        const { component } = previousDrop;
        const { cssStyle, elementId } = component.layoutSettingCustomizeValue;
        const layoutSettingCustomize: LayoutSettingCustomize = {
          component,
          cssStyle,
          elementId,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.CUSTOMIZE, true);
        const isError = document.querySelector('.squiggly-error');
        if (!isError) this.future.push(layoutSettingCustomize);
        this.sidebarService.setLayoutSettingCustomizeValue(previousDrop);
        this.sidebarService.setLayoutSettingCustomizeFormValue(previousDrop);
      } else if ('padding' in previousDrop && 'margin' in previousDrop) {
        const { component } = previousDrop;
        const { margin, padding, horizontalPosition, verticalPosition } = component.layoutSettingAdvanceValue;
        const layoutSettingAdvance: LayoutSettingAdvance = {
          component,
          margin,
          padding,
          horizontalPosition,
          verticalPosition,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.ADVANCE, true);
        this.future.push(layoutSettingAdvance);
        this.sidebarService.setLayoutSettingAdvanceValue(previousDrop);
        this.sidebarService.setLayoutSettingAdvanceFormValue(previousDrop);
      } else if ('layoutSettingBackgroundColorForm' in previousDrop || 'layoutSettingBackgroundImageForm' in previousDrop || 'layoutSettingBackgroundVideoForm' in previousDrop) {
        const { component } = previousDrop;
        const layoutSettingBackground: LayoutSettingBackground = {
          component,
          currentStyle: component.layoutSettingBackgroundValue.currentStyle,
          layoutSettingBackgroundColorForm: component.layoutSettingBackgroundValue.layoutSettingBackgroundColorForm,
          layoutSettingBackgroundImageForm: component.layoutSettingBackgroundValue.layoutSettingBackgroundImageForm,
          layoutSettingBackgroundVideoForm: component.layoutSettingBackgroundValue.layoutSettingBackgroundVideoForm,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.BACKGROUND, true);
        this.future.push(layoutSettingBackground);
        this.sidebarService.setLayoutSettingBackgroundValue(previousDrop);
        this.sidebarService.setLayoutSettingBackgroundFormValue(previousDrop);
      } else if ('mediaGalleryControl' in previousDrop) {
        const { component } = previousDrop;
        const { isPageSlide, isAutoSlide, isPageButton, pageButtonSize, pageButtonOffset, isPageArrow, pageArrowSize, pageArrowOffset, slideSpeed } =
          component.mediaGalleryFormValue.control;

        const mediaGalleryControl: MediaGalleryControl = {
          component,
          isPageSlide,
          slideSpeed,
          isAutoSlide,
          isPageButton,
          pageButtonSize,
          pageButtonOffset,
          isPageArrow,
          pageArrowSize,
          pageArrowOffset,
          mediaGalleryControl: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_CONTROL, true);
        this.future.push(mediaGalleryControl);
        this.sidebarService.setMediaGalleryControlValue(previousDrop);
        this.sidebarService.setMediaGalleryControlFormValue(previousDrop);
      } else if ('galleryPatternId' in previousDrop) {
        const { component } = previousDrop;
        const { galleryPatternId, galleryPatternUrl, galleryGap, galleryMaxHeight, gallleryList } = component.mediaGalleryFormValue.gallery;
        const mediaGallerySetting: MediaGallerySetting = {
          component,
          galleryPatternId,
          galleryPatternUrl,
          galleryGap,
          galleryMaxHeight,
          gallleryList,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_SETTING, true);
        this.future.push(mediaGallerySetting);
        this.sidebarService.setMediaGallerySettingValue(previousDrop);
        this.sidebarService.setMediaGallerySettingFormValue(previousDrop);
      } else if ('linkType' in previousDrop && 'linkValue' in previousDrop) {
        let { component } = previousDrop;
        if (component.componentType === 'CmsMediaGalleryItemRenderingComponent') {
          component = component as CmsMediaGalleryItemRenderingComponent;
          const { linkType, linkValue, parentID } = component.galleryListItem.setting.generalLinkSetting;
          const generalLinkSetting: GeneralLink = {
            component,
            linkType,
            linkValue,
            parentID,
          };
          this.onEditorFocusComponent(component);
          this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_ITEM_LINK, true);
          this.future.push(generalLinkSetting);
          this.sidebarService.setGeneralLinkSettingValue(previousDrop);
          this.sidebarService.setGeneralLinkSettingFormValue(previousDrop);
        } else if (component.componentType === 'CmsButtonRenderingComponent') {
          component = component as CmsButtonRenderingComponent;
          const { linkType, linkValue, parentID } = component.buttonData.generalLinkSetting;
          const generalLinkSetting: GeneralLink = {
            component,
            linkType,
            linkValue,
            parentID,
          };
          this.onEditorFocusComponent(component);
          this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
          this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_LINK, true);
          this.future.push(generalLinkSetting);
          this.sidebarService.setGeneralLinkSettingValue(previousDrop);
          this.sidebarService.setGeneralLinkSettingFormValue(previousDrop);
        }
      } else if ('text' in previousDrop && 'overlay' in previousDrop) {
        const { component } = previousDrop;
        const { text, overlay, horizontalPosition, verticalPosition, isApplyAll } = component.galleryListItem.setting.generalTextSetting;
        const generalTextSetting: GeneralText = {
          component,
          text,
          overlay,
          horizontalPosition,
          verticalPosition,
          isApplyAll,
        };
        this.onEditorFocusComponent(component);
        if (component.componentType === 'CmsMediaGalleryItemRenderingComponent') {
          this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_ITEM_TEXT, true);
        }
        this.future.push(generalTextSetting);
        this.sidebarService.setGeneralTextSettingValue(previousDrop);
        this.sidebarService.setGeneralTextSettingFormValue(previousDrop);
      } else if ('textHover' in previousDrop) {
        const { component } = previousDrop;
        const layoutSettingHover: LayoutSettingHover = {
          component,
          textHover: component.layoutSettingHoverValue.textHover,
          style: component.layoutSettingHoverValue.style,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.HOVER, true);
        this.future.push(layoutSettingHover);
        this.sidebarService.setLayoutSettingHoverValue(previousDrop);
        this.sidebarService.setLayoutSettingHoverFormValue(previousDrop);
      } else if ('contentManagementGeneral' in previousDrop) {
        const { component } = previousDrop;
        const { pattern, advance } = component.contentManagementValue.general;
        const contentManagementGeneral: ContentManagementGeneral = {
          component,
          contentManagementGeneral: '',
          pattern,
          advance,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.CONTENT_MANAGE_GENERAL, true);
        this.future.push(contentManagementGeneral);
        this.sidebarService.setContentManageGeneralValue(previousDrop);
        this.sidebarService.setContentManageGeneralFormValue(previousDrop);
      } else if ('contentManagementContents' in previousDrop) {
        const { component } = previousDrop;
        const { categoryIds, contentSortBy, isPinContentFirst, isShortDescription, isView, isPublishedDate, isShare } = component.contentManagementValue.contents;
        const contentManagementContents: ContentManagementContents = {
          component,
          contentManagementContents: '',
          categoryIds,
          contentSortBy,
          isPinContentFirst,
          isShortDescription,
          isView,
          isPublishedDate,
          isShare,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.CONTENT_MANAGE_CONTENTS, true);
        this.future.push(contentManagementContents);
        this.sidebarService.setContentManageContentsValue(previousDrop);
        this.sidebarService.setContentManageContentsFormValue(previousDrop);
      } else if ('contentManagementLanding' in previousDrop) {
        const { component } = previousDrop;
        const { _id, option } = component.contentManagementValue.landing;
        const contentManagementLanding: ContentManagementLanding = {
          component,
          contentManagementLanding: '',
          _id,
          option,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.CONTENT_MANAGE_LANDING, true);
        this.future.push(contentManagementLanding);
        this.sidebarService.setContentManageLandingValue(previousDrop);
        this.sidebarService.setContentManageLandingFormValue(previousDrop);
      } else if ('buttonSetting' in previousDrop) {
        const { component } = previousDrop;
        const { background, padding } = component.buttonData.buttonSetting;
        const buttonSetting: ButtonSetting = {
          component,
          background,
          padding,
          buttonSetting: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_SETTING, true);
        this.future.push(buttonSetting);
        this.sidebarService.setButtonSettingValue(previousDrop);
        this.sidebarService.setButtonSettingFormValue(previousDrop);
      } else if ('buttonBorder' in previousDrop) {
        const { component } = previousDrop;
        const { corner, color, opacity, thickness, position } = component.buttonData.buttonBorder;
        const buttonBorder: ButtonBorder = {
          component,
          corner,
          color,
          opacity,
          thickness,
          position,
          buttonBorder: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_BORDER, true);
        this.future.push(buttonBorder);
        this.sidebarService.setButtonBorderValue(previousDrop);
        this.sidebarService.setButtonBorderFormValue(previousDrop);
      } else if ('buttonText' in previousDrop) {
        const { component } = previousDrop;
        const {
          text,
          isFontDefault,
          isFontIndexDefault,
          isStyleDefault,
          isTextColorDefault,
          isTextOpacityDefault,
          isLineHeightDefault,
          isLetterSpacingDefault,
          fontFamily,
          fontStyle,
          fontSize,
          textColor,
          textOpacity,
          textAlignment,
          lineHeight,
          letterSpacing,
          isIcon,
          iconCode,
          iconBeforeText,
          iconSize,
          iconColor,
          iconColorOpacity,
        } = component.buttonData.buttonText;
        const buttonText: ButtonText = {
          component,
          text,
          isFontDefault,
          isFontIndexDefault,
          isStyleDefault,
          isTextColorDefault,
          isTextOpacityDefault,
          isLineHeightDefault,
          isLetterSpacingDefault,
          fontFamily,
          fontStyle,
          fontSize,
          textColor,
          textOpacity,
          textAlignment,
          lineHeight,
          letterSpacing,
          isIcon,
          iconCode,
          iconBeforeText,
          iconSize,
          iconColor,
          iconColorOpacity,
          buttonText: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_TEXT, true);
        this.future.push(buttonText);
        this.sidebarService.setButtonTextValue(previousDrop);
        this.sidebarService.setButtonTextFormValue(previousDrop);
      } else if ('buttonHover' in previousDrop) {
        const { component } = previousDrop;
        const {
          isHover,
          buttonHoverColor,
          buttonHoverColorOpacity,
          borderHoverColor,
          borderHoverColorOpacity,
          textHoverColor,
          textHoverColorOpacity,
          textHoverTransform,
          hoverEffect,
        } = component.buttonData.buttonHover;
        const buttonHover: ButtonHover = {
          component,
          isHover,
          buttonHoverColor,
          buttonHoverColorOpacity,
          borderHoverColor,
          borderHoverColorOpacity,
          textHoverColor,
          textHoverColorOpacity,
          textHoverTransform,
          hoverEffect,
          buttonHover: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_HOVER, true);
        this.future.push(buttonHover);
        this.sidebarService.setButtonHoverValue(previousDrop);
        this.sidebarService.setButtonHoverFormValue(previousDrop);
      } else if ('menuSource' in previousDrop) {
        const { component } = previousDrop;
        const { sourceType, menuGroupId, parentMenuId } = component.menuData.source;
        const menuSource: MenuRenderingSettingSource = {
          component,
          sourceType,
          menuGroupId,
          parentMenuId,
          menuSource: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SOURCE_TAB);
        this.future.push(menuSource);
        this.sidebarService.setMenuSourceValue(previousDrop);
        this.sidebarService.setMenuSourceFormValue(previousDrop);
      } else if ('menuLevel1' in previousDrop) {
        const { component } = previousDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.one;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel1: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(0);
        this.future.push(menuLevel);
        this.sidebarService.setMenuLevelOneValue(previousDrop);
        this.sidebarService.setMenuLevelOneFormValue(previousDrop);
      } else if ('menuLevel2' in previousDrop) {
        const { component } = previousDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.two;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel2: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(1);
        this.future.push(menuLevel);
        this.sidebarService.setMenuLevelTwoValue(previousDrop);
        this.sidebarService.setMenuLevelTwoFormValue(previousDrop);
      } else if ('menuLevel3' in previousDrop) {
        const { component } = previousDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.three;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel3: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(2);
        this.future.push(menuLevel);
        this.sidebarService.setMenuLevelThreeValue(previousDrop);
        this.sidebarService.setMenuLevelThreeFormValue(previousDrop);
      } else if ('menuLevel4' in previousDrop) {
        const { component } = previousDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.four;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel4: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(3);
        this.future.push(menuLevel);
        this.sidebarService.setMenuLevelFourValue(previousDrop);
        this.sidebarService.setMenuLevelFourFormValue(previousDrop);
      } else if ('menuMobileHamburger' in previousDrop) {
        const { component } = previousDrop;
        const { icon, isText, text, position } = component.menuData.mobile.hamburger;
        const menuMobileHamburger: MenuRenderingSettingMobileHamburger = {
          component,
          icon,
          isText,
          text,
          position,
          menuMobileHamburger: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.MOBILE_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_HAMBURGER, true);
        this.future.push(menuMobileHamburger);
        this.sidebarService.setMenuMobileHamburgerValue(previousDrop);
        this.sidebarService.setMenuMobileHamburgerFormValue(previousDrop);
      } else if ('menuMobileIcon' in previousDrop) {
        const { component } = previousDrop;
        const { icons, isSearch, isLanguage } = component.menuData.mobile.featureIcon;
        const menuMobileIcon: MenuRenderingSettingMobileIcon = {
          component,
          icons,
          isSearch,
          isLanguage,
          menuMobileIcon: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.MOBILE_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_ICON_FEATURE, true);
        this.future.push(menuMobileIcon);
        this.sidebarService.setMenuMobileIconValue(previousDrop);
        this.sidebarService.setMenuMobileIconFormValue(previousDrop);
      } else if ('menuSettingSticky' in previousDrop) {
        const { component } = previousDrop;
        const sticky = component.menuData.setting.sticky;
        const menuSettingSticky: MenuRenderingSettingSticky = {
          component,
          sticky,
          menuSettingSticky: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_STICKY, true);
        this.future.push(menuSettingSticky);
        this.sidebarService.setMenuSettingStickyValue(previousDrop);
        this.sidebarService.setMenuSettingStickyFormValue(previousDrop);
      } else if ('menuSettingAnimation' in previousDrop) {
        const { component } = previousDrop;
        const animation = component.menuData.setting.animation;
        const menuSettingAnimation: MenuRenderingSettingAnimation = {
          component,
          animation,
          menuSettingAnimation: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_ANIMATION, true);
        this.future.push(menuSettingAnimation);
        this.sidebarService.setMenuSettingAnimationValue(previousDrop);
        this.sidebarService.setMenuSettingAnimationFormValue(previousDrop);
      } else if ('menuSettingAlignment' in previousDrop) {
        const { component } = previousDrop;
        const alignment = component.menuData.setting.alignment;
        const menuSettingAlignment: MenuRenderingSettingAlignment = {
          component,
          alignment,
          menuSettingAlignment: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_TEXT_ALIGNMENT, true);
        this.future.push(menuSettingAlignment);
        this.sidebarService.setMenuSettingAlignmentValue(previousDrop);
        this.sidebarService.setMenuSettingAlignmentFormValue(previousDrop);
      } else if ('menuSettingStyle' in previousDrop) {
        const { component } = previousDrop;
        const style = component.menuData.setting.style;
        const menuSettingStyle: MenuRenderingSettingStyle = {
          component,
          style,
          menuSettingStyle: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_STYLE, true);
        this.future.push(menuSettingStyle);
        this.sidebarService.setMenuSettingStyleValue(previousDrop);
        this.sidebarService.setMenuSettingStyleFormValue(previousDrop);
      } else if ('menuSettingIcon' in previousDrop) {
        const { component } = previousDrop;
        const { isIcon, size, color, status, position } = component.menuData.setting.icon;
        const menuSettingIcon: MenuRenderingSettingIcon = {
          component,
          isIcon,
          size,
          color,
          status,
          position,
          menuSettingIcon: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_ICON, true);
        this.future.push(menuSettingIcon);
        this.sidebarService.setMenuSettingIconValue(previousDrop);
        this.sidebarService.setMenuSettingIconFormValue(previousDrop);
      } else if ('menuSettingMega' in previousDrop) {
        const { component } = previousDrop;
        const { size, color } = component.menuData.setting.mega;
        const menuSettingMega: MenuRenderingSettingMega = {
          component,
          size,
          color,
          menuSettingMega: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_MEGA, true);
        this.future.push(menuSettingMega);
        this.sidebarService.setMenuSettingMegaValue(previousDrop);
        this.sidebarService.setMenuSettingMegaFormValue(previousDrop);
      } else if ('shoppingCartPatternSetting' in previousDrop) {
        const { component } = previousDrop;
        const { type, advanceSetting } = component.shoppingCartSaveData.pattern;
        const shoppingCartPatternSetting: ShoppingCartPatternSetting = {
          component,
          type,
          advanceSetting,
          shoppingCartPatternSetting: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_SHOPPING_CART);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.SHOPPING_CART_PATTERN, true);
        this.future.push(shoppingCartPatternSetting);
        this.sidebarService.setShoppingCartPatternSettingFormValue(previousDrop);
        this.sidebarService.setSidebarShoppingCartPatternChange(previousDrop);
      } else {
        const { previousContainer, previousIndex, currentIndex, isPointerOverContainer, distance, container, component } = previousDrop as Dropped;
        component.dragRef.data.undoRedoDropped = UndoRedoEnum.Undo;
        container.dropped.next({ item: component.dragRef, currentIndex, container, previousIndex, previousContainer, isPointerOverContainer, distance, dropPoint: distance });
      }
    }
  }
  redo(): void {
    const futureDrops = this.future;
    const length = futureDrops.length;
    if (length) {
      const nextDrop = futureDrops.pop();
      if ('themeCustomize' in nextDrop) {
        const { component } = nextDrop;
        const { cssStyle, elementId } = component.themeSettingCustomizeValue;
        const themeCustomize: ThemeSettingCustomize = {
          component,
          cssStyle,
          elementId,
          themeCustomize: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_CUSTOMIZE, true);
        this.past.push(themeCustomize);
        this.sidebarService.setThemeSettingCustomizeValue(nextDrop);
        this.sidebarService.setThemeSettingCustomizeFormValue(nextDrop);
      } else if ('themeColor' in nextDrop) {
        const { component } = nextDrop;
        const { color } = component.renderingThemeData.settings;
        const themeColor: ThemeSettingColor = {
          component,
          color,
          themeColor: '',
        };
        this.past.push(themeColor);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_COLOR, true);
        this.themeService.setThemeColorSetting(nextDrop);
        this.themeService.setThemeColorSettingFormValue(nextDrop);
      } else if ('themeDevice' in nextDrop) {
        const { component } = nextDrop;
        const { devices } = component.renderingThemeData;
        const themeColor: ThemeSettingDevice = {
          component,
          devices,
          themeDevice: '',
        };
        this.past.push(themeColor);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_DEVICE, true);
        this.themeService.setThemeDeviceSetting(nextDrop);
        this.themeService.setThemeDeviceSettingFormValue(nextDrop);
      } else if ('themeFont' in nextDrop) {
        const { component } = nextDrop;
        const { font } = component.renderingThemeData.settings;
        const themeFont: ThemeSettingFont = {
          component,
          font,
          themeFont: '',
        };
        this.past.push(themeFont);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarElement(ESidebarElement.THEME_TEXT, true);
        this.themeService.setThemeFontSetting(nextDrop);
        this.themeService.setThemeFontSettingFormValue(nextDrop);
      } else if ('quill' in nextDrop) {
        const { html, quill, delta } = nextDrop;
        const inverseDelta = this.invertDelta(quill, delta);
        this.past.push({ html, quill, delta: inverseDelta });
        this.updateQuill(nextDrop);
      } else if ('column' in nextDrop) {
        const { component } = nextDrop;
        const { column, gap } = component.layoutColumnValue;
        const layoutColumn: LayoutColumn = {
          component,
          column,
          gap,
        };
        this.past.push(layoutColumn);
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setLayoutColumnValue(nextDrop);
        this.sidebarService.setLayoutColumnFormValue(nextDrop);
      } else if ('sortBy' in nextDrop) {
        const { element, sortBy } = nextDrop;
        this.editService.onChangeLayoutIndex(element, sortBy);
        const layoutMove: LayoutMove = {
          element,
          sortBy: sortBy === 'desc' ? 'asc' : 'desc',
        };
        this.past.push(layoutMove);
      } else if ('corner' in nextDrop && !('buttonBorder' in nextDrop)) {
        const { component } = nextDrop;
        const { corner, color, opacity, thickness, position } = component.layoutSettingBorderValue;
        const layoutSettingBorder: LayoutSettingBorder = {
          component,
          corner,
          color,
          opacity,
          thickness,
          position,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.BORDER, true);
        this.past.push(layoutSettingBorder);
        this.sidebarService.setLayoutSettingBorderValue(nextDrop);
        this.sidebarService.setLayoutSettingBorderFormValue(nextDrop);
      } else if ('isShadow' in nextDrop) {
        const { component } = nextDrop;
        const { isShadow, color, opacity, xAxis, yAxis, distance, blur } = component.layoutSettingShadowValue;
        const layoutSettingShadow: LayoutSettingShadow = {
          component,
          isShadow,
          color,
          opacity,
          xAxis,
          yAxis,
          distance,
          blur,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.SHADOW, true);
        this.past.push(layoutSettingShadow);
        this.sidebarService.setLayoutSettingShadowValue(nextDrop);
        this.sidebarService.setLayoutSettingShadowFormValue(nextDrop);
      } else if ('isStretch' in nextDrop) {
        const { component } = nextDrop;
        const { scrollEffect, xAxis, yAxis, isStretch, margin } = component.layoutEffectValue;
        const layoutDesignEffect: LayoutDesignEffect = {
          component,
          scrollEffect,
          xAxis,
          yAxis,
          isStretch,
          margin,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.EFFECT, true);
        this.past.push(layoutDesignEffect);
        this.sidebarService.setLayoutDesignEffectValue(nextDrop);
        this.sidebarService.setLayoutDesignEffectFormValue(nextDrop);
      } else if ('cssStyle' in nextDrop) {
        const { component } = nextDrop;
        const { nativeElement } = component;
        const id = nativeElement.getAttribute('id');
        const nativeStyle = nativeElement.querySelector(':scope > style') as HTMLStyleElement;
        const layoutSettingCustomize: LayoutSettingCustomize = {
          component,
          cssStyle: nativeStyle.innerHTML,
          elementId: id,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.CUSTOMIZE, true);
        const isError = document.querySelector('.squiggly-error');
        if (!isError) this.past.push(layoutSettingCustomize);
        this.sidebarService.setLayoutSettingCustomizeValue(nextDrop);
        this.sidebarService.setLayoutSettingCustomizeFormValue(nextDrop);
      } else if ('padding' in nextDrop && 'margin' in nextDrop) {
        const { component } = nextDrop;
        const { margin, padding, horizontalPosition, verticalPosition } = component.layoutSettingAdvanceValue;
        const layoutSettingAdvance: LayoutSettingAdvance = {
          component,
          margin,
          padding,
          horizontalPosition,
          verticalPosition,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.ADVANCE, true);
        this.past.push(layoutSettingAdvance);
        this.sidebarService.setLayoutSettingAdvanceValue(nextDrop);
        this.sidebarService.setLayoutSettingAdvanceFormValue(nextDrop);
      } else if ('layoutSettingBackgroundColorForm' in nextDrop || 'layoutSettingBackgroundImageForm' in nextDrop || 'layoutSettingBackgroundVideoForm' in nextDrop) {
        const { component } = nextDrop;
        const layoutSettingBackground: LayoutSettingBackground = {
          component,
          currentStyle: component.layoutSettingBackgroundValue.currentStyle,
          layoutSettingBackgroundColorForm: component.layoutSettingBackgroundValue.layoutSettingBackgroundColorForm,
          layoutSettingBackgroundImageForm: component.layoutSettingBackgroundValue.layoutSettingBackgroundImageForm,
          layoutSettingBackgroundVideoForm: component.layoutSettingBackgroundValue.layoutSettingBackgroundVideoForm,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.BACKGROUND, true);
        this.past.push(layoutSettingBackground);
        this.sidebarService.setLayoutSettingBackgroundValue(nextDrop);
        this.sidebarService.setLayoutSettingBackgroundFormValue(nextDrop);
      } else if ('mediaGalleryControl' in nextDrop) {
        const { component } = nextDrop;
        const { isPageSlide, isAutoSlide, isPageButton, pageButtonSize, pageButtonOffset, isPageArrow, pageArrowSize, pageArrowOffset, slideSpeed } =
          component.mediaGalleryFormValue.control;
        const mediaGalleryControl: MediaGalleryControl = {
          component,
          isPageSlide,
          isAutoSlide,
          slideSpeed,
          isPageButton,
          pageButtonSize,
          pageButtonOffset,
          isPageArrow,
          pageArrowSize,
          pageArrowOffset,
          mediaGalleryControl: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_CONTROL, true);
        this.past.push(mediaGalleryControl);
        this.sidebarService.setMediaGalleryControlValue(nextDrop);
        this.sidebarService.setMediaGalleryControlFormValue(nextDrop);
      } else if ('galleryPatternId' in nextDrop) {
        const { component } = nextDrop;
        const { galleryPatternId, galleryPatternUrl, galleryGap, galleryMaxHeight, gallleryList } = component.mediaGalleryFormValue.gallery;
        const mediaGallerySetting: MediaGallerySetting = {
          component,
          galleryPatternId,
          galleryPatternUrl,
          galleryGap,
          galleryMaxHeight,
          gallleryList,
        };

        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_SETTING, true);
        this.past.push(mediaGallerySetting);
        this.sidebarService.setMediaGallerySettingValue(nextDrop);
        this.sidebarService.setMediaGallerySettingFormValue(nextDrop);
      } else if ('linkType' in nextDrop && 'linkValue' in nextDrop) {
        let { component } = nextDrop;
        if (component.componentType === 'CmsMediaGalleryItemRenderingComponent') {
          component = component as CmsMediaGalleryItemRenderingComponent;
          const { linkType, linkValue, parentID } = component.galleryListItem.setting.generalLinkSetting;
          const generalLinkSetting: GeneralLink = {
            component,
            linkType,
            linkValue,
            parentID,
          };
          this.onEditorFocusComponent(component);
          this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_ITEM_LINK, true);
          this.past.push(generalLinkSetting);
          this.sidebarService.setGeneralLinkSettingValue(nextDrop);
          this.sidebarService.setGeneralLinkSettingFormValue(nextDrop);
        } else if (component.componentType === 'CmsButtonRenderingComponent') {
          component = component as CmsButtonRenderingComponent;
          const { linkType, linkValue, parentID } = component.buttonData.generalLinkSetting;
          const generalLinkSetting: GeneralLink = {
            component,
            linkType,
            linkValue,
            parentID,
          };
          this.onEditorFocusComponent(component);
          this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
          this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_LINK, true);
          this.past.push(generalLinkSetting);
          this.sidebarService.setGeneralLinkSettingValue(nextDrop);
          this.sidebarService.setGeneralLinkSettingFormValue(nextDrop);
        }
      } else if ('text' in nextDrop && 'overlay' in nextDrop) {
        const { component } = nextDrop;
        const { text, overlay, horizontalPosition, verticalPosition, isApplyAll } = component.galleryListItem.setting.generalTextSetting;
        const generalTextSetting: GeneralText = {
          component,
          text,
          overlay,
          horizontalPosition,
          verticalPosition,
          isApplyAll,
        };
        this.onEditorFocusComponent(component);
        this.past.push(generalTextSetting);
        if (component.componentType === 'CmsMediaGalleryItemRenderingComponent') {
          this.sidebarService.setSidebarElement(ESidebarElement.MEDIA_GALLERY_ITEM_TEXT, true);
        }
        this.sidebarService.setGeneralTextSettingValue(nextDrop);
        this.sidebarService.setGeneralTextSettingFormValue(nextDrop);
      } else if ('textHover' in nextDrop) {
        const { component } = nextDrop;
        const layoutSettingHover: LayoutSettingHover = {
          component,
          textHover: component.layoutSettingHoverValue.textHover,
          style: component.layoutSettingHoverValue.style,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_SETTING);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.COMMON_SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.HOVER, true);
        this.past.push(layoutSettingHover);
        this.sidebarService.setLayoutSettingHoverValue(nextDrop);
        this.sidebarService.setLayoutSettingHoverFormValue(nextDrop);
      } else if ('contentManagementGeneral' in nextDrop) {
        const { component } = nextDrop;
        const { pattern, advance } = component.contentManagementValue.general;
        const contentManagementGeneral: ContentManagementGeneral = {
          component,
          contentManagementGeneral: '',
          pattern,
          advance,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.CONTENT_MANAGE_GENERAL, true);
        this.past.push(contentManagementGeneral);
        this.sidebarService.setContentManageGeneralValue(nextDrop);
        this.sidebarService.setContentManageGeneralFormValue(nextDrop);
      } else if ('contentManagementContents' in nextDrop) {
        const { component } = nextDrop;
        const { categoryIds, contentSortBy, isPinContentFirst, isShortDescription, isView, isPublishedDate, isShare } = component.contentManagementValue.contents;
        const contentManagementContents: ContentManagementContents = {
          component,
          contentManagementContents: '',
          categoryIds,
          contentSortBy,
          isPinContentFirst,
          isShortDescription,
          isView,
          isPublishedDate,
          isShare,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.CONTENT_MANAGE_CONTENTS, true);
        this.past.push(contentManagementContents);
        this.sidebarService.setContentManageContentsValue(nextDrop);
        this.sidebarService.setContentManageContentsFormValue(nextDrop);
      } else if ('contentManagementLanding' in nextDrop) {
        const { component } = nextDrop;
        const { _id, option } = component.contentManagementValue.landing;
        const contentManagementLanding: ContentManagementLanding = {
          component,
          contentManagementLanding: '',
          _id,
          option,
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.CONTENT_MANAGE_LANDING, true);
        this.past.push(contentManagementLanding);
        this.sidebarService.setContentManageLandingValue(nextDrop);
        this.sidebarService.setContentManageLandingFormValue(nextDrop);
      } else if ('buttonSetting' in nextDrop) {
        const { component } = nextDrop;
        const { background, padding } = component.buttonData.buttonSetting;
        const buttonSetting: ButtonSetting = {
          component,
          background,
          padding,
          buttonSetting: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_SETTING, true);
        this.past.push(buttonSetting);
        this.sidebarService.setButtonSettingValue(nextDrop);
        this.sidebarService.setButtonSettingFormValue(nextDrop);
      } else if ('buttonBorder' in nextDrop) {
        const { component } = nextDrop;
        const { corner, color, opacity, thickness, position } = component.buttonData.buttonBorder;
        const buttonBorder: ButtonBorder = {
          component,
          corner,
          color,
          opacity,
          thickness,
          position,
          buttonBorder: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_BORDER, true);
        this.past.push(buttonBorder);
        this.sidebarService.setButtonBorderValue(nextDrop);
        this.sidebarService.setButtonBorderFormValue(nextDrop);
      } else if ('buttonText' in nextDrop) {
        const { component } = nextDrop;
        const {
          text,
          isFontDefault,
          isFontIndexDefault,
          isStyleDefault,
          isTextColorDefault,
          isTextOpacityDefault,
          isLineHeightDefault,
          isLetterSpacingDefault,
          fontFamily,
          fontStyle,
          fontSize,
          textColor,
          textOpacity,
          textAlignment,
          lineHeight,
          letterSpacing,
          isIcon,
          iconCode,
          iconBeforeText,
          iconSize,
          iconColor,
          iconColorOpacity,
        } = component.buttonData.buttonText;
        const buttonText: ButtonText = {
          component,
          text,
          isFontDefault,
          isFontIndexDefault,
          isStyleDefault,
          isTextColorDefault,
          isTextOpacityDefault,
          isLineHeightDefault,
          isLetterSpacingDefault,
          fontFamily,
          fontStyle,
          fontSize,
          textColor,
          textOpacity,
          textAlignment,
          lineHeight,
          letterSpacing,
          isIcon,
          iconCode,
          iconBeforeText,
          iconSize,
          iconColor,
          iconColorOpacity,
          buttonText: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_TEXT, true);
        this.past.push(buttonText);
        this.sidebarService.setButtonTextValue(nextDrop);
        this.sidebarService.setButtonTextFormValue(nextDrop);
      } else if ('buttonHover' in nextDrop) {
        const { component } = nextDrop;
        const {
          isHover,
          buttonHoverColor,
          buttonHoverColorOpacity,
          borderHoverColor,
          borderHoverColorOpacity,
          textHoverColor,
          textHoverColorOpacity,
          textHoverTransform,
          hoverEffect,
        } = component.buttonData.buttonHover;
        const buttonHover: ButtonHover = {
          component,
          isHover,
          buttonHoverColor,
          buttonHoverColorOpacity,
          borderHoverColor,
          borderHoverColorOpacity,
          textHoverColor,
          textHoverColorOpacity,
          textHoverTransform,
          hoverEffect,
          buttonHover: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.BUTTON_HOVER, true);
        this.past.push(buttonHover);
        this.sidebarService.setButtonHoverValue(nextDrop);
        this.sidebarService.setButtonHoverFormValue(nextDrop);
      } else if ('menuSource' in nextDrop) {
        const { component } = nextDrop;
        const { sourceType, menuGroupId, parentMenuId } = component.menuData.source;
        const menuSource: MenuRenderingSettingSource = {
          component,
          sourceType,
          menuGroupId,
          parentMenuId,
          menuSource: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SOURCE_TAB);
        this.past.push(menuSource);
        this.sidebarService.setMenuSourceValue(nextDrop);
        this.sidebarService.setMenuSourceFormValue(nextDrop);
      } else if ('menuLevel1' in nextDrop) {
        const { component } = nextDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.one;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel1: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(0);
        this.past.push(menuLevel);
        this.sidebarService.setMenuLevelOneValue(nextDrop);
        this.sidebarService.setMenuLevelOneFormValue(nextDrop);
      } else if ('menuLevel2' in nextDrop) {
        const { component } = nextDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.two;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel2: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(1);
        this.past.push(menuLevel);
        this.sidebarService.setMenuLevelTwoValue(nextDrop);
        this.sidebarService.setMenuLevelTwoFormValue(nextDrop);
      } else if ('menuLevel3' in nextDrop) {
        const { component } = nextDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.three;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel3: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(2);
        this.past.push(menuLevel);
        this.sidebarService.setMenuLevelThreeValue(nextDrop);
        this.sidebarService.setMenuLevelThreeFormValue(nextDrop);
      } else if ('menuLevel4' in nextDrop) {
        const { component } = nextDrop;
        const { size, style, text, backGround, shadow, textAnimation, backgroundAnimation } = component.menuData.level.four;
        const menuLevel: MenuRenderingSettingLevelOptions = {
          component,
          size,
          style,
          text,
          backGround,
          shadow,
          textAnimation,
          backgroundAnimation,
          menuLevel4: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.DESIGN_TAB);
        this.sidebarService.setSidebarMenuLevelTab(3);
        this.past.push(menuLevel);
        this.sidebarService.setMenuLevelFourValue(nextDrop);
        this.sidebarService.setMenuLevelFourFormValue(nextDrop);
      } else if ('menuMobileHamburger' in nextDrop) {
        const { component } = nextDrop;
        const { icon, isText, text, position } = component.menuData.mobile.hamburger;
        const menuMobileHamburger: MenuRenderingSettingMobileHamburger = {
          component,
          icon,
          isText,
          text,
          position,
          menuMobileHamburger: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.MOBILE_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_HAMBURGER, true);
        this.past.push(menuMobileHamburger);
        this.sidebarService.setMenuMobileHamburgerValue(nextDrop);
        this.sidebarService.setMenuMobileHamburgerFormValue(nextDrop);
      } else if ('menuMobileIcon' in nextDrop) {
        const { component } = nextDrop;
        const { icons, isSearch, isLanguage } = component.menuData.mobile.featureIcon;
        const menuMobileIcon: MenuRenderingSettingMobileIcon = {
          component,
          icons,
          isSearch,
          isLanguage,
          menuMobileIcon: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.MOBILE_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_ICON_FEATURE, true);
        this.past.push(menuMobileIcon);
        this.sidebarService.setMenuMobileIconValue(nextDrop);
        this.sidebarService.setMenuMobileIconFormValue(nextDrop);
      } else if ('menuSettingSticky' in nextDrop) {
        const { component } = nextDrop;
        const sticky = component.menuData.setting.sticky;
        const menuSettingSticky: MenuRenderingSettingSticky = {
          component,
          sticky,
          menuSettingSticky: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_STICKY, true);
        this.past.push(menuSettingSticky);
        this.sidebarService.setMenuSettingStickyValue(nextDrop);
        this.sidebarService.setMenuSettingStickyFormValue(nextDrop);
      } else if ('menuSettingAnimation' in nextDrop) {
        const { component } = nextDrop;
        const animation = component.menuData.setting.animation;
        const menuSettingAnimation: MenuRenderingSettingAnimation = {
          component,
          animation,
          menuSettingAnimation: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_ANIMATION, true);
        this.past.push(menuSettingAnimation);
        this.sidebarService.setMenuSettingAnimationValue(nextDrop);
        this.sidebarService.setMenuSettingAnimationFormValue(nextDrop);
      } else if ('menuSettingAlignment' in nextDrop) {
        const { component } = nextDrop;
        const alignment = component.menuData.setting.alignment;
        const menuSettingAlignment: MenuRenderingSettingAlignment = {
          component,
          alignment,
          menuSettingAlignment: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_TEXT_ALIGNMENT, true);
        this.past.push(menuSettingAlignment);
        this.sidebarService.setMenuSettingAlignmentValue(nextDrop);
        this.sidebarService.setMenuSettingAlignmentFormValue(nextDrop);
      } else if ('menuSettingStyle' in nextDrop) {
        const { component } = nextDrop;
        const style = component.menuData.setting.style;
        const menuSettingStyle: MenuRenderingSettingStyle = {
          component,
          style,
          menuSettingStyle: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_STYLE, true);
        this.past.push(menuSettingStyle);
        this.sidebarService.setMenuSettingStyleValue(nextDrop);
        this.sidebarService.setMenuSettingStyleFormValue(nextDrop);
      } else if ('menuSettingIcon' in nextDrop) {
        const { component } = nextDrop;
        const { isIcon, size, color, status, position } = component.menuData.setting.icon;
        const menuSettingIcon: MenuRenderingSettingIcon = {
          component,
          isIcon,
          size,
          color,
          status,
          position,
          menuSettingIcon: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_ICON, true);
        this.past.push(menuSettingIcon);
        this.sidebarService.setMenuSettingIconValue(nextDrop);
        this.sidebarService.setMenuSettingIconFormValue(nextDrop);
      } else if ('menuSettingMega' in nextDrop) {
        const { component } = nextDrop;
        const { size, color } = component.menuData.setting.mega;
        const menuSettingMega: MenuRenderingSettingMega = {
          component,
          size,
          color,
          menuSettingMega: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarMenuCustomTab(EMenuCustomTab.SETTING_TAB);
        this.sidebarService.setSidebarElement(ESidebarElement.MENU_MEGA, true);
        this.past.push(menuSettingMega);
        this.sidebarService.setMenuSettingMegaValue(nextDrop);
        this.sidebarService.setMenuSettingMegaFormValue(nextDrop);
      } else if ('shoppingCartPatternSetting' in nextDrop) {
        const { component } = nextDrop;
        const { type, advanceSetting } = component.shoppingCartSaveData.pattern;
        const shoppingCartPatternSetting: ShoppingCartPatternSetting = {
          component,
          type,
          advanceSetting,
          shoppingCartPatternSetting: '',
        };
        this.onEditorFocusComponent(component);
        this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_SHOPPING_CART);
        this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
        this.sidebarService.setSidebarElement(ESidebarElement.SHOPPING_CART_PATTERN, true);
        this.past.push(shoppingCartPatternSetting);
        this.sidebarService.setShoppingCartPatternSettingFormValue(nextDrop);
        this.sidebarService.setSidebarShoppingCartPatternChange(nextDrop);
      } else {
        const { previousContainer, previousIndex, currentIndex, isPointerOverContainer, distance, container, component } = nextDrop as Dropped;
        component.dragRef.data.undoRedoDropped = UndoRedoEnum.Redo;
        container.dropped.next({ item: component.dragRef, currentIndex, previousIndex, container, previousContainer, isPointerOverContainer, distance, dropPoint: distance });
      }
    }
  }
  onEditorFocusComponent(component: ComponentType): void {
    switch (component.componentType) {
      case 'CmsThemeRenderingComponent':
        component = component as CmsThemeRenderingComponent;
        component.onThemeFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.TEMPLATE_SETTING);
        break;
      case 'CmsLayoutRenderingComponent':
        component = component as CmsLayoutRenderingComponent;
        component.onLayoutEditorFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsContainerRenderingComponent':
        component = component as CmsContainerRenderingComponent;
        component.onContainerEditorFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsTextRenderingComponent':
        component = component as CmsTextRenderingComponent;
        component.onTextEditorFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsMediaGalleryRenderingComponent':
        component = component as CmsMediaGalleryRenderingComponent;
        component.onMediaGalleryFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsMediaGalleryItemRenderingComponent':
        component = component as CmsMediaGalleryItemRenderingComponent;
        component.onMediaGalleryItemFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.MEDIA_GALLERY_ITEM);
        break;
      case 'CmsMediaSliderRenderingComponent':
        component = component as CmsMediaSliderRenderingComponent;
        component.onMediaSliderFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsContentManagementRenderingComponent':
        component = component as CmsContentManagementRenderingComponent;
        component.onContentManagementFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsButtonRenderingComponent':
        component = component as CmsButtonRenderingComponent;
        component.onButtonFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      case 'CmsMenuRenderingComponent':
        component = component as CmsMenuRenderingComponent;
        component.onMenuFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.MENU_CUSTOM);
        break;
      case 'CmsShoppingCartRenderingComponent':
        component = component as CmsShoppingCartRenderingComponent;
        component.onShoppingCartFocusComponent(component);
        this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
        break;
      default:
        break;
    }
  }
  addDeltaUndo(html: string, quill: QuillType, delta: Delta, oldDelta: Delta): void {
    const d = new Delta(delta);
    const inverseDelta = d.invert(oldDelta);
    this.past.push({ html, quill, delta: inverseDelta });
    this.clearFutureAndRemovedComponent();
  }
  addDroppedUndoFromAction(dropped: Dropped): void {
    this.addDroppedUndo(dropped);
    this.clearFutureAndRemovedComponent();
  }
  addDroppedUndo(dropped: Dropped): void {
    const undo = this.swapIndexContainerDrop(dropped);
    this.past.push(undo);
  }
  addDroppedRedo(dropped: Dropped): void {
    const redo = this.swapIndexContainerDrop(dropped);
    this.future.push(redo);
  }
  swapIndexContainerDrop(dropped: Dropped): Dropped {
    const { previousIndex: currentIndex, currentIndex: previousIndex, previousContainer: container, container: previousContainer, item, ...others } = dropped;
    const undo: Dropped = { previousIndex, currentIndex, previousContainer, container, item, ...others };
    return undo;
  }
  invertDelta(quill: QuillType, delta: Delta): Delta {
    const base = new Delta(quill.getContents());
    return delta.invert(base);
  }
  updateQuill(undoRedo: QuillUndoRedo): void {
    const { quill, delta } = undoRedo;
    quill.updateContents(delta, 'silent');
    undoRedo.html = quill.root.innerHTML;
  }
  addLayoutColumnUndo(oldColumn: LayoutColumn): void {
    this.past.push(oldColumn);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutMoveUndo(element: HTMLElement, sortBy: 'desc' | 'asc'): void {
    const layoutMove: LayoutMove = {
      element,
      sortBy: sortBy === 'desc' ? 'asc' : 'desc',
    };
    this.past.push(layoutMove);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutBorderUndo(layoutSettingBorder: LayoutSettingBorder): void {
    this.past.push(layoutSettingBorder);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutSettingShadow(layoutSettingShadow: LayoutSettingShadow): void {
    this.past.push(layoutSettingShadow);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutDesignEffect(layoutDesignEffect: LayoutDesignEffect): void {
    this.past.push(layoutDesignEffect);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutSettingAdvance(layoutSettingAdvance: LayoutSettingAdvance): void {
    this.past.push(layoutSettingAdvance);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutSettingCustomize(layoutSettingCustomize: LayoutSettingCustomize): void {
    this.past.push(layoutSettingCustomize);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutSettingBackground(layoutSettingBackground: LayoutSettingBackground): void {
    this.past.push(layoutSettingBackground);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutMediaGalleryControl(mediaGalleryControl: MediaGalleryControl): void {
    this.past.push(mediaGalleryControl);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutMediaGallerySetting(mediaGallerySetting: MediaGallerySetting): void {
    this.past.push(mediaGallerySetting);
    this.clearFutureAndRemovedComponent();
  }
  addGeneralTextSetting(generalTextSetting: GeneralText): void {
    this.past.push(generalTextSetting);
    this.clearFutureAndRemovedComponent();
  }
  addGeneralLinkSetting(generalLinkSetting: GeneralLink): void {
    this.past.push(generalLinkSetting);
    this.clearFutureAndRemovedComponent();
  }
  addLayoutSettingHover(layoutSettingHover: LayoutSettingHover): void {
    this.past.push(layoutSettingHover);
    this.clearFutureAndRemovedComponent();
  }
  addThemeSettingCustomize(themeSettingCustomize: ThemeSettingCustomize): void {
    this.past.push(themeSettingCustomize);
    this.clearFutureAndRemovedComponent();
  }
  addThemeSettingFont(themeSettingFont: ThemeSettingFont): void {
    this.past.push(themeSettingFont);
    this.clearFutureAndRemovedComponent();
  }
  addThemeSettingColor(themeSettingColor: ThemeSettingColor): void {
    this.past.push(themeSettingColor);
    this.clearFutureAndRemovedComponent();
  }
  addThemeSettingDevice(themeSettingDevice: ThemeSettingDevice): void {
    this.past.push(themeSettingDevice);
    this.clearFutureAndRemovedComponent();
  }
  addThemeSettingGeneral(themeSettingGeneral: ThemeSettingGeneral): void {
    this.past.push(themeSettingGeneral);
    this.clearFutureAndRemovedComponent();
  }
  addContentManageGeneral(contentManagementGeneral: ContentManagementGeneral): void {
    this.past.push(contentManagementGeneral);
    this.clearFutureAndRemovedComponent();
  }
  addContentManageContents(contentManagementContents: ContentManagementContents): void {
    this.past.push(contentManagementContents);
    this.clearFutureAndRemovedComponent();
  }
  addContentManageLanding(contentManagementLanding: ContentManagementLanding): void {
    this.past.push(contentManagementLanding);
    this.clearFutureAndRemovedComponent();
  }
  addButtonSetting(buttonSetting: ButtonSetting): void {
    this.past.push(buttonSetting);
    this.clearFutureAndRemovedComponent();
  }

  addShoppingCartPatternSetting(shoppingCartPatternSetting: ShoppingCartPatternSetting): void {
    this.past.push(shoppingCartPatternSetting);
    this.clearFutureAndRemovedComponent();
  }

  addButtonBorder(buttonBorder: ButtonBorder): void {
    this.past.push(buttonBorder);
    this.clearFutureAndRemovedComponent();
  }
  addButtonText(buttonText: ButtonText): void {
    this.past.push(buttonText);
    this.clearFutureAndRemovedComponent();
  }
  addButtonHover(buttonHover: ButtonHover): void {
    this.past.push(buttonHover);
    this.clearFutureAndRemovedComponent();
  }
  addMenuSource(menuSource: MenuRenderingSettingSource): void {
    this.past.push(menuSource);
    this.clearFutureAndRemovedComponent();
  }

  addMenuMobileHamburger(menuMobileHamburger: MenuRenderingSettingMobileHamburger): void {
    this.past.push(menuMobileHamburger);
    this.clearFutureAndRemovedComponent();
  }

  addMenuMobileIcon(menuMobileIcon: MenuRenderingSettingMobileIcon): void {
    this.past.push(menuMobileIcon);
    this.clearFutureAndRemovedComponent();
  }

  addMenuSettingSticky(menuSettingSticky: MenuRenderingSettingSticky): void {
    this.past.push(menuSettingSticky);
    this.clearFutureAndRemovedComponent();
  }

  addMenuSettingAnimation(menuSettingAnimation: MenuRenderingSettingAnimation): void {
    this.past.push(menuSettingAnimation);
    this.clearFutureAndRemovedComponent();
  }

  addMenuSettingAlignment(menuSettingAlignment: MenuRenderingSettingAlignment): void {
    this.past.push(menuSettingAlignment);
    this.clearFutureAndRemovedComponent();
  }

  addMenuSettingStyle(menuSettingStyle: MenuRenderingSettingStyle): void {
    this.past.push(menuSettingStyle);
    this.clearFutureAndRemovedComponent();
  }

  addMenuSettingIcon(menuSettingIcon: MenuRenderingSettingIcon): void {
    this.past.push(menuSettingIcon);
    this.clearFutureAndRemovedComponent();
  }

  addMenuSettingMega(menuSettingMega: MenuRenderingSettingMega): void {
    this.past.push(menuSettingMega);
    this.clearFutureAndRemovedComponent();
  }

  addMenuLevel(menuLevel: MenuRenderingSettingLevelOptions): void {
    this.past.push(menuLevel);
    this.clearFutureAndRemovedComponent();
  }

  clearFutureAndRemovedComponent(): void {
    this.future = [];
    this.editService.removedDropListRef.data.viewRefAndElementRefAndComponents.forEach(({ component }) => {
      const { insertPoint1, insertPoint2, insertPoint3, insertPoint4, viewRef } = component;
      if (insertPoint1?.length) {
        insertPoint1.clear();
      }
      if (insertPoint2?.length) {
        insertPoint2.clear();
      }
      if (insertPoint3?.length) {
        insertPoint3.clear();
      }
      if (insertPoint4?.length) {
        insertPoint4.clear();
      }
      viewRef.destroy();
    });
    this.editService.removedDropListRef.data.viewRefAndElementRefAndComponents = [];
    this.editService.removedDropListRef.data.dragRefs = [];
  }
}
