import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'admin-side-menu',
  templateUrl: './side-menu.component.html',
  styleUrls: ['./side-menu.component.scss'],
})
export class SideMenuComponent implements OnInit {
  constructor(public router: Router) {}

  ngOnInit(): void {}

  changeRouteTo(target: string): void {
    void this.router.navigate([target]);
  }
}
