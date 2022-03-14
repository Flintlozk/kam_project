import { NgModule } from '@angular/core';
import { ContentContentDialogComponent } from './content-content-dialog.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { QuillModule } from 'ngx-quill';
import { CommonModule } from '@angular/common';
import { MatDialogModule } from '@angular/material/dialog';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [ContentContentDialogComponent],
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    QuillModule.forRoot({
      theme: 'bubble',
    }),
    MatDialogModule,
    TranslateModule,
  ],
  exports: [ContentContentDialogComponent],
})
export class ContentContentDialogModule {}
