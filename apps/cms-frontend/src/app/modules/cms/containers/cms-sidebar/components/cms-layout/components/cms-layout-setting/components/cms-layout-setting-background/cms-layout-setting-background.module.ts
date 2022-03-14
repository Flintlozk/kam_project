import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingBackgroundComponent } from './cms-layout-setting-background.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutSettingBackgroundColorModule } from './components/cms-layout-setting-background-color/cms-layout-setting-background-color.module';
import { CmsLayoutSettingBackgroundImageModule } from './components/cms-layout-setting-background-image/cms-layout-setting-background-image.module';
import { CmsLayoutSettingBackgroundVideoModule } from './components/cms-layout-setting-background-video/cms-layout-setting-background-video.module';
import { MatTabsModule } from '@angular/material/tabs';

@NgModule({
  declarations: [CmsLayoutSettingBackgroundComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmsLayoutSettingBackgroundColorModule,
    CmsLayoutSettingBackgroundImageModule,
    CmsLayoutSettingBackgroundVideoModule,
    MatTabsModule,
  ],
  exports: [CmsLayoutSettingBackgroundComponent],
})
export class CmsLayoutSettingBackgroundModule {}
