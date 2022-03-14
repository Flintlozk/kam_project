import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingBackgroundVideoComponent } from './cms-layout-setting-background-video.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsLayoutSettingBackgroundVideoComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [CmsLayoutSettingBackgroundVideoComponent],
})
export class CmsLayoutSettingBackgroundVideoModule {}
