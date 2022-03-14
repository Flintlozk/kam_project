import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { CmsHeaderComponent } from './cms-header.component';
import { CmsPageSelectionModule } from '../../components/common/cms-page-selection/cms-page-selection.module';
import { CmsRedoUndoModule } from '../../components/common/cms-redo-undo/cms-redo-undo.module';
import { CmsPreviewModule } from '../../components/common/cms-preview/cms-preview.module';
import { CmsActionModule } from '../../components/common/cms-action/cms-action.module';
import { CmsLanguageSwitchModule } from '../../components/common/cms-language-switch/cms-language-switch.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [CmsHeaderComponent],
  imports: [CommonModule, RouterModule, CmsPageSelectionModule, CmsRedoUndoModule, CmsPreviewModule, CmsActionModule, CmsLanguageSwitchModule, FormsModule, ReactiveFormsModule],
  exports: [CmsHeaderComponent],
})
export class CmsHeaderModule {}
