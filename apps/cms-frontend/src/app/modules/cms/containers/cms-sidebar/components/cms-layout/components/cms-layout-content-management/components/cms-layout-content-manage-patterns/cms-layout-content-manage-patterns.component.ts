import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { ConfirmDialogComponent } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.component';
import { ConfirmDialogModel, ConfirmDialogType } from 'apps/cms-frontend/src/app/components/dialog-theme/confirm-dialog/confirm-dialog.model';
import { ContentPatternsService } from 'apps/cms-frontend/src/app/modules/cms/services/content-patterns.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { IContentManagementGeneralPatternModal } from './cms-layout-content-manage-patterns.model';

@Component({
  selector: 'cms-next-cms-layout-content-manage-patterns',
  templateUrl: './cms-layout-content-manage-patterns.component.html',
  styleUrls: ['./cms-layout-content-manage-patterns.component.scss'],
})
export class CmsLayoutContentManagePatternsComponent implements OnInit, OnChanges, OnDestroy {
  contentManagementPaterns: IContentManagementGeneralPatternModal[] = [];
  limit = 6;
  isNoMoreData = false;
  @Input() patternId: string;
  @Output() patternIdEvent = new EventEmitter<string>();
  @Output() isSelectPatternsEvent = new EventEmitter<boolean>();
  destroy$ = new Subject();
  constructor(private dialog: MatDialog, private contentPatternService: ContentPatternsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.onGetContentPattern();
  }

  onGetContentPattern(): void {
    this.contentPatternService
      .getContentPatterns(this.contentManagementPaterns.length, this.limit)
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        tap((patterns) => {
          if (patterns && patterns?.length) {
            patterns.forEach((pattern) => {
              const patternModel: IContentManagementGeneralPatternModal = { ...pattern, status: false };
              this.contentManagementPaterns.push(patternModel);
            });
            const foundPattern = this.contentManagementPaterns.find((pattern) => pattern._id === this.patternId);
            if (foundPattern) foundPattern.status = true;
          } else {
            this.isNoMoreData = true;
          }
        }),
      )
      .subscribe({
        next: () => {},
        error: () => {
          this.showUnexpectedError();
        },
        complete: () => {
          console.log('COMPLETE');
        },
      });
  }

  @HostListener('scroll', ['$event'])
  onElementScroll($event: Event): void {
    const scrollElement = $event.target as HTMLElement;
    const scrollTop = scrollElement.scrollTop;
    const endPoint = scrollElement.scrollHeight - scrollElement.clientHeight;
    if (scrollTop >= endPoint) {
      if (!this.isNoMoreData) {
        this.onGetContentPattern();
      }
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
  ngOnChanges(): void {
    const foundPattern = this.contentManagementPaterns.find((pattern) => pattern._id === this.patternId);
    if (foundPattern) foundPattern.status = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  trackByIndex(index: number): number {
    return index;
  }

  onSelectPattern(index: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      data: {
        type: ConfirmDialogType.ACTION,
        title: 'Switch Pattern',
        content: 'Are you sure to change to this pattern?',
      } as ConfirmDialogModel,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.contentManagementPaterns?.forEach((pattern) => (pattern.status = false));
        this.contentManagementPaterns[index].status = true;
        this.patternIdEvent.emit(this.contentManagementPaterns[index]._id);
        this.onDismissIsSelectPatterns();
      }
    });
  }

  onDismissIsSelectPatterns(): void {
    this.isSelectPatternsEvent.emit(false);
  }
}
