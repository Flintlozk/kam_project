import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { ClickOutsideModule } from '@reactor-room/itopplus-cdk/click-outsite-directive/click-outside.module';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, ClickOutsideModule],
  exports: [NotificationComponent],
})
export class NotificationModule {}
