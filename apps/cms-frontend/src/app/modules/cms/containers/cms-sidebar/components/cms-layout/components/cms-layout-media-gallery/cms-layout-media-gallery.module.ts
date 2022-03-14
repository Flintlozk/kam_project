import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutMediaGalleryComponent } from './cms-layout-media-gallery.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutMediaGallerySettingModule } from './components/cms-layout-media-gallery-setting/cms-layout-media-gallery-setting.module';
import { CmsLayoutMediaGalleryControlModule } from './components/cms-layout-media-gallery-control/cms-layout-media-gallery-control.module';

@NgModule({
  declarations: [CmsLayoutMediaGalleryComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutMediaGallerySettingModule, CmsLayoutMediaGalleryControlModule],
  exports: [CmsLayoutMediaGalleryComponent],
})
export class CmsLayoutMediaGalleryModule {}
