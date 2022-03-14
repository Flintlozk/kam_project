import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryFourComponent } from './cms-media-gallery-four.component';
import { CmsMediaGalleryItemRenderingModule } from '../../../cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.module';
import { CmsGridSliderControlModule } from '../../../../cms-grid-slider-control/cms-grid-slider-control.module';

@NgModule({
  declarations: [CmsMediaGalleryFourComponent],
  imports: [CommonModule, CmsMediaGalleryItemRenderingModule, CmsGridSliderControlModule],
  exports: [CmsMediaGalleryFourComponent],
})
export class CmsMediaGalleryFourModule {}
