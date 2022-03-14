import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { IContentManagementGeneralPattern } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { IHeadervariable } from '../../type/headerType';
import { ContentPatternsService } from '../cms-admin/services/content-patterns.service';

@Component({
  selector: 'reactor-room-content-manager',
  templateUrl: './content-manager.component.html',
  styleUrls: ['./content-manager.component.scss'],
})
export class ContentManagerComponent implements OnInit, OnDestroy {
  name: IHeadervariable = {
    topicName: 'Content Manager',
    buttonName: 'Content Pattern',
  };
  limit = 12;
  skip = 0;
  allPages: number;
  patterns: IContentManagementGeneralPattern[] = [];
  destroy$ = new Subject();
  constructor(private router: Router, private contentPatternService: ContentPatternsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.getPatternTotal();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getPatternTotal() {
    this.contentPatternService
      .getTotalPattern()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((total) => {
          this.allPages = Math.ceil(total / this.limit);
          return this.contentPatternService.getContentPatterns(this.skip, this.limit);
        }),
        tap((patterns) => {
          if (patterns) this.patterns = patterns;
        }),
        catchError((e) => {
          this.showUnexpectedError();
          throw e;
        }),
      )
      .subscribe();
  }

  onPageChange(page = 1): void {
    const startItem = (page - 1) * this.limit;
    if (page <= this.allPages) {
      this.contentPatternService
        .getContentPatterns(startItem, this.limit)
        .pipe(
          takeUntil(this.destroy$),
          tap((patterns) => {
            if (patterns) {
              this.patterns = patterns;
            }
          }),
          catchError((e) => {
            this.showUnexpectedError();
            throw e;
          }),
        )
        .subscribe();
    }
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }

  addNewPattern(): void {
    void this.router.navigate(['/layout/content-manager/new']);
  }

  onSelectPattern(_id: string): void {
    void this.router.navigate([`/layout/content-manager/${_id}`]);
  }
}
