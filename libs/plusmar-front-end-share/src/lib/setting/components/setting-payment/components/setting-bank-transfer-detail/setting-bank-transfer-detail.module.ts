import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingBankTransferDetailComponent } from './setting-bank-transfer-detail.component';
import { FormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';

@NgModule({
  declarations: [SettingBankTransferDetailComponent],
  imports: [CommonModule, FormsModule, TranslateModule, MatTooltipModule],
  exports: [SettingBankTransferDetailComponent],
})
export class SettingBankTransferDetailModule {}
