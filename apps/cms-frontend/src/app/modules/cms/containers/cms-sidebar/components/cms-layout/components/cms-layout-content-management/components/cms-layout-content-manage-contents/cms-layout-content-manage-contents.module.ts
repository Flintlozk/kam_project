import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutContentManageContentsComponent } from './cms-layout-content-manage-contents.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsCategorySettingModule } from '../../../../../cms-category-setting/cms-category-setting.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsLayoutContentManageContentsComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsCategorySettingModule, MatFormFieldModule, MatSelectModule],
  exports: [CmsLayoutContentManageContentsComponent],
})
export class CmsLayoutContentManageContentsModule {}
