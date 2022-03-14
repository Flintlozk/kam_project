import { Component, NgZone, OnInit } from '@angular/core';
import { IGoogleCredential } from '@reactor-room/crm-models-lib';
import { LoginPageServiceService } from './login-page-service.service';
import { environment } from '../../../environments/environment';
import { ActivatedRoute, Router } from '@angular/router';
import { setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { ModalErrorComponent } from '../../components/modal-error/modal-error.component';
import { MatDialog } from '@angular/material/dialog';
const { client_id } = environment;
@Component({
  selector: 'reactor-room-login-page',
  templateUrl: './login-page.component.html',
  styleUrls: ['./login-page.component.scss'],
})
export class LoginPageComponent implements OnInit {
  constructor(private loginService: LoginPageServiceService, private route: ActivatedRoute, public router: Router, private zone: NgZone, public dialog: MatDialog) {}
  public clientId: string = client_id;
  public googleAuthScope: string;
  public cookiePolicy: string;
  public newStyle = 'newStyle';

  ngOnInit() {
    this.cookiePolicy = environment.cookiePolicy;
    this.googleAuthScope = environment.googleAuthScope;
    this.route.queryParams.subscribe((params) => {
      if (!params['link']) {
        localStorage.clear();
      }
    });
  }
  googleLoginCallBack(credential: IGoogleCredential) {
    this.loginService.sentKey(credential).subscribe(
      (result) => {
        const { status, token, profilePictureUrl, name, defaultWorkflow, ownerPicLink } = result || {};
        if (status === 200) {
          setCookie('access_token', token, 30);
          setCookie('profile_pic_url', profilePictureUrl, 30);
          setCookie('name', name, 30);
          setCookie('owner_pic_url', ownerPicLink, 30);
          if (localStorage.getItem('url')) {
            const url = localStorage.getItem('url');
            const splitUrl = url.split('?uuidTask=');
            localStorage.clear();
            this.zone.run(() => {
              void this.router.navigate([`${splitUrl[0]}`], { queryParams: { uuidTask: splitUrl[1] } });
            });
          } else {
            this.zone.run(() => {
              void this.router.navigate([`/task/${defaultWorkflow}`]);
            });
          }
        } else {
          void this.router.navigate(['relogin']);
        }
      },
      (err) => this.openErrorDialog(err),
    );
  }
  openErrorDialog(err: string): void {
    this.dialog.open(ModalErrorComponent, {
      data: {
        text: err,
      },
    });
  }
}
