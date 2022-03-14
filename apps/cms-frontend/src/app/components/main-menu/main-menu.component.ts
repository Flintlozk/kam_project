import { Component, OnInit } from '@angular/core';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { IMainMenu, TChildNode } from './main-menu.model';

@Component({
  selector: 'cms-next-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit {
  mainMenu: IMainMenu[] = [
    {
      icon: 'assets/menu/dashboard.svg',
      iconActive: 'assets/menu/dashboard-a.svg',
      title: 'Dashboard',
      route: RouteLinkCmsEnum.DASHBOARD,
      child: [] as TChildNode[],
    },
    {
      icon: 'assets/menu/icon-bill.svg',
      iconActive: 'assets/menu/icon-bill-a.svg',
      title: 'E-Commerce',
      route: RouteLinkCmsEnum.ORDER,
      child: [] as TChildNode[],
    },
    {
      icon: 'assets/menu/setting.svg',
      iconActive: 'assets/menu/setting-a.svg',
      title: 'Settings',
      route: RouteLinkCmsEnum.SETTING,
      child: [
        { title: 'Website Settings', route: RouteLinkCmsEnum.SETTING_WEBSITE },
        { title: 'Shop Settings', route: RouteLinkCmsEnum.SETTING_SHOP },
        { title: 'Admin Settings', route: RouteLinkCmsEnum.SETTING_ADMIN },
        { title: 'Integration', route: RouteLinkCmsEnum.SETTING_INTEGRATION },
        // { title: 'Member Settings', route: RouteLinkCmsEnum.SETTING_MEMBER },
        // { title: 'Advanced Settings', route: RouteLinkCmsEnum.SETTING_ADVANCE },
      ] as TChildNode[],
    },
  ];
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }
}
