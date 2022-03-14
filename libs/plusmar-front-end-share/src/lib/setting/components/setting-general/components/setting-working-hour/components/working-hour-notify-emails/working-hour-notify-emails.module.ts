import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { WorkingHourNotifyEmailsComponent } from './working-hour-notify-emails.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk';
import { ReactiveFormsModule } from '@angular/forms';
import { UserTagService } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.service';
import { TranslateModule } from '@ngx-translate/core';

@NgModule({
  declarations: [WorkingHourNotifyEmailsComponent],
  imports: [ReactiveFormsModule, CommonModule, ClickOutsideModule, TranslateModule],
  exports: [WorkingHourNotifyEmailsComponent],
  providers: [UserTagService],
})
export class WorkingHourNotifyEmailsModule {}
