import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { GoogleLoginModule } from '@reactor-room/itopplus-cdk/google-login/google-login.module';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { FacebookModule } from '@reactor-room/itopplus-front-end-helpers/ngx-facebook';
import { FacebookLoginModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { LoginService } from './login.service';

import { RouterModule, Routes } from '@angular/router';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FacebookModule.forRoot(),
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: LoginComponent,
      },
    ]),
    TranslateModule,
    GoogleLoginModule,
    MatSnackBarModule,
    FacebookLoginModule,
  ],
  providers: [LoginService],
})
export class LoginModule {}
