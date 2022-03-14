import { AfterViewChecked, ChangeDetectorRef, Component, ElementRef, Inject, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
//import { LotNumberService } from '@plusmar-front/modules/setting/services/lot-number.service';
import { TranslateService } from '@ngx-translate/core';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import {
  EnumAuthError,
  EnumLogisticDeliveryProviderType,
  EnumLogisticFeeType,
  EnumLogisticType,
  FlashExpressConfig,
  ILogisticModel,
  ILogisticModelInput,
  IUpdatedLotNumber,
  JAndTExpressConfig,
  EnumTrackingType,
  IPageLogisticSystemOptions,
  ThemeWithILogisticModel,
  EnumAuthScope,
} from '@reactor-room/itopplus-model-lib';
import { combineLatest, Subject } from 'rxjs';
import { debounceTime, takeUntil } from 'rxjs/operators';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import { validationMessages } from '../../logistic-validation';
import { SettingLogisticFlatShippingComponent } from '../setting-logistic-flat-shipping/setting-logistic-flat-shipping.component';
import { SettingLogisticPerItemComponent } from '../setting-logistic-per-item/setting-logistic-per-item.component';
import { SettingLogisticPostalCodeComponent } from '../setting-logistic-postal-code/setting-logistic-postal-code.component';
import { SettingLogisticThaiPostDetailComponent } from '../setting-logistic-thai-post-detail/setting-logistic-thai-post-detail.component';
import { SettingLogisticFlashExpressDetailComponent } from '../setting-logistic-flash-express-detail/setting-logistic-flash-express-detail.component';
import { SettingLogisticJAndTExpressDetailComponent } from '../setting-logistic-j&t-express-detail/setting-logistic-j&t-express-detail.component';
import { SettingLogisticTotalItemsComponent } from '../setting-logistic-total-items/setting-logistic-total-items.component';
import { SettingLogisticTotalPriceComponent } from '../setting-logistic-total-price/setting-logistic-total-price.component';
import { SettingLogisticWeightComponent } from '../setting-logistic-weight/setting-logistic-weight.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { LotNumberService } from '@reactor-room/plusmar-front-end-share/setting/services/lot-number.service';

@Component({
  selector: 'reactor-room-setting-logistic-detail-dialog',
  templateUrl: './setting-logistic-detail-dialog.component.html',
  styleUrls: ['./setting-logistic-detail-dialog.component.scss'],
})
export class SettingLogisticDetailDialogComponent implements OnInit, OnDestroy, AfterViewChecked {
  providerType = EnumLogisticDeliveryProviderType;
  @ViewChild(SettingLogisticFlatShippingComponent) settingLogisticFlatShippingComponent: SettingLogisticFlatShippingComponent;
  @ViewChild(SettingLogisticPerItemComponent) settingLogisticPerItemComponent: SettingLogisticPerItemComponent;
  @ViewChild(SettingLogisticWeightComponent) settingLogisticWeightComponent: SettingLogisticWeightComponent;
  @ViewChild(SettingLogisticTotalItemsComponent) settingLogisticTotalItemsComponent: SettingLogisticTotalItemsComponent;
  @ViewChild(SettingLogisticTotalPriceComponent) settingLogisticTotalPriceComponent: SettingLogisticTotalPriceComponent;
  @ViewChild(SettingLogisticPostalCodeComponent) settingLogisticPostalCodeComponent: SettingLogisticPostalCodeComponent;
  @ViewChild(SettingLogisticThaiPostDetailComponent) settingLogisticThaiPostDetailComponent: SettingLogisticThaiPostDetailComponent;
  @ViewChild(SettingLogisticFlashExpressDetailComponent) settingLogisticFlashExpressDetailComponent: SettingLogisticFlashExpressDetailComponent;
  @ViewChild(SettingLogisticJAndTExpressDetailComponent) settingLogisticJAndTExpressDetailComponent: SettingLogisticJAndTExpressDetailComponent;

  logisticDetailForm: FormGroup;
  trackingType: EnumTrackingType;
  feeMethodDataSetected = 1;
  isFeeValid = true;
  isLotNumberValid = false;
  logistic: ILogisticModel;
  updateInputOption;
  successDialog;
  lotNumbers;
  isAutogenerate;

  deliveryProviderData = [
    {
      id: 1,
      name: EnumLogisticDeliveryProviderType.CUSTOM,
      img: '',
      imgInactive: '',
    },
    {
      id: 2,
      name: EnumLogisticDeliveryProviderType.THAILAND_POST,
      img: 'assets/img/logistic/Logo_Thaipost.png',
      imgInactive: 'assets/img/logistic/register_inactive.png',
    },
    { id: 3, name: EnumLogisticDeliveryProviderType.EMS_THAILAND, img: 'assets/img/logistic/Logo_EMS.png', imgInactive: 'assets/img/logistic/ems_inactive.png' },
    { id: 4, name: EnumLogisticDeliveryProviderType.FLASH_EXPRESS, img: 'assets/img/logistic/Logo_Flash.png', imgInactive: 'assets/img/logistic/flash_inactive.png' },
    { id: 5, name: EnumLogisticDeliveryProviderType.J_AND_T, img: 'assets/img/logistic/Logo_Flash.png', imgInactive: 'assets/img/logistic/flash_inactive.png' },
    { id: 6, name: EnumLogisticDeliveryProviderType.ALPHA, img: 'assets/img/logistic/Logo_Flash.png', imgInactive: 'assets/img/logistic/flash_inactive.png' },
  ];

  feeMethodData = [
    { id: 1, value: EnumLogisticFeeType.FREE, name: 'Offer free shipping / ฟรีค่าจัดส่ง', disabled: false },
    { id: 2, value: EnumLogisticFeeType.FLAT_RATE, name: 'Flat rate shipping / กำหนดราคาจัดส่งตายตัว', disabled: false },
  ];

  nameValidationMessage: string;
  deliveryDaysValidationMessage: string;
  merchantIDValidationMessage: string;
  shopNameValidationMessage: string;
  shopIdValidationMessage: string;
  theme: string;
  themeType = EnumAuthScope;
  destroy$ = new Subject<boolean>();
  private validationMessages = validationMessages;

  constructor(
    public dialogRef: MatDialogRef<SettingLogisticDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: ThemeWithILogisticModel,
    private leadFormBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private logisticsService: LogisticsService,
    private lotNumberService: LotNumberService,
    private dialog: MatDialog,
    public translate: TranslateService,
    private elm: ElementRef,
  ) {
    if (data) this.logistic = data.logisticModel;
  }

  ngOnInit(): void {
    this.theme = this.data.theme;
    this.logisticDetailForm = this.leadFormBuilder.group({
      imgUrl: [this.logistic.image],
      feeMethodData: [null],
      deliveryDays: [this.logistic.delivery_days, [Validators.pattern('^[0-9]*$')]],
      cashOnDeliveryStatus: [this.logistic.cod_status],
      walletId: [{ value: this.logistic.cod_status ? this.logistic.wallet_id : '', disabled: !this.logistic.cod_status }, Validators.required],
      option: [this.logistic.option],
    });
    this.setInitFeeMethod();
  }

  subSystemUpdate(returnSubSystem: IPageLogisticSystemOptions) {
    this.logistic.sub_system = returnSubSystem;
  }
  setInitFeeMethod(): void {
    if (this.logistic.fee_type === 'FLAT_RATE') {
      this.setFeeMethodData(1);
    } else {
      this.setFeeMethodData(0);
    }
  }
  onNoClick(): void {
    this.dialogRef.close();
  }

  onFeeValidChange(isValid: boolean): void {
    this.isFeeValid = isValid;
  }

  onCodChange(status: boolean): void {
    this.logisticDetailForm.patchValue({
      cashOnDeliveryStatus: status,
    });
    if (status) {
      this.logisticDetailForm.controls.walletId.enable();
    } else {
      this.logisticDetailForm.controls.walletId.disable();
    }
    this.logistic.cod_status = status;
  }

  onSave(): void {
    if (this.logisticDetailForm.valid && this.isFeeValid) {
      switch (this.logistic.delivery_type) {
        case EnumLogisticDeliveryProviderType.THAILAND_POST:
          this.trackingType = this.settingLogisticThaiPostDetailComponent.logisticTrackingType;
          if (this.trackingType === EnumTrackingType.BOOK) {
            this.updateLogisticAndLotNumber();
          } else if (this.trackingType === EnumTrackingType.DROP_OFF) {
            this.updateThaipostDropOff();
          } else {
            this.onUpdateLogistic();
          }
          break;
        case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
          {
            const isFlashValid = this.settingLogisticFlashExpressDetailComponent.flashExpressForm.valid;
            if (isFlashValid) {
              this.trackingType = this.settingLogisticFlashExpressDetailComponent.logisticTrackingType;
              this.onUpdateLogistic();
            }
          }
          break;
        case EnumLogisticDeliveryProviderType.J_AND_T:
          {
            const isJAndTValid = this.settingLogisticJAndTExpressDetailComponent.jAndTForm.valid;
            if (isJAndTValid) {
              this.trackingType = this.settingLogisticJAndTExpressDetailComponent.logisticTrackingType;
              this.onUpdateLogistic();
            }
          }
          break;
        case EnumLogisticDeliveryProviderType.ALPHA:
          this.onUpdateLogistic();
          break;
        default:
          break;
      }
    } else {
      let invalid = '';
      const controls = this.logisticDetailForm.controls;
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
    }
  }

  onUpdateLogistic(): void {
    this.updateLogistic()
      .pipe(takeUntil(this.destroy$))
      .subscribe(
        () => {
          this.dialogRef.close(true);
        },
        (err) => {
          if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
            this.openSuccessDialog(
              { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission Denied') },
              true,
            );
          } else {
            this.openSuccessDialog({ text: 'Update logistic error, please try again later or contact admin', title: 'Error !' }, true);
            console.log(err);
          }
        },
      );
  }

  updateLogistic() {
    const option = this.makeOptionInput();
    const logisticInputData: ILogisticModelInput = {
      name: this.logistic.name,
      type: EnumLogisticType.DOMESTIC,
      feeType: this.logisticDetailForm.value.feeMethodData ? EnumLogisticFeeType.FLAT_RATE : EnumLogisticFeeType.FREE,
      deliveryType: this.logistic.delivery_type,
      codStatus: this.logisticDetailForm.value.cashOnDeliveryStatus,
      deliveryFee: this.logisticDetailForm.value.feeMethodData ? parseFloat(this.logisticDetailForm.value.feeMethodData.deliveryFee) : 0,
      image: this.logistic.image ? this.logistic.image : '',
      trackingUrl: this.logistic.tracking_url,
      deliveryDays: this.logisticDetailForm.value.deliveryDays,
      status: this.logistic.status,
      trackingType: this.trackingType,
      walletId: this.logisticDetailForm.value.walletId ? this.logisticDetailForm.value.walletId : '',
      option: option ? JSON.stringify(option) : JSON.stringify({}),
      subSystem: this.logistic.sub_system,
    };
    return this.logisticsService.updateLogistic(this.logistic.id, logisticInputData).pipe(takeUntil(this.destroy$));
  }

  updateLotNumbers() {
    const lotNumbers: IUpdatedLotNumber[] = this.settingLogisticThaiPostDetailComponent.updatedLotNumbers.map((item) => {
      return {
        id: item.id,
        index: item.index,
        logistic_id: item.logistic_id,
        suffix: item.suffix,
        prefix: item.prefix,
        from: item.from,
        to: item.to,
        is_active: item.is_active,
        is_remaining: item.is_remaining,
        is_created: item.is_created,
        is_deleted: item.is_deleted,
        latest_used_number: '',
        is_expired: item.is_expired,
        expired_date: item.expired_date,
      } as IUpdatedLotNumber;
    });
    return this.lotNumberService.updateLotNumbers(lotNumbers).pipe(takeUntil(this.destroy$));
  }

  updateThaipostDropOff(): void {
    if (this.settingLogisticThaiPostDetailComponent.subscriptionBudget >= 200) {
      this.onUpdateLogistic();
    } else {
      this.openSuccessDialog({ text: this.translate.instant('Drop Off Not Pass Minimum'), title: this.translate.instant('Update Failed') }, true);
    }
  }

  updateLogisticAndLotNumber(): void {
    if (this.settingLogisticThaiPostDetailComponent.updatedLotNumbers.length === 0) {
      this.openSuccessDialog({ text: this.translate.instant('Must Active Lot Number'), title: this.translate.instant('Update Failed') }, true);
    } else {
      const isAnyActive = this.settingLogisticThaiPostDetailComponent.updatedLotNumbers.filter((x) => x.is_active);
      if (isAnyActive.length === 0 || isAnyActive.length > 1) {
        this.openSuccessDialog({ text: this.translate.instant('Must Active Lot Number'), title: this.translate.instant('Update Failed') }, true);
      } else {
        if (this.logisticDetailForm.valid && this.isFeeValid) {
          combineLatest([this.updateLogistic(), this.updateLotNumbers()])
            .pipe(takeUntil(this.destroy$))
            .subscribe(
              ([updateLogisticRes, updateLotNumberRes]) => {
                if (updateLogisticRes && updateLotNumberRes) {
                  this.dialogRef.close(true);
                }
              },
              (err) => {
                if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
                  this.openSuccessDialog(
                    { text: this.translate.instant('Only owner and admin have permission to manage this part'), title: this.translate.instant('Permission Denied') },
                    true,
                  );
                } else {
                  this.openSuccessDialog({ text: 'Update logistic error, please try again later or contact admin', title: 'Error !' }, true);
                  console.log(err);
                }
              },
            );
        } else {
          console.log('Some value is invalid');
        }
      }
    }
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  makeOptionInput(): null | FlashExpressConfig | JAndTExpressConfig {
    if (this.logistic.delivery_type === EnumLogisticDeliveryProviderType.THAILAND_POST) {
      return null;
    } else if (this.logistic.delivery_type === EnumLogisticDeliveryProviderType.FLASH_EXPRESS) {
      const flashForm = this.settingLogisticFlashExpressDetailComponent.flashExpressForm;

      const flash: FlashExpressConfig = {
        type: this.providerType.FLASH_EXPRESS,
        merchant_id: flashForm.value.merchantID ? flashForm.value.merchantID : '',
        insured: false,
      };
      return flash;
    } else if (this.logistic.delivery_type === EnumLogisticDeliveryProviderType.J_AND_T) {
      const jAndTForm = this.settingLogisticJAndTExpressDetailComponent.jAndTForm;
      const jAndT: JAndTExpressConfig = {
        type: this.providerType.J_AND_T,
        shop_id: jAndTForm.value.shopId ? jAndTForm.value.shopId : '',
        shop_name: jAndTForm.value.shopName ? jAndTForm.value.shopName : '',
        insured: false,
        registered: jAndTForm.value.registered ? jAndTForm.value.registered : false,
      };
      return jAndT;
    } else {
      return null;
    }
  }

  ngAfterViewChecked(): void {
    //   this.logisticDetailForm.patchValue({
    //     feeMethodData: null,
    //   });
    //   this.isFeeValid = true;
    this.cdr.detectChanges();
  }

  getLogisticRoundImage(deliveryType: EnumLogisticDeliveryProviderType): string {
    switch (deliveryType) {
      case EnumLogisticDeliveryProviderType.THAILAND_POST:
        return 'assets/img/logistic/round/ThailandPost_logo.png';
      case EnumLogisticDeliveryProviderType.EMS_THAILAND:
        return 'assets/img/logistic/round/EMS_logo.png';
      case EnumLogisticDeliveryProviderType.FLASH_EXPRESS:
        return 'assets/img/logistic/round/flashexpress_logo.png';
      case EnumLogisticDeliveryProviderType.J_AND_T:
        return 'assets/img/logistic/round/jt_logo.png';
      case EnumLogisticDeliveryProviderType.ALPHA:
        return 'assets/img/logistic/round/alpha_logo.png';
      default:
        return 'assets/img/logistic/round/custom-image.png';
    }
  }

  setFeeMethodData(index: number): void {
    if (index === 0 || index === 1) {
      this.logisticDetailForm.patchValue({
        feeMethodId: this.feeMethodData[index].id,
      });
      this.feeMethodDataSetected = this.feeMethodData[index].id;
      this.feeMethodDataSetected = this.feeMethodData[index].id;
    }
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.logisticDetailForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(1000)).subscribe(() => this.setErrorMessage(customerFormControl, controlName));
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
    switch (controlName) {
      case 'logisticName':
        this.nameValidationMessage = errorMessage;
        break;
      case 'deliveryDays':
        this.deliveryDaysValidationMessage = errorMessage;
        break;
      case 'merchantID':
        this.merchantIDValidationMessage = errorMessage;
        break;
      case 'shopId':
        this.shopIdValidationMessage = errorMessage;
        break;
      case 'shopName':
        this.shopNameValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(true);
    this.destroy$.complete();
  }
}
