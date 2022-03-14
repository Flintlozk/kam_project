import { ChangeDetectorRef, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { LogisticsService } from '../../logistics.service';
import { validationMessages } from './logistic-validation';

import dayjs from 'dayjs';
@Component({
  selector: 'admin-add-bundle-dialog',
  templateUrl: './add-bundle-dialog.component.html',
  styleUrls: ['./add-bundle-dialog.component.scss'],
})
export class AddBundleDialogComponent implements OnInit {
  private validationMessages = validationMessages;
  lotNumberForm: FormGroup;
  trackingStartNumbersValidationMessage: string;
  trackingEndNumbersValidationMessage: string;
  trackingStartAndEndValidationMessage: string;
  trackingNumberInvalidMessage: string;
  isTrackAlphabetValid = true;
  isTrackingNumberValid: boolean;
  constructor(
    public logisticsService: LogisticsService,
    private cd: ChangeDetectorRef,
    @Inject(MAT_DIALOG_DATA) public data: { operator: string; logistic_operator_id: number },
    public dialogRef: MatDialogRef<AddBundleDialogComponent>,
    private fb: FormBuilder,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.cd.detectChanges();
  }

  initForm(): void {
    this.lotNumberForm = this.fb.group({
      trackingStartNumbers: ['', [Validators.pattern('^([A-Z]{1})([0-9]{4})([0-9]{4})$')]],
      trackingEndNumbers: ['', [Validators.pattern('^([A-Z]{1})([0-9]{4})([0-9]{4})$')]],
      expires_at: [dayjs().format('YYYY-MM-DD')],
    });
  }

  fromIsMoreThanToValidator(field: string): ValidatorFn {
    return (control: AbstractControl): { [key: string]: boolean } => {
      const fieldToCompare = control.parent.get(field);
      return Number(fieldToCompare?.value) > Number(control.value) ? { fromIsMoreThanTo: true } : null;
    };
  }

  validateAll(f: FormGroup): void {
    Object.keys(f.controls).forEach((field) => {
      const control = f.get(field) as FormGroup;
      if (control.controls) {
        this.validateAll(control);
      }
      control.markAsTouched({ onlySelf: true });
    });
  }

  addBundle(): void {
    const from = this.lotNumberForm.value.trackingStartNumbers.slice(1);
    const to = this.lotNumberForm.value.trackingEndNumbers.slice(1);
    this.isTrackingNumberValid = parseInt(to) - parseInt(from) > 0;
    if (!this.isTrackingNumberValid) this.trackingNumberInvalidMessage = 'Incorrect tracking number, please check and try again';
    if (this.lotNumberForm.value.trackingStartNumbers.length > 0 && this.lotNumberForm.valid && this.isTrackingNumberValid) {
      this.logisticsService
        .addLogisticBundle({
          from: this.lotNumberForm.value.trackingStartNumbers,
          to: this.lotNumberForm.value.trackingEndNumbers,
          expires_at: this.lotNumberForm.value.expires_at,
          logistic_operator_id: this.data.logistic_operator_id,
        })
        .subscribe((res) => {
          this.dialogRef.close(res.status);
        });
    }
    // this.validateAll(this.bundleForm);
    // if (this.bundleForm.valid) {
    //   const { from, to, expires_at } = this.bundleForm.value;
    //   this.logisticsService.addLogisticBundle({ from: Number(from), to: Number(to), expires_at, logistic_operator_id: this.data.logistic_operator_id }).subscribe((res) => {
    //     this.dialogRef.close(res.status);
    //   });
    // }
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.lotNumberForm.get(controlName);
    this.setErrorMessage(customerFormControl, controlName);
    if (controlName === 'trackingStartNumbers' || controlName === 'trackingEndNumbers') {
      this.checkMatchingAlphabet();
    }
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
    }
  }

  checkMatchingAlphabet(): void {
    this.trackingNumberInvalidMessage = '';
    let startAlphabets, endAlphabets;
    const trackingStartNumbers = this.lotNumberForm.value.trackingStartNumbers;
    const trackingEndNumbers = this.lotNumberForm.value.trackingEndNumbers;
    if (!trackingEndNumbers || !trackingStartNumbers) {
      this.isTrackAlphabetValid = false;
    } else {
      if (trackingStartNumbers.length === 0 || trackingEndNumbers.length === 0) {
        this.isTrackAlphabetValid = false;
        this.showErrorMessage('trackingStartandEndNumbers', 'Tracking number is required');
      } else {
        if (trackingStartNumbers.length > 1) startAlphabets = trackingStartNumbers.substring(0, 1);
        if (trackingEndNumbers.length > 1) endAlphabets = trackingEndNumbers.substring(0, 1);
        if (startAlphabets === endAlphabets) {
          this.isTrackAlphabetValid = true;
        } else {
          this.isTrackAlphabetValid = false;
          this.showErrorMessage('trackingStartandEndNumbers', 'Tracking number must have the same start alphabet');
        }
      }
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
      case 'trackingStartNumbers':
        this.trackingStartNumbersValidationMessage = errorMessage;
        break;
      case 'trackingEndNumbers':
        this.trackingEndNumbersValidationMessage = errorMessage;
        break;
      case 'trackingStartandEndNumbers':
        this.trackingStartAndEndValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }
}
