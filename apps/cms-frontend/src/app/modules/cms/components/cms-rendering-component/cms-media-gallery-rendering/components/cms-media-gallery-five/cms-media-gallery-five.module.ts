import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryFiveComponent } from './cms-media-gallery-five.component';
import { CmsMediaGalleryItemRenderingModule } from '../../../cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.module';
import { CmsGridSliderControlModule } from '../../../../cms-grid-slider-control/cms-grid-slider-control.module';

@NgModule({
  declarations: [CmsMediaGalleryFiveComponent],
  imports: [CommonModule, CmsGridSliderControlModule, CmsMediaGalleryItemRenderingModule],
  exports: [CmsMediaGalleryFiveComponent],
})
export class CmsMediaGalleryFiveModule {}
