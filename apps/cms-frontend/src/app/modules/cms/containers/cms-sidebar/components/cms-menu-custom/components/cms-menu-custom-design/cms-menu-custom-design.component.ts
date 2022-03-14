import { Component, OnDestroy, OnInit } from '@angular/core';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { startWith, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-design',
  templateUrl: './cms-menu-custom-design.component.html',
  styleUrls: ['./cms-menu-custom-design.component.scss'],
})
export class CmsMenuCustomDesignComponent implements OnInit, OnDestroy {
  selectedIndex = 0;
  destroy$ = new Subject();
  constructor(private sidebarService: CmsSidebarService) {}

  ngOnInit(): void {
    this.sidebarService.getSidebarMenuLevelTab.pipe(takeUntil(this.destroy$), startWith(0)).subscribe((tab: number) => {
      this.selectedIndex = tab;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.complete();
  }
}
