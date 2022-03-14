import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingOpenapiComponent } from './setting-openapi.component';
import { TranslateModule } from '@ngx-translate/core';
import { SettingWebhookModule } from './components/setting-webhook/setting-webhook.module';
import { SettingAPIModule } from './components/setting-api/setting-api.module';
import { SettingWebhookPatternModule } from './components/setting-webhook-pattern/setting-webhook-pattern.module';
import { SettingWebhookQuickpayModule } from './components/setting-webhook-quickpay/setting-webhook-quickpay.module';
import { OpenApiService } from '@reactor-room/plusmar-front-end-share/services/settings/open-api.service';

@NgModule({
  declarations: [SettingOpenapiComponent],
  imports: [CommonModule, SettingAPIModule, SettingWebhookModule, TranslateModule, SettingWebhookPatternModule, SettingWebhookQuickpayModule],
  exports: [SettingOpenapiComponent],
  providers: [OpenApiService],
})
export class SettingOpenapiModule {}
