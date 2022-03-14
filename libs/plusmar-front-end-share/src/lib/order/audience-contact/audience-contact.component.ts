import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { slideInOutAnimation } from '@reactor-room/plusmar-front-end-share/animation';
import { ChatboxComponent } from '@reactor-room/plusmar-front-end-share/components/chatbox/chatbox.component';
import { NotifyParentService } from '@reactor-room/plusmar-front-end-share/order/audience/notify-parent.service';
import { AudienceContactService } from '@reactor-room/plusmar-front-end-share/services/audience-contact/audience-contact.service';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { PostService } from '@reactor-room/plusmar-front-end-share/services/facebook/post/post.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { PurchaseOrderService } from '@reactor-room/plusmar-front-end-share/services/purchase-order/purchase-order.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import {
  AudienceChatResolver,
  AudienceContactPath,
  AudienceDomainStatus,
  AudienceDomainType,
  AudienceViewType,
  ChatboxView,
  EPageMessageTrackMode,
  IAudience,
  IAudienceWithCustomer,
  IComment,
  IPageMessageTrackMode,
  PageSettingType,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-audience-contact',
  templateUrl: './audience-contact.component.html',
  styleUrls: ['./audience-contact.component.scss'],
  encapsulation: ViewEncapsulation.None,
  animations: [slideInOutAnimation],
})
export class AudienceContactComponent implements OnInit, OnDestroy, AfterViewInit {
  changingAudience: Subject<number> = new Subject<number>();
  @ViewChild('chatbox', { static: false }) chatbox: ChatboxComponent;
  audienceID: number;
  commentID: string;
  audience: IAudienceWithCustomer;
  routeResolver$ = this.route.data as Observable<AudienceChatResolver>;
  routeType: AudienceViewType;
  destroy$ = new Subject();
  togglePrivateInChat = new Subject<string>();
  chatViewMode: ChatboxView = ChatboxView.AUDIENCE;
  isMobile = isMobile();
  @ViewChild('thirdDiv', { static: true }) thirdDiv: ElementRef;

  message: string;

  viewControl = {
    mobileView: this.isMobile,
    contactList: !this.isMobile,
    extraGrid: false,
    chatBoxStatus: false,
    calendar: false,
    privateMessge: false,
    collapseOutlet: false,
  };
  mainTabName = '';
  currentPath = '';
  tabIndex;

  messageTrackMode: EPageMessageTrackMode;
  EPageMessageTrackMode = EPageMessageTrackMode;
  agentToken = '';
  thirdDivContainer: HTMLElement;

  toggleLoader = false;

  constructor(
    private postService: PostService,
    public notifyParent: NotifyParentService,
    private route: ActivatedRoute,
    public chatboxService: ChatboxService,
    public layoutCommonService: LayoutCommonService,
    public purchaseOrderService: PurchaseOrderService,
    private cd: ChangeDetectorRef,
    private audienceContactService: AudienceContactService,
    private settingService: SettingsService,
  ) {}

  /* Grid Controller */
  toggleGrid(): void {
    this.viewControl.extraGrid = !this.viewControl.extraGrid;
  }

  chatBoxStatusEvent(): void {
    this.viewControl.chatBoxStatus = !this.viewControl.chatBoxStatus;
  }
  toggleCollapseOutlet(): void {
    this.viewControl.collapseOutlet = !this.viewControl.collapseOutlet;
  }
  /* Grid Controller */

  // Component Life Cycle Section : Start
  ngOnInit(): void {
    this.getSettingMessageTrackMode();
    this.toggleLoaderSubject();
    this.handleTabChangeSubject();
    this.layoutCommonService.setMenuStatus(false);
    this.routeResolver$.pipe(takeUntil(this.destroy$)).subscribe((resolved) => {
      this.resetViewSetting();
      this.routeResolveHandler({ ...resolved });
    });
    this.theWatcher();
  }

  ngAfterViewInit(): void {
    this.cd.detectChanges();
    this.thirdDivContainer = this.thirdDiv.nativeElement;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
  // Component Life Cycle Section : End

  toggleLoaderSubject(): void {
    this.audienceContactService.toggleAudienceContactUILoader.pipe(takeUntil(this.destroy$)).subscribe(({ toggle, caller }) => {
      this.toggleLoader = toggle;
    });
  }

  onChangingAudience(audienceID: number): void {
    this.changingAudience.next(audienceID);
  }

  /* Tab Changing */
  handleTabChange(index: number): void {
    this.tabIndex = index;
  }

  handleTabChangeSubject(): void {
    this.audienceContactService.audienceContactTabChanges.pipe(takeUntil(this.destroy$)).subscribe((tab: number) => {
      this.handleTabChange(tab);
    });
  }

  namedFirstTab(): void {
    switch (this.currentPath) {
      case AudienceContactPath.CART:
        this.mainTabName = 'Order';
        break;
      case AudienceContactPath.LEAD:
      case AudienceContactPath.FORM:
      default:
        this.mainTabName = 'Information';
        break;
    }
  }

  theWatcher(): void {
    this.watchOrder();
    this.watchToggleChatbox();
    this.watchSwitchChatboxView();
  }

  resetViewSetting(): void {
    this.viewControl = {
      mobileView: this.isMobile,
      contactList: !this.isMobile,
      extraGrid: false,
      chatBoxStatus: false,
      calendar: false,
      privateMessge: false,
      collapseOutlet: this.viewControl.collapseOutlet,
    };
  }

  routeResolveHandler({ audience, route, token }: AudienceChatResolver): void {
    // * route resolver wrapper
    this.agentToken = token;
    const path = this.route.snapshot?.children[0]?.routeConfig?.path;
    this.currentPath = AudienceContactPath[path]; // ? Determine path for component functional
    this.viewControl.calendar = false;

    this.updateAudienceState(audience, route);
  }

  updateAudienceState(audience: IAudienceWithCustomer, route: AudienceViewType): void {
    this.audience = audience;

    this.chatboxViewConditionOnAudienceStatus(audience);
    this.audienceID = this.audience?.id;

    if (this.currentPath === AudienceContactPath.POST) {
      this.checkPostExist();
    } else {
      if (this.currentPath === AudienceContactPath.LEAD) {
        this.tabIndex = 3;
      } else {
        this.tabIndex = 0;
      }

      if (this.currentPath === AudienceContactPath.FORM) {
        if (isMobile()) {
          this.chatboxService.toggleChatbox.next(true);
          this.chatboxService.deactivateMobileChatboxAction.next(true);
        }
      }
    }

    if (this.chatbox) {
      this.chatbox.isSuggestionsShown = false;
    }
    this.routeType = route;
    this.namedFirstTab();
  }

  checkPostExist(): void {
    this.postService.getPosts(this.audienceID).subscribe((posts) => {
      if (!posts.length) {
        this.tabIndex = 1;
      } else {
        this.tabIndex = 0;
      }
    });
  }

  chatboxViewConditionOnAudienceStatus(audience: IAudience): void {
    switch (audience.status) {
      case AudienceDomainStatus.REJECT:
      case AudienceDomainStatus.EXPIRED:
      case AudienceDomainStatus.CLOSED:
        // this.onDoCheckAskToCreateNewAudience(audience);
        break;
      default:
        this.chatboxViewConditionOnAudienceDomain(audience);
        break;
    }
  }

  chatboxViewConditionOnAudienceDomain(audience: IAudience): void {
    switch (audience.domain) {
      case AudienceDomainType.CUSTOMER:
        this.chatViewMode = ChatboxView.ORDER;
        break;
      default:
        this.chatViewMode = ChatboxView.AUDIENCE;
        break;
    }
  }

  assignMessage(e): string {
    if (e.text) return e.text;
    if (e.attachments[0]?.payload?.sticker_id === 369239263222822) return '👍';
    if (e.attachments[0]?.type === 'image') return e.attachments[0].payload.url;
    if (e.attachments[0]?.title && e.attachments[0]?.url) return `${e.attachments[0].title}\nApplication: ${e.attachments[0].url}`;
    return '';
  }

  watchOrder(): void {
    this.purchaseOrderService.toggleOrderDetail.pipe(takeUntil(this.destroy$)).subscribe((toggle: boolean) => {
      if (this.audience.domain === AudienceDomainType.CUSTOMER) {
        this.viewControl.extraGrid = toggle;
      } else {
        this.viewControl.extraGrid = false;
      }
    });
  }

  watchToggleChatbox(): void {
    this.chatboxService.toggleChatbox.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.chatBoxStatusEvent();
    });
  }
  watchSwitchChatboxView(): void {
    this.chatboxService.switchChatboxView.pipe(takeUntil(this.destroy$)).subscribe((value: ChatboxView) => {
      this.chatViewMode = value;
    });
  }

  openCalendarSidebar(e): void {
    this.message = this.assignMessage(e);
    if (this.viewControl.privateMessge) this.viewControl.privateMessge = false;
    this.viewControl.calendar = !this.viewControl.calendar;
    if (this.isMobile) this.chatBoxStatusEvent();
  }

  closeCalendar(): void {
    this.viewControl.calendar = false;
    if (this.isMobile) this.chatBoxStatusEvent();
  }

  openPrivateMessage(comment: IComment): void {
    this.togglePrivateInChat.next(comment.commentID);
  }

  closePrivateMessage(): void {
    this.viewControl.privateMessge = false;
    if (this.isMobile) this.chatBoxStatusEvent();
  }

  getSettingMessageTrackMode(): void {
    this.settingService
      .getPageSetting(PageSettingType.MESSAGE_TRACK)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const configs = <IPageMessageTrackMode>val.options;
          if (configs?.trackMode) {
            this.messageTrackMode = configs?.trackMode;
          }
        }
      });
  }

  onUpdateAssigneeSubmit(event: { assigneeID: number }): void {
    this.audience.assigneeID = event.assigneeID === -1 ? null : event.assigneeID;
  }
}
