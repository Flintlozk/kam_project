import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { ITOPPLUSCDKModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { MatTooltipModule } from '@angular/material/tooltip';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { SettingWebhookQuickpayComponent } from './setting-webhook-quickpay.component';

@NgModule({
  imports: [CommonModule, MatExpansionModule, MatTabsModule, TranslateModule, FormsModule, MatTooltipModule, ReactiveFormsModule, ITOPPLUSCDKModule, LoaderModule],
  exports: [SettingWebhookQuickpayComponent],
  declarations: [SettingWebhookQuickpayComponent],
  providers: [],
})
export class SettingWebhookQuickpayModule {}
