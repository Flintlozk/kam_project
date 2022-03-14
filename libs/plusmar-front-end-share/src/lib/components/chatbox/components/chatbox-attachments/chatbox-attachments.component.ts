import { Component, EventEmitter, Input, OnChanges, OnInit, Output } from '@angular/core';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { AudienceDomainStatus, IAttachmentsModel, IAudience, ILineMessagePayload, IMessageModel, MessageSentByEnum } from '@reactor-room/itopplus-model-lib';
import { ChatBoxConfig } from '../../chatbox.config';

@Component({
  selector: 'reactor-room-chatbox-attachments',
  templateUrl: './chatbox-attachments.component.html',
  styleUrls: ['./chatbox-attachments.component.scss'],
})
export class ChatboxAttachmentsComponent implements OnInit, OnChanges {
  EAudiencePlatformType = AudiencePlatformType;
  EAudienceStatusType = AudienceDomainStatus;
  sender = MessageSentByEnum;

  @Input() audience: IAudience;
  @Input() attachments: IAttachmentsModel[];
  @Input() message: IMessageModel;
  @Output() imageAttachmentExpiredEvent = new EventEmitter<IMessageModel>();

  optionalFileName: string;
  constructor(public chatboxConfig: ChatBoxConfig) {}

  ngOnInit(): void {
    if (this.message?.payload) {
      const { payload } = <{ payload: ILineMessagePayload }>Object.assign({ payload: this.message.payload });
      if (payload && payload.events?.length > 0) {
        this.optionalFileName = payload.events[0].message.fileName;
      }
    }
    if (this.message?.payload) {
      const payload = this.message?.payload as any;
      if (payload?.entry) {
        if (payload?.entry[0]) {
          if (payload?.entry[0]?.messaging[0]) {
            if (payload?.entry[0]?.messaging[0]?.message?.attachments[0]) {
              this.optionalFileName = payload.entry[0]?.messaging[0]?.message?.attachments[0]?.payload?.fileName;
            }
          }
        }
      }
    }
  }

  ngOnChanges(): void {}

  openMap(lat: string, lng: string): string {
    const parameters = `query=${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&${parameters}`;
  }
  imageAttachmentExpired(message: IMessageModel) {
    this.imageAttachmentExpiredEvent.emit(message);
  }
}
