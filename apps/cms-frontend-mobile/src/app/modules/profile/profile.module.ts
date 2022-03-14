import { CommonModule } from '@angular/common';

import { ProfileComponent } from './profile.component';
import { ProfileRoutingModule } from './profile.routing';
import { NgModule } from '@angular/core';

import { ProfileSettingModule } from './components/profile-setting/profile-setting.module';
import { ProfileHelpModule } from './components/profile-help/profile-help.module';
import { ProfileLogoutModule } from './components/profile-logout/profile-logout.module';
import { ProfileNotificationModule } from './components/profile-notification/profile-notification.module';
import { TranslateModule } from '@ngx-translate/core';

const MODULES = [ProfileSettingModule, ProfileHelpModule, ProfileLogoutModule, ProfileNotificationModule];
@NgModule({
  declarations: [ProfileComponent],
  imports: [CommonModule, ProfileRoutingModule, TranslateModule, MODULES],
  providers: [],
  exports: [ProfileComponent],
})
export class ProfileModule {}
