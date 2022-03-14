import { AfterViewChecked, ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { deleteCookie, getCookie, isMobile, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { TranslateService } from '@ngx-translate/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EnumAuthError } from '@reactor-room/itopplus-model-lib';
declare const FB;
export interface FacebookCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  profileImg: string;
}
@Component({
  selector: 'reactor-room-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, AfterViewChecked {
  facebookAppID = environment.facebookAppID as string;
  facebookAppSecret = environment.facebookAppSecret as string;
  facebookLoginScope = environment.facebookLoginScope as string[];
  initProcessing = false;
  facebookLoginStep: boolean;
  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private loginService: LoginService,
    private changeDetectorRef: ChangeDetectorRef,
    private dialog: MatDialog,
    public translate: TranslateService,
  ) {}

  ngOnInit(): void {
    this.checkLoginStatus();
    this.route.params.subscribe((params) => {
      const ref = params['ref'];
      if (ref) {
        setCookie('referral_code', ref, 30);
      }
    });
  }

  ngAfterViewChecked(): void {
    this.changeDetectorRef.detectChanges();
  }

  checkLoginStatus(): void {
    const token = getCookie('access_token');
    if (token) {
      this.initProcessing = true;
    }
  }

  processCallback(value: boolean): void {
    this.openSuccessDialog({ text: this.translate.instant('Login Error'), title: this.translate.instant('Error') }, true);
    console.error('Process Error');
    this.initProcessing = false;
  }

  facebookLogin(auth): void {
    try {
      this.loginService.logIntoFacebook(this.setCredentials(auth)).subscribe(
        (result) => {
          setCookie('access_token', result.value, 30);
          if (result.status === 203) {
            const isReturn = true;
            const dialogRef = this.openSuccessDialog({ text: 'Please Check Line Official Account connected', title: 'Invalid Token Line Official Account' }, true, isReturn);
            dialogRef.afterClosed().subscribe(() => {
              this.initProcessing = true;
            });
          } else {
            this.initProcessing = true;
          }
        },
        (err) => {
          if (err.message.indexOf('USER_NOT_FOUND') !== -1) {
            void this.router.navigateByUrl('/register');
          } else if (err.message.indexOf(EnumAuthError.SUBSCRIPTION_NOT_FOUND) !== -1) {
            const resultSplit = err.message.split(',');
            const token = resultSplit[resultSplit.length - 1];
            setCookie('access_token', token, 30);
            this.initProcessing = true;
          } else if (err.message.indexOf(EnumAuthError.PAGE_NOT_FOUND) !== -1) {
            const resultSplit = err.message.split(',');
            const token = resultSplit[resultSplit.length - 1];
            setCookie('access_token', token, 30);
            this.initProcessing = true;
          } else if (err.message.indexOf('"email" is required') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Email Require Text'), title: this.translate.instant('Email Require Title') }, true);
            // } else if (err.message.indexOf('AUTHENICATION_FACEBOOK_AUTH_ACCESS_VILOLENT') !== -1) {
            //   this.openSuccessDialog({ text: this.translate.instant('ACCESS_VILOLENT'), title: this.translate.instant('ACCESS_VILOLENT_ERROR') }, true);
          } else {
            this.openSuccessDialog({ text: this.translate.instant('Login Error'), title: this.translate.instant('Error') }, true);
            console.log('-< err >- ', err);
          }
        },
      );
    } catch (err) {
      this.openSuccessDialog({ text: this.translate.instant('Login Error'), title: this.translate.instant('Error') }, true);
      console.log('-< err >- ', err);
    }
  }

  openSuccessDialog(message, isError: boolean, isReturen = false) {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    if (isReturen) {
      return dialogRef;
    } else {
      dialogRef.afterClosed().subscribe(() => {
        const btnFacebookLogin = document.getElementById('btnFacebookLogin') as HTMLElement;
        btnFacebookLogin.classList.remove('disabled');
      });
    }
  }

  setCredentials(auth): FacebookCredential {
    const { ID, name, email, accessToken, profileImg } = auth;
    return { ID, name, email, accessToken, profileImg };
  }
}
