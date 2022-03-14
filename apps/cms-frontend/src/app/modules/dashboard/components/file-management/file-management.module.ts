import { NgModule } from '@angular/core';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { CommonModule } from '@angular/common';
import { FileManagementComponent } from './file-management.component';
import { CmsMediaManagementModule } from '../../../cms/containers/cms-sidebar/components/cms-media-management/cms-media-management.module';

@NgModule({
  declarations: [FileManagementComponent],
  imports: [CommonModule, HeadingModule, CmsMediaManagementModule],
  exports: [FileManagementComponent],
})
export class FileManagementModule {}
