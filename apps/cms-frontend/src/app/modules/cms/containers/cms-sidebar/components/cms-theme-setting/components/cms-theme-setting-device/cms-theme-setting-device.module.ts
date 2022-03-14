import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeSettingDeviceComponent } from './cms-theme-setting-device.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsThemeSettingDeviceComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsThemeSettingDeviceComponent],
})
export class CmsThemeSettingDeviceModule {}
