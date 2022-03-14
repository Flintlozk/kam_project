import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DashboardComponent } from './dashboard.component';
import { DashboardRoutingModule } from './dashboard.routing';
import { DashboardLayoutModule } from './containers/dashboard-layout/dashboard-layout.module';
import { LowStockModule } from './components/low-stock/low-stock.module';
import { NewOrderModule } from './components/new-order/new-order.module';
import { ConfirmPendingModule } from './components/confirm-pending/confirm-pending.module';
import { ShippingPendingModule } from './components/shipping-pending/shipping-pending.module';
import { FinishOrderModule } from './components/finish-order/finish-order.module';
import { ActiveUserModule } from './components/active-user/active-user.module';
import { ContentManagementModule } from './components/content-management/content-management.module';
import { FileManagementModule } from './components/file-management/file-management.module';
import { ProductManagementModule } from './components/product-management/product-management.module';
import { ShopInformationModule } from './components/shop-information/shop-information.module';
import { OrderManagementModule } from './components/order-management/order-management.module';
import { ShippingSystemModule } from './components/shipping-system/shipping-system.module';
import { PaymentSystemModule } from './components/payment-system/payment-system.module';
import { SaleChannelModule } from './components/sale-channel/sale-channel.module';
import { TrashModule } from './components/trash/trash.module';
import { TemplateSettingModule } from './components/template-setting/template-setting.module';
import { ECommerceDetailsModule } from './components/e-commerce-details/e-commerce-details.module';
import { AudienceDetailsModule } from './components/audience-details/audience-details.module';
import { InboxModule } from './components/inbox/inbox.module';
import { LayoutModule } from '../../containers/layout/layout.module';
import { ECommerceModule } from './components/e-commerce/e-commerce.module';

@NgModule({
  declarations: [DashboardComponent],
  imports: [
    CommonModule,
    DashboardRoutingModule,
    DashboardLayoutModule,
    NewOrderModule,
    ConfirmPendingModule,
    ShippingPendingModule,
    FinishOrderModule,
    LowStockModule,
    ActiveUserModule,
    ContentManagementModule,
    FileManagementModule,
    ProductManagementModule,
    ShopInformationModule,
    OrderManagementModule,
    ShippingSystemModule,
    PaymentSystemModule,
    SaleChannelModule,
    TrashModule,
    InboxModule,
    TemplateSettingModule,
    ECommerceDetailsModule,
    AudienceDetailsModule,
    LayoutModule,
    ContentManagementModule,
    ECommerceModule,
  ],
  exports: [DashboardComponent],
})
export class DashboardModule {}
