import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { EnumAuthError, EnumInvitedUserError, IUserAndPageFromToken } from '@reactor-room/itopplus-model-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { EMPTY, of, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

export enum ENUM {
  INVITE = 'LOGIN_INVITE',
  BACK = 'TO_LOGIN_INVITE',
  DASHBOARD = 'TO_DASHBOARD',
}

@Component({
  selector: 'reactor-room-process-request',
  templateUrl: './process-request.component.html',
  styleUrls: ['./process-request.component.scss'],
})
export class ProcessRequestComponent implements OnInit, OnDestroy {
  destroy$ = new Subject<boolean>();
  @Input() setInitTo: ENUM;
  @Input() userAndPageInfo: IUserAndPageFromToken;
  @Input() token: string;

  @Output() errorEvent = new EventEmitter<boolean>();
  constructor(private pagesService: PagesService, private subscriptionService: SubscriptionService, private dialog: MatDialog, public translate: TranslateService) {}

  ngOnInit(): void {
    switch (this.setInitTo) {
      case ENUM.INVITE: {
        this.initializeLoginFlow();
        break;
      }
      case ENUM.DASHBOARD: {
        window.location.href = environment.DEFAULT_ROUTE;
        break;
      }
      default: {
        this.backToLoginInviteFlow();
      }
    }
  }

  initializeLoginFlow() {
    if (!this.token) {
      this.errorEvent.emit(true);
    }
    this.updateInvitePageMember();
  }

  updateInvitePageMember(): void {
    this.pagesService
      .getPageFromFacebookByPageID(this.userAndPageInfo.pageID)
      .pipe(
        takeUntil(this.destroy$),
        switchMap(() => this.subscriptionService.updateInvitedMemberSubscriptionMapping(this.token)),
        catchError((err) => {
          if (err.message.indexOf(EnumAuthError.FB_PAGE_NOT_FOUND) !== -1) {
            this.openSuccessDialog(
              {
                text: `${this.translate.instant('Something Went Wrong When Verify Membership')}"${this.userAndPageInfo.pageName}",  ${this.translate.instant(
                  'Please Contact Admin',
                )}`,
                title: this.translate.instant('Error'),
              },
              true,
            );
          } else if (err.message.indexOf(EnumAuthError.INACTIVE_USER) !== -1) {
            window.location.href = `register/${this.token}`;
          } else if (err.message.indexOf(EnumAuthError.ALREADY_MEMBER_OTHER_EMAIL) !== -1) {
            window.location.href = `${environment.DEFAULT_ROUTE}?err=${EnumAuthError.ALREADY_MEMBER_OTHER_EMAIL}`;
          } else {
            console.log('Process request err: ', err);
            this.openSuccessDialog(
              {
                text: `${this.translate.instant('Something Went Wrong When Verify Membership')}"${this.userAndPageInfo.pageName}",  ${this.translate.instant(
                  'Please Contact Admin',
                )}`,
                title: this.translate.instant('Error'),
              },
              true,
            );
          }
          return EMPTY;
        }),
      )
      .subscribe(
        () => {
          window.location.href = environment.DEFAULT_ROUTE;
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.INVALID_TOKEN) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Invitation Removed'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumInvitedUserError.EMAIL_DIFFEREN) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Invited Email And Login Email Not Match'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumInvitedUserError.NO_INVITE_SUBSCRIPTION_FOUND) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Cant Find Your Invitaion Page'), title: this.translate.instant('Error') }, true);
          } else {
            this.openSuccessDialog({ text: this.translate.instant('Something went wrong'), title: 'Error !' }, true);
          }
        },
      );
  }

  openSuccessDialog(message, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      this.errorEvent.emit(true);
    });
  }

  backToLoginInviteFlow(): void {
    window.location.href = `invite/${this.token}`;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
