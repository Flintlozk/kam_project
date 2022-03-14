import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'reactor-room-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss'],
})
export class NavbarComponent implements OnInit {
  logoutButton = false;
  constructor() {}

  ngOnInit(): void {}

  showLogout() {
    this.logoutButton = !this.logoutButton;
  }

  logout() {}
}
