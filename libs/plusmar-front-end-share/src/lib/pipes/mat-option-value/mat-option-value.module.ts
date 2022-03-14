import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatOptionValuePipe } from './mat-option-value.pipe';
@NgModule({
  declarations: [MatOptionValuePipe],
  imports: [CommonModule],
  exports: [MatOptionValuePipe],
})
export class MatOptionValueModule {}
