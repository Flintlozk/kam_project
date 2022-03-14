import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { LanguageSwitchModule } from '../../components/language-switch/language-switch.module';
import { NotificationModule } from '../../components/notification/notification.module';
import { AccountModule } from '../../components/account/account.module';
import { EcosystemModule } from '@reactor-room/itopplus-cdk/ecosystem/ecosystem.module';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, LanguageSwitchModule, NotificationModule, AccountModule, EcosystemModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
