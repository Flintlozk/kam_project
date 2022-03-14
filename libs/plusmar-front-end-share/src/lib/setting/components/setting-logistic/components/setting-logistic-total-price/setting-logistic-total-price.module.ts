import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticTotalPriceComponent } from './setting-logistic-total-price.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticTotalPriceComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SettingLogisticTotalPriceComponent],
})
export class SettingLogisticTotalPriceModule {}
