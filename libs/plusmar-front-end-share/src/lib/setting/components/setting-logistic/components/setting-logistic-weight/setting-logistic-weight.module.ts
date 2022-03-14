import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticWeightComponent } from './setting-logistic-weight.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticWeightComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SettingLogisticWeightComponent],
})
export class SettingLogisticWeightModule {}
