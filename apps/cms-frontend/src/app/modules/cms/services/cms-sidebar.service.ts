import { Injectable } from '@angular/core';
import {
  EnumThemeMode,
  IButtonBorder,
  IButtonHover,
  IButtonSetting,
  IButtonText,
  ICmsLayoutBottomTypes,
  IContentEditorComponentEmbededOption,
  IContentEditorComponentImageOption,
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
  IShoppingCartMediaFormValues,
  IShoppingCartPatternSetting,
  IThemeRenderingSettingCustomize,
} from '@reactor-room/cms-models-lib';
import { BehaviorSubject, Subject } from 'rxjs';
import { ELandingMode, ESidebarElement, ESidebarMode, ISidebarElement } from '../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { EMenuCustomTab } from '../containers/cms-sidebar/components/cms-menu-custom/cms-menu-custom.model';

@Injectable({
  providedIn: 'root',
})
export class CmsSidebarService {
  contentManagementLandingValue$ = new Subject<IContentManagementLanding>();

  private sidebarMode = new BehaviorSubject(ESidebarMode.SITE_MANAGE);
  getSidebarMode = this.sidebarMode.asObservable();

  private landingMode = new BehaviorSubject(null);
  getLandingMode = this.landingMode.asObservable();

  private siteId = new BehaviorSubject('');
  getSiteId = this.siteId.asObservable();

  private themeMode = new BehaviorSubject(EnumThemeMode.LIGHT);
  getThemeMode = this.themeMode.asObservable();

  private menuGroupId = new BehaviorSubject('');
  getMenuGroupId = this.menuGroupId.asObservable();

  private createPageStatus = new BehaviorSubject(false);
  getCreatePageStatus = this.createPageStatus.asObservable();

  private sidebarLayoutMode = new BehaviorSubject(ESidebarMode.LAYOUT_SETTING_LAYOUT);
  getSidebarLayoutMode = this.sidebarLayoutMode.asObservable();

  private sidebarLayoutTab = new BehaviorSubject(ESidebarLayoutTab.LAYOUT_DETAIL);
  getSidebarLayoutTab = this.sidebarLayoutTab.asObservable();

  private sidebarElement = new BehaviorSubject(null);
  getSidebarElement = this.sidebarElement.asObservable();

  private layoutEmbededValue = new BehaviorSubject(null);
  getLayoutEmbededValue = this.layoutEmbededValue.asObservable();

  private layoutEmbededFormValue = new BehaviorSubject(null);
  getLayoutEmbededFormValue = this.layoutEmbededFormValue.asObservable();

  private layoutImageValue = new BehaviorSubject(null);
  getLayoutImageValue = this.layoutImageValue.asObservable();

  private layoutImageFormValue = new BehaviorSubject(null);
  getLayoutImageFormValue = this.layoutImageFormValue.asObservable();

  private layoutSettingBorderValue = new BehaviorSubject(null);
  getLayoutSettingBorderValue = this.layoutSettingBorderValue.asObservable();

  private layoutSettingBorderFormValue = new BehaviorSubject(null);
  getlayoutSettingBorderFormValue = this.layoutSettingBorderFormValue.asObservable();

  private layoutSettingShadowValue = new BehaviorSubject(null);
  getLayoutSettingShadowValue = this.layoutSettingShadowValue.asObservable();

  private layoutSettingShadowFormValue = new BehaviorSubject(null);
  getlayoutSettingShadowFormValue = this.layoutSettingShadowFormValue.asObservable();

  private layoutDesignEffectValue = new BehaviorSubject(null);
  getLayoutDesignEffectValue = this.layoutDesignEffectValue.asObservable();

  private layoutDesignEffectFormValue = new BehaviorSubject(null);
  getlayoutDesignEffectFormValue = this.layoutDesignEffectFormValue.asObservable();

  private layoutSettingHoverValue = new BehaviorSubject(null);
  getLayoutSettingHoverValue = this.layoutSettingHoverValue.asObservable();

  private layoutSettingHoverFormValue = new BehaviorSubject(null);
  getlayoutSettingHoverFormValue = this.layoutSettingHoverFormValue.asObservable();

  private layoutSettingAdvanceValue = new BehaviorSubject(null);
  getLayoutSettingAdvanceValue = this.layoutSettingAdvanceValue.asObservable();

  private layoutSettingAdvanceFormValue = new BehaviorSubject(null);
  getlayoutSettingAdvanceFormValue = this.layoutSettingAdvanceFormValue.asObservable();

  private layoutSettingBackgroundValue = new BehaviorSubject(null);
  getLayoutSettingBackgroundValue = this.layoutSettingBackgroundValue.asObservable();

  private layoutSettingBackgroundFormValue = new BehaviorSubject(null);
  getlayoutSettingBackgroundFormValue = this.layoutSettingBackgroundFormValue.asObservable();

  private layoutSettingCustomizeValue = new BehaviorSubject(null);
  getLayoutSettingCustomizeValue = this.layoutSettingCustomizeValue.asObservable();

  private layoutSettingCustomizeFormValue = new BehaviorSubject(null);
  getlayoutSettingCustomizeFormValue = this.layoutSettingCustomizeFormValue.asObservable();

  private layoutColumnValue = new BehaviorSubject(null);
  getLayoutColumnValue = this.layoutColumnValue.asObservable();

  private layoutColumnFormValue = new BehaviorSubject(null);
  getlayoutColumnFormValue = this.layoutColumnFormValue.asObservable();

  private themeSettingCustomizeValue = new BehaviorSubject(null);
  getThemeSettingCustomizeValue = this.themeSettingCustomizeValue.asObservable();

  private themeSettingCustomizeFormValue = new BehaviorSubject(null);
  getthemeSettingCustomizeFormValue = this.themeSettingCustomizeFormValue.asObservable();

  private mediaGallerySettingValue = new BehaviorSubject(null);
  getMediaGallerySettingValue = this.mediaGallerySettingValue.asObservable();

  private mediaGallerySettingFormValue = new BehaviorSubject(null);
  getMediaGallerySettingFormValue = this.mediaGallerySettingFormValue.asObservable();

  private mediaGalleryControlValue = new BehaviorSubject(null);
  getMediaGalleryControlValue = this.mediaGalleryControlValue.asObservable();

  private mediaGalleryControlFormValue = new BehaviorSubject(null);
  getMediaGalleryControlFormValue = this.mediaGalleryControlFormValue.asObservable();

  private generalTextSettingValue = new BehaviorSubject(null);
  getGeneralTextSettingValue = this.generalTextSettingValue.asObservable();

  private generalTextSettingFormValue = new BehaviorSubject(null);
  getGeneralTextSettingFormValue = this.generalTextSettingFormValue.asObservable();

  private generalLinkSettingValue = new BehaviorSubject(null);
  getGeneralLinkSettingValue = this.generalLinkSettingValue.asObservable();

  private generalLinkSettingFormValue = new BehaviorSubject(null);
  getGeneralLinkSettingFormValue = this.generalLinkSettingFormValue.asObservable();

  private contentManageGeneralValue = new BehaviorSubject(null);
  getContentManageGeneralValue = this.contentManageGeneralValue.asObservable();

  private contentManageGeneralFormValue = new BehaviorSubject(null);
  getContentManageGeneralFormValue = this.contentManageGeneralFormValue.asObservable();

  private contentManageContentsValue = new BehaviorSubject(null);
  getContentManageContentsValue = this.contentManageContentsValue.asObservable();

  private contentManageContentsFormValue = new BehaviorSubject(null);
  getContentManageContentsFormValue = this.contentManageContentsFormValue.asObservable();

  private contentManageLandingValue = new BehaviorSubject(null);
  getContentManageLandingValue = this.contentManageLandingValue.asObservable();

  private contentManageLandingFormValue = new BehaviorSubject(null);
  getContentManageLandingFormValue = this.contentManageLandingFormValue.asObservable();

  private buttonSettingValue = new BehaviorSubject(null);
  getButtonSettingValue = this.buttonSettingValue.asObservable();

  private buttonSettingFormValue = new BehaviorSubject(null);
  getButtonSettingFormValue = this.buttonSettingFormValue.asObservable();

  private buttonBorderValue = new BehaviorSubject(null);
  getButtonBorderValue = this.buttonBorderValue.asObservable();

  private buttonBorderFormValue = new BehaviorSubject(null);
  getButtonBorderFormValue = this.buttonBorderFormValue.asObservable();

  private buttonTextValue = new BehaviorSubject(null);
  getButtonTextValue = this.buttonTextValue.asObservable();

  private buttonTextFormValue = new BehaviorSubject(null);
  getButtonTextFormValue = this.buttonTextFormValue.asObservable();

  private buttonHoverValue = new BehaviorSubject(null);
  getButtonHoverValue = this.buttonHoverValue.asObservable();

  private buttonHoverFormValue = new BehaviorSubject(null);
  getButtonHoverFormValue = this.buttonHoverFormValue.asObservable();

  private menuSourceValue = new BehaviorSubject(null);
  getMenuSourceValue = this.menuSourceValue.asObservable();

  private menuSourceFormValue = new BehaviorSubject(null);
  getMenuSourceFormValue = this.menuSourceFormValue.asObservable();

  private menuLevelOneValue = new BehaviorSubject(null);
  getMenuLevelOneValue = this.menuLevelOneValue.asObservable();

  private menuLevelOneFormValue = new BehaviorSubject(null);
  getMenuLevelOneFormValue = this.menuLevelOneFormValue.asObservable();

  private menuLevelTwoValue = new BehaviorSubject(null);
  getMenuLevelTwoValue = this.menuLevelTwoValue.asObservable();

  private menuLevelTwoFormValue = new BehaviorSubject(null);
  getMenuLevelTwoFormValue = this.menuLevelTwoFormValue.asObservable();

  private menuLevelThreeValue = new BehaviorSubject(null);
  getMenuLevelThreeValue = this.menuLevelThreeValue.asObservable();

  private menuLevelThreeFormValue = new BehaviorSubject(null);
  getMenuLevelThreeFormValue = this.menuLevelThreeFormValue.asObservable();

  private menuLevelFourValue = new BehaviorSubject(null);
  getMenuLevelFourValue = this.menuLevelFourValue.asObservable();

  private menuLevelFourFormValue = new BehaviorSubject(null);
  getMenuLevelFourFormValue = this.menuLevelFourFormValue.asObservable();

  private menuMobileHamburgerValue = new BehaviorSubject(null);
  getMenuMobileHamburgerValue = this.menuMobileHamburgerValue.asObservable();

  private menuMobileHamburgerFormValue = new BehaviorSubject(null);
  getMenuMobileHamburgerFormValue = this.menuMobileHamburgerFormValue.asObservable();

  private menuMobileIconValue = new BehaviorSubject(null);
  getMenuMobileIconValue = this.menuMobileIconValue.asObservable();

  private menuMobileIconFormValue = new BehaviorSubject(null);
  getMenuMobileIconFormValue = this.menuMobileIconFormValue.asObservable();

  private menuSettingStickyValue = new BehaviorSubject(null);
  getMenuSettingStickyValue = this.menuSettingStickyValue.asObservable();

  private menuSettingStickyFormValue = new BehaviorSubject(null);
  getMenuSettingStickyFormValue = this.menuSettingStickyFormValue.asObservable();

  private menuSettingAnimationValue = new BehaviorSubject(null);
  getMenuSettingAnimationValue = this.menuSettingAnimationValue.asObservable();

  private menuSettingAnimationFormValue = new BehaviorSubject(null);
  getMenuSettingAnimationFormValue = this.menuSettingAnimationFormValue.asObservable();

  private menuSettingAlignmentValue = new BehaviorSubject(null);
  getMenuSettingAlignmentValue = this.menuSettingAlignmentValue.asObservable();

  private menuSettingAlignmentFormValue = new BehaviorSubject(null);
  getMenuSettingAlignmentFormValue = this.menuSettingAlignmentFormValue.asObservable();

  private menuSettingStyleValue = new BehaviorSubject(null);
  getMenuSettingStyleValue = this.menuSettingStyleValue.asObservable();

  private menuSettingStyleFormValue = new BehaviorSubject(null);
  getMenuSettingStyleFormValue = this.menuSettingStyleFormValue.asObservable();

  private menuSettingIconValue = new BehaviorSubject(null);
  getMenuSettingIconValue = this.menuSettingIconValue.asObservable();

  private menuSettingIconFormValue = new BehaviorSubject(null);
  getMenuSettingIconFormValue = this.menuSettingIconFormValue.asObservable();

  private menuSettingMegaValue = new BehaviorSubject(null);
  getMenuSettingMegaValue = this.menuSettingMegaValue.asObservable();

  private menuSettingMegaFormValue = new BehaviorSubject(null);
  getMenuSettingMegaFormValue = this.menuSettingMegaFormValue.asObservable();

  private sidebarMenuCustomTab = new BehaviorSubject(EMenuCustomTab.SOURCE_TAB);
  getSidebarMenuCustomTab = this.sidebarMenuCustomTab.asObservable();

  private sidebarMenuLevelTab = new BehaviorSubject(null);
  getSidebarMenuLevelTab = this.sidebarMenuLevelTab.asObservable();

  //shopping-cart

  private shoppingCartPatternSettingFormValue = new BehaviorSubject(null);
  getShoppingCartPatternSettingFormValue = this.shoppingCartPatternSettingFormValue.asObservable();

  private sidebarShoppingCartPatternChange = new BehaviorSubject<IShoppingCartPatternSetting>(null);
  getSidebarShoppingCartPatternChange = this.sidebarShoppingCartPatternChange.asObservable();

  private cmsLayoutBottomValueChange = new BehaviorSubject<ICmsLayoutBottomTypes>(null);
  getCmsLayoutBottomValueChange = this.cmsLayoutBottomValueChange.asObservable();

  private sidebarShoppingCartMediaChange = new BehaviorSubject<IShoppingCartMediaFormValues>(null);
  getSidebarShoppingCartMediaChange = this.sidebarShoppingCartMediaChange.asObservable();

  constructor() {}

  //shopping-cart

  setShoppingCartPatternSettingFormValue(value: IShoppingCartPatternSetting): void {
    this.shoppingCartPatternSettingFormValue.next(value);
  }

  setSidebarShoppingCartPatternChange(value: IShoppingCartPatternSetting): void {
    this.sidebarShoppingCartPatternChange.next(value);
  }

  setCmsLayoutBottomValueChange(value: ICmsLayoutBottomTypes): void {
    this.cmsLayoutBottomValueChange.next(value);
  }

  setSidebarMenuCustomTab(tab: EMenuCustomTab): void {
    this.sidebarMenuCustomTab.next(tab);
  }

  setSidebarProductMediaValueChange(value: IShoppingCartMediaFormValues): void {
    this.sidebarShoppingCartMediaChange.next(value);
  }

  setThemeMode(mode: EnumThemeMode): void {
    this.themeMode.next(mode);
  }

  setSidebarMenuLevelTab(tab: number): void {
    this.sidebarMenuLevelTab.next(tab);
  }

  setSidebarMode(mode: ESidebarMode): void {
    this.sidebarMode.next(mode);
  }

  setLandingMode(mode: ELandingMode): void {
    this.landingMode.next(mode);
  }

  setSidebarLayoutMode(mode: ESidebarMode): void {
    this.sidebarLayoutMode.next(mode);
  }

  setSidebarLayoutTab(tab: ESidebarLayoutTab): void {
    this.sidebarLayoutTab.next(tab);
  }

  setSidebarElement(element: ESidebarElement, isUndoRedo: boolean): void {
    this.sidebarElement.next({ element, isUndoRedo });
  }

  setLayoutEmbededValue(value: IContentEditorComponentEmbededOption): void {
    this.layoutEmbededValue.next(value);
  }

  setLayoutEmbededFormValue(value: IContentEditorComponentEmbededOption): void {
    this.layoutEmbededFormValue.next(value);
  }

  setLayoutImageValue(value: IContentEditorComponentImageOption): void {
    this.layoutImageValue.next(value);
  }

  setLayoutImageFormValue(value: IContentEditorComponentImageOption): void {
    this.layoutImageFormValue.next(value);
  }

  setLayoutSettingBorderValue(value: ILayoutSettingBorder): void {
    this.layoutSettingBorderValue.next(value);
  }

  setLayoutSettingBorderFormValue(value: ILayoutSettingBorder): void {
    this.layoutSettingBorderFormValue.next(value);
  }

  setLayoutSettingShadowValue(value: ILayoutSettingShadow): void {
    this.layoutSettingShadowValue.next(value);
  }

  setLayoutSettingShadowFormValue(value: ILayoutSettingShadow): void {
    this.layoutSettingShadowFormValue.next(value);
  }

  setLayoutDesignEffectValue(value: ILayoutDesignEffect): void {
    this.layoutDesignEffectValue.next(value);
  }

  setLayoutDesignEffectFormValue(value: ILayoutDesignEffect): void {
    this.layoutDesignEffectFormValue.next(value);
  }

  setLayoutSettingHoverValue(value: ILayoutSettingHover): void {
    this.layoutSettingHoverValue.next(value);
  }

  setLayoutSettingHoverFormValue(value: ILayoutSettingHover): void {
    this.layoutSettingHoverFormValue.next(value);
  }

  setLayoutSettingAdvanceValue(value: ILayoutSettingAdvance): void {
    this.layoutSettingAdvanceValue.next(value);
  }

  setLayoutSettingAdvanceFormValue(value: ILayoutSettingAdvance): void {
    this.layoutSettingAdvanceFormValue.next(value);
  }

  setLayoutSettingBackgroundValue(value: ILayoutSettingBackground): void {
    this.layoutSettingBackgroundValue.next(value);
  }

  setLayoutSettingBackgroundFormValue(value: ILayoutSettingBackground): void {
    this.layoutSettingBackgroundFormValue.next(value);
  }

  setLayoutSettingCustomizeValue(value: ILayoutSettingCustomize): void {
    this.layoutSettingCustomizeValue.next(value);
  }

  setLayoutSettingCustomizeFormValue(value: ILayoutSettingCustomize): void {
    this.layoutSettingCustomizeFormValue.next(value);
  }

  setLayoutColumnValue(value: ILayoutColumn): void {
    this.layoutColumnValue.next(value);
  }

  setLayoutColumnFormValue(value: ILayoutColumn): void {
    this.layoutColumnFormValue.next(value);
  }

  setThemeSettingCustomizeValue(value: IThemeRenderingSettingCustomize): void {
    this.themeSettingCustomizeValue.next(value);
  }

  setThemeSettingCustomizeFormValue(value: IThemeRenderingSettingCustomize): void {
    this.themeSettingCustomizeFormValue.next(value);
  }

  setMediaGallerySettingValue(value: IMediaGallerySetting): void {
    this.mediaGallerySettingValue.next(value);
  }

  setMediaGallerySettingFormValue(value: IMediaGallerySetting): void {
    this.mediaGallerySettingFormValue.next(value);
  }

  setMediaGalleryControlValue(value: IMediaGalleryControl): void {
    this.mediaGalleryControlValue.next(value);
  }

  setMediaGalleryControlFormValue(value: IMediaGalleryControl): void {
    this.mediaGalleryControlFormValue.next(value);
  }

  setGeneralTextSettingValue(value: IGeneralText): void {
    this.generalTextSettingValue.next(value);
  }

  setGeneralTextSettingFormValue(value: IGeneralText): void {
    this.generalTextSettingFormValue.next(value);
  }

  setGeneralLinkSettingValue(value: IGeneralLink): void {
    this.generalLinkSettingValue.next(value);
  }

  setGeneralLinkSettingFormValue(value: IGeneralLink): void {
    this.generalLinkSettingFormValue.next(value);
  }

  setContentManageGeneralValue(value: IContentManagementGeneral): void {
    this.contentManageGeneralValue.next(value);
  }

  setContentManageGeneralFormValue(value: IContentManagementGeneral): void {
    this.contentManageGeneralFormValue.next(value);
  }

  setContentManageContentsValue(value: IContentManagementContents): void {
    this.contentManageContentsValue.next(value);
  }

  setContentManageContentsFormValue(value: IContentManagementContents): void {
    this.contentManageContentsFormValue.next(value);
  }

  setContentManageLandingValue(value: IContentManagementLanding): void {
    this.contentManageLandingValue.next(value);
  }

  setContentManageLandingFormValue(value: IContentManagementLanding): void {
    this.contentManageLandingFormValue.next(value);
  }

  setButtonSettingValue(value: IButtonSetting): void {
    this.buttonSettingValue.next(value);
  }

  setButtonSettingFormValue(value: IButtonSetting): void {
    this.buttonSettingFormValue.next(value);
  }

  setButtonBorderValue(value: IButtonBorder): void {
    this.buttonBorderValue.next(value);
  }

  setButtonBorderFormValue(value: IButtonBorder): void {
    this.buttonBorderFormValue.next(value);
  }

  setButtonTextValue(value: IButtonText): void {
    this.buttonTextValue.next(value);
  }

  setButtonTextFormValue(value: IButtonText): void {
    this.buttonTextFormValue.next(value);
  }

  setButtonHoverValue(value: IButtonHover): void {
    this.buttonHoverValue.next(value);
  }

  setButtonHoverFormValue(value: IButtonHover): void {
    this.buttonHoverFormValue.next(value);
  }

  setSiteId(siteId: string): void {
    this.siteId.next(siteId);
  }

  setMenuGroupId(menuGroupId: string): void {
    this.menuGroupId.next(menuGroupId);
  }

  setCreatePageStatus(status: boolean): void {
    this.createPageStatus.next(status);
  }

  setMenuSourceValue(value: IMenuRenderingSettingSource): void {
    this.menuSourceValue.next(value);
  }

  setMenuSourceFormValue(value: IMenuRenderingSettingSource): void {
    this.menuSourceFormValue.next(value);
  }

  setMenuLevelOneValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelOneValue.next(value);
  }

  setMenuLevelOneFormValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelOneFormValue.next(value);
  }

  setMenuLevelTwoValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelTwoValue.next(value);
  }

  setMenuLevelTwoFormValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelTwoFormValue.next(value);
  }

  setMenuLevelThreeValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelThreeValue.next(value);
  }

  setMenuLevelThreeFormValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelThreeFormValue.next(value);
  }

  setMenuLevelFourValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelFourValue.next(value);
  }

  setMenuLevelFourFormValue(value: IMenuRenderingSettingLevelOptions): void {
    this.menuLevelFourFormValue.next(value);
  }

  setMenuMobileHamburgerValue(value: IMenuRenderingSettingMobileHamburger): void {
    this.menuMobileHamburgerValue.next(value);
  }

  setMenuMobileHamburgerFormValue(value: IMenuRenderingSettingMobileHamburger): void {
    this.menuMobileHamburgerFormValue.next(value);
  }

  setMenuMobileIconValue(value: IMenuRenderingSettingMobileIcon): void {
    this.menuMobileIconValue.next(value);
  }

  setMenuMobileIconFormValue(value: IMenuRenderingSettingMobileIcon): void {
    this.menuMobileIconFormValue.next(value);
  }

  setMenuSettingStickyValue(value: IMenuRenderingSettingSettingSticky): void {
    this.menuSettingStickyValue.next(value);
  }

  setMenuSettingStickyFormValue(value: IMenuRenderingSettingSettingSticky): void {
    this.menuSettingStickyFormValue.next(value);
  }

  setMenuSettingAnimationValue(value: IMenuRenderingSettingSettingAnimation): void {
    this.menuSettingAnimationValue.next(value);
  }

  setMenuSettingAnimationFormValue(value: IMenuRenderingSettingSettingAnimation): void {
    this.menuSettingAnimationFormValue.next(value);
  }

  setMenuSettingAlignmentValue(value: IMenuRenderingSettingSettingAlignment): void {
    this.menuSettingAlignmentValue.next(value);
  }

  setMenuSettingAlignmentFormValue(value: IMenuRenderingSettingSettingAlignment): void {
    this.menuSettingAlignmentFormValue.next(value);
  }

  setMenuSettingStyleValue(value: IMenuRenderingSettingSettingStyle): void {
    this.menuSettingStyleValue.next(value);
  }

  setMenuSettingStyleFormValue(value: IMenuRenderingSettingSettingStyle): void {
    this.menuSettingStyleFormValue.next(value);
  }

  setMenuSettingIconValue(value: IMenuRenderingSettingSettingIcon): void {
    this.menuSettingIconValue.next(value);
  }

  setMenuSettingIconFormValue(value: IMenuRenderingSettingSettingIcon): void {
    this.menuSettingIconFormValue.next(value);
  }

  setMenuSettingMegaValue(value: IMenuRenderingSettingSettingMega): void {
    this.menuSettingMegaValue.next(value);
  }

  setMenuSettingMegaFormValue(value: IMenuRenderingSettingSettingMega): void {
    this.menuSettingMegaFormValue.next(value);
  }

  sidebarElementHandler(element: ESidebarElement, toggleData: ISidebarElement[], isUndoRedo?: boolean): ISidebarElement[] {
    const foundItem = toggleData.find((item) => item.title === element);
    if (foundItem) {
      toggleData.forEach((item) => {
        if (item.title !== foundItem.title) item.status = false;
      });
      isUndoRedo ? (foundItem.status = true) : (foundItem.status = !foundItem.status);
    }
    return toggleData;
  }
}
