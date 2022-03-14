import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutSettingBackgroundImageComponent } from './cms-layout-setting-background-image.component';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsLayoutSettingBackgroundImageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatFormFieldModule, MatSelectModule],
  exports: [CmsLayoutSettingBackgroundImageComponent],
})
export class CmsLayoutSettingBackgroundImageModule {}
