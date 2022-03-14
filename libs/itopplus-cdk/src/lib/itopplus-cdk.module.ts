import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { MatPaginatorIntl } from '@angular/material/paginator';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { LockScreenDialogComponent } from '@reactor-room/itopplus-cdk/lock-screen-dialog/lock-screen-dialog.component';
import { QuillModule } from 'ngx-quill';
import { AutoFocusModule } from './autofocus/autofocus.module';
import { CardModule } from './card/card.module';
import { ChipcardListComponent } from './chipcard-list/chipcard-list.component';
import { ClickOutsideModule } from './click-outsite-directive/click-outside.module';
import { ConfirmBoxDirective } from './confirm-box/confirm-box.directive';
import { ConfirmMessageComponent } from './confirm-box/confirm-message/confirm-message.component';
import { ConfirmDialogComponent } from './confirm-dialog/confirm-dialog.component';
import { CustomDialogModule } from './custom-dialog/custom-dialog.module';
import { DateDiffPipe } from './datediff/datediff.pipe';
import { DatepickerModule } from './datepicker/datepicker.module';
import { NumericDirective } from './directives';
import { CurrencyPipe } from './directives/currency-pipe/currency.pipe';
import { DoughnutChartDirective } from './directives/doughnut-chart-directive/doughnut-chart.directive';
import { LineChartDirective } from './directives/line-chart-directive/line-chart.directive';
import { CustomerLineChartDirective } from './directives/customer-line-chart-directive/customer-line-chart.directive';
import { FacebookLoginModule } from './facebook-login/facebook-login.module';
import { GoogleLoginModule } from './google-login/google-login.module';
import { HeadingModule } from './heading/heading.module';
import { LoaderModule } from './loader/loader.module';
import { MaterialModule } from './material-module';
import { MatPaginatorI18nService } from './pagination/CustomPaginatorConfiguration';
import { PaginationModule } from './pagination/pagination.module';
import { RouterLinkActiveMatchModule } from './routerLinkActiveMatch/router-link-active-match.module';
import { SafeHtmlPipeModule } from './safehtml-pipe/safehtml.module';
import { SelectOptionComponent } from './select-option/select-option.component';
import { SimpleInfoDialogComponent } from './simple-info-dialog/simple-info-dialog.component';
import { StepComponent } from './step/step.component';
import { SuccessDialogWithLinkComponent } from './success-dialog-with-link/success-dialog-with-link.component';
import { SuccessDialogComponent } from './success-dialog/success-dialog.component';
import { TextTrimModule } from './text-trim/text-trim.module';
import { TimeAgoPipeModule } from './time-ago-pipe/time-ago.module';
import { VerticalDragContentDirective } from './vertical-drag-content/vertical-drag-content.directive';
import { SubscriptionSwitcherModule } from './subscription-switcher/subscription-switcher.module';
import { ShopPageSwitcherModule } from './shop-page-switcher/shop-page-switcher.module';
import { CustomChipModule } from './custom-chip/custom-chip.module';
export { DialogData } from './confirm-box/confirm-box.directive';
export { remainItemOnNextPage } from './pagination/pagination.component';

const EXPORT_COMPONENT = [
  ConfirmBoxDirective,
  VerticalDragContentDirective,
  DoughnutChartDirective,
  LineChartDirective,
  CustomerLineChartDirective,
  ConfirmMessageComponent,
  DateDiffPipe,
  ChipcardListComponent,
  StepComponent,
  // HeadingComponent,
  SelectOptionComponent,
  SuccessDialogComponent,
  SuccessDialogWithLinkComponent,
  LockScreenDialogComponent,
  ConfirmDialogComponent,
  NumericDirective,
  // AddressComponent,
  SimpleInfoDialogComponent,
  CurrencyPipe,
];

@NgModule({
  imports: [
    RouterModule,
    CommonModule,
    MaterialModule,
    QuillModule.forRoot(),
    TranslateModule,
    ClickOutsideModule,
    LoaderModule,
    RouterLinkActiveMatchModule,
    FacebookLoginModule,
    CustomDialogModule,
    CardModule,
    DatepickerModule,
    PaginationModule,
    TimeAgoPipeModule,
    SafeHtmlPipeModule,
    AutoFocusModule,
    GoogleLoginModule,
    HeadingModule,
    SubscriptionSwitcherModule,
    CustomChipModule,
    ShopPageSwitcherModule,
  ],
  declarations: EXPORT_COMPONENT,
  exports: [
    ...EXPORT_COMPONENT,
    LoaderModule,
    ClickOutsideModule,
    RouterLinkActiveMatchModule,
    CustomDialogModule,
    CardModule,
    DatepickerModule,
    PaginationModule,
    TimeAgoPipeModule,
    SafeHtmlPipeModule,
    AutoFocusModule,
    GoogleLoginModule,
    HeadingModule,
    TextTrimModule,
    SubscriptionSwitcherModule,
    ShopPageSwitcherModule,
  ],
  providers: [
    {
      provide: MatPaginatorIntl,
      useClass: MatPaginatorI18nService,
    },
  ],
})
export class ITOPPLUSCDKModule {}
