import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentSectionRenderingComponent } from './cms-content-section-rendering.component';
import { CmsContentColumnRenderingModule } from '../cms-content-column-rendering/cms-content-column-rendering.module';
import { MatMenuModule } from '@angular/material/menu';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsContentSectionRenderingComponent],
  imports: [CommonModule, CmsContentColumnRenderingModule, MatMenuModule, FormsModule, ReactiveFormsModule],
  exports: [CmsContentSectionRenderingComponent],
})
export class CmsContentSectionRenderingModule {}
