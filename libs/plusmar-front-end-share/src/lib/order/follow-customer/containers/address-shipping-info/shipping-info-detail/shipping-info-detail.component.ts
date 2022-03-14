import { Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { AddressService } from '@reactor-room/itopplus-front-end-helpers';
import { PurchaseOrderCustomerDetail } from '@reactor-room/itopplus-model-lib';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-shipping-info-detail',
  templateUrl: './shipping-info-detail.component.html',
  styleUrls: ['./shipping-info-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShippingInfoDetailComponent implements OnInit, OnDestroy {
  @Input() stepIndex: number;
  @Input() customerDetail: PurchaseOrderCustomerDetail;
  shippingInfoForm: FormGroup;
  selectedField;
  filteredOptions;
  destroy$: Subject<boolean> = new Subject<boolean>();
  validationMessages = [
    {
      control: 'province',
      rules: {
        required: 'province is required',
        minlength: 'province cannot be less than 5 character',
      },
    },
    {
      control: 'amphoe',
      rules: {
        required: 'amphoe is required',
        minlength: 'amphoe cannot be less than 5 character',
      },
    },
    {
      control: 'district',
      rules: {
        required: 'district is required',
        minlength: 'district cannot be less than 5 character',
      },
    },
    {
      control: 'post_code',
      rules: {
        required: 'post code is required',
        minlength: 'post code cannot be less than 5 character',
      },
    },
  ];

  constructor(private leadFormBuilder: FormBuilder, public translate: TranslateService, private appointmentService: AddressService) {}

  ngOnInit(): void {
    this.shippingInfoForm = this.getShippingInfoFormGroup();
    this.shippingInfoForm.valueChanges.pipe(takeUntil(this.destroy$), debounceTime(500)).subscribe((value) => this._filter(value));
    this.shippingInfoForm.controls['name'].setValue(this.customerDetail.name);
    this.shippingInfoForm.controls['phoneNo'].setValue(this.customerDetail.phoneNumber);

    if ('location' in this.customerDetail) {
      if (this.customerDetail?.location !== null && this.customerDetail?.location?.address) {
        this.shippingInfoForm.controls['address'].setValue(this.customerDetail.location.address);
        this.shippingInfoForm.controls['district'].setValue(this.customerDetail.location.district);
        this.shippingInfoForm.controls['province'].setValue(this.customerDetail.location.province);
        this.shippingInfoForm.controls['postalCode'].setValue(this.customerDetail.location.postCode);
        this.shippingInfoForm.controls['city'].setValue(this.customerDetail.location.city);
        // this.shippingInfoForm.controls['country'].setValue(this.customerDetail.location.country);
      }
    }
  }

  ngOnDestroy() {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  getShippingInfoFormGroup(): FormGroup {
    const shippinginfoFormGroup = this.leadFormBuilder.group({
      name: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      phoneNo: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      address: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      // country: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      //
      postalCode: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      district: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      province: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
      city: [{ value: '', disabled: this.stepIndex === 1 || this.stepIndex === 5 }, Validators.required],
    });
    return shippinginfoFormGroup;
  }

  changeHandler(field: string): void {
    this.selectedField = field;
    const customerFormControl = this.shippingInfoForm.get(field);
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

  selectSuggestion(value: { city?: string; amphoe: string; district: string; post_code: string; province: string }): void {
    this.shippingInfoForm.controls['district'].setValue(value.district);
    this.shippingInfoForm.controls['province'].setValue(value.province);
    this.shippingInfoForm.controls['postalCode'].setValue(value.post_code);
    this.shippingInfoForm.controls['city'].setValue(value.amphoe);
  }
}
