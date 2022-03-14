import { NgModule } from '@angular/core';
import { ContentDraftEditComponent } from './content-draft-edit.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ContentDraftEditorModule } from '../content-draft-editor/content-draft-editor.module';
@NgModule({
  declarations: [ContentDraftEditComponent],
  imports: [FormsModule, ReactiveFormsModule, ContentDraftEditorModule],
  exports: [ContentDraftEditComponent],
})
export class ContentDraftEditModule {}
