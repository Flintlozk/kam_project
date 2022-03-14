import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticDeliveryDialogComponent } from './setting-logistic-delivery-dialog.component';
import { MatSelectModule } from '@angular/material/select';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticDeliveryDialogComponent],
  imports: [CommonModule, MatSelectModule, CustomDialogModule, ReactiveFormsModule],
  exports: [SettingLogisticDeliveryDialogComponent],
})
export class SettingLogisticDeliveryDialogModule {}
