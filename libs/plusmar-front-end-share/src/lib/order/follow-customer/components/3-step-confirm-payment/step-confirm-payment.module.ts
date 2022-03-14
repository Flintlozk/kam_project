import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CustomTableContentModule, CustomTableModule } from '@reactor-room/plusmar-cdk';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { StepConfirmPaymentComponent } from './step-confirm-payment.component';

@NgModule({
  declarations: [StepConfirmPaymentComponent],
  imports: [CommonModule, CustomTableModule, CustomTableContentModule, TimeAgoPipeModule],
  exports: [StepConfirmPaymentComponent],
})
export class StepConfirmPaymentModule {}
