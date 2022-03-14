import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingBackgroundColorComponent } from './cms-layout-setting-background-color.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsLayoutSettingBackgroundColorComponent],
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  exports: [CmsLayoutSettingBackgroundColorComponent],
})
export class CmsLayoutSettingBackgroundColorModule {}
