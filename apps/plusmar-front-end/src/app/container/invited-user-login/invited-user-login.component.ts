import { AfterViewChecked, ChangeDetectorRef, Component, OnDestroy, OnInit } from '@angular/core';
import { SuccessDialogComponent, SuccessDialogWithLinkComponent } from '@reactor-room/itopplus-cdk';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { deleteCookie, getCookie, isMobile, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { environment } from '../../../environments/environment';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { InvitedUserLoginService } from './invited-user-login.service';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { EnumAuthError, EnumInvitedUserError, IUserAndPageFromToken } from '@reactor-room/itopplus-model-lib';
import { TranslateService } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { takeUntil, finalize } from 'rxjs/operators';
import { InviteLinkTroubleshootComponent } from '../invite-link-troubleshoot/invite-link-troubleshoot.component';

declare const FB;

export interface FacebookCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  profileImg: string;
}

@Component({
  selector: 'reactor-room-invited-user-login',
  templateUrl: './invited-user-login.component.html',
  styleUrls: ['./invited-user-login.component.scss'],
})
export class InvitedUserLoginComponent implements OnInit, AfterViewChecked, OnDestroy {
  facebookAppID = environment.facebookAppID as string;
  facebookAppSecret = environment.facebookAppSecret as string;
  facebookLoginScope = environment.facebookLoginScope as string[];
  facebookLoginStep: boolean;
  loginEmail: string;
  initTo: string;
  isAlreadyLogin = false as boolean;
  isEmailCorrect = true as boolean;

  constructor(
    private loginService: InvitedUserLoginService,
    private userService: UserService,
    private pagesService: PagesService,
    private changeDetectorRef: ChangeDetectorRef,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    public translate: TranslateService,
    private router: Router,
  ) {}

  token: string;
  sender: string;
  destroy$: Subject<boolean> = new Subject<boolean>();
  userAndPageInfo: IUserAndPageFromToken;

  isAlreadyMember = false;
  isHaveEmail = true;
  isError = false;
  initProcessing = false;

  ngOnInit(): void {
    this.route.params.subscribe((params) => {
      this.token = params['token'];
    });
    this.checkIsAlreadyLogin();
    this.getUserFromToken();
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  checkIsAlreadyLogin(): void {
    const accessToken = getCookie('access_token');
    if (accessToken) this.isAlreadyLogin = true;
  }

  getUserFromToken(): void {
    this.userService
      .getUserAndPageFromInviteToken(this.token)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.checkLoginAndMemberShipStatus();
        }),
      )
      .subscribe(
        (result) => {
          this.userAndPageInfo = result;
        },
        (err) => {
          if (err.message.indexOf(EnumInvitedUserError.INVITE_ALREADY_ACCEPT) !== -1) {
            this.isAlreadyMember = true;
          } else if (err.message.indexOf(EnumInvitedUserError.NO_PAGE_MEMBER_TOKEN_FOUND) !== -1) {
            this.openDialog(
              {
                text: this.translate.instant('Invitation Removed'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          } else {
            this.openDialog(
              {
                text: this.translate.instant('Something Went Wrong When Verify Invitation'),
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.error('getUserFromToken err:', err.message);
          }
        },
      );
  }

  checkLoginAndMemberShipStatus(): void {
    if (this.isAlreadyLogin && !this.isAlreadyMember && !this.isError) {
      this.userService
        .getLoginUserDetailsFromFB()
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (res) => {
            this.loginEmail = res.email;
            if (!this.userAndPageInfo) {
            } else if (res.email !== this.userAndPageInfo.email) {
              this.openDialogWithLink(true);
              this.isEmailCorrect = false;
            } else {
              this.initProcessing = true;
              this.initTo = 'LOGIN_INVITE';
            }
          },
          (err) => {
            if (err.message.indexOf(EnumAuthError.INACTIVE_USER) !== -1) {
              this.initTo = 'LOGIN_INVITE';
              this.initProcessing = true;
            } else if (err.message.indexOf('NO_DATA_FROM_RADIS_KEY') !== -1) {
              deleteCookie('access_token');
              this.openDialog(
                {
                  text: this.translate.instant('Error Verify Account'),
                  title: this.translate.instant('Error'),
                },
                true,
              );
            } else {
              this.openDialog(
                {
                  text: `${this.translate.instant('Something Went Wrong When Verify Membership')}"${this.userAndPageInfo.pageName}",  ${this.translate.instant(
                    'Please Contact Admin',
                  )}`,
                  title: this.translate.instant('Error'),
                },
                true,
              );
            }
            console.error(err.message);
          },
        );
    } else if (this.isAlreadyLogin && this.isAlreadyMember && !this.isError) {
      this.initProcessing = true;
      this.initTo = 'TO_DASHBOARD';
    } else {
      console.log('<< not login , not member >>');
    }
  }

  processCallback(value: boolean): void {
    if (this.isAlreadyLogin) {
      window.location.href = 'dashboard';
    } else {
      this.initProcessing = false;
    }
  }

  facebookLogin(auth): void {
    if (this.isAlreadyMember && auth.email) {
      this.setLogin(auth);
    } else if (!auth.email) {
      this.openDialog(
        {
          text: this.translate.instant('Email Require Text'),
          title: this.translate.instant('Email Require Title'),
        },
        true,
      );
      this.isError = true;
      this.isHaveEmail = false;
    } else if (!this.userAndPageInfo) {
      this.openDialog(
        {
          text: this.translate.instant('Invitation Removed'),
          title: this.translate.instant('Error'),
        },
        true,
      );
    } else if (auth.email !== this.userAndPageInfo.email) {
      this.openDialog(
        {
          text: `
            ${this.translate.instant('Invited')} ${this.userAndPageInfo.email} <br/>
            ${this.translate.instant('Login email')} ${auth.email}
          `,
          title: `${this.translate.instant('Email Incorrect')} ${this.translate.instant('Not Match')}`,
        },
        true,
      );
      this.isEmailCorrect = false;
      this.isHaveEmail = true;
      this.loginEmail = auth.email;
    } else {
      this.getPageFromFacebookCredentailAndPageID(auth);
    }
  }

  getPageFromFacebookCredentailAndPageID(auth): void {
    this.pagesService
      .getPageFromFacebookCredentailAndPageID(this.setCredentials(auth), this.userAndPageInfo.pageID)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.setLogin(auth);
        },
        (err) => {
          console.log('getPageFromFacebookCredentailAndPageID error : ', err);
          if (err.message.indexOf(EnumAuthError.FB_PAGE_NOT_FOUND) !== -1) {
            this.openDialogRetuned(
              {
                text: `${this.translate.instant('Cant Verify Membership')}"${this.userAndPageInfo.pageName}", ${this.translate.instant('Check If You A Member Of Fb Page')}`,
                title: this.translate.instant('Error'),
                buttonErrorText: 'Troubleshooting',
              },
              true,
            )
              .afterClosed()
              .subscribe(() => {
                this.openLinkTroubleshoot();
                const btnFacebookLogin = document.getElementById('btnFacebookLogin') as HTMLElement;
                btnFacebookLogin.classList.remove('disabled');
              });
          } else {
            this.openDialog(
              {
                text: `${this.translate.instant('Something Went Wrong When Verify Membership')}"${this.userAndPageInfo.pageName}",  ${this.translate.instant(
                  'Please Contact Admin',
                )}`,
                title: this.translate.instant('Error'),
              },
              true,
            );
            console.error(err.message);
          }
        },
      );
  }

  setLogin(auth): void {
    this.loginService
      .logIntoFacebook(this.setCredentials(auth))
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          setCookie('access_token', result.value, 30);
          this.isAlreadyLogin = true;
          this.checkLoginAndMemberShipStatus();
        },
        (err) => {
          if (err.message.indexOf('"email" is required') !== -1) {
            this.openDialog(
              {
                text: this.translate.instant('Email Require Text'),
                title: this.translate.instant('Email Require Title'),
              },
              true,
            );
          } else {
            this.openDialog(
              {
                text: this.translate.instant('Something Went Wrong When Verify Account'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          }
          console.error(err.message);
        },
      );
  }

  setCredentials(auth): FacebookCredential {
    return {
      ID: auth.ID,
      name: auth.name,
      email: auth.email,
      accessToken: auth.accessToken,
      profileImg: auth.profileImg,
    };
  }

  openDialog(message, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
    dialogRef.componentInstance.buttonText = message.buttonText || 'Close';
    dialogRef.componentInstance.buttonErrorText = message.buttonErrorText || 'Close';

    dialogRef.afterClosed().subscribe(() => {
      if (this.isAlreadyLogin) {
        this.initProcessing = true;
        this.initTo = 'TO_DASHBOARD';
      }
      const btnFacebookLogin = document.getElementById('btnFacebookLogin') as HTMLElement;
      btnFacebookLogin.classList.remove('disabled');
    });
  }
  openDialogRetuned(message, isError: boolean): MatDialogRef<SuccessDialogComponent> {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
    dialogRef.componentInstance.buttonText = message.buttonText || 'Close';
    dialogRef.componentInstance.buttonErrorText = message.buttonErrorText || 'Close';
    return dialogRef;
    // dialogRef.afterClosed().subscribe(() => {
    //   if (this.isAlreadyLogin) {
    //     this.initProcessing = true;
    //     this.initTo = 'TO_DASHBOARD';
    //   }
    //   const btnFacebookLogin = document.getElementById('btnFacebookLogin') as HTMLElement;
    //   btnFacebookLogin.classList.remove('disabled');
    // });
  }

  openDialogWithLink(isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogWithLinkComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = {
      target: '_blank',
      linkUrl: '/manual/change-primary-email-info',
      info: this.translate.instant('How To Change Primary Email'),
      text: `
      ${this.translate.instant('Invited')} ${this.userAndPageInfo.email} <br/>
      ${this.translate.instant('Login email')} ${this.loginEmail}
    `,
      title: `${this.translate.instant('Email Incorrect')} ${this.translate.instant('Not Match')}`,
    };
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      if (this.isAlreadyLogin) {
        this.initProcessing = true;
        this.initTo = 'TO_DASHBOARD';
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  openLinkTroubleshoot(): void {
    const dialogRef = this.dialog.open(InviteLinkTroubleshootComponent, {
      width: '90%',
    });
  }
}
