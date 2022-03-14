import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ContentDraftEditorComponent } from './content-draft-editor.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { ClickOutsideModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentDraftEditorComponent],
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    ReactiveFormsModule,
    ClickOutsideModule,
    QuillModule.forRoot({
      theme: 'bubble',
    }),
    TranslateModule,
  ],
  exports: [ContentDraftEditorComponent],
})
export class ContentDraftEditorModule {}
