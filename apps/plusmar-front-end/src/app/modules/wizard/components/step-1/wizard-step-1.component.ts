import { Component, EventEmitter, OnDestroy, OnInit, Output } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { getCookie, isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { GenericErrorType, IFacebookPageResponse, IFacebookPageWithBindedPageStatus, IPages } from '@reactor-room/itopplus-model-lib';
import { EMPTY, Subject } from 'rxjs';
import { catchError, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { InviteLinkTroubleshootComponent } from '../../../../container/invite-link-troubleshoot/invite-link-troubleshoot.component';

@Component({
  selector: 'reactor-room-wizard-step-1',
  templateUrl: './wizard-step-1.component.html',
  styleUrls: ['wizard-step-1.component.scss'],
})
export class WizardStepOneComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<boolean>();
  destroy$: Subject<boolean> = new Subject<boolean>();
  currentPage: IPages;
  currentPageIndex = Number(getCookie('page_index'));
  selectedPage: IFacebookPageResponse;
  isLoading = false;
  successDialog;

  facebookPagesWithPageStatus: IFacebookPageWithBindedPageStatus[];
  pages: IPages[];

  showError = false;

  constructor(private pageService: PagesService, public translate: TranslateService, private dialog: MatDialog) {}

  openLinkTroubleshoot(): void {
    const dialogRef = this.dialog.open(InviteLinkTroubleshootComponent, {
      width: '90%',
    });
  }

  ngOnInit(): void {
    this.isLoading = true;
    this.pageService
      .getPages()
      .pipe(
        switchMap((pages: IPages[]) => {
          this.pages = pages;
          const currentPageIndex = Number(getCookie('page_index'));
          this.currentPage = pages[currentPageIndex];
          return this.pageService.getPagesFromFacebook().pipe(
            catchError((err) => {
              if (err.message.indexOf(GenericErrorType.FACEBOOK_FANPAGE_NOT_FOUND) !== -1) {
                // Handler?
              }

              this.showError = true;
              this.isLoading = false;
              return EMPTY;
            }),
          );
        }),
        switchMap((fbPages: IFacebookPageResponse[]) => {
          if (fbPages.length > 0) return this.pageService.getBindedPages(fbPages);
          else return EMPTY;
        }),
      )
      .subscribe(
        (bindedPages) => {
          this.facebookPagesWithPageStatus = bindedPages;
          bindedPages.map((page) => {
            if (page.facebook_page.name == this.pages[0].page_name) page.facebook_page.matchOwner = true;
            return page;
          });
          this.isLoading = false;
        },
        (err) => {
          this.openSuccessDialog({
            text: this.translate.instant('Something went wrong'),
            title: 'Error',
          });

          console.log('err ', err);
        },
      );
  }

  onSelectPage(fbPage: IFacebookPageResponse): void {
    this.isLoading = true;
    this.pageService
      .updateFacebookPageFromWizardStep(fbPage)
      .pipe(
        finalize(() => (this.isLoading = false)),
        takeUntil(this.destroy$),
      )
      .subscribe(
        () => {
          window.location.reload();
        },
        (err) => {
          this.openSuccessDialog({
            text: this.translate.instant('Something went wrong'),
            title: 'Error',
          });
          console.log('wizard step1 err', err);
        },
      );
  }

  openSuccessDialog(data): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = true;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
