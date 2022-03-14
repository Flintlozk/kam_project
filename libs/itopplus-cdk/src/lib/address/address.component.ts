import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewEncapsulation } from '@angular/core';
import { AbstractControl, ControlContainer, FormBuilder, FormGroup, FormGroupDirective, ValidatorFn } from '@angular/forms';
import { AddressService, deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { debounceTime } from 'rxjs/operators';
import { validationMessages } from './address-validation';
import { TranslateService } from '@ngx-translate/core';

@Component({
  selector: 'reactor-room-address',
  templateUrl: './address.component.html',
  styleUrls: ['./address.component.less'],
  encapsulation: ViewEncapsulation.None,
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class AddressComponent implements OnInit, OnChanges {
  constructor(private parentFormDirective: FormGroupDirective, private form: FormBuilder, private appointmentService: AddressService, public translate: TranslateService) {}

  /* 
  TODO:
  1. add possibility to provide custom CSS classes
  */
  @Input() fields: any[];
  @Input() isRequired = true;
  @Output() handleValue: EventEmitter<any> = new EventEmitter();
  @Input() disabled = false;
  getAddressForm: FormGroup;
  filteredOptions;
  selectedField;
  parentForm: FormGroup;
  dateNow;
  validationMessages = validationMessages;

  amphoeError: string;

  ngOnInit(): void {
    const newForm = this.propsToForm(this.fields);
    this.getAddressForm = this.form.group(newForm);
    this.getAddressForm.valueChanges.pipe(debounceTime(500)).subscribe((value) => this._filter(value));

    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('location', this.getAddressForm);

    this.disableLocationControls(this.disabled ? 'disable' : 'enable');
  }

  propsToForm(props): { [key: string]: ValidatorFn[] }[] {
    return props.reduce(
      (acc, { field, value, validator }) => ({
        ...acc,
        ...{ [field]: [value, validator] },
      }),
      {},
    );
  }

  ngOnChanges(changes: SimpleChanges): void {
    this.handleFieldsChanges(changes);
    this.handleDisableChanges(changes);
  }

  handleFieldsChanges(changes: SimpleChanges): void {
    if (changes?.fields) {
      const { currentValue } = changes.fields;

      if (currentValue?.length) {
        this?.parentForm?.patchValue(
          currentValue.reduce(
            (acc, { field, value, _ }) => ({
              ...acc,
              ...{ [field]: value },
            }),
            {},
          ),
        );
      }
    }
  }

  handleDisableChanges(changes: SimpleChanges): void {
    if (changes?.disabled?.currentValue !== undefined && this.parentForm) {
      const action = changes?.disabled?.currentValue ? 'disable' : 'enable';
      this.disableLocationControls(action);
    }
  }

  disableLocationControls(action: 'disable' | 'enable'): void {
    const location = this.parentForm?.get('location') as FormGroup;
    Object.keys(location.controls).forEach((field) => {
      const control = location.get(field) as FormGroup;
      if (control) {
        setTimeout(() => control[action]({ onlySelf: true }), 100);
      }
    });
  }

  changeHandler(field: string): void {
    this.selectedField = field;
    const customerFormControl = this.getAddressForm.get(field);
    customerFormControl.valueChanges.pipe(debounceTime(300)).subscribe((_) => {
      this.setErrorMessage(customerFormControl, field);
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

  showErrorMessage(controlName: string, errorMessage: string): void {
    this[`${controlName}ValidationMessage`] = errorMessage;
  }

  getString(field: string): void {
    return this[field + 'ValidationMessage'];
  }

  selectSuggestion(value: { city?: string; amphoe: string; district: string; post_code: string; province: string }): void {
    value = deepCopy(value);
    value.city = value.amphoe;
    delete value.amphoe;

    this.getAddressForm.setValue(value);
    this.handleValue.emit(value);
  }

  _filter(value: string): void {
    if (value[this.selectedField]?.length > 2) {
      let search = '';
      if (this.selectedField === 'postalCode') search = 'post_code';
      else if (this.selectedField === 'city') search = 'amphoe';
      else search = this.selectedField;
      this.appointmentService.getAddressData(search, value[this.selectedField]).subscribe(
        (result) => {
          this.filteredOptions = result;
        },
        (err) => {
          console.log(err);
        },
      );
    }
  }
}
