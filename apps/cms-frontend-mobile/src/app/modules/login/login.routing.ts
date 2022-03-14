import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { RouteAnimateEnum } from '@reactor-room/animation';
import { EmailLoginComponent } from './components/email-login/email-login.component';
import { ForgetPasswordComponent } from './components/forget-password/forget-password.component';
import { LoginComponent } from './login.component';

const routes: Routes = [
  { path: 'login', component: LoginComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.LOGIN_PAGE } },
  { path: 'email-login', component: EmailLoginComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.EMAIL_LOGIN_PAGE } },
  { path: 'forget-password', component: ForgetPasswordComponent, data: { animation: RouteAnimateEnum.CMSMobileRouteAnimationEnum.FORGET_PASSWORD_PAGE } },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class LoginRoutingModule {}
