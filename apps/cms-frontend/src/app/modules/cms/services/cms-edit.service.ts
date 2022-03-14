import { DragRef, DropListRef, moveItemInArray } from '@angular/cdk/drag-drop';
import { Injectable, ViewContainerRef } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MenuGenericType } from '@reactor-room/cms-models-lib';
import { BehaviorSubject, EMPTY, Observable, Subject } from 'rxjs';
import { switchMap, takeUntil } from 'rxjs/operators';
import { ConfirmDialogComponent } from '../../../components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from '../../../components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { CmsButtonRenderingComponent } from '../components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { CmsContentManagementLandingRenderingComponent } from '../components/cms-rendering-component/cms-content-management-landing-rendering/cms-content-management-landing-rendering.component';
import { CmsContentManagementRenderingComponent } from '../components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { CmsLayoutRenderingComponent } from '../components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.component';
import { CmsMediaGalleryItemRenderingComponent } from '../components/cms-rendering-component/cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.component';
import { CmsMediaGalleryRenderingComponent } from '../components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMenuRenderingComponent } from '../components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { CmsThemeRenderingComponent } from '../components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ESidebarMode } from '../containers/cms-sidebar/cms-sidebar.model';
import {
  ComponentCommonType,
  ComponentType,
  DragRefs,
  DropZoneData,
  EDropzoneType,
  LayoutData,
  ViewRefAndElementRefAndComponent,
} from '../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsSidebarService } from './cms-sidebar.service';
@Injectable()
export class CmsEditService {
  currentComponent: ComponentType;

  dropZoneDropListRef: DropListRef<DropZoneData>;
  headerDropListRef: DropListRef<DropZoneData>;
  footerDropListRef: DropListRef<DropZoneData>;

  menuDropListRef: DropListRef<DragRefs>;
  removedDropListRef: DropListRef<LayoutData>;
  layoutDropListRefs: DropListRef<DropZoneData>[] = [];

  contentInsertPointContainer = new BehaviorSubject<ViewContainerRef>(null);
  headerInsertPointContainer = new BehaviorSubject<ViewContainerRef>(null);
  footerInsertPointContainer = new BehaviorSubject<ViewContainerRef>(null);
  //getMainInsertPointContainer = this.mainInsertPointContainer.asObservable();
  constructor(private dialog: MatDialog, private sideBarService: CmsSidebarService) {}

  setContentInsertPointContainer(viewContainerRef: ViewContainerRef): void {
    this.contentInsertPointContainer.next(viewContainerRef);
  }
  setHeaderInsertPointContainer(viewContainerRef: ViewContainerRef): void {
    this.headerInsertPointContainer.next(viewContainerRef);
  }
  setFooterInsertPointContainer(viewContainerRef: ViewContainerRef): void {
    this.footerInsertPointContainer.next(viewContainerRef);
  }

  addMenuDragRef(dragRef: DragRef): void {
    this.getMenuDragRefs().push(dragRef);
    if (this.menuDropListRef) {
      this.menuDropListRef.withItems(this.getMenuDragRefs());
    }
  }

  addDragRef(dragRef: DragRef, index: number): void {
    this.getDragRefs().splice(index, 0, dragRef);
    if (this.dropZoneDropListRef) {
      this.dropZoneDropListRef.withItems(this.getDragRefs());
    }
  }

  getDragRefs(): DragRef[] {
    return this.dropZoneDropListRef.data.dragRefs;
  }

  clearMenuDragRefs(): void {
    if (this.menuDropListRef?.data) this.menuDropListRef.data.dragRefs = [];
  }

  getMenuDragRefs(): DragRef[] {
    return this.menuDropListRef?.data?.dragRefs;
  }

  addRemovedDropListRef(dropListRef: DropListRef): void {
    this.removedDropListRef = dropListRef;
    if (this.dropZoneDropListRef) {
      this.removedDropListRef.connectedTo([...this.layoutDropListRefs, this.dropZoneDropListRef, this.headerDropListRef, this.footerDropListRef]);
      this.removedDropListRef.withItems([]);
    }
  }

  addMenuDropListRef(dropListRef: DropListRef): void {
    this.menuDropListRef = dropListRef;
  }

  addDropListRef(dropListRef: DropListRef): void {
    this.dropZoneDropListRef = dropListRef;
  }

  addHeaderDropListRef(dropListRef: DropListRef): void {
    this.headerDropListRef = dropListRef;
  }

  addFooterDropListRef(dropListRef: DropListRef): void {
    this.footerDropListRef = dropListRef;
    this.menuDropListRef.connectedTo([this.dropZoneDropListRef, this.headerDropListRef, this.footerDropListRef]);
    this.dropZoneDropListRef.connectedTo([this.headerDropListRef, this.footerDropListRef]);
    this.headerDropListRef.connectedTo([this.dropZoneDropListRef, this.footerDropListRef]);
    this.footerDropListRef.connectedTo([this.headerDropListRef, this.dropZoneDropListRef]);
  }

  getDropZoneViewRefAndElementRefAndComponents(): ViewRefAndElementRefAndComponent[] {
    return this.dropZoneDropListRef?.data?.viewRefAndElementRefAndComponents;
  }
  getHeaderDropZoneViewRefAndElementRefAndComponents(): ViewRefAndElementRefAndComponent[] {
    return this.headerDropListRef?.data?.viewRefAndElementRefAndComponents;
  }
  getFooterDropZoneViewRefAndElementRefAndComponents(): ViewRefAndElementRefAndComponent[] {
    return this.footerDropListRef?.data?.viewRefAndElementRefAndComponents;
  }

  activeCurrentFocusComponent(component: ComponentType): void {
    if (this.currentComponent !== component) {
      if (this.currentComponent) {
        this.currentComponent.onFocus = false;
        if (this.currentComponent.dragRef) {
          if (this.currentComponent.themeOption) {
            this.currentComponent.dragRef.disabled = true;
          } else this.currentComponent.dragRef.disabled = false;
        }

        switch (this.currentComponent.componentType) {
          case 'CmsThemeRenderingComponent':
            this.deactiveCmsThemeRenderingComponent();
            break;
          case 'CmsLayoutRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsLayoutRenderingComponent();
            break;
          case 'CmsContainerRenderingComponent':
            this.deactiveCommonRenderingComponent();
            break;
          case 'CmsTextRenderingComponent':
            this.deactiveCommonRenderingComponent();
            break;
          case 'CmsMediaGalleryRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsMediaGalleryRenderingComponent();
            break;
          case 'CmsMediaGalleryItemRenderingComponent':
            this.deactiveCmsMediaGalleryItemRenderingComponent();
            break;
          case 'CmsMediaSliderRenderingComponent':
            this.deactiveCommonRenderingComponent();
            break;
          case 'CmsContentManagementRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsContentManagementRenderingComponent();
            break;
          case 'CmsContentManagementLandingRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsContentManagementLandingRenderingComponent;
            break;
          case 'CmsButtonRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsButtonRenderingComponent();
            break;
          case 'CmsMenuRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsMenuRenderingComponent();
            break;
          case 'CmsShoppingCartRenderingComponent':
            this.deactiveCommonRenderingComponent();
            this.deactiveCmsShoppingCartRenderingComponent();
            break;
          default:
            break;
        }
      }
      this.currentComponent = component;
      component.onFocus = true;
      if (component.dragRef) component.dragRef.disabled = true;
    }
  }

  deactiveCmsShoppingCartRenderingComponent(): void {
    console.error('need to deactive this');
  }

  deactiveCmsMenuRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsMenuRenderingComponent;
    this.currentComponent.saveMenuSourceData();
    if (!this.currentComponent.menuSourceSubscription.closed) {
      this.currentComponent.menuSourceSubscription.unsubscribe();
    }
    this.currentComponent.menuSourceSubscription = undefined;
    this.currentComponent.saveMenuLevelOneData();
    if (!this.currentComponent.menuLevelOneSubscription.closed) {
      this.currentComponent.menuLevelOneSubscription.unsubscribe();
    }
    this.currentComponent.menuLevelOneSubscription = undefined;
    this.currentComponent.saveMenuLevelTwoData();
    if (!this.currentComponent.menuLevelTwoSubscription.closed) {
      this.currentComponent.menuLevelTwoSubscription.unsubscribe();
    }
    this.currentComponent.menuLevelTwoSubscription = undefined;
    this.currentComponent.saveMenuLevelThreeData();
    if (!this.currentComponent.menuLevelThreeSubscription.closed) {
      this.currentComponent.menuLevelThreeSubscription.unsubscribe();
    }
    this.currentComponent.menuLevelThreeSubscription = undefined;
    this.currentComponent.saveMenuLevelFourData();
    if (!this.currentComponent.menuLevelFourSubscription.closed) {
      this.currentComponent.menuLevelFourSubscription.unsubscribe();
    }
    this.currentComponent.menuLevelFourSubscription = undefined;
    this.currentComponent.saveMenuMobileHamburgerData();
    if (!this.currentComponent.menuMobileHamburgerSubscription.closed) {
      this.currentComponent.menuMobileHamburgerSubscription.unsubscribe();
    }
    this.currentComponent.menuMobileHamburgerSubscription = undefined;
    this.currentComponent.saveMenuMobileIconData();
    if (!this.currentComponent.menuMobileIconSubscription.closed) {
      this.currentComponent.menuMobileIconSubscription.unsubscribe();
    }
    this.currentComponent.menuMobileIconSubscription = undefined;
    this.currentComponent.saveMenuSettingStickyData();
    if (!this.currentComponent.menuSettingStickySubscription.closed) {
      this.currentComponent.menuSettingStickySubscription.unsubscribe();
    }
    this.currentComponent.menuSettingStickySubscription = undefined;
    this.currentComponent.saveMenuSettingAnimationData();
    if (!this.currentComponent.menuSettingAnimationSubscription.closed) {
      this.currentComponent.menuSettingAnimationSubscription.unsubscribe();
    }
    this.currentComponent.menuSettingAnimationSubscription = undefined;
    this.currentComponent.saveMenuSettingStyleData();
    if (!this.currentComponent.menuSettingStyleSubscription.closed) {
      this.currentComponent.menuSettingStyleSubscription.unsubscribe();
    }
    this.currentComponent.menuSettingStyleSubscription = undefined;
    this.currentComponent.saveMenuSettingIconData();
    if (!this.currentComponent.menuSettingIconSubscription.closed) {
      this.currentComponent.menuSettingIconSubscription.unsubscribe();
    }
    this.currentComponent.menuSettingIconSubscription = undefined;
    this.currentComponent.saveMenuSettingMegaData();
    if (!this.currentComponent.menuSettingMegaSubscription.closed) {
      this.currentComponent.menuSettingMegaSubscription.unsubscribe();
    }
    this.currentComponent.menuSettingMegaSubscription = undefined;
  }

  deactiveCmsButtonRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsButtonRenderingComponent;
    this.currentComponent.saveButtonSettingData();
    if (!this.currentComponent.buttonSettingSubscription.closed) {
      this.currentComponent.buttonSettingSubscription.unsubscribe();
    }
    this.currentComponent.buttonSettingSubscription = undefined;
    this.currentComponent.saveButtonBorderData();
    if (!this.currentComponent.buttonBorderSubscription.closed) {
      this.currentComponent.buttonBorderSubscription.unsubscribe();
    }
    this.currentComponent.buttonBorderSubscription = undefined;
    this.currentComponent.saveButtonTextData();
    if (!this.currentComponent.buttonTextSubscription.closed) {
      this.currentComponent.buttonTextSubscription.unsubscribe();
    }
    this.currentComponent.buttonTextSubscription = undefined;
    this.currentComponent.saveButtonHoverData();
    if (!this.currentComponent.buttonHoverSubscription.closed) {
      this.currentComponent.buttonHoverSubscription.unsubscribe();
    }
    this.currentComponent.buttonHoverSubscription = undefined;
  }

  deactiveCmsContentManagementRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsContentManagementRenderingComponent;
    this.currentComponent.saveContentManageGeneral();
    if (!this.currentComponent.contentManageGeneralSubscription.closed) {
      this.currentComponent.contentManageGeneralSubscription.unsubscribe();
    }
    this.currentComponent.contentManageGeneralSubscription = undefined;
    this.currentComponent.saveContentManageContents();
    if (!this.currentComponent.contentManageContentsSubscription.closed) {
      this.currentComponent.contentManageContentsSubscription.unsubscribe();
    }
    this.currentComponent.contentManageContentsSubscription = undefined;
    this.currentComponent.saveContentManageLanding();
    if (!this.currentComponent.contentManageLandingSubscription.closed) {
      this.currentComponent.contentManageLandingSubscription.unsubscribe();
    }
    this.currentComponent.contentManageLandingSubscription = undefined;
  }

  deactiveCmsContentManagementLandingRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsContentManagementLandingRenderingComponent;
    this.currentComponent.contentManageLandingSubscription = undefined;
    this.currentComponent.saveContentManageLanding();
    if (!this.currentComponent.contentManageLandingSubscription.closed) {
      this.currentComponent.contentManageLandingSubscription.unsubscribe();
    }
  }

  deactiveCmsMediaGalleryItemRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsMediaGalleryItemRenderingComponent;
    this.currentComponent.saveElementStyleToLayoutSettingBackgroundValue();
    if (!this.currentComponent.layoutSettingBackgroundSubscription.closed) {
      this.currentComponent.layoutSettingBackgroundSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingBackgroundSubscription = undefined;
    this.currentComponent.saveGeneralLinkSettingData();
    if (!this.currentComponent.generalLinkSettingSubscription.closed) {
      this.currentComponent.generalLinkSettingSubscription.unsubscribe();
    }
    this.currentComponent.generalLinkSettingSubscription = undefined;
    this.currentComponent.saveGeneralTextSettingData();
    if (!this.currentComponent.generalTextSettingSubscription.closed) {
      this.currentComponent.generalTextSettingSubscription.unsubscribe();
    }
    this.currentComponent.generalTextSettingSubscription = undefined;
  }
  deactiveCmsMediaGalleryRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsMediaGalleryRenderingComponent;
    this.currentComponent.saveMediaGallerySettingData();
    if (!this.currentComponent.mediaGallerySettingSubscription.closed) {
      this.currentComponent.mediaGallerySettingSubscription.unsubscribe();
    }
    this.currentComponent.mediaGallerySettingSubscription = undefined;
    this.currentComponent.saveMediaGalleryControlData();
    if (!this.currentComponent.mediaGalleryControlSubscription.closed) {
      this.currentComponent.mediaGalleryControlSubscription.unsubscribe();
    }
    this.currentComponent.mediaGalleryControlSubscription = undefined;
  }

  deactiveCmsThemeRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsThemeRenderingComponent;
    this.currentComponent.saveElementStyleToThemeSettingCustomizeValue();
    if (!this.currentComponent.themeSettingCustomizeSubscription.closed) {
      this.currentComponent.themeSettingCustomizeSubscription.unsubscribe();
    }
    this.currentComponent.themeSettingCustomizeSubscription = undefined;
    this.currentComponent.saveThemeGeneralSettingData();
    if (!this.currentComponent.themeGeneralSettingSubscription.closed) {
      this.currentComponent.themeGeneralSettingSubscription.unsubscribe();
    }
    this.currentComponent.themeGeneralSettingSubscription = undefined;
    // this.currentComponent.saveThemeDeviceSettingData();
    // this.currentComponent.themeDeviceSettingSubscription.unsubscribe();
    // this.currentComponent.themeDeviceSettingSubscription = undefined;
    // this.currentComponent.saveThemeColorSettingData();
    // this.currentComponent.themeColorSettingSubscription.unsubscribe();
    // this.currentComponent.themeColorSettingSubscription = undefined;
    // this.currentComponent.saveThemeFontSettingData();
    // this.currentComponent.themeFontSettingSubscription.unsubscribe();
    // this.currentComponent.themeFontSettingSubscription = undefined;
  }

  deactiveCommonRenderingComponent(): void {
    this.currentComponent = this.currentComponent as ComponentCommonType;
    this.currentComponent.saveElementStyleToLayoutSettingBorderValue();
    if (!this.currentComponent.layoutSettingBorderSubscription.closed) {
      this.currentComponent.layoutSettingBorderSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingBorderSubscription = undefined;
    this.currentComponent.saveElementStyleToLayoutSettingShadowValue();
    if (!this.currentComponent.layoutSettingShadowSubscription.closed) {
      this.currentComponent.layoutSettingShadowSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingShadowSubscription = undefined;
    this.currentComponent.saveElementStyleToLayoutSettingAdvanceValue();
    if (!this.currentComponent.layoutSettingAdvanceSubscription.closed) {
      this.currentComponent.layoutSettingAdvanceSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingAdvanceSubscription = undefined;
    this.currentComponent.saveElementStyleToLayoutSettingBackgroundValue();
    if (!this.currentComponent.layoutSettingBackgroundSubscription.closed) {
      this.currentComponent.layoutSettingBackgroundSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingBackgroundSubscription = undefined;
    this.currentComponent.saveElementStyleToLayoutSettingCustomizeValue();
    if (!this.currentComponent.layoutSettingCustomizeSubscription.closed) {
      this.currentComponent.layoutSettingCustomizeSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingCustomizeSubscription = undefined;

    this.currentComponent.saveElementStyleToLayoutSettingHoverValue();
    if (!this.currentComponent.layoutSettingHoverSubscription.closed) {
      this.currentComponent.layoutSettingHoverSubscription.unsubscribe();
    }
    this.currentComponent.layoutSettingHoverSubscription = undefined;
  }

  deactiveCmsLayoutRenderingComponent(): void {
    this.currentComponent = this.currentComponent as CmsLayoutRenderingComponent;
    this.currentComponent.saveElementStyleToLayoutColumnValue();
    if (!this.currentComponent.layoutColumnSubscription.closed) {
      this.currentComponent.layoutColumnSubscription.unsubscribe();
    }
    this.currentComponent.layoutColumnSubscription = undefined;
    this.currentComponent.saveElementStyleToLayoutEffectValue();
    if (!this.currentComponent.layoutEffectSubscription.closed) {
      this.currentComponent.layoutEffectSubscription.unsubscribe();
    }
    this.currentComponent.layoutEffectSubscription = undefined;
  }

  dragHandler<T>(dragRef: DragRef, destroy$: Subject<T>): void {
    dragRef.entered.pipe(takeUntil(destroy$)).subscribe((event) => {
      const container = event.container.element as HTMLElement;
      const dragElement = event.item.getRootElement() as HTMLElement;
      const placeHolderElement = document.querySelector('.cdk-drag-placeholder') as HTMLElement;
      const isDragItemLayout = event.item.data.genericType === MenuGenericType.LAYOUT;
      const isDropToLayout = event.container.data.dropzoneType === EDropzoneType.LAYOUT;
      const isThemeElement = event.item.data.genericType === MenuGenericType.TEMPLATE_ELEMENTS;
      if (isDropToLayout && (isDragItemLayout || isThemeElement)) {
        container.classList.add('drag-invalid');
        container.classList.remove('drag-valid');
      } else {
        container.classList.add('drag-valid');
        container.classList.remove('drag-invalid');
      }
      if (isDropToLayout && !event.container.data.viewRefAndElementRefAndComponents.length) {
        if (placeHolderElement) {
          placeHolderElement.style.position = 'absolute';
          placeHolderElement.style.opacity = '0';
        }
      } else {
        if (placeHolderElement) {
          placeHolderElement.style.position = '';
          placeHolderElement.style.opacity = '';
        }
      }
      document.getElementsByTagName('BODY')[0].classList.add('on-drag');
      dragElement.classList.add('on-drag');
    });
    dragRef.exited.pipe(takeUntil(destroy$)).subscribe((event) => {
      const container = event.container.element as HTMLElement;
      const dragElement = event.item.getRootElement() as HTMLElement;
      const placeHolderElement = document.querySelector('.cdk-drag-placeholder') as HTMLElement;
      container.classList.remove('drag-invalid');
      container.classList.remove('drag-valid');
      document.getElementsByTagName('BODY')[0].classList.remove('on-drag');
      container.classList.remove('on-drag');
      dragElement.classList.remove('on-drag');
      if (placeHolderElement) {
        placeHolderElement.style.position = '';
        placeHolderElement.style.opacity = '';
      }
    });
    dragRef.dropped.pipe(takeUntil(destroy$)).subscribe((event) => {
      const container = event.container.element as HTMLElement;
      const dragElement = event.item.getRootElement() as HTMLElement;
      const placeHolderElement = document.querySelector('.cdk-drag-placeholder') as HTMLElement;
      container.classList.remove('drag-invalid');
      container.classList.remove('drag-valid');
      document.getElementsByTagName('BODY')[0].classList.remove('on-drag');
      container.classList.remove('on-drag');
      dragElement.classList.remove('on-drag');
      if (placeHolderElement) {
        placeHolderElement.style.position = '';
        placeHolderElement.style.opacity = '';
      }
    });
  }

  onChangeLayoutIndex(nativeElement: HTMLElement, key: string): void {
    // TODO
    const currentId = nativeElement.getAttribute('id');
    const viewRefAndElementRefs = this.getDropZoneViewRefAndElementRefAndComponents();
    let viewRefAndElementRef: ViewRefAndElementRefAndComponent = null;
    viewRefAndElementRefs.forEach((item) => {
      const nativeElementId = item.component.el.nativeElement.getAttribute('id');
      if (nativeElementId === currentId) {
        viewRefAndElementRef = item;
      }
    });
    const currentIndex = viewRefAndElementRefs.indexOf(viewRefAndElementRef);
    const length = viewRefAndElementRefs.length;
    switch (key) {
      case 'asc':
        if (currentIndex < length - 1) {
          this.contentInsertPointContainer.value.move(viewRefAndElementRef.component.viewRef, currentIndex + 1);
          moveItemInArray(viewRefAndElementRefs, currentIndex, currentIndex + 1);
          viewRefAndElementRefs[currentIndex + 1].component.el.nativeElement.style.animation = 'moveDown 0.3s';
          viewRefAndElementRefs[currentIndex].component.el.nativeElement.style.animation = 'moveUp 0.3s';
        }
        break;
      case 'desc':
        if (currentIndex > 0) {
          this.contentInsertPointContainer.value.move(viewRefAndElementRef.component.viewRef, currentIndex - 1);
          moveItemInArray(viewRefAndElementRefs, currentIndex, currentIndex - 1);
          viewRefAndElementRefs[currentIndex - 1].component.el.nativeElement.style.animation = 'moveUp 0.3s';
          viewRefAndElementRefs[currentIndex].component.el.nativeElement.style.animation = 'moveDown 0.3s';
        }
        break;
      default:
        break;
    }
  }

  onRemoveCurrentComponent(dragRef: DragRef): Observable<never> {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Delete Confirm',
        content: 'Are you sure to remove this component?',
      } as ConfirmDialogModel,
    });
    return dialogRef.afterClosed().pipe(
      switchMap((result) => {
        if (result) {
          const dropListRef = dragRef.data.dropListRef as DropListRef;
          const dragRefIndex = dropListRef.getItemIndex(dragRef);
          this.removedDropListRef.dropped.next({
            previousContainer: dropListRef,
            container: this.removedDropListRef as DropListRef,
            item: dragRef,
            previousIndex: dragRefIndex,
            currentIndex: 0,
            isPointerOverContainer: false,
            distance: null,
            dropPoint: null,
          });
          this.sideBarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
        }
        return EMPTY;
      }),
    );
  }

  generateDynamicIDnStyles(nativeElement: HTMLElement, theme?: boolean, layout?: boolean): void {
    const customId = nativeElement.getAttribute('id') ? nativeElement.getAttribute('id') : Date.now();
    if (theme) nativeElement.setAttribute('id', `theme-${customId}`);
    else if (layout) {
      nativeElement.setAttribute('id', nativeElement.getAttribute('id') ? nativeElement.getAttribute('id') : `layout-${customId}`);
      this.setContainerIDs(nativeElement);
    } else {
      nativeElement.style.position = 'relative';
      nativeElement.setAttribute('id', nativeElement.getAttribute('id') ? nativeElement.getAttribute('id') : `element-${customId}`);
    }
    nativeElement.classList.add('rendering-item');
  }

  setContainerIDs(nativeElement: HTMLElement): void {
    const containerElements = nativeElement.querySelectorAll('cms-next-cms-container-rendering') as NodeList;
    const customId = nativeElement.id;
    containerElements.forEach((container: HTMLElement, index: number) => {
      container.setAttribute('id', `container${index + 1}-${nativeElement.getAttribute('id') ? nativeElement.getAttribute('id') : customId}`);
      container.style.position = 'relative';
      container.classList.add('rendering-item');
    });
  }
}
