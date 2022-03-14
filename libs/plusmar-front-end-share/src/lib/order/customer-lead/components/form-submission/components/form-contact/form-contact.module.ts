import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormContactComponent } from './form-contact.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [FormContactComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [FormContactComponent],
})
export class FormContactModule {}
