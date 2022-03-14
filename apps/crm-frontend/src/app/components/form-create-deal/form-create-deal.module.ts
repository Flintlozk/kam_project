import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormCreateDealComponent } from './form-create-deal.component';
import { DealFormModule } from '../deal-form/deal-form.module';
@NgModule({
  declarations: [FormCreateDealComponent],
  imports: [CommonModule, DealFormModule],
  exports: [FormCreateDealComponent],
})
export class FormCreateDealModule {}
