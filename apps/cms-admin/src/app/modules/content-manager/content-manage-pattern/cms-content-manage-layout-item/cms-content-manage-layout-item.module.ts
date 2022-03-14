import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentManageLayoutItemComponent } from './cms-content-manage-layout-item.component';
import { LimitWordsPipeModule } from '@reactor-room/cms-frontend-helpers-lib';

@NgModule({
  declarations: [CmsContentManageLayoutItemComponent],
  imports: [CommonModule, LimitWordsPipeModule],
  exports: [CmsContentManageLayoutItemComponent],
})
export class CmsContentManageLayoutItemModule {}
