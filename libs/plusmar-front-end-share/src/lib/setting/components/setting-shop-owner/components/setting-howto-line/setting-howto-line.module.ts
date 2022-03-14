import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingHowtoLineComponent } from './setting-howto-line.component';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
@NgModule({
  declarations: [SettingHowtoLineComponent],
  imports: [CommonModule, CustomDialogModule],
  exports: [SettingHowtoLineComponent],
})
export class SettingHowtoLineModule {}
