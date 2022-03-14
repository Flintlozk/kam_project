import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TimepickerComponent } from './timepicker.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [TimepickerComponent],
  imports: [CommonModule, MatTooltipModule, FormsModule, ReactiveFormsModule],
  exports: [TimepickerComponent],
})
export class TimepickerModule {}
