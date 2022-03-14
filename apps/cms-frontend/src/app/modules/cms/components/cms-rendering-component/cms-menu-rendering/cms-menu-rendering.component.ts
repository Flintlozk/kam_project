import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { AfterViewInit, Attribute, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, ViewRef } from '@angular/core';
import {
  IThemeOption,
  IRenderingComponentData,
  ColumnType,
  IMenuRenderingSetting,
  MenuGenericType,
  EnumLanguageCultureUI,
  IMenuRenderingSettingSource,
  IMenuHTML,
  IMenuRenderingSettingLevelOptions,
  IMenuRenderingSettingMobileHamburger,
  IMenuRenderingSettingMobileIcon,
  IMenuRenderingSettingSettingSticky,
  IMenuRenderingSettingSettingAnimation,
  IMenuRenderingSettingSettingAlignment,
  IMenuRenderingSettingSettingStyle,
  IMenuRenderingSettingSettingIcon,
  IMenuRenderingSettingSettingMega,
  IMenuCssJs,
  menuDefaultSettings,
} from '@reactor-room/cms-models-lib';
import { Children, clearDragRef, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { EMPTY, Subject, Subscription, timer } from 'rxjs';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { catchError, debounceTime, distinctUntilChanged, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CONTENT_CONTAINER, ContentContainer } from '../cms-content-container-rendering/token';
import { FOOTER_CONTAINER, FooterContainer } from '../cms-footer-container-rendering/token';
import { HEADER_CONTAINER, HeaderContainer } from '../cms-header-container-rendering/token';
import { PARENT_LAYOUT_CONTAINER, ParentLayoutContainer } from '../cms-layout-rendering/token';
import { Mixin } from 'ts-mixer';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { WebsiteService } from '../../../services/website.service';
import { CmsCommonService } from '../../../services/cms-common.service';
import { ICmsLanguageSwitch } from '../../common/cms-language-switch/cms-language-switch.model';
import { CmsSiteMenuPageService } from '../../../services/cms-site-menu-page.service';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { CmsPreviewService } from '../../../services/cms-preview.service';
import { environment } from 'apps/cms-frontend/src/environments/environment';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
@Component({
  selector: 'cms-next-cms-menu-rendering',
  templateUrl: './cms-menu-rendering.component.html',
  styleUrls: ['./cms-menu-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsMenuRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsMenuRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, AfterViewInit, OnDestroy {
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public themeOption: IThemeOption;
  public onFocus = false;
  public componentType = 'CmsMenuRenderingComponent';
  private destroy$ = new Subject();
  isChildEnter = false;
  menuData = deepCopy(menuDefaultSettings);
  safeHTML: SafeHtml = null;
  safeCSS: SafeHtml = null;
  safeJs: string;
  webPageID: string;
  currentCultureUI: EnumLanguageCultureUI;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  menuSourceSubscription: Subscription;
  menuLevelOneSubscription: Subscription;
  menuLevelTwoSubscription: Subscription;
  menuLevelThreeSubscription: Subscription;
  menuLevelFourSubscription: Subscription;
  menuMobileHamburgerSubscription: Subscription;
  menuMobileIconSubscription: Subscription;
  menuSettingStickySubscription: Subscription;
  menuSettingAnimationSubscription: Subscription;
  menuSettingAlignmentSubscription: Subscription;
  menuSettingStyleSubscription: Subscription;
  menuSettingIconSubscription: Subscription;
  menuSettingMegaSubscription: Subscription;
  debouceTime = timer(2000).pipe(takeUntil(this.destroy$));
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  menuDataOnTrigger: boolean;
  isThemeGlobal: boolean;
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private sanitizer: DomSanitizer,
    private cmsCommonService: CmsCommonService,
    private siteMenuPageService: CmsSiteMenuPageService,
    private websiteService: WebsiteService,
    private snackBar: MatSnackBar,
    private router: Router,
    private previewService: CmsPreviewService,
    public cmsPublishService: CmsPublishService,
    @Optional() @Inject(PARENT_LAYOUT_CONTAINER) private parentLayoutContainer: ParentLayoutContainer,
    @Optional() @Inject(CONTENT_CONTAINER) private contentContainer: ContentContainer,
    @Optional() @Inject(HEADER_CONTAINER) private headerContainer: HeaderContainer,
    @Optional() @Inject(FOOTER_CONTAINER) private footerContainer: FooterContainer,
    private undoRedoService: UndoRedoService,
  ) {
    super(el, sidebarService, cmsPublishService);
  }

  ngOnInit(): void {
    this.renderingComponentData$
      .pipe(
        takeUntil(this.destroy$),
        tap((renderingData) => {
          if (renderingData?.themeOption) {
            this.themeOption = renderingData.themeOption;
            const regex = new RegExp('^[0-9a-fA-F]{24}$');
            if (!regex.test(renderingData.themeOption.themeIdentifier)) {
              this.isThemeGlobal = true;
            }
          }
          this.el.nativeElement.classList.add('rendering-item');
          let { options } = renderingData;
          if (options) {
            options = options as IMenuRenderingSetting;
            const { source, level, setting, mobile } = options;
            if (source) this.menuData.source = source;
            if (level) this.menuData.level = level;
            if (setting) this.menuData.setting = setting;
            if (mobile) this.menuData.mobile = mobile;
            if (source && level && setting && mobile) {
              this.menuDataOnTrigger = true;
              this.onSetLanguageCultureUI();
            }
          }
          const { commonSettings } = renderingData;
          if (commonSettings) {
            if (commonSettings.border) this.performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
            if (commonSettings.shadow) this.performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
            if (commonSettings.advance) this.performSetLayoutSettingAdvanceValueToElementStyle(commonSettings.advance);
            if (commonSettings.background) this.performSetLayoutSettingBackgroundValueToElementStyle(commonSettings.background);
            if (commonSettings.customize) this.performSetLayoutSettingCustomizeValueToElementStyle(commonSettings.customize);
            if (commonSettings.hover) this.performSetLayoutSettingHoverValueToElementStyle(commonSettings.hover);
          }
        }),
      )
      .subscribe();
    setTimeout(() => {
      this.initComponent();
      this.viewRef = getRootViewRef(this);
      if (!this.menuDataOnTrigger) {
        this.cmsPublishService.newIdUpdated$.pipe(takeUntil(this.destroy$)).subscribe((val) => {
          const elementId = this.el.nativeElement.getAttribute('id');
          if (val === elementId) this.onSetLanguageCultureUI();
        });
      }
    }, 0);

    this.webPageID = this.router.routerState.snapshot.url.split('/').pop();
  }

  ngAfterViewInit(): void {
    this.onTriggerMenuHTML();
    this.onTriggerMenuCssJs();
  }

  onTriggerMenuHTML(): void {
    this.websiteService.$triggerMenuHTML
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          if (this.currentCultureUI) {
            this.onGetMenuHTML(this.menuData.source);
            this.websiteService.$triggerMenuCssJs.next(null);
          }
        }),
      )
      .subscribe();
  }

  onTriggerMenuCssJs(): void {
    this.websiteService.$triggerMenuCssJs
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.onGetMenuCssJs();
        }),
      )
      .subscribe();
  }

  excuseJs() {
    this.previewService.getIsPreviewMode
      .pipe(
        switchMap((isPreviewMode) => {
          if (!isPreviewMode) {
            setTimeout(() => {
              eval(this.safeJs.replace('export', ''));
            }, 0);
            return EMPTY;
          }
          return this.previewService.getPreviewMode;
        }),
        tap(() => {
          setTimeout(() => {
            eval(this.safeJs);
          }, 0);
        }),
      )
      .subscribe();
  }

  onSetLanguageCultureUI(time = 0): void {
    this.cmsCommonService.getCmsLanguageSwitch
      .pipe(
        debounceTime(time),
        takeUntil(this.destroy$),
        tap((cmsLanguageSwitch: ICmsLanguageSwitch) => {
          if (cmsLanguageSwitch) {
            this.currentCultureUI = cmsLanguageSwitch.cultureUI;
            this.websiteService.$triggerMenuHTML.next(null);
          }
        }),
      )
      .subscribe();
  }

  onGetMenuHTML(menuSource: IMenuRenderingSettingSource): void {
    const { sourceType, parentMenuId, menuGroupId } = menuSource;
    const menuHTML: IMenuHTML = {
      sourceType,
      parentMenuId,
      menuGroupId,
      cultureUI: this.currentCultureUI,
    };
    this.siteMenuPageService
      .getMenuHTML(menuHTML)
      .pipe(
        tap((html: string) => {
          if (html) {
            this.safeHTML = this.getSafeHTMLRendering(html);
            this.removeHrefElementFromHTML();
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => onGetMenuHTML :>> ', e);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  onGetMenuCssJs(): void {
    const id = this.el.nativeElement.getAttribute('id');
    const isFromTheme = this.themeOption ? true : false;
    this.siteMenuPageService
      .getMenuCssJs(this.webPageID, id, isFromTheme)
      .pipe(
        tap((style: IMenuCssJs) => {
          if (style) {
            this.safeCSS = this.getSafeCSSRendering(style.css);
            this.safeJs = style.js;
            this.excuseJs();
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => onGetMenuCSSJs :>> ', e);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  removeHrefElementFromHTML(): void {
    const htmlElement = this.el.nativeElement;
    const aTagElements = htmlElement.getElementsByTagName('A') as HTMLCollection;
    if (!aTagElements) return;
    setTimeout(() => {
      Array.from(aTagElements).forEach((aTagElement: HTMLElement) => {
        aTagElement.removeAttribute('href');
      });
    }, 0);
  }

  initComponent(): void {
    const dropListRef = this.getCurrentDropZoneListRef();
    const { viewRefAndElementRefAndComponents, dragRefs } = dropListRef.data;
    const viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent = {
      component: this,
    };
    this.insertComponentRef(viewRefAndElementRefAndComponents, viewRefAndElementRefAndComponents.length, viewRefAndElementRefAndComponent);
    const dragRef = this.createAndInsertDragRefToContainer(this.el, dragRefs.length, dropListRef);
    this.dragRef = dragRef;
    this.dragRef.data.component = this;
    if (this.themeOption)
      if (this.isThemeGlobal) {
        this.dragRef.disabled = true;
      }
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: null, genericType: MenuGenericType.MENU };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    return dragRef;
  }

  getCurrentDropZoneListRef(): DropListRef {
    if (this.parentLayoutContainer) {
      switch (this.column) {
        case ColumnType.COLUMN_1:
          return this.parentLayoutContainer.layoutDropListRef1;
        case ColumnType.COLUMN_2:
          return this.parentLayoutContainer.layoutDropListRef2;
        case ColumnType.COLUMN_3:
          return this.parentLayoutContainer.layoutDropListRef3;
        case ColumnType.COLUMN_4:
          return this.parentLayoutContainer.layoutDropListRef4;
        default:
          return this.parentLayoutContainer.layoutDropListRef1;
      }
    } else if (this.headerContainer) {
      //TODO: Define Primary Menu as Property
      this.el.nativeElement.classList.add('primary-menu');
      return this.cmsEditService.headerDropListRef;
    } else if (this.footerContainer) return this.cmsEditService.footerDropListRef;
    else if (this.contentContainer) return this.cmsEditService.dropZoneDropListRef;
    else return null;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    clearDragRef(this.dragRef);
  }

  getSafeHTMLRendering(type: string): SafeHtml {
    return this.sanitizer.bypassSecurityTrustHtml(type) as SafeHtml;
  }

  getSafeCSSRendering(css: string): SafeHtml {
    const type = `<style>${css}</style>`;
    return this.sanitizer.bypassSecurityTrustHtml(type) as SafeHtml;
  }

  onMenuFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onMenuFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.MENU_CUSTOM);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setMenuSourceDataToFormValue();
      this.setMenuLevelOneDataToFormValue();
      this.setMenuLevelTwoDataToFormValue();
      this.setMenuLevelThreeDataToFormValue();
      this.setMenuLevelFourDataToFormValue();
      this.setMenuMobileHamburgerDataToFormValue();
      this.setMenuMobileIconDataToFormValue();
      this.setMenuSettingStickyDataToFormValue();
      this.setMenuSettingAnimationDataToFormValue();
      this.setMenuSettingAlignmentDataToFormValue();
      this.setMenuSettingStyleDataToFormValue();
      this.setMenuSettingIconDataToFormValue();
      this.setMenuSettingMegaDataToFormValue();
    }, 0);
  }

  onMenuFocusComponent(component: CmsMenuRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setFormValueToMenuSourceData();
    this.setFormValueToMenuLevelOneData();
    this.setFormValueToMenuLevelTwoData();
    this.setFormValueToMenuLevelThreeData();
    this.setFormValueToMenuLevelFourData();
    this.setFormValueToMenuMobileHamburgerData();
    this.setFormValueToMenuMobileIconData();
    this.setFormValueToMenuSettingStickyData();
    this.setFormValueToMenuSettingAnimationData();
    this.setFormValueToMenuSettingAlignmentData();
    this.setFormValueToMenuSettingStyleData();
    this.setFormValueToMenuSettingIconData();
    this.setFormValueToMenuSettingMegaData();
  }

  saveMenuSourceData(): void {
    this.sidebarService.setMenuSourceValue(null);
  }

  setMenuSourceDataToFormValue(): void {
    this.sidebarService.setMenuSourceFormValue(this.menuData.source);
  }

  setFormValueToMenuSourceData(): void {
    if (this.menuSourceSubscription) return;
    this.menuSourceSubscription = this.sidebarService.getMenuSourceValue
      .pipe(
        startWith(this.menuData.source),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSource, IMenuRenderingSettingSource]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.source = newVaLue;
            this.websiteService.$triggerMenuHTML.next(null);
          }
        }),
      )
      .subscribe();
  }

  saveMenuLevelOneData(): void {
    this.sidebarService.setMenuLevelOneValue(null);
  }

  saveMenuLevelTwoData(): void {
    this.sidebarService.setMenuLevelTwoValue(null);
  }

  saveMenuLevelThreeData(): void {
    this.sidebarService.setMenuLevelThreeValue(null);
  }

  saveMenuLevelFourData(): void {
    this.sidebarService.setMenuLevelFourValue(null);
  }

  setMenuLevelOneDataToFormValue(): void {
    this.sidebarService.setMenuLevelOneFormValue(this.menuData.level.one);
  }

  setFormValueToMenuLevelOneData(): void {
    if (this.menuLevelOneSubscription) return;
    this.menuLevelOneSubscription = this.sidebarService.getMenuLevelOneValue
      .pipe(
        startWith(this.menuData.level.one),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingLevelOptions, IMenuRenderingSettingLevelOptions]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.level.one = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  setMenuLevelTwoDataToFormValue(): void {
    this.sidebarService.setMenuLevelTwoFormValue(this.menuData.level.two);
  }

  setFormValueToMenuLevelTwoData(): void {
    if (this.menuLevelTwoSubscription) return;
    this.menuLevelTwoSubscription = this.sidebarService.getMenuLevelTwoValue
      .pipe(
        startWith(this.menuData.level.two),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingLevelOptions, IMenuRenderingSettingLevelOptions]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.level.two = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  setMenuLevelThreeDataToFormValue(): void {
    this.sidebarService.setMenuLevelThreeFormValue(this.menuData.level.three);
  }

  setFormValueToMenuLevelThreeData(): void {
    if (this.menuLevelThreeSubscription) return;
    this.menuLevelThreeSubscription = this.sidebarService.getMenuLevelThreeValue
      .pipe(
        startWith(this.menuData.level.three),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingLevelOptions, IMenuRenderingSettingLevelOptions]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.level.three = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  setMenuLevelFourDataToFormValue(): void {
    this.sidebarService.setMenuLevelFourFormValue(this.menuData.level.four);
  }

  setFormValueToMenuLevelFourData(): void {
    if (this.menuLevelFourSubscription) return;
    this.menuLevelFourSubscription = this.sidebarService.getMenuLevelFourValue
      .pipe(
        startWith(this.menuData.level.four),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingLevelOptions, IMenuRenderingSettingLevelOptions]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.level.four = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuMobileHamburgerData(): void {
    this.sidebarService.setMenuMobileHamburgerValue(null);
  }

  setMenuMobileHamburgerDataToFormValue(): void {
    this.sidebarService.setMenuMobileHamburgerFormValue(this.menuData.mobile.hamburger);
  }

  setFormValueToMenuMobileHamburgerData(): void {
    if (this.menuMobileHamburgerSubscription) return;
    this.menuMobileHamburgerSubscription = this.sidebarService.getMenuMobileHamburgerValue
      .pipe(
        startWith(this.menuData.mobile.hamburger),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingMobileHamburger, IMenuRenderingSettingMobileHamburger]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.mobile.hamburger = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuMobileIconData(): void {
    this.sidebarService.setMenuMobileIconValue(null);
  }

  setMenuMobileIconDataToFormValue(): void {
    this.sidebarService.setMenuMobileIconFormValue(this.menuData.mobile.featureIcon);
  }

  setFormValueToMenuMobileIconData(): void {
    if (this.menuMobileIconSubscription) return;
    this.menuMobileIconSubscription = this.sidebarService.getMenuMobileIconValue
      .pipe(
        startWith(this.menuData.mobile.featureIcon),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingMobileIcon, IMenuRenderingSettingMobileIcon]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.mobile.featureIcon = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuSettingStickyData(): void {
    this.sidebarService.setMenuSettingStickyValue(null);
  }

  setMenuSettingStickyDataToFormValue(): void {
    const sticky: IMenuRenderingSettingSettingSticky = {
      sticky: this.menuData.setting.sticky,
    };
    this.sidebarService.setMenuSettingStickyFormValue(sticky);
  }

  setFormValueToMenuSettingStickyData(): void {
    if (this.menuSettingStickySubscription) return;
    this.menuSettingStickySubscription = this.sidebarService.getMenuSettingStickyValue
      .pipe(
        startWith(this.menuData.setting.sticky),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSettingSticky, IMenuRenderingSettingSettingSticky]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.setting.sticky = newVaLue.sticky;
            this.cmsPublishService.savingTrigger$.next(newVaLue.sticky);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuSettingAnimationData(): void {
    this.sidebarService.setMenuSettingAnimationValue(null);
  }

  setMenuSettingAnimationDataToFormValue(): void {
    const animation: IMenuRenderingSettingSettingAnimation = {
      animation: this.menuData.setting.animation,
    };
    this.sidebarService.setMenuSettingAnimationFormValue(animation);
  }

  setFormValueToMenuSettingAnimationData(): void {
    if (this.menuSettingAnimationSubscription) return;
    this.menuSettingAnimationSubscription = this.sidebarService.getMenuSettingAnimationValue
      .pipe(
        startWith(this.menuData.setting.animation),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSettingAnimation, IMenuRenderingSettingSettingAnimation]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.setting.animation = newVaLue.animation;
            this.cmsPublishService.savingTrigger$.next(newVaLue.animation);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuSettingAlignmentData(): void {
    this.sidebarService.setMenuSettingAlignmentValue(null);
  }

  setMenuSettingAlignmentDataToFormValue(): void {
    const alignment: IMenuRenderingSettingSettingAlignment = {
      alignment: this.menuData.setting.alignment,
    };
    this.sidebarService.setMenuSettingAlignmentFormValue(alignment);
  }

  setFormValueToMenuSettingAlignmentData(): void {
    if (this.menuSettingAlignmentSubscription) return;
    this.menuSettingAlignmentSubscription = this.sidebarService.getMenuSettingAlignmentValue
      .pipe(
        startWith(this.menuData.setting.alignment),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSettingAlignment, IMenuRenderingSettingSettingAlignment]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.setting.alignment = newVaLue.alignment;
            this.cmsPublishService.savingTrigger$.next(newVaLue.alignment);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuSettingStyleData(): void {
    this.sidebarService.setMenuSettingStyleValue(null);
  }

  setMenuSettingStyleDataToFormValue(): void {
    const style: IMenuRenderingSettingSettingStyle = {
      style: this.menuData.setting.style,
    };
    this.sidebarService.setMenuSettingStyleFormValue(style);
  }

  setFormValueToMenuSettingStyleData(): void {
    if (this.menuSettingStyleSubscription) return;
    this.menuSettingStyleSubscription = this.sidebarService.getMenuSettingStyleValue
      .pipe(
        startWith(this.menuData.setting.style),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSettingStyle, IMenuRenderingSettingSettingStyle]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.setting.style = newVaLue.style;
            this.cmsPublishService.savingTrigger$.next(newVaLue.style);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuSettingIconData(): void {
    this.sidebarService.setMenuSettingIconValue(null);
  }

  setMenuSettingIconDataToFormValue(): void {
    this.sidebarService.setMenuSettingIconFormValue(this.menuData.setting.icon);
  }

  setFormValueToMenuSettingIconData(): void {
    if (this.menuSettingIconSubscription) return;
    this.menuSettingIconSubscription = this.sidebarService.getMenuSettingIconValue
      .pipe(
        startWith(this.menuData.setting.icon),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSettingIcon, IMenuRenderingSettingSettingIcon]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.setting.icon = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  saveMenuSettingMegaData(): void {
    this.sidebarService.setMenuSettingMegaValue(null);
  }

  setMenuSettingMegaDataToFormValue(): void {
    this.sidebarService.setMenuSettingMegaFormValue(this.menuData.setting.mega);
  }

  setFormValueToMenuSettingMegaData(): void {
    if (this.menuSettingMegaSubscription) return;
    this.menuSettingMegaSubscription = this.sidebarService.getMenuSettingMegaValue
      .pipe(
        startWith(this.menuData.setting.mega),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMenuRenderingSettingSettingMega, IMenuRenderingSettingSettingMega]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.menuData.setting.mega = newVaLue;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            this.onGetMenuCssJsAfterSave();
          }
        }),
      )
      .subscribe();
  }

  onGetMenuCssJsAfterSave(): void {
    this.debouceTime
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.onGetMenuCssJs();
        }),
      )
      .subscribe();
  }

  onRemoveCurrentComponent(): void {
    this.cmsEditService.onRemoveCurrentComponent(this.dragRef).subscribe();
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }
}
