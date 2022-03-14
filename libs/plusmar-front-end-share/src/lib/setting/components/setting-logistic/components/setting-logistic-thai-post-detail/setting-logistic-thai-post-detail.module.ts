import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingLogisticThaiPostDetailComponent } from './setting-logistic-thai-post-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { MatSelectModule } from '@angular/material/select';
import { FilterModule } from '@reactor-room/plusmar-cdk';
import { ReactiveFormsModule } from '@angular/forms';
import { FormatCurrencyModule } from '@reactor-room/itopplus-cdk';
import { LotNumberPipeModule } from '../../pipes/lot-number-pipe/lot-number-pipe.module';

@NgModule({
  declarations: [SettingLogisticThaiPostDetailComponent],
  imports: [CommonModule, TranslateModule, MatSelectModule, FilterModule, ReactiveFormsModule, FormatCurrencyModule, LotNumberPipeModule],
  exports: [SettingLogisticThaiPostDetailComponent],
})
export class SettingLogisticThaiPostDetailModule {}
