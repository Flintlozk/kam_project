import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticTotalItemsComponent } from './setting-logistic-total-items.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticTotalItemsComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SettingLogisticTotalItemsComponent],
})
export class SettingLogisticTotalItemsModule {}
