import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { AudienceResolver } from '@reactor-room/plusmar-front-end-share/resolvers/audience/audience.resolver';
import { OrderCloseRouteResolver, OrderRouteResolver } from '@reactor-room/plusmar-front-end-share/resolvers/route/route.resolver';
import { OrderLazadaDetailsComponent } from '../marketplace-orders/order-lazada-details/order-lazada-details.component';
import { StepAllComponent } from './components/0-step-all/step-all.component';
import { StepFollowComponent } from './components/1-step-follow/step-follow.component';
import { StepPendingComponent } from './components/2-step-pending/step-pending.component';
import { StepConfirmPaymentComponent } from './components/3-step-confirm-payment/step-confirm-payment.component';
import { StepUnfulfilledComponent } from './components/4-step-unfulfilled/step-unfulfilled.component';
import { StepCloseSalesComponent } from './components/5-step-close-sales/step-close-sales.component';
import { CloseSaleInfoComponent } from './containers/close-sale-info/close-sale-info.component';
import { FollowCustomerComponent } from './containers/follow-customer/follow-customer.component';
import { ReportFollowCustomerComponent } from './containers/report-follow-customer/report-follow-customer.component';
const routes: Routes = [
  {
    path: '',
    component: FollowCustomerComponent,
    runGuardsAndResolvers: 'always',
    children: [
      { path: 'all', component: StepAllComponent },
      { path: 'follow', component: StepFollowComponent },
      { path: 'pending', component: StepPendingComponent, runGuardsAndResolvers: 'always' },
      { path: 'close-sales', component: StepCloseSalesComponent, runGuardsAndResolvers: 'always' },
      { path: 'unfulfilled', component: StepUnfulfilledComponent, runGuardsAndResolvers: 'always' },
      { path: 'confirm-payment', component: StepConfirmPaymentComponent, runGuardsAndResolvers: 'always' },
    ],
    canActivate: [AuthGuard],
  },
  {
    path: 'order-info',
    resolve: {
      route: OrderRouteResolver,
    },
    loadChildren: () => import('../audience-contact/audience-contact.module').then((m) => m.AudienceContactModule),
  },
  {
    path: 'closesale/:audienceId',
    component: CloseSaleInfoComponent,
    runGuardsAndResolvers: 'always',
    canActivate: [AuthGuard],
    resolve: {
      audience: AudienceResolver,
      route: OrderCloseRouteResolver,
    },
  },
  {
    path: 'order-market-info/lazada/:id',
    component: OrderLazadaDetailsComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
  {
    path: 'report/:type/:size/:orderID/:UUID/:audienceID/:route',
    component: ReportFollowCustomerComponent,
    canActivate: [AuthGuard],
    runGuardsAndResolvers: 'always',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class FollowCustomerRoutingModule {}
