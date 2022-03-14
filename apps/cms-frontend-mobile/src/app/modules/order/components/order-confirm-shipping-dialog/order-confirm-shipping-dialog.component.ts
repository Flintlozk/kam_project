import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { validationMessages } from './validation-messages';
import { getFormErrorMessages, resetForm } from '@reactor-room/cms-frontend-helpers-lib';
import { IValidationMessage } from '@reactor-room/cms-models-lib';

interface IErrorMessageType {
  trackingNumberErrorMessage: string;
}

@Component({
  selector: 'cms-next-order-confirm-shipping-dialog',
  templateUrl: './order-confirm-shipping-dialog.component.html',
  styleUrls: ['./order-confirm-shipping-dialog.component.scss'],
})
export class OrderConfirmShippingDialogComponent implements OnInit {
  confirmShippingForm: FormGroup;
  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<OrderConfirmShippingDialogComponent>) {}

  ngOnInit(): void {
    this.confirmShippingForm = this.getConfirmShippingFormGroup();
  }

  getConfirmShippingFormGroup(): FormGroup {
    const confirmShippingFormGroup = this.fb.group({
      trackingNumber: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(40)]],
    }) as FormGroup;
    return confirmShippingFormGroup;
  }

  onCancelInformPaymentForm(): void {
    this.dialogRef.close();
    resetForm(this.confirmShippingForm);
  }

  onSaveInformPaymentForm(): void {
    if (this.confirmShippingForm.valid) this.dialogRef.close(this.confirmShippingForm);
    else this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.confirmShippingForm, this.validationMessages);
  }
}
