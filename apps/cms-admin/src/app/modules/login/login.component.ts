import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { LoginService } from './login.service';
import { IFacebookCredential } from '@reactor-room/model-lib';

declare const FB: any;

@Component({
  selector: 'reactor-room-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
})
export class LoginComponent implements OnInit, OnDestroy {
  facebookAppID = environment.facebookAppID as string;
  facebookLoginScope = environment.facebookLoginScope as string[];

  destroy$: Subject<boolean> = new Subject();

  constructor(private loginService: LoginService, private router: Router) {}
  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  facebookLogin(auth): void {
    try {
      this.loginService
        .facebookLoginAuth(this.setCredentials(auth))
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          async (result) => {
            setCookie('access_token', result.value, 30);
            await this.router.navigate(['/layout']);
          },
          (err) => {
            console.log(err);
          },
        );
    } catch (err) {
      throw new Error(err);
    }
  }

  setCredentials(auth): IFacebookCredential {
    const { ID, name, email, accessToken, profileImg } = auth;
    return { ID, name, email, accessToken, profileImg };
  }
}
