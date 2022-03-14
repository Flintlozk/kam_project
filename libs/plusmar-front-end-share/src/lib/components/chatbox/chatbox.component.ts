import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Output,
  QueryList,
  SimpleChanges,
  ViewChild,
  ViewChildren,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { isMobile, parseUTCUnixTimestamp } from '@reactor-room/itopplus-front-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { fadeInOutFastestAnimation, slideBoxAnimation, slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { HistoryDialogComponent } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/history-dialog.component';
import { CustomerTagAddEditDialogComponent } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tag-add-edit-dialog/customer-tag-add-edit-dialog.component';
import { QuickPayService } from '@reactor-room/plusmar-front-end-share/order/quick-pay/quick-pay.service';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { AudienceHistoryService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience-history.service';
import { AudienceService } from '@reactor-room/plusmar-front-end-share/services/facebook/audience/audience.service';
import { MessageService } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.service';
import { MessageState } from '@reactor-room/plusmar-front-end-share/services/facebook/message/message.state';
import { PipelineService } from '@reactor-room/plusmar-front-end-share/services/facebook/pipeline/pipeline.service';
import { FileUploadService } from '@reactor-room/plusmar-front-end-share/services/file-upload.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { LeadsService } from '@reactor-room/plusmar-front-end-share/services/leads/leads.service';
import { NotificationService } from '@reactor-room/plusmar-front-end-share/services/notification/notification.service';
import { ProductsService } from '@reactor-room/plusmar-front-end-share/services/products.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { PageMemberService } from '@reactor-room/plusmar-front-end-share/services/settings/page-member.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { UserTagService } from '@reactor-room/plusmar-front-end-share/user/user-tag/user-tag.service';
import {
  AudienceChatResolver,
  AudienceContactResolver,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceUpdateOperation,
  AudienceViewType,
  ChatboxAttachLocation,
  ChatboxView,
  CustomerDomainStatus,
  CUSTOMER_TAG_COLOR,
  EnumAllowedSendMessage,
  EnumFollowRoute,
  GenericButtonMode,
  GenericDialogMode,
  IAudience,
  IAudienceWithCustomer,
  IChatboxControl,
  ICheckMessageActivity,
  IComment,
  ICustomerTagCRUD,
  ILeadsFormWithComponentsSelected,
  IMessageModel,
  IMessageSender,
  IMessageType,
  IMessageWatermark,
  IUserList,
  IUserSender,
  Message,
  MessagePayload,
  MessageSentByEnum,
  NotificationStatus,
  UserMadeLastChangesToStatus,
  Image,
  IMessageSource,
} from '@reactor-room/itopplus-model-lib';
import { ClipboardService } from 'ngx-clipboard';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Observable, of, partition, Subject, Subscription } from 'rxjs';
import { catchError, debounceTime, map, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ChatboxService } from '../../services/chatbox.service';
import { ChatBoxConfig } from './chatbox.config';
import { PrivateMessageComponent } from './private-message/private-message.component';
import { ProductCatalogService } from './templates/product-catalog/product-catalog.service';
import { TemplatesService } from './templates/templates.service';
interface MessageSuggestion {
  type: 'images' | 'messages';
  shortcut: string;
}

@Component({
  selector: 'reactor-room-chatbox',
  templateUrl: './chatbox.component.html',
  styleUrls: ['./chatbox.component.scss'],
  providers: [ChatBoxConfig],
  animations: [slideBoxAnimation, fadeInOutFastestAnimation, slideInOutAnimation],
})
export class ChatboxComponent implements OnInit, OnDestroy, OnChanges, AfterViewInit {
  @Input() loadedIn: ChatboxAttachLocation = ChatboxAttachLocation.ABSOLUTE;
  isMobile = isMobile();
  tagsAttached: ICustomerTagCRUD[];
  isProductHide = false;
  isProductCatalogHide = false;
  isFormHide = false;
  EAudiencePlatformType = AudiencePlatformType;
  EAudienceStatusType = AudienceDomainStatus;
  bReferral = true;
  viewEnum = ChatboxView;
  privateMessage = false;
  @Input() togglePrivateMessage: Subject<string>;
  latestCommentID: string;
  privateCommentID: string;
  @Input() enableHead = false;

  @Input() extraGrid = false;
  @Input() viewMode: ChatboxView;
  @Input() orderId = 0;
  @Input() audienceId: number;
  newAudienceID = null;
  @Input() audience: IAudienceWithCustomer;
  latestComment: IComment;

  @Output() chatBoxStatusEvent = new EventEmitter<boolean>();
  @Output() openCalendar = new EventEmitter<boolean>();

  userUnavailableText = 'This type of message can only be sent once. You can chat with customer only after the customer has replied your message within 7 days.';
  @ViewChild('content') content: ElementRef;
  @ViewChild('chatInput') chatInput: ElementRef;
  @ViewChild('firstmessage') firstMessageElem: ElementRef;
  @ViewChild('previousLoader') previousLoader: ElementRef;

  @ViewChildren('readCircle') readCircle: QueryList<ElementRef>;
  @ViewChildren('suggestion', { read: ElementRef }) suggestionsRows: QueryList<ElementRef>;
  suggestionSelected: number;

  messagesDestroy$: Subject<boolean>;
  uploadDestroy$: Subject<boolean>;
  messages$: Observable<IMessageModel[]>;
  currentStep: Observable<IAudience>;
  filesToUpload: FileList;
  sender = MessageSentByEnum;
  userSender: IUserSender;
  chatDomain: AudienceDomainType | string;
  chatStatus: CustomerDomainStatus | string = null;
  textAreaControl: FormControl;
  counter = 0;
  scrollTop;
  isHoveringOverMessage = false;

  suggestionsDebounceInterval;
  isSuggestionsShown = false;
  audienceType = AudienceDomainType;
  audienceStatus = AudienceDomainStatus;
  suggestions: (Message & { isMatchedCommand: boolean })[];

  tempDate = [] as string[];

  sidebarData: ILeadsFormWithComponentsSelected[] = [];
  buttonGroupStatus = false;
  @Input() chatBoxStatus = false;
  @Input() onChangingAudience: Subject<number>;
  customerTagEnum = CUSTOMER_TAG_COLOR;
  toastPosition = 'toast-bottom-right';
  audienceData$: Observable<IAudienceWithCustomer>;
  pageUsersCount: number;
  updatedBy: UserMadeLastChangesToStatus;
  customerID: number;
  routeType: AudienceViewType;
  parentRouteResolver$: Observable<AudienceContactResolver>; // = this.route?.parent?.data as Observable<AudienceContactResolver>;
  childRouteResolver$: Observable<AudienceChatResolver>; // = this.route?.data as Observable<AudienceChatResolver>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  instance = false;

  $messageService: Subscription;
  onlyPrivateMessage: boolean;

  chatController: IChatboxControl;
  latestAdminSentTimestamp: number;
  latestUserReadTimestamp: number;
  lastMessageRead: number;
  isProcessing = false;

  isLastRecord = false;
  isRequesting = false;
  fetchMessageIndex = 0;
  fetchMessageLimit = 15;
  previousContentHeight = 0;
  updateMessagesListScrolling: Subject<boolean> = new Subject<boolean>();

  isLoading = true;
  isShowPreviewClipboard = false;
  // pasteClipboardSubject: Subject<{ files: FileList; type: string }> = new Subject<{ files: FileList; type: string }>();
  pasteClipboardSubject: Subject<{ files: FileList; type: string }>;
  commentCover = false;
  debugMode = false;

  isUnread = false;

  isOnSendingImage = false;
  isOnSendingImageText = this.translate.instant('Sending the image set');
  users: IUserList[];
  constructor(
    public chatboxConfig: ChatBoxConfig,
    private route: ActivatedRoute,
    private router: Router,

    private dialog: MatDialog,
    private messageState: MessageState,
    //
    private clipboardService: ClipboardService,
    private messageService: MessageService,
    private pipelineService: PipelineService,
    private dialogService: DialogService,
    private audienceHistoryService: AudienceHistoryService,
    private chatBoxService: ChatboxService,
    private userService: UserService,
    private templateService: TemplatesService,
    private historyDialog: MatDialog,
    private toastr: ToastrService,
    private cd: ChangeDetectorRef,
    public translate: TranslateService,
    private customerService: CustomerService,
    private productService: ProductsService,
    private audienceService: AudienceService,
    private audienceContactService: AudienceContactService,
    private pageMembers: PageMemberService,
    private leadService: LeadsService,
    private notificationService: NotificationService,
    public layoutCommonService: LayoutCommonService,
    private routeService: RouteService,
    private quickPayService: QuickPayService,
    private productCatalogService: ProductCatalogService,
    public fileUploadService: FileUploadService,
    private userTagService: UserTagService,
  ) {}

  debugParams(): void {
    this.route.queryParams.subscribe((params: { dbm: string }) => {
      params?.dbm === 'true' ? (this.debugMode = true) : (this.debugMode = false);
    });
  }

  //#region Component Life Cycle Section : Start
  ngOnInit(): void {
    // Subject Listener
    this.onTriggerScrollToLatestMessage();
    this.onTriggerRedirectToNewCreatedAudience();
    this.onTriggerMoveToFollow();
    this.onTriggerSetChatRead();
    this.onTriggerLatestUserChanges();
    this.onTriggerStopLoading();
    //

    this.debugParams();
    this.updateMessagesList();

    if (isMobile()) {
      this.deactivateMobileChatboxAction();
    }

    if (this.viewMode !== ChatboxView.HISTORY) {
      this.parentRouteResolver$ = this.route?.parent?.data as Observable<AudienceContactResolver>;
      this.childRouteResolver$ = this.route?.data as Observable<AudienceChatResolver>;

      this.getUserLists();
      this.getPageUsers();

      this.initTextAreaControl();
      this.getLatestCommentByPostWatcher();
      this.onSelectCommentToggleSendPrivateMessage();

      this.chatBoxService?.isChatboxCreated?.next(true);
      if (window.innerWidth < 768) this.toastPosition = 'toast-top-right';

      if (this.viewMode === ChatboxView.PEEK) {
        this.handleData({ audience: this.audience } as AudienceChatResolver);
      } else {
        this.childRouteResolver$.pipe(takeUntil(this.destroy$)).subscribe((val) => {
          this.handleData(val as AudienceChatResolver);
        });
      }
    } else {
      this.chatController = {
        RESPONSE: false,
        MESSAGE_TAG: false,
        PRIVATE_ONLY: false,
      };
      this.fetchMessageHistory();
    }

    this.onChangingAudience?.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.handleOnContactListChangingAudience();
    });
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (this.viewMode === ChatboxView.HISTORY) {
      this.fetchMessageHistory();
    }
    this.setFocusOnMessageBox();
    this.clearMessageBox();

    if (changes?.extraGrid?.currentValue === true) {
      this.doScroll();
    }
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
    this.setFocusOnMessageBox();
  }

  ngOnDestroy(): void {
    this.instance = false;
    this.destroy$.next(true);
    this.destroy$.unsubscribe();

    this.messagesDestroy$?.next(true);
    this.messagesDestroy$?.unsubscribe();

    if (this.viewMode !== ChatboxView.HISTORY) {
      /** Remove Local messages on CMP Destroyed */
      this.messageState.localMessages$.next([]);
      /** Remove Messages on CMP Destroyed */
      this.messageState.messages$.next([]);
    } else {
      this.messageState.hisotryMessages$.next([]);
    }
  }
  //#endregion

  /// GET MESSAGE FOR HISTORY_VIEW
  fetchMessageHistory(): void {
    this.messagesDestroy$ = new Subject();
    this.setTemplateListener();
    this.messages$ = this.messageState.getHistoryMessages();
    this.getHistoryMessages();
    this.getCustomerTags();
  }

  getHistoryMessages(): void {
    this.messageService
      .getAllMessages(this.audienceId)
      .pipe(takeUntil(this.messagesDestroy$))
      .subscribe({
        next: (messages) => {
          this.messageState.setHistoryMessages(messages);
          this.content.nativeElement.scrollTop = this.content.nativeElement.scrollHeight;
          this.isLoading = false;
        },
        error: (err) => {
          console.log('getAllMessages error : ', err);
          this.isLoading = false;
          // TODO: Handle Error
        },
      });
  }

  getLatestCommentByPostWatcher(): void {
    this.chatBoxService.latestComment.pipe(takeUntil(this.destroy$)).subscribe((comment: IComment) => {
      this.latestCommentID = comment.commentID;
    });
  }

  handleOnContactListChangingAudience(): void {
    this.isLoading = true;
    this.messageState.localMessages$.next([]);
    this.messageState.messages$.next([]);
  }

  handleData({ audience, route }: AudienceChatResolver): void {
    // * route resolver wrapper
    this.updateAudienceState(audience, route);
  }

  updateAudienceState(audience: IAudienceWithCustomer, route: AudienceViewType): void {
    this.routeType = route;
    if (this.instance) {
      // On Update New Audience
      this.messagesDestroy$.next(true);
      this.messagesDestroy$.unsubscribe();
      this.messagesDestroy$ = new Subject();
    } else {
      // Init first time
      this.messagesDestroy$ = new Subject();
    }
    this.setTemplateListener();
    this.instance = true;
    this.isLastRecord = false;
    this.audience = audience;

    this.latestComment = null;
    this.privateMessage = false;
    this.chatController = {
      RESPONSE: false,
      MESSAGE_TAG: false,
      PRIVATE_ONLY: false,
    };

    this.commentCover = audience.status === AudienceDomainStatus.COMMENT;

    this.getUserMadeLastChangesToStatus();
    this.messageState.deleteAllLocalMessage().subscribe(() => {
      this.fetchMessageIndex = 0;
      this.initData();
    });
  }

  initData(): void {
    if (this.audience.id !== null) {
      this.audienceId = this.audience?.parent_id || this.audience?.id;

      this.currentStep = this.audienceHistoryService.getSteps(this.audienceId).pipe(takeUntil(this.messagesDestroy$));
      this.currentStep.subscribe(({ domain, status }) => {
        this.chatDomain = domain;
        this.chatStatus = status;
      });

      if (this.viewMode !== this.viewEnum.HISTORY && this.viewMode !== this.viewEnum.CLOSED) {
        this.checkisProductHide();
        this.checkisFormHide();
      }
      this.initMessages();
      this.setChatReadNotify();
      this.getCustomerTags();
      this.chatFeatureControllingUnit();
      // CHECK LINE OR FACEBOOK
    }
  }

  viewComment(): void {
    if (this.isMobile) {
      this.commentCover = false;
      this.toggleChatBox();
    } else {
      const audienceContactCMPTabIndex = 0;
      this.audienceContactService.audienceContactTabChanges.next(audienceContactCMPTabIndex);
    }
  }

  setChatReadNotify(): void {
    if (this.audience.notify_status === NotificationStatus.UNREAD) {
      this.notificationService.setStatusNotifyToReadByAudienceID(this.audienceId, NotificationStatus.READ, this.audience.platform).subscribe(() => {
        this.notificationService.forceUpdate.next(true);
      });
    }
  }

  chatFeatureControllingUnit(): void {
    if (this.audience.platform === AudiencePlatformType.FACEBOOKFANPAGE) {
      this.messageService
        .checkMessageActivity(this.audienceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe(({ inbox, comment }: ICheckMessageActivity) => {
          switch (inbox.allowOn) {
            case EnumAllowedSendMessage.ALLOW:
              this.chatController.RESPONSE = true;
              break;
            case EnumAllowedSendMessage.ALLOW_TAG:
              this.chatController.MESSAGE_TAG = true;
              break;
            default:
              this.chatController.RESPONSE = false;
              this.chatController.MESSAGE_TAG = false;
              break;
          }

          if (!this.chatController.RESPONSE) {
            switch (comment.allowOn) {
              case EnumAllowedSendMessage.PRIVATE_ONLY:
                this.chatController.PRIVATE_ONLY = true;
                break;
              default:
                this.chatController.PRIVATE_ONLY = false;
                break;
            }
          }
        });
    } else {
      this.chatController.RESPONSE = true;
    }
  }

  activeButtonGroup(): void {
    this.buttonGroupStatus = !this.buttonGroupStatus;
  }

  deactiveButtonGroup(): void {
    if (!this.isProcessing) this.buttonGroupStatus = false;
  }

  deactivateMobileChatboxAction(): void {
    this.chatBoxService.deactivateMobileChatboxAction.pipe(takeUntil(this.destroy$)).subscribe((isClose) => {
      this.buttonGroupStatus = !isClose;
    });
  }

  clickOutsideButtonBox(event: boolean): void {
    if (event) this.buttonGroupStatus = false;
  }

  toggleChatBox(): void {
    this.chatBoxStatus = !this.chatBoxStatus;
    this.chatBoxService.toggleChatbox.next(this.chatBoxStatus);
  }

  getUserLists(): void {
    this.userTagService
      .getUserList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (users) => {
          this.users = users;
          this.getUser();
        },
        () => {
          this.getUser();
        },
      );
  }

  mapUserSentBy(sender: IMessageSender): string {
    if (this.users) {
      const user = this.users.find((x) => x.userID === sender.user_id);
      if (user) {
        return user.userAlias || sender.user_name;
      } else {
        return sender.user_name;
      }
    } else {
      return sender.user_name;
    }
  }

  getUser(): void {
    this.userService.$userContext.pipe(takeUntil(this.destroy$)).subscribe(({ id: user_id, name: user_name }) => {
      const user = this.users.find((x) => x.userID === user_id);
      const aliasName = user.userAlias || user_name;

      this.userSender = {
        user_id,
        user_name,
        user_alias: aliasName,
      };
    });
  }

  getPageUsers(): void {
    this.pageMembers
      .getPageMembersAmountByPageID()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        this.pageUsersCount = result.amount_of_users;
      });
  }

  setFocusOnMessageBox(): void {
    if (window.innerWidth > 768) {
      this.chatInput?.nativeElement?.focus();
    }
  }
  setUnfocusOnMessageBox(): void {
    this.chatInput?.nativeElement?.blur();
  }
  clearMessageBox(): void {
    if (this.chatInput) this.chatInput.nativeElement.value = '';
  }

  checkisProductHide(): void {
    this.isProductHide = false;
    this.isProductCatalogHide = false;
    const isAudienceCustomer = this.audience.domain === this.audienceType.CUSTOMER;
    const isAudienceLead = this.audience.domain === this.audienceType.LEADS;
    const isAudienceStatusLead = this.audience.status === this.audienceStatus.LEAD;
    const isAudienceLine = this.audience.platform === AudiencePlatformType.LINEOA;

    if (isAudienceCustomer || isAudienceLead || isAudienceStatusLead || isAudienceLine) {
      this.isProductHide = true;
    }

    if (isAudienceCustomer || isAudienceLead || isAudienceStatusLead) {
      this.isProductCatalogHide = true;
    }
  }

  checkisFormHide(): void {
    this.isFormHide = false;
    const isAudienceLead = this.audience.domain === this.audienceType.LEADS;
    const isAudienceStatusLead = this.audience.status === this.audienceStatus.LEAD;

    if (isAudienceLead || isAudienceStatusLead) {
      this.isFormHide = true;
    } else {
      this.leadService
        .getAudienceLeadContext(this.audience.id)
        .pipe(takeUntil(this.destroy$))
        .subscribe((leadSubmission) => {
          if (leadSubmission !== null) {
            this.isFormHide = true;
          }
        });
    }
  }

  initTextAreaControl(): void {
    this.textAreaControl = new FormControl('');
    const [command, message] = partition(this.textAreaControl.valueChanges.pipe(debounceTime(300)), (text) => text.startsWith(':'));

    command
      .pipe(
        takeUntil(this.destroy$),
        map<string, MessageSuggestion>((c: string) => {
          if (c.substr(0, 2) === ':/') return { type: 'images', shortcut: c.slice(2) };
          if (c.substr(0, 1) === ':') return { type: 'messages', shortcut: c.slice(1) };
        }),
        switchMap((c: MessageSuggestion) => this.handleMessageSuggestions(c)),
      )
      .subscribe({
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        next: () => {},
        error: (err) => {
          console.error(err);
        },
      });
    message.pipe(takeUntil(this.destroy$)).subscribe({
      next: () => {
        if (this.isSuggestionsShown) {
          this.hideSuggestions();
        }
      },
    });
  }

  handleMessageSuggestions(c: MessageSuggestion): Observable<Message[]> {
    return this.chatBoxService.getTemplatesByShortcut(c).pipe(
      tap({
        next: (results) => {
          if (results?.length) {
            this.showSuggestions();
            this.suggestions = results.map((r) => ({ ...r, isMatchedCommand: false }));
            const index = results?.findIndex((r) => r.shortcut === c.shortcut);
            if (index > -1) {
              setTimeout(() => {
                this.suggestions[index].isMatchedCommand = true;
              }, 100);
            }
          } else {
            this.hideSuggestions();
            this.suggestions = [];
          }
        },
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        error: () => {},
      }),
    );
  }

  showSuggestions(): void {
    this.isSuggestionsShown = true;
  }

  hideSuggestions(): void {
    this.isSuggestionsShown = false;
  }

  selectSuggestion(suggestion: Message): void {
    if (suggestion?.images?.length) {
      this.handleSendImageSets(suggestion.images);
      this.textAreaControl.patchValue('');
      this.chatInput.nativeElement.focus();
    } else {
      this.templateService.changeMessage(suggestion.text, 'message');
    }
    this.hideSuggestions();
  }

  setTemplateListener(): void {
    this.templateService?.currentMessage?.pipe(takeUntil(this.messagesDestroy$)).subscribe(({ payload, type }) => {
      if (payload) this.chatInput?.nativeElement.focus();
      switch (type) {
        case 'forms':
          this.handleSendFormPlatForm(payload);
          break;
        case 'message':
          this.handleTemplateReplaces(payload as string);
          // this.dialog.closeAll();
          break;
        case 'product_link':
          this.shareProductToChatBox(payload as string);
          // this.dialog.closeAll();
          break;
        case 'images-set':
          this.handleSendImageSets(payload as { url: string; attachment_id: string; extension: string }[]);
          // this.dialog.closeAll();
          this.chatInput.nativeElement.focus();
          break;
        case 'quick_pay':
          this.sendQuickPayToChatBox(payload as number);
          break;
        case 'product_catalog':
          this.sendProductCatalogToChatBox(payload as number);
          break;
        default:
          this.textAreaControl.setValue(payload?.toString());
          // this.dialog.closeAll();
          break;
      }
    });
  }
  handleSendImageSets(images_set: Image[]) {
    this.uploadDestroy$ = new Subject();
    this.isOnSendingImage = true;
    this.chatBoxService
      .sendImageSets(this.audience, images_set, this.userSender)
      .pipe(takeUntil(this.uploadDestroy$))
      .subscribe({
        error: (error) => {
          this.isOnSendingImage = false;
          throw Error(error);
        },
        complete: () => {
          this.isOnSendingImage = false;
          this.uploadDestroy$.next(true);
          this.uploadDestroy$.unsubscribe();
        },
      });
  }

  handleSendFormPlatForm(payload: MessagePayload): void {
    switch (this.audience.platform) {
      case AudiencePlatformType.LINEOA:
        this.sendFormLinePayload(payload);
        break;
      default:
        this.sendFormPayload(payload);
        break;
    }
  }

  handleTemplateReplaces(message: string): void {
    message = message.replace(new RegExp('@first_name', 'g'), this.audience.first_name);
    message = message.replace(new RegExp('@full_name', 'g'), `${this.audience.first_name} ${this.audience.last_name !== null ? this.audience.last_name : ''}`);

    this.textAreaControl.setValue(message);
  }

  listScrolling(scrollEvent: Event): void {
    if (this.viewMode !== this.viewEnum.HISTORY && this.viewMode !== this.viewEnum.CLOSED) {
      if (!this.isLastRecord && !this.isLoading) {
        const target = scrollEvent.target as HTMLElement;

        if (target.scrollTop === 0) {
          const isUpdateMessage = true;
          this.updateMessagesListScrolling.next(isUpdateMessage);
        }
      }
    }
  }

  addPreviousMessages(): void {
    const isUpdateMessage = true;
    this.updateMessagesListScrolling.next(isUpdateMessage);
  }

  updateMessagesList(): void {
    this.updateMessagesListScrolling.pipe(debounceTime(400)).subscribe((doUpdate: boolean) => {
      this.isRequesting = true;
      this.fetchMessageIndex++;
      this.getMessages(doUpdate);
    });
  }

  initMessages(): void {
    this.messages$ = this.messageState.getMessages();
    this.getMessages();
    this.subscribeNewMessage();

    if (environmentLib.production) this.getMessageWatermark();
  }

  getMessages(update = false): void {
    this.messageService
      .getMessagesOnScroll(this.audienceId, this.fetchMessageIndex, this.fetchMessageLimit)
      .pipe(takeUntil(this.messagesDestroy$))
      .subscribe({
        next: (messages) => {
          if (messages.length > 0) {
            this.isRequesting = false;
            this.getMessageWatermarkLine(messages);
            if (update) {
              this.content.nativeElement.scrollBy(0, 1);
              this.messageState.addOldMessage(messages);
            } else {
              if (messages) this.messageState.setMessages(messages);
              this.messageState.triggerScrollToLatestMessage.next(true);
              // this.scrollToLatestMessage(true);
            }
          } else {
            this.isLoading = false;
            this.isRequesting = false;
            this.isLastRecord = true;
          }
        },
        error: (err) => {
          console.log('getMessage error:  ', err);
          this.isLoading = false;
          this.isRequesting = false;
          this.isLastRecord = err.message === 'LAST_MESSAGE_RECORD';
        },
      });
  }

  subscribeNewMessage(): void {
    this.messageService
      .getMessagesSubscription(this.audienceId)
      .pipe(takeUntil(this.messagesDestroy$))
      .subscribe({
        next: (message) => {
          if (message.sentBy === MessageSentByEnum.AUDIENCE) {
            this.chatController.RESPONSE = true;
            this.chatController.MESSAGE_TAG = false;
            this.chatController.PRIVATE_ONLY = false;
            this.setChatRead(message.sentBy);
          }

          this.messageState.addNewMessage(message);
          this.messageState.triggerScrollToLatestMessage.next(false);
          this.bindWatermarkTimestamp(message.messageWatermark);

          this.bindWatermarkTimestampLine(message);

          if (this.audience.status === AudienceDomainStatus.COMMENT) {
            this.commentCover = false;
            this.audienceContactService.triggerCommentChangeToInbox.next({ audienceID: this.audience.id });
            this.audienceContactService.updateSingleAudience.next({ audienceID: this.audience.id, operation: AudienceUpdateOperation.UPDATE });
          }
          this.messageService.triggerQuickPayMessage(message);
        },
        error: (err) => {
          console.error('getMessagesSubscription error: ', err.message);
          // TODO: Handle Error
        },
      });
  }

  getMessageWatermark(): void {
    if ([AudiencePlatformType.FACEBOOKFANPAGE].includes(this.audience.platform)) {
      this.messageService
        .getMessageWatermark(this.audience.psid)
        .pipe(takeUntil(this.messagesDestroy$))
        .subscribe((watermark: IMessageWatermark) => {
          this.bindWatermarkTimestamp(watermark);
        });
    }
  }
  getMessageWatermarkLine(messages: IMessageModel[]): void {
    if ([AudiencePlatformType.LINEOA].includes(this.audience.platform)) {
      let createdAt = '';
      messages.forEach((message) => {
        if (message.sentBy === 'AUDIENCE') {
          createdAt = message.createdAt;
        }
      });
      if (createdAt) {
        this.latestUserReadTimestamp = parseUTCUnixTimestamp(createdAt);
      }
    }
  }

  bindWatermarkTimestamp(watermark: IMessageWatermark): void {
    if (watermark) {
      this.latestUserReadTimestamp = parseUTCUnixTimestamp(Number(watermark.read));
      this.latestAdminSentTimestamp = parseUTCUnixTimestamp(Number(watermark.delivered));
    }
  }
  bindWatermarkTimestampLine(message: IMessageModel): void {
    if ([AudiencePlatformType.LINEOA].includes(this.audience.platform)) {
      if (message.sentBy === 'AUDIENCE') {
        this.latestUserReadTimestamp = parseUTCUnixTimestamp(message.createdAt);
      }
    }
  }

  checkReadMessage(): void {
    if (this.readCircle?.last) {
      const lastid = Number(this.readCircle.last.nativeElement.id);
      this.lastMessageRead = lastid;
    }
  }

  sendFormPayload(id: string | number | { url: string }[]): void {
    const text = 'Send contact form to audience ?';
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        const audienceId = this.audience.id;
        const PSID = this.audience.psid;
        this.pipelineService.sendFormPayload(audienceId, PSID, Number(id)).subscribe(
          () => {
            this.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.isProcessing);
            this.dialog.closeAll();
            void this.router.navigate([`follows/chat/${this.audience.id}/lead`]);
          },
          (err) => {
            this.toastr.error(this.translate.instant(err.message), this.translate.instant('Lead'));
            console.log('sendFormPayload err', err);
            this.isProcessing = false;
            this.layoutCommonService.toggleUILoader.next(this.isProcessing);

            const errorMessage = err?.graphQLErrors[0]?.message;
            this.sendFromErrorHandle(errorMessage);
          },
        );
      }
    });
  }

  sendFormLinePayload(form_id: MessagePayload): void {
    const text = 'Send contact form to audience ?';
    this.dialogService.openDialog(text, GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm) => {
      if (confirm) {
        this.isProcessing = true;
        this.layoutCommonService.toggleUILoader.next(this.isProcessing);

        const audienceId = this.audience.id;
        this.pipelineService
          .sendFormLinePayload(audienceId, Number(form_id))
          .pipe(
            catchError((err) => {
              this.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.isProcessing);

              const errorMessage = err?.graphQLErrors[0]?.message;
              this.sendFromErrorHandle(errorMessage);
              return of(errorMessage);
            }),
          )
          .subscribe(
            () => {
              this.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.isProcessing);

              this.dialog.closeAll();
              this.messageService.setLeadFormDialogListener(true);
            },
            (err) => {
              this.isProcessing = false;
              this.layoutCommonService.toggleUILoader.next(this.isProcessing);

              this.messageService.setLeadFormDialogListener(false);
              console.error(err);
            },
          );
      } else {
        this.messageService.setLeadFormDialogListener(false);
      }
    });
  }

  sendFromErrorHandle(errorMessage: string): void {
    if (errorMessage.includes('LEAD_HAVE_BEEN_COLLECTED')) {
      this.toastr.success('Lead has been collected', 'Lead');
    }
    if (errorMessage.includes("'response' of undefined")) {
      this.toastr.error("Can't sending card", 'Maybe the WHITE_LIST domain is not allow');
    }
    this.dialog.closeAll();
    this.messageService.setLeadFormDialogListener(false);
  }

  copyToClipboard(text: string): void {
    this.clipboardService.copyFromContent(text);
  }

  showLoading(toggle: boolean): void {
    this.layoutCommonService.toggleUILoader.next(toggle);
  }
  handleSuggestionMessage(event: InputEvent): void {
    event.preventDefault();
    if (!this.isSuggestionsShown) {
      if (this.audience.status === AudienceDomainStatus.CLOSED || this.audience.status === AudienceDomainStatus.REJECT) {
        this.unfocusTextBox();
        this.showLoading(true);
        // prevent send new message
        this.audienceService.openNewChat(this.audience.customer_id).subscribe((newAudienceID) => {
          this.newAudienceID = newAudienceID;
          this.sendMessage(event, true, newAudienceID);
        });
      } else {
        this.sendMessage(event, false);
      }
    } else {
      const suggestion = this.suggestions?.find((s) => s.isMatchedCommand);
      if (suggestion) {
        this.selectSuggestion(suggestion);
      }
    }
  }

  sendMessage(event: InputEvent, createNewAudience: boolean, newAudienceID = null): void {
    if (event !== null) event.preventDefault();

    if (this.textAreaControl.value) {
      of(true)
        .pipe(debounceTime(100))
        .subscribe(() => {
          const newMessage: IMessageModel = {
            mid: null,
            text: String(this.textAreaControl.value.trim()),
            object: this.audience.platform === AudiencePlatformType.LINEOA ? 'line' : 'page',
            audienceID: createNewAudience ? newAudienceID : this.audienceId,
            createdAt: Date.now().toString(),
            sentBy: MessageSentByEnum.PAGE,
            sender: this.userSender,
            messagetype: IMessageType.TEXT,
          };
          const message = { ...newMessage, audienceID: this.audienceId };
          switch (this.audience.platform) {
            case AudiencePlatformType.LINEOA: {
              this.textAreaControl.setValue('');
              this.chatBoxService
                .sendMessageLineHandling(newMessage, createNewAudience)
                .pipe(
                  catchError((err) => {
                    console.log(err);
                    throw Error(err);
                  }),
                )
                .subscribe();
              break;
            }
            case AudiencePlatformType.FACEBOOKFANPAGE: {
              this.textAreaControl.setValue('');
              this.chatBoxService.sendMessageFacebookHandling(message, createNewAudience);
              break;
            }
            default: {
              break;
            }
          }
        });
    }
  }

  latestCommentToggleSendPrivateMessage(privateCommentID = this.latestCommentID): void {
    this.dialog
      .open(PrivateMessageComponent, {
        width: isMobile() ? '90%' : '30%',
        data: { audience: this.audience, audienceId: this.audienceId, commentId: privateCommentID },
      })
      .afterClosed()
      .subscribe((privateMessageData: { message: IMessageModel; commentID: string }) => {
        if (privateMessageData) {
          this.sendPrivateMessage(privateMessageData);
        }
      });
  }
  onSelectCommentToggleSendPrivateMessage(): void {
    this.togglePrivateMessage.subscribe((commentID: string) => {
      this.privateCommentID = commentID;
      this.latestCommentToggleSendPrivateMessage(commentID);
    });
  }
  sendPrivateMessage(value: { message: IMessageModel; commentID: string }): void {
    if (value !== null) {
      const { message, commentID } = value;
      message.sender = this.userSender;
      const index = this.messageState.addLocalMessages([{ ...message, sentBy: MessageSentByEnum.APP }]);
      // this.scrollToLatestMessage(true);
      this.messageState.triggerScrollToLatestMessage.next(true);
      this.privateMessage = false;
      this.chatBoxService.sendMessageByCondition(this.messageService.sendPrivateMessage(message, commentID), index, false, false);
    } else {
      this.privateMessage = false;
    }
  }
  goToCustomerInfo(): void {
    this.routeService.setRouteRef(this.router.url);
    const customerID = this.audience.customer_id;
    void this.router.navigate(['customers', customerID]);
  }

  openTagDialog(): void {
    const dialogRef = this.dialog.open(CustomerTagAddEditDialogComponent, {
      width: '100%',
      data: this.audience.customer_id,
    });

    dialogRef.afterClosed().subscribe((result: boolean) => {
      if (result) {
        this.audienceContactService.updateContactTag.next({ customerID: this.audience?.customer_id, audienceID: this.audience?.id });
        this.getCustomerTags();
      }
    });
  }

  getCustomerTags(): void {
    if (this.audience?.customer_id) {
      this.audienceContactService.updateAudienceTag.next({ customerID: this.audience?.customer_id, audienceID: this.audience?.id });
      this.customerService.getCustomerTagByPageByID(this.audience?.customer_id).subscribe((result) => {
        if (result.length > 0) {
          this.getTagAttached(result);
        }
      });
    }
  }

  getTagAttached(tags: ICustomerTagCRUD[]): void {
    this.tagsAttached = tags?.filter((tag) => tag.tagMappingID !== -1);
  }

  shareProductToChatBox(ref: string): void {
    const audienceId = this.audience.id;
    const PSID = this.audience.psid;
    this.productService.sendProductToChatBox(audienceId, PSID, ref).subscribe(() => {
      const isAudience = this.audience.domain === AudienceDomainType.AUDIENCE;
      const notFollow = this.audience.status !== AudienceDomainStatus.FOLLOW;
      if (isAudience && notFollow) {
        if (this.audience.platform === this.EAudiencePlatformType.FACEBOOKFANPAGE) {
          this.toastr.success(
            this.audience.first_name +
              ' ' +
              (this.audience.last_name !== null ? this.audience.last_name : '') +
              ' ' +
              (this.audience.aliases !== null ? this.audience.aliases : '') +
              ' has been moved to Follow',
            'Success',
          );
        } else if (this.audience.platform === this.EAudiencePlatformType.LINEOA) {
          this.toastr.success(this.audience.first_name + ' ' + (this.audience.aliases !== null ? this.audience.aliases : '') + ' has been moved to Follow', 'Success');
        }
      }
    });
  }

  sendQuickPayToChatBox(quickPayID: number): void {
    switch (this.audience.platform) {
      case AudiencePlatformType.LINEOA:
        {
          const audienceID = this.audience.id;
          const PSID = AudiencePlatformType.LINEOA;
          this.quickPayService
            .sendQuickPayToChatBox(quickPayID, audienceID, PSID)
            .pipe(
              tap((result) => this.quickPayService.quickPaySendResult$.next(result)),
              catchError((e) => {
                console.log('send to chatbox error :>> ', e);
                return EMPTY;
              }),
            )
            .subscribe();
        }
        break;
      default:
        {
          const audienceID = this.audience.id;
          const PSID = this.audience.psid;
          this.quickPayService
            .sendQuickPayToChatBox(quickPayID, audienceID, PSID)
            .pipe(
              tap((result) => this.quickPayService.quickPaySendResult$.next(result)),
              catchError((e) => {
                console.log('FACEBOOK send to chatbox error :>> ', e);
                return EMPTY;
              }),
            )
            .subscribe();
        }
        break;
    }
  }

  sendProductCatalogToChatBox(catalogID: number): void {
    switch (this.audience.platform) {
      case AudiencePlatformType.LINEOA:
        {
          const audienceID = this.audience.id;
          const PSID = AudiencePlatformType.LINEOA;
          this.productCatalogService
            .sendProductCatalogToChatBox(catalogID, audienceID, PSID)
            .pipe(
              tap((result) => {
                console.log('result :>> ', result);
              }),
              catchError((e) => {
                console.log('send line catalog to chatbox error :>> ', e);
                return EMPTY;
              }),
            )
            .subscribe();
        }
        break;
      default:
        {
          const audienceID = this.audience.id;
          const PSID = this.audience.psid;
          this.productCatalogService
            .sendProductCatalogToChatBox(catalogID, audienceID, PSID)
            .pipe(
              tap((result) => {
                if (result.status === 200) {
                  const successMsg = this.translate.instant('PRODUCT_CATALOG_SEND_SUCCESS');
                  this.toastr.success(successMsg);
                } else {
                  this.showProductCatalogErrorMsg();
                }
              }),
              catchError((e) => {
                this.showProductCatalogErrorMsg();
                console.log('send facebook catalog  to chatbox error :>> ', e);
                return EMPTY;
              }),
            )
            .subscribe();
        }
        break;
    }
  }

  showProductCatalogErrorMsg(): void {
    const errorMsg = this.translate.instant('PRODUCT_CATALOG_SEND_ERROR');
    this.toastr.error(errorMsg);
  }

  handleArrowUp(): void {
    this.suggestionsRows.last.nativeElement.focus();
    this.suggestionSelected = this.suggestionsRows.length - 1;
  }

  focusDownSuggestion(): void {
    if (this.suggestionSelected + 1 <= this.suggestionsRows.length - 1) {
      this.suggestionSelected = this.suggestionSelected + 1;
      this.suggestionsRows.toArray()[this.suggestionSelected].nativeElement.focus();
    } else {
      this.chatInput.nativeElement.focus();
    }
  }

  unfocusTextBox(): void {
    this.chatInput.nativeElement.blur();
  }

  focusUpSuggestion(): void {
    this.suggestionSelected = this.suggestionSelected - 1 >= 0 ? this.suggestionSelected - 1 : this.suggestionSelected;
    this.suggestionsRows.toArray()[this.suggestionSelected].nativeElement.focus();
  }

  showHistoryDetails(audienceID: number): boolean {
    if (!audienceID) {
      return false;
    }
    this.openAudienceHistoryDialog(audienceID);
  }
  setChatUnread(audienceID: number): boolean {
    if (!audienceID) {
      return false;
    }

    this.dialogService.openDialog(this.translate.instant('Mark as Unread'), GenericDialogMode.CONFIRM, GenericButtonMode.CONFIRM).subscribe((confirm: boolean) => {
      if (confirm) {
        this.audienceContactService.setAudienceUnread(audienceID).subscribe(() => {
          this.setChatRead(MessageSentByEnum.AUDIENCE);
        });
      }
    });
  }

  openAudienceHistoryDialog(audienceID: number): void {
    this.historyDialog.open(HistoryDialogComponent, { data: { audienceID: audienceID, customerID: this.audience.customer_id, currentPage: 1 } });
  }

  onBack(): void {
    if (this.audience.domain === AudienceDomainType.CUSTOMER) {
      if (this.loadedIn === ChatboxAttachLocation.ORDER_HISTORY) void this.router.navigate(['/purchase-order/1']);
      else if (this.routeType === AudienceViewType.ORDER) void this.router.navigateByUrl(`order/${EnumFollowRoute[this.audience.status]}`);
      else void this.router.navigateByUrl('follows/list/all/1');
    } else {
      void this.router.navigate(['/follows/list/all/1']);
    }
  }

  pasteClipboardResponse({ isSubmit, source }: { isSubmit: boolean; source: { files: FileList; type: string } }): void {
    if (isSubmit) {
      switch (source.type) {
        case 'IMAGE':
          void this.imageUpload(this.audience, source.files, this.audience.id, this.userSender);
          break;
        case 'FILE':
          void this.fileUpload(this.audience, source.files, this.audience.id, this.userSender);
          break;
        default:
          break;
      }
    }
    this.isShowPreviewClipboard = false;
    this.setFocusOnMessageBox();
  }
  pasteClipboard(event: ClipboardEvent): boolean {
    if (this.chatController.PRIVATE_ONLY) {
      return;
    }
    if (!this.isClipboardDataFileExist(event)) {
      // Equivalent to paste text, so no prevent default, no upload
      // When upload file in OSX & Linux, the clipboard will be filename not the file
      return;
    }
    const { files } = event.clipboardData;
    event.preventDefault();
    event.stopPropagation();
    // https://bugs.chromium.org/p/chromium/issues/detail?id=1175483
    // Multiple upload only work in Windows, OSX and Linux has to wait (Tested in Edge)
    if (this.isAllFilesInClipboardAreImage(files)) {
      this.setUnfocusOnMessageBox();
      this.pasteClipboardSubject = new Subject<{ files: FileList; type: string }>();
      this.isShowPreviewClipboard = true;
      setTimeout(() => {
        this.pasteClipboardSubject.next({ files, type: 'IMAGE' });
      }, 100);
      // User upload all images will show as images placeholder
    } else {
      this.setUnfocusOnMessageBox();
      this.pasteClipboardSubject = new Subject<{ files: FileList; type: string }>();
      this.isShowPreviewClipboard = true;
      setTimeout(() => {
        this.pasteClipboardSubject.next({ files, type: 'FILE' });
      }, 100);
      // https://bugs.chromium.org/p/chromium/issues/detail?id=1175483
      // Upload non-images only work in Windows, OSX and Linux has to wait (Tested in Edge)
      // Users upload both images and non-images will show as files placeholder
    }
  }
  private isAllFilesInClipboardAreImage(fileList: FileList) {
    for (let i = 0; i < fileList.length; i++) {
      if (!this.isImageFile(fileList[i])) {
        return false;
      }
    }
    return true;
  }
  private isClipboardDataFileExist(event: ClipboardEvent) {
    return event.clipboardData && event.clipboardData.files && event.clipboardData.files.length;
  }
  private isImageFile(file: File): boolean {
    return file.type.search(/^image\//i) === 0;
  }

  openMap(lat: string, lng: string): string {
    const parameters = `query=${lat},${lng}`;
    return `https://www.google.com/maps/search/?api=1&${parameters}`;
  }

  //#region Subject Listener
  // trigger from Service
  // ? Subject Listener
  onTriggerScrollToLatestMessage(): void {
    this.messageState.triggerScrollToLatestMessage.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe((isForce: boolean) => {
      this.scrollToLatestMessage(isForce);
    });
  }

  scrollToLatestMessage(force = false): void {
    if (force) {
      this.doScroll();
    } else {
      const element = this.content.nativeElement;
      const onSrollAtBottom = element.scrollHeight - element.offsetHeight <= element.scrollTop + 166;

      if (onSrollAtBottom) {
        this.doScroll();
      }
    }
  }

  doScroll(): void {
    setTimeout(() => {
      this.content.nativeElement.scrollTo(0, this.content.nativeElement.scrollHeight);
      this.isLoading = false;
    }, 1);
  }

  // ? Subject Listener
  onTriggerRedirectToNewCreatedAudience(): void {
    this.messageState.triggerRedirectToNewCreatedAudience.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe(() => {
      this.redirectToNewCreatedAudience();
    });
  }

  redirectToNewCreatedAudience(): void {
    const previousID = this.audienceId;
    this.audienceService
      .getAudienceByID(this.newAudienceID)
      .pipe(takeUntil(this.destroy$))
      .subscribe((newAudience) => {
        void this.router.navigate([`/follows/chat/${this.newAudienceID}/post`]);
        this.showLoading(false);
        this.audienceContactService.updateAudienceIdentity.next({ previousID, audience: newAudience });
      });
  }

  // ? Subject Listener
  onTriggerMoveToFollow(): void {
    this.messageState.triggerMoveToFollow.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe(() => {
      this.triggerMoveToFollow();
    });
  }

  triggerMoveToFollow(): void {
    if (this.audience.status === AudienceDomainStatus.INBOX || this.audience.status === AudienceDomainStatus.COMMENT) {
      this.audience.status = AudienceDomainStatus.FOLLOW;
      this.audienceContactService.triggerMoveToFollow.next({ audienceID: this.audience.id });
      this.getUserMadeLastChangesToStatus();
    }
  }

  // ? Subject Listener
  onTriggerSetChatRead(): void {
    this.messageState.triggerSetChatRead.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe(() => {
      this.setChatRead(MessageSentByEnum.PAGE);
    });
  }

  getUserMadeLastChangesToStatus(): void {
    setTimeout(() => {
      this.audienceService
        .getUserMadeLastChangesToStatus(this.audienceId)
        .pipe(takeUntil(this.destroy$))
        .subscribe((res) => {
          this.updatedBy = res;
          this.cd.detectChanges();
        });
    }, 100);
  }
  // ? Subject Listener
  onTriggerLatestUserChanges(): void {
    this.audienceContactService.triggerLatestUserChanges.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe(() => {
      this.getUserMadeLastChangesToStatus();
    });
  }
  onTriggerStopLoading(): void {
    this.messageState.triggerStopLoading.pipe(takeUntil(this.destroy$), debounceTime(200)).subscribe(() => {
      this.isOnSendingImage = false;
    });
  }
  setChatRead(actor: MessageSentByEnum): void {
    this.audience.latest_sent_by = actor;
  }
  //#endregion

  imageAttachmentExpired(message: IMessageModel) {
    if (message.source === IMessageSource.FACEBOOK) {
      this.messageService
        .getAttachmentUrlExpired(message)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (message) => {
            this.messageState.replaceTheExpiredMessage(message);
          },
          (err) => {
            console.log('imageAttachmentExpired error : ', err);
            throw err;
          },
        );
    } else {
      console.log('image cannot found');
    }
  }
  async imageUpload(
    audience: IAudienceWithCustomer,
    files: FileList,
    id: number,
    userSender: {
      user_id: number;
      user_name: string;
    },
    selectImages?: HTMLInputElement,
  ) {
    this.isOnSendingImage = true;
    this.uploadDestroy$ = new Subject();
    const image$ = await this.fileUploadService.handleImageUpload(audience, files, id, userSender);
    image$.pipe(takeUntil(this.uploadDestroy$)).subscribe({
      error: (error) => {
        this.isOnSendingImage = false;
        throw Error(error);
      },
      complete: () => {
        this.isOnSendingImage = false;
        if (selectImages) {
          selectImages.value = '';
        }
        this.uploadDestroy$.next(true);
        this.uploadDestroy$.complete();
      },
    });
  }
  async fileUpload(
    audience: IAudienceWithCustomer,
    files: FileList,
    id: number,
    userSender: {
      user_id: number;
      user_name: string;
    },
    selectFile?: HTMLInputElement,
  ) {
    const MAXIMUM_FILESIZE_UPLOAD = environmentLib.MAXIMUM_FILESIZE_UPLOAD;
    if (files[0].size > MAXIMUM_FILESIZE_UPLOAD) {
      // MAXIMUM_FILESIZE_UPLOAD
      this.toastr.error(`Cannot Upload file more than ${MAXIMUM_FILESIZE_UPLOAD / 1000000}MB`);
      if (selectFile) {
        selectFile.value = '';
      }
      return null;
    }
    this.isOnSendingImage = true;
    this.uploadDestroy$ = new Subject();
    const image$ = await this.fileUploadService.handleFileUpload(audience, files, id, userSender);
    image$.pipe(takeUntil(this.uploadDestroy$)).subscribe({
      error: (error) => {
        this.isOnSendingImage = false;
        throw Error(error);
      },
      complete: () => {
        this.isOnSendingImage = false;
        if (selectFile) {
          selectFile.value = '';
        }
        this.uploadDestroy$.next(true);
        this.uploadDestroy$.complete();
      },
    });
  }
}
