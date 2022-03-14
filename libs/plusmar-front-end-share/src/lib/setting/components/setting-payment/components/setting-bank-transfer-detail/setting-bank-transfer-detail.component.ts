import { Component, EventEmitter, HostListener, Input, OnInit, Output, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import { getBankAccountDetailObject } from '@reactor-room/plusmar-front-end-helpers';
import { ITableHeader } from '@reactor-room/plusmar-front-end-share/app.model';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { EnumAuthError, EnumAuthScope, GenericButtonMode, GenericDialogData, GenericDialogMode, ReturnAddBankAccount } from '@reactor-room/itopplus-model-lib';
import { SettingBankTransferDialogComponent } from '../setting-bank-transfer-dialog/setting-bank-transfer-dialog.component';

@Component({
  selector: 'reactor-room-setting-bank-transfer-detail',
  templateUrl: './setting-bank-transfer-detail.component.html',
  styleUrls: ['./setting-bank-transfer-detail.component.scss'],
})
export class SettingBankTransferDetailComponent implements OnInit {
  bankData = getBankAccountDetailObject();

  tableHeader: ITableHeader[] = [
    { sort: false, title: this.translate.instant('Bank'), key: null },
    { sort: true, title: this.translate.instant('Branch'), key: null },
    { sort: true, title: this.translate.instant('Account Number'), key: null },
    { sort: true, title: this.translate.instant('Account Name'), key: null },
    { sort: false, title: this.translate.instant('Actions'), key: null },
  ];
  bankAccounts: ReturnAddBankAccount[];
  @Input() isBankTransferActive: boolean;
  @Input() isAllowed: boolean;
  @Input() theme: string;
  themeType = EnumAuthScope;
  isLoading: boolean;
  isRemovable: boolean;
  isActiveMoreThanOne: boolean;
  activeAmount: number;
  tableWidth = 'auto';
  successDialog;

  @Output() bankAccountUpdated = new EventEmitter<ReturnAddBankAccount[]>();
  @Output() sortTableMetaData = new EventEmitter();

  constructor(private dialog: MatDialog, private render: Renderer2, public translate: TranslateService, private paymentsService: PaymentsService) {}

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
    this.getBankAccountList();
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

  getBankAccountList(): void {
    this.isLoading = true;
    this.paymentsService.getBankAccountList().subscribe(
      (bankAccounts: [ReturnAddBankAccount]) => {
        const result = bankAccounts ? bankAccounts : [];
        this.bankAccounts = result;
        this.activeAmount = result.length > 0 ? result.filter((x) => x.status === true).length : 0;
        this.isActiveMoreThanOne = this.activeAmount > 1;
        this.isRemovable = result.length > 1;
        this.bankAccountUpdated.emit(result);
        this.isLoading = false;
      },
      (err) => {
        console.log('err', err);
        this.openError();
      },
    );
  }

  toggleBankAccountStatus(value): void {
    this.togggleStatus(value.id);
  }

  trackByIndex(index: number): number {
    return index;
  }

  togggleStatus(bankAccountId: number): void {
    this.paymentsService.toggleBankAccountStatus(bankAccountId).subscribe(
      () => {
        //
      },
      (err) => {
        this.getBankAccountList();
        if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
          this.openSuccessDialog(
            { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
            true,
          );
        } else {
          console.log('err', err);
          this.openSuccessDialog(
            {
              text: this.translate.instant(
                'Something went wrong when updateing bank account status, please try again later. For more information, please contact us at 02-029-1200',
              ),
              title: this.translate.instant('Error'),
            },
            true,
          );
        }
      },
    );
  }

  removeBankAccount(value): void {
    const dialogRef = this.dialog.open(GenericDialogComponent, {
      width: '100%',
      data: { dialogMode: GenericDialogMode.CONFIRM, buttonMode: GenericButtonMode.CONFIRM } as GenericDialogData,
      panelClass: 'generic-dialog',
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result) {
        this.paymentsService.removeBankAccount(value.id).subscribe(
          (response) => {
            this.openSuccessDialog({ text: this.translate.instant('Data have been deleted successfully'), title: this.translate.instant('Deleted Successfully') }, false);
          },
          (err) => {
            this.getBankAccountList();
            if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
              this.openSuccessDialog({ text: 'Only owner and admin have permission to manage this part', title: this.translate.instant('Permission denied') }, true);
            } else {
              console.log('err', err);
              this.openSuccessDialog(
                {
                  text: 'Something went wrong when trying to delete bank account, please try again later. For more information, please contact us at 02-029-1200',
                  title: this.translate.instant('Error'),
                },
                true,
              );
            }
          },
        );
      } else {
      }
    });
  }

  openError(): void {
    this.openSuccessDialog({ text: this.translate.instant('Bank Transfer must have at least 1 active bank account'), title: this.translate.instant('Error') }, true);
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  openEditDialog(value): void {
    const dialogRef = this.dialog.open(SettingBankTransferDialogComponent, {
      width: '100%',
      data: {
        mode: 'EDIT',
        bankAccount: value,
        theme: this.theme,
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
