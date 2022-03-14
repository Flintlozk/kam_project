import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingPaymentComponent } from './setting-payment.component';
import {
  Setting2C2PlDialogComponent,
  SettingBankTransferDialogComponent,
  SettingCodDialogComponent,
  SettingKbankDialogComponent,
  SettingOmiseDialogComponent,
  SettingPaypalDialogComponent,
  SettingPaySolutionsDialogComponent,
} from './components';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { SettingBankTransferDetailModule } from './components/setting-bank-transfer-detail/setting-bank-transfer-detail.module';
import { SettingCodDetailModule } from './components/setting-cod-detail/setting-cod-detail.module';
import { SettingKbankDetailModule } from './components/setting-kbank-detail/setting-kbank-detail.module';
import { SettingOmiseDetailModule } from './components/setting-omise-detail/setting-omise-detail.module';
import { SettingPaySolutionsDetailModule } from './components/setting-pay-solutions-detail/setting-pay-solutions-detail.module';
import { SettingPaypalDetailModule } from './components/setting-paypal-detail/setting-paypal-detail.module';
import { Setting2c2pDetailModule } from './components/setting-2c2p-detail/setting-2c2p-detail.module';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CardModule, CustomDialogModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { MatSelectModule } from '@angular/material/select';
const COMPONENTS = [
  SettingPaymentComponent,
  SettingBankTransferDialogComponent,
  SettingCodDialogComponent,
  SettingKbankDialogComponent,
  SettingPaypalDialogComponent,
  Setting2C2PlDialogComponent,
  SettingPaySolutionsDialogComponent,
  SettingOmiseDialogComponent,
];
@NgModule({
  declarations: [...COMPONENTS],
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule,
    FormsModule,
    MatSelectModule,
    ReactiveFormsModule,
    CustomDialogModule,
    SettingBankTransferDetailModule,
    SettingCodDetailModule,
    SettingKbankDetailModule,
    SettingOmiseDetailModule,
    SettingPaySolutionsDetailModule,
    SettingPaypalDetailModule,
    Setting2c2pDetailModule,
    LoaderModule,
    CardModule,
  ],
  exports: [SettingPaymentComponent],
})
export class SettingPaymentModule {}
