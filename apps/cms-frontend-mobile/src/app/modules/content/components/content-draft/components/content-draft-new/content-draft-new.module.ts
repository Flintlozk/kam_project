import { NgModule } from '@angular/core';
import { ContentDraftNewComponent } from './content-draft-new.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentDraftEditorModule } from '../content-draft-editor/content-draft-editor.module';
@NgModule({
  declarations: [ContentDraftNewComponent],
  imports: [FormsModule, ReactiveFormsModule, ContentDraftEditorModule],
  exports: [ContentDraftNewComponent],
})
export class ContentDraftNewModule {}
