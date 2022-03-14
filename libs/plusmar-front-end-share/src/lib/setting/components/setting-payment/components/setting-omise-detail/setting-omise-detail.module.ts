import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingOmiseDetailComponent } from './setting-omise-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingOmiseDetailComponent],
  imports: [CommonModule, TranslateModule, CardModule],
  exports: [SettingOmiseDetailComponent],
})
export class SettingOmiseDetailModule {}
