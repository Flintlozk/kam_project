import { Component, OnInit } from '@angular/core';
import { FadeAnimate } from '@reactor-room/animation';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-tabs',
  templateUrl: './cms-tabs.component.html',
  styleUrls: ['./cms-tabs.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsTabsComponent implements OnInit {
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/tabs.svg',
    activeIcon: 'assets/design-sections/tabs-a.svg',
    title: 'Tabs',
    isActive: false,
  };
  constructor() {}

  ngOnInit(): void {}

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }
}
