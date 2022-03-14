import { Component, HostListener, OnInit, Renderer2 } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
// import { SettingBankTransferDialogComponent } from '@plusmar-front/modules/setting/components/setting-payment/components';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { GenericDialogComponent } from '@reactor-room/plusmar-cdk';
import { getBankAccountDetailObject } from '@reactor-room/plusmar-front-end-helpers';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { EnumAuthError, GenericButtonMode, GenericDialogData, GenericDialogMode, ReturnAddBankAccount } from '@reactor-room/itopplus-model-lib';
import { SettingBankTransferDialogComponent } from '@reactor-room/plusmar-front-end-share/setting/components/setting-payment/components';

@Component({
  selector: 'reactor-room-wizard-step-4-bank-accounts',
  templateUrl: './wizard-step-4-bank-accounts.component.html',
  styleUrls: ['./wizard-step-4-bank-accounts.component.scss'],
})
export class WizardStepFourBankAccountsComponent implements OnInit {
  bankData = getBankAccountDetailObject();

  bankAccounts: ReturnAddBankAccount[];
  isLoading: boolean;
  isRemovable: boolean;
  activeAmount: number;
  tableWidth = 'auto';
  successDialog;

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

  getBankAccountList(): void {
    this.isLoading = true;
    this.paymentsService.getBankAccountList().subscribe(
      (bankAccounts: [ReturnAddBankAccount]) => {
        const result = bankAccounts ? bankAccounts : [];
        this.bankAccounts = result;
        this.activeAmount = result.length > 0 ? result.filter((x) => x.status === true).length : 0;
        this.isRemovable = this.activeAmount > 1;
        this.isLoading = false;
      },
      (err) => {
        console.log('err', err);
        this.openError();
      },
    );
  }

  openBankDialog(): void {
    this.dialog.open(SettingBankTransferDialogComponent, {
      width: '100%',
      data: {
        mode: 'CREATE',
        bankAccount: {},
      },
    });
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
          () => {
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
