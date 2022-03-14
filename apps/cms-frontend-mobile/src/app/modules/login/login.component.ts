import { Component, OnInit } from '@angular/core';
import { LoginService } from '@reactor-room/cms-frontend-services-lib';
import { IFacebookCredential, IGoogleCredential } from '@reactor-room/model-lib';
import { environment } from '../../../environments/environment';
import { FadeAnimate } from '@reactor-room/animation';
@Component({
  selector: 'cms-next-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class LoginComponent implements OnInit {
  isLoginWithEmail = false;
  isForgetPassword = false;
  isConfirmForgetPassword = false;
  elements: HTMLCollectionOf<Element>;
  facebookAppID = environment.facebookAppID as string;
  facebookAppSecret = environment.facebookAppSecret as string;
  facebookLoginScope = environment.facebookLoginScope as string[];
  lineClientID = environment.lineClientID;
  lineSecret = environment.lineSecret;
  lineRedirectUrl = environment.lineRedirectUrl;
  lineState = environment.lineState;
  clientId = environment.googleClientID;
  googleAuthScope = environment.googleAuthScope;
  cookiePolicy = environment.googleCookiePolicy;
  welcomeScreenStatus = true;
  constructor(private loginService: LoginService) {}

  ngOnInit(): void {
    setTimeout(() => {
      this.welcomeScreenStatus = false;
    }, 2000);
  }

  facebookLogin(auth: IFacebookCredential): void {
    try {
      this.loginService.logIntoFacebook(this.setCredentials(auth)).subscribe(
        (result) => {
          //Todo Route
          console.log('result ::', result);
        },
        (err) => {
          console.log('-< err >- ', err);
          if (err.message.indexOf('USER_NOT_FOUND') !== -1) {
            //Todo Alert
          } else {
            //Todo Alert
            console.error(err.message);
          }
        },
      );
    } catch (err) {
      //Todo Alert
      console.error(err.message);
    }
  }

  setCredentials(auth: IFacebookCredential): IFacebookCredential {
    const { ID, name, email, accessToken, profileImg } = auth;
    return { ID, name, email, accessToken, profileImg };
  }

  googleLoginCallBack(credential: IGoogleCredential): void {
    this.loginService.googleLoginAuth(credential).subscribe((response) => {
      //Todo Route
      console.log('response ::', response);
      //Todo Alert
    });
  }
}
