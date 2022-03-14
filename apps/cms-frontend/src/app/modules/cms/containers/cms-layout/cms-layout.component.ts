import { Component, OnDestroy, OnInit } from '@angular/core';
import { EMPTY, Subject } from 'rxjs';
import { FadeAnimate } from '@reactor-room/animation';
import { CmsPreviewService } from '../../services/cms-preview.service';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { CmsSiteMenuPageService } from '../../services/cms-site-menu-page.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IWebPage } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';

@Component({
  selector: 'cms-next-cms-layout',
  templateUrl: './cms-layout.component.html',
  styleUrls: ['./cms-layout.component.scss'],
  animations: [FadeAnimate.fadeLeftAnimation],
})
export class CmsLayoutComponent implements OnInit, OnDestroy {
  isPreviewMode: boolean;
  destroy$ = new Subject();
  constructor(private cmsPreviewService: CmsPreviewService, private siteMenuPageService: CmsSiteMenuPageService, private snackBar: MatSnackBar) {
    this.cmsPreviewService.getIsPreviewMode.pipe(takeUntil(this.destroy$)).subscribe((status) => (this.isPreviewMode = status));
  }

  ngOnInit(): void {
    this.siteMenuPageService
      .getWebPagesByPageID()
      .pipe(
        tap((result: IWebPage[]) => {
          if (result?.length) {
            this.siteMenuPageService.AllPage$.next(result);
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => onGetPagesByPageID :>> ', e);
          return EMPTY;
        }),
        takeUntil(this.destroy$),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }
}
