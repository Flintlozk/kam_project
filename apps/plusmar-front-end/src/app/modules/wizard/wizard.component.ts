import { Component, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { FocusModeService } from '@reactor-room/plusmar-front-end-share/services/focusmode.service';
import { ConfirmDialogComponent } from '@reactor-room/itopplus-cdk/confirm-dialog/confirm-dialog.component';
import { EnumAppScopeType, EnumAuthError, EnumAuthScope, EnumWizardStepType, IPages } from '@reactor-room/itopplus-model-lib';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { deleteCookie, getCookie, isMobile, setCookie } from '@reactor-room/itopplus-front-end-helpers';
import { ActivatedRoute, Router } from '@angular/router';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { environment } from '../../../environments/environment';

@Component({
  selector: 'reactor-room-wizard',
  templateUrl: './wizard.component.html',
  styleUrls: ['./wizard.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class WizardComponent implements OnInit, OnDestroy {
  constructor(
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private pagesService: PagesService,
    private mode: FocusModeService,
    public translate: TranslateService,
    public router: Router,
  ) {}
  destroy$ = new Subject();
  EnumWizardStepType = EnumWizardStepType;
  stepData;
  selectStep = false;
  step: EnumWizardStepType;
  currentStep: EnumWizardStepType;
  isSetupSuccess = false;
  isLoading = false;
  currentPage: IPages;
  isErrorFromNoPage = false;
  disableCancel = true;

  ngOnInit(): void {
    this.isLoading = true;
    this.onPageChangingSubscription();
    this.route.queryParams.subscribe((params) => {
      const errorParams: EnumAuthError = params.err;
      switch (errorParams) {
        case EnumAuthError.NO_PAGES:
          this.isErrorFromNoPage = true;
          this.openDialog(
            {
              text: this.translate.instant('To use our features you need to have a shop. You can select package which already have shop or create new shop.'),
              title: this.translate.instant('Lets create shop'),
            },
            false,
          );
          break;
      }
    });
    this.mode.setWizardMode(true);
    this.getPageStepDetail();
  }

  onPageChangingSubscription(): void {
    this.pagesService
      .onPageChangingSubscription()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        window.location.href = environment.DEFAULT_ROUTE;
      }),
      (err) => {
        console.log('onPageChangingSubscription ===> err: ', err);
      };
  }

  getPageStepDetail(): void {
    this.pagesService
      .getUnfinishPageSetting()
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
        switchMap((page) => {
          const scope = page?.page_app_scope;
          if (scope.length > 0 && !scope.includes(EnumAppScopeType.MORE_COMMERCE)) {
            this.disableCancel = false;
          }

          if (!page) {
            deleteCookie('page_index');
            void this.router.navigateByUrl(environment.DEFAULT_ROUTE);
          }
          if (page.wizard_step === EnumWizardStepType.SETUP_SUCCESS) {
            this.mode.setFocusMode(false);
            this.mode.setWizardMode(false);
            void this.router.navigateByUrl(environment.DEFAULT_ROUTE);
          }

          if (page.wizard_step === EnumWizardStepType.CMS_DEFAULT) {
            page.wizard_step = EnumWizardStepType.STEP_CONNECT_FACEBOOK;
          }
          this.currentPage = page;
          this.step = page.wizard_step;
          this.currentStep = page.wizard_step;

          return this.pagesService.getPages();
        }),
        catchError((err) => {
          console.log('err in get page : ', err);
          this.openDialog({ text: this.translate.instant('Create Shop Error'), title: this.translate.instant('Error') }, true);
          return EMPTY;
        }),
      )
      .subscribe(
        (pages) => {
          const currentPageIndex = Number(getCookie('page_index'));
          if (pages[currentPageIndex].id !== this.currentPage.id) {
            setCookie('page_index', pages.length - 1, 30);
          }
        },
        (err) => {
          console.log('err in get pages err', err);
          this.openDialog({ text: this.translate.instant('Create Shop Error'), title: this.translate.instant('Error') }, true);
        },
      );
  }

  onSelectStep(selectType: EnumWizardStepType): void {
    this.selectStep = true;
    this.step = selectType;
  }

  onCancel(): void {
    this.selectStep = false;
  }

  onSetupSuccess(): void {
    this.selectStep = false;
    this.isSetupSuccess = true;
  }

  openConfirmDeletePageDialog(): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = {
      title: this.translate.instant('Confirm Cancel Create Page'),
      text: this.translate.instant('Are you sure you want to cancel create page'),
      btnOkClick: this.remove.bind(this),
    };
  }

  openDialog(data, isError: boolean): void {
    setCookie('page_index', 0, 30);
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = data;

    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => {
      if (!isError && this.isErrorFromNoPage) {
        void this.router.navigateByUrl('create-shop');
      } else if (!isError) {
        this.pagesService.triggerPageChanging(false).subscribe();
        window.location.href = environment.DEFAULT_ROUTE;
      } else {
        this.pagesService.triggerPageChanging(false).subscribe();
        window.location.reload();
      }
    });
  }

  remove(): void {
    this.isLoading = true;
    this.pagesService
      .deletePage()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.isErrorFromNoPage = false;
          this.openDialog({ text: this.translate.instant('Delete Shop success'), title: this.translate.instant('Deleted Shop Success') }, false);
        },
        (err) => {
          console.log('err remove page ===> : ', err);
          this.openDialog({ text: this.translate.instant('Delete Shop Error'), title: this.translate.instant('Error') }, true);
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
