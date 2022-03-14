import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { CustomDialogModule } from '@reactor-room/itopplus-cdk';
import { UserNotifyEmailDialogComponent } from './user-notify-email-dialog.component';

@NgModule({
  declarations: [UserNotifyEmailDialogComponent],
  imports: [CommonModule, TranslateModule, CustomDialogModule, FormsModule, ReactiveFormsModule, MatFormFieldModule],
  exports: [UserNotifyEmailDialogComponent],
})
export class UserNotifyEmailDialogModule {}
