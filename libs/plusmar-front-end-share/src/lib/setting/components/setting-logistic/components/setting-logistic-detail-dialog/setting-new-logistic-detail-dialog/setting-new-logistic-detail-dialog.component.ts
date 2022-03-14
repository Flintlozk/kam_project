import { Component, OnInit, Inject, ViewChild, AfterViewChecked, ChangeDetectorRef, Input } from '@angular/core';
import { MatDialog, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { FormBuilder, Validators, FormGroup, AbstractControl } from '@angular/forms';
import { SettingLogisticFlatShippingComponent } from '../../setting-logistic-flat-shipping/setting-logistic-flat-shipping.component';
import { SettingLogisticPerItemComponent } from '../../setting-logistic-per-item/setting-logistic-per-item.component';
import { SettingLogisticWeightComponent } from '../../setting-logistic-weight/setting-logistic-weight.component';
import { SettingLogisticTotalItemsComponent } from '../../setting-logistic-total-items/setting-logistic-total-items.component';
import { SettingLogisticTotalPriceComponent } from '../../setting-logistic-total-price/setting-logistic-total-price.component';
import { SettingLogisticPostalCodeComponent } from '../../setting-logistic-postal-code/setting-logistic-postal-code.component';
import { SettingLogisticThaiPostDetailComponent } from '../../setting-logistic-thai-post-detail/setting-logistic-thai-post-detail.component';
import { ILogisticModelInput, EnumLogisticFeeType, EnumLogisticType, EnumLogisticDeliveryProviderType, EnumAuthError } from '@reactor-room/itopplus-model-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import { validationMessages } from '../../../logistic-validation';
import { debounceTime } from 'rxjs/operators';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-new-logistic-detail-dialog',
  templateUrl: './setting-new-logistic-detail-dialog.component.html',
  styleUrls: ['./setting-new-logistic-detail-dialog.component.scss'],
})
export class SettingNewLogisticDetailDialogComponent implements OnInit, AfterViewChecked {
  @ViewChild(SettingLogisticFlatShippingComponent) settingLogisticFlatShippingComponent: SettingLogisticFlatShippingComponent;
  @ViewChild(SettingLogisticPerItemComponent) settingLogisticPerItemComponent: SettingLogisticPerItemComponent;
  @ViewChild(SettingLogisticWeightComponent) settingLogisticWeightComponent: SettingLogisticWeightComponent;
  @ViewChild(SettingLogisticTotalItemsComponent) settingLogisticTotalItemsComponent: SettingLogisticTotalItemsComponent;
  @ViewChild(SettingLogisticTotalPriceComponent) settingLogisticTotalPriceComponent: SettingLogisticTotalPriceComponent;
  @ViewChild(SettingLogisticPostalCodeComponent) settingLogisticPostalCodeComponent: SettingLogisticPostalCodeComponent;
  @ViewChild(SettingLogisticThaiPostDetailComponent) SettingLogisticThaiPostDetailComponent: SettingLogisticThaiPostDetailComponent;

  logisticDetailForm: FormGroup;
  cashOnDeliveyStatus = false;
  feeMethodDataSetected = 1;
  isFeeValid = true;

  deliveryProviderData = [
    { id: 1, name: 'Custom', img: '', imgInactive: '', active: true },
    { id: 2, name: '', img: 'assets/img/logistic/Logo_Thaipost.png', imgInactive: 'assets/img/logistic/register_inactive.png', active: false },
    { id: 3, name: '', img: 'assets/img/logistic/Logo_EMS.png', imgInactive: 'assets/img/logistic/ems_inactive.png', active: false },
    { id: 4, name: '', img: 'assets/img/logistic/Logo_Flash.png', imgInactive: 'assets/img/logistic/flash_inactive.png', active: false },
  ];

  feeMethodData = [
    { id: 1, value: 'FREE', name: 'Offer free shipping / ฟรีค่าจัดส่ง', selected: '01', disabled: false },
    { id: 2, value: 'FLAT_RATE', name: 'Flat rate shipping / กำหนดราคาจัดส่งตายตัว', selected: '02', disabled: false },
  ];

  nameValidationMessage: string;
  countryValidationMessage: string;
  deliveryDaysValidationMessage: string;
  successDialog;

  private validationMessages = validationMessages;

  constructor(
    public dialogRef: MatDialogRef<SettingNewLogisticDetailDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private leadFormBuilder: FormBuilder,
    private cdr: ChangeDetectorRef,
    private logisticsService: LogisticsService,
    private dialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.logisticDetailForm = this.leadFormBuilder.group({
      logisticName: ['', Validators.required],
      imgUrl: [''],
      trackingUrl: [''],
      feeMethodData: [],
      deliveryDays: ['', [Validators.pattern('^[0-9]*$')]],
      cashOnDeliveryStatus: [false],
    });
  }

  onNoClick(): void {
    this.dialogRef.close();
  }

  onFeeValidChange(isValid: boolean) {
    this.isFeeValid = isValid;
  }

  onSave(): void {
    // if (this.logisticDetailForm.valid && this.isFeeValid) {
    //   const logisticInputData: ILogisticModelInput = {
    //     name: this.logisticDetailForm.value.logisticName,
    //     type: EnumLogisticType.DOMESTIC,
    //     feeType: this.logisticDetailForm.value.feeMethodData ? EnumLogisticFeeType.FLAT_RATE : EnumLogisticFeeType.FREE,
    //     deliveryType: EnumLogisticDeliveryProviderType.CUSTOM,
    //     codStatus: this.logisticDetailForm.value.cashOnDeliveryStatus,
    //     deliveryFee: this.logisticDetailForm.value.feeMethodData ? parseFloat(this.logisticDetailForm.value.feeMethodData.deliveryFee) : 0,
    //     image: this.logisticDetailForm.value.imgUrl,
    //     trackingUrl: this.logisticDetailForm.value.trackingUrl,
    //     deliveryDays: this.logisticDetailForm.value.deliveryDays,
    //     status: true,
    //   };
    //   this.logisticsService.createLogistic(logisticInputData).subscribe(
    //     (result) => {
    //       this.dialogRef.close(true);
    //     },
    //     (err) => {
    //       if (err.message.indexOf(EnumAuthError.PERMISSION_DENIED) !== -1) {
    //         this.openSuccessDialog({ text: 'Only owner and admin have permission to manage this part', title: 'Permission denied !' }, true);
    //       } else {
    //         this.openSuccessDialog({ text: 'Create logistic error, please try again later or contact admin', title: 'Error !' }, true);
    //         console.log(err);
    //       }
    //     },
    //   );
    // }
  }

  openSuccessDialog(data, isError = false): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = isError;
  }

  ngAfterViewChecked(): void {
    if (this.settingLogisticFlatShippingComponent) {
      this.logisticDetailForm.patchValue({
        feeMethodData: this.settingLogisticFlatShippingComponent.logisticFlatShippingForm.value,
      });
    } else if (this.settingLogisticPerItemComponent) {
      this.logisticDetailForm.patchValue({
        feeMethodData: this.settingLogisticPerItemComponent.logisticPerItemForm.value,
      });
    } else if (this.settingLogisticWeightComponent) {
      this.logisticDetailForm.patchValue({
        feeMethodData: this.settingLogisticWeightComponent.logisticPerItemForm.value,
      });
    } else if (this.settingLogisticTotalItemsComponent) {
      this.logisticDetailForm.patchValue({
        feeMethodData: this.settingLogisticTotalItemsComponent.logisticPerItemForm.value,
      });
    } else if (this.settingLogisticTotalPriceComponent) {
      this.logisticDetailForm.patchValue({
        feeMethodData: this.settingLogisticTotalPriceComponent.logisticPerItemForm.value,
      });
    } else if (this.settingLogisticPostalCodeComponent) {
      this.logisticDetailForm.patchValue({
        feeMethodData: this.settingLogisticPostalCodeComponent.logisticPerItemForm.value,
      });
    } else {
      this.logisticDetailForm.patchValue({
        feeMethodData: null,
      });
      this.isFeeValid = true;
    }
    this.cdr.detectChanges();
  }

  setDeliveryProvider(index) {
    this.logisticDetailForm.patchValue({
      deliveryProviderId: this.deliveryProviderData[index].id,
    });

    for (let i = 0; i < this.deliveryProviderData.length; i++) {
      this.deliveryProviderData[i].active = false;
    }
    this.deliveryProviderData[index].active = true;
  }

  setFeeMethodData(index) {
    if (index === 0 || index === 1) {
      this.logisticDetailForm.patchValue({
        feeMethodId: this.feeMethodData[index].id,
      });
      this.feeMethodDataSetected = this.feeMethodData[index].id;
      this.feeMethodDataSetected = this.feeMethodData[index].id;
    }
  }

  setCashOnDeliveyStatus(event) {
    this.cashOnDeliveyStatus = event.target.checked;
    this.logisticDetailForm.patchValue({
      cashOnDeliveryStatus: this.cashOnDeliveyStatus,
    });
  }

  eventLookUpOnFocus(controlName: string) {
    const customerFormControl = this.logisticDetailForm.get(controlName);
    customerFormControl.valueChanges.pipe(debounceTime(1000)).subscribe((value) => this.setErrorMessage(customerFormControl, controlName));
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

  showErrorMessage(controlName: string, errorMessage: string) {
    switch (controlName) {
      case 'logisticName':
        this.nameValidationMessage = errorMessage;
        break;
      case 'deliveryDays':
        this.deliveryDaysValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }
}
