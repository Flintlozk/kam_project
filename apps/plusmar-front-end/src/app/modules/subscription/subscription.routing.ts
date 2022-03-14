import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CreateSubscriptionComponent } from './components/create-subscription/create-subscription.component';
import { SubscriptionPaymentComponent } from './components/subscription-payment/subscription-payment.component';

import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';

const routes: Routes = [
  { path: ':subscriptionID/payment/:planID', component: SubscriptionPaymentComponent, canActivate: [AuthGuard] },
  { path: 'payment', component: SubscriptionPaymentComponent, canActivate: [AuthGuard] },
  { path: 'create/:back', component: CreateSubscriptionComponent, canActivate: [AuthGuard] },
  { path: 'create', component: CreateSubscriptionComponent },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class SubscriptionRoutingModule {}
