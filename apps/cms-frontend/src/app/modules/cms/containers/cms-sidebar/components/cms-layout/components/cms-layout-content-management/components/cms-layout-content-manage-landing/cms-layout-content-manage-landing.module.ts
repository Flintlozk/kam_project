import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutContentManageLandingComponent } from './cms-layout-content-manage-landing.component';
import { CmsContentManageLandingPatternsModule } from '../cms-content-manage-landing-patterns/cms-content-manage-landing-patterns.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsCategorySettingModule } from '../../../../../cms-category-setting/cms-category-setting.module';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [CmsLayoutContentManageLandingComponent],
  imports: [CommonModule, CmsContentManageLandingPatternsModule, FormsModule, ReactiveFormsModule, CmsCategorySettingModule, MatFormFieldModule, MatSelectModule],
  exports: [CmsLayoutContentManageLandingComponent],
})
export class CmsLayoutContentManageLandingModule {}
