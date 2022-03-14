import { ChangeDetectorRef, Component, Input, OnDestroy, OnInit, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { MatDialogRef } from '@angular/material/dialog';
import { TranslateService } from '@ngx-translate/core';
import { PhoneNumberValidators } from '@reactor-room/itopplus-front-end-helpers';
import { ICustomerAddressData, RadioFields } from '@reactor-room/itopplus-model-lib';
import { Subscription } from 'rxjs';
import { CustomerCompaniesService } from '../../customer-companies.service';
import { AddCompanyDialogComponent } from '../add-company-dialog.component';

@Component({
  selector: 'reactor-room-shipping-info',
  templateUrl: './shipping-info.component.html',
  styleUrls: ['./shipping-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class ShippingInfoComponent implements OnInit, OnDestroy {
  @Input() dialogRef: MatDialogRef<AddCompanyDialogComponent>;
  shippingInfoForm: FormGroup;
  parentForm: FormGroup;
  addressFields: ICustomerAddressData[] = [
    { value: null, field: 'post_code', label: this.translate.instant('Post code'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'district', label: this.translate.instant('District'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'city', label: this.translate.instant('City'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'province', label: this.translate.instant('Province'), validator: [Validators.required], errorMessage: '' },
  ];
  radioFields: RadioFields[] = [
    { value: true, label: 'Yes', validator: [Validators.required], errorMessage: '' },
    { value: false, label: 'No', validator: [Validators.required], errorMessage: '' },
  ];
  subscription: Subscription;
  constructor(
    public translate: TranslateService,
    private parentFormDirective: FormGroupDirective,
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public ccService: CustomerCompaniesService,
  ) {
    this.initForm();
    setTimeout(() => {
      this.updateForm();
      this.attachFormToParent();
    }, 100);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
  }

  ngOnInit(): void {}

  initForm(): void {
    this.shippingInfoForm = this.fb.group({
      shipping_email: ['', [Validators.required, Validators.email]],
      shipping_phone_number: ['', [Validators.required, PhoneNumberValidators.phoneInitial()]],
      shipping_fax: [''],
      shipping_country: ['Thailand', Validators.required],
      shipping_address: [''],
    });
  }

  attachFormToParent(): void {
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('shipping', this.shippingInfoForm);
  }

  updateForm(): void {
    this.subscription = this.ccService.companyFullInfo.subscribe((result) => {
      if (result) {
        this.shippingInfoForm.patchValue({
          use_company_address: result.use_company_address || false,
          shipping_email: result.shipping_email || result.email || '',
          shipping_phone_number: result.shipping_phone_number || result.phone_number || '',
          shipping_fax: result.shipping_fax || result.fax || '',
          shipping_country: result.shipping_country || result.country || '',
          shipping_address: result.shipping_address || result.address || '',
          location: {
            post_code: result?.shipping?.post_code || result?.post_code || '',
            city: result.shipping?.city || result?.city || '',
            district: result.shipping?.district || result?.district || '',
            province: result.shipping?.province || result?.province || '',
          },
        });
      }
    });
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

  close(): void {
    this.dialogRef.close(this.shippingInfoForm.value);
  }

  // TODO:
  removeCompanyLogo(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.shippingInfoForm.controls['company_logo'].setValue('');
  }
}
