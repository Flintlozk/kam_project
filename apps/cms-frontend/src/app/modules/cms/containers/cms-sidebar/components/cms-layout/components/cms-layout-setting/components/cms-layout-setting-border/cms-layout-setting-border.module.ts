import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutSettingBorderComponent } from './cms-layout-setting-border.component';

@NgModule({
  declarations: [CmsLayoutSettingBorderComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsLayoutSettingBorderComponent],
})
export class CmsLayoutSettingBorderModule {}
