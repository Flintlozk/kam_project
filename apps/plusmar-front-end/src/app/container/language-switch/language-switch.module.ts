import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LanguageSwitchComponent } from './language-switch.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LanguageSwitchComponent],
  imports: [CommonModule, MatTooltipModule, TranslateModule],
  exports: [LanguageSwitchComponent],
})
export class LanguageSwitchModule {}
