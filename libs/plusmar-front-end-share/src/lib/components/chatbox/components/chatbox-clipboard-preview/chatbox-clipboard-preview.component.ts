import { Component, HostListener, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { toBase64 } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutFastestAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

enum ChatboxClipboardPreviewType {
  IMAGE = 'IMAGE',
  FILE = 'FILE',
}

interface IChatboxClipboardPreviewResponse {
  isSubmit: boolean;
  source: { files: FileList; type: ChatboxClipboardPreviewType };
}
@Component({
  selector: 'reactor-room-chatbox-clipboard-preview',
  templateUrl: './chatbox-clipboard-preview.component.html',
  styleUrls: ['./chatbox-clipboard-preview.component.scss'],
  animations: [slideInOutFastestAnimation],
})
export class ChatboxClipboardPreviewComponent implements OnInit, OnDestroy {
  keypressEventSubmit: Subject<boolean> = new Subject<boolean>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  @Input() pasteClipboard: Subject<{ files: FileList; type: ChatboxClipboardPreviewType }>;
  @Output() response: Subject<IChatboxClipboardPreviewResponse> = new Subject<IChatboxClipboardPreviewResponse>();

  ChatboxClipboardPreviewType = ChatboxClipboardPreviewType;
  source: { files: FileList; type: ChatboxClipboardPreviewType };
  type: ChatboxClipboardPreviewType;
  previewSource: string | ArrayBuffer;

  @HostListener('window:keydown.backspace', ['$event'])
  backspaceKeydown(): void {
    this.cancel();
  }
  @HostListener('window:keydown.escape', ['$event'])
  escapeKeydown(): void {
    this.cancel();
  }

  @HostListener('window:keydown.enter', ['$event'])
  enterKeydown(): void {
    this.submit();
  }

  constructor() {}

  ngOnInit(): void {
    this.keypressEventSubmit.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe((isSubmit: boolean) => {
      this.response.next({ isSubmit, source: this.source });
    });

    if (!this.pasteClipboard) console.error('ChatboxClipboardPreviewComponent : pasteClipboard subject missing');

    this.pasteClipboard?.pipe(takeUntil(this.destroy$)).subscribe(async (source: { files: FileList; type: ChatboxClipboardPreviewType }) => {
      this.source = source;
      this.type = source.type;
      if (this.type === ChatboxClipboardPreviewType.IMAGE) {
        this.previewSource = await toBase64(source.files[0]);
      } else {
        this.previewSource = source.files[0].name;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  cancel(): void {
    this.keypressEventSubmit.next(false);
  }

  submit(): void {
    this.keypressEventSubmit.next(true);
  }
}
