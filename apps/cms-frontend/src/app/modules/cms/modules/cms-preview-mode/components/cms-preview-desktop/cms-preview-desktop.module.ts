import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsPreviewDesktopComponent } from './cms-preview-desktop.component';
import { CmsPreviewRenderdingModule } from '../cms-preview-renderding/cms-preview-renderding.module';

@NgModule({
  declarations: [CmsPreviewDesktopComponent],
  imports: [CommonModule, CmsPreviewRenderdingModule],
  exports: [CmsPreviewDesktopComponent],
})
export class CmsPreviewDesktopModule {}
