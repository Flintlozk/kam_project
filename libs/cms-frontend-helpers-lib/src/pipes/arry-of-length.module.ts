import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ArrayOfLengthPipe } from './array-of-length.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [ArrayOfLengthPipe],
  exports: [ArrayOfLengthPipe],
})
export class ArrayOfLengthPipeModule {}
