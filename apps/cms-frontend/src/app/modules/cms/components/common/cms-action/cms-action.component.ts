import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { RouteLinkEnum } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { EMPTY, Subject } from 'rxjs';
import { catchError, delay, switchMap, takeUntil, tap } from 'rxjs/operators';
import { CmsContentEditService } from '../../../services/cms-content-edit.service';
import { CmsEditService } from '../../../services/cms-edit.service';
import { CmsPublishService } from '../../../services/cms-publish.service';
import { EActionStatus } from './cms-action.model';

@Component({
  selector: 'cms-next-cms-action',
  templateUrl: './cms-action.component.html',
  styleUrls: ['./cms-action.component.scss'],
})
export class CmsActionComponent implements OnInit, OnDestroy {
  counter = 0;
  buttonAction$ = new Subject();
  isPublish: boolean;
  @Input() btnTxt = EActionStatus.PUBLISH;
  @Input() isProcessing = false;
  @Input() isFromContent = false;
  @Input() isSaveAsDraft = false;
  destroy$ = new Subject();

  constructor(
    private editService: CmsEditService,
    private publishService: CmsPublishService,
    private cmsContentEditService: CmsContentEditService,
    private snackBar: MatSnackBar,
    public router: Router,
  ) {}

  ngOnInit(): void {
    this.isFromContent ? this.onButtonContentAction() : this.onButtonAction();
    this.publishService.getIsPublish.pipe(takeUntil(this.destroy$)).subscribe((isPublish) => {
      this.btnTxt = isPublish ? EActionStatus.PUBLISH : EActionStatus.UPDATE;
      this.isPublish = isPublish;
    });
  }

  onButtonAction(): void {
    this.buttonAction$
      .pipe(
        takeUntil(this.destroy$),
        tap((value: boolean) => {
          value = true;
          this.isProcessing = value;
          if (this.btnTxt === EActionStatus.PUBLISH) this.btnTxt = EActionStatus.PUBLISHING;
          if (this.btnTxt === EActionStatus.UPDATE) this.btnTxt = EActionStatus.UPDATING;
        }),
        delay(500),
        tap(() => {
          this.isProcessing = false;
          this.btnTxt = EActionStatus.UPDATE;
          this.publishService.savePageThemeComponents(
            this.editService.contentInsertPointContainer.value,
            this.editService.headerInsertPointContainer.value,
            this.editService.footerInsertPointContainer.value,
          );
        }),
      )
      .subscribe((value: boolean) => {
        this.isProcessing = value;
      });
  }

  onButtonContentAction() {
    this.buttonAction$
      .pipe(
        takeUntil(this.destroy$),
        tap(() => {
          this.isProcessing = true;
          if (this.btnTxt === EActionStatus.PUBLISH) this.btnTxt = EActionStatus.PUBLISHING;
          if (this.btnTxt === EActionStatus.UPDATE) this.btnTxt = EActionStatus.UPDATING;
        }),
        switchMap(() => {
          const sections = this.cmsContentEditService.getContentSectionData();
          const contentEditor = this.cmsContentEditService.contentsForm;
          if (contentEditor === null) {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: 'Please correct your data before saving!',
              } as StatusSnackbarModel,
            });
            this.isProcessing = false;
            if (this.btnTxt === EActionStatus.PUBLISHING) this.btnTxt = EActionStatus.PUBLISH;
            if (this.btnTxt === EActionStatus.UPDATING) this.btnTxt = EActionStatus.UPDATE;
            return EMPTY;
          }
          if (this.isSaveAsDraft) {
            contentEditor.sections = [];
            contentEditor.draftSections = sections;
          } else {
            contentEditor.sections = sections;
            contentEditor.draftSections = sections;
          }
          const savingData = deepCopy(contentEditor);
          savingData.sections.forEach((item) => {
            item.columns.forEach((column) => {
              const stringVal = JSON.stringify(column.components);
              column.components = stringVal;
            });
          });
          savingData.draftSections.forEach((item) => {
            item.columns.forEach((column) => {
              const stringVal = JSON.stringify(column.components);
              column.components = stringVal;
            });
          });
          if (savingData._id && !this.isPublish) {
            return this.cmsContentEditService.updateContents(savingData, savingData._id, this.isSaveAsDraft);
          } else {
            savingData._id = null;
            return this.cmsContentEditService.addContents(savingData);
          }
        }),
        tap((result) => {
          this.isProcessing = false;
          this.btnTxt = EActionStatus.UPDATE;
          if (result.status === 200) {
            if (this.isPublish) {
              void this.router.navigate(['/' + RouteLinkEnum.SHORTCUT_WEBSITE_MANAGEMENT + '/' + RouteLinkEnum.SHORTCUT_CONTENT_MANAGEMENT + '/' + result.value]);
            } else
              this.snackBar.openFromComponent(StatusSnackbarComponent, {
                data: {
                  type: StatusSnackbarType.SUCCESS,
                  message: 'Up To Date Successfully',
                } as StatusSnackbarModel,
              });
          } else {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: result?.value,
              } as StatusSnackbarModel,
            });
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
