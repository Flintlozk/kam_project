import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { GoogleLoginComponent } from './google-login.component';

@NgModule({
  declarations: [GoogleLoginComponent],
  imports: [CommonModule],
  exports: [GoogleLoginComponent],
})
export class GoogleLoginModule {}
