import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Attribute, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, ViewRef } from '@angular/core';
import {
  ColumnType,
  contentManagementDefaultSetting,
  IContentEditor,
  IContentManagementContents,
  IContentManagementGeneral,
  IContentManagementLanding,
  IContentManagementRenderingSetting,
  IRenderingComponentData,
  IThemeOption,
  IWebPagePage,
  MenuGenericType,
} from '@reactor-room/cms-models-lib';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, clearDragRef, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { isEqual, sortBy } from 'lodash';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
// eslint-disable-next-line max-len
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { ParentLayoutContainer, PARENT_LAYOUT_CONTAINER } from '../cms-layout-rendering/token';
import { ContentContainer, CONTENT_CONTAINER } from '../cms-content-container-rendering/token';
import { HEADER_CONTAINER, HeaderContainer } from '../cms-header-container-rendering/token';
import { FOOTER_CONTAINER, FooterContainer } from '../cms-footer-container-rendering/token';
import { environment } from 'apps/cms-frontend/src/environments/environment';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsContentEditService } from '../../../services/cms-content-edit.service';
import { HttpErrorResponse } from '@angular/common/http';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { MatSnackBar } from '@angular/material/snack-bar';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { ContentPatternsService } from '../../../services/content-patterns.service';
import { Router } from '@angular/router';
import { CmsSiteMenuPageService } from '../../../services/cms-site-menu-page.service';

@Component({
  selector: 'cms-next-cms-content-management-rendering',
  templateUrl: './cms-content-management-rendering.component.html',
  styleUrls: ['./cms-content-management-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsContentManagementRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsContentManagementRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, OnDestroy {
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public onFocus = false;
  public componentType = 'CmsContentManagementRenderingComponent';
  public themeOption: IThemeOption;
  private destroy$ = new Subject();
  isChildEnter = false;
  contentManagementValue = deepCopy(contentManagementDefaultSetting);
  contentManageGeneralSubscription: Subscription;
  contentManageContentsSubscription: Subscription;
  contentManageLandingSubscription: Subscription;
  contentCategoryData: IContentEditor[] = [];
  changeDetectorTrigger: boolean;
  changeDetectorPatternTrigger: boolean;

  @Input() public type: string;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    public cmsPublishService: CmsPublishService,
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private cmsContentEditService: CmsContentEditService,
    private snackBar: MatSnackBar,
    private contentPatternService: ContentPatternsService,
    private router: Router,
    private webpageService: CmsSiteMenuPageService,
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
        tap((renderdingData) => {
          if (renderdingData) {
            this.el.nativeElement.classList.add('rendering-item');
            let { options } = renderdingData;
            if (options) {
              options = options as IContentManagementRenderingSetting;
              const { general, contents, landing } = options;
              if (general) this.contentManagementValue.general = general;
              if (contents) this.contentManagementValue.contents = contents;
              if (landing) this.contentManagementValue.landing = landing;
              const maxPrimaryContent = general.pattern.patternStyle?.primary?.maxContent ? general.pattern.patternStyle?.primary?.maxContent : 0;
              const maxSecondaryContent = general.pattern.patternStyle?.secondary?.maxContent ? general.pattern.patternStyle?.secondary?.maxContent : 0;
              const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
              this.getCategoryContentsData(contents.categoryIds, maxItemPerRow);
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
          }
        }),
      )
      .subscribe();
    setTimeout(() => {
      this.initComponent();
      this.viewRef = getRootViewRef(this);
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
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: this.type, genericType: MenuGenericType.CONTENT_MANAGEMENT };
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    clearDragRef(this.dragRef);
  }

  initSetting(): void {
    this.contentPatternService
      .getContentPattern(this.type)
      .pipe(
        takeUntil(this.destroy$),
        tap((pattern) => {
          if (pattern) {
            this.contentManagementValue.general.pattern = pattern;
            const maxPrimaryContent = this.contentManagementValue.general.pattern.patternStyle?.primary?.maxContent
              ? this.contentManagementValue.general.pattern.patternStyle?.primary?.maxContent
              : 0;
            const maxSecondaryContent = this.contentManagementValue.general.pattern.patternStyle?.secondary?.maxContent
              ? this.contentManagementValue.general.pattern.patternStyle?.secondary?.maxContent
              : 0;
            const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
            this.getCategoryContentsData([], maxItemPerRow);
          }
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {
          this.showUnexpectedError();
        },
        complete: () => {
          console.log('COMPLETE');
        },
      });
  }

  onContentManagementFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onContentManagementFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_CONTENT_MANAGEMENT);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setContentManageGeneralToFormValue();
      this.setContentManageContentsToFormValue();
      this.setContentManageLandingToFormValue();
    }, 0);
  }

  onContentManagementFocusComponent(component: CmsContentManagementRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setFormValueToContentManageGeneral();
    this.setFormValueToContentManageContents();
    this.setFormValueToContentManageLanding();
  }

  saveContentManageGeneral(): void {
    this.sidebarService.setContentManageGeneralValue(null);
  }

  setFormValueToContentManageGeneral(): void {
    if (this.contentManageGeneralSubscription) return;
    this.contentManageGeneralSubscription = this.sidebarService.getContentManageGeneralValue
      .pipe(
        startWith(this.contentManagementValue.general),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentManagementGeneral, IContentManagementGeneral]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.contentManagementValue.general = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            if (oldValue.pattern !== newVaLue.pattern) {
              this.changeDetectorPatternTrigger = !this.changeDetectorPatternTrigger;
              const maxPrimaryContent = newVaLue.pattern.patternStyle?.primary?.maxContent ? newVaLue.pattern.patternStyle?.primary?.maxContent : 0;
              const maxSecondaryContent = newVaLue.pattern.patternStyle?.secondary?.maxContent ? newVaLue.pattern.patternStyle?.secondary?.maxContent : 0;
              const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
              this.getCategoryContentsData(this.contentManagementValue.contents.categoryIds, maxItemPerRow);
            }
          }
        }),
      )
      .subscribe();
  }

  setContentManageLandingToFormValue(): void {
    this.sidebarService.setContentManageLandingFormValue(this.contentManagementValue.landing);
  }

  saveContentManageLanding(): void {
    this.sidebarService.setContentManageLandingValue(null);
  }

  setFormValueToContentManageLanding(): void {
    if (this.contentManageLandingSubscription) return;
    this.contentManageLandingSubscription = this.sidebarService.getContentManageLandingValue
      .pipe(
        startWith(this.contentManagementValue.landing),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentManagementLanding, IContentManagementLanding]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.contentManagementValue.landing = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  setContentManageGeneralToFormValue(): void {
    this.sidebarService.setContentManageGeneralFormValue(this.contentManagementValue.general);
  }

  saveContentManageContents(): void {
    this.sidebarService.setContentManageContentsValue(null);
  }

  setFormValueToContentManageContents(): void {
    if (this.contentManageContentsSubscription) return;
    this.contentManageContentsSubscription = this.sidebarService.getContentManageContentsValue
      .pipe(
        startWith(this.contentManagementValue.contents),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentManagementContents, IContentManagementContents]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.contentManagementValue.contents = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
            if (!isEqual(sortBy(oldValue?.categoryIds), sortBy(newVaLue?.categoryIds))) {
              const maxPrimaryContent = this.contentManagementValue.general.pattern.patternStyle?.primary?.maxContent
                ? this.contentManagementValue.general.pattern.patternStyle?.primary?.maxContent
                : 0;
              const maxSecondaryContent = this.contentManagementValue.general.pattern.patternStyle?.secondary?.maxContent
                ? this.contentManagementValue.general.pattern.patternStyle?.secondary?.maxContent
                : 0;
              const maxItemPerRow = maxPrimaryContent + maxSecondaryContent;
              this.getCategoryContentsData(newVaLue?.categoryIds, maxItemPerRow);
            }
          }
        }),
      )
      .subscribe();
  }

  getCategoryContentsData(categoryIds: string[], limit: number): void {
    this.cmsContentEditService
      .getContentsByCategories(categoryIds, limit)
      .pipe(
        takeUntil(this.destroy$),
        tap((list: IContentEditor[]) => {
          if (list) {
            this.contentCategoryData = list;
          }
        }),
      )
      .subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          this.showUnexpectedError(error.message);
        },
        complete: () => {
          console.log('COMPLETE');
        },
      });
  }

  showUnexpectedError(message: string = 'Unexpected Error occured...Try again later!'): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }

  setContentManageContentsToFormValue(): void {
    this.sidebarService.setContentManageContentsFormValue(this.contentManagementValue.contents);
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

  onOpenLandingPage(): void {
    const componentId = this.el.nativeElement.getAttribute('id');
    const route = this.router.url.split('/');
    const previousWebPageID = route.pop();
    const contentId = this.contentCategoryData[0]?._id;
    if (!contentId) return;
    this.webpageService
      .getLandingWebPageByName(previousWebPageID, componentId)
      .pipe(
        takeUntil(this.destroy$),
        tap((landingWebPage: IWebPagePage) => {
          if (landingWebPage) {
            const webPageID = landingWebPage?._id;
            void this.router.navigate([`cms/edit/site-management/${webPageID}/${previousWebPageID}/${componentId}/${contentId}`]);
          }
        }),
      )
      .subscribe();
  }
}
