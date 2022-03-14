import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeadingModule } from '../../../../components/heading/heading.module';
import { AudienceModule } from '../../components/audience/audience.module';
import { MyShortcutModule } from '../../components/my-shortcut/my-shortcut.module';
import { SeoModule } from '../../components/seo/seo.module';
import { SiteDetailsModule } from '../../components/site-details/site-details.module';
import { DateFilterModule } from '../../components/date-filter/date-filter.module';
import { ECommerceModule } from '../../components/e-commerce/e-commerce.module';
import { LowStockModule } from '../../components/low-stock/low-stock.module';
import { DashboardLayoutComponent } from './dashboard-layout.component';
import { DomainModule } from '../../components/domain/domain.module';
import { SummaryModule } from '../../components/summary-audience/summary-audience.module';
import { OrderModule } from '../../components/order/order.module';
import { MessageModule } from '../../components/message/message.module';

@NgModule({
  declarations: [DashboardLayoutComponent],
  imports: [
    CommonModule,
    HeadingModule,
    AudienceModule,
    MyShortcutModule,
    SeoModule,
    SiteDetailsModule,
    DateFilterModule,
    ECommerceModule,
    LowStockModule,
    DomainModule,
    SummaryModule,
    OrderModule,
    MessageModule,
  ],
  exports: [DashboardLayoutComponent],
})
export class DashboardLayoutModule {}
