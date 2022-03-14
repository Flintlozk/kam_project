import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaGalleryItemComponent } from './cms-media-gallery-item.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutSettingBackgroundModule } from '../cms-layout/components/cms-layout-setting/components/cms-layout-setting-background/cms-layout-setting-background.module';
import { CmsGeneralLinkSettingModule } from '../cms-general-link-setting/cms-general-link-setting.module';
import { CmsGeneralTextSettingModule } from '../cms-general-text-setting/cms-general-text-setting.module';

@NgModule({
  declarations: [CmsMediaGalleryItemComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutSettingBackgroundModule, CmsGeneralLinkSettingModule, CmsGeneralTextSettingModule],
  exports: [CmsMediaGalleryItemComponent],
})
export class CmsMediaGalleryItemModule {}
