import { Component, EventEmitter, HostListener, Input, OnChanges, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel, ConfirmDialogComponent, ConfirmDialogType, ConfirmDialogModel } from '@reactor-room/itopplus-cdk';
import { ContentPatternsLandingService } from 'apps/cms-frontend/src/app/modules/cms/services/content-patterns-landing.service';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil, tap } from 'rxjs/operators';
import { IContentManagementLandingPatternModal } from './cms-content-manage-landing-patterns.model';

@Component({
  selector: 'cms-next-cms-content-manage-landing-patterns',
  templateUrl: './cms-content-manage-landing-patterns.component.html',
  styleUrls: ['./cms-content-manage-landing-patterns.component.scss'],
})
export class CmsContentManageLandingPatternsComponent implements OnInit, OnChanges, OnDestroy {
  contentManagementLandingPaterns: IContentManagementLandingPatternModal[] = [];
  limit = 6;
  isNoMoreData = false;
  @Input() patternId: string;
  @Output() patternEvent = new EventEmitter<IContentManagementLandingPatternModal>();
  @Output() isSelectPatternsEvent = new EventEmitter<boolean>();
  destroy$ = new Subject();
  constructor(private dialog: MatDialog, private snackBar: MatSnackBar, private contentPatternsLanding: ContentPatternsLandingService) {}

  ngOnInit(): void {
    this.onGetContentPatterns();
  }

  onGetContentPatterns(): void {
    this.contentPatternsLanding
      .getContentPatternsLandings(this.contentManagementLandingPaterns.length, this.limit)
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        tap((patterns) => {
          if (patterns && patterns?.length) {
            patterns.forEach((pattern) => {
              const patternModel: IContentManagementLandingPatternModal = { ...pattern, status: false };
              this.contentManagementLandingPaterns.push(patternModel);
              const foundPattern = this.contentManagementLandingPaterns.find((pattern) => pattern._id === this.patternId);
              if (foundPattern) {
                foundPattern.status = true;
              }
            });
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
        this.onGetContentPatterns();
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
    const foundPattern = this.contentManagementLandingPaterns.find((pattern) => pattern._id === this.patternId);
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
        this.contentManagementLandingPaterns.forEach((pattern) => (pattern.status = false));
        this.contentManagementLandingPaterns[index].status = true;
        this.patternEvent.emit(this.contentManagementLandingPaterns[index]);
        this.onDismissIsSelectPatterns();
      }
    });
  }

  onDismissIsSelectPatterns(): void {
    this.isSelectPatternsEvent.emit(false);
  }
}
