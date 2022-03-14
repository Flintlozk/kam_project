import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from '@reactor-room/plusmar-front-end-share/auth.guard';
import { PermissionGuard } from '@reactor-room/plusmar-front-end-share/permission.guard';
import { EnumPageMemberType } from '@reactor-room/itopplus-model-lib';
import { LayoutComponent } from './layout.component';

const routes: Routes = [
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'organization',
        loadChildren: () => import('../../modules/admin/admin.module').then((m) => m.AdminModule),
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: [EnumPageMemberType.ADMIN, EnumPageMemberType.OWNER] },
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
        path: 'customer-sla',
        loadChildren: () => import('../../modules/customer-sla/customer-sla.module').then((m) => m.CustomerSlaModule),
        canActivate: [AuthGuard, PermissionGuard],
        data: { roles: [EnumPageMemberType.ADMIN, EnumPageMemberType.OWNER] },
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
        redirectTo: 'follows',
        //   loadChildren: () => import('@reactor-room/plusmar-front-end-share/order/audience/audience.module').then((m) => m.AudienceModule),
        //   canActivate: [AuthGuard],
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
      //edit this once u finished moving component of setting
      {
        path: 'setting',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/setting/setting.module').then((m) => m.SettingModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'pages',
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/pages/pages.module').then((m) => m.PagesModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'purchase-order',
        loadChildren: () => import('../../modules/purchase-order/purchase-order.module').then((m) => m.PurchaseOrderModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'shopowner',
        loadChildren: () => import('../../modules/shop-owner-info/shop-owner-info.module').then((m) => m.ShopOwnerInfoModule),
        canActivate: [AuthGuard],
      },
      {
        path: 'create-shop',
        loadChildren: () => import('../../modules/wizard/wizard.module').then((m) => m.WizardModule),
        canActivate: [],
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LayoutRoutingModule {}
