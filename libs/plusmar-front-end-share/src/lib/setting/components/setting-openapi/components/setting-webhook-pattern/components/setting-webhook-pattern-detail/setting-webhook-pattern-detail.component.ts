import { Component, OnInit, HostListener, Renderer2, EventEmitter, Output, Input, OnDestroy } from '@angular/core';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { GenericDialogMode, GenericButtonMode, EnumAuthError, GenericDialogData, IPageWebhookPatternSetting } from '@reactor-room/itopplus-model-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { SettingWebhookPatternDialogComponent } from '../setting-webhook-pattern-dialog/setting-webhook-pattern-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import { OpenApiService } from '@reactor-room/plusmar-front-end-share/services/settings/open-api.service';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';

@Component({
  selector: 'reactor-room-setting-webhook-pattern-detail',
  templateUrl: './setting-webhook-pattern-detail.component.html',
  styleUrls: ['./setting-webhook-pattern-detail.component.scss'],
})
export class SettingWebhookPatternDetailComponent implements OnInit, OnDestroy {
  tableWidth = 'auto';
  tableHeader: ITableHeader[] = [
    { sort: false, title: this.translate.instant('Webhook Pattern Name'), key: null },
    { sort: false, title: this.translate.instant('Regex Pattern'), key: null },
    { sort: false, title: this.translate.instant('Webhook Url'), key: null },
    { sort: false, title: this.translate.instant('Actions'), key: null },
  ];
  webhookPatterns: IPageWebhookPatternSetting[] = [];
  @Input() isAllowed: boolean;
  @Output() sortTableMetaData = new EventEmitter();
  successDialog;
  isLoading = false;
  destroy$: Subject<boolean> = new Subject<boolean>();
  constructor(public translate: TranslateService, private render: Renderer2, private dialog: MatDialog, private openApiService: OpenApiService) {}

  @HostListener('window:resize', ['$event'])
  onWindowResize(): void {
    if (window.innerWidth <= 992) {
      this.tableWidth = window.innerWidth - 40 + 'px';
    }
  }

  ngOnInit(): void {
    if (window.innerWidth <= 992) {
      this.tableWidth = window.innerWidth - 40 + 'px';
    }
    this.getWebhookPatternList();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  getWebhookPatternList() {
    this.isLoading = true;
    this.openApiService
      .getWebhookPatternList()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (webhookPatterns: [IPageWebhookPatternSetting]) => {
          const result = webhookPatterns ? webhookPatterns : [];
          this.webhookPatterns = result;
          this.isLoading = false;
        },
        (err) => {
          console.log('err', err);
          this.openError();
        },
      );
  }

  sortTableData(element, index: number, type: string): void {
    const allSortElements = Array.from(document.querySelectorAll('.icon-up-down'));
    for (const ele of allSortElements) {
      ele.classList.remove('active');
    }
    this.render.addClass(element.target, 'active');
    this.sortTableMetaData.emit({
      index,
      type,
    });
  }

  toggleWebhookPatterntatus(value): void {
    this.togggleStatus(value.id);
  }

  togggleStatus(webhookPatternId: number): void {
    this.openApiService
      .toggleWebhookPatternStatus(webhookPatternId)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (response) => {
          //
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
              true,
            );
          } else {
            console.log('err', err);
            this.openError();
          }
        },
      );
  }

  removeWebhookPattern(value): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '100%',
      data: { dialogMode: GenericDialogMode.CONFIRM, buttonMode: GenericButtonMode.CONFIRM } as GenericDialogData,
      panelClass: 'generic-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.openApiService
          .removeWebhookPattern(value.id)
          .pipe(takeUntil(this.destroy$))
          .subscribe(
            (response) => {
              this.openSuccessDialog({ text: this.translate.instant('Data have been deleted successfully'), title: this.translate.instant('Deleted Successfully') }, false);
            },
            (err) => {
              if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
                this.openSuccessDialog({ text: 'Only owner and admin have permission to manage this part', title: this.translate.instant('Permission denied') }, true);
              } else {
                console.log('err', err);
                this.openError();
              }
            },
          );
      } else {
      }
    });
  }

  openError(): void {
    this.openSuccessDialog(
      {
        text: this.translate.instant('Something went wrong when trying to delete webhook, please try again later. For more information, please contact us at 02-029-1200'),
        title: this.translate.instant('Error'),
      },
      true,
    );
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  openEditDialog(value: IPageWebhookPatternSetting): void {
    const dialogRef = this.dialog.open(SettingWebhookPatternDialogComponent, {
      width: '100%',
      data: {
        mode: 'EDIT',
        webhookPattern: value,
      },
    });

    dialogRef.afterClosed().subscribe(
      (result) => {
        if (result) {
          this.openSuccessDialog({ text: this.translate.instant('Data have been edited successfully'), title: this.translate.instant('Edited Successfully') }, false);
        }
      },
      (err) => {
        console.log('err : ', err);
        this.openError();
      },
    );
  }
}
