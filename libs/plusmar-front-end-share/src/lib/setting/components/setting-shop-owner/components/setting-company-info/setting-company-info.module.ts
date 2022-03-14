import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingCompanyInfoComponent } from './setting-company-info.component';
import { CardModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyInfoDialogModule } from './company-info-dialog/company-info-dialog.module';

@NgModule({
  declarations: [SettingCompanyInfoComponent],
  imports: [CommonModule, CardModule, TranslateModule, CompanyInfoDialogModule],
  exports: [SettingCompanyInfoComponent],
})
export class SettingCompanyInfoModule {}
