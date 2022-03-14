import { NgModule } from '@angular/core';
import { ChatDisplayDatePipe } from './chat-display-date.pipe';

@NgModule({
  declarations: [ChatDisplayDatePipe],
  exports: [ChatDisplayDatePipe],
})
export class ChatDisplayDateModule {}
