import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LotNumberPipe } from './lot-number.pipe';

@NgModule({
  declarations: [LotNumberPipe],
  imports: [CommonModule],
  exports: [LotNumberPipe],
})
export class LotNumberPipeModule {}
