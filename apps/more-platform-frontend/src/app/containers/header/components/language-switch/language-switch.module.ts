import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitchComponent } from './language-switch.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [LanguageSwitchComponent],
  imports: [CommonModule, ClickOutsideModule],
  exports: [LanguageSwitchComponent],
})
export class LanguageSwitchModule {}
