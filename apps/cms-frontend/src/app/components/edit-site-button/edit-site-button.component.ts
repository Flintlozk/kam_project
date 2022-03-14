import { Component, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { IHTTPResult } from '@reactor-room/model-lib';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { CmsSiteMenuPageService } from '../../modules/cms/services/cms-site-menu-page.service';

@Component({
  selector: 'cms-next-edit-site-button',
  templateUrl: './edit-site-button.component.html',
  styleUrls: ['./edit-site-button.component.scss'],
})
export class EditSiteButtonComponent implements OnInit {
  constructor(private cmsSiteMenuPageService: CmsSiteMenuPageService, private snackBar: MatSnackBar, private router: Router) {}
  destroy$ = new Subject();
  ngOnInit(): void {}

  onClickEditSite(): void {
    this.cmsSiteMenuPageService
      .getHomePageId()
      .pipe(
        takeUntil(this.destroy$),
        tap((result: IHTTPResult) => {
          if (result.status === 200) {
            this.router.navigate([`cms/edit/site-management/${result.value}`]);
          }
        }),
        catchError((e) => {
          console.log('e  => getHomePageId :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
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
