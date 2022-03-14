import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTooltipModule } from '@angular/material/tooltip';
import { WelcomeRegisterComponent } from './welcome-register.component';

@NgModule({
  declarations: [WelcomeRegisterComponent],
  imports: [CommonModule, FormsModule, ReactiveFormsModule, MatTooltipModule],
  exports: [WelcomeRegisterComponent],
})
export class WelcomeRegisterModule {}
