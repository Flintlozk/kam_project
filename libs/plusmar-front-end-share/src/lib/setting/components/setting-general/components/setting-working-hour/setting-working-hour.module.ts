import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { TranslateModule } from '@ngx-translate/core';
import { ClickOutsideModule, TimeAgoPipeModule, TimepickerModule } from '@reactor-room/itopplus-cdk';
import { WorkingHourNotifyEmailsModule } from './components/working-hour-notify-emails/working-hour-notify-emails.module';
import { SettingWorkingHourComponent } from './setting-working-hour.component';

@NgModule({
  declarations: [SettingWorkingHourComponent],
  imports: [
    CommonModule,
    ClickOutsideModule,
    FormsModule,
    TimepickerModule,
    ReactiveFormsModule,
    MatExpansionModule,
    MatFormFieldModule,
    TranslateModule,
    TimeAgoPipeModule,
    WorkingHourNotifyEmailsModule,
  ],
  exports: [SettingWorkingHourComponent],
})
export class SettingWorkingHourModule {}
