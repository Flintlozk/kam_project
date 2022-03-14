import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PeekboxComponent } from './peekbox.component';
import { ChatboxModule } from '../chatbox/chatbox.module';
import { PeekboxAudienceControlModule } from './components/peekbox-audience-control/peekbox-audience-control.module';
import { UserTagService } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.service';

@NgModule({
  declarations: [PeekboxComponent],
  imports: [CommonModule, ChatboxModule, PeekboxAudienceControlModule],
  exports: [PeekboxComponent],
  providers: [UserTagService],
})
export class PeekboxModule {}
