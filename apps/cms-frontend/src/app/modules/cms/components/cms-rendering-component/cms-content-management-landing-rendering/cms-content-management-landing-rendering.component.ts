import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { AfterViewInit, Attribute, Component, ContentChildren, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, QueryList, ViewRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { DomSanitizer, SafeHtml } from '@angular/platform-browser';
import { Router } from '@angular/router';
import {
  ColumnType,
  IContentEditor,
  IContentManagementLanding,
  ILandingContentManagementRenderingSetting,
  IRenderingComponentData,
  IThemeOption,
  MenuGenericType,
} from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { environment } from 'apps/cms-frontend/src/environments/environment';
import { Subject, Subscription } from 'rxjs';
import { catchError, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { ESidebarMode, ELandingMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsContentEditService } from '../../../services/cms-content-edit.service';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { WebsiteService } from '../../../services/website.service';
import { CONTENT_CONTAINER, ContentContainer } from '../cms-content-container-rendering/token';
import { CmsContentEditorRenderingComponent } from '../cms-content-editor/cms-content-editor-rendering/cms-content-editor-rendering.component';
import { FOOTER_CONTAINER, FooterContainer } from '../cms-footer-container-rendering/token';
import { HEADER_CONTAINER, HeaderContainer } from '../cms-header-container-rendering/token';
import { PARENT_LAYOUT_CONTAINER, ParentLayoutContainer } from '../cms-layout-rendering/token';

@Component({
  selector: 'cms-next-cms-content-management-landing-rendering',
  templateUrl: './cms-content-management-landing-rendering.component.html',
  styleUrls: ['./cms-content-management-landing-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentManagementLandingRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsContentManagementLandingRenderingComponent
  extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective)
  implements OnInit, AfterViewInit, OnDestroy
{
  private destroy$ = new Subject();
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public onFocus = false;
  public componentType = 'CmsContentManagementLandingRenderingComponent';
  public themeOption: IThemeOption;
  @Input() public type: string;
  safeCSS: SafeHtml = null;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  @ContentChildren(Children) public contentEditorChildren!: QueryList<CmsContentEditorRenderingComponent>;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  contentManagementLandingValue: ILandingContentManagementRenderingSetting = {
    landing: null,
    pattern: null,
  };
  contentManageLandingSubscription: Subscription;
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    public cmsPublishService: CmsPublishService,
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private cmsContentEditService: CmsContentEditService,
    private router: Router,
    private snackBar: MatSnackBar,
    private websiteService: WebsiteService,
    private sanitizer: DomSanitizer,
    @Optional() @Inject(PARENT_LAYOUT_CONTAINER) private parentLayoutContainer: ParentLayoutContainer,
    @Optional() @Inject(CONTENT_CONTAINER) private contentContainer: ContentContainer,
    @Optional() @Inject(HEADER_CONTAINER) private headerContainer: HeaderContainer,
    @Optional() @Inject(FOOTER_CONTAINER) private footerContainer: FooterContainer,
  ) {
    super(el, sidebarService, cmsPublishService);
  }

  ngOnInit(): void {
    this.sidebarService.setLandingMode(ELandingMode.CONTENT);
    this.renderingComponentData$
      .pipe(
        takeUntil(this.destroy$),
        tap((renderdingData) => {
          if (renderdingData) {
            this.el.nativeElement.classList.add('rendering-item');
            let { options } = renderdingData;
            if (options) {
              options = options as ILandingContentManagementRenderingSetting;
              const { pattern, landing } = options;
              if (landing) {
                this.sidebarService.contentManagementLandingValue$.next(landing);
                this.contentManagementLandingValue.landing = landing;
              }
              if (pattern) {
                this.contentManagementLandingValue.pattern = pattern;
                this.safeCSS = this.getSafeCSSRendering(pattern.css);
              }
            }
            const { commonSettings } = renderdingData;
            if (commonSettings) {
              if (commonSettings.border) this.performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
              if (commonSettings.shadow) this.performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
              if (commonSettings.hover) this.performSetLayoutSettingHoverValueToElementStyle(commonSettings.hover);
              if (commonSettings.advance) this.performSetLayoutSettingAdvanceValueToElementStyle(commonSettings.advance);
              if (commonSettings.background) this.performSetLayoutSettingBackgroundValueToElementStyle(commonSettings.background);
              if (commonSettings.customize) this.performSetLayoutSettingCustomizeValueToElementStyle(commonSettings.customize);
            }
            this.onFocusEvent();
          }
        }),
      )
      .subscribe();
    setTimeout(() => {
      this.initComponent();
      this.viewRef = getRootViewRef(this);
    }, 0);
  }

  ngAfterViewInit(): void {
    const route = this.router.url.split('/');
    const contentId = route.pop();
    this.cmsContentEditService
      .getContents(contentId)
      .pipe(
        takeUntil(this.destroy$),
        tap((contents: IContentEditor) => {
          this.cmsContentEditService.$contents.next(contents);
        }),
        catchError((e) => {
          this.showUnexpectedError();
          throw e;
        }),
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

  getSafeCSSRendering(css: string): SafeHtml {
    const type = `<style>${css}</style>`;
    return this.sanitizer.bypassSecurityTrustHtml(type) as SafeHtml;
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
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: this.type, genericType: MenuGenericType.CONTENT_MANAGEMENT_LANDING };
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
    } else if (this.headerContainer) return this.cmsEditService.headerDropListRef;
    else if (this.footerContainer) return this.cmsEditService.footerDropListRef;
    else if (this.contentContainer) return this.cmsEditService.dropZoneDropListRef;
    else return null;
  }

  onFocusEvent(): void {
    if (this.onFocus) return;
    this.onFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_CONTENT_MANAGEMENT_LANDING);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setContentManageLandingToFormValue();
    }, 0);
  }

  onFocusComponent(component: CmsContentManagementLandingRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setFormValueToContentManageLanding();
  }

  saveContentManageLanding(): void {
    this.sidebarService.setContentManageLandingValue(null);
  }

  setFormValueToContentManageLanding(): void {
    if (this.contentManageLandingSubscription) return;
    this.contentManageLandingSubscription = this.sidebarService.getContentManageLandingValue
      .pipe(
        startWith(this.contentManagementLandingValue.landing),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentManagementLanding, IContentManagementLanding]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.contentManagementLandingValue.landing = newVaLue;
            const isPatternChange = oldValue._id !== newVaLue._id;
            this.onUpdateComponentLandingPageOption(isPatternChange);
            this.sidebarService.contentManagementLandingValue$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  onUpdateComponentLandingPageOption(isPatternChange: boolean) {
    const route = this.router.url;
    const routeArray = route.split('/');
    const previousWebPageID = routeArray[routeArray.length - 3];
    const componentId = routeArray[routeArray.length - 2];
    if (previousWebPageID && componentId) {
      const landingString = JSON.stringify(this.contentManagementLandingValue.landing);
      this.websiteService
        .updateComponentLandingPageOption(landingString, previousWebPageID, componentId)
        .pipe(
          takeUntil(this.destroy$),
          tap((result) => {
            if (result.status === 200) {
              if (isPatternChange) {
                this.router.navigate([this.router.url]);
              }
            }
          }),
          catchError((e) => {
            this.showUnexpectedError();
            throw e;
          }),
        )
        .subscribe();
    }
  }

  setContentManageLandingToFormValue(): void {
    this.sidebarService.setContentManageLandingFormValue(this.contentManagementLandingValue.landing);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
