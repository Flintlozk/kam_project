import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OptionToggleLayoutComponent } from './option-toggle-layout.component';
import { ClickOutsideModule } from '@reactor-room/cms-cdk';
import { TranslateModule } from '@ngx-translate/core';
@NgModule({
  declarations: [OptionToggleLayoutComponent],
  imports: [CommonModule, ClickOutsideModule, TranslateModule],
  exports: [OptionToggleLayoutComponent],
})
export class OptionToggleLayoutModule {}
