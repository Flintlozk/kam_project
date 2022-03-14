import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProfileSettingComponent } from './profile-setting.component';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ProfileSettingComponent],
  imports: [CommonModule, TranslateModule],
  exports: [ProfileSettingComponent],
})
export class ProfileSettingModule {}
