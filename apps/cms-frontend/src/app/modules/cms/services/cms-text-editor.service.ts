import { Injectable } from '@angular/core';
import { QuillEditorComponent } from 'ngx-quill';
import { Subject } from 'rxjs';
import { Range } from 'ngx-quill';
import { IContentManageText } from '@reactor-room/cms-models-lib';

@Injectable({
  providedIn: 'root',
})
export class CmsTextEditorService {
  constructor() {}
  private quillEditor = new Subject();

  getQuillEditor = this.quillEditor.asObservable();

  private textEditorFormValue = new Subject();
  getTextEditorFormValue = this.textEditorFormValue.asObservable();

  private textSelectionRange = new Subject();
  getTextSelectionRange = this.textSelectionRange.asObservable();

  private textEmoji = new Subject();
  getTextEmoji = this.textEmoji.asObservable();

  updateQuillEditor(quill: QuillEditorComponent): void {
    this.quillEditor.next(quill);
  }
  updateTextEditorFormValue(value: IContentManageText): void {
    this.textEditorFormValue.next(value);
  }

  updateTextSelectionRange(range: Range): void {
    this.textSelectionRange.next(range);
  }

  updateTextEmoji(emoji: string): void {
    this.textEmoji.next(emoji);
  }
}
