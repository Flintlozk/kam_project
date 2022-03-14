import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { WelcomeLoginComponent } from './welcome-login.component';

@NgModule({
  declarations: [WelcomeLoginComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, RouterModule],
  exports: [WelcomeLoginComponent],
})
export class WelcomeLoginModule {}
