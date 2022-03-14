import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryTwoComponent } from './cms-media-gallery-two.component';
import { CmsGridSliderControlModule } from '../../../../cms-grid-slider-control/cms-grid-slider-control.module';
import { CmsMediaGalleryItemRenderingModule } from '../../../cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.module';

@NgModule({
  declarations: [CmsMediaGalleryTwoComponent],
  imports: [CommonModule, CmsGridSliderControlModule, CmsMediaGalleryItemRenderingModule],
  exports: [CmsMediaGalleryTwoComponent],
})
export class CmsMediaGalleryTwoModule {}
