import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsMediaManagementComponent } from './cms-media-management.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { FileExtensionModule } from '@reactor-room/cms-cdk';
import { CmsMediaInfoModule } from './cms-media-info/cms-media-info.module';

@NgModule({
  declarations: [CmsMediaManagementComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatMenuModule, FileExtensionModule, CmsMediaInfoModule],
  exports: [CmsMediaManagementComponent],
})
export class CmsMediaManagementModule {}
