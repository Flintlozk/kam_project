import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsLayoutImageComponent } from './cms-layout-image.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CmsMediaModalModule } from '../../../cms-media-management/cms-media-modal/cms-media-modal.module';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';

@NgModule({
  declarations: [CmsLayoutImageComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, CmsMediaModalModule, MatFormFieldModule, MatSelectModule],
  exports: [CmsLayoutImageComponent],
})
export class CmsLayoutImageModule {}
