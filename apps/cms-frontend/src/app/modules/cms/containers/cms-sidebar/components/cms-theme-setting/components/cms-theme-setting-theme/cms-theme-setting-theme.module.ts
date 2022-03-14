import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeSettingThemeComponent } from './cms-theme-setting-theme.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsThemeSettingThemeComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsThemeSettingThemeComponent],
})
export class CmsThemeSettingThemeModule {}
