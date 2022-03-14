import { NgModule } from '@angular/core';
import { GenerateFilePreviewPipe } from './generate-file-preview.pipe';

@NgModule({
  declarations: [GenerateFilePreviewPipe],
  exports: [GenerateFilePreviewPipe],
})
export class GenerateFilePreviewPipeModule {}
