import { Component, OnDestroy, OnInit } from '@angular/core';
import { IContentManagementLanding } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-content-share-landing',
  templateUrl: './cms-content-share-landing.component.html',
  styleUrls: ['./cms-content-share-landing.component.scss'],
})
export class CmsContentShareLandingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  contentManagementLanding: IContentManagementLanding;
  constructor(private sidebarService: CmsSidebarService) {}

  ngOnInit(): void {
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
