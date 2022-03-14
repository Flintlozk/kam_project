import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoginComponent } from './login.component';
import { ProcessModule } from '../process/process.module';
import { TranslateModule } from '@ngx-translate/core';
import { FacebookLoginModule } from '@reactor-room/itopplus-cdk';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [LoginComponent],
  imports: [CommonModule, RouterModule, ProcessModule, TranslateModule, FacebookLoginModule],
  exports: [LoginComponent],
})
export class LoginModule {}
