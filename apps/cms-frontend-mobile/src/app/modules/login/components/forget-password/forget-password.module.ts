import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ForgetPasswordComponent } from './forget-password.component';
import { RouterModule } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [ForgetPasswordComponent],
  imports: [CommonModule, RouterModule, TranslateModule],
  exports: [ForgetPasswordComponent],
})
export class ForgetPasswordModule {}
