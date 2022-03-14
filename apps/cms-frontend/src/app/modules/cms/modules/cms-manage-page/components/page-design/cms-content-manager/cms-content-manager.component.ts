import { DragDrop } from '@angular/cdk/drag-drop';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { FadeAnimate } from '@reactor-room/animation';
import { IContentManagementGeneralPattern, MenuGenericType } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, switchMap, takeUntil } from 'rxjs/operators';
import { CmsEditService } from '../../../../../services/cms-edit.service';
import { ContentPatternsService } from '../../../../../services/content-patterns.service';
import { DragRefData } from '../../../../cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { IPageDesignMenu } from '../page-design.model';

@Component({
  selector: 'cms-next-cms-content-manager',
  templateUrl: './cms-content-manager.component.html',
  styleUrls: ['./cms-content-manager.component.scss'],
  animations: [FadeAnimate.fadeBoxAnimation],
})
export class CmsContentManagerComponent implements OnInit, OnDestroy {
  destroy$ = new Subject();
  pageDesignMenu: IPageDesignMenu = {
    icon: 'assets/design-sections/content-manager.svg',
    activeIcon: 'assets/design-sections/content-manager-a.svg',
    title: 'Content Manager',
    isActive: false,
  };
  contentManagementPaterns: IContentManagementGeneralPattern[];
  constructor(private cmsEditService: CmsEditService, private dragDrop: DragDrop, private contentPatternService: ContentPatternsService, private snackBar: MatSnackBar) {}

  ngOnInit(): void {
    this.contentPatternService
      .getContentPatterns(0, 6)
      .pipe(
        debounceTime(300),
        takeUntil(this.destroy$),
        switchMap((patterns) => {
          if (patterns) {
            this.contentManagementPaterns = patterns;
            setTimeout(() => {
              this.contentManagementPaterns.forEach((pattern, index) => {
                const element = document.getElementById('content-pattern-' + index);
                if (element) {
                  const dragRef = this.dragDrop.createDrag<DragRefData>(element);
                  dragRef.data = { dropListRef: null, type: pattern._id, genericType: MenuGenericType.CONTENT_MANAGEMENT };
                  this.cmsEditService.dragHandler(dragRef, this.destroy$);
                  this.cmsEditService.addMenuDragRef(dragRef);
                }
              });
            }, 0);
          }
          return EMPTY;
        }),
        catchError((e) => {
          console.log('e  => ngOnInit - getContentPatterns :>> ', e);
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

  onActivateChildContainer(): void {
    this.pageDesignMenu.isActive = !this.pageDesignMenu.isActive;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
