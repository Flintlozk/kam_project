import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { ESidebarMode } from '../../cms-sidebar.model';
import { EMenuCustomTab } from './cms-menu-custom.model';

@Component({
  selector: 'cms-next-cms-menu-custom',
  templateUrl: './cms-menu-custom.component.html',
  styleUrls: ['./cms-menu-custom.component.scss'],
})
export class CmsMenuCustomComponent implements OnInit {
  menuCustomTabs = [
    {
      title: EMenuCustomTab.SOURCE_TAB,
      selected: true,
      status: true,
    },
    {
      title: EMenuCustomTab.DESIGN_TAB,
      selected: false,
      status: true,
    },
    {
      title: EMenuCustomTab.MOBILE_TAB,
      selected: false,
      status: true,
    },
    {
      title: EMenuCustomTab.SETTING_TAB,
      selected: false,
      status: true,
    },
    {
      title: EMenuCustomTab.COMMON_SETTING_TAB,
      selected: false,
      status: true,
    },
  ];
  EMenuCustomTab = EMenuCustomTab;
  currentMenuCustomTab = EMenuCustomTab.SOURCE_TAB;
  ESidebarMode = ESidebarMode;
  sidebarLayoutMode: ESidebarMode;
  constructor(private sideBarService: CmsSidebarService) {
    sideBarService.getSidebarMenuCustomTab.pipe(distinctUntilChanged()).subscribe((tab) => {
      if (tab) this.onSidebarMenuCustomTabHandler(tab);
    });
  }

  ngOnInit(): void {}

  onSidebarMenuCustomTabHandler(currentTab: EMenuCustomTab): void {
    this.menuCustomTabs.forEach((item) => (item.selected = false));
    const foundTab = this.menuCustomTabs.find((tab) => tab.title === currentTab);
    if (foundTab) {
      foundTab.selected = true;
      this.currentMenuCustomTab = foundTab.title;
      this.sideBarService.setSidebarMenuCustomTab(foundTab.title);
    }
  }

  onDismiss(): void {
    this.sideBarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
  }
}
