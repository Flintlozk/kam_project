import { Component, ElementRef, EventEmitter, Input, Output, ViewChild, ViewEncapsulation } from '@angular/core';
import { getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { IMessageModel, IThread, MessageSentByEnum } from '@reactor-room/itopplus-model-lib';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { PipelineService } from '@reactor-room/plusmar-front-end-share/services/facebook/pipeline/pipeline.service';

@Component({
  selector: 'reactor-room-comment-dialog',
  templateUrl: './comment-dialog.component.html',
  styleUrls: ['./comment-dialog.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CommentDialogComponent {
  canSend = false as boolean;
  @Input() thread: IThread;
  @Input() dialogTitle: string;
  @Input() shopIcon = 'assets/img/sample-shop-icon.png';
  @Output() dialogStatus = new EventEmitter<boolean>();
  @ViewChild('text') text: ElementRef;
  @ViewChild('content') content: ElementRef;

  constructor(private messageService: MessageService, private pipelineService: PipelineService) {}

  // TODO : Check for Delete

  onNoClick(): void {
    this.dialogStatus.emit(true);
  }

  async sendMessage(thread: IThread) {
    const { value: text } = this.text.nativeElement;

    const response = Object.assign({
      mid: null,
      text: text,
      object: 'page',
      pageID: Number(thread.pageID),
      audienceID: Number(thread.audienceID),
      createdAt: getUTCDayjs().toDate().toISOString(),
      sentBy: MessageSentByEnum.PAGE,
      payload: null,
    }) as IMessageModel;

    const message = await this.messageService.addMessage(response).toPromise();

    if (message) {
      this.reset();
      delete message?.['__typename'];
      const sent = await this.messageService.sendMessage(message).toPromise();
    }
  }

  sendProduct(thread: IThread) {
    // TODO : Send AudienceID instead of thread
    alert('Send AudienceID instead of thread');
    // const pipeline = await this.pipelineService.sendProductPipeline(thread);
    // console.log('Pipeline ::', pipeline);
  }

  reset() {
    // this.text.nativeElement.value = '';
  }
}
