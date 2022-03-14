import { Component, OnInit, Inject, OnDestroy } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialog } from '@angular/material/dialog';
import { FormGroup, FormBuilder, Validators, AbstractControl } from '@angular/forms';
import { EnumAuthError, I2C2PPaymentModel } from '@reactor-room/itopplus-model-lib';
import { validationMessages } from '../payment.validatation';
import { debounceTime, finalize, takeUntil } from 'rxjs/operators';
import { TranslateService } from '@ngx-translate/core';
import { PaymentsService } from '@reactor-room/plusmar-front-end-share/services/settings/payments.service';
import { Subject } from 'rxjs';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-2c2p-dialog',
  templateUrl: './setting-2c2p-dialog.component.html',
  styleUrls: ['./setting-2c2p-dialog.component.scss'],
})
export class Setting2C2PlDialogComponent implements OnInit, OnDestroy {
  paymentForm: FormGroup;
  isInCreateMode = false as boolean;
  successDialog;
  secretKeyValidationMessage: string;
  merchantIDValidationMessage: string;
  private validationMessages = validationMessages;
  merchantIdLength = 15;
  destroy$: Subject<boolean> = new Subject<boolean>();
  isLoading = false as boolean;

  constructor(
    public dialogRef: MatDialogRef<Setting2C2PlDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: I2C2PPaymentModel,
    private leadFormBuilder: FormBuilder,
    private paymentsService: PaymentsService,
    public translate: TranslateService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    if (this.data) {
      this.isInCreateMode = this.data.createMode;
      this.paymentForm = this.leadFormBuilder.group({
        merchantID: [this.data.merchantID, Validators.compose([Validators.required, Validators.minLength(this.merchantIdLength), Validators.maxLength(this.merchantIdLength)])],
        secretKey: [this.data.secretKey, Validators.compose([Validators.required, Validators.minLength(40)])],
      });
    } else {
      this.paymentForm = this.leadFormBuilder.group({
        merchantID: ['', Validators.compose([Validators.required, Validators.minLength(this.merchantIdLength), Validators.maxLength(this.merchantIdLength)])],
        secretKey: ['', Validators.compose([Validators.required, Validators.minLength(40)])],
      });
    }
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.paymentForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(800)).subscribe(() => this.setErrorMessage(customerFormControl, controlName));
  }

  checkError(controlName: string): void {
    const customerFormControl = this.paymentForm.get(controlName);
    this.setErrorMessage(customerFormControl, controlName);
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;
      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    this[`${controlName}ValidationMessage`] = errorMessage;
  }

  onCancel(): void {
    this.dialogRef.close();
  }

  onSubmit(): void {
    if (this.paymentForm.valid) {
      this.isLoading = true;
      this.update2C2p();
    } else {
      this.checkError('merchantID');
      this.checkError('secretKey');
    }
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  update2C2p(): void {
    const data = this.paymentForm.value;
    this.paymentsService
      .update2C2P(data)
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
          } else {
            console.log('err', err);
            this.openSuccessDialog(
              {
                text: this.translate.instant('Cant Update 2C2P'),
                title: this.translate.instant('Error'),
              },
              true,
            );
          }
        },
      );
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
