import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormAdditionAccountExcecutiveComponent } from './form-addition-account-excecutive.component';
import { MatInputModule } from '@angular/material/input';
import { ReactiveFormsModule } from '@angular/forms';
@NgModule({
  declarations: [FormAdditionAccountExcecutiveComponent],
  imports: [CommonModule, MatInputModule, ReactiveFormsModule],
  exports: [FormAdditionAccountExcecutiveComponent],
})
export class FormAdditionAccountExcecutiveModule {}
