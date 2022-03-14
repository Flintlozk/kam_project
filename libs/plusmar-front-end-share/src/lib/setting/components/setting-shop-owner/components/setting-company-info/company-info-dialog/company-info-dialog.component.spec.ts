import { CommonModule } from '@angular/common';
import { FormControl, FormGroup } from '@angular/forms';
import { MatTabsModule } from '@angular/material/tabs';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { TranslateModule } from '@ngx-translate/core';
import { CompanyInfoDialogComponent } from './company-info-dialog.component';

describe('CompanyInfoDialogComponent', () => {
  let spectator: Spectator<CompanyInfoDialogComponent>;
  const createComponent = createComponentFactory({
    component: CompanyInfoDialogComponent,
    declarations: [CompanyInfoDialogComponent],
    imports: [CommonModule, TranslateModule.forRoot(), MatTabsModule],
  });

  const companyInfoForm: FormGroup = new FormGroup({
    company_name: new FormControl(''),
    company_logo: new FormControl(''),
    company_logo_file: new FormControl(''),
    branch_name: new FormControl(''),
    branch_id: new FormControl(''),
    tax_identification_number: new FormControl(''),
    tax_id: new FormControl(''),
    phone_number: new FormControl(''),
    email: new FormControl(''),
    fax: new FormControl(''),
    country: new FormControl(''),
    address: new FormControl(''),
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        companyInfoForm,
      },
    });
  });

  it.skip('should create', () => {
    expect(spectator).toBeTruthy();
  });
});
