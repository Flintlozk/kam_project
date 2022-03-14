import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AttachmentDisplayComponent } from './attachment-display.component';
import { GenerateFilePreviewPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/generate-file-preview/generate-file-preview.module';

@NgModule({
  declarations: [AttachmentDisplayComponent],
  imports: [CommonModule, GenerateFilePreviewPipeModule],
  exports: [AttachmentDisplayComponent],
})
export class AttachmentDisplayModule {}
