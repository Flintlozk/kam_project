import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingPaypalDetailComponent } from './setting-paypal-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingPaypalDetailComponent],
  imports: [CommonModule, TranslateModule, CardModule],
  exports: [SettingPaypalDetailComponent],
})
export class SettingPaypalDetailModule {}
