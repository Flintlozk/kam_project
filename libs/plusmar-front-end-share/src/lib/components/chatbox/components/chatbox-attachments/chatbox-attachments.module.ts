import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatboxAttachmentsComponent } from './chatbox-attachments.component';
import { GenerateFilePreviewPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/generate-file-preview/generate-file-preview.module';
import { FormatCurrencyModule, ParamsRemoverModule, QueryRemoverModule, TimeAgoPipeModule } from '@reactor-room/itopplus-cdk';
import { TranslateModule } from '@ngx-translate/core';
import { DeepPayloadPipe } from './deep-payload.pipe';

@NgModule({
  declarations: [ChatboxAttachmentsComponent, DeepPayloadPipe],
  imports: [CommonModule, FormatCurrencyModule, TranslateModule, TimeAgoPipeModule, ParamsRemoverModule, GenerateFilePreviewPipeModule, QueryRemoverModule],
  exports: [ChatboxAttachmentsComponent],
})
export class ChatboxAttachmentsModule {}
