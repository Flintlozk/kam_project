import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { CmsElementPositionModule } from './../../../../../../components/cms-element-position/cms-element-position.module';
import { CmsGeneralTextSettingComponent } from './cms-general-text-setting.component';

@NgModule({
  declarations: [CmsGeneralTextSettingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule, CmsElementPositionModule],
  exports: [CmsGeneralTextSettingComponent],
})
export class CmsGeneralTextSettingModule {}
