import { Component, Input } from '@angular/core';
@Component({
  selector: 'cms-next-line-login',
  templateUrl: './line-login.component.html',
  styleUrls: ['./line-login.component.scss'],
})
export class LineLoginComponent {
  @Input() appID: string;
  @Input() lineAppSecret: string;
  @Input() lineRedirectUrl: string;
  @Input() lineState: string;
  constructor() {}

  lineRedirectLogin(): void {
    const main = 'https://access.line.me/oauth2/v2.1/authorize?';
    const responseType = 'code';
    const state = this.lineState;
    const nonce = 'm416';
    const scope = 'profile openid email';
    const mergeUrl1 = `${main}response_type=${responseType}&client_id=${this.appID}`;
    const mergeUrl2 = `&state=${state}&nonce=${nonce}&redirect_uri=${this.lineRedirectUrl}&scope=${scope}`;
    const url = `${mergeUrl1}${mergeUrl2}`;
    window.location.href = url;
  }
}
