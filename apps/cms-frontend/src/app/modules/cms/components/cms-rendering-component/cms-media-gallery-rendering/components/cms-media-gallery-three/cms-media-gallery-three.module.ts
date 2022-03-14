import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryThreeComponent } from './cms-media-gallery-three.component';
import { CmsMediaGalleryItemRenderingModule } from '../../../cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.module';
import { CmsGridSliderControlModule } from '../../../../cms-grid-slider-control/cms-grid-slider-control.module';

@NgModule({
  declarations: [CmsMediaGalleryThreeComponent],
  imports: [CommonModule, CmsMediaGalleryItemRenderingModule, CmsGridSliderControlModule],
  exports: [CmsMediaGalleryThreeComponent],
})
export class CmsMediaGalleryThreeModule {}
