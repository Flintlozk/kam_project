import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TextTrimPipe } from './text-trim.pipe';

@NgModule({
  declarations: [TextTrimPipe],
  imports: [CommonModule],
  exports: [TextTrimPipe],
})
export class TextTrimModule {}
