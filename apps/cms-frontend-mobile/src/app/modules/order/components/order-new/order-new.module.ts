import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderNewComponent } from './order-new.component';
import { OrderTemplateItemModule } from '../order-template-item/order-template-item.module';
import { OrderTemplateModule } from '../order-template/order-template.module';
import { OrderInformPaymentModule } from '../order-inform-payment/order-inform-payment.module';
@NgModule({
  declarations: [OrderNewComponent],
  imports: [CommonModule, OrderInformPaymentModule, OrderTemplateItemModule, OrderTemplateModule],
  exports: [OrderNewComponent],
})
export class OrderNewModule {}
