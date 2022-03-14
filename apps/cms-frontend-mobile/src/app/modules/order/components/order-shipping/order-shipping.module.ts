import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderShippingComponent } from './order-shipping.component';
import { OrderTemplateItemModule } from '../order-template-item/order-template-item.module';
import { OrderTemplateModule } from '../order-template/order-template.module';
import { OrderConfirmShippingModule } from '../order-confirm-shipping/order-confirm-shipping.module';
@NgModule({
  declarations: [OrderShippingComponent],
  imports: [CommonModule, OrderConfirmShippingModule, OrderTemplateItemModule, OrderTemplateModule],
  exports: [OrderShippingComponent],
})
export class OrderShippingModule {}
