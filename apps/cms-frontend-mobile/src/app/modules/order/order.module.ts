import { OrderComponent } from './order.component';
import { OrderRoutingModule } from './order.routing';
import { NgModule } from '@angular/core';

import { OrderConfirmFinishModule } from './components/order-confirm-finish/order-confirm-finish.module';
import { OrderConfirmPaymentModule } from './components/order-confirm-payment/order-confirm-payment.module';
import { OrderConfirmShippingModule } from './components/order-confirm-shipping/order-confirm-shipping.module';
import { OrderConfirmShippingDialogModule } from './components/order-confirm-shipping-dialog/order-confirm-shipping-dialog.module';
import { OrderFilterModule } from './components/order-filter/order-filter.module';
import { OrderFinishModule } from './components/order-finish/order-finish.module';
import { OrderTemplateItemModule } from './components/order-template-item/order-template-item.module';
import { OrderTemplateModule } from './components/order-template/order-template.module';
import { OrderInformPaymentModule } from './components/order-inform-payment/order-inform-payment.module';
import { OrderInformPaymentDialogModule } from './components/order-inform-payment-dialog/order-inform-payment-dialog.module';
import { OrderNewModule } from './components/order-new/order-new.module';
import { OrderPaymentModule } from './components/order-payment/order-payment.module';
import { OrderShippingModule } from './components/order-shipping/order-shipping.module';

const MODULES = [
  OrderConfirmFinishModule,
  OrderConfirmPaymentModule,
  OrderConfirmShippingModule,
  OrderConfirmShippingDialogModule,
  OrderFilterModule,
  OrderFinishModule,
  OrderTemplateItemModule,
  OrderTemplateModule,
  OrderInformPaymentModule,
  OrderInformPaymentDialogModule,
  OrderNewModule,
  OrderPaymentModule,
  OrderShippingModule,
  OrderRoutingModule,
];

@NgModule({
  declarations: [OrderComponent],
  imports: [MODULES],
  providers: [],
  exports: [OrderComponent],
})
export class OrderModule {}
