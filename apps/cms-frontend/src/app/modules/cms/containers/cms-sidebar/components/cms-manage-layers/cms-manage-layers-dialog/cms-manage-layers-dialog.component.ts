import { Component, OnInit } from '@angular/core';
import { MatDialogRef } from '@angular/material/dialog';
import { ComponentTypeEnum, EBackground } from '@reactor-room/cms-models-lib';
import { CmsButtonRenderingComponent } from '../../../../../components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { CmsContainerRenderingComponent } from '../../../../../components/cms-rendering-component/cms-container-rendering/cms-container-rendering.component';
import { CmsContentManagementRenderingComponent } from '../../../../../components/cms-rendering-component/cms-content-management-rendering/cms-content-management-rendering.component';
import { CmsLayoutRenderingComponent } from '../../../../../components/cms-rendering-component/cms-layout-rendering/cms-layout-rendering.component';
import { CmsMediaGalleryItemRenderingComponent } from '../../../../../components/cms-rendering-component/cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.component';
import { CmsMediaGalleryRenderingComponent } from '../../../../../components/cms-rendering-component/cms-media-gallery-rendering/cms-media-gallery-rendering.component';
import { CmsMediaSliderRenderingComponent } from '../../../../../components/cms-rendering-component/cms-media-slider-rendering/cms-media-slider-rendering.component';
import { CmsMenuRenderingComponent } from '../../../../../components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { CmsTextRenderingComponent } from '../../../../../components/cms-rendering-component/cms-text-rendering/cms-text-rendering.component';
import { CmsThemeRenderingComponent } from '../../../../../components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ComponentType, ViewRefAndElementRefAndComponent } from '../../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { CmsShoppingCartRenderingComponent } from './../../../../../components/cms-rendering-component/cms-shopping-cart-rendering/cms-shopping-cart-rendering.component';

@Component({
  selector: 'cms-next-cms-manage-layers-dialog',
  templateUrl: './cms-manage-layers-dialog.component.html',
  styleUrls: ['./cms-manage-layers-dialog.component.scss'],
})
export class CmsManageLayersDialogComponent implements OnInit {
  headerContainer: ViewRefAndElementRefAndComponent[];
  footerContainer: ViewRefAndElementRefAndComponent[];
  contentContainer: ViewRefAndElementRefAndComponent[];
  ComponentTypeEnum = ComponentTypeEnum;
  EBackground = EBackground;
  constructor(private cmsEditService: CmsEditService, private dialogRef: MatDialogRef<CmsManageLayersDialogComponent>) {}

  ngOnInit(): void {
    this.headerContainer = this.cmsEditService.headerDropListRef?.data?.viewRefAndElementRefAndComponents;
    this.footerContainer = this.cmsEditService.footerDropListRef?.data?.viewRefAndElementRefAndComponents;
    this.contentContainer = this.cmsEditService.dropZoneDropListRef?.data?.viewRefAndElementRefAndComponents;
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onFocusComponent(component: ComponentType): void {
    switch (component.componentType) {
      case 'CmsTextRenderingComponent':
        component = component as CmsTextRenderingComponent;
        component.onTextEditorFocusEvent();
        break;
      case 'CmsMediaGalleryRenderingComponent':
        component = component as CmsMediaGalleryRenderingComponent;
        component.onMediaGalleryFocusEvent();
        break;
      case 'CmsMediaGalleryItemRenderingComponent':
        component = component as CmsMediaGalleryItemRenderingComponent;
        component.onMediaGalleryItemFocusEvent();
        break;
      case 'CmsMediaSliderRenderingComponent':
        component = component as CmsMediaSliderRenderingComponent;
        component.onMediaSliderFocusEvent();
        break;
      case 'CmsContentManagementRenderingComponent':
        component = component as CmsContentManagementRenderingComponent;
        component.onContentManagementFocusEvent();
        break;
      case 'CmsLayoutRenderingComponent':
        component = component as CmsLayoutRenderingComponent;
        component.onLayoutEditorFocusEvent();
        break;
      case 'CmsContainerRenderingComponent':
        component = component as CmsContainerRenderingComponent;
        component.onContainerEditorFocusEvent();
        break;
      case 'CmsButtonRenderingComponent':
        component = component as CmsButtonRenderingComponent;
        component.onButtonFocusEvent();
        break;
      case 'CmsThemeRenderingComponent':
        component = component as CmsThemeRenderingComponent;
        component.onThemeFocusEvent();
        break;
      case 'CmsMenuRenderingComponent':
        component = component as CmsMenuRenderingComponent;
        component.onMenuFocusEvent();
        break;
      case 'CmsShoppingCartRenderingComponent':
        component = component as CmsShoppingCartRenderingComponent;
        component.onShoppingCartFocusEvent();
        break;
      default:
        break;
    }
  }
}
