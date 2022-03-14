import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutContentManagementLandingComponent } from './cms-layout-content-management-landing.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutContentManageLandingModule } from '../cms-layout-content-management/components/cms-layout-content-manage-landing/cms-layout-content-manage-landing.module';

@NgModule({
  declarations: [CmsLayoutContentManagementLandingComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutContentManageLandingModule],
  exports: [CmsLayoutContentManagementLandingComponent],
})
export class CmsLayoutContentManagementLandingModule {}
