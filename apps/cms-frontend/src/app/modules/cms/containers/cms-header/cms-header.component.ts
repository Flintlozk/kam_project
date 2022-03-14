import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { Router } from '@angular/router';
import { EnumThemeMode, RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, takeUntil } from 'rxjs/operators';
import { CmsPreviewService } from '../../services/cms-preview.service';
import { CmsSidebarService } from '../../services/cms-sidebar.service';
import { ELandingMode, ESidebarMode } from '../cms-sidebar/cms-sidebar.model';

@Component({
  selector: 'cms-next-cms-header',
  templateUrl: './cms-header.component.html',
  styleUrls: ['./cms-header.component.scss'],
})
export class CmsHeaderComponent implements OnInit, OnDestroy {
  isPreviewMode: boolean;
  destroy$ = new Subject();
  EsidebarMode = ESidebarMode;
  sidebarMode: string;
  RouteLinkEnum = RouteLinkEnum;
  darkModeFormControl = new FormControl(false);
  EnumThemeMode = EnumThemeMode;
  landingMode: ELandingMode;
  constructor(private cmsPreviewService: CmsPreviewService, private sidebarService: CmsSidebarService, private router: Router) {
    this.cmsPreviewService.getIsPreviewMode.pipe(takeUntil(this.destroy$)).subscribe((status) => (this.isPreviewMode = status));
    this.sidebarService.getSidebarMode.subscribe((result) => (this.sidebarMode = result));
    this.sidebarService.getLandingMode.subscribe((mode) => {
      this.landingMode = mode;
    });
  }

  ngOnInit(): void {
    this.onToggleThemeMode();
  }

  onToggleThemeMode(): void {
    this.darkModeFormControl.valueChanges.pipe(takeUntil(this.destroy$), distinctUntilChanged(), debounceTime(300)).subscribe((isDarkMode) => {
      const themeElement = document.getElementsByClassName('itp-theme')[0];
      if (isDarkMode) {
        themeElement.classList.remove(EnumThemeMode.LIGHT);
        themeElement.classList.add(EnumThemeMode.DARK);
        this.sidebarService.setThemeMode(EnumThemeMode.DARK);
      } else {
        themeElement.classList.add(EnumThemeMode.LIGHT);
        themeElement.classList.remove(EnumThemeMode.DARK);
        this.sidebarService.setThemeMode(EnumThemeMode.LIGHT);
      }
    });
  }

  onBackToEditor(): void {
    const url = this.router.url;
    const urlArray = url.split('/');
    const previousWebPageId = urlArray[urlArray.length - 3];
    this.sidebarService.setSidebarMode(ESidebarMode.SITE_MANAGE);
    this.sidebarService.setSidebarLayoutMode(null);
    this.router.navigate([`cms/edit/site-management/${previousWebPageId}`]);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
