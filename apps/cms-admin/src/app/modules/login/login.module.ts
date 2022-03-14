import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { FacebookModule } from '@reactor-room/itopplus-front-end-helpers/ngx-facebook';
import { FacebookLoginModule } from '@reactor-room/itopplus-cdk';
import { LoginService } from './login.service';
import { RouterModule, Routes } from '@angular/router';
@NgModule({
  declarations: [LoginComponent],
  imports: [
    CommonModule,
    FacebookModule,
    FacebookLoginModule,
    RouterModule.forChild(<Routes>[
      {
        path: '',
        component: LoginComponent,
      },
    ]),
  ],
})
export class LoginModule {}
