import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaModalComponent } from './cms-media-modal.component';
import { CmsMediaManagementModule } from '../cms-media-management.module';

@NgModule({
  declarations: [CmsMediaModalComponent],
  imports: [CommonModule, CmsMediaManagementModule],
  exports: [CmsMediaModalComponent],
})
export class CmsMediaModalModule {}
