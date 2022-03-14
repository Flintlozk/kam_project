import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationComponent } from './notification.component';
import { NotificationRoutingModule } from './notification.routing';
import { HeadingTitleModule } from '../../components/heading-title/heading-title.module';

@NgModule({
  declarations: [NotificationComponent],
  imports: [CommonModule, NotificationRoutingModule, HeadingTitleModule],
  exports: [NotificationComponent],
})
export class NotificationModule {}
