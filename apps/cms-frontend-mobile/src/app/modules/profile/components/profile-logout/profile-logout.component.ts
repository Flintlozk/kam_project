import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'cms-next-profile-logout',
  templateUrl: './profile-logout.component.html',
  styleUrls: ['./profile-logout.component.scss'],
})
export class ProfileLogoutComponent implements OnInit {
  storeName = "Powell's book store";

  constructor() {}

  ngOnInit(): void {}
}
