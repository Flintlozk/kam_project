import { Component, OnDestroy, OnInit } from '@angular/core';
import { IContentEditor } from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';

@Component({
  selector: 'cms-next-cms-content-cover-image-landing',
  templateUrl: './cms-content-cover-image-landing.component.html',
  styleUrls: ['./cms-content-cover-image-landing.component.scss'],
})
export class CmsContentCoverImageLandingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  contentEditor: IContentEditor;
  constructor(private cmsContentEditService: CmsContentEditService) {}

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
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
