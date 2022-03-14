import { Component, ElementRef, EventEmitter, Input, OnInit, Output } from '@angular/core';
declare const gapi;

@Component({
  selector: 'reactor-room-google-login',
  templateUrl: './google-login.component.html',
  styleUrls: ['./google-login.component.scss'],
})
export class GoogleLoginComponent implements OnInit {
  @Input() googleOauthClientId: string;
  @Input() googleAuthScope: string;
  @Input() cookiePolicy: string;
  @Output() callBack = new EventEmitter<IGoogleCredential>();
  auth2: any;
  constructor() {}

  ngOnInit(): void {
    this.googleInit();
  }

  googleInit() {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const scope = this;
    gapi.load('auth2', () => {
      scope.auth2 = gapi.auth2.init({
        client_id: this.googleOauthClientId,
        cookiepolicy: this.cookiePolicy,
        scope: this.googleAuthScope,
      });
    });
  }
  googleAttachSignin(element: ElementRef) {
    this.auth2.attachClickHandler(
      element,
      {},
      (googleUser) => {
        const profile = googleUser.getBasicProfile();
        const credential: IGoogleCredential = {
          ID: profile.getId(),
          name: profile.getName(),
          email: profile.getEmail(),
          accessToken: googleUser.getAuthResponse().id_token,
          gaToken: googleUser.getAuthResponse().access_token,
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
  loginCallBack(credential: IGoogleCredential) {
    this.callBack.emit(credential);
  }
}
export interface IGoogleCredential {
  ID: string;
  name: string;
  email: string;
  accessToken: string;
  gaToken: string;
  profileImg: string;
  route: string;
  expiresAt: string;
}
