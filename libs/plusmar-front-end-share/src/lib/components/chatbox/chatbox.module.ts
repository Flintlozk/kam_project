import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatMenuModule } from '@angular/material/menu';
import { MatTooltipModule } from '@angular/material/tooltip';
import { TranslateModule } from '@ngx-translate/core';
import { DateToUnixModule } from '@reactor-room/plusmar-front-end-share/pipes/date-to-unix.module';
import { ClickOutsideModule, FormatCurrencyModule, LoaderModule, ScriptModule, TimeAgoPipeModule, UrlifyModule } from '@reactor-room/itopplus-cdk';
import { CustomTableModule, OnDomChangeModule } from '@reactor-room/plusmar-cdk';
import { ChatDisplayDateModule } from '@reactor-room/plusmar-front-end-share/pipes/chat-display-date.module';
import { GenerateFilePreviewPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/generate-file-preview/generate-file-preview.module';
import { OrderIdPipeModule } from '@reactor-room/plusmar-front-end-share/pipes/order-id.pipe.module';
import { TodayYesterdayDateModule } from '@reactor-room/plusmar-front-end-share/pipes/today-yesterday-date.module';
import { AttachmentDisplayModule } from '../attachment-display/attachment-display.module';
import { SvgModule } from '../svg/svg.module';
import { ChatboxComponent } from './chatbox.component';
import { PreviousMessagesModule } from './previous-messages/previous-messages.module';
import { PrivateMessageModule } from './private-message/private-message.module';
import { TemplatesModule } from './templates/templates.module';
import { CustomerTagAddEditDialogModule } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tag-add-edit-dialog/customer-tag-add-edit-dialog.module';
import { TextTrimModule } from '@reactor-room/itopplus-cdk/text-trim/text-trim.module';
import { MessageState } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.state';
import { ChatboxClipboardPreviewModule } from './components/chatbox-clipboard-preview/chatbox-clipboard-preview.module';
import { TemplatesService } from './templates/templates.service';
import { ChatboxAudienceSeperatorModule } from './components/chatbox-audience-seperator/chatbox-audience-seperator.module';
import { FileUploadService } from '@reactor-room/plusmar-front-end-share/services/file-upload.service';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { ChatboxAttachmentsModule } from './components/chatbox-attachments/chatbox-attachments.module';
import { ImageExtensionModule } from './pipes/image-extension.module';

@NgModule({
  declarations: [ChatboxComponent],
  imports: [
    CommonModule,
    MatTooltipModule,
    TranslateModule,
    OrderIdPipeModule,
    SvgModule,
    CustomTableModule,
    ReactiveFormsModule,
    TemplatesModule,
    ChatDisplayDateModule,
    TodayYesterdayDateModule,
    ClickOutsideModule,
    MatMenuModule,
    TimeAgoPipeModule,
    GenerateFilePreviewPipeModule,
    AttachmentDisplayModule,
    PreviousMessagesModule,
    PrivateMessageModule,
    DateToUnixModule,
    OnDomChangeModule,
    FormatCurrencyModule,
    CustomerTagAddEditDialogModule,
    TextTrimModule,
    UrlifyModule,
    ChatboxClipboardPreviewModule,
    ChatboxAudienceSeperatorModule,
    ChatboxAttachmentsModule,
    LoaderModule,
    ScriptModule,
    ImageExtensionModule,
  ],
  providers: [FileUploadService, ChatboxService, MessageState, TemplatesService],
  exports: [ChatboxComponent],
})
export class ChatboxModule {}
