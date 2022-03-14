import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImageExtensionPipe } from './image-extension.pipe';

@NgModule({
  declarations: [ImageExtensionPipe],
  imports: [CommonModule],
  exports: [ImageExtensionPipe],
})
export class ImageExtensionModule {}
