import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { ICustomerAddressData } from '@reactor-room/itopplus-model-lib';
import { isImageValid, PhoneNumberValidators } from '@reactor-room/itopplus-front-end-helpers';
import { MatDialogRef } from '@angular/material/dialog';
import { AddCompanyDialogComponent } from '../add-company-dialog.component';
import { CustomerCompaniesService } from '../../customer-companies.service';
import { Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

const imageLimitSize = 1048576;

@Component({
  selector: 'reactor-room-company-info',
  templateUrl: './company-info.component.html',
  styleUrls: ['./company-info.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class CompanyInfoComponent implements OnInit, OnDestroy {
  @Input() dialogRef: MatDialogRef<AddCompanyDialogComponent>;

  companyInfoForm: FormGroup;
  parentForm: FormGroup;
  @Output() formChanged = new EventEmitter();
  addressFields: ICustomerAddressData[] = [
    { value: null, field: 'post_code', label: this.translate.instant('Post code'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'city', label: this.translate.instant('City'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'district', label: this.translate.instant('District'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'province', label: this.translate.instant('Province'), validator: [Validators.required], errorMessage: '' },
  ];
  subscription: Subscription;
  subscription2: Subscription;

  constructor(public translate: TranslateService, private parentFormDirective: FormGroupDirective, private fb: FormBuilder, public ccService: CustomerCompaniesService) {
    this.initForm();
    setTimeout(() => {
      this.updateForm();
      this.attachFormToParent();
      this.setChangesListener();
    }, 100);
  }

  ngOnInit(): void {}

  initForm(): void {
    this.companyInfoForm = this.fb.group({
      id: [''],
      company_name: ['', Validators.required],
      company_logo: [''],
      company_logo_file: ['', this.sizeExceededValidator],
      branch_name: ['', Validators.required],
      branch_id: ['', Validators.required],
      tax_id: [null], // POSTGRES tax_id foreign key
      phone_number: ['', [Validators.required, PhoneNumberValidators.phoneInitial()]],
      email: ['', [Validators.required, Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      fax: [''],
      country: ['Thailand', Validators.required],
      address: [''],
    });
  }

  attachFormToParent(): void {
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('info', this.companyInfoForm);
  }

  ngOnDestroy(): void {
    this.subscription.unsubscribe();
    this.subscription2.unsubscribe();
  }

  setChangesListener(): void {
    this.subscription = this.companyInfoForm.valueChanges.subscribe((value) => {
      // send to parent, update shipping address
      this.formChanged.emit({
        location: {
          city: value?.location?.city,
          province: value?.location?.province,
          district: value?.location?.district,
          post_code: value?.location?.post_code,
        },
        shipping_address: value?.address,
        shipping_country: value?.country,
        shipping_email: value?.email,
        shipping_fax: value?.fax,
        shipping_phone_number: value?.phone_number,
      });
    });
  }

  updateForm(): void {
    this.subscription2 = this.ccService.companyFullInfo.subscribe((result) => {
      if (result) {
        this.companyInfoForm.patchValue({
          id: result.id || '',
          company_name: result.company_name || '',
          company_logo: result.company_logo || '',
          company_logo_file: '',
          branch_name: result.branch_name,
          branch_id: result.branch_id,
          tax_id: result.tax_id,
          phone_number: result.phone_number || '',
          email: result.email || '',
          fax: result.fax,
          address: result.address || '',
          location: {
            post_code: result.post_code || '',
            city: result.city || '',
            district: result.district || '',
            province: result.province || '',
          },
          country: result.country || '',
        });
      }
    });
  }

  sizeExceededValidator(control: AbstractControl): { [key: string]: boolean } | null {
    return control?.value?.size > imageLimitSize ? { sizeExceeded: true } : null;
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

  onFileChange(event: Event): void {
    const file = (event.target as HTMLInputElement).files[0];
    if ((event.target as HTMLInputElement).files && file) {
      const reader = new FileReader();

      reader.readAsDataURL(file);

      reader.onload = (loaded) => {
        isImageValid(loaded.target.result as string, (exists) => {
          if (exists) {
            this.companyInfoForm.controls['company_logo'].setValue(loaded.target.result);
            this.companyInfoForm.controls['company_logo_file'].setValue(file);
          } else {
            this.companyInfoForm.controls['company_logo_file'].setErrors({ wrongType: true });
          }
        });
      };
    }
  }

  removeCompanyLogo(e: Event): void {
    e.stopPropagation();
    e.preventDefault();
    this.companyInfoForm.controls['company_logo'].setValue('');
  }
}
