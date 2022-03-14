import { Injectable } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { convertFileToBlob, getUTCDayjs } from '@reactor-room/itopplus-front-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  IAudienceWithCustomer,
  IFacebookMessagePayloadTypeEnum,
  IFacebookUploadAttachmentResponse,
  ILineUpload,
  Image,
  IMessageModel,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { combineLatest, EMPTY, forkJoin, from, Observable, of, Subject } from 'rxjs';
import { switchMap, delay, catchError, tap, concatMap, finalize } from 'rxjs/operators';
import { ChatboxService } from './chatbox.service';
import { MessageService } from './facebook/message/message.service';
import { MessageState } from './facebook/message/message.state';
import { AudienceService } from './facebook/audience/audience.service';

@Injectable()
export class FileUploadService {
  uploadDestroy$: Subject<boolean>;
  constructor(
    private messageState: MessageState,
    private messageService: MessageService,
    private chatboxService: ChatboxService,
    private audienceService: AudienceService,
    private sanitizer: DomSanitizer,
    private toastr: ToastrService,
  ) {}

  async handleImageUpload(
    audience: IAudienceWithCustomer,
    files: FileList,
    audienceID: number,
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Promise<Observable<boolean>> {
    switch (audience.platform) {
      case AudiencePlatformType.LINEOA:
        return this.handleLineUpload(audience, files, audienceID, userSender);
      default:
        return await this.handleFacebookUpload(files, audienceID, IFacebookMessagePayloadTypeEnum.IMAGE, userSender);
    }
  }

  async handleFileUpload(
    audience: IAudienceWithCustomer,
    files: FileList,
    audienceID: number,
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Promise<Observable<boolean>> {
    switch (audience.platform) {
      case AudiencePlatformType.LINEOA:
        return this.handleLineUpload(audience, files, audienceID, userSender);
      default:
        return await this.handleFacebookUpload(files, audienceID, IFacebookMessagePayloadTypeEnum.FILE, userSender);
    }
  }

  handleFile(fileData: Blob, type: IFacebookMessagePayloadTypeEnum, fileName: string): Promise<FormData> {
    return new Promise((resolve, reject) => {
      try {
        const formData = new FormData();
        formData.append('source', fileData, fileName);

        const message = {
          attachment: {
            type: type,
            payload: { is_reusable: false },
          },
        };

        formData.append('message', JSON.stringify(message));

        resolve(formData);
      } catch (err) {
        reject(err);
      }
    });
  }

  handleLineUpload(
    audience: IAudienceWithCustomer,
    uploadfile: FileList,
    audienceID: number,
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Observable<boolean> {
    if (uploadfile) {
      if (audience.status === AudienceDomainStatus.CLOSED || audience.status === AudienceDomainStatus.REJECT) {
        //   // prevent send new message
        return this.audienceService.openNewChat(audience.customer_id).pipe(
          concatMap((newAudienceID) => {
            return this.uploadAndSendImage(audience, uploadfile, audienceID, userSender, newAudienceID).pipe(
              finalize(() => {
                if (newAudienceID) {
                  this.messageState.triggerStopLoading.next(true);
                }
              }),
            );
          }),
        );
      } else {
        return this.uploadAndSendImage(audience, uploadfile, audienceID, userSender);
      }
    }
  }

  // Move to FileUploadService
  async handleFacebookUpload(
    files: FileList,
    audienceID: number,
    type: IFacebookMessagePayloadTypeEnum,
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Promise<Observable<boolean>> {
    this.uploadDestroy$ = new Subject<boolean>();
    if (files) {
      const promises: Observable<IFacebookUploadAttachmentResponse>[] = [];
      const blobs: Blob[] = [];
      for (let index = 0; index < files.length; index++) {
        const file = files[index];
        const blob = await convertFileToBlob(file); // To display on UI
        blobs.push(blob);

        await this.handleFile(blob, type, file.name);
        promises.push(this.uploadMessageAttachments(file, audienceID));
      }

      const $attachmentIds = combineLatest([...promises]);
      let index: number;
      let messages: IMessageModel[];
      if (type === IFacebookMessagePayloadTypeEnum.IMAGE || type === IFacebookMessagePayloadTypeEnum.FILE) {
        messages = blobs.map((b) => {
          return {
            mid: this.messageState.getLocalMessageLength().toString(),
            text: '',
            object: '',
            attachments: [
              {
                type,
                payload: {
                  url: this.sanitizer.bypassSecurityTrustResourceUrl(URL.createObjectURL(b)),
                },
              },
            ],
            pageID: null,
            audienceID: null,
            createdAt: getUTCDayjs().toDate().valueOf().toString(),
            createdAtNumber: null,
            sentBy: MessageSentByEnum.APP,
            payload: '',
            sender: userSender,
          };
        });
        index = this.messageState.addLocalMessages(messages);
        this.messageState.triggerScrollToLatestMessage.next(true);
      }
      const $attachmentResponses = $attachmentIds.pipe(
        switchMap((attachmentIds: IFacebookUploadAttachmentResponse[]) => {
          const observables = attachmentIds.map(({ attachmentID }) => this.messageService.sendAttachment(audienceID, attachmentID, type));
          return forkJoin(observables);
        }),
      );

      return $attachmentResponses.pipe(
        delay(1000),
        tap(() => {
          if (index !== undefined && messages !== undefined) {
            this.messageState.deleteLocalMessage(index);
          }
        }),
        switchMap(() => {
          return of(true);
        }),
      );
    }
  }

  uploadMessageAttachments(file: File, audienceID: number): Observable<IFacebookUploadAttachmentResponse> {
    return this.messageService.uploadAttachment(file, audienceID);
  }
  uploadAndSendImage(
    audience: IAudienceWithCustomer,
    uploadfile: FileList,
    audienceID: number,
    userSender: {
      user_id: number;
      user_name: string;
    },
    newAudienceID?: number,
  ) {
    return from(uploadfile).pipe(
      concatMap((image) => {
        const file = image;
        const filename = file.name;
        const extension = file.type.split('/')[1];

        const param = { audienceID, filename, extension, file } as ILineUpload;
        return this.messageService.lineUpload(param).pipe(
          concatMap((result) => {
            if (result.status === 200) {
              const paramImage = [
                {
                  name: result.value.filename,
                  url: result.value.url,
                  extension: extension,
                },
              ] as Image[];
              return this.chatboxService.sendImagesSetToCustomer(audience, paramImage, userSender, newAudienceID);
            } else {
              return EMPTY;
            }
          }),

          catchError((error) => {
            console.log(error);
            this.toastr.error(`CODE : ${error.code} ${error.type} ${error.message}`, 'Upload failed', {
              positionClass: 'toast-bottom-right',
            });
            return EMPTY;
          }),
        );
      }),
    );
  }
}
