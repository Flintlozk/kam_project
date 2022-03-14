import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { QuillModule } from 'ngx-quill';
import { QuillEditorComponent } from './quill-editor.component';

@NgModule({
  declarations: [QuillEditorComponent],
  imports: [CommonModule, ReactiveFormsModule, QuillModule, TranslateModule, MatFormFieldModule],
  exports: [QuillEditorComponent],
})
export class QuillEditorModule {}
