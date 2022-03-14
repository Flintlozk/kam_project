import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentManagementRenderingComponent } from './cms-content-management-rendering.component';
import { CmsContentManageLayoutModule } from './components/cms-content-manage-layout/cms-content-manage-layout.module';
import { CmsContentManageDisplayModule } from './components/cms-content-manage-display/cms-content-manage-display.module';
import { CmsContentManageBottomModule } from './components/cms-content-manage-bottom/cms-content-manage-bottom.module';
@NgModule({
  declarations: [CmsContentManagementRenderingComponent],
  imports: [CommonModule, CmsContentManageLayoutModule, CmsContentManageDisplayModule, CmsContentManageBottomModule],
  exports: [CmsContentManagementRenderingComponent],
})
export class CmsContentManagementRenderingModule {}
