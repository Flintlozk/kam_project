import { Component, OnInit } from '@angular/core';
import { deleteCookie } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-logout',
  templateUrl: './logout.component.html',
  styleUrls: ['./logout.component.scss'],
})
export class LogoutComponent implements OnInit {
  constructor() {}

  ngOnInit(): void {
    this.logout();
  }

  logout(): void {
    deleteCookie('access_token');
    deleteCookie('page_index');
    deleteCookie('subscription_index');
    setTimeout(() => {
      location.href = '/login';
    });
  }
}
