import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HomeDatePickerComponent } from './home-date-picker.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatNativeDateModule } from '@angular/material/core';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [HomeDatePickerComponent],
  imports: [CommonModule, MatDatepickerModule, FormsModule, ReactiveFormsModule, MatDatepickerModule, MatButtonModule, MatFormFieldModule, MatNativeDateModule, TranslateModule],
  exports: [HomeDatePickerComponent],
})
export class HomeDatePickerModule {}
