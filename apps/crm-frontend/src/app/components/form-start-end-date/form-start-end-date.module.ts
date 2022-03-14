import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormStartEndDateComponent } from './form-start-end-date.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
@NgModule({
  declarations: [FormStartEndDateComponent],
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatDatepickerModule, MatNativeDateModule, MatButtonModule],
  exports: [FormStartEndDateComponent],
})
export class FormStartEndDateModule {}
