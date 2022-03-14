import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IContentEditor, IContentManagementLanding, RightContentType } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { Subject } from 'rxjs';
import { distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-content-sidebar-landing',
  templateUrl: './cms-content-sidebar-landing.component.html',
  styleUrls: ['./cms-content-sidebar-landing.component.scss'],
})
export class CmsContentSidebarLandingComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  contentManagementLanding: IContentManagementLanding;
  contentEditors: IContentEditor[];
  RightContentType = RightContentType;
  constructor(private sidebarService: CmsSidebarService, private cmsContentEditService: CmsContentEditService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.sidebarService.contentManagementLandingValue$
      .pipe(
        startWith(this.contentManagementLanding),
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        pairwise(),
        tap(([oldValue, newVaLue]: [IContentManagementLanding, IContentManagementLanding]) => {
          if (!oldValue) this.contentManagementLanding = oldValue;
          if (oldValue !== newVaLue && newVaLue) {
            this.contentManagementLanding = newVaLue;
            const limit = newVaLue.option.rightContent.isMaxItem ? newVaLue.option.rightContent.maxItemNumber : 20;
            const categoryIds = newVaLue.option.rightContent.categoryIds;
            this.getCategoryContentsData(categoryIds, limit);
          }
        }),
      )
      .subscribe();
  }

  getCategoryContentsData(categoryIds: string[], limit: number): void {
    this.cmsContentEditService
      .getContentsByCategories(categoryIds, limit)
      .pipe(
        takeUntil(this.destroy$),
        tap((list: IContentEditor[]) => {
          if (list) {
            this.contentEditors = list;
          }
        }),
      )
      .subscribe({
        next: () => {},
        error: (error: HttpErrorResponse) => {
          this.showUnexpectedError(error.message);
        },
        complete: () => {
          console.log('COMPLETE');
        },
      });
  }

  showUnexpectedError(message: string = 'Unexpected Error occured...Try again later!'): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message,
      } as StatusSnackbarModel,
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
