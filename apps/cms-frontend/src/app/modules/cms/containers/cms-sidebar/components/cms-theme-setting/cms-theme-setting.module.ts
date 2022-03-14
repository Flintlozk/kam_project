import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeSettingComponent } from './cms-theme-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsThemeSettingColorModule } from './components/cms-theme-setting-color/cms-theme-setting-color.module';
import { CmsThemeSettingTextModule } from './components/cms-theme-setting-text/cms-theme-setting-text.module';
import { CmsThemeSettingThemeModule } from './components/cms-theme-setting-theme/cms-theme-setting-theme.module';
import { CmsThemeSettingCustomizeModule } from './components/cms-theme-setting-customize/cms-theme-setting-customize.module';
import { CmsThemeSettingDeviceModule } from './components/cms-theme-setting-device/cms-theme-setting-device.module';

@NgModule({
  declarations: [CmsThemeSettingComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    CmsThemeSettingColorModule,
    CmsThemeSettingTextModule,
    CmsThemeSettingThemeModule,
    CmsThemeSettingCustomizeModule,
    CmsThemeSettingDeviceModule,
  ],
  exports: [CmsThemeSettingComponent],
})
export class CmsThemeSettingModule {}
