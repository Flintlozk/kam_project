import { registerLocaleData } from '@angular/common';
import localePt from '@angular/common/locales/pt';
import { NgModule } from '@angular/core';

import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { FilterDateService } from '@reactor-room/plusmar-front-end-share/services/filter-date.service';

import { CloseSaleInfoModule } from './containers/close-sale-info/close-sale-info.module';
import { FollowCustomerRoutingModule } from './follow-customer.routing';
import { OrderService } from './services/order.service';
import { StepCloseSalesModule } from './components/5-step-close-sales/step-close-sales.module';
import { HttpClient } from '@angular/common/http';
import { MultiTranslateHttpLoader } from 'ngx-translate-multi-http-loader';
import { StepAllModule } from './components/0-step-all/step-all.module';
import { StepFollowModule } from './components/1-step-follow/step-follow.module';
import { StepPendingModule } from './components/2-step-pending/step-pending.module';
import { StepConfirmPaymentModule } from './components/3-step-confirm-payment/step-confirm-payment.module';
import { StepUnfulfilledModule } from './components/4-step-unfulfilled/step-unfulfilled.module';
import { AddressShippingInfoModule } from './containers/address-shipping-info/address-shipping-info.module';
import { CommentDialogContentModule } from './components/comment-dialog/comment-dialog-content/comment-dialog-content.module';
import { ShippingInfoDetailModule } from './containers/address-shipping-info/shipping-info-detail/shipping-info-detail.module';
import { ReportFollowCustomerModule } from './containers/report-follow-customer/report-follow-customer.module';
import { ReportMultiplePrintModule } from './containers/report-multiple-print/report-multiple-print.module';
import { DebugPipelineModule } from './containers/debug-pipeline/debug-pipeline.module';
import { CommentDialogContentSelectorModule } from './components/comment-dialog/comment-dialog-content/comment-dialog-content-selector/comment-dialog-content-selector.module';
import { PaymentInfoDetailModule } from './containers/payment-shipping-info/payment-info-detail/payment-info-detail.module';
import { PaymentShippingInfoModule } from './containers/payment-shipping-info/payment-shipping-info.module';
import { FollowCustomerModule as FollowCustomerComponentModule } from './containers/follow-customer/follow-customer.module';
import { ConfirmTrackingNoDialogModule } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/comfirm-tracking-no-dialog/confirm-tracking-no-dialog.module';
// eslint-disable-next-line max-len
import { PrintingSelectTypeDialogModule } from '@reactor-room/plusmar-front-end-share/order/follow-customer/components/printing-select-type-dialog/printing-select-type-dialog.module';
import { TopupDialogModule } from '@reactor-room/plusmar-front-end-share/topup/topup-dialog/topup-dialog.module';
import { CustomerTagsDialogModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tags-dialog/customer-tags-dialog.module';
import { HistoryDialogModule } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/history-dialog.module';
import { MarketplaceOrdersModule } from '@reactor-room/plusmar-front-end-share/order/marketplace-orders/marketplace-orders.module';

registerLocaleData(localePt, 'th-TH');

@NgModule({
  imports: [
    StepAllModule,
    StepFollowModule,
    StepPendingModule,
    StepConfirmPaymentModule,
    StepUnfulfilledModule,
    FollowCustomerComponentModule,
    PaymentShippingInfoModule,
    AddressShippingInfoModule,
    ShippingInfoDetailModule,
    PaymentInfoDetailModule,
    CommentDialogContentModule,
    CommentDialogContentSelectorModule,
    ReportFollowCustomerModule,
    ReportMultiplePrintModule,
    DebugPipelineModule, // ! DEBUGGER
    FollowCustomerRoutingModule,
    ITOPPLUSCDKModule,
    CloseSaleInfoModule,
    StepCloseSalesModule,
    ConfirmTrackingNoDialogModule,
    PrintingSelectTypeDialogModule,
    TopupDialogModule,
    CustomerTagsDialogModule,
    HistoryDialogModule,
    MarketplaceOrdersModule,
    TranslateModule,
  ],
  providers: [FilterDateService, OrderService],
})
export class FollowCustomerModule {}
