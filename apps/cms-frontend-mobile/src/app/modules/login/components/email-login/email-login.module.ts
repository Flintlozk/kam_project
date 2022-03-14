import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { EmailLoginComponent } from './email-login.component';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [EmailLoginComponent],
  imports: [CommonModule, RouterModule, FormsModule, ReactiveFormsModule, TranslateModule],
  exports: [EmailLoginComponent],
})
export class EmailLoginModule {}
