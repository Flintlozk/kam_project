import { Component, OnInit } from '@angular/core';
import { environment } from '../../../environments/environment.prod';
import { FacebookService, InitParams, LoginStatus } from '@reactor-room/itopplus-front-end-helpers/ngx-facebook';
import { deleteCookie } from '@reactor-room/itopplus-front-end-helpers';
@Component({
  selector: 'admin-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  params: { name: string; profileImg: string } = { name: '', profileImg: '' };
  constructor(private FB: FacebookService) {}
  ngOnInit(): void {
    const initParams: InitParams = {
      appId: environment.facebookAppID,
      autoLogAppEvents: true,
      xfbml: true,
      version: 'v8.0',
      status: true,
    };

    void this.FB.init(initParams);
    this.checkFacebookLoginStatus();
  }

  checkFacebookLoginStatus(): void {
    void this.FB.getLoginStatus().then((response) => {
      if (response.status === 'connected') {
        this.facebookGetGraphApiData(response);
      }
    });
  }

  facebookGetGraphApiData(response: LoginStatus): void {
    void this.FB.api(`/${response.authResponse.userID}?fields=name,picture`).then((credential) => {
      this.params = {
        name: credential.name,
        profileImg: credential.picture.data.url,
      };
    });
  }

  submitSearch(e): void {
    e?.preventDefault();
  }

  logout(): void {
    // TODO : Dialog Confirmation logout
    deleteCookie('access_token');
    setTimeout(() => {
      setTimeout(() => {
        location.href = '/login';
      }, 500);
    });
  }
}
