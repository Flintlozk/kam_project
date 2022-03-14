import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsContentEditorRenderingComponent } from './cms-content-editor-rendering.component';
import { CmsContentSectionRenderingModule } from '../cms-content-section-rendering/cms-content-section-rendering.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsContentEditorRenderingComponent],
  imports: [CommonModule, CmsContentSectionRenderingModule, FormsModule, ReactiveFormsModule],
  exports: [CmsContentEditorRenderingComponent],
})
export class CmsContentEditorRenderingModule {}
