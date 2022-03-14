import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Attribute, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, ViewRef } from '@angular/core';
import {
  ColumnType,
  IMediaGalleryControl,
  IMediaGalleryListIndex,
  IMediaGalleryRenderingSetting,
  IMediaGallerySetting,
  IRenderingComponentData,
  IThemeOption,
  mediaGalleryDefaultSetting,
  mediaGalleryList,
  MediaGalleryType,
  MenuGenericType,
} from '@reactor-room/cms-models-lib';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, clearDragRef, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { Subject, Subscription } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CONTENT_CONTAINER, ContentContainer } from '../cms-content-container-rendering/token';
import { FOOTER_CONTAINER, FooterContainer } from '../cms-footer-container-rendering/token';
import { HEADER_CONTAINER, HeaderContainer } from '../cms-header-container-rendering/token';
import { ParentLayoutContainer, PARENT_LAYOUT_CONTAINER } from '../cms-layout-rendering/token';
import { environment } from 'apps/cms-frontend/src/environments/environment';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import stringify from 'fast-json-stable-stringify';

@Component({
  selector: 'cms-next-cms-media-gallery-rendering',
  templateUrl: './cms-media-gallery-rendering.component.html',
  styleUrls: ['./cms-media-gallery-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsMediaGalleryRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsMediaGalleryRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, OnDestroy {
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public onFocus = false;
  public componentType = 'CmsMediaGalleryRenderingComponent';
  public themeOption: IThemeOption;
  private destroy$ = new Subject();
  mediaGalleryFormValue = deepCopy(mediaGalleryDefaultSetting);
  mediaGallerySettingSubscription: Subscription;
  mediaGalleryControlSubscription: Subscription;
  mediaGalleryList = mediaGalleryList;
  mediaGalleryType = MediaGalleryType;
  isChildEnter = false;
  @Input() public type: MediaGalleryType;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  changeDetectorTrigger = false;
  isThemeGlobal: boolean;
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    public cmsPublishService: CmsPublishService,
    private dragDrop: DragDrop,
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
          if (renderingData) {
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
              options = options as IMediaGalleryRenderingSetting;
              const { gallery, control } = options;
              if (gallery) this.mediaGalleryFormValue.gallery = gallery;
              if (control) this.mediaGalleryFormValue.control = control;
            }
            const { commonSettings } = renderingData;
            if (commonSettings) {
              if (commonSettings.border) this.performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
              if (commonSettings.shadow) this.performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
              if (commonSettings.hover) this.performSetLayoutSettingHoverValueToElementStyle(commonSettings.hover);
              if (commonSettings.advance) this.performSetLayoutSettingAdvanceValueToElementStyle(commonSettings.advance);
              if (commonSettings.background) this.performSetLayoutSettingBackgroundValueToElementStyle(commonSettings.background);
              if (commonSettings.customize) this.performSetLayoutSettingCustomizeValueToElementStyle(commonSettings.customize);
            }
            this.changeDetectorTrigger = true;
          }
        }),
      )
      .subscribe();
    setTimeout(() => {
      this.initComponent();
      this.viewRef = getRootViewRef(this);
    }, 300);
  }

  initSetting(): void {
    const galleryId = this.type;
    const mediaGalleryItem = this.mediaGalleryList.find((item) => item.gallery.galleryPatternId === galleryId);
    this.mediaGalleryFormValue.gallery.galleryPatternId = mediaGalleryItem.gallery.galleryPatternId;
    this.mediaGalleryFormValue.gallery.galleryPatternUrl = mediaGalleryItem.gallery.galleryPatternUrl;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    clearDragRef(this.dragRef);
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
    if (this.themeOption) this.dragRef.disabled = true;
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
    dragRef.data = { dropListRef: container, type: this.type, genericType: MenuGenericType.MEDIA_GALLERY };
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

  onMediaGalleryFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onMediaGalleryFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_MEDIA_GALLERY);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setMediaGallerySettingDataToFormValue();
      this.setMediaGalleryControlDataToFormValue();
    }, 0);
  }

  onMediaGalleryFocusComponent(component: CmsMediaGalleryRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setFormValueToMediaGallerySettingData();
    this.setFormValueToMediaGalleryControlData();
  }

  saveMediaGallerySettingData(): void {
    this.sidebarService.setMediaGallerySettingValue(null);
  }

  setFormValueToMediaGallerySettingData(): void {
    if (this.mediaGallerySettingSubscription) return;
    this.mediaGallerySettingSubscription = this.sidebarService.getMediaGallerySettingValue
      .pipe(
        startWith(this.mediaGalleryFormValue.gallery),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMediaGallerySetting, IMediaGallerySetting]) => {
          if (!oldValue) return;
          if (stringify(oldValue) !== stringify(newVaLue) && newVaLue) {
            this.mediaGalleryFormValue.gallery = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  setMediaGallerySettingDataToFormValue(): void {
    this.sidebarService.setMediaGallerySettingFormValue(this.mediaGalleryFormValue.gallery);
  }

  saveMediaGalleryControlData(): void {
    this.sidebarService.setMediaGalleryControlValue(null);
  }

  setFormValueToMediaGalleryControlData(): void {
    if (this.mediaGalleryControlSubscription) return;
    this.mediaGalleryControlSubscription = this.sidebarService.getMediaGalleryControlValue
      .pipe(
        startWith(this.mediaGalleryFormValue.control),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IMediaGalleryControl, IMediaGalleryControl]) => {
          if (!oldValue) return;
          if (stringify(oldValue) !== stringify(newVaLue) && newVaLue) {
            this.mediaGalleryFormValue.control = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  setMediaGalleryControlDataToFormValue(): void {
    this.sidebarService.setMediaGalleryControlFormValue(this.mediaGalleryFormValue.control);
  }

  onRemoveCurrentComponent(): void {
    this.cmsEditService.onRemoveCurrentComponent(this.dragRef).subscribe();
  }

  mediaGalleryItemEvent(event: IMediaGalleryListIndex): void {
    if (event) {
      this.mediaGalleryFormValue.gallery.gallleryList[event.index] = event.item;
    }
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }
}
