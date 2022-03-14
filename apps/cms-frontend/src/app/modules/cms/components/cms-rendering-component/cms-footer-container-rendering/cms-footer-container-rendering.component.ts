import { DragDrop, DragRef, DropListRef, moveItemInArray, transferArrayItem } from '@angular/cdk/drag-drop';
import {
  AfterViewInit,
  Component,
  ComponentFactoryResolver,
  ComponentRef,
  ContentChildren,
  ElementRef,
  forwardRef,
  Injector,
  OnDestroy,
  OnInit,
  QueryList,
  Type,
  ViewChild,
  ViewContainerRef,
  ViewRef,
} from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import {
  ButtonType,
  EDropzoneType,
  EFontFamilyCode,
  ELayoutColumns,
  IRenderingComponentData,
  ITextSettingInit,
  IThemeOption,
  layoutEffectDefault,
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
  TextType,
  ThemeElementsType,
  UndoRedoEnum,
} from '@reactor-room/cms-models-lib';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Children, getRootViewRef } from 'apps/cms-frontend/src/app/shares/utils';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { Mixin } from 'ts-mixer';
import { ComponentCommonDirective } from '../../../directives/component-common/component-common.directive';
import { ComponentDesignDirective } from '../../../directives/component-design/component-design.directive';
import { ComponentSettingDirective } from '../../../directives/component-setting/component-setting.directive';
import { ComponentType, DragRefData, Dropped, DropZoneData } from '../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsCommonService } from '../../../services/cms-common.service';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CmsTemplateElementsComponent } from '../../cms-template-elements/cms-template-elements.component';
import { CmsButtonRenderingComponent } from '../cms-button-rendering/cms-button-rendering.component';
import { CmsContentManagementRenderingComponent } from '../cms-content-management-rendering/cms-content-management-rendering.component';
import { CmsLayoutRenderingComponent } from '../cms-layout-rendering/cms-layout-rendering.component';
import { CmsMediaGalleryRenderingComponent } from '../cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMediaSliderRenderingComponent } from '../cms-media-slider-rendering/cms-media-slider-rendering.component';
import { CmsMenuRenderingComponent } from '../cms-menu-rendering/cms-menu-rendering.component';
import { CmsThemeElementsRenderingComponent } from '../cms-template-elements-rendering/cms-template-elements-rendering.component';
import { CmsTextRenderingComponent } from '../cms-text-rendering/cms-text-rendering.component';
import { FOOTER_CONTAINER } from './token';

@Component({
  selector: 'cms-next-cms-footer-container-rendering',
  templateUrl: './cms-footer-container-rendering.component.html',
  styleUrls: ['./cms-footer-container-rendering.component.scss'],
  providers: [
    { provide: Children, useExisting: forwardRef(() => CmsFooterContainerRenderingComponent) },
    { provide: FOOTER_CONTAINER, useExisting: forwardRef(() => CmsFooterContainerRenderingComponent) },
  ],
})
export class CmsFooterContainerRenderingComponent
  extends Mixin(ComponentCommonDirective, ComponentDesignDirective, ComponentSettingDirective)
  implements OnInit, OnDestroy, AfterViewInit
{
  @ViewChild('footerContainerDropZone', { static: true }) footerContainerDropZone: ElementRef<HTMLElement>;
  @ViewChild('footerContainerInsertPoint', { static: true, read: ViewContainerRef }) footerContainerInsertPoint: ViewContainerRef;
  @ContentChildren(Children) public cmsComponentRenderingChildren!: QueryList<ComponentType>;
  private destroy$ = new Subject();
  public themeOption: IThemeOption;
  renderingComponentData$ = new Subject<IRenderingComponentData>();
  constructor(
    private cmsEditService: CmsEditService,
    private dragDrop: DragDrop,
    private resolver: ComponentFactoryResolver,
    private injector: Injector,
    private undoRedoService: UndoRedoService,
    private dialog: MatDialog,
    public sidebarService: CmsSidebarService,
    public el: ElementRef,
    public cmsPublishService: CmsPublishService,
    private cmsCommonService: CmsCommonService,
  ) {
    super(el, sidebarService, cmsPublishService);
  }

  ngOnInit(): void {
    this.renderingComponentData$
      .pipe(
        takeUntil(this.destroy$),
        tap((renderingData) => {
          if (renderingData) {
            if (renderingData.themeOption) {
              this.themeOption = renderingData.themeOption;
            }
            this.el.nativeElement.classList.add('rendering-item');
            const { options } = renderingData;
            if (options) {
            }
            const { commonSettings } = renderingData;
            if (commonSettings) {
              if (commonSettings.border) this.performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
              if (commonSettings.shadow) this.performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
              if (commonSettings.advance) this.performSetLayoutSettingAdvanceValueToElementStyle(commonSettings.advance);
              if (commonSettings.hover) this.performSetLayoutSettingHoverValueToElementStyle(commonSettings.hover);
              if (commonSettings.background) this.performSetLayoutSettingBackgroundValueToElementStyle(commonSettings.background);
              if (commonSettings.customize) this.performSetLayoutSettingCustomizeValueToElementStyle(commonSettings.customize);
            }
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.createDropZoneListRef();
    this.cmsEditService.footerDropListRef.dropped.pipe(takeUntil(this.destroy$)).subscribe((event) => {
      const {
        previousIndex: dropZonePreviousIndex,
        currentIndex: dropZoneCurrentIndex,
        previousContainer: dropZonePreviousContainer,
        container: dropZoneContainer,
        item: dropZoneItem,
      } = event;
      const dropZoneViewRefAndElementRefAndComponents = this.cmsEditService.getFooterDropZoneViewRefAndElementRefAndComponents();
      // DROP ZONE TO DROP ZONE
      if (dropZonePreviousContainer === dropZoneContainer) {
        if (dropZonePreviousIndex === dropZoneCurrentIndex) {
          return;
        }
        console.log('DROP ZONE TO DROP ZONE :>> ');
        const from = dropZoneViewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === dropZoneItem);
        const { component } = dropZoneViewRefAndElementRefAndComponents[from];
        this.moveViewRefTo(this.footerContainerInsertPoint, component.viewRef, dropZoneCurrentIndex);
        moveItemInArray(dropZoneViewRefAndElementRefAndComponents, from, dropZoneCurrentIndex);
        moveItemInArray(dropZonePreviousContainer.data.dragRefs, from, dropZoneCurrentIndex);
        const dropped: Dropped = {
          ...event,
          component,
        };
        if (!event.item.data?.undoRedoDropped) {
          this.undoRedoService.addDroppedUndoFromAction(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
          this.undoRedoService.addDroppedRedo(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
          this.undoRedoService.addDroppedUndo(dropped);
        }
        this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
      } else if (dropZonePreviousContainer === this.cmsEditService.menuDropListRef && dropZoneContainer === this.cmsEditService.footerDropListRef) {
        // MENU TO DROP ZONE
        console.log('MENU TO DROP ZONE :>> ');
        const type = dropZoneItem.data.type;
        const genericType = dropZoneItem.data.genericType;
        const dropZoneDropListRef = this.cmsEditService.dropZoneDropListRef;
        let createdComponent;
        if (genericType === MenuGenericType.TEMPLATE_ELEMENTS) {
          createdComponent = this.checkThemeElement(type, this.footerContainerInsertPoint, dropZoneCurrentIndex, dropZoneItem);
        } else if (genericType === MenuGenericType.LAYOUT) {
          createdComponent = this.checkLayoutElement(type, this.footerContainerInsertPoint, dropZoneCurrentIndex);
          event.item.data.component = createdComponent;
        } else {
          createdComponent = this.menuToDropZoneInitComponent(type, genericType, this.footerContainerInsertPoint, dropZoneCurrentIndex, dropZoneDropListRef);
        }
        const dropped: Dropped = { ...event, previousContainer: this.cmsEditService.removedDropListRef, component: createdComponent };
        if (!event.item.data?.undoRedoDropped) {
          this.undoRedoService.addDroppedUndoFromAction(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
          this.undoRedoService.addDroppedRedo(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
          this.undoRedoService.addDroppedUndo(dropped);
        }
        this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
      } else if (dropZonePreviousContainer === this.cmsEditService.removedDropListRef) {
        // Removed Zone to Drop Zone (Undo)
        console.log('from removed zone');
        const i = dropZonePreviousContainer.data.viewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === dropZoneItem);
        const component = dropZonePreviousContainer.data.viewRefAndElementRefAndComponents[i].component;
        this.moveViewRefTo(this.footerContainerInsertPoint, component.viewRef, dropZoneCurrentIndex);
        this.moveLayoutData(dropZonePreviousContainer, this.cmsEditService.footerDropListRef, i, dropZoneCurrentIndex);
        const dragRef = this.createAndInsertDragRefToContainer(
          component.el,
          dropZoneCurrentIndex,
          this.cmsEditService.footerDropListRef,
          dropZoneItem.data.type,
          dropZoneItem.data.genericType,
        );
        component.dragRef = dragRef;
        const dropped: Dropped = { ...event, item: dragRef, component };
        if (!event.item.data?.undoRedoDropped) {
          this.undoRedoService.addDroppedUndoFromAction(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
          this.undoRedoService.addDroppedRedo(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
          this.undoRedoService.addDroppedUndo(dropped);
        }
        this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
      } else {
        // Layout to Drop Zone
        console.log('layout container to drop zone');
        const from = dropZonePreviousContainer.data.viewRefAndElementRefAndComponents.findIndex((c) => c.component.dragRef === dropZoneItem);
        const { component } = dropZonePreviousContainer.data.viewRefAndElementRefAndComponents[from];
        console.log(this.footerContainerInsertPoint);
        this.moveViewRefTo(this.footerContainerInsertPoint, component.viewRef, dropZoneCurrentIndex);
        this.moveLayoutData(dropZonePreviousContainer, this.cmsEditService.footerDropListRef, from, dropZoneCurrentIndex);
        const dragRef = this.createAndInsertDragRefToContainer(
          component.el,
          dropZoneCurrentIndex,
          this.cmsEditService.footerDropListRef,
          dropZoneItem.data.type,
          dropZoneItem.data.genericType,
        );
        component.dragRef = dragRef;
        const dropped: Dropped = { ...event, item: dragRef, component };
        if (!event.item.data?.undoRedoDropped) {
          this.undoRedoService.addDroppedUndoFromAction(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Undo) {
          this.undoRedoService.addDroppedRedo(dropped);
        } else if (event.item.data.undoRedoDropped === UndoRedoEnum.Redo) {
          this.undoRedoService.addDroppedUndo(dropped);
        }
        this.cmsPublishService.savingTrigger$.next(Math.round(+new Date() / 1000));
      }
    });
  }

  ngAfterContentInit(): void {
    this.cmsComponentRenderingChildren.forEach((c, i) => {
      const rootViewRef = getRootViewRef(c) as ViewRef;
      this.footerContainerInsertPoint.move(rootViewRef, i);
    });
    this.cmsEditService.setFooterInsertPointContainer(this.footerContainerInsertPoint);
  }

  createDropZoneListRef(): void {
    const dropListRef = this.dragDrop.createDropList<DropZoneData>(this.footerContainerDropZone).withItems([]);
    dropListRef.sortingDisabled = false;
    dropListRef.data = { dragRefs: [], viewRefAndElementRefAndComponents: [], dropzoneType: EDropzoneType.THEME_FOOTER };
    this.cmsEditService.addFooterDropListRef(dropListRef);
  }

  moveViewRefTo(vcr: ViewContainerRef, viewRef: ViewRef, to: number): void {
    vcr.move(viewRef, to);
  }
  checkThemeElement(type: ThemeElementsType, vcr: ViewContainerRef, to: number, dragRef: DragRef): CmsThemeElementsRenderingComponent {
    const componentRef = this.createComponent(CmsThemeElementsRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    if (!type) {
      const dialogRef = this.dialog.open(CmsTemplateElementsComponent, {
        height: '90%',
      });
      dialogRef
        .afterClosed()
        .pipe(takeUntil(this.destroy$))
        .subscribe((selectedThemeId: ThemeElementsType) => {
          if (selectedThemeId) {
            componentRef.instance.type = selectedThemeId;
            dragRef.data.type = selectedThemeId;
          }
        });
    } else {
      componentRef.instance.type = type;
    }
    return componentRef.instance;
  }
  createComponent<T>(component: Type<T>): ComponentRef<T> {
    const factory = this.resolver.resolveComponentFactory<T>(component);
    const componentRef = factory.create(this.injector);
    componentRef.changeDetectorRef.detectChanges();
    return componentRef;
  }
  checkLayoutElement(type: ELayoutColumns, vcr: ViewContainerRef, to: number): CmsLayoutRenderingComponent {
    const componentRef = this.createComponent<CmsLayoutRenderingComponent>(CmsLayoutRenderingComponent);
    this.moveViewRefTo(vcr, componentRef.hostView, to);
    componentRef.instance.setInitLayoutColumnStyle(type);
    componentRef.instance.setInitLayoutColumnNumber(type);
    componentRef.instance.setLayoutTitle(type);
    componentRef.instance.layoutColumnValue = {
      column: type,
      gap: 20,
    };
    componentRef.instance.performSetLayoutEffectValueToElementStyle(layoutEffectDefault);
    componentRef.instance.performSetLayoutSettingBorderValueToElementStyle(layoutSettingBorderDefault);
    componentRef.instance.performsetLayoutSettingShadowValueToElementStyle(layoutSettingShadowDefault);
    componentRef.instance.performSetLayoutSettingHoverValueToElementStyle(layoutSettingHoverDefault);
    componentRef.instance.performSetLayoutSettingAdvanceValueToElementStyle(layoutSettingAdvanceDefault);
    componentRef.instance.performSetLayoutSettingBackgroundValueToElementStyle(layoutSettingBackgroundDefault);
    componentRef.instance.performSetLayoutSettingCustomizeValueToElementStyle(layoutSettingCustomizeDefault);
    this.cmsEditService.generateDynamicIDnStyles(componentRef.instance.nativeElement, false, true);
    return componentRef.instance;
  }
  moveLayoutData(fromContainer: DropListRef<DropZoneData>, toContainer: DropListRef<DropZoneData>, from: number, to: number): void {
    transferArrayItem(fromContainer.data.viewRefAndElementRefAndComponents, toContainer.data.viewRefAndElementRefAndComponents, from, to);
    const previousDragRefs = fromContainer.data.dragRefs;
    previousDragRefs[from].dispose();
    previousDragRefs.splice(from, 1);
    fromContainer.withItems(previousDragRefs);
  }
  createAndInsertDragRefToContainer(elementRef: ElementRef, at: number, container: DropListRef, type: MenuType, genericType: MenuGenericType): DragRef {
    const dragRef = this.dragDrop.createDrag<DragRefData>(elementRef);
    container.data.dragRefs.splice(at, 0, dragRef);
    container.withItems(container.data.dragRefs);
    dragRef.data = { dropListRef: container, type: type, genericType: genericType };
    this.cmsEditService.dragHandler(dragRef, this.destroy$);
    return dragRef;
  }
  menuToDropZoneInitComponent(type: MenuType, genericType: MenuGenericType, vcr: ViewContainerRef, to: number, dropListRef: DropListRef<DropZoneData>): ComponentType {
    switch (genericType) {
      case MenuGenericType.TEXT:
        return this.checkTextElement(type as TextType, vcr, to, dropListRef);
      case MenuGenericType.MEDIA_GALLERY:
        return this.checkMediaGalleryElement(type as MediaGalleryType, vcr, to);
      case MenuGenericType.MEDIA_SLIDER:
        return this.checkMediaSliderElement(type as MediaSliderType, vcr, to);
      case MenuGenericType.CONTENT_MANAGEMENT:
        return this.checkContentManagementElement(type as string, vcr, to);
      case MenuGenericType.BUTTON:
        return this.checkButtonElement(type as ButtonType, vcr, to);
      case MenuGenericType.MENU:
        return this.checkMenuElement(type as MenuRenderingType, vcr, to);
      default:
        break;
    }
  }
  checkTextElement(type: MenuType, vcr: ViewContainerRef, to: number, dropListRef: DropListRef<DropZoneData>): CmsTextRenderingComponent {
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
    return this.createTextRenderingComponentRefAndDragRefToContainer(vcr, to, dropListRef, setting, htmlContent);
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
  createTextRenderingComponentRefAndDragRefToContainer(
    vcr: ViewContainerRef,
    to: number,
    dropListRef: DropListRef<DropZoneData>,
    setting: ITextSettingInit,
    htmlContent: string,
  ): CmsTextRenderingComponent {
    const componentRef = this.createComponent(CmsTextRenderingComponent);
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
}
