import { NgModule } from '@angular/core';
import { WelcomeComponent } from './welcome.component';
import { WelcomeRoutingModule } from './welcome.routing';
import { WelcomeHeaderModule } from './components/welcome-header/welcome-header.module';
import { WelcomeLoginModule } from './components/welcome-login/welcome-login.module';
import { WelcomeRegisterModule } from './components/welcome-register/welcome-register.module';
import { WelcomeForgetPasswordModule } from './components/welcome-forget-password/welcome-forget-password.module';

@NgModule({
  declarations: [WelcomeComponent],
  imports: [WelcomeHeaderModule, WelcomeRoutingModule, WelcomeLoginModule, WelcomeRegisterModule, WelcomeForgetPasswordModule],
  exports: [WelcomeComponent],
})
export class WelcomeModule {}
