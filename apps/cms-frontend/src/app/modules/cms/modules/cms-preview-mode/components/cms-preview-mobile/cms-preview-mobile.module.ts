import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsPreviewMobileComponent } from './cms-preview-mobile.component';
import { CmsPreviewRenderdingModule } from '../cms-preview-renderding/cms-preview-renderding.module';

@NgModule({
  declarations: [CmsPreviewMobileComponent],
  imports: [CommonModule, CmsPreviewRenderdingModule],
  exports: [CmsPreviewMobileComponent],
})
export class CmsPreviewMobileModule {}
