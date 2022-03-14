import { animate, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { HistoryDialogComponent } from '@reactor-room/plusmar-front-end-share/audience/components/audience-history-dialog/history-dialog/history-dialog.component';
import { isMobile, parseUTCToTimestamp } from '@reactor-room/itopplus-front-end-helpers';
import {
  AudienceDomainStatus,
  AudienceDomainType,
  EnumPurchaseOrderStatus,
  IComment,
  IFacebookMessagePayloadTypeEnum,
  IMessageModel,
  INotification,
  LeadsFilters,
  NotificationStatus,
  TypeMessage,
} from '@reactor-room/itopplus-model-lib';
import { Observable, Subject } from 'rxjs';
import { debounceTime, map, takeUntil } from 'rxjs/operators';
import { NotificationService } from '@reactor-room/plusmar-front-end-share/services/notification/notification.service';
import { isEmpty } from 'lodash';

enum TypeFetchNoti {
  SCROLL = 'SCROLL',
  DIRECT = 'DIRECT',
}

@Component({
  selector: 'reactor-room-notification-inbox',
  templateUrl: './notification-inbox.component.html',
  styleUrls: ['./notification-inbox.component.scss'],
  animations: [trigger('fadeInNotification', [transition('void => *', [style({ opacity: 0 }), animate(500, style({ opacity: 1 }))])])],
})
export class NotificationInboxComponent implements OnInit, OnDestroy {
  notificationInboxToogleStatus = false;
  iconInboxNoti = '/assets/img/menu/icon_noti_inbox.svg';
  notificationList = [] as INotification[];
  notificationList$: Observable<INotification[]>;
  tableFilters: LeadsFilters = {
    search: '',
    domain: [] as AudienceDomainType[],
    status: null,
    currentPage: 1,
    pageSize: 10, // 10
    orderBy: ['au.last_platform_activity_date'],
    orderMethod: 'desc',
    isNotify: true,
  };
  unreadMessage = 0;
  prefixComment = '';
  typeFecthNotifyData = TypeFetchNoti;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isMobile: boolean;
  notifyStatus = NotificationStatus;
  defautlDocumentTitle = document?.title;

  countNotificationEmitter: Subject<{ refetch: boolean }> = new Subject<{ refetch: boolean }>();
  constructor(private router: Router, private notificationService: NotificationService, public translate: TranslateService, private historyDialog: MatDialog) {}

  ngOnInit(): void {
    this.getCountNotificationInbox();
    this.countNotificationEmitter.next({ refetch: true });

    this.countNotificationSubscription();
    this.isMobile = isMobile();
    this.watchOnRead();
  }
  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  countNotificationSubscription(): void {
    this.notificationService
      .countNotificationSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.countNotificationEmitter.next({ refetch: true });
        },
        (err) => {},
      );
  }

  watchOnRead(): void {
    this.notificationService.forceUpdate.pipe(takeUntil(this.destroy$)).subscribe((yes) => {
      if (yes) {
        this.countNotificationEmitter.next({ refetch: true });
      }
    });
  }

  getCountNotificationInbox(): void {
    this.countNotificationEmitter.pipe(debounceTime(500), takeUntil(this.destroy$)).subscribe(({ refetch }) => {
      this.notificationService
        .getCountNotificationInbox(this.tableFilters, refetch)
        .pipe(takeUntil(this.destroy$))
        .subscribe((notificationList) => {
          if (notificationList) {
            this.unreadMessage = notificationList.total;
            if (this.unreadMessage > 0) {
              document.title = `(${notificationList.total}) ${this.defautlDocumentTitle}`;
            } else {
              document.title = this.defautlDocumentTitle;
            }
          }
        });
    });
  }

  markAllNotificationAsRead(): void {
    this.notificationService
      .markAllNotificationAsRead()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.getNotificationInbox(this.typeFecthNotifyData.DIRECT);
      });
  }

  getNotificationInbox(typeFecth: TypeFetchNoti): void {
    if (typeFecth === TypeFetchNoti.DIRECT) {
      this.tableFilters.pageSize = this.tableFilters.currentPage * this.tableFilters.pageSize;
      this.tableFilters.currentPage = 1;
      this.notificationList = [] as INotification[];
    } else {
      this.tableFilters.currentPage = this.tableFilters.pageSize > 10 ? this.tableFilters.pageSize / 10 : this.tableFilters.currentPage;
      this.tableFilters.pageSize = 10;
    }
    this.countNotificationEmitter.next({ refetch: false });

    this.notificationList$ = this.notificationService.getNotificationInbox(this.tableFilters);
    this.notificationList$
      .pipe(
        map((notificationList) => {
          notificationList.map((noti) => this.displayMessageText(noti));
          return notificationList;
        }),
      )
      .subscribe((notificationList) => {
        if (notificationList) {
          this.notificationList = this.notificationList.concat(notificationList);
        }
      });
  }

  notificationToggle(typeFecth: TypeFetchNoti): void {
    this.notificationInboxToogleStatus = this.notificationInboxToogleStatus ? false : true;
    this.iconInboxNoti = this.notificationInboxToogleStatus ? '/assets/img/menu/icon_noti_inbox-active.svg' : '/assets/img/menu/icon_noti_inbox.svg';
    if (this.notificationInboxToogleStatus) this.getNotificationInbox(typeFecth);
  }

  clickOutsideNotifitaionInboxEvent(event: boolean): void {
    if (event) {
      this.notificationInboxToogleStatus = false;
      this.iconInboxNoti = '/assets/img/menu/icon_noti_inbox.svg';
    }
  }

  navigateRoute(noti: INotification): void {
    this.notificationService
      .setStatusNotifyToReadByAudienceID(noti.id, NotificationStatus.READ, noti.platform)
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.countNotificationEmitter.next({ refetch: true });
      });

    switch (noti.status) {
      case AudienceDomainStatus.REJECT: {
        // ? History
        this.showHistoryDetails(noti.id);
        break;
      }
      case AudienceDomainStatus.EXPIRED: {
        // ? History
        this.showHistoryDetails(noti.id);

        break;
      }
      default: {
        switch (noti.domain) {
          case AudienceDomainType.AUDIENCE: {
            switch (noti.status) {
              case AudienceDomainStatus.INBOX:
                void this.router.navigate([`follows/chat/${noti.id}/post`]);
                break;
              case AudienceDomainStatus.LEAD:
                void this.router.navigate([`/follows/chat/${noti.id}/lead`]);
                break;
              case AudienceDomainStatus.FOLLOW:
                void this.router.navigate([`/follows/chat/${noti.id}/post`]);
                break;
              case AudienceDomainStatus.CLOSED:
                this.showHistoryDetails(noti.id);
                break;
              default:
                void this.router.navigate([`/follows/chat/${noti.id}/post`]);
                break;
            }
            break;
          }
          case AudienceDomainType.CUSTOMER: {
            if (noti.status === AudienceDomainStatus.CLOSED) {
              // ? History
              this.showHistoryDetails(noti.id);
              // ? or Close ?
              // void this.router.navigate([`/order/closesale/${noti.id}`]);
            } else {
              void this.router.navigate([`/order/order-info/${noti.id}/cart`]);
            }
            break;
          }
          case AudienceDomainType.LEADS: {
            if (noti.status === AudienceDomainStatus.FOLLOW) {
              void this.router.navigate([`/follows/chat/${noti.id}/lead`]);
            } else {
              void this.router.navigate([`/leads/closelead/${noti.id}`]);
            }
            break;
          }
        }
        break;
      }
    }
  }

  displayMessageText(notification: INotification): INotification {
    const comment = notification?.latestComment;
    const message = notification?.latestMessage;
    const order = notification?.latestOrderPipeline;
    const sortTarget = [
      { type: TypeMessage.COMMENT, createdAt: comment?.createdAt ? Number(comment?.createdAt) / 1000 : NaN },
      { type: TypeMessage.MESSAGE, createdAt: message?.createdAt ? parseUTCToTimestamp(message?.createdAt) : NaN },
      { type: TypeMessage.ORDER, createdAt: order?.updatedAt ? parseUTCToTimestamp(order?.updatedAt) : NaN },
    ];
    const sortedLatestActivity = sortTarget.filter((item) => !isNaN(item.createdAt)).sort((a, b) => b.createdAt - a.createdAt);
    const _comment = <IComment>comment;
    const _message = <IMessageModel>message;
    if (!isEmpty(sortedLatestActivity)) {
      switch (sortedLatestActivity[0].type) {
        case TypeMessage.COMMENT: {
          notification.type = TypeMessage.COMMENT;
          notification.text = `${_comment.isReply ? this.translate.instant('Replied') : this.translate.instant('Commented')} " ${this.replaceLongText(
            _comment.text,
          )} " ${this.translate.instant('on post')}...`;
          notification.icon =
            notification.notify_status === this.notifyStatus.UNREAD ? '/assets/img/notification/icon_comment-active.svg' : '/assets/img/notification/icon_comment.svg';
          break;
        }
        case TypeMessage.MESSAGE: {
          try {
            if (!isEmpty(_message.attachments)) {
              const parseAttachment = JSON.parse(<string>_message.attachments);
              if (parseAttachment[0].type === IFacebookMessagePayloadTypeEnum.TEMPLATE) {
                notification.type = TypeMessage.ORDER;
                notification.text = `" ${this.replaceLongText(this.translate.instant('has new activity'))} "`;
                notification.icon =
                  notification.notify_status === this.notifyStatus.UNREAD ? '/assets/img/menu/icon_noti_inbox-active.svg' : '/assets/img/menu/icon_noti_inbox.svg';
                break;
              }
            }
            notification.type = TypeMessage.MESSAGE;
            notification.text = `" ${this.replaceLongText(_message.text)} "`;
            notification.icon = notification.notify_status === this.notifyStatus.UNREAD ? '/assets/img/menu/icon_noti_inbox-active.svg' : '/assets/img/menu/icon_noti_inbox.svg';
            break;
          } catch (err) {
            notification.type = TypeMessage.MESSAGE;
            notification.text = `" ${this.replaceLongText(_message.text)} "`;
            notification.icon = notification.notify_status === this.notifyStatus.UNREAD ? '/assets/img/menu/icon_noti_inbox-active.svg' : '/assets/img/menu/icon_noti_inbox.svg';
            break;
          }
        }
        case TypeMessage.ORDER: {
          notification.type = TypeMessage.ORDER;
          notification.icon = notification.notify_status === this.notifyStatus.UNREAD ? '/assets/img/menu/icon_noti_inbox-active.svg' : '/assets/img/menu/icon_noti_inbox.svg';
          if (order.pipeline === EnumPurchaseOrderStatus.CONFIRM_PAYMENT) {
            notification.text = `${this.translate.instant('Orders')}: ${this.translate.instant('Waiting for confirm payment')}`;
          } else if (order.pipeline === EnumPurchaseOrderStatus.WAITING_FOR_SHIPMENT) {
            notification.text = `${this.translate.instant('Orders')}: ${this.translate.instant('Waiting for shipment')}`;
          } else {
            notification.text = `" ${this.replaceLongText(_message.text)} "`;
          }
          break;
        }
      }
      return notification;
    } else {
      notification.type = TypeMessage.MESSAGE;
      notification.text = '';
      notification.icon = notification.notify_status === this.notifyStatus.UNREAD ? '/assets/img/menu/icon_noti_inbox-active.svg' : '/assets/img/menu/icon_noti_inbox.svg';
      return notification;
    }
  }

  replaceLongText(message: string): string {
    const mobileMessageLenght = this.isMobile ? 15 : 30;
    const mobileCommentLenght = this.isMobile ? 5 : 10;
    if (!message) return this.translate.instant('Noti Attachments');
    if (message.length > mobileMessageLenght && this.prefixComment === '') return message.substring(0, mobileMessageLenght) + '...';
    if (message.length > mobileCommentLenght && this.prefixComment !== '') return message.substring(0, mobileCommentLenght) + '...';
    return message;
  }
  // eslint-disable-next-line @typescript-eslint/explicit-module-boundary-types
  onScroll(e): void {
    if (e.target.offsetHeight + e.target.scrollTop >= e.target.scrollHeight) {
      this.tableFilters.currentPage += 1;
      this.getNotificationInbox(TypeFetchNoti.SCROLL);
    }
  }

  trackFn(index: number, el: INotification): number {
    return el.id;
  }

  showHistoryDetails(audienceID: number): boolean {
    if (!audienceID) {
      return false;
    }
    this.openAudienceHistoryDialog(audienceID);
  }

  openAudienceHistoryDialog(audienceID: number): void {
    this.historyDialog.open(HistoryDialogComponent, { data: audienceID });
  }
}
