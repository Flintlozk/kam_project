import { CommonModule } from '@angular/common';

import { ContentComponent } from './content.component';
import { ContentRoutingModule } from './content-routing.module';
import { NgModule } from '@angular/core';

import { ContentFilterModule } from './components/content-filter/content-filter.module';
import { ContentDraftModule } from './components/content-draft/content-draft.module';
import { ContentDraftNewModule } from './components/content-draft/components/content-draft-new/content-draft-new.module';
import { ContentDraftEditModule } from './components/content-draft/components/content-draft-edit/content-draft-edit.module';
import { ContentDraftEditorModule } from './components/content-draft/components/content-draft-editor/content-draft-editor.module';
import { ContentFileManageModule } from './components/content-file-manage/content-file-manage.module';
import { ContentFileManageDetailModule } from './components/content-file-manage/components/content-file-manage-detail/content-file-manage-detail.module';
import { ContentContentModule } from './components/content-content/content-content.module';
import { ContentContentEditModule } from './components/content-content/components/content-content-edit/content-content-edit.module';
import { ContentContentDialogModule } from './components/content-content/components/content-content-dialog/content-content-dialog.module';
import { ContentContentRenderingModule } from './components/content-content/components/content-content-rendering/content-content-rendering.module';

const MODULES = [
  ContentFilterModule,
  ContentDraftModule,
  ContentDraftNewModule,
  ContentDraftEditModule,
  ContentDraftEditorModule,
  ContentFileManageModule,
  ContentFileManageDetailModule,
  ContentContentModule,
  ContentContentEditModule,
  ContentContentDialogModule,
  ContentContentRenderingModule,
];

@NgModule({
  declarations: [ContentComponent],
  imports: [CommonModule, ContentRoutingModule, MODULES],
  providers: [],
  exports: [ContentComponent],
})
export class ContentModule {}
