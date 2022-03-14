import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { IWebPagePage } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { ELandingMode } from '../../../containers/cms-sidebar/cms-sidebar.model';
import { CmsSidebarService } from '../../../services/cms-sidebar.service';
import { CmsSiteMenuPageService } from '../../../services/cms-site-menu-page.service';
import { EPageIcons } from './cms-page-selection.model';

@Component({
  selector: 'cms-next-cms-page-selection',
  templateUrl: './cms-page-selection.component.html',
  styleUrls: ['./cms-page-selection.component.scss'],
})
export class CmsPageSelectionComponent implements OnInit, OnDestroy {
  @Input() isBorder = true;

  pageSelectDefault: string;
  EPageIcons = EPageIcons;
  currentPage: IWebPagePage;
  pages: IWebPagePage[] = [];
  destroy$ = new Subject();
  cache = false;
  landingMode: ELandingMode;
  ELandingMode = ELandingMode;
  constructor(
    private siteMenuPageService: CmsSiteMenuPageService,
    private snackBar: MatSnackBar,
    private router: Router,
    private routParam: ActivatedRoute,
    private sidebarService: CmsSidebarService,
  ) {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnInit(): void {
    this.siteMenuPageService.AllPage$.pipe(
      tap((result) => {
        this.pages = [];
        result.forEach((webPage) => {
          this.pages = this.pages.concat(webPage.pages);
          const route = this.router.url.split('/');
          const page = webPage.pages.find((page) => route[route.length - 1] === page._id);
          if (page) {
            this.siteMenuPageService.currentPage$.next(page);
          }
        });
      }),
      takeUntil(this.destroy$),
      catchError((e) => {
        this.showUnexpectedError();
        console.log('e => onGetPagesByPageID :>> ', e);
        return EMPTY;
      }),
    ).subscribe();
    this.siteMenuPageService.currentPage$
      .pipe(
        tap((result) => {
          this.currentPage = result;
          this.pageSelectDefault = result.name;
        }),
        takeUntil(this.destroy$),
        catchError((e) => {
          this.showUnexpectedError();
          console.log('e => onGetPagesByPageID :>> ', e);
          return EMPTY;
        }),
      )
      .subscribe();
    this.sidebarService.getLandingMode.pipe(takeUntil(this.destroy$)).subscribe((mode: ELandingMode) => {
      this.landingMode = mode;
    });
  }

  onChangePage(page: IWebPagePage): void {
    this.router.navigate([`cms/edit/site-management/${page._id}`]);
    this.siteMenuPageService.currentPage$.next(page);
  }

  trackByIndex(index: number): number {
    return index;
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
