import { Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ITaxIsActiveModel, ITaxUpdateIsSave } from '@reactor-room/itopplus-model-lib';
import { debounceTime } from 'rxjs/operators';
import { validationMessages } from '../../tax.validatation';

@Component({
  selector: 'reactor-room-setting-tax-dialog',
  templateUrl: './setting-tax-dialog.component.html',
  styleUrls: ['./setting-tax-dialog.component.scss'],
})
export class SettingTaxDialogComponent implements OnInit {
  updateIsActive: boolean;
  taxForm: FormGroup;
  taxIDValidationMessage: string;
  taxValueValidationMessage: string;
  private validationMessages = validationMessages;
  taxLength = 13;

  constructor(public dialogRef: MatDialogRef<SettingTaxDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: ITaxIsActiveModel, private leadFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    if (this.data.tax === null) {
      this.taxForm = this.leadFormBuilder.group({
        taxID: ['', [Validators.required, Validators.minLength(this.taxLength), Validators.maxLength(this.taxLength), Validators.pattern('^[0-9]*$')]],
        taxName: new FormControl({ value: '', disabled: false }),
        taxValue: [0, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
        taxStatus: [false],
      });
    } else {
      this.taxForm = this.leadFormBuilder.group({
        taxID: [this.data.tax.tax_id, [Validators.required, Validators.minLength(this.taxLength), Validators.maxLength(this.taxLength), Validators.pattern('^[0-9]*$')]],
        taxName: new FormControl({ value: this.data.tax.name, disabled: true }),
        taxValue: [this.data.tax.tax, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
        taxStatus: [this.data.tax.status],
      });
    }
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.taxForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(800)).subscribe(() => this.setErrorMessage(customerFormControl, controlName));
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

  showErrorMessage(controlName: string, errorMessage: string): void {
    this[`${controlName}ValidationMessage`] = errorMessage;
    console.log('error message', this[`${controlName}ValidationMessage`]);
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onSave(): void {
    if (this.taxForm.valid) {
      if (this.data.tax) {
        this.updateIsActive = this.data.tax.tax_id && this.data.tax.tax_id.length > 0 ? this.data.isActive : true;
        if (this.taxForm.valid) {
          this.taxForm.patchValue({
            taxStatus: this.updateIsActive,
          });
          const isSave = true;
          const taxObj: ITaxUpdateIsSave = {
            tax: this.taxForm.value,
            isSave,
          };
          this.dialogRef.close(taxObj);
        }
      } else {
        this.taxForm.patchValue({
          taxStatus: true,
        });
        const isSave = true;
        const taxObj: ITaxUpdateIsSave = {
          tax: this.taxForm.value,
          isSave,
        };
        this.dialogRef.close(taxObj);
      }
    }
  }
}
