import { ChangeDetectorRef, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { MatTabGroup } from '@angular/material/tabs';
import { CustomerCompanyInputFull, CustomerCompanyShippingInput } from '@reactor-room/itopplus-model-lib';
import { CustomerCompaniesService } from '../customer-companies.service';

@Component({
  selector: 'reactor-room-add-company-dialog',
  templateUrl: './add-company-dialog.component.html',
  styleUrls: ['./add-company-dialog.component.scss'],
})
export class AddCompanyDialogComponent implements OnInit {
  companyForm = new FormGroup({});
  @ViewChild('tabs', { static: false }) tabs: MatTabGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { isEdit: boolean; id: string },
    private fb: FormBuilder,
    private cd: ChangeDetectorRef,
    public dialogRef: MatDialogRef<AddCompanyDialogComponent>,
    public ccService: CustomerCompaniesService,
  ) {}

  ngOnInit(): void {}

  validateAll(f: FormGroup): void {
    Object.keys(f.controls).forEach((field) => {
      const control = f.get(field) as FormGroup;
      if (control.controls) {
        this.validateAll(control);
      }
      control.markAsTouched({ onlySelf: true });
    });
  }

  saveCustomerCompany(): void {
    this.validateAll(this.companyForm);
    const {
      stored_members,
      updated_members,
      shipping,
      info: {
        location: { city: sub_district, province, district, post_code },
        address,
        branch_id,
        branch_name,
        company_logo,
        company_logo_file,
        company_name,
        country,
        email,
        fax,
        id,
        phone_number,
        tax_id,
      },
    } = this.companyForm.value;

    const param: CustomerCompanyInputFull = {
      stored_members,
      updated_members,
      shipping,
      info: {
        location: { city: sub_district, province, district, post_code },
        address,
        branch_id,
        branch_name,
        ...(company_logo.length < 400 && { company_logo }),
        ...(company_logo_file && { company_logo_file }),
        company_name,
        country,
        email,
        fax,
        id,
        phone_number,
        tax_id,
      },
    };

    if (!this.companyForm.controls.shipping.valid) {
      this.tabs.selectedIndex = 1;
    }

    if (!this.companyForm.controls.info.valid) {
      this.tabs.selectedIndex = 0;
    }

    if (this.companyForm.valid) {
      const actionHandler = this.data?.isEdit ? this.ccService.updateCustomerCompany(param) : this.ccService.saveCustomerCompany(param);

      actionHandler.subscribe(
        (result) => {
          this.dialogRef.close(result);
        },
        (err) => console.log('error:', err),
      );
    }
  }

  updateShipping(e: CustomerCompanyShippingInput): void {
    const location = this.companyForm?.get('shipping')?.get('location');
    const shipping = this.companyForm?.get('shipping');

    if (shipping?.value?.use_company_address) {
      location.enable();
      shipping.patchValue(e);
      setTimeout(() => location.disable({ onlySelf: true }), 10);
    }
  }
}
