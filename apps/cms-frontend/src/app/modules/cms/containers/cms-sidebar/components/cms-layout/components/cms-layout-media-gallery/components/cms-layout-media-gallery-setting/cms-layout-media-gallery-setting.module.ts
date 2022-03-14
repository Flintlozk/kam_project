import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutMediaGallerySettingComponent } from './cms-layout-media-gallery-setting.component';
import { CmsLayoutMediaGalleryModalModule } from '../cms-layout-media-gallery-modal/cms-layout-media-gallery-modal.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutMediaGallerySettingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutMediaGalleryModalModule],
  exports: [CmsLayoutMediaGallerySettingComponent],
})
export class CmsLayoutMediaGallerySettingModule {}
