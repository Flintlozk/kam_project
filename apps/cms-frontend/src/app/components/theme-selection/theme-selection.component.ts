import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ThemeListService } from '@reactor-room/cms-frontend-services-lib';
import { IThemeGeneralInfo, IWebsiteConfigTheme, RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { ThemeService } from 'apps/cms-frontend/src/app/services/theme.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-theme-selection',
  templateUrl: './theme-selection.component.html',
  styleUrls: ['./theme-selection.component.scss'],
})
export class ThemeSelectionComponent implements OnInit, OnDestroy {
  @Input() isWelcomeScene: boolean;
  ERouteLink = RouteLinkEnum;
  themes: IThemeGeneralInfo[] = [];
  currentTheme: IThemeGeneralInfo;
  currentThemeId: string;
  limit = 6;
  skip = 0;
  allPages: number;
  destroy$ = new Subject();

  constructor(
    private snackBar: MatSnackBar,
    private themeService: ThemeService,
    private settingWebsiteService: SettingWebsiteService,
    private dialog: MatDialog,
    private themeListService: ThemeListService,
  ) {}

  ngOnInit(): void {
    this.onThemeSelectionInit();
    this.onGetTotalThemeNumber();
  }

  onGetTotalThemeNumber(): void {
    this.themeListService
      .getTotalThemeNumber()
      .pipe(
        takeUntil(this.destroy$),
        tap((totalThemes) => {
          if (totalThemes) {
            this.allPages = Math.ceil(totalThemes / this.limit);
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Cannot get total themes',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onGetTotalThemeNumber :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onPageChange(page = 1): void {
    const startItem = (page - 1) * this.limit;
    if (page <= this.allPages) {
      this.themeListService
        .getThemesByLimit(startItem, this.limit)
        .pipe(
          takeUntil(this.destroy$),
          tap((themes) => {
            if (themes) {
              this.themes = themes;
              this.onSetThemeSelectDefault();
            } else {
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.ERROR,
                  message: 'Cannot Connect To Themes',
                } as StatusSnackbarModel,
              });
            }
          }),
          catchError((e) => {
            console.log('e  => onPageChange :>> ', e);
            this.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }

  onGetTheme(): void {
    this.themeListService
      .getThemeGeneralInfo()
      .pipe(
        takeUntil(this.destroy$),
        tap((currentTheme) => {
          if (currentTheme) {
            this.currentTheme = currentTheme;
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Cannot get current Theme',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onGetTheme :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onThemeSelectionInit(): void {
    this.settingWebsiteService
      .getConfigTheme()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((configTheme) => {
          if (configTheme) {
            this.currentThemeId = configTheme?.theme_id;
            if (!configTheme?.updatedAt) this.onSaveConfigTheme();
            this.onGetTheme();
            return this.themeListService.getThemesByLimit(this.skip, this.limit);
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Cannot Connect To Config Theme Settings',
              } as StatusSnackbarModel,
            });
            return EMPTY;
          }
        }),
        tap((themes) => {
          if (themes) {
            this.themes = themes;
            this.onSetThemeSelectDefault();
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Cannot Connect To Themes',
              } as StatusSnackbarModel,
            });
          }
        }),
        catchError((e) => {
          console.log('e  => onWelComeInit :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  onSetThemeSelectDefault(): void {
    this.themes.forEach((item) => {
      if (item._id === this.currentThemeId) item.isSelected = true;
      else item.isSelected = false;
    });
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSelectTemplate(templateIndex: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Switch Theme Confirm',
        content: 'Are you sure to change to this theme?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.currentThemeId = this.themes[templateIndex]._id;
        this.onSetThemeSelectDefault();
        this.onSaveConfigTheme();
      }
    });
  }

  onSaveConfigTheme(): void {
    const configTheme: IWebsiteConfigTheme = {
      theme_id: this.currentThemeId,
      updatedAt: new Date().toISOString(),
    };
    this.settingWebsiteService
      .saveConfigTheme(configTheme)
      .pipe(
        takeUntil(this.destroy$),
        tap((result) => {
          if (result.status !== 200) {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: result?.value,
              } as StatusSnackbarModel,
            });
          } else {
            this.onGetTheme();
          }
        }),
        catchError((e) => {
          console.log('e  => onWelComeInit :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
