import { Component, OnDestroy, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { CmsEditService } from '../../services/cms-edit.service';
import { CmsSidebarService } from '../../services/cms-sidebar.service';
import { ESidebarMode } from './cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-sidebar',
  templateUrl: './cms-sidebar.component.html',
  styleUrls: ['./cms-sidebar.component.scss'],
})
export class CmsSidebarComponent implements OnInit, OnDestroy {
  selectedIndex = 0;
  sideBarMode: string;
  isPopupLayout = false;
  siteId: string;
  EsidebarMode = ESidebarMode;
  constructor(private sidebarService: CmsSidebarService, private router: Router, private cmsEditService: CmsEditService) {
    this.handleRoutingService();
    this.sidebarService.getSiteId.subscribe((result) => (this.siteId = result));
    this.sidebarService.getSidebarMode.subscribe((result) => (this.sideBarMode = result));
  }

  ngOnInit(): void {}

  ngOnDestroy(): void {
    if (!this.cmsEditService.menuDropListRef?.dropped.isStopped) {
      this.cmsEditService.menuDropListRef?.dropped.unsubscribe();
    }
    this.cmsEditService.getMenuDragRefs()?.forEach((d) => {
      d.dispose();
    });
    this.cmsEditService.clearMenuDragRefs();
    this.cmsEditService.menuDropListRef?.dispose();
  }

  handleRoutingService(): void {
    const currentRoute = this.router.url;
    if (currentRoute.includes(RouteLinkEnum.SHORTCUT_CREATE_PAGE)) {
      this.selectedIndex = 1;
      this.sidebarService.setCreatePageStatus(true);
      this.sidebarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
    }
    if (currentRoute.includes(RouteLinkEnum.SHORTCUT_WEBSITE_MANAGEMENT)) {
      this.sidebarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
    }
    if (currentRoute.includes(RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT)) {
      this.sidebarService.setSidebarMode(ESidebarMode.CONTENT_MANAGE);
    }
  }

  handleIndexChange(index: number): void {
    console.log('selectedIndex :>> ', index);
  }

  menuIndexEvent(event: number): void {
    this.selectedIndex = event;
  }
}
