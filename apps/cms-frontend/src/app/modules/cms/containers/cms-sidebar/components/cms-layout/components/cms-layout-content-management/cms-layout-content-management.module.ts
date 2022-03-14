import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutContentManagementComponent } from './cms-layout-content-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsLayoutContentManageContentsModule } from './components/cms-layout-content-manage-contents/cms-layout-content-manage-contents.module';
import { CmsLayoutContentManageGeneralModule } from './components/cms-layout-content-manage-general/cms-layout-content-manage-general.module';
import { CmsLayoutContentManageLandingModule } from './components/cms-layout-content-manage-landing/cms-layout-content-manage-landing.module';

@NgModule({
  declarations: [CmsLayoutContentManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsLayoutContentManageContentsModule, CmsLayoutContentManageGeneralModule, CmsLayoutContentManageLandingModule],
  exports: [CmsLayoutContentManagementComponent],
})
export class CmsLayoutContentManagementModule {}
