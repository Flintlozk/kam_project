import { ChangeDetectorRef, Component, ElementRef, Inject, Input, OnDestroy, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { ImageHelper, isMobile, PhoneNumberValidators } from '@reactor-room/itopplus-front-end-helpers';
import { AudiencePlatformType } from '@reactor-room/model-lib';
import { CustomerTagAddEditDialogComponent } from '@reactor-room/plusmar-front-end-share/customer/components/customer-tag-add-edit-dialog/customer-tag-add-edit-dialog.component';
import { CustomerService } from '@reactor-room/plusmar-front-end-share/services/customer.service';
import { RouteService } from '@reactor-room/plusmar-front-end-share/services/route.service';
import { CustomerCompany, CUSTOMER_TAG_COLOR, ICustomerAddressData, ICustomerTagCRUD, ICustomerTemp, ICustomerUpdateInfoInput } from '@reactor-room/itopplus-model-lib';
import _, { clone } from 'lodash';
import { Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { validationMessages } from './customer-validation';

interface SocialData {
  imgUrl: string;
  label: string;
  status: boolean;
  controlName: string;
  data: string;
}

@Component({
  selector: 'reactor-room-customer-new',
  templateUrl: './customer-new.component.html',
  styleUrls: ['./customer-new.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ImageHelper],
})
export class CustomerNewComponent implements OnInit, OnDestroy {
  audiencePlatformType = AudiencePlatformType;
  customerTags: ICustomerTagCRUD[];
  customerTagColorEnum = CUSTOMER_TAG_COLOR;
  isSavedClicked = false;

  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;

  customer: ICustomerTemp;
  customerForm: FormGroup; // ICustomerTemp

  imagePath = 'assets/img/customer/customer_error.svg';
  defaultImage = 'assets/img/customer/customer_error.svg';

  @Input() headerActive = true as boolean;
  @Input() customerId;

  addressFields: ICustomerAddressData[] = [
    { value: null, field: 'post_code', label: this.translate.instant('Post code'), validator: [], errorMessage: '' },
    { value: null, field: 'district', label: this.translate.instant('District'), validator: [], errorMessage: '' },
    { value: null, field: 'city', label: this.translate.instant('City'), validator: [], errorMessage: '' },
    { value: null, field: 'province', label: this.translate.instant('Province'), validator: [], errorMessage: '' },
  ];

  socialData: SocialData[] = [
    { imgUrl: 'assets/img/social/facebook.svg', label: 'Facebook', status: false, controlName: 'Facebook', data: '' },
    { imgUrl: 'assets/img/social/line.svg', label: 'Line', status: false, controlName: 'Line', data: '' },
    { imgUrl: 'assets/img/social/instagram.svg', label: 'Instagram', status: false, controlName: 'Instagram', data: '' },
    { imgUrl: 'assets/img/social/twitter.svg', label: 'Twitter', status: false, controlName: 'Twitter', data: '' },
    { imgUrl: 'assets/img/social/google.svg', label: 'Google', status: false, controlName: 'Google', data: '' },
    { imgUrl: 'assets/img/social/youtube.svg', label: 'Youtube', status: false, controlName: 'Youtube', data: '' },
  ];

  nicknameValidationMessage: string;
  first_nameValidationMessage: string;
  last_nameValidationMessage: string;
  phone_numberValidationMessage: string;
  post_codeValidationMessage: string;
  emailValidationMessage: string;
  addressValidationMessage: string;
  districtValidationMessage: string;
  provinceValidationMessage: string;
  countryValidationMessage: string;
  aliasesValidationMessage: string;

  submissionResult = {
    title: '',
    text: '',
  };
  userIdParam = null;
  startDate = '01/01/2020 12:45' as string;
  social = { Facebook: '', Line: '', Instagram: '', Twitter: '', Google: '', Youtube: '' };
  destroy$: Subject<boolean> = new Subject<boolean>();
  private validationMessages = validationMessages;

  constructor(
    public CDR: ChangeDetectorRef,
    private route: ActivatedRoute,
    private customerService: CustomerService,
    private fb: FormBuilder,
    private imageHelper: ImageHelper,
    private dialog: MatDialog,
    public translate: TranslateService,
    private router: Router,
    private routeService: RouteService,
  ) {
    this.initForm();
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.unsubscribe();
  }

  ngOnInit(): void {
    this.route.params.pipe(takeUntil(this.destroy$)).subscribe((params: { id: string }) => {
      this.userIdParam = +params['id']; // (+) converts string 'id' to a number
      !isNaN(this.userIdParam) ? this.initEditCustomer() : window.history.go(-1);
    });
  }

  initEditCustomer(): void {
    this.customerService
      .getCustomerById(this.userIdParam)
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        (result) => {
          if (!result) window.history.go(-1);
          this.patchForm(result);
        },
        (err) => {
          console.log({ err });
        },
      );
  }

  patchForm(result: ICustomerTemp): void {
    this.customer = result;
    this.customerTags = result?.tags;
    this.startDate = String(result.created_at);
    if (result?.profile_pic) this.imagePath = result.profile_pic;

    const info = {
      first_name: result.first_name,
      last_name: result.last_name,
      phone_number: result.phone_number,
      email: result.email,
      profile_pic: result.profile_pic,
      address: result.location?.address ? result.location?.address : '',
      platform: result.platform,
      aliases: result.aliases,
    };

    this.customerForm.setValue({
      ...info,
      ...{
        location: result.location
          ? { city: result.location?.city, district: result.location?.district, post_code: result.location?.post_code, province: result.location?.province }
          : { city: null, district: null, post_code: null, province: null },
      },
    });
  }

  initForm(): void {
    this.customerForm = this.fb.group({
      first_name: ['', [Validators.minLength(3)]],
      last_name: ['', [Validators.minLength(3)]],
      phone_number: ['', [PhoneNumberValidators.phoneInitial()]],
      email: ['', [Validators.pattern('^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$')]],
      profile_pic: [null],
      address: [''],
      platform: [''],
      aliases: [null],
    });
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.customerForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(800), takeUntil(this.destroy$)).subscribe(() => this.setErrorMessage(customerFormControl, controlName));
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

  handleAddressValue(addressValues: ICustomerAddressData): void {
    this.customerForm.markAsPristine();
    this.customerForm.patchValue(addressValues);
  }

  saveCustomerForm(): void {
    this.save();
  }

  getSaveObject(): ICustomerUpdateInfoInput {
    const value = this.customerForm.value;
    return {
      id: Number(this.customer.id),
      first_name: value.first_name !== null ? value.first_name.trim() : value.first_name,
      last_name: value.last_name !== null ? value.last_name.trim() : value.last_name,
      phone_number: value.phone_number !== null ? value.phone_number.trim() : value.phone_number,
      email: value.email !== null ? value.email.trim() : value.email,
      aliases: value.aliases !== null ? value.aliases.trim() : value.aliases,
      profile_pic: value.profile_pic,
      location: {
        ...value.location,
        address: value.address,
        country: value.country,
      },
    };
  }

  save(): void {
    this.isSavedClicked = true;
    if (this.customerForm.valid) {
      const customerData = this.getSaveObject();
      this.customerService
        .updateCustomerByForm(customerData)
        .pipe(takeUntil(this.destroy$))
        .subscribe(
          (result) => {
            this.resetForm();
            if (this.userIdParam) {
              let text = '';
              result?.status === 200 ? (text = 'Updated Successfully') : (text = 'Error in updating');
              this.openSuccessDialog({ text, title: 'Update customer' });
            } else {
              this.openSuccessDialog({ text: result.value, title: 'Add customer' });
            }
          },
          (err) => {
            console.log(err.message);
            console.log(err);
            this.openSuccessDialog({ text: err.message, title: 'Error' }, true);
          },
        );
    } else {
      this.showCustomerFormErrors();
      throw new Error('Customer form is not valid. Try again');
    }
  }

  goBack(): void {
    const routeHistory = this.routeService.routeHistory.getValue();
    if (routeHistory === '/') {
      void this.router.navigate(['/customers/details/list/1']);
    } else {
      this.routeService.routeHistory.next('/');
      void this.router.navigate([routeHistory]);
    }
  }

  cancelCreateAction(): void {
    this.resetForm();
    this.goBack();
  }

  resetForm(): void {
    if (!this.userIdParam) {
      this.customerForm.markAsPristine();
      this.customerForm.markAsUntouched();
      this.customerForm.reset();
      this.clearProfilePic();
      this.resetSocialNetwork();
      this.resetErrorMessages();
    }
  }

  resetErrorMessages(): void {
    this.first_nameValidationMessage = '';
    this.last_nameValidationMessage = '';
    this.phone_numberValidationMessage = '';
    this.post_codeValidationMessage = '';
    this.nicknameValidationMessage = '';
    this.emailValidationMessage = '';
    this.addressValidationMessage = '';
    this.districtValidationMessage = '';
    this.provinceValidationMessage = '';
    this.countryValidationMessage = '';
    this.aliasesValidationMessage = '';
  }

  resetSocialNetwork(): void {
    this.socialData.forEach((social) => {
      social.data = '';
      social.status = false;
    });
  }

  openCustomerTagDialog(): void {
    const dialogRef = this.dialog.open(CustomerTagAddEditDialogComponent, {
      width: '100%',
      data: +this.userIdParam,
    });

    dialogRef
      .afterClosed()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result: boolean) => {
        if (result) this.initEditCustomer();
      });
  }

  openSuccessDialog(message: { text: string; title: string }, isError = false): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: this.submissionResult,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  settingSocialData(socialData): void {
    // eslint-disable-next-line prefer-const
    for (let [key, value] of Object.entries(socialData)) {
      value = value.toString().trim();
      const socialKeys = `social.${key}`;
      this.customerForm.get(socialKeys).patchValue(value);
      // tslint:disable-next-line: no-shadowed-variable
      const socialData = this.socialData.find((social) => social.controlName === key);
      socialData.status = !!value;
      socialData.data = value.toString();
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    this[`${controlName}ValidationMessage`] = this.translate.instant(errorMessage);
  }

  showCustomerFormErrors(): void {
    const customerControls = this.customerForm.controls;
    _.forOwn(customerControls, (control, key) => {
      if (control instanceof FormGroup) {
        const childFormGroup = control as FormGroup;
        const childFormControls = childFormGroup.controls;
        _.forOwn(childFormControls, (childFormControl, childKey) => {
          const childFormControlName = `${key}.${childKey}`;
          this.setErrorMessageOnSubmit(childFormControl, childFormControlName);
        });
      } else {
        this.setErrorMessageOnSubmit(control, key);
      }
    });
  }

  setErrorMessageOnSubmit(c: AbstractControl, controlName: string): void {
    if (c.errors) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');

      this.showErrorMessage(controlName, errorMessage);
    }
  }

  previousUrl(): void {
    this.goBack();
  }

  clearProfilePic(): void {
    this.imagePath = this.defaultImage;
    this.customerForm.patchValue({ picture: null });
  }

  onClickUpload(): void {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      const file = fileUpload.files[0];
      this.imageHelper
        .preview(file, '/assets/setting/u71.svg')
        .pipe(takeUntil(this.destroy$))
        .subscribe((result) => {
          this.imagePath = result;
        });
      this.customerForm.patchValue({ picture: file });
      this.customerForm.updateValueAndValidity();
    };
    fileUpload.click();
  }
}

@Component({
  selector: 'reactor-room-add-social-dialog',
  templateUrl: 'add-social-dialog.component.html',
  styleUrls: ['customer-new.component.scss'],
})
export class AddSocialDialogComponent implements OnInit, OnDestroy {
  socialForm: FormGroup;
  socialObj = {
    Facebook: '',
    Line: '',
    Instagram: '',
    Twitter: '',
    Google: '',
    Youtube: '',
  };
  destroy$ = new Subject();

  constructor(private dialogRef: MatDialogRef<AddSocialDialogComponent>, @Inject(MAT_DIALOG_DATA) public data: any, private socialFormBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.initSocialFormValues();
    this.socialForm = this.socialFormBuilder.group({
      ...this.socialObj,
    });
  }

  saveSocial(): void {
    this.dialogRef.close(this.socialForm.value);
  }

  onNoClick(): void {
    this.dialogRef.close(this.socialForm.value);
  }

  initSocialFormValues(): void {
    this.data.forEach((social) => {
      const socialItem = social;
      if (socialItem.data) {
        this.socialObj[socialItem.controlName] = socialItem.data;
      }
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
  }
}
