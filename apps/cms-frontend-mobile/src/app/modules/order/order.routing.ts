import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { OrderComponent } from './order.component';
import { OrderFinishComponent } from './components/order-finish/order-finish.component';
import { OrderNewComponent } from './components/order-new/order-new.component';
import { OrderPaymentComponent } from './components/order-payment/order-payment.component';
import { OrderShippingComponent } from './components/order-shipping/order-shipping.component';
import { RouteAnimateEnum } from '@reactor-room/animation';

const routes: Routes = [
  {
    path: '',
    component: OrderComponent,
    data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.ORDER_PAGE },
    children: [
      { path: 'new', component: OrderNewComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.ORDER_NEW_PAGE } },
      { path: 'payment', component: OrderPaymentComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.ORDER_PAYMENT_PAGE } },
      { path: 'shipping', component: OrderShippingComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.ORDER_SHIPPING_PAGE } },
      { path: 'finish', component: OrderFinishComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.ORDER_FINISH_PAGE } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class OrderRoutingModule {}
