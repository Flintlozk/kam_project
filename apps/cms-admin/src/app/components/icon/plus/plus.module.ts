import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PlusComponent } from './plus.component';

@NgModule({
  declarations: [PlusComponent],
  imports: [CommonModule],
  exports: [PlusComponent],
})
export class PlusModule {}
