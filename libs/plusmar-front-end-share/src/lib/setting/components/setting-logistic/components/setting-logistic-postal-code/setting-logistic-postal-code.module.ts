import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticPostalCodeComponent } from './setting-logistic-postal-code.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatSelectModule } from '@angular/material/select';
import { MatFormFieldModule } from '@angular/material/form-field';

@NgModule({
  declarations: [SettingLogisticPostalCodeComponent],
  imports: [CommonModule, ReactiveFormsModule, MatSelectModule, MatFormFieldModule],
  exports: [SettingLogisticPostalCodeComponent],
})
export class SettingLogisticPostalCodeModule {}
