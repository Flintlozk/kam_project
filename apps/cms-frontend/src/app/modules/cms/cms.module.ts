import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsComponent } from './cms.component';
import { CmsRoutingModule } from './cms.routing';
import { CmsLayoutModule } from './containers/cms-layout/cms-layout.module';
import { CmsEditModeModule } from './modules/cms-edit-mode/cms-edit-mode.module';
import { CmsPreviewModeModule } from './modules/cms-preview-mode/cms-preview-mode.module';
import { CmsEditService } from './services/cms-edit.service';
import { CmsCreateThemeService } from './services/cms-create-template.service';
import { CmsThemeRenderingModule } from './components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.module';
import { CmsPublishService } from './services/cms-publish.service';

@NgModule({
  declarations: [CmsComponent],
  imports: [CommonModule, CmsRoutingModule, CmsLayoutModule, CmsEditModeModule, CmsPreviewModeModule, CmsThemeRenderingModule],
  exports: [CmsComponent],
  providers: [CmsEditService, CmsCreateThemeService, CmsPublishService],
})
export class CmsModule {}
