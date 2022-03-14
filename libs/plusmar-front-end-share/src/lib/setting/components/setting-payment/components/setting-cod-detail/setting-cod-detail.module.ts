import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingCodDetailComponent } from './setting-cod-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingCodDetailComponent],
  imports: [CommonModule, TranslateModule, CardModule],
  exports: [SettingCodDetailComponent],
})
export class SettingCodDetailModule {}
