import { Component, OnInit, Inject } from '@angular/core';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, AbstractControl } from '@angular/forms';
import { validationMessages } from './../../logistic-validation';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-logistic-delivery-dialog',
  templateUrl: './setting-logistic-delivery-dialog.component.html',
  styleUrls: ['./setting-logistic-delivery-dialog.component.scss'],
})
export class SettingLogisticDeliveryDialogComponent implements OnInit {
  deliveryFee = 0.0;
  deliveryFeeForm: FormGroup;
  feeValidationMessage: string;
  private validationMessages = validationMessages;

  constructor(public dialogRef: MatDialogRef<SettingLogisticDeliveryDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private leadFormBuilder: FormBuilder) {
    if (data) this.deliveryFee = data;
  }

  ngOnInit(): void {
    this.deliveryFeeForm = this.leadFormBuilder.group({
      deliveryFee: [this.deliveryFee, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
    });
  }

  onNoClick(): void {
    const isSave = false;
    this.dialogRef.close({ fee: this.deliveryFee, isSave: false });
  }

  onSave() {
    if (this.deliveryFeeForm.valid) {
      this.deliveryFee = this.deliveryFeeForm.value.deliveryFee;
      this.dialogRef.close({ fee: this.deliveryFee, isSave: true });
    } else {
      console.log('invalid');
    }
  }

  eventLookUpOnFocus(controlName: string) {
    const customerFormControl = this.deliveryFeeForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.setErrorMessage(customerFormControl, controlName);
    });
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      console.log('validaterionDAte', validationData);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      console.log('error message', errorMessage);
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  showErrorMessage(controlName: string, errorMessage: string) {
    switch (controlName) {
      case 'deliveryFee':
        this.feeValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }
}
