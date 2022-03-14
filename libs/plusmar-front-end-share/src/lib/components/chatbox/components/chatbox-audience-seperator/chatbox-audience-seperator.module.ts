import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxAudienceSeperatorComponent } from './chatbox-audience-seperator.component';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { TranslateModule } from '@ngx-translate/core';
import { TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';

@NgModule({
  declarations: [ChatboxAudienceSeperatorComponent],
  imports: [CommonModule, TextTrimModule, TranslateModule, TimeAgoPipeModule],
  exports: [ChatboxAudienceSeperatorComponent],
})
export class ChatboxAudienceSeperatorModule {}
