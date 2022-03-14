import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { FormatCurrencyModule, ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { SettingLogisticComponent } from './setting-logistic.component';
import { LogisticFee, LogisticTitle } from './pipes/';

import { CardModule, CustomDialogModule } from '@reactor-room/itopplus-cdk';

import { MatFormFieldModule } from '@angular/material/form-field';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatSelectModule } from '@angular/material/select';

import { SettingLogisticShippingInfoDialogComponent, SettingLogisticRunningNumberInfoDialogComponent } from './components';
import { CustomTableModule, FilterModule } from '@reactor-room/plusmar-cdk';
import { SettingLogisticFlashExpressDetailModule } from './components/setting-logistic-flash-express-detail/setting-logistic-flash-express-detail.module';
import { SettingLogisticDetailDialogModule } from './components/setting-logistic-detail-dialog/setting-logistic-detail-dialog.module';
import { LogisticSystemModule } from '@reactor-room/plusmar-front-end-share/logistic-system/logistic-system.module';
import { SettingLogisticDeliveryDialogModule } from './components/setting-logistic-delivery-dialog/setting-logistic-delivery-dialog.module';
import { SettingLogisticPerItemModule } from './components/setting-logistic-per-item/setting-logistic-per-item.module';
import { SettingLogisticPostalCodeModule } from './components/setting-logistic-postal-code/setting-logistic-postal-code.module';
import { SettingNewLogisticDetailDailogModule } from './components/setting-logistic-detail-dialog/setting-new-logistic-detail-dialog/setting-new-logistic-detail-dialog.module';
import { LotNumberPipeModule } from './pipes/lot-number-pipe/lot-number-pipe.module';
import { SettingLogisticTotalItemsModule } from './components/setting-logistic-total-items/setting-logistic-total-items.module';
import { SettingLogisticTotalPriceModule } from './components/setting-logistic-total-price/setting-logistic-total-price.module';
import { SettingLogisticWeightModule } from './components/setting-logistic-weight/setting-logistic-weight.module';

@NgModule({
  declarations: [SettingLogisticComponent, LogisticFee, LogisticTitle, SettingLogisticRunningNumberInfoDialogComponent, SettingLogisticShippingInfoDialogComponent],
  exports: [SettingLogisticComponent, LogisticFee, LogisticTitle],
  imports: [
    CommonModule,
    CustomDialogModule,
    TranslateModule,
    MatSelectModule,
    LotNumberPipeModule,
    MatFormFieldModule,
    MatDatepickerModule,
    CustomTableModule,
    CardModule,
    MatTooltipModule,
    FormsModule,
    ReactiveFormsModule,
    ITOPPLUSCDKModule,
    FilterModule,
    FormatCurrencyModule,
    LogisticSystemModule,
    SettingLogisticFlashExpressDetailModule,
    SettingLogisticDetailDialogModule,
    SettingLogisticDeliveryDialogModule,
    SettingLogisticPerItemModule,
    SettingLogisticPostalCodeModule,
    SettingNewLogisticDetailDailogModule,
    SettingLogisticTotalItemsModule,
    SettingLogisticTotalPriceModule,
    SettingLogisticWeightModule,
  ],
})
export class SettingLogisticModule {}
