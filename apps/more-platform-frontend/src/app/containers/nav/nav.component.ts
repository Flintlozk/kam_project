import { Component, OnInit } from '@angular/core';
import { RouteLinkEnum } from '../../shares/route.model';
import { INav } from './nav.model';

@Component({
  selector: 'more-platform-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.scss'],
})
export class NavComponent implements OnInit {
  navigation = [
    {
      route: RouteLinkEnum.DASHBOARD,
      imgUrl: 'assets/img/nav/dashboard.svg',
      imgActiveUrl: 'assets/img/nav/dashboard-active.svg',
      isStatus: false,
    },
    {
      route: RouteLinkEnum.INBOX,
      imgUrl: 'assets/img/nav/inbox.svg',
      imgActiveUrl: 'assets/img/nav/inbox-active.svg',
      isStatus: true,
    },
    {
      route: RouteLinkEnum.NOTIFICATION,
      imgUrl: 'assets/img/nav/notification.svg',
      imgActiveUrl: 'assets/img/nav/notification-active.svg',
      isStatus: true,
    },
  ] as INav[];

  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
