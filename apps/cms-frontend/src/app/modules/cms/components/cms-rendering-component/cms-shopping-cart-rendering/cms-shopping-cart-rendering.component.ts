import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Attribute, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, ViewRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import {
  ColumnType,
  EBackgroundSize,
  HoverAnimationTypes,
  IRenderingComponentData,
  IShoppingCartMediaFormValues,
  IShoppingCartPatternSetting,
  IShoppingCartRenderingSetting,
  IThemeOption,
  MenuGenericType,
  ShoppingCartPatternBottomTypes,
  ShoppingCartPatternPaginationTypes,
  shoppingCartSaveData,
  ShoppingCartTypes,
} from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { IProductDiscountPercent, IProductList } from '@reactor-room/itopplus-model-lib';
import { ITableFilter } from '@reactor-room/model-lib';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, clearDragRef, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { environment, textDefault } from 'apps/cms-frontend/src/environments/environment';
import { isEmpty } from 'lodash';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { ESidebarMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { ESidebarLayoutTab } from '../../../containers/cms-sidebar/components/cms-layout/cms-layout.model';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { DragRefData, ViewRefAndElementRefAndComponent } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsProductService } from '../../../services/cms-product.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { ContentContainer, CONTENT_CONTAINER } from '../cms-content-container-rendering/token';
import { FooterContainer, FOOTER_CONTAINER } from '../cms-footer-container-rendering/token';
import { HeaderContainer, HEADER_CONTAINER } from '../cms-header-container-rendering/token';
import { ParentLayoutContainer, PARENT_LAYOUT_CONTAINER } from '../cms-layout-rendering/token';

const DEFAULT_MORE_BTN_TEXT = 'More';
const DEFAULT_MEDIA_WIDTH = 400;
const DEFAULT_MEDIA_HEIGHT = 350;
@Component({
  selector: 'cms-next-cms-shopping-cart-rendering',
  templateUrl: './cms-shopping-cart-rendering.component.html',
  styleUrls: ['./cms-shopping-cart-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsShoppingCartRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsShoppingCartRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, OnDestroy {
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public themeOption: IThemeOption;
  public onFocus = false;
  public componentType = 'CmsShoppingCartRenderingComponent';
  public shoppingCartRenderType: ShoppingCartTypes;
  isChildEnter = false;
  changeDetectorTrigger = false;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  ShoppingCartTypes = ShoppingCartTypes;
  private destroy$ = new Subject();

  ShoppingCartPatternPaginationTypes = ShoppingCartPatternPaginationTypes;
  ShoppingCartPatternBottomTypes = ShoppingCartPatternBottomTypes;
  tableFilters: ITableFilter = {
    search: '',
    currentPage: 1,
    pageSize: 4,
    orderBy: ['updated_at'],
    orderMethod: 'desc',
    dropDownID: null,
  };
  productList: IProductList[] = null;
  storedProductList: IProductList[] = null;
  noOfStars = 5;
  noOfStarsArray = Array.from(Array(this.noOfStars).keys());
  enableStarColor = '#F2C938';
  disableStarColor = '#D6DBE3';
  currencySymbol = '฿';
  secondaryPrice = 1;
  totalPages = 10;
  shoppingCartSaveData = deepCopy(shoppingCartSaveData);

  paginationType = textDefault.defaultPaginationStyle;
  paginationMode = ShoppingCartPatternBottomTypes.PAGINATION;

  iconPath = 'assets/cms/icon/';
  arrowRightLight = `${this.iconPath}arrow-right-light.svg`;
  arrowRightDark = `${this.iconPath}arrow-right-dark.svg`;
  arrowLeftLight = `${this.iconPath}arrow-left-light.svg`;
  arrowLeftDark = `${this.iconPath}arrow-left-dark.svg`;

  dummyPagination = [1, 2, 3];
  currentPage = 1;

  mediaWidth = DEFAULT_MEDIA_WIDTH;
  mediaHeight = DEFAULT_MEDIA_HEIGHT;
  moreBtnText = DEFAULT_MORE_BTN_TEXT;

  discountPercents: IProductDiscountPercent[] = [
    {
      percent: 30,
      bgColor: '#F9A68B',
    },
    {
      percent: 50,
      bgColor: '#384460',
    },
    {
      percent: 70,
      bgColor: '#898582',
    },
  ];
  productLimit: number;
  hoverAnimationClass: string;
  HoverAnimationTypes = HoverAnimationTypes;
  backgroundSizeImageScale: EBackgroundSize;

  constructor(
    public el: ElementRef,
    public sidebarService: CmsSidebarService,
    public cmsPublishService: CmsPublishService,
    private cmsEditService: CmsEditService,
    private snackBar: MatSnackBar,
    private cmsProductService: CmsProductService,
    private dragDrop: DragDrop,
    private undoRedoService: UndoRedoService,
    @Optional() @Inject(PARENT_LAYOUT_CONTAINER) private parentLayoutContainer: ParentLayoutContainer,
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
        tap((renderingData) => {
          if (renderingData) {
            this.el.nativeElement.classList.add('rendering-item');
            if (renderingData?.themeOption) {
              this.themeOption = renderingData.themeOption;
            }
            let { options } = renderingData;
            if (options) {
              options = options as IShoppingCartRenderingSetting;
              const { pattern } = options;
              if (pattern) this.shoppingCartSaveData.pattern = pattern;
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
    }, 0);
  }

  setPatterAdvanceSetting(): void {
    this.shoppingCartSaveData.pattern.advanceSetting = {
      options: ShoppingCartPatternBottomTypes.NONE,
      button: {
        name: null,
        link: null,
        openType: null,
      },
      pagination: {
        type: ShoppingCartPatternPaginationTypes.PAGINATION_1,
      },
    };
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
    this.getProductList();
  }

  getProductList() {
    this.cmsProductService
      .getProductAllList(this.tableFilters)
      .pipe(
        tap((products) => {
          this.storedProductList = deepCopy(products);
          this.productList = products;
        }),
        catchError(() => {
          this.showUnexpectedError();
          this.ngOnDestroy();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  showUnexpectedError(message: string = 'Unexpected Error occured...Try again later!'): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: null, genericType: MenuGenericType.SHOPPING_CART };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    return dragRef;
  }

  onShoppingCartFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onShoppingCartFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_SHOPPING_CART);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setShoppingCartPatternDataToForm();
      //this.setGeneralLinkSettingDataToFormValue();
      // this.setButtonSettingDataToFormValue();
      // this.setButtonBorderDataToFormValue();
      // this.setButtonTextDataToFormValue();
      // this.setButtonHoverDataToFormValue();
    }, 0);
  }

  setShoppingCartPatternDataToForm(): void {
    this.sidebarService.setShoppingCartPatternSettingFormValue(this.shoppingCartSaveData.pattern);
  }

  onShoppingCartFocusComponent(component: CmsShoppingCartRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setShoppingCartPatternChange();
    this.setShoppingCartMediaChanges();
    // this.setFormValueToGeneralLinkSettingData();
    // this.setFormValueToButtonSettingData();
    // this.setFormValueToButtonBorderData();
    // this.setFormValueToButtonTextData();
    // this.setFormValueToButtonHoverData();
  }

  setShoppingCartMediaChanges(): void {
    this.sidebarService.getSidebarShoppingCartMediaChange
      .pipe(
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value: IShoppingCartMediaFormValues) => {
          if (isEmpty(value)) return;
          const { widthPx, heightPx, hoverAnimation, imageScale } = value;
          this.backgroundSizeImageScale = imageScale;
          this.mediaWidth = widthPx || DEFAULT_MEDIA_WIDTH;
          this.mediaHeight = heightPx || DEFAULT_MEDIA_HEIGHT;
          this.setHoverAnimation(hoverAnimation);
        }),
      )
      .subscribe();
  }

  setHoverAnimation(hoverAnimation: HoverAnimationTypes): void {
    if (hoverAnimation === HoverAnimationTypes.NONE) {
      this.hoverAnimationClass = '';
    } else {
      this.hoverAnimationClass = hoverAnimation;
    }
  }

  setShoppingCartPatternChange(): void {
    this.sidebarService.getSidebarShoppingCartPatternChange
      .pipe(
        startWith(this.shoppingCartSaveData.pattern),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            newVaLue = newVaLue as IShoppingCartPatternSetting;
            if (isEmpty(newVaLue)) return;
            this.shoppingCartSaveData.pattern = newVaLue;
            if (isEmpty(newVaLue.advanceSetting)) return;
            const {
              pagination: { type },
              options,
              button: { name },
            } = newVaLue.advanceSetting;
            this.paginationType = type;
            this.paginationMode = options;
            this.moreBtnText = name || DEFAULT_MORE_BTN_TEXT;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
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

  onRemoveCurrentComponent(): void {
    this.cmsEditService.onRemoveCurrentComponent(this.dragRef).subscribe();
  }

  mouseEnterEvent(): void {
    this.isChildEnter = true;
  }

  mouseLeaveEvent(): void {
    this.isChildEnter = false;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
    clearDragRef(this.dragRef);
  }
}
