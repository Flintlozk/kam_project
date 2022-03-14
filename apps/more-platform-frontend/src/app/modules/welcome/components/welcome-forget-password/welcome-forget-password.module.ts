import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WelcomeForgetPasswordComponent } from './welcome-forget-password.component';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@NgModule({
  declarations: [WelcomeForgetPasswordComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  exports: [WelcomeForgetPasswordComponent],
})
export class WelcomeForgetPasswordModule {}
