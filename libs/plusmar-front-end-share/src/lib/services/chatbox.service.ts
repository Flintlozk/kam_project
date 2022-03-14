import { Injectable } from '@angular/core';
import { AudiencePlatformType, FacebookErrorCode } from '@reactor-room/model-lib';
import {
  AudienceDomainStatus,
  ChatboxView,
  FacebookMessagingType,
  IAudienceWithCustomer,
  IComment,
  IFacebookMessagePayloadTypeEnum,
  IFacebookMessageResponse,
  Image,
  IMessageModel,
  IMessageType,
  Message,
  MessageSentByEnum,
} from '@reactor-room/itopplus-model-lib';
import { Apollo } from 'apollo-angular';
import gql from 'graphql-tag';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, from, NEVER, Observable, of, Subject } from 'rxjs';
import { catchError, concatMap, finalize, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { AudienceService } from './facebook/audience/audience.service';
import { MessageService } from './facebook/message/message.service';
import { MessageState } from './facebook/message/message.state';

@Injectable({
  providedIn: 'root',
})
export class ChatboxService {
  /** Value are set to opposite way */
  deactivateMobileChatboxAction: Subject<boolean> = new Subject<boolean>();
  /** Toggle Chatbox to view content on mobile mode */
  toggleChatbox = new Subject<boolean>();

  latestComment: Subject<IComment> = new Subject<IComment>();
  destroy$: Subject<boolean> = new Subject<boolean>();

  public isChatboxCreated = new Subject<boolean>();
  isChatboxCreated$ = this.isChatboxCreated.asObservable();

  public switchChatboxView = new Subject<ChatboxView>();
  toastPosition = 'toast-bottom-right';

  constructor(
    private apollo: Apollo,
    private audienceService: AudienceService,
    private messageService: MessageService,
    private messageState: MessageState,
    private toastr: ToastrService,
  ) {}

  getTemplatesByShortcut({ type, shortcut }: { type: string; shortcut: string }): Observable<Message[]> {
    return this.apollo
      .watchQuery({
        query: gql`
          query getTemplatesByShortcut($shortcut: String, $type: String) {
            getTemplatesByShortcut(shortcut: $shortcut, type: $type) {
              text
              images {
                url
                attachment_id
                extension
                filename
              }
              shortcut
            }
          }
        `,
        variables: {
          shortcut,
          type,
        },
        fetchPolicy: 'no-cache',
      })
      .valueChanges.pipe(
        takeUntil(this.destroy$),
        map((x) => x.data['getTemplatesByShortcut']),
      );
  }

  // ------

  //
  sendImageSets(
    audience: IAudienceWithCustomer,
    images_set: Image[],
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Observable<boolean> {
    switch (audience.platform) {
      case AudiencePlatformType.LINEOA: {
        return this.sendLineFileAndImageSet(audience, images_set, userSender);
      }
      case AudiencePlatformType.FACEBOOKFANPAGE: {
        return this.sendFacebookImageSet(audience, images_set, userSender);
      }
      default: {
        return EMPTY;
      }
    }
  }

  sendLineFileAndImageSet(
    audience: IAudienceWithCustomer,
    images_set: Image[],
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Observable<boolean> {
    if (audience.status === AudienceDomainStatus.CLOSED || audience.status === AudienceDomainStatus.REJECT) {
      //   // prevent send new message
      return this.audienceService.openNewChat(audience.customer_id).pipe(
        concatMap((newAudienceID) => {
          return this.sendImagesSetToCustomer(audience, images_set, userSender, newAudienceID).pipe(
            finalize(() => {
              if (newAudienceID) {
                this.messageState.triggerStopLoading.next(true);
              }
            }),
          );
        }),
      );
    } else {
      return this.sendImagesSetToCustomer(audience, images_set, userSender);
    }
  }

  sendFacebookImageSet(
    audience: { platform: AudiencePlatformType; id: number; psid?: string },
    images_set: Image[],
    userSender: {
      user_id: number;
      user_name: string;
    },
  ): Observable<boolean> {
    const imageSet$ = from(images_set);
    return imageSet$.pipe(
      // START SEQUENCE
      concatMap((image) => {
        return of(image).pipe(
          tap((image) =>
            // STEP 1: show loader
            setTimeout(() => {
              this.messageState.addLocalMessages([
                {
                  ...{ attachments: [{ payload: image, type: IFacebookMessagePayloadTypeEnum.IMAGES_SET }] },
                  createdAt: Date.now().toString(),
                  sentBy: MessageSentByEnum.PAGE,
                  sender: userSender,
                },
              ]);
              this.messageState.triggerScrollToLatestMessage.next(true);
            }, 1000),
          ),
          switchMap(() =>
            // STEP 2: send image
            this.messageService.sendImageSet(image, audience.psid).pipe(
              tap(() => {
                // STEP 3: remove loader
                this.messageState.deleteLastLocalMessage();
              }),
            ),
          ),
          switchMap(() => {
            return of(true);
          }),
        );
      }),
    );
  }

  sendMessageLineHandling(message: IMessageModel, isRedirectOnNewAudience: boolean): Observable<IMessageModel> {
    const source$: Observable<IMessageModel> = this.messageService.sendLineMessage(message);
    const messageLocal = JSON.parse(JSON.stringify(message));
    if (message.messagetype === IMessageType.FILE) {
      messageLocal.text = '';
    }
    const index = this.messageState.addLocalMessages([{ ...messageLocal, sentBy: MessageSentByEnum.APP }]);

    return source$.pipe(
      tap(() => {
        this.messageState.triggerScrollToLatestMessage.next(true);
        this.messageState.triggerMoveToFollow.next(null);
      }),
      catchError((err) => {
        this.sendMessageErrorHandler({
          code: 400,
          type: 'Line Message',
          message: err,
        } as FacebookErrorCode);
        return NEVER;
      }),
      tap(() => {
        if (isRedirectOnNewAudience) {
          this.messageState.triggerRedirectToNewCreatedAudience.next(null);
        } else {
          this.messageState.triggerSetChatRead.next(null);
          setTimeout(() => {
            this.messageState.deleteLocalMessage(index);
          }, 100);
        }
      }),
    );
  }

  sendMessageFacebookHandling(message: IMessageModel, isRedirectOnNewAudience: boolean): void {
    // if (this.chatController.MESSAGE_TAG) {
    //   const text = this.translate.instant('Please confirm responding to customer on more than 24 hours of
    // contact Beware of this confirmation may break Facebook privacy policy');
    //   this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
    //     if (confirm) {
    //       this.textAreaControl.setValue('');
    //       const index = this.messageState.addLocalMessages([{ ...message, sentBy: MessageSentByEnum.APP }]);
    //       this.scrollToLatestMessage(true);
    //       this.sendMessageByCondition(this.messageService.addMessage(message, FacebookMessagingType.MESSAGE_TAG), index);
    //       this.chatController.MESSAGE_TAG = false;
    //     }
    //   });
    // } else {
    // if (this.chatController.RESPONSE) {
    // this.textAreaControl.setValue(''); // ? CHATBOX COMP
    const index = this.messageState.addLocalMessages([{ ...message, sentBy: MessageSentByEnum.APP }]);
    this.messageState.triggerScrollToLatestMessage.next(true);
    this.sendMessageByCondition(this.messageService.addMessage(message, FacebookMessagingType.RESPONSE), index, true, isRedirectOnNewAudience);

    // this.triggerMoveToFollow();
    // } else {
    //   const text = this.translate.instant('Shop will have up to 24 hours to respond to a user');
    //   this.dialogService.openDialog(text, GenericDialogMode.CAUTION, GenericButtonMode.OK).subscribe();
    // }
    // }
  }

  sendMessageByCondition(source$: Observable<IMessageModel | IFacebookMessageResponse>, index: number, setFollow = false, isRedirectOnNewAudience: boolean): void {
    source$.subscribe({
      error: (err) => {
        console.log('err [LOG]:--> ', err);
        // this.messageState.deleteLocalMessage(index);
        this.sendMessageErrorHandler(JSON.parse(err?.graphQLErrors[0]?.message));
      },
      complete: () => {
        if (isRedirectOnNewAudience) {
          this.messageState.triggerRedirectToNewCreatedAudience.next(null);
        } else {
          if (setFollow) {
            this.messageState.triggerMoveToFollow.next(null);
          }
          this.messageState.triggerScrollToLatestMessage.next(false);
          this.messageState.triggerSetChatRead.next(null);
          setTimeout(() => {
            this.messageState.deleteLocalMessage(index);
          }, 1000);
        }
      },
    });
  }

  sendMessageErrorHandler(err: FacebookErrorCode): void {
    console.error(err.code);
    switch (err.code) {
      case 429:
        this.toastr.error('You have reached your monthly limit.', 'Line Message', {
          positionClass: this.toastPosition,
        });
        break;
      case 551:
        this.toastr.error('This customer was block your connection or your send private message already can not retry', err.type + ' ' + err.message, {
          positionClass: this.toastPosition,
        });
        break;
      case 10900:
        this.toastr.error('Cant send Private Message,', err.type + ' ' + err.message, {
          positionClass: this.toastPosition,
        });
        break;
      case 1024:
        this.toastr.error('Not allow to send message outside 24 hours', err.type + ' ' + err.message, {
          positionClass: this.toastPosition,
        });
        break;
      default:
        this.toastr.error(`CODE : ${err.code} ${err.type} ${err.message}`, 'Send message failed', {
          positionClass: this.toastPosition,
        });
        break;
    }
  }
  sendImagesSetToCustomer(
    audience: IAudienceWithCustomer,
    images_set: Image[],
    userSender: {
      user_id: number;
      user_name: string;
    },
    newAudienceID?: number,
  ) {
    const imageSet$ = from(images_set).pipe(
      // START SEQUENCE
      map((image) => {
        const type =
          image.extension === 'jpg' || image.extension === 'png' || image.extension === 'jpeg' ? IFacebookMessagePayloadTypeEnum.IMAGE : IFacebookMessagePayloadTypeEnum.FILE;
        const newMessage: IMessageModel = {
          mid: null,
          text: '',
          // text: type === IFacebookMessagePayloadTypeEnum.IMAGE ? '' : image.url.replace(/\s/g, '_'),
          object: audience.platform === AudiencePlatformType.LINEOA ? 'line' : 'page',
          audienceID: newAudienceID || audience.id,
          createdAt: Date.now().toString(),
          sentBy: MessageSentByEnum.PAGE,
          sender: userSender,
          attachments: [
            {
              type: type,
              payload: {
                url: image.url,
              },
            },
          ],
          payload: JSON.stringify({ filename: image.name, url: image.url }),
          messagetype: type === IFacebookMessagePayloadTypeEnum.IMAGE ? IMessageType.IMAGE : IMessageType.FILE,
        };
        return newMessage;
      }),
      concatMap((newMessage) => {
        return this.sendMessageLineHandling(newMessage, false);
      }),
      concatMap(() => {
        return of(true);
      }),
    );
    return imageSet$;
  }
}
