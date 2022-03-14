import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormInputAmountComponent } from './form-input-amount.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';

@NgModule({
  declarations: [FormInputAmountComponent],
  imports: [CommonModule, MatInputModule, ReactiveFormsModule, MatSelectModule, MatCheckboxModule, MatOptionModule, MatButtonModule],
  exports: [FormInputAmountComponent],
})
export class FormInputAmountModule {}
