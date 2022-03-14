import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatTabsModule } from '@angular/material/tabs';
import { TranslateModule } from '@ngx-translate/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ITOPPLUSCDKModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { MatTooltipModule } from '@angular/material/tooltip';
import { SettingWebhookPatternComponent } from './setting-webhook-pattern.component';
import { SettingWebhookPatternDetailComponent } from './components/setting-webhook-pattern-detail/setting-webhook-pattern-detail.component';
import { SettingWebhookPatternDialogComponent } from './components/setting-webhook-pattern-dialog/setting-webhook-pattern-dialog.component';

@NgModule({
  imports: [CommonModule, MatExpansionModule, MatTabsModule, TranslateModule, FormsModule, MatTooltipModule, ReactiveFormsModule, ITOPPLUSCDKModule, LoaderModule],
  exports: [SettingWebhookPatternComponent],
  declarations: [SettingWebhookPatternComponent, SettingWebhookPatternDetailComponent, SettingWebhookPatternDialogComponent],
  providers: [],
})
export class SettingWebhookPatternModule {}
