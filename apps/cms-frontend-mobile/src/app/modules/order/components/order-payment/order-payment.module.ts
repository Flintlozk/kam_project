import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderPaymentComponent } from './order-payment.component';
import { OrderTemplateItemModule } from '../order-template-item/order-template-item.module';
import { OrderTemplateModule } from '../order-template/order-template.module';
import { OrderConfirmPaymentModule } from '../order-confirm-payment/order-confirm-payment.module';
@NgModule({
  declarations: [OrderPaymentComponent],
  imports: [CommonModule, OrderConfirmPaymentModule, OrderTemplateItemModule, OrderTemplateModule],
  exports: [OrderPaymentComponent],
})
export class OrderPaymentModule {}
