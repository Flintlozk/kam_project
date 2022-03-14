import { Component, OnDestroy, OnInit } from '@angular/core';
import { IContentEditor, IContentManagementLanding } from '@reactor-room/cms-models-lib';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-content-comment-landing',
  templateUrl: './cms-content-comment-landing.component.html',
  styleUrls: ['./cms-content-comment-landing.component.scss'],
})
export class CmsContentCommentLandingComponent implements OnInit, OnDestroy {
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
            this.contentEditor.startDate = dayjs(this.contentEditor.startDate).format('DD/MM/YYYY');
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
