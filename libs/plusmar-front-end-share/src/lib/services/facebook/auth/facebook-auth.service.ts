import { Injectable } from '@angular/core';
import { IFacebookAuthResponse, IFacebookCredential } from '@reactor-room/model-lib';
import { Observable } from 'rxjs';
import { environmentLib } from '@reactor-room/environment-services-frontend';

@Injectable({
  providedIn: 'root',
})
export class FacebookAuthService {
  constructor() {}

  checkFacebookLoginStatus(): Observable<IFacebookCredential> {
    return new Observable((observer) => {
      window?.['FB'].getLoginStatus((response) => {
        if (response.status === 'connected') {
          this.facebookGetGraphApiData(response).subscribe((fbParams) => {
            observer.next(fbParams);
          });
        } else {
          this.facebookLogin().subscribe((fbParams) => {
            observer.next(fbParams);
          });
        }
      });
    });
  }

  getFacebookAuthExpirationTime(): Observable<IFacebookAuthResponse> {
    return new Observable((observer) => {
      window?.['FB'].getLoginStatus((response) => {
        if (response.status === 'connected') {
          observer.next({ status: 'OK', ...response.authResponse });
        } else {
          observer.next({ status: 'SESSION_EXPIRED' });
        }
      });
    });
  }

  facebookLogin(): Observable<IFacebookCredential> {
    return new Observable((observer) => {
      window?.['FB'].login(
        (loginResponse) => {
          this.facebookGetGraphApiData(loginResponse).subscribe((fbParams) => {
            observer.next(fbParams);
          });
        },
        {
          scope: environmentLib.facebookLoginScope,
          return_scopes: true,
        },
        (errResponse) => {
          console.error('[Facebook Login Error]', errResponse);
          // TODO : Alert Box
        },
      );
    });
  }

  facebookGetGraphApiData(response): Observable<IFacebookCredential> {
    return new Observable((observer) => {
      window?.['FB'].api(`/${response.authResponse.userID}?fields=id,name,email,picture`, (credential) => {
        const params = {
          ID: credential.id,
          pageID: null,
          name: credential.name,
          email: credential.email,
          accessToken: response.authResponse.accessToken,
          profileImg: credential.picture.data.url,
        };
        observer.next(params);
      });
    });
  }
}
