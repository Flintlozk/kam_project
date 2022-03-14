import { DragDrop, DragRef, DropListRef, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  AfterContentInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  ElementRef,
  forwardRef,
  Inject,
  Injector,
  Input,
  OnDestroy,
  OnInit,
  Optional,
  QueryList,
  Type,
  ViewChild,
  ViewChildren,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { convertNumberToPx } from '@reactor-room/cms-frontend-helpers-lib';
import {
  ButtonType,
  ColumnType,
  EFontFamilyCode,
  ELayoutAttributes,
  ELayoutColumns,
  ICommonSettings,
  ILayoutColumn,
  ILayoutRenderingSetting,
  IRenderingComponentData,
  ITextSettingInit,
  IThemeOption,
  layoutSettingAdvanceDefault,
  layoutSettingBackgroundDefault,
  layoutSettingBorderDefault,
  layoutSettingCustomizeDefault,
  layoutSettingHoverDefault,
  layoutSettingShadowDefault,
  MediaGalleryType,
  MediaSliderType,
  MenuGenericType,
  MenuRenderingType,
  MenuType,
  ShoppingCartTypes,
  TextType,
  UndoRedoEnum,
} from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { distinctUntilChanged, takeUntil, tap } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { environment } from '../../../../../../environments/environment';
import { UndoRedoService } from '../../../../../services/undo-redo.service';
import { Children, clearDragRef, getRootViewRef } from '../../../../../shares/utils';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentLayoutDirective } from '../../../directives/component-layout/component-layout.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { ComponentTextDirective } from '../../../directives/component-text/component-text.directive';
import {
  ComponentType,
  ContentChildrenType,
  DragRefData,
  Dropped,
  DropZoneData,
  EDropzoneType,
  LayoutData,
  ViewRefAndElementRefAndComponent,
} from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsCommonService } from '../../../services/cms-common.service';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CmsLayoutGuidelineComponent } from '../../common/cms-layout-guideline/cms-layout-guideline.component';
import { CmsButtonRenderingComponent } from '../cms-button-rendering/cms-button-rendering.component';
import { CmsContainerRenderingComponent } from '../cms-container-rendering/cms-container-rendering.component';
import { ContentContainer, CONTENT_CONTAINER } from '../cms-content-container-rendering/token';
import { CmsContentManagementRenderingComponent } from '../cms-content-management-rendering/cms-content-management-rendering.component';
import { FooterContainer, FOOTER_CONTAINER } from '../cms-footer-container-rendering/token';
import { HeaderContainer, HEADER_CONTAINER } from '../cms-header-container-rendering/token';
import { CmsMediaGalleryRenderingComponent } from '../cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMediaSliderRenderingComponent } from '../cms-media-slider-rendering/cms-media-slider-rendering.component';
import { CmsMenuRenderingComponent } from '../cms-menu-rendering/cms-menu-rendering.component';
import { CmsShoppingCartRenderingComponent } from '../cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';
import { CmsTextRenderingComponent } from '../cms-text-rendering/cms-text-rendering.component';
import { PARENT_LAYOUT_CONTAINER } from './token';

@Component({
  selector: 'cms-next-cms-layout-rendering',
  templateUrl: './cms-layout-rendering.component.html',
  styleUrls: ['./cms-layout-rendering.component.scss'],
  providers: [
    { provide: Children, useExisting: forwardRef(() => CmsLayoutRenderingComponent) },
    { provide: PARENT_LAYOUT_CONTAINER, useExisting: forwardRef(() => CmsLayoutRenderingComponent) },
  ],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsLayoutRenderingComponent
  extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective, ComponentTextDirective, ComponentLayoutDirective)
  implements OnInit, OnDestroy, AfterContentInit
{
  @ViewChild('insertPoint1', { static: true, read: ViewContainerRef }) insertPoint1: ViewContainerRef;
  @ViewChild('dropZone1', { static: true }) dropZone1: ElementRef<HTMLDivElement>;
  @ViewChild('insertPoint2', { static: true, read: ViewContainerRef }) insertPoint2: ViewContainerRef;
  @ViewChild('dropZone2', { static: true }) dropZone2: ElementRef<HTMLDivElement>;
  @ViewChild('insertPoint3', { static: true, read: ViewContainerRef }) insertPoint3: ViewContainerRef;
  @ViewChild('dropZone3', { static: true }) dropZone3: ElementRef<HTMLDivElement>;
  @ViewChild('insertPoint4', { static: true, read: ViewContainerRef }) insertPoint4: ViewContainerRef;
  @ViewChild('dropZone4', { static: true }) dropZone4: ElementRef<HTMLDivElement>;
  @ViewChild(CmsLayoutGuidelineComponent, { static: true }) cmsLayoutGuidelineComponent: CmsLayoutGuidelineComponent;
  @ViewChildren(CmsContainerRenderingComponent) containers: QueryList<CmsContainerRenderingComponent>;
  @ContentChildren(Children) contentTextChildren!: QueryList<ContentChildrenType>;
  public onFocus = false;
  public dragRef: DragRef<DragRefData>;
  public componentType = 'CmsLayoutRenderingComponent';
  public themeOption: IThemeOption;
  isChildEnter = false;
  currentColumnValue: ELayoutColumns = ELayoutColumns.ONE_COLUMN;
  currentColumnGap = 20;
  currentColumnNumber = 1;
  viewRef: ViewRef;
  destroy$ = new Subject();
  layoutDropListRef1: DropListRef;
  layoutDropListRef2: DropListRef;
  layoutDropListRef3: DropListRef;
  layoutDropListRef4: DropListRef;
  layoutTitle: string;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  @Input() renderingComponentDataContainers: ICommonSettings[] = [];
  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    public cmsPublishService: CmsPublishService,
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private undoRedoService: UndoRedoService,
    private cmsCommonService: CmsCommonService,
    @Optional() @Inject(CONTENT_CONTAINER) private contentContainer: ContentContainer,
    @Optional() @Inject(HEADER_CONTAINER) private headerContainer: HeaderContainer,
    @Optional() @Inject(FOOTER_CONTAINER) private footerContainer: FooterContainer,
  ) {
    super(el, sidebarService, cmsPublishService);
  }

  ngOnInit(): void {
    this.renderingComponentData$
      .pipe(
        takeUntil(this.destroy$),
        tap((renderdingData) => {
          if (renderdingData) {
            if (renderdingData.themeOption) {
              this.themeOption = renderdingData.themeOption;
            }
            this.el.nativeElement.classList.add('rendering-item');
            let { options } = renderdingData;
            if (options) {
              options = options as ILayoutRenderingSetting;
              if (options.setting) {
                this.setLayoutTitle(options.setting.column);
                this.performSetLayoutColumnValueToElementStyle(options.setting);
                this.setInitLayoutColumnNumber(options.setting.column);
              }
            }
            const { commonSettings } = renderdingData;
            if (commonSettings) {
              if (commonSettings.border) this.performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
              if (commonSettings.shadow) this.performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
              if (commonSettings.effect) this.performSetLayoutEffectValueToElementStyle(commonSettings.effect);
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
      const viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent = {
        component: this,
      };
      this.initComponent(viewRefAndElementRefAndComponent);
      this.layoutColumnHandler();
    }, 0);
  }

  setInitLayoutColumnStyle(column: ELayoutColumns, gap?: number): void {
    this.nativeElement.style.gridTemplateColumns = column;
    this.nativeElement.style.gridGap = convertNumberToPx(gap ? gap : 20);
    this.nativeElement.setAttribute(ELayoutAttributes.COLUMN, column);
    this.nativeElement.setAttribute(ELayoutAttributes.GAP, gap ? gap.toString() : '20');
  }

  setInitLayoutColumnNumber(column: string): void {
    switch (column) {
      case ELayoutColumns.ONE_COLUMN:
        this.currentColumnNumber = 1;
        break;
      case ELayoutColumns.FIVE_FIVE_COLUMN:
      case ELayoutColumns.SIX_FOUR_COLUMN:
      case ELayoutColumns.FOUR_SIX_COLUMN:
      case ELayoutColumns.SEVEN_THREE_COLUMN:
      case ELayoutColumns.THREE_SEVEN_COLUMN:
        this.currentColumnNumber = 2;
        break;
      case ELayoutColumns.THREE_COLUMN:
        this.currentColumnNumber = 3;
        break;
      case ELayoutColumns.FOUR_COLUMN:
        this.currentColumnNumber = 4;
        break;
      default:
        break;
    }
  }

  setLayoutTitle(column: string): void {
    console.log(column);
    switch (column) {
      case ELayoutColumns.ONE_COLUMN:
        this.layoutTitle = 'Blank Layout 1 Column';
        break;
      case ELayoutColumns.FIVE_FIVE_COLUMN:
        this.layoutTitle = 'Blank Layout 2 Columns (50% 50%)';
        break;
      case ELayoutColumns.SIX_FOUR_COLUMN:
        this.layoutTitle = 'Blank Layout 2 Columns (40% 60%)';
        break;
      case ELayoutColumns.FOUR_SIX_COLUMN:
        this.layoutTitle = 'Blank Layout 2 Columns (60% 40%)';
        break;
      case ELayoutColumns.SEVEN_THREE_COLUMN:
        this.layoutTitle = 'Blank Layout 2 Columns (70% 30%)';
        break;
      case ELayoutColumns.THREE_SEVEN_COLUMN:
        this.layoutTitle = 'Blank Layout 2 Columns (30% 70%)';
        break;
      case ELayoutColumns.THREE_COLUMN:
        this.layoutTitle = 'Blank Layout 3 Columns';
        break;
      case ELayoutColumns.FOUR_COLUMN:
        this.layoutTitle = 'Blank Layout 4 Columns';
        break;
      default:
        this.layoutTitle = 'Blank Layout';
        break;
    }
  }

  layoutColumnHandler(): void {
    this.sidebarService.getlayoutColumnFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: ILayoutColumn) => {
      if (val) this.setLayoutColumnNumber(val?.column);
    });
    this.sidebarService.getLayoutColumnValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((val: ILayoutColumn) => {
      if (val) this.setLayoutColumnNumber(val?.column);
    });
  }

  ngAfterContentInit(): void {
    this.moveViewRefToColumn(this.contentTextChildren);
  }

  moveViewRefToColumn(contentChildren: QueryList<ContentChildrenType>): void {
    let column1 = 0,
      column2 = 0,
      column3 = 0,
      column4 = 0;
    contentChildren.forEach((c) => {
      const rootViewRef = getRootViewRef(c) as ViewRef;
      switch (c.column) {
        case ColumnType.COLUMN_1: {
          this.moveViewRefTo(this.insertPoint1, rootViewRef, column1);
          column1++;
          break;
        }
        case ColumnType.COLUMN_2: {
          this.moveViewRefTo(this.insertPoint2, rootViewRef, column2);
          column2++;
          break;
        }
        case ColumnType.COLUMN_3: {
          this.moveViewRefTo(this.insertPoint3, rootViewRef, column3);
          column3++;
          break;
        }
        case ColumnType.COLUMN_4: {
          this.moveViewRefTo(this.insertPoint4, rootViewRef, column4);
          column4++;
          break;
        }
        default: {
          this.moveViewRefTo(this.insertPoint1, rootViewRef, column1);
          column1++;
          break;
        }
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    clearDragRef(this.dragRef);
  }

  setLayoutColumnNumber(currentColumnValue: ELayoutColumns): void {
    this.currentColumnValue = currentColumnValue;
    if (!this.onFocus) return;
    this.setLayoutTitle(currentColumnValue);
    switch (currentColumnValue) {
      case ELayoutColumns.ONE_COLUMN:
        this.currentColumnNumber = 1;
        this.resetLayoutDropListRef(this.layoutDropListRef2, this.insertPoint3);
        this.resetLayoutDropListRef(this.layoutDropListRef3, this.insertPoint3);
        this.resetLayoutDropListRef(this.layoutDropListRef4, this.insertPoint4);
        break;
      case ELayoutColumns.FIVE_FIVE_COLUMN:
      case ELayoutColumns.SIX_FOUR_COLUMN:
      case ELayoutColumns.FOUR_SIX_COLUMN:
      case ELayoutColumns.SEVEN_THREE_COLUMN:
      case ELayoutColumns.THREE_SEVEN_COLUMN:
        this.currentColumnNumber = 2;
        this.resetLayoutDropListRef(this.layoutDropListRef3, this.insertPoint3);
        this.resetLayoutDropListRef(this.layoutDropListRef4, this.insertPoint4);
        break;
      case ELayoutColumns.THREE_COLUMN:
        this.currentColumnNumber = 3;
        this.resetLayoutDropListRef(this.layoutDropListRef4, this.insertPoint4);
        break;
      case ELayoutColumns.FOUR_COLUMN:
        this.currentColumnNumber = 4;
        break;
      default:
        break;
    }
  }

  resetLayoutDropListRef(layoutDropListRef: DropListRef, viewContainerRef: ViewContainerRef): void {
    const { dragRefs } = layoutDropListRef.data;
    dragRefs.forEach((d: DragRef) => {
      d.dispose();
    });
    viewContainerRef.clear();
    layoutDropListRef.data.dragRefs = [];
    layoutDropListRef.data.viewRefAndElementRefAndComponents = [];
    layoutDropListRef.withItems([]);
  }

  initComponent(viewRefAndElementRef: ViewRefAndElementRefAndComponent): void {
    const dropZoneDropListRef = this.getCurrentDropZoneListRef();
    this.insertComponentRef(dropZoneDropListRef.data.viewRefAndElementRefAndComponents, dropZoneDropListRef.data.viewRefAndElementRefAndComponents.length, viewRefAndElementRef);
    const dragRef = this.createAndInsertDragRefToContainer(this.el, dropZoneDropListRef.data.dragRefs.length, dropZoneDropListRef, this.currentColumnValue, MenuGenericType.LAYOUT);
    this.dragRef = dragRef;
    this.viewRef = getRootViewRef(this);
    this.dragRef.lockAxis = 'y';
    if (this.themeOption) this.dragRef.disabled = true;
    this.dragRef.withHandles([this.cmsLayoutGuidelineComponent.dragHandler]);
    this.layoutDropListRef1 = this.createLayoutDropListRef(this.dropZone1, this.insertPoint1);
    this.layoutDropListRef2 = this.createLayoutDropListRef(this.dropZone2, this.insertPoint2);
    this.layoutDropListRef3 = this.createLayoutDropListRef(this.dropZone3, this.insertPoint3);
    this.layoutDropListRef4 = this.createLayoutDropListRef(this.dropZone4, this.insertPoint4);
    this.cmsEditService.layoutDropListRefs.push(this.layoutDropListRef1);
    this.cmsEditService.layoutDropListRefs.push(this.layoutDropListRef2);
    this.cmsEditService.layoutDropListRefs.push(this.layoutDropListRef3);
    this.cmsEditService.layoutDropListRefs.push(this.layoutDropListRef4);
    this.connectLayoutsToNewLayoutAndDropZone(this.layoutDropListRef1);
    this.connectLayoutsToNewLayoutAndDropZone(this.layoutDropListRef2);
    this.connectLayoutsToNewLayoutAndDropZone(this.layoutDropListRef3);
    this.connectLayoutsToNewLayoutAndDropZone(this.layoutDropListRef4);
    this.connectDropZoneToLayouts();
    this.connectMenuToLayoutsAndDropZone();
    this.layoutDropListRef1.dropped.pipe(takeUntil(this.destroy$)).subscribe(this.layoutDropHandle.bind(this));
    this.layoutDropListRef2.dropped.pipe(takeUntil(this.destroy$)).subscribe(this.layoutDropHandle.bind(this));
    this.layoutDropListRef3.dropped.pipe(takeUntil(this.destroy$)).subscribe(this.layoutDropHandle.bind(this));
    this.layoutDropListRef4.dropped.pipe(takeUntil(this.destroy$)).subscribe(this.layoutDropHandle.bind(this));
  }

  getCurrentDropZoneListRef(): DropListRef {
    if (this.headerContainer) return this.cmsEditService.headerDropListRef;
    else if (this.footerContainer) return this.cmsEditService.footerDropListRef;
    else if (this.contentContainer) return this.cmsEditService.dropZoneDropListRef;
    else return null;
  }

  createComponent<T>(component: Type<T>): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory<T>(component);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRef: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRef);
  }
  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef, type: MenuType, genericType: MenuGenericType): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: type, genericType: genericType };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    return dragRef;
  }

  moveViewRefTo(vcr: ViewContainerRef, viewRef: ViewRef, to: number): void {
    vcr.move(viewRef, to);
  }
  checkTextElement(type: MenuType, vcr: ViewContainerRef, to: number): CmsTextRenderingComponent {
    let setting: ITextSettingInit;
    let htmlContent = '';
    switch (type) {
      case TextType.Text1:
        {
          setting = { color: '#000000', font: EFontFamilyCode.PROMPT, size: '18px' };
          htmlContent =
            // eslint-disable-next-line max-len
            '<p><span class="ql-font-prompt" style="color: rgb(0, 0, 0); font-size: 18px;">Loream</span></p><p><span class="ql-font-prompt" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text2:
        {
          setting = { color: '#000000', font: EFontFamilyCode.RACING_SANS_ONE, size: '18px' };
          htmlContent =
            // eslint-disable-next-line max-len
            '<p><span class="ql-font-racing" style="color: rgb(0, 0, 0); font-size: 18px;">Loream</span></p><p><span class="ql-font-racing" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text3:
        {
          setting = { color: '#000000', font: EFontFamilyCode.QUANTICO, size: '14px' };
          htmlContent =
            // eslint-disable-next-line max-len
            '<p><span class="ql-font-quantico" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text4:
        {
          setting = { color: '#000000', font: EFontFamilyCode.POST_NO_BILLS_COLOMBO, size: '14px' };
          htmlContent =
            // eslint-disable-next-line max-len
            /* html */ '<p><span class="ql-font-colombo" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est </span></p>';
        }
        break;
      case TextType.Text5:
        {
          setting = { color: '#000000', font: EFontFamilyCode.NEUCHA, size: '14px' };
          htmlContent =
            // eslint-disable-next-line max-len
            /* html */ '<p><span class="ql-font-neucha" style="color: rgb(0, 0, 0); font-size: 14px;">Lorem ipsum dolor sit amet, consectetur adipiscing elit. Id accumsan, id vitae amet, varius. Id amet aliquam penatibus eget pellentesque est enim nam tristique. </span></p>';
        }
        break;
      default: {
        console.error('checkTextElement Error: Unhandled element' + type);
        return;
      }
    }
    return this.createTextRenderingComponentRefAndDragRefToContainer(vcr, to, setting, htmlContent);
  }
  createTextRenderingComponentRefAndDragRefToContainer(vcr: ViewContainerRef, to: number, setting: ITextSettingInit, htmlContent: string): CmsTextRenderingComponent {
    const componentRef = this.createComponent(CmsTextRenderingComponent);
    if (vcr.length < to) {
      to = vcr.length;
    }
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    componentRef.instance.savingData = [
      {
        quillHTML: htmlContent,
        cultureUI: this.cmsCommonService.defaultCultureUI,
      },
    ];
    componentRef.instance.initQuillHTML();
    componentRef.instance.initTextSetting = setting;
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  createLayoutDropListRef(dropZoneElementRef: ElementRef<HTMLElement>, insertPoint: ViewContainerRef): DropListRef {
    const layoutDropListRef = this.dragDrop.createDropList<LayoutData>(dropZoneElementRef).withItems([]);
    layoutDropListRef.connectedTo([
      layoutDropListRef,
      ...this.cmsEditService.layoutDropListRefs,
      this.cmsEditService.dropZoneDropListRef,
      this.cmsEditService.removedDropListRef,
      this.cmsEditService.headerDropListRef,
    ]);
    layoutDropListRef.sortingDisabled = false;
    layoutDropListRef.data = { insertPoint, dragRefs: [], viewRefAndElementRefAndComponents: [], dropzoneType: EDropzoneType.LAYOUT };
    return layoutDropListRef;
  }
  connectLayoutsToNewLayoutAndDropZone(layoutDropListRef: DropListRef<LayoutData>): void {
    this.cmsEditService.layoutDropListRefs.forEach((ref) => {
      // each container still need to connect to itself for dragging in its container and need to be before drop zone
      ref.connectedTo([
        ...this.cmsEditService.layoutDropListRefs,
        layoutDropListRef,
        this.cmsEditService.dropZoneDropListRef,
        this.cmsEditService.removedDropListRef,
        this.cmsEditService.headerDropListRef,
        this.cmsEditService.footerDropListRef,
      ]);
    });
  }
  connectDropZoneToLayouts(): void {
    this.cmsEditService.dropZoneDropListRef.connectedTo([
      ...this.cmsEditService.layoutDropListRefs,
      this.cmsEditService.removedDropListRef,
      this.cmsEditService.headerDropListRef,
      this.cmsEditService.footerDropListRef,
    ]);
    if (this.cmsEditService.headerDropListRef)
      this.cmsEditService.headerDropListRef.connectedTo([
        ...this.cmsEditService.layoutDropListRefs,
        this.cmsEditService.dropZoneDropListRef,
        this.cmsEditService.removedDropListRef,
        this.cmsEditService.footerDropListRef,
      ]);
    if (this.cmsEditService.footerDropListRef)
      this.cmsEditService.footerDropListRef.connectedTo([
        ...this.cmsEditService.layoutDropListRefs,
        this.cmsEditService.dropZoneDropListRef,
        this.cmsEditService.removedDropListRef,
        this.cmsEditService.headerDropListRef,
      ]);
  }
  connectMenuToLayoutsAndDropZone(): void {
    if (this.cmsEditService.menuDropListRef) {
      this.cmsEditService.menuDropListRef.connectedTo([
        ...this.cmsEditService.layoutDropListRefs,
        this.cmsEditService.dropZoneDropListRef,
        this.cmsEditService.headerDropListRef,
        this.cmsEditService.footerDropListRef,
      ]);
    }
  }
  moveLayoutData(fromContainer: DropListRef<DropZoneData>, toContainer: DropListRef<DropZoneData>, from: number, to: number): void {
    transferArrayItem(fromContainer.data.viewRefAndElementRefAndComponents, toContainer.data.viewRefAndElementRefAndComponents, from, to);
    const previousDragRefs = fromContainer.data.dragRefs;
    previousDragRefs[from].dispose();
    previousDragRefs.splice(from, 1);
    fromContainer.withItems(previousDragRefs);
  }
  moveViewContainerRefAndComponentAndDragRefToContainer(
    vcr: ViewContainerRef,
    viewRef: ViewRef,
    elementRef: ElementRef<HTMLElement>,
    oldContainer: DropListRef<DropZoneData>,
    newContainer: DropListRef<DropZoneData>,
    fromIndex: number,
    toIndex: number,
    layoutItem: DragRef<DragRefData>,
    component: { dragRef?: DragRef },
  ): DragRef {
    this.moveViewRefTo(vcr, viewRef, toIndex);
    this.moveLayoutData(oldContainer, newContainer, fromIndex, toIndex);
    const dragRef = this.createAndInsertDragRefToContainer(elementRef, toIndex, newContainer, layoutItem.data.type, layoutItem.data.genericType);
    component.dragRef = dragRef;
    return dragRef;
  }
  layoutDropHandle(e: Dropped): void {
    const { previousIndex: pi, currentIndex: ci, previousContainer: pc, container: c, item: layoutItem } = e;
    const vcr = c.data.insertPoint;
    // Same Layout
    if (pc === c) {
      // Previous Index = Current Index
      if (pi === ci) {
        return;
      }
      const from = c.data.viewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === layoutItem);
      const viewRefAndElementRef = c.data.viewRefAndElementRefAndComponents[from].component;
      this.moveViewRefTo(vcr, viewRefAndElementRef.viewRef, ci);
      moveItemInArray(c.data.viewRefAndElementRefAndComponents, from, ci);
      moveItemInArray(c.data.dragRefs, from, ci);
      if (!e.item.data?.undoRedoDropped) {
        this.undoRedoService.addDroppedUndoFromAction(e);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
        this.undoRedoService.addDroppedRedo(e);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
        this.undoRedoService.addDroppedUndo(e);
      }
    } else if (pc === this.cmsEditService.menuDropListRef) {
      // MENU TO LAYOUT
      // if (pc !== c) {
      //   // LAYOUT FROM MENU TO LAYOUT
      //   return;
      // }
      console.log('menu to layout');
      const type = layoutItem.data.type;
      let createdComponent = null;
      switch (layoutItem.data.genericType) {
        case MenuGenericType.MEDIA_GALLERY:
          createdComponent = this.checkMediaGalleryElement(type as MediaGalleryType, vcr, ci);
          break;
        case MenuGenericType.MEDIA_SLIDER:
          createdComponent = this.checkMediaSliderElement(type as MediaSliderType, vcr, ci);
          break;
        case MenuGenericType.TEXT:
          createdComponent = this.checkTextElement(type as TextType, vcr, ci);
          break;
        case MenuGenericType.CONTENT_MANAGEMENT:
          createdComponent = this.checkContentManagementElement(type as string, vcr, ci);
          break;
        case MenuGenericType.BUTTON:
          createdComponent = this.checkButtonElement(type as ButtonType, vcr, ci);
          break;
        case MenuGenericType.MENU:
          createdComponent = this.checkMenuElement(type as MenuRenderingType, vcr, ci);
          break;
        case MenuGenericType.SHOPPING_CART:
          createdComponent = this.checkShoppingCartElement(type as ShoppingCartTypes, vcr, ci);
          break;
        default:
          break;
      }
      const dropped: Dropped = { ...e, previousContainer: this.cmsEditService.removedDropListRef, component: createdComponent };
      if (!e.item.data?.undoRedoDropped) {
        this.undoRedoService.addDroppedUndoFromAction(dropped);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
        this.undoRedoService.addDroppedRedo(dropped);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
        this.undoRedoService.addDroppedUndo(dropped);
      }
      this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
    } else if (pc === this.cmsEditService.removedDropListRef) {
      console.log('from removed zone');
      const from = pc.data.viewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === layoutItem);
      const { component } = pc.data.viewRefAndElementRefAndComponents[from];
      const dragRef = this.moveViewContainerRefAndComponentAndDragRefToContainer(vcr, component.viewRef, component.el, pc, c, from, ci, layoutItem, component);
      const dropped: Dropped = { ...e, item: dragRef, component };
      if (!e.item.data?.undoRedoDropped) {
        this.undoRedoService.addDroppedUndoFromAction(dropped);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
        this.undoRedoService.addDroppedRedo(dropped);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
        this.undoRedoService.addDroppedUndo(dropped);
      }
      this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
    } else {
      // (DROPZONE or LAYOUT) TO LAYOUT
      const isLayout = layoutItem.data.genericType === MenuGenericType.LAYOUT;
      // Layout cannot be dropped into layout
      console.log('dropzone, layout to layout');
      if (isLayout) {
        console.log('Layout to layout');
        return;
      }
      const from = pc.data.viewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === layoutItem);
      const draggedComponent = pc.data.viewRefAndElementRefAndComponents[from];
      const { component } = draggedComponent;
      const dragRef = this.moveViewContainerRefAndComponentAndDragRefToContainer(vcr, component.viewRef, component.el, pc, c, from, ci, layoutItem, component);
      const dropped: Dropped = { ...e, item: dragRef, component };
      if (!e.item.data?.undoRedoDropped) {
        this.undoRedoService.addDroppedUndoFromAction(dropped);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
        this.undoRedoService.addDroppedRedo(dropped);
      } else if (e.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
        this.undoRedoService.addDroppedUndo(dropped);
      }
      this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
    }
  }

  checkShoppingCartElement(type: ShoppingCartTypes, vcr: ViewContainerRef, to: number): ComponentType {
    const componentRef = this.createComponent(CmsShoppingCartRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    componentRef.instance.shoppingCartRenderType = type;
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, false);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  checkButtonElement(type: ButtonType, vcr: ViewContainerRef, to: number): CmsButtonRenderingComponent {
    const componentRef = this.createComponent(CmsButtonRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, false);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  checkMenuElement(type: MenuRenderingType, vcr: ViewContainerRef, to: number): CmsMenuRenderingComponent {
    const componentRef = this.createComponent(CmsMenuRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, false);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  checkMediaSliderElement(type: MediaSliderType, vcr: ViewContainerRef, to: number): CmsMediaSliderRenderingComponent {
    const componentRef = this.createComponent(CmsMediaSliderRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    componentRef.instance.type = type;
    componentRef.instance.initSetting();
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, false);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  checkMediaGalleryElement(type: MediaGalleryType, vcr: ViewContainerRef, to: number): CmsMediaGalleryRenderingComponent {
    const componentRef = this.createComponent(CmsMediaGalleryRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    componentRef.instance.type = type;
    componentRef.instance.initSetting();
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, false);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  checkContentManagementElement(type: string, vcr: ViewContainerRef, to: number): CmsContentManagementRenderingComponent {
    const componentRef = this.createComponent(CmsContentManagementRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    componentRef.instance.type = type;
    componentRef.instance.initSetting();
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, false);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    return componentRef.instance;
  }

  onLayoutEditorFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onLayoutEditorFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_LAYOUT);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setElementStyleToLayoutEffectFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setElementStyleToLayoutColumnFormValue();
    }, 0);
  }

  onLayoutEditorFocusComponent(component: CmsLayoutRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setLayoutEffectValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutColumnValueToElementStyle();
  }

  onRemoveCurrentComponent(event: boolean): void {
    if (!event) return;
    this.cmsEditService.onRemoveCurrentComponent(this.dragRef).pipe(takeUntil(this.destroy$)).subscribe();
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }

  onDecreaseDropIndex(): void {
    this.cmsEditService.onChangeLayoutIndex(this.el.nativeElement, 'desc');
    this.undoRedoService.addLayoutMoveUndo(this.el.nativeElement, 'desc');
  }

  onIncreaseDropIndex(): void {
    this.cmsEditService.onChangeLayoutIndex(this.el.nativeElement, 'asc');
    this.undoRedoService.addLayoutMoveUndo(this.el.nativeElement, 'asc');
  }
}
