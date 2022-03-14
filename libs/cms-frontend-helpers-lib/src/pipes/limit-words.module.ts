import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LimitWordsPipe } from './limit-words.pipe';

@NgModule({
  imports: [CommonModule],
  declarations: [LimitWordsPipe],
  exports: [LimitWordsPipe],
})
export class LimitWordsPipeModule {}
