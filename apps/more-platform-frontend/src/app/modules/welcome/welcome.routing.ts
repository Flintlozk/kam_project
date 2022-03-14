import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { WelcomeComponent } from './welcome.component';
import { WelcomeLoginComponent } from './components/welcome-login/welcome-login.component';
import { WelcomeRegisterComponent } from './components/welcome-register/welcome-register.component';
import { WelcomeForgetPasswordComponent } from './components/welcome-forget-password/welcome-forget-password.component';
import { RouteLinkEnum } from '../../shares/route.model';
import { RouteAnimateEnum } from '@reactor-room/animation';

const routes: Routes = [
  {
    path: RouteLinkEnum.WELCOME,
    component: WelcomeComponent,
    data: { animation: RouteAnimateEnum.MoreRouteAnimationEnum.WELCOME_PAGE },
    children: [
      {
        path: RouteLinkEnum.LOGIN,
        component: WelcomeLoginComponent,
        data: { animation: RouteAnimateEnum.MoreRouteAnimationEnum.LOGIN_PAGE },
      },
      {
        path: RouteLinkEnum.REGISTER,
        component: WelcomeRegisterComponent,
        data: { animation: RouteAnimateEnum.MoreRouteAnimationEnum.REGISTER_PAGE },
      },
      {
        path: RouteLinkEnum.FORGET_PASSWORD,
        component: WelcomeForgetPasswordComponent,
        data: { animation: RouteAnimateEnum.MoreRouteAnimationEnum.FORGET_PASSWORD_PAGE },
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class WelcomeRoutingModule {}
