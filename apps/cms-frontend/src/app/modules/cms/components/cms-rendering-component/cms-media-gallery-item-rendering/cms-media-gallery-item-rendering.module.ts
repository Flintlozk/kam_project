import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryItemRenderingComponent } from './cms-media-gallery-item-rendering.component';
import { CmsGeneralTextModule } from '../../cms-general-text/cms-general-text.module';

@NgModule({
  declarations: [CmsMediaGalleryItemRenderingComponent],
  imports: [CommonModule, CmsGeneralTextModule],
  exports: [CmsMediaGalleryItemRenderingComponent],
})
export class CmsMediaGalleryItemRenderingModule {}
