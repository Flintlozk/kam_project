import { Component, OnInit } from '@angular/core';
import { distinctUntilChanged } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';
import { ESidebarMode } from '../../cms-sidebar.model';
import { ESidebarLayoutTab } from './cms-layout.model';

@Component({
  selector: 'cms-next-cms-layout',
  templateUrl: './cms-layout.component.html',
  styleUrls: ['./cms-layout.component.scss'],
})
export class CmsLayoutComponent implements OnInit {
  layoutTabs = [
    {
      title: ESidebarLayoutTab.LAYOUT_DETAIL,
      selected: true,
      status: true,
    },
    {
      title: ESidebarLayoutTab.LAYOUT_DESIGN,
      selected: false,
      status: true,
    },
    {
      title: ESidebarLayoutTab.LAYOUT_SETTING,
      selected: false,
      status: true,
    },
  ];
  ESidebarLayoutTab = ESidebarLayoutTab;
  currentLayoutTab = ESidebarLayoutTab.LAYOUT_DETAIL;
  ESidebarMode = ESidebarMode;
  sidebarLayoutMode: ESidebarMode;
  constructor(private sideBarService: CmsSidebarService) {
    sideBarService.getSidebarLayoutMode.pipe(distinctUntilChanged()).subscribe((mode) => {
      this.sidebarLayoutMode = mode;
    });
    sideBarService.getSidebarLayoutTab.pipe(distinctUntilChanged()).subscribe((tab) => {
      if (tab) this.onSidebarLayoutTabHandler(tab);
    });
  }

  ngOnInit(): void {}

  onSidebarLayoutTabHandler(currentTab: ESidebarLayoutTab): void {
    this.layoutTabs.forEach((item) => (item.selected = false));
    const foundTab = this.layoutTabs.find((tab) => tab.title === currentTab);
    if (foundTab) {
      foundTab.selected = true;
      this.currentLayoutTab = foundTab.title;
      this.sideBarService.setSidebarLayoutTab(foundTab.title);
    }
  }

  onDismiss(): void {
    this.sideBarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
  }
}
