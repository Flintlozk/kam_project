import { Component, EventEmitter, Input, OnDestroy, OnInit, Output } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { RouteLinkCmsEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deleteCookie } from '@reactor-room/itopplus-front-end-helpers';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { SettingWebsiteService } from '../../services/setting-webiste.service';

export enum ENUM {
  LOGIN = 'LOGIN',
  UPDATE_SUBSCRIPTION = 'UPDATE_SUBSCRIPTION',
}

@Component({
  selector: 'cms-process',
  templateUrl: './cms-process.component.html',
  styleUrls: ['./cms-process.component.scss'],
})
export class CMSProcessComponent implements OnInit, OnDestroy {
  @Input() setInitTo: RouteLinkCmsEnum;
  @Output() errorEvent = new EventEmitter<boolean>();
  destroy$ = new Subject();
  constructor(public translate: TranslateService, private router: Router, private settingWebsiteService: SettingWebsiteService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    switch (this.setInitTo) {
      case RouteLinkCmsEnum.LOGIN: {
        this.initializeLoginFlow();
        break;
      }
      case RouteLinkCmsEnum.WELCOME: {
        this.checkThemeConfig();
        break;
      }
      default: {
        // redirect back to /
      }
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initializeLoginFlow(): void {
    // window.location.href = environment.DEFAULT_ROUTE
    window.location.href = environment.cms.origin;
  }

  checkThemeConfig(): void {
    this.settingWebsiteService
      .getConfigTheme()
      .pipe(
        takeUntil(this.destroy$),
        tap((configTheme) => {
          if (configTheme) {
            if (configTheme?.updatedAt) {
              void this.router.navigate([RouteLinkCmsEnum.DASHBOARD]);
            } else {
              void this.router.navigate([RouteLinkCmsEnum.WELCOME]);
            }
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Cannot Connect To Config Theme Settings',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          deleteCookie('access_token');
          console.log('e  => getConfigTheme :>> ', e);
          this.showUnexpectedError();
          this.errorEvent.emit(e);
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
