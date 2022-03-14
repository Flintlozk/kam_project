import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingCustomizeComponent } from './cms-layout-setting-customize.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MonacoEditorModule } from '@reactor-room/itopplus-front-end-helpers';

@NgModule({
  declarations: [CmsLayoutSettingCustomizeComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MonacoEditorModule],
  exports: [CmsLayoutSettingCustomizeComponent],
})
export class CmsLayoutSettingCustomizeModule {}
