import { Component, ElementRef, EventEmitter, Inject, Input, OnDestroy, OnInit, Output, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { CommentService } from '@reactor-room/plusmar-front-end-share/services/facebook/comment/comment.service';
import { IAudienceWithCustomer, IComment, IMessageModel, IMessageType, MessageSentByEnum } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-private-message',
  templateUrl: './private-message.component.html',
  styleUrls: ['./private-message.component.scss'],
})
export class PrivateMessageComponent implements OnInit, OnDestroy {
  @ViewChild('chatInput') chatInput: ElementRef;
  sendPrivateForm: FormGroup;
  comments: IComment[] = [];
  selectedCommentID: string;
  destroy$: Subject<void> = new Subject();

  constructor(
    public dialogRef: MatDialogRef<PrivateMessageComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      audience: IAudienceWithCustomer;
      audienceId: number;
      commentId: string;
    },
    private fb: FormBuilder,
    private commentService: CommentService,
  ) {}

  ngOnInit(): void {
    this.getActiveCommentOnPrivateMessage();
    this.selectedCommentID = this.data.commentId;

    this.sendPrivateForm = this.fb.group({
      to: [` ${this.data.audience.first_name} ${this.data.audience.last_name !== null ? this.data.audience.last_name : ''}`, [Validators.required]],
      message: ['', [Validators.required]],
      commentId: [null, [Validators.required]],
    });

    this.setFocusOnMessageBox();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  takeUntilDestroy<T>(observer: Observable<T>): Observable<T> {
    return observer.pipe(takeUntil(this.destroy$));
  }
  getActiveCommentOnPrivateMessage(): void {
    this.takeUntilDestroy<IComment[]>(this.commentService.getActiveCommentOnPrivateMessage(this.data.audienceId)).subscribe((comments) => {
      if (comments) {
        this.comments = comments;

        if (!this.data.commentId) {
          this.selectedCommentID = comments[0].commentID;
          this.sendPrivateForm.controls['commentId'].setValue(comments[0].commentID);
        } else {
          this.selectedCommentID = this.data.commentId;
          this.sendPrivateForm.controls['commentId'].setValue(this.data.commentId);
        }
      }
    });
  }

  setFocusOnMessageBox(): void {
    this.chatInput?.nativeElement?.focus();
  }
  sendMessage(): void {
    if (this.sendPrivateForm.valid) {
      const message: IMessageModel = {
        mid: null,
        text: String(this.sendPrivateForm.value.message.trim()),
        object: 'page',
        audienceID: this.data.audienceId,
        createdAt: Date.now().toString(),
        sentBy: MessageSentByEnum.PAGE,
        sender: null,
        messagetype: IMessageType.TEXT,
      };
      this.dialogRef.close({ message, commentID: this.sendPrivateForm.value.commentId });
    }
  }

  onSelectComment(event, commentID: string): void {
    this.selectedCommentID = commentID;
  }

  closePrivateBox(): void {
    this.dialogRef.close(false);
  }

  get message(): AbstractControl {
    return this.sendPrivateForm.get('message');
  }
  get customer(): AbstractControl {
    return this.sendPrivateForm.get('to');
  }
}
