import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingPaySolutionsDetailComponent } from './setting-pay-solutions-detail.component';
import { TranslateModule } from '@ngx-translate/core';
import { CardModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [SettingPaySolutionsDetailComponent],
  imports: [CommonModule, TranslateModule, CardModule],
  exports: [SettingPaySolutionsDetailComponent],
})
export class SettingPaySolutionsDetailModule {}
