import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DateFilterComponent } from './date-filter.component';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [DateFilterComponent],
  imports: [CommonModule, MatSelectModule, MatFormFieldModule, MatDatepickerModule, MatButtonModule, MatNativeDateModule, ReactiveFormsModule, FormsModule, TranslateModule],
  exports: [DateFilterComponent],
})
export class DateFilterModule {}
