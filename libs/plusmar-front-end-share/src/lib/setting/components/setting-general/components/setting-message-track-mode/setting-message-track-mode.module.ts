import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SettingMessageTrackModeComponent } from './setting-message-track-mode.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [SettingMessageTrackModeComponent],
  imports: [CommonModule, ReactiveFormsModule, MatExpansionModule, TranslateModule],
  exports: [SettingMessageTrackModeComponent],
})
export class SettingMessageTrackModeModule {}
