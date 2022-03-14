import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { EnumAuthScope } from '@reactor-room/itopplus-model-lib';
import { ActiveUserComponent } from './components/active-user/active-user.component';
import { AudienceDetailsComponent } from './components/audience-details/audience-details.component';
import { ConfirmPendingComponent } from './components/confirm-pending/confirm-pending.component';
import { ContentManagementComponent } from './components/content-management/content-management.component';
import { ECommerceDetailsComponent } from './components/e-commerce-details/e-commerce-details.component';
import { ECommerceComponent } from './components/e-commerce/e-commerce.component';
import { FileManagementComponent } from './components/file-management/file-management.component';
import { FinishOrderComponent } from './components/finish-order/finish-order.component';
import { InboxComponent } from './components/inbox/inbox.component';
import { LowStockComponent } from './components/low-stock/low-stock.component';
import { NewOrderComponent } from './components/new-order/new-order.component';
import { OrderManagementComponent } from './components/order-management/order-management.component';
import { PaymentSystemComponent } from './components/payment-system/payment-system.component';
import { SaleChannelComponent } from './components/sale-channel/sale-channel.component';
import { ShippingPendingComponent } from './components/shipping-pending/shipping-pending.component';
import { ShippingSystemComponent } from './components/shipping-system/shipping-system.component';
import { ShopInformationComponent } from './components/shop-information/shop-information.component';
import { TemplateSettingComponent } from './components/template-setting/template-setting.component';
import { TrashComponent } from './components/trash/trash.component';
import { DashboardLayoutComponent } from './containers/dashboard-layout/dashboard-layout.component';
import { DashboardComponent } from './dashboard.component';

const routes: Routes = [
  {
    path: '',
    component: DashboardComponent,
    data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_PAGE },
    children: [
      { path: '', component: DashboardLayoutComponent },
      { path: RouteLinkEnum.DASHBOARD_NEW_ORDER, component: NewOrderComponent, data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_NEW_ORDER_PAGE } },
      {
        path: RouteLinkEnum.DASHBOARD_CONFIRM_PENDING,
        component: ConfirmPendingComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_CONFIRM_PENDING_PAGE },
      },
      {
        path: RouteLinkEnum.DASHBOARD_SHIPPING_PENDING,
        component: ShippingPendingComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_SHIPPING_PENDING_PAGE },
      },
      {
        path: RouteLinkEnum.DASHBOARD_FINISH_ORDER,
        component: FinishOrderComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_FINISH_ORDER_PAGE },
      },

      {
        path: RouteLinkEnum.DASHBOARD_LOW_STOCK,
        loadChildren: () => import('./components/low-stock/low-stock.module').then((m) => m.LowStockModule),
        //anActivate: [AuthGuard],
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_LOW_STOCK_PAGE },
      },

      { path: RouteLinkEnum.DASHBOARD_ACTIVE_USER, component: ActiveUserComponent, data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_ACTIVE_USER_PAGE } },
      {
        path: RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT,
        loadChildren: () => import('./components/content-management/content-management.module').then((m) => m.ContentManagementModule),
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_CONTENT_MANAGEMENT_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_FILE_MANAGEMENT,
        component: FileManagementComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_FILE_MANAGEMENT_PAGE },
      },
      { path: RouteLinkEnum.SHORTCUT_PRODUCT_MANAGEMENT, pathMatch: 'full', redirectTo: `${RouteLinkEnum.SHORTCUT_PRODUCT_MANAGEMENT}/product-list` + '/' + 1 },
      {
        path: RouteLinkEnum.SHORTCUT_PRODUCT_MANAGEMENT,
        loadChildren: () => import('@reactor-room/plusmar-front-end-share/products/products.module').then((m) => m.ProductsModule),
        //canActivate: [AuthGuard],
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_PRODUCTS_PAGE, projectScope: EnumAuthScope.CMS },
      },
      {
        path: RouteLinkEnum.SHORTCUT_SHOP_INFORMATION,
        component: ShopInformationComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_SHOP_INFORMATION_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_ORDER_MANAGEMENT,
        component: OrderManagementComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_ORDER_MANAGEMENT_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_SHIPPING_SYSTEM,
        component: ShippingSystemComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_SHIPPING_SYSTEM_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_PAYMENT_SYSTEM,
        component: PaymentSystemComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_PAYMENT_SYSTEM_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_SALE_CHANNEL,
        component: SaleChannelComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_SALE_CHANNEL_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_TRASH,
        component: TrashComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_TRASH_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_INBOX,
        component: InboxComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_INBOX_PAGE },
      },
      {
        path: RouteLinkEnum.SHORTCUT_TEMPLATE_SETTING,
        component: TemplateSettingComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.SHORTCUT_TEMPLATE_SETTING_PAGE },
      },
      {
        path: RouteLinkEnum.DASHBOARD_ECOMMERCE,
        component: ECommerceDetailsComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_ECOMMERCE_PAGE },
      },
      {
        path: RouteLinkEnum.DASHBOARD_AUDIENCE,
        component: AudienceDetailsComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_AUDIENCE_PAGE },
      }, 
      {
        path: RouteLinkEnum.DASHBOARD_ECOMMERCE_LOW_STOCK,
        component: ECommerceComponent,
        data: { animation: RouteAnimateEnum.CMSRouteAnimationEnum.DASHBOARD_ECOMMERCE_LOW_STOCK_PAGE },
      },
    ],
  },
  {
    path: '**',
    redirectTo: '',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class DashboardRoutingModule {}
