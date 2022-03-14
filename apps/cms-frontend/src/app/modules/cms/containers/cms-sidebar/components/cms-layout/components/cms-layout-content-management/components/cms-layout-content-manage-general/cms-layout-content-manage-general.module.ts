import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutContentManageGeneralComponent } from './cms-layout-content-manage-general.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutContentManagePatternsModule } from '../cms-layout-content-manage-patterns/cms-layout-content-manage-patterns.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsLayoutContentManageGeneralComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutContentManagePatternsModule, MatSelectModule, MatFormFieldModule],
  exports: [CmsLayoutContentManageGeneralComponent],
})
export class CmsLayoutContentManageGeneralModule {}
