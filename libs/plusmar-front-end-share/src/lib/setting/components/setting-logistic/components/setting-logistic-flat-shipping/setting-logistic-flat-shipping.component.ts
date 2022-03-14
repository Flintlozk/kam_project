import { Component, OnInit, Output, EventEmitter, Input } from '@angular/core';
import { FormBuilder, FormControl, Validators, FormGroup, ValidatorFn, AbstractControl } from '@angular/forms';
import { validationMessages } from './../../logistic-validation';
import { debounceTime } from 'rxjs/operators';
import { computeMsgId } from '@angular/compiler';

@Component({
  selector: 'reactor-room-setting-logistic-flat-shipping',
  templateUrl: './setting-logistic-flat-shipping.component.html',
  styleUrls: ['./setting-logistic-flat-shipping.component.scss'],
})
export class SettingLogisticFlatShippingComponent implements OnInit {
  @Output() feeValidChange = new EventEmitter<boolean>();
  @Input() deliveryFee: number;

  logisticFlatShippingForm: FormGroup;
  feeValidationMessage: string;
  private validationMessages = validationMessages;

  constructor(private leadFormBuilder: FormBuilder) {}
  ngOnInit(): void {
    this.logisticFlatShippingForm = this.leadFormBuilder.group({
      deliveryFee: [this.deliveryFee, [Validators.required, Validators.pattern(/^[.\d]+$/)]],
    });
    this.feeValidChange.emit(this.logisticFlatShippingForm.status === 'VALID');
  }
  eventLookUpOnFocus(controlName: string) {
    const customerFormControl = this.logisticFlatShippingForm.get(controlName);

    if (this.logisticFlatShippingForm.controls[controlName].status !== 'VALID') {
      this.feeValidChange.emit(false);
    }
    customerFormControl.valueChanges.pipe(debounceTime(1000)).subscribe((value) => {
      this.setErrorMessage(customerFormControl, controlName);
      this.feeValidChange.emit(this.logisticFlatShippingForm.status === 'VALID');
    });
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
