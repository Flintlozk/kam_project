import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { EnumAuthError, EnumAuthScope, PaypalDetail, ThemeWithPaypalDetail } from '@reactor-room/itopplus-model-lib';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { finalize, takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-paypal-dialog',
  templateUrl: './setting-paypal-dialog.component.html',
  styleUrls: ['./setting-paypal-dialog.component.scss'],
})
export class SettingPaypalDialogComponent implements OnInit, OnDestroy {
  PaypalForm: FormGroup;
  isInCreateMode = false as boolean;
  successDialog;
  isLoading = false as boolean;
  destroy$: Subject<boolean> = new Subject<boolean>();
  theme: string;
  themeType = EnumAuthScope;
  constructor(
    public dialogRef: MatDialogRef<SettingPaypalDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithPaypalDetail,
    private leadFormBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.theme = this.data.theme;
      this.isInCreateMode = this.data.paypal.createMode;
      this.PaypalForm = this.leadFormBuilder.group({
        clientId: [this.data.paypal.clientId, Validators.required],
        clientSecret: [this.data.paypal.clientSecret, Validators.required],
        feePercent: [this.data.paypal.feePercent ? this.data.paypal.feePercent : '0', Validators.required],
        feeValue: [this.data.paypal.feeValue ? this.data.paypal.feeValue : '0', Validators.required],
        minimumValue: [this.data.paypal.minimumValue ? this.data.paypal.minimumValue : '0', Validators.required],
      });
    } else {
      this.PaypalForm = this.leadFormBuilder.group({
        clientId: ['', Validators.required],
        clientSecret: ['', Validators.required],
        feePercent: ['0', Validators.required],
        feeValue: ['0', Validators.required],
        minimumValue: ['0', Validators.required],
      });
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    this.isLoading = true;
    const paypalInput = this.PaypalForm.value;
    this.paymentsService
      .updatePaypal(paypalInput)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => {
          this.isLoading = false;
          this.dialogRef.close(this.data);
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
          } else if (err.message.indexOf('"clientSecret" is not allowed to be empty') !== -1 || err.message.indexOf('clientId" is not allowed to be empty') !== -1) {
            this.openSuccessDialog({ text: this.translate.instant('Missing PayPal Info'), title: this.translate.instant('Error') }, true);
          } else if (err.message.indexOf('Error: Request failed with status code 401') !== -1) {
            this.openSuccessDialog(
              {
                text: this.translate.instant('Invalid Paypal'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          } else {
            console.log('err', err);
            this.openSuccessDialog(
              {
                text: this.translate.instant('Cant Update Paypal'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          }
        },
      );
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
