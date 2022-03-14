import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HeaderComponent } from './header.component';
import { LanguageSwitchModule } from './components/language-switch/language-switch.module';
import { AccountOptionModule } from './components/account-option/account-option.module';
import { EcosystemModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [HeaderComponent],
  imports: [CommonModule, EcosystemModule, LanguageSwitchModule, AccountOptionModule],
  exports: [HeaderComponent],
})
export class HeaderModule {}
