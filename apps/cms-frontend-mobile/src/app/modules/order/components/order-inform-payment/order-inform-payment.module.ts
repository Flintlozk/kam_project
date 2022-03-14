import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderInformPaymentComponent } from './order-inform-payment.component';
import { CurrencyModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OrderInformPaymentComponent],
  imports: [CommonModule, CurrencyModule, TranslateModule],
  exports: [OrderInformPaymentComponent],
})
export class OrderInformPaymentModule {}
