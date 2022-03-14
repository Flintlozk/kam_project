import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EnumAuthScope, EnumTrackingType, ILogisticModel } from '@reactor-room/itopplus-model-lib';
import { validationMessages } from '../../logistic-validation';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';

@Component({
  selector: 'reactor-room-setting-logistic-flash-express-detail',
  templateUrl: './setting-logistic-flash-express-detail.component.html',
  styleUrls: ['./setting-logistic-flash-express-detail.component.scss'],
})
export class SettingLogisticFlashExpressDetailComponent implements OnInit {
  @Input() logisticId: number;
  @Input() theme: string;
  themeType = EnumAuthScope;
  @Input() logistic: ILogisticModel;
  isFlashOptionValid = true;
  isWalletValid = true;
  logisticTrackingType: EnumTrackingType;
  flashExpressForm: FormGroup;
  private validationMessages = validationMessages;
  successDialog;
  merchantIDValidationMessage: string;
  initForm = true;

  trackingTypes = [
    { trackingType: EnumTrackingType.DROP_OFF, title: 'Drop off' },
    { trackingType: EnumTrackingType.MANUAL, title: 'Manual' },
  ];

  constructor(private leadFormBuilder: FormBuilder, private dialog: MatDialog, public userService: UserService) {}

  ngOnInit(): void {
    this.logisticTrackingType = this.logistic.tracking_type;
    this.flashExpressForm = this.leadFormBuilder.group({
      merchantID: [this.logistic.option.merchant_id],
    });
    this.eventLookUpOnFocus('merchantID');
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.flashExpressForm.get(controlName);
    this.setErrorMessage(customerFormControl, controlName);
  }

  setErrorMessage(c: AbstractControl, controlName: string): void {
    if (c.errors && (c.touched || c.dirty)) {
      const validationData = this.validationMessages.find((validation) => validation.control === controlName);
      const validationRules = validationData.rules;

      const errorMessage = Object.keys(c.errors)
        .map((key) => validationRules[key])
        .join('<br>');
      this.showErrorMessage(controlName, errorMessage);
      if (this.flashExpressForm.valid) this.initForm = false;
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
      case 'merchantID':
        this.merchantIDValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }

  openSuccessDialog(data): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = true;
  }

  getActiveImageUrl(type: string): string {
    if (this.theme === this.themeType.CMS) {
      switch (type) {
        case EnumTrackingType.DROP_OFF:
          return 'assets/img/logistic/tracking-type/dropoff-active.svg';
        case EnumTrackingType.MANUAL:
          return 'assets/img/logistic/tracking-type/manual-active.svg';
        default:
          return '';
      }
    } else {
      switch (type) {
        case EnumTrackingType.DROP_OFF:
          return 'assets/img/logistic/tracking-type/dropoff-active.png';
        case EnumTrackingType.MANUAL:
          return 'assets/img/logistic/tracking-type/manual-active.png';
        default:
          return '';
      }
    }
  }

  onUpdateTrackingType(trackingType: EnumTrackingType): void {
    this.logisticTrackingType = trackingType;
    if (trackingType !== EnumTrackingType.MANUAL) this.flashExpressForm.controls['merchantID'].setValidators([Validators.required, Validators.pattern('^([A-Z]{2})([0-9]{4})$')]);
    else this.flashExpressForm.controls['merchantID'].setValidators([]);

    this.flashExpressForm.controls['merchantID'].updateValueAndValidity();
    this.eventLookUpOnFocus('merchantID');
  }

  getUnactiveImageUrl(type: string): string {
    switch (type) {
      case EnumTrackingType.DROP_OFF:
        return 'assets/img/logistic/tracking-type/dropoff-inactive.png';
      case EnumTrackingType.MANUAL:
        return 'assets/img/logistic/tracking-type/manual-inactive.png';
      default:
        return '';
    }
  }
}
