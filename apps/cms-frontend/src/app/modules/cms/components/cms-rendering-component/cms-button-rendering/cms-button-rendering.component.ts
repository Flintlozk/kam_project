import { DragDrop, DragRef, DropListRef } from '@angular/cdk/drag-drop';
import { Attribute, Component, ElementRef, forwardRef, Inject, Input, OnDestroy, OnInit, Optional, ViewRef } from '@angular/core';
import {
  buttonDefaultSetting,
  ColumnType,
  IButtonBorder,
  IButtonHover,
  IButtonRenderingSetting,
  IButtonSetting,
  IButtonText,
  IGeneralLink,
  IRenderingComponentData,
  IThemeOption,
  MenuGenericType,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, clearDragRef, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { environment } from 'apps/cms-frontend/src/environments/environment';
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
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CmsEditThemeService } from '../../../services/cms-theme.service';
import { ContentContainer, CONTENT_CONTAINER } from '../cms-content-container-rendering/token';
import { FooterContainer, FOOTER_CONTAINER } from '../cms-footer-container-rendering/token';
import { HEADER_CONTAINER, HeaderContainer } from '../cms-header-container-rendering/token';
import { ParentLayoutContainer, PARENT_LAYOUT_CONTAINER } from '../cms-layout-rendering/token';

@Component({
  selector: 'cms-next-cms-button-rendering',
  templateUrl: './cms-button-rendering.component.html',
  styleUrls: ['./cms-button-rendering.component.scss'],
  providers: [{ provide: Children, useExisting: forwardRef(() => CmsButtonRenderingComponent) }],
  // eslint-disable-next-line @angular-eslint/no-host-metadata-property
  host: {
    class: environment.cms.CMS_FRONTEND_COMPONENT_CLASS,
  },
})
export class CmsButtonRenderingComponent extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective) implements OnInit, OnDestroy {
  public viewRef: ViewRef;
  public dragRef: DragRef<DragRefData>;
  public themeOption: IThemeOption;
  public onFocus = false;
  public componentType = 'CmsButtonRenderingComponent';
  private destroy$ = new Subject();
  isChildEnter = false;
  buttonData = deepCopy(buttonDefaultSetting);
  buttonSettingSubscription: Subscription;
  buttonBorderSubscription: Subscription;
  buttonTextSubscription: Subscription;
  buttonHoverSubscription: Subscription;
  generalLinkSettingSubscription: Subscription;
  changeDetectorTrigger = false;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  // eslint-disable-next-line @angular-eslint/no-input-rename
  @Input('column') @Attribute('column') public column: ColumnType;

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
              options = options as IButtonRenderingSetting;
              const { buttonSetting, buttonBorder, buttonText, generalLinkSetting, buttonHover } = options;
              if (buttonSetting) this.buttonData.buttonSetting = buttonSetting;
              if (buttonBorder) this.buttonData.buttonBorder = buttonBorder;
              if (buttonText) this.buttonData.buttonText = buttonText;
              if (generalLinkSetting) this.buttonData.generalLinkSetting = generalLinkSetting;
              if (buttonHover) this.buttonData.buttonHover = buttonHover;
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
  }

  insertComponentRef(viewRefAndElementRefAndComponents: ViewRefAndElementRefAndComponent[], at: number, viewRefAndElementRefAndComponent: ViewRefAndElementRefAndComponent): void {
    viewRefAndElementRefAndComponents.splice(at, 0, viewRefAndElementRefAndComponent);
  }

  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: null, genericType: MenuGenericType.BUTTON };
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

  onButtonFocusEvent(): void {
    if (this.isChildEnter) return;
    this.onButtonFocusComponent(this);
    this.sidebarService.setSidebarMode(null);
    setTimeout(() => {
      this.sidebarService.setSidebarMode(ESidebarMode.LAYOUT_SETTING);
      this.sidebarService.setSidebarLayoutMode(ESidebarMode.LAYOUT_SETTING_BUTTON);
      this.sidebarService.setSidebarLayoutTab(ESidebarLayoutTab.LAYOUT_DETAIL);
      this.setElementStyleToLayoutSettingBorderFormValue();
      this.setElementStyleToLayoutSettingShadowFormValue();
      this.setElementStyleToLayoutSettingAdvanceFormValue();
      this.setElementStyleToLayoutSettingBackgroundFormValue();
      this.setElementStyleToLayoutSettingHoverFormValue();
      this.setElementStyleToLayoutSettingCustomizeFormValue();
      this.setGeneralLinkSettingDataToFormValue();
      this.setButtonSettingDataToFormValue();
      this.setButtonBorderDataToFormValue();
      this.setButtonTextDataToFormValue();
      this.setButtonHoverDataToFormValue();
    }, 0);
  }

  onButtonFocusComponent(component: CmsButtonRenderingComponent): void {
    if (this !== component) return;
    this.cmsEditService.activeCurrentFocusComponent(component);
    this.setLayoutSettingBorderValueToElementStyle();
    this.setLayoutSettingShadowValueToElementStyle();
    this.setLayoutSettingAdvanceValueToElementStyle();
    this.setLayoutSettingBackgroundValueToElementStyle();
    this.setLayoutSettingCustomizeValueToElementStyle();
    this.setLayoutSettingHoverValueToElementStyle();
    this.setFormValueToGeneralLinkSettingData();
    this.setFormValueToButtonSettingData();
    this.setFormValueToButtonBorderData();
    this.setFormValueToButtonTextData();
    this.setFormValueToButtonHoverData();
  }

  saveButtonSettingData(): void {
    this.sidebarService.setButtonSettingValue(null);
  }

  setButtonSettingDataToFormValue(): void {
    this.sidebarService.setButtonSettingFormValue(this.buttonData.buttonSetting);
  }

  setFormValueToButtonSettingData(): void {
    if (this.buttonSettingSubscription) return;
    this.buttonSettingSubscription = this.sidebarService.getButtonSettingValue
      .pipe(
        startWith(this.buttonData.buttonSetting),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IButtonSetting, IButtonSetting]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.buttonData.buttonSetting = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  saveButtonBorderData(): void {
    this.sidebarService.setButtonBorderValue(null);
  }

  setButtonBorderDataToFormValue(): void {
    this.sidebarService.setButtonBorderFormValue(this.buttonData.buttonBorder);
  }

  setFormValueToButtonBorderData(): void {
    if (this.buttonBorderSubscription) return;
    this.buttonBorderSubscription = this.sidebarService.getButtonBorderValue
      .pipe(
        startWith(this.buttonData.buttonBorder),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IButtonBorder, IButtonBorder]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.buttonData.buttonBorder = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  saveButtonTextData(): void {
    this.sidebarService.setButtonTextValue(null);
  }

  setButtonTextDataToFormValue(): void {
    this.sidebarService.setButtonTextFormValue(this.buttonData.buttonText);
  }

  setFormValueToButtonTextData(): void {
    if (this.buttonTextSubscription) return;
    this.buttonTextSubscription = this.sidebarService.getButtonTextValue
      .pipe(
        startWith(this.buttonData.buttonText),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IButtonText, IButtonText]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.buttonData.buttonText = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  saveButtonHoverData(): void {
    this.sidebarService.setButtonHoverValue(null);
  }

  setButtonHoverDataToFormValue(): void {
    this.sidebarService.setButtonHoverFormValue(this.buttonData.buttonHover);
  }

  setFormValueToButtonHoverData(): void {
    if (this.buttonHoverSubscription) return;
    this.buttonHoverSubscription = this.sidebarService.getButtonHoverValue
      .pipe(
        startWith(this.buttonData.buttonHover),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IButtonHover, IButtonHover]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.buttonData.buttonHover = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  saveGeneralLinkSettingData(): void {
    this.sidebarService.setGeneralLinkSettingValue(null);
  }

  setFormValueToGeneralLinkSettingData(): void {
    if (this.generalLinkSettingSubscription) return;
    this.generalLinkSettingSubscription = this.sidebarService.getGeneralLinkSettingValue
      .pipe(
        startWith(this.buttonData.generalLinkSetting),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IGeneralLink, IGeneralLink]) => {
          if (!oldValue) return;
          if (oldValue !== newVaLue && newVaLue) {
            this.buttonData.generalLinkSetting = newVaLue;
            this.changeDetectorTrigger = !this.changeDetectorTrigger;
            this.cmsPublishService.savingTrigger$.next(newVaLue);
          }
        }),
      )
      .subscribe();
  }

  setGeneralLinkSettingDataToFormValue(): void {
    this.sidebarService.setGeneralLinkSettingFormValue(this.buttonData.generalLinkSetting);
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
