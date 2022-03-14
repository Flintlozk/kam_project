/* eslint-disable @typescript-eslint/no-floating-promises */
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { getCookie } from '@reactor-room/itopplus-front-end-helpers';
import { FacebookService, InitParams } from '@reactor-room/itopplus-front-end-helpers/ngx-facebook';
@Component({
  selector: 'reactor-room-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.less'],
})
export class FacebookLoginComponent implements OnInit {
  @Input() appID: string;
  @Input() facebookScope: string[];
  @Output() response = new EventEmitter();

  constructor(private FB: FacebookService) {}

  async ngOnInit(): Promise<void> {
    const initParams: InitParams = {
      appId: this.appID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v8.0',
      status: true,
    };

    await this.FB.init(initParams);
  }

  async checkFacebookLoginStatus(): Promise<void> {
    await this.FB.getLoginStatus().then((response) => {
      const token = getCookie('access_token');
      if (response.status === 'connected' && token !== '') {
        this.facebookGetGraphApiData(response);
      } else {
        const btnFacebookLogin = document.getElementById('btnFacebookLogin') as HTMLElement;
        btnFacebookLogin.classList.add('disabled');
        this.facebookLogin();
      }
    });
  }

  facebookLogin(): void {
    this.FB.login({
      scope: this.facebookScope.join(','),
      enable_profile_selector: true,
      return_scopes: true,
      // auth_type: 'reauthenticate',
    })
      .then((loginResponse) => {
        this.facebookGetGraphApiData(loginResponse);
      })
      .catch((errResponse) => {
        console.error('[Facebook Login Error]', errResponse);
        const btnFacebookLogin = document.getElementById('btnFacebookLogin') as HTMLElement;
        btnFacebookLogin.classList.remove('disabled');
      });
  }

  facebookGetGraphApiData(response): void {
    this.FB.api(`/${response.authResponse.userID}?fields=id,name,email,picture`).then((credential) => {
      const params = {
        ID: credential.id,
        name: credential.name,
        email: credential.email,
        accessToken: response.authResponse.accessToken,
        profileImg: credential.picture.data.url,
      };
      this.response.emit(params);
    });
  }
}
