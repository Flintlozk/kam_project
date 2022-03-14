import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'reactor-room-setting-all-layout',
  templateUrl: './setting-all-layout.component.html',
  styleUrls: ['./setting-all-layout.component.scss'],
})
export class SettingAllLayoutComponent {
  constructor(public router: Router) {}

  onClickTag() {
    void this.router.navigate(['home']);
  }
}
