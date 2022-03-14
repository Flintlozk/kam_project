import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { ChatboxService } from '@reactor-room/plusmar-front-end-share/services/chatbox.service';
import { AudienceChatResolver, AudienceContactResolver, ChatboxAttachLocation, ChatboxView, IAudience } from '@reactor-room/itopplus-model-lib';
import { Subject, Observable, zip } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-close-lead-info',
  templateUrl: './close-lead-info.component.html',
  encapsulation: ViewEncapsulation.None,
  styleUrls: ['./close-lead-info.component.scss'],
})
export class CloseLeadInfoComponent implements OnInit, OnDestroy {
  chatLoadLocation = ChatboxAttachLocation.LEAD;
  chatViewMode: ChatboxView = ChatboxView.CLOSED;

  parentRouteResolver$ = this.route.parent.data as Observable<AudienceContactResolver>;
  childRouteResolver$ = this.route.data as Observable<AudienceChatResolver>;

  destroy$: Subject<boolean> = new Subject<boolean>();
  audience: IAudience;

  isMobile = isMobile();
  viewControl = {
    mobileView: this.isMobile,
    contactList: !this.isMobile,
    extraGrid: false,
    chatBoxStatus: false,
    calendar: false,
    privateMessge: false,
    collapseOutlet: false,
  };

  togglePrivateInChat = new Subject<string>();

  constructor(public route: ActivatedRoute, private chatboxService: ChatboxService) {}

  ngOnInit(): void {
    this.watchToggleChatbox();
    this.destroy$ = new Subject<boolean>();
    this.destroy$.subscribe();

    zip(this.parentRouteResolver$, this.childRouteResolver$)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        this.handleData(Object.assign(...val) as AudienceChatResolver);
      });
  }

  handleData({ audience }: AudienceChatResolver): void {
    this.audience = audience;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  watchToggleChatbox(): void {
    this.chatboxService.toggleChatbox.pipe(takeUntil(this.destroy$)).subscribe(() => {
      this.chatBoxStatusEvent();
    });
  }
  chatBoxStatusEvent(): void {
    this.viewControl.chatBoxStatus = !this.viewControl.chatBoxStatus;
  }
}
