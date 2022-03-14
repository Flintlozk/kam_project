import { Location } from '@angular/common';
import { Component, ElementRef, EventEmitter, Input, NgZone, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ValidatorFn, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { ActivatedRoute, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CMSUserService } from '@reactor-room/cms-frontend-services-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile, PhoneNumberValidators } from '@reactor-room/itopplus-front-end-helpers';
import {
  EnumAuthError,
  EnumAuthScope,
  EnumPageMemberType,
  EnumUserSubscriptionType,
  IAddShopSocialProfile,
  ICompanyInfo,
  ICustomerAddressData,
  IFacebookPageResponse,
  IGetShopProfile,
  ILineResponse,
  ISocialCard,
  ISocialConnect,
  ISocialConnectResponse,
  ISubscription,
  SocialModeTypes,
  SocialTypes,
} from '@reactor-room/itopplus-model-lib';
import { ITextTitle } from '@reactor-room/model-lib';
import { PagesService } from '@reactor-room/plusmar-front-end-share/services/facebook/pages/pages.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { ToastrService } from 'ngx-toastr';
import { EMPTY, Subject, Subscription } from 'rxjs';
import { debounceTime, finalize, switchMap, takeUntil } from 'rxjs/operators';
import { SettingModuleService } from '../../../../setting.module.service';
import { CompanyInfoDialogComponent } from '../setting-company-info/company-info-dialog/company-info-dialog.component';
import { SettingLineDialogComponent } from '../setting-line-dialog/setting-line-dialog.component';
import { SettingShopOwnerDialogComponent } from '../setting-shop-owner-dialog/setting-shop-owner-dialog.component';
import { SettingShopOwnerSocialNetworkComponent } from '../setting-shop-owner-social-network/setting-shop-owner-social-network.component';
import { validationMessages } from './setting-shop-owner-validation';
function validateEmail(): ValidatorFn {
  return (c: { value: string }): { [key: string]: boolean } | null => {
    const { value } = c;
    if (value !== null) {
      // https://github.com/angular/angular/blob/11.0.0/packages/forms/src/validators.ts#L98
      /*eslint-disable */
      const emailFormat =
        /^(?=.{1,254}$)(?=.{1,64}@)[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-zA-Z0-9!#$%&'*+/=?^_`{|}~-]+)*@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;
      /*eslint-enable */
      const emailValidate = emailFormat.test(value);
      if (emailValidate === true) {
        return null;
      } else {
        return { email: false };
      }
    }
  };
}
////:: marketplace functionality commenting now
// const openNewWindow = false;
// const isClosed = new Subject<boolean>();
// let thirdPartyAuthWindow;

// function checkAuthWindow() {
//   if (openNewWindow == true) {
//     if (thirdPartyAuthWindow.closed) {
//       isClosed.next(true);
//     } else {
//       setTimeout(() => {
//         isClosed.next(false);
//         checkAuthWindow();
//       }, 2000);
//     }
//   }
// }

@Component({
  selector: 'reactor-room-setting-shop-owner-detail',
  templateUrl: './setting-shop-owner-detail.component.html',
  styleUrls: ['./setting-shop-owner-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingShopOwnerDetailComponent implements OnInit, OnDestroy {
  @Output() cancel = new EventEmitter<boolean>();
  @Input() inputState: SocialModeTypes;

  destroy$: Subject<boolean> = new Subject<boolean>();
  SocialModeTypes = SocialModeTypes;
  state: SocialModeTypes;
  isOwner = false;
  isLoading = false;
  loadingText = '';
  headingTitle = 'Create New Shop';
  shopOwnerForm: FormGroup;
  subscriptionServiceSubscription: Subscription;
  initProcessing = false;
  currencySelectedStatus = false;
  languageSelectedStatus = false;
  socialFacebook: boolean;
  socialLine: boolean;
  ////:: marketplace functionality commenting now
  // socialShopee: boolean;
  // socialLazada: boolean;
  shopDetail: IGetShopProfile;
  shopNameValidationMessage: string;
  phoneNoValidationMessage: string;
  post_codeValidationMessage: string;
  emailValidationMessage: string;
  addressValidationMessage: string;
  districtValidationMessage: string;
  provinceValidationMessage: string;
  countryValidationMessage: string;
  addressFields: ICustomerAddressData[] = [
    { value: null, field: 'post_code', label: this.translate.instant('Post code'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'district', label: this.translate.instant('District'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'city', label: this.translate.instant('City'), validator: [Validators.required], errorMessage: '' },
    { value: null, field: 'province', label: this.translate.instant('Province'), validator: [Validators.required], errorMessage: '' },
  ];
  currencyData = [
    { imgUrl: 'assets/img/flag/th.svg', title: 'THB (฿) Baht' }, // ! TODO : add Currency Type = THB
    { imgUrl: 'assets/img/flag/en.svg', title: 'USD ($) Dollar' }, // ! TODO : add Currency Type = USD
  ];
  languageData = [
    { imgUrl: 'assets/img/flag/en.svg', title: 'EN - English' }, // ! TODO : add Language Type = EN
    { imgUrl: 'assets/img/flag/th.svg', title: 'TH - Thai' }, // ! TODO : add Language Type = TH
    { imgUrl: 'assets/img/flag/mm.png', title: 'MM : Burmese' }, // ! TODO : add Language Type = MM
    { imgUrl: 'assets/img/flag/vi.png', title: 'VI : Vietnamese' }, // ! TODO : add Language Type = VI
    { imgUrl: 'assets/img/flag/lo.png', title: 'LO : Lao' }, // ! TODO : add Language Type = LO
    { imgUrl: 'assets/img/flag/cnt.png', title: 'CN : Traditional Chinese' }, // ! TODO : add Language Type = CN
    { imgUrl: 'assets/img/flag/cns.png', title: 'CN : Simplified Chinese' }, // ! TODO : add Language Type = CN
    { imgUrl: 'assets/img/flag/tw.png', title: 'TW : Taiwanese' }, // ! TODO : add Language Type = TW
    { imgUrl: 'assets/img/flag/jp.png', title: 'JP : Japanese' }, // ! TODO : add Language Type = JP
    { imgUrl: 'assets/img/flag/ru.svg', title: 'RU : Russian' }, // ! TODO : add Language Type = RU
    { imgUrl: 'assets/img/flag/km.png', title: 'KM : Khmer' }, // ! TODO : add Language Type = KM
    { imgUrl: 'assets/img/flag/de.png', title: 'DE : German' }, // ! TODO : add Language Type = DE
    { imgUrl: 'assets/img/flag/id.svg', title: 'ID : Indonesian' }, // ! TODO : add Language Type = ID
  ];
  country = 'Thailand';
  currencyDefaultData = { imgUrl: 'assets/img/flag/th.svg', title: 'THB (฿) Baht' };
  languageDefaultData = { imgUrl: 'assets/img/flag/th.svg', title: 'TH - Thai' };
  socialConnect = {
    facebook: {
      id: null,
    },
    line: { name: null, picture: null },
    ////:: marketplace functionality commenting now
    // shopee: null,
    // lazada: null,
  } as ISocialConnect;
  companyInfo: ICompanyInfo;
  socialCards: ISocialCard[];
  socialTypes = SocialTypes;
  theme = 'SOCIAL';
  themeType = EnumAuthScope;
  errorTitle = this.translate.instant('Error');
  errorConnect = this.translate.instant('Unable to connect marketplace Try again or Please contact support');

  connectRequestFunc: {
    facebook: () => void;
    line: () => void;
    ////:: marketplace functionality commenting now
    //lazada: () => void; shopee: () => void
  };
  constructor(
    private elm: ElementRef,
    private leadFormBuilder: FormBuilder,
    private dialog: MatDialog,
    private settingsService: SettingsService,
    private pageService: PagesService,
    public translate: TranslateService,
    private router: Router,
    private ngZone: NgZone,
    private activeRoute: ActivatedRoute,
    private subscriptionService: SubscriptionService,
    private cmsSubscriptionService: CMSUserService,
    private settingModuleService: SettingModuleService,
    private location: Location,
    private toastr: ToastrService,
  ) {
    this.getOptionalRouteParams();
    this.initForm();
  }

  private validationMessages = validationMessages;

  ngOnInit(): void {
    this.activeRoute.parent.data.subscribe((data) => {
      if (data['theme']) this.theme = data['theme'];
    });
    this.isLoading = true;
    this.checkUserRole();
    if (this.router.url === '/pages/edit' || this.router.url === '/setting/pages/edit' || this.router.url.includes('/pages/edit;result') || this.router.url === '/create-shop') {
      // if (process.env.NODE_ENV !== 'production') {
      //   this.state = SocialModeTypes.EDIT_DEV;
      // } else {
      this.state = this.inputState ? this.inputState : SocialModeTypes.EDIT;

      // }
      this.headingTitle = this.translate.instant('Edit shop setting');
      this.getShopDetail();
      this.getCompanyInfo();
    } else {
      this.setDefaultShopDetail();
    }
    this.initiateConnectFunctions();

    this.pageService.getPageThirdPartyByPageType(this.socialTypes.LAZADA).subscribe();
  }

  getOptionalRouteParams(): void {
    let result: string | boolean = this.activeRoute.snapshot.paramMap.get('result');
    const source = this.activeRoute.snapshot.paramMap.get('source') as SocialTypes;
    const message = this.activeRoute.snapshot.paramMap.get('message') as SocialTypes;

    if (result && source) {
      result = result === 'true' ? true : false;
      this.showConnectAlert({ result, source, message });
    }
  }

  showConnectAlert({ result, source, message }: ISocialConnectResponse): void {
    const title = source.toUpperCase();
    const succMessage = this.translate.instant('Connection to shop Successful');
    let errMessage = '';
    if (message === 'SELLER_DETAIL_ERROR') {
      errMessage = this.translate.instant('Shop connected but error getting shop details');
    } else if (message === 'SHOP_NOT_VALID') {
      errMessage = this.translate.instant('Shop not valid check shopee marketplace');
    } else {
      errMessage = this.translate.instant('Error connecting shop try again later');
    }
    result ? this.openSocialResponseDialog({ title, text: succMessage }, !result) : this.openSocialResponseDialog({ title, text: errMessage }, result);
  }

  initiateConnectFunctions(): void {
    this.connectRequestFunc = {
      [SocialTypes.FACEBOOK]: this.openDialogFacebookConnect,
      [SocialTypes.LINE]: this.openDialogLineConnect,
      ////:: marketplace functionality commenting now
      // [SocialTypes.LAZADA]: this.openLazadaConnect,
      // [SocialTypes.SHOPEE]: this.openShopeeConnect,
    };
  }

  openDialogFacebookConnect(): void {
    const dialogRef = this.dialog.open(SettingShopOwnerDialogComponent, {
      width: '100%',
      data: this.theme,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result !== undefined) {
        ////:: marketplace functionality commenting now
        // this.setSocialConnectedFormat(result, this.socialConnect.line, this.socialConnect.shopee, this.socialConnect.lazada);
        this.setSocialConnectedFormat(result, this.socialConnect.line);
        this.shopOwnerForm.controls['shopName'].setValue(result.name);
        this.shopOwnerForm.controls['access_token'].setValue(result.access_token);
        this.shopOwnerForm.controls['facebookid'].setValue(result.id);
        this.shopOwnerForm.controls['facebookpic'].setValue(result.picture);
      }
    });
  }

  openDialogLineConnect(): void {
    if (!this.socialConnect.facebook.id) {
      this.openAlertDialog(
        {
          title: "Can't connect !!",
          text: this.translate.instant('Please connect facebook fanpage before connect other platform'),
        },
        true,
      );
      return;
    }
    const dialogRef = this.dialog.open(SettingLineDialogComponent, {
      width: isMobile() ? '90%' : '36%',
      data: this.theme,
    });

    dialogRef.afterClosed().subscribe((result) => {
      if (result != null && result !== undefined && result !== false) {
        const convertToTypeLineResponse = {
          id: result.premiumid,
          picture: result.pictureurl,
          name: result.displayname,
        } as ILineResponse;
        ////:: marketplace functionality commenting now
        //this.setSocialConnectedFormat(this.socialConnect.facebook, convertToTypeLineResponse,this.socialConnect.shopee, this.socialConnect.lazada);
        this.setSocialConnectedFormat(this.socialConnect.facebook, convertToTypeLineResponse);
      }
    });
  }
  ////:: marketplace functionality commenting now
  //setSocialConnectedFormat(facebook: IFacebookPageResponse, line: ILineResponse, shopee: IPagesThirdParty, lazada: IPagesThirdParty): void {
  setSocialConnectedFormat(facebook: IFacebookPageResponse, line: ILineResponse): void {
    const socialConnected = {
      facebook,
      line,
      ////:: marketplace functionality commenting now
      // lazada,
      // shopee,
    } as ISocialConnect;
    this.socialConnect = socialConnected;
  }

  initForm(): void {
    this.shopOwnerForm = this.leadFormBuilder.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      phoneNo: ['', [Validators.required, PhoneNumberValidators.phoneInitial()]],
      shopName: ['', [Validators.required]],
      email: ['', [Validators.required, validateEmail()]],
      facebookid: ['', Validators.required],
      address: ['', Validators.required],
      country: ['', Validators.required],
      facebookpic: [''],
      access_token: [''],
      currency: this.leadFormBuilder.group({
        currencyImgUrl: [''],
        currencyTitle: 'THB (฿) Baht',
      }),
      language: this.leadFormBuilder.group({
        languageImgUrl: [''],
        languageTitle: 'EN - English',
      }),
      socialFacebook: [''],
      socialLine: [''],
      ////:: marketplace functionality commenting now
      // socialShopee: [''],
      // socialLazada: [''],
      basicid: [''],
      channelid: null,
      channelsecret: null,
      channeltoken: null,
      premiumid: null,
      userid: null,
      pictureurl: null,
      displayname: null,
      is_type_edit: false,
    });
  }

  resetErrorMessages(): void {
    this.phoneNoValidationMessage = '';
    this.post_codeValidationMessage = '';
    this.emailValidationMessage = '';
    this.addressValidationMessage = '';
    this.districtValidationMessage = '';
    this.provinceValidationMessage = '';
    this.countryValidationMessage = '';
    this.shopNameValidationMessage = '';
  }

  currencySelectStatusToogle(): void {
    this.currencySelectedStatus = !this.currencySelectedStatus;
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    this[`${controlName}ValidationMessage`] = errorMessage;
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

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.shopOwnerForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(800), takeUntil(this.destroy$)).subscribe(() => this.setErrorMessage(customerFormControl, controlName));
  }

  languageSelectStatusToogle(): void {
    this.languageSelectedStatus = !this.languageSelectedStatus;
  }

  checkFaceBookPageInit(): void {
    if (this.socialConnect.facebook.id === undefined && this.dialog.openDialogs.length < 1) {
      this.openDialogFacebookConnect();
    }
  }

  checkUserRole(): void {
    //TODO:
    //have to get role from cms
    if (this.theme === this.themeType.CMS) {
      this.cmsSubscriptionService.$subscription.subscribe((result) => {
        if (result.role === EnumUserSubscriptionType.OWNER) {
          this.isOwner = true;
        }
      });
    } else {
      this.subscriptionService.$subscription.pipe(takeUntil(this.destroy$)).subscribe((result: ISubscription) => {
        if (result.role !== EnumUserSubscriptionType.OWNER) {
          void this.router.navigateByUrl(`/follows?err=${EnumAuthError.PERMISSION_DENIED}`);
        } else {
          this.isOwner = true;
        }
      });
    }
  }

  openSocialResponseDialog(message: ITextTitle, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
      data: message,
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;

    dialogRef.afterClosed().subscribe(() => window.close());
  }

  openSuccessDialog(message: ITextTitle, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  onCancel(): void {
    if (this.state === SocialModeTypes.CREATE_WIZARD) {
      this.cancel.emit(true);
    } else {
      this.location.back();
    }
  }

  onSave(): void {
    if (this.shopOwnerForm.valid) {
      this.isLoading = true;
      this.updateShop();
    } else {
      const invalid = this.findInvalidControls();
      if (invalid === 'facebookid') {
        this.openSuccessDialog(
          {
            text: this.translate.instant('No FB Page Select'),
            title: this.translate.instant('Error'),
          },
          true,
        );
      }
    }
  }

  updateShop(): void {
    this.settingsService
      .setShopFanPage(this.shopOwnerForm.value, this.state === SocialModeTypes.CREATE_WIZARD)
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe(
        () => {
          if (this.state === SocialModeTypes.CREATE_WIZARD) {
            window.location.reload();
          } else {
            this.resetErrorMessages();
            if (this.theme === this.themeType.CMS) window.location.href = '/setting/shop/owner';
            if (this.theme === this.themeType.SOCIAL) window.location.href = '/setting/owner';
          }
        },
        (err) => {
          console.log('err: ', err);
          this.openSuccessDialog(
            {
              text: this.translate.instant(
                'Something went wrong when trying to update shop detail, please try again later. For more information, please contact us at 02-029-1200',
              ),
              title: this.translate.instant('Error'),
            },
            true,
          );
        },
      );
  }

  findInvalidControls(): string {
    let invalid = '';
    const controls = this.shopOwnerForm.controls;
    for (const name in controls) {
      if (controls[name].invalid) {
        invalid = name;
        break;
      }
    }
    const invalidControl = this.elm.nativeElement.querySelector('[formControlName="' + invalid + '"]');
    if (invalidControl != null) {
      invalidControl.focus();
    }
    return invalid;
  }

  openSocialSetting(): void {
    const dialogRef = this.dialog.open(SettingShopOwnerSocialNetworkComponent, {
      width: '100%',
    });

    dialogRef.afterClosed().subscribe((result: IAddShopSocialProfile) => {
      if (result != null) {
        this.shopOwnerForm.controls['socialFacebook'].setValue(result.socialFacebook);
        this.shopOwnerForm.controls['socialLine'].setValue(result.socialLine);
        ////:: marketplace functionality commenting now
        // this.shopOwnerForm.controls['socialShopee'].setValue(result.socialShopee);
        // this.shopOwnerForm.controls['socialLazada'].setValue(result.socialLazada);
        this.checkSocialValue(result);
        const checkingSocial = {
          social_facebook: result.socialFacebook,
          social_line: result.socialLine,
          ////:: marketplace functionality commenting now
          // social_shopee: result.socialShopee,
          // social_lazada: result.socialLazada,
        };
        this.settingModuleService.fetchSocialNetwork.next(checkingSocial);
      }
    });
  }

  openCompanyInfoSetting(): void {
    const dialogRef = this.dialog.open(CompanyInfoDialogComponent);
    dialogRef.componentInstance.shopDetails = this.shopDetail;
    dialogRef.afterClosed().subscribe((result) => {
      if (result) this.settingModuleService.fetchCompanyInfo.next(result);
    });
  }

  checkSocialValue(data: IAddShopSocialProfile): void {
    if (data) {
      this.socialFacebook = !!data.socialFacebook;
      this.socialLine = !!data.socialLine;
      ////:: marketplace functionality commenting now
      // this.socialShopee = !!data.socialShopee;
      // this.socialLazada = !!data.socialLazada;
    }
  }

  getCompanyInfo(): void {
    this.settingsService.getCompanyInfo().subscribe((companyInfo) => {
      this.companyInfo = companyInfo;
      this.settingModuleService.fetchCompanyInfo.next(companyInfo);
    });
  }

  getShopDetail(): void {
    this.settingsService
      .getShopProfile()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((result) => {
          if (result) {
            this.shopDetail = result;
            this.addressFields = this.addressFields.map((item) => ({ ...item, ...{ value: result[item.field] || null } }));
            return this.settingsService.getSocialConnectStatus();
          } else {
            void this.ngZone.run(() => this.router.navigateByUrl(`/follows?err=${EnumAuthError.UNKNOWN}`));
            return EMPTY;
          }
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((socialConnect: ISocialConnect) => {
        this.socialConnect = socialConnect;
        const social = {
          social_facebook: this.shopDetail.social_facebook,
          social_line: this.shopDetail.social_line,
          ////:: marketplace functionality commenting now
          // social_shopee: this.shopDetail.social_shopee,
          // social_lazada: this.shopDetail.social_lazada,
        };
        const checkSocial = {
          socialFacebook: this.shopDetail.social_facebook,
          socialLine: this.shopDetail.social_line,
          ////:: marketplace functionality commenting now
          // socialShopee: this.shopDetail.social_shopee,
          // socialLazada: this.shopDetail.social_lazada,
        };
        this.settingModuleService.fetchSocialNetwork.next(social);
        this.shopOwnerForm.setValue({
          shopName: this.shopDetail.page_name,
          firstName: this.shopDetail.firstname,
          lastName: this.shopDetail.lastname,
          phoneNo: this.shopDetail.tel,
          email: this.shopDetail.email,
          facebookid: socialConnect.facebook.id,
          facebookpic: socialConnect.facebook.picture,
          access_token: socialConnect.facebook.access_token,
          address: this.shopDetail.address,
          location: {
            city: this.shopDetail.amphoe,
            district: this.shopDetail.district,
            post_code: this.shopDetail.post_code,
            province: this.shopDetail.province,
          },
          currency: {
            currencyImgUrl: '',
            currencyTitle: this.state === SocialModeTypes.CREATE_WIZARD ? 'THB (฿) Baht' : this.shopDetail.currency,
          },
          language: {
            languageImgUrl: '',
            languageTitle: this.state === SocialModeTypes.CREATE_WIZARD ? 'TH - Thai' : this.shopDetail.language,
          },
          country: 'Thailand',
          socialFacebook: this.shopDetail.social_facebook,
          socialLine: this.shopDetail.social_line,
          ////:: marketplace functionality commenting now
          // socialShopee: this.shopDetail.social_shopee,
          // socialLazada: this.shopDetail.social_lazada,
          basicid: null,
          channelid: null,
          channelsecret: null,
          channeltoken: null,
          premiumid: null,
          userid: null,
          pictureurl: null,
          displayname: null,
          is_type_edit: false,
        });

        if (!this.isLoading && this.isOwner) {
          this.checkFaceBookPageInit();
          this.checkSocialValue(checkSocial);
        }
      });
  }

  setDefaultShopDetail(): void {
    this.pageService
      .checkMaxPages()
      .pipe(
        takeUntil(this.destroy$),
        switchMap((detail) => {
          if (!detail) {
            void this.ngZone.run(() => this.router.navigateByUrl(`/follows?err=${EnumAuthError.PAGE_REACHED_LIMIT}`));
            return EMPTY;
          } else {
            return this.settingsService.getPhoneFromUser();
          }
        }),
        finalize(() => (this.isLoading = false)),
      )
      .subscribe((result) => {
        this.shopOwnerForm.setValue({
          shopName: '',
          firstName: '',
          lastName: '',
          phoneNo: result.tel,
          email: '',
          facebookid: '',
          facebookpic: '',
          access_token: '',
          address: '',
          location: {
            city: null,
            district: null,
            post_code: null,
            province: null,
          },
          currency: {
            currencyImgUrl: '',
            currencyTitle: 'THB (฿) Baht',
          },
          language: {
            languageImgUrl: '',
            languageTitle: 'TH - Thai',
          },
          country: this.translate.instant('Thailand'),
          socialFacebook: '',
          socialLine: '',
          ////:: marketplace functionality commenting now
          // socialShopee: '',
          // socialLazada: '',
          basicid: null,
          channelid: null,
          channelsecret: null,
          channeltoken: null,
          premiumid: null,
          userid: null,
          pictureurl: null,
          displayname: null,
          is_type_edit: false,
        });
        this.checkSocialValue(null);
        if (this.isOwner) this.checkFaceBookPageInit();
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }

  openAlertDialog(message: ITextTitle, isError: boolean): void {
    const dialogRef = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    dialogRef.componentInstance.data = message;
    dialogRef.componentInstance.isError = isError;
  }

  ////:: marketplace functionality commenting now
  /*
  openLazadaConnect(): void {
    this.pageService
      .getLazadaConnectURL()
      .pipe(
        takeUntil(this.destroy$),
        tap((urlData) => {
          const { text: lazadaConnectUrl } = urlData;
          lazadaConnectUrl ? this.openNewTab(lazadaConnectUrl) : this.toastr.error(this.errorConnect, this.errorTitle);
        }),
      )
      .subscribe();
  }

  openShopeeConnect(): void {
    this.pageService
      .getShopeeConnectURL()
      .pipe(
        takeUntil(this.destroy$),
        tap((urlData) => {
          const { text: shopeeConnectUrl } = urlData;
          shopeeConnectUrl ? this.openNewTab(shopeeConnectUrl) : this.toastr.error(this.errorConnect, this.errorTitle);
        }),
      )
      .subscribe();
  }

  openNewTab(url: string): void {
    thirdPartyAuthWindow = window.open(url, '_blank');
    openNewWindow = true;
    setTimeout(() => {
      checkAuthWindow();
    }, 2000);
    isClosed.pipe(tap((isClosed) => isClosed && location.reload())).subscribe();
  }
  */

  onConnectRequest(socialType: SocialTypes): void {
    const connectFunction = this.connectRequestFunc[socialType];
    connectFunction.call(this);
  }
}
