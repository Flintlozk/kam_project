import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatepickerComponent } from './datepicker.component';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [DatepickerComponent],
  imports: [CommonModule, MatDatepickerModule, MatFormFieldModule, MatNativeDateModule, MatInputModule, FormsModule, ReactiveFormsModule],
  exports: [DatepickerComponent],
})
export class DatepickerModule {}
