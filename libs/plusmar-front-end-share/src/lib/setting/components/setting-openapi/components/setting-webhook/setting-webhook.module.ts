import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingWebhookComponent } from './setting-webhook.component';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule } from '@angular/forms';
@NgModule({
  declarations: [SettingWebhookComponent],
  imports: [CommonModule, FormsModule, MatExpansionModule, MatTabsModule, TranslateModule],
  exports: [SettingWebhookComponent],
})
export class SettingWebhookModule {}
