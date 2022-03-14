import { Component, OnInit } from '@angular/core';
import { IHeadervariable } from '../../type/headerType';
import { Router } from '@angular/router';
import { CreateModalComponent } from '../../components/create-modal/create-modal.component';
import { MatDialog } from '@angular/material/dialog';
import { CreateModalTypeEnum, IThemeGeneralInfo, IThemeRendering } from '@reactor-room/cms-models-lib';
import { ThemeService } from '../cms-admin/services/theme.service';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { ConfirmDialogComponent, ConfirmDialogModel, ConfirmDialogType } from '@reactor-room/itopplus-cdk';
import { ThemeListService } from '@reactor-room/cms-frontend-services-lib';

@Component({
  selector: 'reactor-room-theme',
  templateUrl: './theme.component.html',
  styleUrls: ['./theme.component.scss'],
})
export class ThemeComponent implements OnInit {
  destroy$: Subject<boolean> = new Subject();
  name: IHeadervariable = {
    topicName: 'Theme',
    buttonName: 'Theme',
  };
  allPages: number;
  currentTheme: IThemeGeneralInfo;
  limit = 6;
  skip = 0;
  themeRendering: IThemeRendering;
  defaultHTML = [
    {
      name: 'Index.html',
      html: `<section id="THEME_HEADER" ></section>
      <section id="CONTENT"></section>
      <section id="THEME_FOOTER"></section>`,
      thumbnail: {
        path: '',
        stream: null,
      },
    },
  ];
  themes: IThemeGeneralInfo[] = [];

  constructor(private router: Router, public dialog: MatDialog, private themeService: ThemeService, private themeListService: ThemeListService) {}

  ngOnInit(): void {
    this.onGetTotalThemeNumber();
  }

  addNewTheme(): void {
    const dialogRef = this.dialog.open(CreateModalComponent, {
      data: { name: '', type: CreateModalTypeEnum.THEME },
    });

    dialogRef.afterClosed().subscribe((modalData) => {
      if (modalData?.name) {
        this.themeRendering = new Object() as IThemeRendering;
        this.themeRendering['html'] = this.defaultHTML;
        this.themeRendering['name'] = modalData.name;
        this.themeService
          .createTheme(this.themeRendering)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            async (_id) => {
              await this.router.navigate([`/theme/${_id}`]);
            },
            (err) => {
              this.openErrorDialog(err);
            },
          );
      }
    });
  }
  openErrorDialog(errMessage: string): void {
    this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.DANGER,
        title: 'Got ERROR',
        content: errMessage,
      } as ConfirmDialogModel,
    });
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
            }
          }),
          catchError((e) => {
            console.log('e  => onPageChange :>> ', e);
            return EMPTY;
          }),
        )
        .subscribe();
    }
  }
  onGetTotalThemeNumber(): void {
    this.themeListService
      .getTotalThemeNumber()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((totalThemes) => {
          if (totalThemes) {
            this.allPages = Math.ceil(totalThemes / this.limit);
            return this.themeListService.getThemesByLimit(this.skip, this.limit);
          }
        }),
        catchError((e) => {
          console.log('e  => onGetTotalThemeNumber :>> ', e);

          return EMPTY;
        }),
        tap((themes) => {
          if (themes) {
            this.themes = themes;
          }
        }),
        catchError((e) => {
          console.log('e  => onWelComeInit :>> ', e);
          return EMPTY;
        }),
      )
      .subscribe();
  }
  onSelectTemplate(templateIndex: number): void {
    void this.router.navigate([`/theme/${this.themes[templateIndex]._id}`]);
  }
}
