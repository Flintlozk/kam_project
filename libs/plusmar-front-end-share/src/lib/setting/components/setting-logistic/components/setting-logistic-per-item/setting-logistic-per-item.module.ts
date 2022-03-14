import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticPerItemComponent } from './setting-logistic-per-item.component';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticPerItemComponent],
  imports: [CommonModule, ReactiveFormsModule],
  exports: [SettingLogisticPerItemComponent],
})
export class SettingLogisticPerItemModule {}
