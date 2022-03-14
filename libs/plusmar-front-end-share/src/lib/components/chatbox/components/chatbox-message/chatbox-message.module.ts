import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxMessageComponent } from './chatbox-message.component';

@NgModule({
  declarations: [ChatboxMessageComponent],
  imports: [CommonModule],
  exports: [ChatboxMessageComponent],
})
export class ChatboxMessageModule {}
