import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsPreviewModeComponent } from './cms-preview-mode.component';
import { CmsPreviewTabletModule } from './components/cms-preview-tablet/cms-preview-tablet.module';
import { CmsPreviewMobileModule } from './components/cms-preview-mobile/cms-preview-mobile.module';
import { CmsPreviewDesktopModule } from './components/cms-preview-desktop/cms-preview-desktop.module';

@NgModule({
  declarations: [CmsPreviewModeComponent],
  imports: [CommonModule, CmsPreviewDesktopModule, CmsPreviewTabletModule, CmsPreviewMobileModule],
  exports: [CmsPreviewModeComponent],
})
export class CmsPreviewModeModule {}
