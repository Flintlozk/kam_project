import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticFlatShippingComponent } from './setting-logistic-flat-shipping.component';
import { MatSelectModule } from '@angular/material/select';
import { TranslateModule } from '@ngx-translate/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingLogisticFlatShippingComponent],
  imports: [CommonModule, MatSelectModule, TranslateModule, ReactiveFormsModule, MatFormFieldModule, CustomDialogModule],
  exports: [SettingLogisticFlatShippingComponent],
})
export class SettingLogisticFlatShippingModule {}
