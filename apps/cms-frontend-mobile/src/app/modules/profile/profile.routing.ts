import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileComponent } from './profile.component';
import { ProfileSettingComponent } from './components/profile-setting/profile-setting.component';
import { ProfileHelpComponent } from './components/profile-help/profile-help.component';
import { ProfileLogoutComponent } from './components/profile-logout/profile-logout.component';
import { ProfileNotificationComponent } from './components/profile-notification/profile-notification.component';
import { RouteAnimateEnum } from '@reactor-room/animation';

const routes: Routes = [
  {
    path: '',
    component: ProfileComponent,
    data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PROFILE_PAGE },
    children: [
      { path: 'notification', component: ProfileNotificationComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PROFILE_NOTIFICATION_PAGE } },
      { path: 'setting', component: ProfileSettingComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PROFILE_SETTING_PAGE } },
      { path: 'help', component: ProfileHelpComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PROFILE_HELP_PAGE } },
      { path: 'logout', component: ProfileLogoutComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.PROFILE_LOGOUT_PAGE } },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
