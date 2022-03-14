import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeSettingColorComponent } from './cms-theme-setting-color.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsThemeSettingColorComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsThemeSettingColorComponent],
})
export class CmsThemeSettingColorModule {}
