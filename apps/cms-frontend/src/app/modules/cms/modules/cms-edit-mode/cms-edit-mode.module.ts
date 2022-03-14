import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CmsEditModeComponent } from './cms-edit-mode.component';
import { CmsEditRenderingModule } from './components/cms-edit-rendering/cms-edit-rendering.module';
import { RouterModule } from '@angular/router';
import { ClickOutsideModule } from '@reactor-room/cms-cdk';
import { UndoRedoService } from '../../../../services/undo-redo.service';
import { CmsPreviewModeModule } from '../cms-preview-mode/cms-preview-mode.module';
import { CmsEditRenderingContentModule } from './components/cms-edit-rendering-content/cms-edit-rendering-content.module';
@NgModule({
  declarations: [CmsEditModeComponent],
  imports: [CommonModule, CmsEditRenderingModule, RouterModule, ClickOutsideModule, CmsPreviewModeModule, CmsEditRenderingContentModule],
  exports: [CmsEditModeComponent],
  providers: [UndoRedoService],
})
export class CmsEditModeModule {}
