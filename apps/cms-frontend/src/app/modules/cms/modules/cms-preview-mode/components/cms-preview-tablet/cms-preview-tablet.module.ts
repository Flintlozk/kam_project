import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsPreviewTabletComponent } from './cms-preview-tablet.component';
import { CmsPreviewRenderdingModule } from '../cms-preview-renderding/cms-preview-renderding.module';

@NgModule({
  declarations: [CmsPreviewTabletComponent],
  imports: [CommonModule, CmsPreviewRenderdingModule],
  exports: [CmsPreviewTabletComponent],
})
export class CmsPreviewTabletModule {}
