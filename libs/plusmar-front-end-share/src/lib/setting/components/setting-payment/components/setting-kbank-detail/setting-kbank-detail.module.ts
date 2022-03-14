import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingKbankDetailComponent } from './setting-kbank-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingKbankDetailComponent],
  imports: [CommonModule, TranslateModule, CardModule],
  exports: [SettingKbankDetailComponent],
})
export class SettingKbankDetailModule {}
