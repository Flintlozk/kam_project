import { Component, OnInit } from '@angular/core';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { ISiteDetail, ISiteInfoDetail } from './site-details.model';

@Component({
  selector: 'cms-next-site-details',
  templateUrl: './site-details.component.html',
  styleUrls: ['./site-details.component.scss'],
})
export class SiteDetailsComponent implements OnInit {
  siteInfo: ISiteInfoDetail = {
    title: "Powells' site",
    status: 'Published',
    img: 'assets/shared/sample.jpg',
    route: RouteLinkEnum.CMS,
  };
  destroy$ = new Subject();
  siteDetails: ISiteDetail[] = [
    {
      title: 'New Order',
      subTitle: 'E-Commerce',
      value: 29,
      decoration: null,
      isWebsite: false,
      route: RouteLinkEnum.DASHBOARD_NEW_ORDER,
    },
    {
      title: 'Confirm Pending',
      subTitle: 'E-Commerce',
      value: 29,
      decoration: 'left',
      isWebsite: false,
      route: RouteLinkEnum.DASHBOARD_CONFIRM_PENDING,
    },
    {
      title: 'Shipping Pending',
      subTitle: 'E-Commerce',
      value: 29,
      decoration: null,
      isWebsite: false,
      route: RouteLinkEnum.DASHBOARD_SHIPPING_PENDING,
    },
    {
      title: 'Finish Order',
      subTitle: 'E-Commerce',
      value: 29,
      decoration: 'left',
      isWebsite: false,
      route: RouteLinkEnum.DASHBOARD_FINISH_ORDER,
    },
    {
      title: 'Low Stock',
      subTitle: 'E-Commerce',
      value: 29,
      decoration: null,
      isWebsite: false,
      route: RouteLinkEnum.DASHBOARD_LOW_STOCK,
    },
    {
      title: 'Active user',
      subTitle: 'Website',
      value: 29,
      decoration: 'top',
      isWebsite: true,
      route: RouteLinkEnum.DASHBOARD_ACTIVE_USER,
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
