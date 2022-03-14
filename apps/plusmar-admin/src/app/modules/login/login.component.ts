import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';

declare const FB;

export interface FacebookCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  profileImg: string;
}
@Component({
  selector: 'admin-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  facebookAppID = environment.facebookAppID as string;
  facebookAppSecret = environment.facebookAppSecret as string;
  facebookLoginScope = environment.facebookLoginScope as string[];

  destroy$: Subject<boolean> = new Subject();

  constructor(public translate: TranslateService, private dialog: MatDialog, private loginService: LoginService, private router: Router) {}
  ngOnInit(): void {
    this.checkLoginStatus();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  checkLoginStatus() {
    // const token = getCookie('access_token');
    // if (token) {
    //   void this.router.navigate(['/manage']);
    // }
  }

  facebookLogin(auth): void {
    try {
      this.loginService
        .logIntoFacebook(this.setCredentials(auth))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result) => {
            setCookie('access_token', result.value, 30);
            void this.router.navigate(['/manage']);
          },
          (err) => {
            if (err.message.indexOf('USER_NOT_FOUND') !== -1) {
              void this.router.navigateByUrl('/register');
            } else if (err.message.indexOf('"email" is required') !== -1) {
              this.openSuccessDialog({ text: this.translate.instant('Email Require Text'), title: this.translate.instant('Email Require Title') }, true);
            } else {
              this.openSuccessDialog({ text: this.translate.instant('Login Error'), title: this.translate.instant('Error') }, true);
            }
          },
        );
    } catch (err) {
      this.openSuccessDialog({ text: this.translate.instant('Login Error'), title: this.translate.instant('Error') }, true);
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

  // googleLoginCallBack(credential: IGoogleCredential): void {
  //   if (window.localStorage) {
  //     this.loginService.loginAuth(credential).subscribe((res) => {
  //       if (res?.status !== 200) {
  //         this.showError();
  //       } else {
  //         localStorage.setItem('access_token', res.value);
  //         localStorage.setItem('expiresAt', res.expiresAt);
  //         void this.ngZone.run(() => this.router.navigateByUrl('/logistics'));
  //       }
  //     });
  //   } else {
  //     this.showError('Google did not send proper response');
  //   }
  // }

  // showError(message = 'Something went wrong, seek for help of website administrator'): void {
  //   this._snackBar.open(message, 'Dismiss', {
  //     duration: 2000,
  //   });
  // }
}
