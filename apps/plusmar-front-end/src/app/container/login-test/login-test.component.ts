import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { environment } from '../../../environments/environment';
import { LoginTestService } from './login.service';
@Component({
  selector: 'reactor-room-login-test',
  templateUrl: './login-test.component.html',
  styleUrls: ['./login-test.component.scss'],
})
export class LoginTestComponent implements OnInit {
  isDevelopment = !environment.IS_PRODUCTION;
  initProcessing = false;
  constructor(public router: Router, public loginTestService: LoginTestService) {}

  ngOnInit(): void {}

  login(index: number): void {
    switch (index) {
      case 0:
        void this.router.navigate(['login']);
        break;
      case 2:
      case 3:
      case 6:
      case 61:
        this.initLogin(index);
        break;
      default:
        break;
    }
  }

  initLogin(index: number): void {
    this.loginTestService.loginTestAuth(index).subscribe(
      (result) => {
        setCookie('access_token', result.value, 30);
        this.initProcessing = true;
      },
      (err) => {
        alert(err.message);
      },
    );
  }

  processCallback(): void {
    alert('login error');
    this.initProcessing = false;
  }
}
