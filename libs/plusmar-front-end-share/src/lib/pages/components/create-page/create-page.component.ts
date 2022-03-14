import { Component, ElementRef, OnInit, ViewChild, ViewEncapsulation } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ImageHelper } from '@reactor-room/itopplus-front-end-helpers';
@Component({
  selector: 'reactor-room-create-page',
  templateUrl: './create-page.component.html',
  styleUrls: ['./create-page.component.scss'],
  encapsulation: ViewEncapsulation.None,
  providers: [ImageHelper],
})
export class CreatePageComponent implements OnInit {
  @ViewChild('fileUpload', { static: false }) fileUpload: ElementRef;
  createPageForm: FormGroup;
  imagePath = 'assets/img/customer/customer_image_default.png';
  defaultImage = 'assets/img/customer/customer_image_default.png';
  headingTitle = 'Create New Shop';

  // @Input() headerActive = true as boolean;

  districtData = [
    { value: 'steak-0', viewValue: 'Steak' },
    { value: 'pizza-1', viewValue: 'Pizza' },
    { value: 'tacos-2', viewValue: 'Tacos' },
  ];

  socialData = [
    { imgUrl: 'assets/img/social/facebook.png', label: 'Facebook', status: false, controlName: 'Facebook', data: '' },
    { imgUrl: 'assets/img/social/line.png', label: 'Line', status: false, controlName: 'Line', data: '' },
    { imgUrl: 'assets/img/social/instagram.png', label: 'Instagram', status: false, controlName: 'Instagram', data: '' },
    { imgUrl: 'assets/img/social/twitter.png', label: 'Twitter', status: false, controlName: 'Twitter', data: '' },
    { imgUrl: 'assets/img/social/google.png', label: 'Google', status: false, controlName: 'Google', data: '' },
    { imgUrl: 'assets/img/social/youtube.png', label: 'Youtube', status: false, controlName: 'Youtube', data: '' },
  ];
  nameValidationMessage: string;
  faceBookNickNameValidationMessage: string;
  phoneValidationMessage: string;
  emailValidationMessage: string;
  addressValidationMessage: string;
  districtValidationMessage: string;
  provinceValidationMessage: string;
  postalCodeValidationMessage: string;
  countryValidationMessage: string;

  // private validationMessages = validationMessages;

  constructor(private router: Router, private formBuilder: FormBuilder, private imageHelper: ImageHelper, private dialog: MatDialog) {}

  ngOnInit(): void {
    const customerID = (Math.random() * 1e32).toString(36);
    this.createPageForm = this.formBuilder.group({
      id: customerID,
      customerType: ['low', [Validators.required]],
      name: ['', [Validators.required, Validators.minLength(3)]],
      // phoneNumber: [null, [phoneInitial(), Validators.required, Validators.minLength(10), Validators.pattern('^[0-9]*$'), Validators.maxLength(10)]],
      email: ['', [Validators.required, Validators.email]],
      address: ['', [Validators.required]],
      district: ['', [Validators.required]],
      province: ['', [Validators.required]],
      postalCode: ['', [Validators.required, Validators.pattern('^[0-9]*$')]],
      country: ['', [Validators.required]],
      picture: [],
      notes: [],
      social: this.formBuilder.group({
        Facebook: '',
        Line: '',
        Instagram: '',
        Twitter: '',
        Google: '',
        Youtube: '',
      }),
      Facebook: this.formBuilder.group({
        nickname: ['', [Validators.required, Validators.minLength(2)]],
      }),
    });
  }

  clearProfilePic(): void {
    this.imagePath = this.defaultImage;
    this.createPageForm.patchValue({ picture: null });
  }

  onClickUpload(): void {
    const fileUpload = this.fileUpload.nativeElement;
    fileUpload.onchange = () => {
      const file = fileUpload.files[0];
      this.imageHelper.preview(file, '/assets/setting/u71.svg').subscribe((result) => {
        this.imagePath = result;
      });
      this.createPageForm.patchValue({ picture: file });
      this.createPageForm.updateValueAndValidity();
    };
    fileUpload.click();
  }

  save(): void {}

  cancelCreateAction() {
    this.resetForm();
    void this.router.navigate(['customer/list']);
  }

  resetForm(): void {
    this.createPageForm.markAsPristine();
    this.createPageForm.markAsUntouched();
    this.createPageForm.reset();
    this.createPageForm.patchValue({ customerType: 'low' });
    this.clearProfilePic();
    this.resetSocialNetwork();
    this.resetErrorMessages();
  }

  resetErrorMessages(): void {
    this.nameValidationMessage = '';
    this.faceBookNickNameValidationMessage = '';
    this.phoneValidationMessage = '';
    this.emailValidationMessage = '';
    this.addressValidationMessage = '';
    this.districtValidationMessage = '';
    this.provinceValidationMessage = '';
    this.postalCodeValidationMessage = '';
    this.countryValidationMessage = '';
  }

  resetSocialNetwork(): void {}

  openDialog(): void {}

  settingSocialData(socialData): void {}

  showErrorMessage(controlName: string, errorMessage: string) {
    switch (controlName) {
      case 'name':
        this.nameValidationMessage = errorMessage;
        break;
      case 'Facebook.nickname':
        this.faceBookNickNameValidationMessage = errorMessage;
        break;
      case 'phoneNumber':
        this.phoneValidationMessage = errorMessage;
        break;
      case 'email':
        this.emailValidationMessage = errorMessage;
        break;
      case 'address':
        this.addressValidationMessage = errorMessage;
        break;
      case 'district':
        this.districtValidationMessage = errorMessage;
        break;
      case 'province':
        this.provinceValidationMessage = errorMessage;
        break;
      case 'postalCode':
        this.postalCodeValidationMessage = errorMessage;
        break;
      case 'country':
        this.countryValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }
}
