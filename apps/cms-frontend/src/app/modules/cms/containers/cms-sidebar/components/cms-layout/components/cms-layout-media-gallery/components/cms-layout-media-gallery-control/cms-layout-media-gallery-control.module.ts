import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutMediaGalleryControlComponent } from './cms-layout-media-gallery-control.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutMediaGalleryControlComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutMediaGalleryControlComponent],
})
export class CmsLayoutMediaGalleryControlModule {}
