import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticFlashExpressDetailComponent } from './setting-logistic-flash-express-detail.component';
import { MatSelectModule } from '@angular/material/select';
import { ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [SettingLogisticFlashExpressDetailComponent],
  imports: [CommonModule, MatSelectModule, ReactiveFormsModule],
  exports: [SettingLogisticFlashExpressDetailComponent],
})
export class SettingLogisticFlashExpressDetailModule {}
