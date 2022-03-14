import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RegisterService } from '@plusmar-front/services/register/register.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { deleteCookie, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { EnumAuthError, EnumInvitedUserError, IUserCredential } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';

export enum ENUM {
  PHONE = 'PHONE',
  OTP = 'OTP',
  SUCCESS = 'SUCCESS',
}
@Component({
  selector: 'reactor-room-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class RegisterComponent implements OnInit, OnDestroy {
  destroy$: Subject<boolean> = new Subject<boolean>();
  state: ENUM = ENUM.PHONE;
  token;
  phoneNumber = '';

  isLoading = false;
  constructor(
    private dialog: MatDialog,
    public translate: TranslateService,
    private route: ActivatedRoute,
    private registerService: RegisterService,
    private userService: UserService,
    private subscriptionService: SubscriptionService,
  ) {}

  ngOnInit(): void {
    this.isLoading = true;
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
    this.userService
      .getUserCredential()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (user: IUserCredential) => {
          if (user.tel.length > 0) window.location.href = 'dashboard';
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.INVALID_TOKEN) !== -1) {
            deleteCookie('access_token');
            location.href = '/login';
          } else {
            console.log('err', err);
            location.href = '/login';
          }
        },
        () => (this.isLoading = false),
      );
  }

  submitPhoneNumber(phoneNumber: string): void {
    this.isLoading = true;
    this.phoneNumber = phoneNumber;
    this.requestOTP(phoneNumber);
  }

  backToPhoneNumberForm(isBack): void {
    this.phoneNumber = '';
    this.state = ENUM.PHONE;
  }

  resend(event): void {
    this.requestOTP(this.phoneNumber);
  }

  validatingOTP(result): void {
    this.isLoading = !this.isLoading;
    if (result) {
      this.state = ENUM.SUCCESS;
      if (this.token) {
        this.updateInvitedMember();
      }
      this.isLoading = false;
    }
  }

  requestOTP(phoneNumber: string): void {
    this.isLoading = true;
    this.registerService
      .sendOTP(phoneNumber)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(
        () => {
          if ((this.state = ENUM.PHONE)) {
            this.state = ENUM.OTP;
          } else {
            this.openSuccessDialog({ text: this.translate.instant('Resend OTP success'), title: this.translate.instant('Success') }, false);
          }
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.REQUEST_OTP_FAILED) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Send OTP failed'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumAuthError.INVALID_TOKEN) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Invalid token'), title: this.translate.instant('Error') }, true);
          } else {
            console.log('err: ', err);
            this.openSuccessDialog({ text: this.translate.instant('Send OTP failed'), title: this.translate.instant('Error') }, true);
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
  }

  next(): void {
    window.location.href = 'dashboard';
  }

  updateInvitedMember(): void {
    this.subscriptionService
      .updateInvitedMemberSubscriptionMapping(this.token)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
        }),
      )
      .subscribe(
        () => {},
        (err) => {
          if (err.message.indexOf(EnumAuthError.INVALID_TOKEN) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Invitation Removed'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumInvitedUserError.EMAIL_DIFFEREN) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Invited Email And Login Email Not Match'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumInvitedUserError.NO_INVITE_SUBSCRIPTION_FOUND) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Cant Find Your Invitaion Page"'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf(EnumInvitedUserError.ALREADY_MEMBER_WITH_OTHER_EMAIL) !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Invited Email And Login Email Not Match'), title: this.translate.instant('Error') }, true);
          } else {
            console.log('err: ', err);
            this.openSuccessDialog({ text: this.translate.instant('Something went wrong"'), title: this.translate.instant('Error') }, true);
          }
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
