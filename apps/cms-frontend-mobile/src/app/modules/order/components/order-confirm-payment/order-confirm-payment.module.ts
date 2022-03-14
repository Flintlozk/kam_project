import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderConfirmPaymentComponent } from './order-confirm-payment.component';
import { CurrencyModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderConfirmPaymentComponent],
  imports: [CommonModule, CurrencyModule, TranslateModule],
  exports: [OrderConfirmPaymentComponent],
})
export class OrderConfirmPaymentModule {}
