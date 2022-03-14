import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FacebookService, InitParams, LoginResponse } from '@reactor-room/itopplus-front-end-helpers/ngx-facebook';
@Component({
  selector: 'cms-next-facebook-login',
  templateUrl: './facebook-login.component.html',
  styleUrls: ['./facebook-login.component.scss'],
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
    const response = await this.FB.getLoginStatus();

    if (response.status === 'connected') {
      await this.facebookGetGraphApiData(response);
    } else {
      this.facebookLogin();
    }
  }

  facebookLogin(): void {
    this.FB.login({
      scope: this.facebookScope.join(','),
      enable_profile_selector: true,
      return_scopes: true,
      auth_type: 'reauthenticate',
    })
      .then(async (loginResponse) => {
        await this.facebookGetGraphApiData(loginResponse);
      })
      .catch((errResponse) => {
        console.error('[Facebook Login Error]', errResponse);
      });
  }

  async facebookGetGraphApiData(response: LoginResponse): Promise<void> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const _this = this;
    const credential = await this.FB.api(`/${response.authResponse.userID}?fields=id,name,email,picture`);
    const params = {
      ID: credential.id,
      name: credential.name,
      email: credential.email,
      accessToken: response.authResponse.accessToken,
      profileImg: credential.picture.data.url,
    };
    _this.response.emit(params);
  }
}
