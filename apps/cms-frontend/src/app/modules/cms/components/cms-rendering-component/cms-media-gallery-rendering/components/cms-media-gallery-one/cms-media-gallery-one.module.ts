import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryOneComponent } from './cms-media-gallery-one.component';
import { CmsMediaGalleryItemRenderingModule } from '../../../cms-media-gallery-item-rendering/cms-media-gallery-item-rendering.module';
import { CmsGridSliderControlModule } from '../../../../cms-grid-slider-control/cms-grid-slider-control.module';

@NgModule({
  declarations: [CmsMediaGalleryOneComponent],
  imports: [CommonModule, CmsMediaGalleryItemRenderingModule, CmsGridSliderControlModule],
  exports: [CmsMediaGalleryOneComponent],
})
export class CmsMediaGalleryOneModule {}
