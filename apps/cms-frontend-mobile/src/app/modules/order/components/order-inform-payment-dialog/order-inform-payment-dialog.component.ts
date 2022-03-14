import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { getFormErrorMessages, resetForm } from '@reactor-room/cms-frontend-helpers-lib';
import { IValidationMessage } from '@reactor-room/cms-models-lib';
import { TranslateService } from '@ngx-translate/core';
import { validationMessages } from './validation-messages';

interface IErrorMessageType {
  bankAccountErrorMessage: string;
  dateErrorMessage: string;
  timeErrorMessage: string;
}

@Component({
  selector: 'cms-next-order-inform-payment-dialog',
  templateUrl: './order-inform-payment-dialog.component.html',
  styleUrls: ['./order-inform-payment-dialog.component.scss'],
})
export class OrderInformPaymentDialogComponent implements OnInit {
  informPaymentForm: FormGroup;

  bankAccountData = [
    {
      value: 'kasikorn',
      title: 'KasiKorn',
    },
    {
      value: 'krungsi',
      title: 'Krungsi',
    },
    {
      value: 'scb',
      title: 'Siam Bank',
    },
  ];

  validationMessages = validationMessages as IValidationMessage[];
  formErrorMessageObj = {} as IErrorMessageType;

  constructor(private fb: FormBuilder, private dialogRef: MatDialogRef<OrderInformPaymentDialogComponent>, private translate: TranslateService) {}

  ngOnInit(): void {
    this.informPaymentForm = this.getInformPaymentForm();
  }

  getInformPaymentForm(): FormGroup {
    const informPaymentFormGroup = this.fb.group({
      paymentMethod: [{ value: this.translate.instant('Bank Account'), disabled: true }, Validators.required],
      bankAccount: ['', Validators.required],
      date: ['', Validators.required],
      time: ['', Validators.required],
    }) as FormGroup;
    return informPaymentFormGroup;
  }

  onCancelInformPaymentForm(): void {
    this.dialogRef.close();
    resetForm(this.informPaymentForm);
  }

  onSaveInformPaymentForm(): void {
    if (this.informPaymentForm.valid) this.dialogRef.close(this.informPaymentForm);
    else this.formErrorMessageObj = getFormErrorMessages<IErrorMessageType>(this.informPaymentForm, this.validationMessages);
  }
  trackByIndex(index: number): number {
    return index;
  }
}
