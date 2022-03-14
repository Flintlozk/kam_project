import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentSidebarLandingComponent } from './cms-content-sidebar-landing.component';
import { CmsContentRightContentModule } from './cms-content-right-content/cms-content-right-content.module';

@NgModule({
  declarations: [CmsContentSidebarLandingComponent],
  imports: [CommonModule, CmsContentRightContentModule],
  exports: [CmsContentSidebarLandingComponent],
})
export class CmsContentSidebarLandingModule {}
