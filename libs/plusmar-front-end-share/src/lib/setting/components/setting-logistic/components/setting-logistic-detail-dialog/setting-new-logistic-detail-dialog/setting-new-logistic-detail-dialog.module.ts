import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingNewLogisticDetailDialogComponent } from './setting-new-logistic-detail-dialog.component';
import { SettingLogisticFlatShippingModule } from '../../setting-logistic-flat-shipping/setting-logistic-flat-shipping.module';
import { ReactiveFormsModule } from '@angular/forms';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [SettingNewLogisticDetailDialogComponent],
  imports: [CommonModule, SettingLogisticFlatShippingModule, ReactiveFormsModule, CustomDialogModule, MatSelectModule, MatFormFieldModule],
  exports: [SettingNewLogisticDetailDialogComponent],
})
export class SettingNewLogisticDetailDailogModule {}
