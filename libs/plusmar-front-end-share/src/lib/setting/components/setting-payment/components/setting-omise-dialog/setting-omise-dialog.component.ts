import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { EnumAuthError, EnumAuthScope, IOmiseDetail, IPaymentOmiseOption, ThemeWithIOmiseDetail } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
// import { environment } from '../../../../../../../environments/environment';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
@Component({
  selector: 'reactor-room-setting-omise-dialog',
  templateUrl: './setting-omise-dialog.component.html',
  styleUrls: ['./setting-omise-dialog.component.scss'],
})
export class SettingOmiseDialogComponent implements OnInit, OnDestroy {
  isInCreateMode;
  isAlreadyValidate = false;
  OmiseForm: FormGroup;
  omisePaymentCapability: IPaymentOmiseOption = {
    creditCard: false,
    qrCode: false,
  };
  omisePaymentOption: IPaymentOmiseOption = {
    creditCard: false,
    qrCode: false,
  };
  successDialog;
  omiseWebhook = 'https://api.more-commerce.com/omise-payment';
  isLoading = false as boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();
  theme: string;
  themeType = EnumAuthScope;
  constructor(
    public dialogRef: MatDialogRef<SettingOmiseDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithIOmiseDetail,
    private leadFormBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.theme = this.data.theme;
      this.isInCreateMode = this.data.omise.createMode;
      this.OmiseForm = this.leadFormBuilder.group({
        publicKey: [this.data.omise.publicKey, Validators.required],
        secretKey: [this.data.omise.secretKey, Validators.required],
      });
      if (this.data.omise.publicKey) {
        this.isAlreadyValidate = true;
        this.getOmiseCapability();
      }
      if (this.data.omise.option) {
        this.omisePaymentOption = {
          creditCard: this.data.omise.option.creditCard,
          qrCode: this.data.omise.option.qrCode,
        };
      }
    } else {
      this.OmiseForm = this.leadFormBuilder.group({
        publicKey: ['', Validators.required],
        secretKey: ['', Validators.required],
      });
    }
    this.onChanges();
  }

  onChanges(): void {
    this.OmiseForm.get('publicKey')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.reset();
      });

    this.OmiseForm.get('secretKey')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.reset();
      });
  }

  reset(): void {
    this.isAlreadyValidate = false;
    this.omisePaymentOption = {
      creditCard: false,
      qrCode: false,
    };
    this.omisePaymentCapability = {
      creditCard: false,
      qrCode: false,
    };
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onClickCreditCard(): void {
    this.omisePaymentOption.creditCard = !this.omisePaymentOption.creditCard;
  }
  onClickQrCode(): void {
    this.omisePaymentOption.qrCode = !this.omisePaymentOption.qrCode;
  }

  onSave(): void {
    const omiseInput = {
      ...this.OmiseForm.value,
      option: JSON.stringify(this.omisePaymentOption),
    };
    if (this.omisePaymentOption.creditCard || this.omisePaymentOption.qrCode) {
      this.paymentsService
        .updateOmise(omiseInput)
        .pipe(
          takeUntil(this.destroy$),
          finalize(() => {
            this.isLoading = false;
            this.dialogRef.close();
          }),
        )
        .subscribe(
          () => {
            this.openSuccessDialog({ text: this.translate.instant('Data have been updated successfully'), title: this.translate.instant('Updated Successfully') }, false);
          },
          (err) => {
            if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
              this.openSuccessDialog(
                { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission denied') },
                true,
              );
            } else if (err.message.indexOf('"publicKey" is not allowed to be empty') !== -1 || err.message.indexOf('secretKey" is not allowed to be empty') !== -1) {
              this.openSuccessDialog(
                {
                  text: this.translate.instant('Missing Omise Info'),
                  title: this.translate.instant('Error'),
                },
                true,
              );
            } else if (err.message.indexOf('Error: Request failed with status code 401') !== -1) {
              this.openSuccessDialog(
                {
                  text: this.translate.instant('Invalid Omise '),
                  title: this.translate.instant('Error'),
                },
                true,
              );
            } else {
              console.log('err', err);
              this.openSuccessDialog(
                {
                  text: this.translate.instant('Cant Update Omise'),
                  title: this.translate.instant('Error'),
                },
                true,
              );
            }
          },
        );
    } else {
      this.openSuccessDialog(
        {
          text: this.translate.instant('No Omise Payment Method Active'),
          title: this.translate.instant('Error'),
        },
        true,
      );
    }
  }

  copyText(val: string): void {
    const selBox = document.createElement('textarea');
    selBox.style.position = 'fixed';
    selBox.style.left = '0';
    selBox.style.top = '0';
    selBox.style.opacity = '0';
    selBox.value = val;
    document.body.appendChild(selBox);
    selBox.focus();
    selBox.select();
    document.execCommand('copy');
    document.body.removeChild(selBox);
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  validateOmiseAccount(): void {
    const omiseInput = this.OmiseForm.value;
    this.paymentsService.validateOmiseAccountAndGetCapability(omiseInput).subscribe(
      (res) => {
        this.omisePaymentCapability = res;
        this.isAlreadyValidate = true;
      },
      (err) => {
        console.log('validateOmiseAccount ===> : err', err);
        this.openSuccessDialog(
          {
            text: this.translate.instant('Cant Validate Omise'),
            title: this.translate.instant('Error'),
          },
          true,
        );
      },
    );
  }

  getOmiseCapability(): void {
    this.paymentsService.getOmisePaymentCapability().subscribe(
      (res) => {
        this.omisePaymentCapability = res;
      },
      (err) => {
        console.log('err in getOmiseCapability ===> : ', err);
        this.openSuccessDialog(
          {
            text: this.translate.instant('Cant Get Omise'),
            title: this.translate.instant('Error'),
          },
          true,
        );
      },
    );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
