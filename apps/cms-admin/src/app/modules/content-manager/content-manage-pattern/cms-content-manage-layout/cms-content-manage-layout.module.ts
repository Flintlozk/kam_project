import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentManageLayoutComponent } from './cms-content-manage-layout.component';
import { CmsContentManageLayoutItemModule } from '../cms-content-manage-layout-item/cms-content-manage-layout-item.module';

@NgModule({
  declarations: [CmsContentManageLayoutComponent],
  imports: [CommonModule, CmsContentManageLayoutItemModule],
  exports: [CmsContentManageLayoutComponent],
})
export class CmsContentManageLayoutModule {}
