import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsThemeSettingCustomizeComponent } from './cms-theme-setting-customize.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';

@NgModule({
  declarations: [CmsThemeSettingCustomizeComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MonacoEditorModule],
  exports: [CmsThemeSettingCustomizeComponent],
})
export class CmsThemeSettingCustomizeModule {}
