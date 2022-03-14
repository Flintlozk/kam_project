import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMenuCustomSettingAlignmentComponent } from './cms-menu-custom-setting-alignment.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsMenuCustomSettingAlignmentComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [CmsMenuCustomSettingAlignmentComponent],
})
export class CmsMenuCustomSettingAlignmentModule {}
