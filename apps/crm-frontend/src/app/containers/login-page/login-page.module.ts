import { NgModule } from '@angular/core';
import { LoginPageComponent } from './login-page.component';
import { CommonModule } from '@angular/common';
import { ITOPPLUSCDKModule } from '@reactor-room/itopplus-cdk';
import { LoginPageServiceService } from './login-page-service.service';

@NgModule({
  declarations: [LoginPageComponent],
  imports: [CommonModule, ITOPPLUSCDKModule],
  providers: [LoginPageServiceService],
  exports: [LoginPageComponent],
})
export class LoginPageModule {}
