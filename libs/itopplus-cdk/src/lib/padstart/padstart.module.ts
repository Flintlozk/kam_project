import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PadstartPipe } from './padstart.pipe';

@NgModule({
  declarations: [PadstartPipe],
  imports: [CommonModule],
  exports: [PadstartPipe],
})
export class PadstartModule {}
