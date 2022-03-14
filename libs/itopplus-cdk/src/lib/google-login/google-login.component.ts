import { Component, ElementRef, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { IGoogleCredential } from '@reactor-room/model-lib';
declare const gapi;

@Component({
  selector: 'reactor-room-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.less'],
})
export class GoogleLoginComponent implements OnInit {
  @Input() googleOauthClientId: string;
  @Input() googleAuthScope: string;
  @Input() cookiePolicy: string;
  @Input() styleSelector = 'DEFUALT';
  @Output() callBack = new EventEmitter<IGoogleCredential>();
  @ViewChild('googleBtn', { static: true }) googleBtn: ElementRef;

  auth2: any;

  constructor() {}

  ngOnInit(): void {
    this.googleInit();
  }
  googleInit(): void {
    gapi.load('auth2', () => {
      this.auth2 = gapi.auth2.init({
        client_id: this.googleOauthClientId,
        cookiepolicy: this.cookiePolicy,
        scope: this.googleAuthScope,
        redirect_uri: 'backend',
      });
      this.googleAttachSignin(this.googleBtn.nativeElement);
    });
  }

  googleAttachSignin(element: ElementRef): void {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        const profile = googleUser.getBasicProfile();
        const credential: IGoogleCredential = {
          ID: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          accessToken: googleUser.getAuthResponse().access_token,
          id_token: googleUser.getAuthResponse().id_token,
          profileImg: profile.getImageUrl(),
          route: 'backend',
          expiresAt: String(googleUser.getAuthResponse().expires_at),
        };
        this.loginCallBack(credential);
      },
      (error) => {
        console.error('[Google Login Error]', JSON.stringify(error, undefined, 2));
      },
    );
  }

  loginCallBack(credential: IGoogleCredential): void {
    this.callBack.emit(credential);
  }
}
