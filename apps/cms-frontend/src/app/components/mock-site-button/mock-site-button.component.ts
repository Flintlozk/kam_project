import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { IHTTPResult } from '@reactor-room/model-lib';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { WebsiteService } from '../../modules/cms/services/website.service';

@Component({
  selector: 'cms-next-mock-site-button',
  templateUrl: './mock-site-button.component.html',
  styleUrls: ['./mock-site-button.component.scss'],
})
export class MockSiteButtonComponent implements OnInit {
  constructor(private webSiteService: WebsiteService, private snackBar: MatSnackBar, private router: Router) {}
  destroy$ = new Subject();
  ngOnInit(): void {}

  onClickMockSite(): void {
    this.webSiteService
      .mockWebPageAndPageComponentForCmsAdmin()
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IHTTPResult) => {
          if (result.status === 200) {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.SUCCESS,
                message: 'Mock is saved!',
              } as StatusSnackbarModel,
            });
          } else {
            this.showUnexpectedError();
          }
        }),
        catchError((e) => {
          console.log('e  => mockWebPageAndPageComponentForCmsAdmin :>> ', e);
          this.showUnexpectedError(e);
          return EMPTY;
        }),
      )
      .subscribe();
  }
  showUnexpectedError(errorMessage?: string): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: errorMessage || 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }
}
