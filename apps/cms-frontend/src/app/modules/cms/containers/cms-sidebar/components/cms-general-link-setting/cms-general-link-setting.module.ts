import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsGeneralLinkSettingComponent } from './cms-general-link-setting.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CmsGeneralLinkSettingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  exports: [CmsGeneralLinkSettingComponent],
})
export class CmsGeneralLinkSettingModule {}
