import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Attribute, Component, ElementRef, Inject, Input, OnDestroy, OnInit, Optional, ViewRef } from '@angular/core';
import { ColumnType, IRenderingComponentData, IThemeOption, MediaSliderType, MenuGenericType } from '@reactor-room/cms-models-lib';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { clearDragRef, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { Subject } from 'rxjs';
import { Mixin } from 'ts-mixer';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CmsEditThemeService } from '../../../services/cms-theme.service';
import { CONTENT_CONTAINER, ContentContainer } from '../cms-content-container-rendering/token';
import { FooterContainer, FOOTER_CONTAINER } from '../cms-footer-container-rendering/token';
import { HEADER_CONTAINER, HeaderContainer } from '../cms-header-container-rendering/token';
import { ParentLayoutContainer, PARENT_LAYOUT_CONTAINER } from '../cms-layout-rendering/token';

@Component({
  selector: 'cms-next-cms-media-slider-rendering',
  templateUrl: './cms-media-slider-rendering.component.html',
  styleUrls: ['./cms-media-slider-rendering.component.scss'],
})
export class CmsMediaSliderRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, OnDestroy {
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public onFocus = false;
  public componentType = 'CmsMediaSliderRenderingComponent';
  public themeOption: IThemeOption;
  private destroy$ = new Subject();
  isChildEnter = false;
  @Input() public type: MediaSliderType;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  // eslint-disable-next-line @angular-eslint/no-input-rename
  renderingComponentData$ = new Subject<IRenderingComponentData>();

  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    public cmsPublishService: CmsPublishService,
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private cmsThemeService: CmsEditThemeService,
    //TODO: should resolve dropListRef from container, it should not be specific to CmsLayoutRendering (can be dropzone also)
    @Optional() @Inject(PARENT_LAYOUT_CONTAINER) private parentLayoutContainer: ParentLayoutContainer,
    @Optional() @Inject(CONTENT_CONTAINER) private contentContainer: ContentContainer,
    @Optional() @Inject(HEADER_CONTAINER) private headerContainer: HeaderContainer,
    @Optional() @Inject(FOOTER_CONTAINER) private footerContainer: FooterContainer,
    private undoRedoService: UndoRedoService,
  ) {
    super(el, sidebarService, cmsPublishService);
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.initComponent();
      this.viewRef = getRootViewRef(this);
    }, 0);
  }

  initSetting(): void {
    console.log('this.type :>> ', this.type);
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

  onMediaSliderFocusEvent(): void {
    this.onMediaSliderFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_MEDIA_SLIDER);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
    }, 0);
  }

  onMediaSliderFocusComponent(component: CmsMediaSliderRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
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
