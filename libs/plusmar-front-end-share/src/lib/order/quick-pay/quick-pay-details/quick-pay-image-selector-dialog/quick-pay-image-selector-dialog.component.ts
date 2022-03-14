import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { IHTTPResult } from '@reactor-room/model-lib';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { IAttachmentsModel, IFacebookMessagePayloadTypeEnum, IMessageModel } from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-quick-pay-image-selector-dialog',
  templateUrl: './quick-pay-image-selector-dialog.component.html',
  styleUrls: ['./quick-pay-image-selector-dialog.component.scss'],
})
export class QuickPayImageSelectorDialogComponent implements OnInit, OnDestroy {
  totalImages = 8;
  imagePreview = [];
  selectedImage = '';
  attachmentLimit = 40;
  audienceID: number;
  userID: number;
  destroy$ = new Subject();
  messageAttachment$: Observable<IMessageModel[]>;

  constructor(
    private dialogRef: MatDialogRef<QuickPayImageSelectorDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public audienceUserID: [number, number],
    private messageService: MessageService,
  ) {
    const [audienceID, userID] = audienceUserID;
    this.audienceID = audienceID;
    this.userID = userID;
    this.messageAttachment$ = this.messageService.getMessageAttachments(this.audienceID, this.attachmentLimit);
  }

  ngOnInit(): void {
    this.getMessageImages();
    this.messageService.getMessageFormQuickpay$
      .pipe(
        takeUntil(this.destroy$),
        tap((message) => {
          const attachmentImages = [];
          const attachments = message?.attachments as IAttachmentsModel[];
          if (!attachments?.length || message?.sender?.user_id === -1 || message?.sender?.user_id === this.userID) return null;
          attachments.map((attachment) => {
            if (attachment.type === IFacebookMessagePayloadTypeEnum.IMAGE) {
              attachmentImages.push(attachment.payload.url);
            }
          });
          for (let i = 0; i < attachmentImages.length; i++) {
            this.imagePreview.pop();
            this.imagePreview.unshift(attachmentImages[i]);
          }
        }),
        catchError((err) => {
          console.log(err);
          throw Error(err);
        }),
      )
      .subscribe();
  }

  getMessageImages() {
    this.messageAttachment$
      .pipe(
        takeUntil(this.destroy$),
        tap((message) => {
          const attachmentImages = [];
          message
            ?.map((message) => {
              const attachments = message?.attachments as IAttachmentsModel[];
              if (!attachments?.length || message?.sender?.user_id === -1 || message?.sender?.user_id === this.userID) return null;
              attachments.map((attachment) => {
                if (attachment.type === IFacebookMessagePayloadTypeEnum.IMAGE) {
                  attachmentImages.push(attachment.payload.url);
                }
              });
              return;
            })
            .filter((image) => image) as string[];
          this.populateImageArray(attachmentImages);
        }),
        catchError((err) => {
          console.log(err);
          throw Error(err);
        }),
      )
      .subscribe();
  }

  populateImageArray(attachments: string[]): void {
    for (let index = 0; index < 8; index++) {
      const image = attachments[index];
      if (attachments?.length) {
        this.imagePreview.push(image ? image : null);
      } else {
        this.imagePreview.push(null);
      }
    }
  }

  onSave(): void {
    const result = { status: 200, value: this.selectedImage };
    this.dialogRef.close(result);
  }

  onNoClick(): void {
    const result: IHTTPResult = { status: 403, value: null };
    this.dialogRef.close(result);
  }

  uploadFile(): void {
    const result = { status: 200, value: 'false' };
    this.dialogRef.close(result);
  }

  selectImage(url: string): void {
    if (!url) return;
    this.selectedImage = url;
    const result = { status: 200, value: this.selectedImage };
    this.dialogRef.close(result);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
}
