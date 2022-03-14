import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { getBankAccountDetailArray, getBankAccountDetailObject } from '@reactor-room/plusmar-front-end-helpers';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { BankAccount, EnumAuthError, EnumAuthScope, EnumBankAccountType } from '@reactor-room/itopplus-model-lib';

interface BankSelect {
  imgUrl: string;
  title: string;
}
@Component({
  selector: 'reactor-room-setting-bank-transfer-dialog',
  templateUrl: './setting-bank-transfer-dialog.component.html',
  styleUrls: ['./setting-bank-transfer-dialog.component.scss'],
})
export class SettingBankTransferDialogComponent implements OnInit {
  mode: string;
  theme: string;
  themeType = EnumAuthScope;
  successDialog;
  selectData: BankSelect;
  selectStatus = false;

  bankData = getBankAccountDetailArray();
  bankDataOject = getBankAccountDetailObject();

  bankAccountForm: FormGroup;

  constructor(
    public dialogRef: MatDialogRef<SettingBankTransferDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leadFormBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) {}

  bankAccountValidator(type: EnumBankAccountType): ValidatorFn[] {
    const validate10Digit = [Validators.minLength(10), Validators.maxLength(10), Validators.required, Validators.pattern('^((?!-).)*$'), Validators.pattern('^[0-9]*$')];
    const validate12Digit = [Validators.minLength(12), Validators.maxLength(12), Validators.required, Validators.pattern('^((?!-).)*$'), Validators.pattern('^[0-9]*$')];
    switch (type) {
      case EnumBankAccountType.KBANK: {
        // KBANK 004 ธนาคารกสิกรไทย จากัด (มหาชน)
        // 000-0-00000-0
        return validate10Digit;
      }
      case EnumBankAccountType.SCB: {
        //  SCB 014 ธนาคารไทยพาณิชย จากัด (มหาชน)
        // 000-0-00000-0
        return validate10Digit;
      }
      case EnumBankAccountType.KTB: {
        // KTB 006 ธนาคารกรุงไทย จากัด (มหาชน)
        // 000-0-00000-0
        return validate10Digit;
      }
      case EnumBankAccountType.BBL: {
        // BBL 002 ธนาคารกรุงเทพ จากัด (มหาชน)
        // 000-0-00000-0
        return validate10Digit;
      }
      case EnumBankAccountType.TMB: {
        // TMB 011 ธนาคารทหารไทย จากัด (มหาชน)
        // 000-0-00000-0
        return validate10Digit;
      }
      case EnumBankAccountType.GSB: {
        // GSB 030 ธนาคารออมสิน
        // 0000-0000-000-0
        return validate12Digit;
      }
      case EnumBankAccountType.BAY: {
        // BAY 025 ธนาคารกรุงศรีอยุธยา จากัด (มหาชน)
        // 000-0-00000-0
        return validate10Digit;
      }
    }
  }

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.mode = this.data.mode;
    if (this.mode === 'EDIT') {
      const { type, account_id, branch_name, account_name } = this.data.bankAccount;
      this.selectData = { imgUrl: this.bankDataOject[type].imgUrl, title: this.bankDataOject[type].title };
      this.bankAccountForm = this.leadFormBuilder.group({
        bankInfo: this.leadFormBuilder.group({
          bankImg: [this.bankDataOject[type].imgUrl],
          bankTitle: [this.bankDataOject[type].title, Validators.required],
        }),
        bankType: [type, Validators.required],
        accountId: [account_id, [Validators.required]],
        branchName: [branch_name, Validators.required],
        accountName: [account_name, Validators.required],
      });
      this.bankAccountForm.controls['accountId'].setValidators(this.bankAccountValidator(type));
    } else {
      this.bankAccountForm = this.leadFormBuilder.group({
        bankInfo: this.leadFormBuilder.group({
          bankImg: [''],
          bankTitle: ['', Validators.required],
        }),
        bankType: ['', Validators.required],
        accountId: ['', [Validators.required]],
        branchName: ['', Validators.required],
        accountName: ['', Validators.required],
      });
    }
  }

  selectStatusToogle(): void {
    this.selectStatus = !this.selectStatus;
  }

  setSelectedData(item): void {
    this.selectData = item;
    this.bankAccountForm.patchValue({
      bankInfo: {
        bankTitle: item.title,
        bankImg: item.imgUrl,
      },
    });
    this.bankAccountForm.controls['bankType'].setValue(item.type);
    this.bankAccountForm.controls['accountId'].setValidators(this.bankAccountValidator(item.type));
  }

  onSubmit(): void {
    if (this.bankAccountForm.valid) {
      // this.data = this.bankAccountForm.value;
      const params = {
        accountName: this.bankAccountForm.value.accountName,
        accountId: this.bankAccountForm.value.accountId,
        bankType: this.bankAccountForm.value.bankType,
        branchName: this.bankAccountForm.value.branchName,
        status: this.mode === 'CREATE',
      };
      if (this.mode === 'ADD' || this.mode === 'CREATE') {
        this.paymentsService.addBankAccount(params as BankAccount).subscribe(
          (res) => {
            this.dialogRef.close({ res: res, activeTransfer: this.data.activeTransfer, status: this.data.status, type: this.data.type });
          },
          (err) => {
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
                    'Something went wrong when trying to create bank account, please try again later. For more information, please contact us at 02-029-1200',
                  ),
                  title: this.translate.instant('Error'),
                },
                true,
              );
            }
          },
        );
      } else {
        this.paymentsService.updateBankAccount(this.data.bankAccount.id, params as BankAccount).subscribe(
          () => {
            this.dialogRef.close({ id: this.data.bankAccount.id, ...this.bankAccountForm.value, status: false });
          },
          (err) => {
            this.openSuccessDialog(
              {
                text: this.translate.instant(
                  'Something went wrong when trying to update bank account, please try again later. For more information, please contact us at 02-029-1200',
                ),
                title: this.translate.instant('Error'),
              },
              true,
            );
          },
        );
      }
    }
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  onCancel(): void {
    this.dialogRef.close(false);
  }
}
