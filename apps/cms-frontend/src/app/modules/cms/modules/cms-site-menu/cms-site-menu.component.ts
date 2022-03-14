import { Component, OnInit } from '@angular/core';
import { ECmsSiteTypes, ICmsSiteFilter } from './cms-site-menu.model';

@Component({
  selector: 'cms-next-cms-site-menu',
  templateUrl: './cms-site-menu.component.html',
  styleUrls: ['./cms-site-menu.component.scss'],
})
export class CmsSiteMenuComponent implements OnInit {
  cmsSiteFilters: ICmsSiteFilter[] = [
    {
      title: 'Page',
      icon: 'assets/site-menu/page.svg',
      iconActive: 'assets/site-menu/page-a.svg',
      filterKey: ECmsSiteTypes.PAGE,
      isActive: true,
    },
    {
      title: 'Pop-Up',
      icon: 'assets/site-menu/popup.svg',
      iconActive: 'assets/site-menu/popup-a.svg',
      filterKey: ECmsSiteTypes.POPUP,
      isActive: false,
    },
  ];

  ECmsSiteTypes = ECmsSiteTypes;
  currentActiveType: string = ECmsSiteTypes.PAGE;
  constructor() {}

  ngOnInit(): void {}

  trackByIndex(index: number): number {
    return index;
  }

  onPageFilterSelect(index: number): void {
    this.cmsSiteFilters.forEach((item) => {
      item.isActive = false;
    });
    this.cmsSiteFilters[index].isActive = true;
    this.currentActiveType = this.cmsSiteFilters[index].filterKey;
  }
}
