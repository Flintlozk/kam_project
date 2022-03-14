import { Component, OnDestroy, OnInit } from '@angular/core';
import { IContentEditor, IContentManagementLanding } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-content-date-landing',
  templateUrl: './cms-content-date-landing.component.html',
  styleUrls: ['./cms-content-date-landing.component.scss'],
})
export class CmsContentDateLandingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  contentEditor: IContentEditor;
  contentManagementLanding: IContentManagementLanding;
  constructor(private cmsContentEditService: CmsContentEditService, private sidebarService: CmsSidebarService) {}

  ngOnInit(): void {
    this.cmsContentEditService.$contents
      .pipe(
        takeUntil(this.destroy$),
        tap((val) => {
          if (val) {
            this.contentEditor = val;
          }
        }),
      )
      .subscribe();
    this.sidebarService.contentManagementLandingValue$
      .pipe(
        takeUntil(this.destroy$),
        tap((val) => {
          if (val) {
            this.contentManagementLanding = val;
          }
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
