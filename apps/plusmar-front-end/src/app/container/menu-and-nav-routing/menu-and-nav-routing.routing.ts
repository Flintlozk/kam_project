import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { MenuAndNavRoutingComponent } from '@plusmar-front/container/menu-and-nav-routing/menu-and-nav-routing.component';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
// loginPage || processPage || registerPage || invitedUserLoginComponent || processRequestPage || subscriptionPage;
export const routes: Routes = [
  {
    path: '**',
    component: MenuAndNavRoutingComponent,
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full',
      },
      {
        path: 'dashboard',
        loadChildren: () => import('../../modules/dashboard/dashboard.module').then((m) => m.DashboardModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'customers',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/customer/customer.module').then((m) => m.CustomerModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'customer',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/customer/customer.module').then((m) => m.CustomerModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'products',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/products/products.module').then((m) => m.ProductsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'order',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/follow-customer/follow-customer.module').then((m) => m.FollowCustomerModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'leads',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/leads/leads.module').then((m) => m.LeadsModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'messages',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/audience/audience.module').then((m) => m.AudienceModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'follows',
        loadChildren: () => import('../../modules/follow/follow.module').then((m) => m.FollowModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'service',
        loadChildren: () => import('../../modules/customer-service/customer-service.module').then((m) => m.CustomerServiceModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'setting',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/setting/setting.module').then((m) => m.SettingModule),
        canActivate: [AuthGuard],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MenuAndNavRoutingRouting {}
