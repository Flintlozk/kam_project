import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { SettingMessageTrackModeModule } from './components/setting-message-track-mode/setting-message-track-mode.module';
import { SettingWorkingHourModule } from './components/setting-working-hour/setting-working-hour.module';
import { SettingGeneralComponent } from './setting-general.component';

@NgModule({
  declarations: [SettingGeneralComponent],
  imports: [CommonModule, SettingWorkingHourModule, SettingMessageTrackModeModule, TranslateModule],
  exports: [SettingGeneralComponent],
})
export class SettingGeneralModule {}
