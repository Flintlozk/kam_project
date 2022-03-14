import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { UpgradeModule } from '../upgrade/upgrade.module';
import { PackageLabelModule } from '../package-label/package-label.module';
import { ClickOutsideModule, EcosystemModule, LoaderModule } from '@reactor-room/itopplus-cdk';
import { LanguageSwitchModule } from '../language-switch/language-switch.module';
import { TranslateModule } from '@ngx-translate/core';
import { MatTooltipModule } from '@angular/material/tooltip';
import { NotificationInboxModule } from '../notification-inbox/notification.inbox.module';
import { WizardNavComponent } from './wizard-nav.component';

@NgModule({
  declarations: [WizardNavComponent],
  imports: [
    CommonModule,
    PackageLabelModule,
    UpgradeModule,
    LanguageSwitchModule,
    TranslateModule,
    MatTooltipModule,
    NotificationInboxModule,
    ClickOutsideModule,
    LoaderModule,
    EcosystemModule,
  ],
  exports: [WizardNavComponent],
})
export class WizardNavModule {}
