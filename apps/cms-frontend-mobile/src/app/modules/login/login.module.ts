import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { LoginRoutingModule } from './login.routing';
import { NgModule } from '@angular/core';
import { FacebookLoginModule, GoogleLoginModule, LineLoginModule } from '@reactor-room/cms-cdk';
import { EmailLoginModule } from './components/email-login/email-login.module';
import { ForgetPasswordModule } from './components/forget-password/forget-password.module';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, LoginRoutingModule, EmailLoginModule, ForgetPasswordModule, FacebookLoginModule, GoogleLoginModule, LineLoginModule, TranslateModule],
  exports: [LoginComponent],
})
export class LoginModule {}
