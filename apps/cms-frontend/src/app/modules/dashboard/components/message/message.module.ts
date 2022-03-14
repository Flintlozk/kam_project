import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MessageComponent } from './message.component';
import { DashboardMessageService } from '../../services/message/dashboard-message.service';

@NgModule({
  declarations: [MessageComponent],
  imports: [CommonModule],
  exports: [MessageComponent],
  providers: [DashboardMessageService],
})
export class MessageModule {}
