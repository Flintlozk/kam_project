import { Component, Inject, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

import { isImageValid } from '@reactor-room/itopplus-front-end-helpers';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { EnumAuthScope, ICustomerAddressData, IGetShopProfile } from '@reactor-room/itopplus-model-lib';
import { SettingModuleService } from '@reactor-room/plusmar-front-end-share/setting/setting.module.service';

const imageLimitSize = 1048576;
@Component({
  selector: 'reactor-room-company-info-dialog',
  templateUrl: './company-info-dialog.component.html',
  styleUrls: ['./company-info-dialog.component.scss'],
})
export class CompanyInfoDialogComponent implements OnInit {
  @Input() shopDetails: IGetShopProfile;
  companyInfoForm: FormGroup;
  addressFields: ICustomerAddressData[] = [
    { value: null, field: 'post_code', label: 'Post code', validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'city', label: 'City', validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'province', label: 'Province', validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'district', label: 'District', validator: [Validators.required], errorMessage: '' },
  ];
  theme: string;
  themeType = EnumAuthScope;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CompanyInfoDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private settingModuleService: SettingModuleService,
    private settingsService: SettingsService,
  ) {
    this.initForm();
    setTimeout(() => {
      this.updateCompanyForm();
    }, 100);
  }

  ngOnInit(): void {
    this.theme = this.data;
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
  initForm(): void {
    this.companyInfoForm = this.fb.group({
      company_name: ['', Validators.required],
      company_logo: [''],
      company_logo_file: ['', this.sizeExceededValidator],
      branch_name: ['', Validators.required],
      branch_id: ['', Validators.required],
      tax_identification_number: ['', Validators.required],
      tax_id: [null], // POSTGRES tax_id foreign key
      phone_number: ['', Validators.required],
      email: ['', Validators.compose([Validators.required, Validators.pattern('[A-Za-z0-9._-]+@[A-Za-z0-9._-]+\\.[a-z]{2,3}')])],
      fax: [''],
      country: ['Thailand', Validators.required],
      address: [''],
    });
  }

  updateCompanyForm(): void {
    this.settingModuleService.fetchCompanyInfo.subscribe((result) => {
      if (result) {
        this.companyInfoForm.patchValue({
          company_name: result.company_name || this.shopDetails.page_name || '',
          company_logo: result.company_logo || this.shopDetails.shop_picture || '',
          company_logo_file: '',
          branch_name: result.branch_name,
          branch_id: result.branch_id,
          tax_identification_number: result.tax_identification_number,
          tax_id: result.tax_id, // POSTGRES tax_id foreign key
          phone_number: result.phone_number || this.shopDetails.tel || '',
          email: result.email || this.shopDetails.email || '',
          fax: result.fax,
          address: result.address || this.shopDetails.address || '',
          location: {
            post_code: result.post_code || this.shopDetails.post_code || '',
            city: result.sub_district || this.shopDetails.amphoe || '',
            district: result.district || this.shopDetails.district || '',
            province: result.province || this.shopDetails.province || '',
          },
          country: result.country || this.shopDetails.country || '',
        });
      }
    });
  }

  save(): void {
    this.validateAll(this.companyInfoForm);
    if (this.companyInfoForm.valid) {
      const {
        address,
        branch_id,
        branch_name,
        company_logo,
        company_logo_file,
        company_name,
        country,
        email,
        fax,
        location: { city: sub_district, province, district, post_code },
        phone_number,
        tax_identification_number,
        tax_id, // POSTGRES tax_id foreign key
      } = this.companyInfoForm.value;
      const param = {
        address,
        branch_id,
        branch_name,
        ...(company_logo.length < 400 && { company_logo }),
        ...(company_logo_file && { company_logo_file }),
        company_name,
        country,
        email,
        fax,
        sub_district,
        province,
        district,
        post_code,
        phone_number,
        tax_identification_number,
        tax_id, // POSTGRES tax_id foreign key
      };

      // if company_name exists - update, if not - save
      const actionHandler = this.settingModuleService.fetchCompanyInfo.getValue().company_name
        ? this.settingsService.updateCompanyInfo(param)
        : this.settingsService.saveCompanyInfo(param);

      actionHandler.subscribe(() => {
        this.close();
      });
    }
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

  close(): void {
    this.dialogRef.close(this.companyInfoForm.value);
  }
}
