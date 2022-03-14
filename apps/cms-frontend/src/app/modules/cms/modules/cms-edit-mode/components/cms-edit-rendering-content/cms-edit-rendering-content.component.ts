import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild, ViewContainerRef } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ActivatedRoute, Router } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { EMPTY, Subject } from 'rxjs';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../../services/cms-content-edit.service';
import { CmsCreateThemeService } from '../../../../services/cms-create-template.service';
import { CmsPublishService } from '../../../../services/cms-publish.service';

@Component({
  selector: 'cms-next-cms-edit-rendering-content',
  templateUrl: './cms-edit-rendering-content.component.html',
  styleUrls: ['./cms-edit-rendering-content.component.scss'],
})
export class CmsEditRenderingContentComponent implements OnInit, AfterViewInit, OnDestroy {
  @ViewChild('insertPoint', { static: true, read: ViewContainerRef }) insertPoint: ViewContainerRef;
  @ViewChild('removePoint', { static: true, read: ViewContainerRef }) removePoint: ViewContainerRef;
  destroy$ = new Subject();
  contentId = '';
  constructor(
    private cmsCreateThemeService: CmsCreateThemeService,
    private activatedRoute: ActivatedRoute,
    private cmsContentEditService: CmsContentEditService,
    private router: Router,
    private snackBar: MatSnackBar,
    private cmsPublishService: CmsPublishService,
    private el: ElementRef,
  ) {}

  ngOnInit(): void {}

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.activatedRoute.params
      .pipe(
        takeUntil(this.destroy$),
        switchMap((param) => {
          this.contentId = param?.type;
          return this.cmsContentEditService.getContentsHTML(this.contentId);
        }),
        switchMap((angularHTML) => {
          if (angularHTML) {
            const styleUrls = [];
            const properties = {};
            void this.cmsCreateThemeService.createComponentFromRaw(angularHTML, styleUrls, properties, this.insertPoint);
            return this.cmsContentEditService.getContents(this.contentId);
          } else {
            void this.router.navigate(['/' + RouteLinkEnum.DASHBOARD + '/' + RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT]);
            return EMPTY;
          }
        }),
        tap((contents) => {
          if (contents) {
            contents._id = this.contentId;
            this.cmsContentEditService.$contents.next(contents);
            this.cmsPublishService.setIsPublish(false);
            this.el.nativeElement.setAttribute('id', contents._id);
          } else {
            this.cmsPublishService.setIsPublish(true);
            this.el.nativeElement.setAttribute('id', 'tempContentId');
            void this.router.navigate(['/' + RouteLinkEnum.SHORTCUT_WEBSITE_MANAGEMENT + '/' + RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT + '/' + 'new']);
          }
        }),
        catchError((e) => {
          this.showUnexpectedError();
          throw e;
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
