import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { environmentLib as environment } from '@reactor-room/environment-services-frontend';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { FilterEmits } from '@reactor-room/plusmar-cdk';
import { SubscriptionService } from '@reactor-room/plusmar-front-end-share/services/subscription/subscription.service';
import { TopupDialogComponent } from '@reactor-room/plusmar-front-end-share/topup/topup-dialog/topup-dialog.component';
import { EnumAuthScope, EnumTrackingType, ILogisticModel, ITopupRequest2C2P, IUpdatedLotNumber } from '@reactor-room/itopplus-model-lib';
import dayjs from 'dayjs';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { validationMessages } from '../../logistic-validation';
import { SettingLogisticRunningNumberInfoDialogComponent } from './setting-logistic-running-number-info-dialog/setting-logistic-running-number-info-dialog.component';
@Component({
  selector: 'reactor-room-setting-logistic-thai-post-detail',
  templateUrl: './setting-logistic-thai-post-detail.component.html',
  styleUrls: ['./setting-logistic-thai-post-detail.component.scss'],
  encapsulation: ViewEncapsulation.None,
})
export class SettingLogisticThaiPostDetailComponent implements OnInit, OnDestroy {
  @Output() codChange = new EventEmitter<boolean>();
  @Input() logisticId: number;
  @Input() lotNumbers;
  @Input() codStatus;
  @Input() theme: string;
  themeType = EnumAuthScope;
  @Input() logistic: ILogisticModel;
  isTrackAlphabetValid = true;
  isWalletValid = true;
  logisticTrackingType;
  trackingType = EnumTrackingType;
  isAutoGenerate: boolean;
  startAlphabets = '';
  endAlphabets = '';
  trackingStartNumbers = '';
  trackingEndNumbers = '';
  thaiPostConfigForm: FormGroup;
  trackingStartNumbersValidationMessage: string;
  trackingEndNumbersValidationMessage: string;
  trackingStartAndEndValidationMessage: string;
  updatedLotNumbers: IUpdatedLotNumber[];
  private validationMessages = validationMessages;
  lotNumberForm: FormGroup;
  isTrackingNumberValid: boolean;
  trackingNumberInvalidMessage: string;
  endDate: string;
  successDialog;
  destroy$ = new Subject();
  subscriptionBudget: number;

  trackingTypes = [
    { trackingType: EnumTrackingType.DROP_OFF, title: 'Drop off' },
    { trackingType: EnumTrackingType.MANUAL, title: 'Manual' },
    { trackingType: EnumTrackingType.BOOK, title: 'Book' },
  ];

  constructor(private leadFormBuilder: FormBuilder, private dialog: MatDialog, public subscriptionService: SubscriptionService) {}

  ngOnInit(): void {
    this.logisticTrackingType = this.logistic.tracking_type;
    this.updatedLotNumbers = this.lotNumbers.map((l, index) => {
      return {
        index: index,
        ...l,
        is_created: false,
        is_deleted: false,
        expired_date: dayjs(l.expired_at).format('YYYY-MM-DD'),
      } as IUpdatedLotNumber;
    });
    this.lotNumberForm = this.leadFormBuilder.group({
      trackingStartNumbers: ['', [Validators.pattern('^([A-Z]{1})([0-9]{4})([0-9]{4})$')]],
      trackingEndNumbers: ['', [Validators.pattern('^([A-Z]{1})([0-9]{4})([0-9]{4})$')]],
    });
    this.endDate = dayjs().format('YYYY-MM-DD');
    this.getCurrentBudget();
  }

  getCurrentBudget(): void {
    this.subscriptionService
      .getSubscriptionBudget()
      .pipe(takeUntil(this.destroy$))
      .subscribe((budget) => {
        this.subscriptionBudget = budget.currentBudget;
      });
  }
  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.lotNumberForm.get(controlName);
    this.setErrorMessage(customerFormControl, controlName);
    if (controlName === 'trackingStartNumbers' || controlName === 'trackingEndNumbers') {
      this.checkMatchingAlphabet();
    }
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

  checkMatchingAlphabet(): void {
    this.trackingNumberInvalidMessage = '';
    let startAlphabets, endAlphabets;
    const trackingStartNumbers = this.lotNumberForm.value.trackingStartNumbers;
    const trackingEndNumbers = this.lotNumberForm.value.trackingEndNumbers;
    if (!trackingEndNumbers || !trackingStartNumbers) {
      this.isTrackAlphabetValid = false;
    } else {
      if (trackingStartNumbers.length === 0 || trackingEndNumbers.length === 0) {
        this.isTrackAlphabetValid = false;
        this.showErrorMessage('trackingStartandEndNumbers', 'Tracking number is required');
      } else {
        if (trackingStartNumbers.length > 1) startAlphabets = trackingStartNumbers.substring(0, 1);
        if (trackingEndNumbers.length > 1) endAlphabets = trackingEndNumbers.substring(0, 1);
        if (startAlphabets === endAlphabets) {
          this.isTrackAlphabetValid = true;
        } else {
          this.isTrackAlphabetValid = false;
          this.showErrorMessage('trackingStartandEndNumbers', 'Tracking number must have the same start alphabet');
        }
      }
    }
  }

  openTopUpDialog(): void {
    const paymentSetting = {
      version: environment.PAYMENT_2C2P_VERSION,
      merchant_id: '',
      payment_description: 'More-Commerce Topup',
      order_id: '',
      currency: 0,
      amount: '',
      returnurl: '', //result_url_1
      postbackurl: '', //result_url_2
      request_3ds: environment.PAYMENT_2C2P_REQUEST_3DS,
      payment_option: '',
      user_defined_1: '',
      user_defined_2: '',
      user_defined_3: '',
      user_defined_4: '',
      hash_value: '',
      theme: this.theme,
    } as ITopupRequest2C2P;

    this.dialog.open(TopupDialogComponent, {
      width: isMobile() ? '90%' : '30%',
      data: paymentSetting,
    });
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
      case 'trackingStartNumbers':
        this.trackingStartNumbersValidationMessage = errorMessage;
        break;
      case 'trackingEndNumbers':
        this.trackingEndNumbersValidationMessage = errorMessage;
        break;
      case 'trackingStartandEndNumbers':
        this.trackingStartAndEndValidationMessage = errorMessage;
        break;
      default:
        break;
    }
  }

  toggleNumberLotActiveStatus(idx: number): void {
    this.updatedLotNumbers[idx].is_active = !this.updatedLotNumbers[idx].is_active;
  }

  onUpdateTrackingType(trackingType: string): void {
    this.logisticTrackingType = trackingType;
  }
  onAdd(): void {
    const from = this.lotNumberForm.value.trackingStartNumbers.slice(1);
    const to = this.lotNumberForm.value.trackingEndNumbers.slice(1);
    this.isTrackingNumberValid = parseInt(to) - parseInt(from) <= 240 && parseInt(to) - parseInt(from) > 0;
    if (!this.isTrackingNumberValid) this.trackingNumberInvalidMessage = 'Incorrect tracking number, please check and try again';
    if (this.lotNumberForm.value.trackingStartNumbers.length > 0 && this.lotNumberForm.valid && this.isTrackingNumberValid) {
      const newLotNumber = {
        index: this.updatedLotNumbers.length,
        id: 0,
        is_created: true,
        is_deleted: false,
        logistic_id: this.logisticId,
        prefix: `E${this.lotNumberForm.value.trackingStartNumbers.substring(0, 1)}`,
        suffix: 'TH',
        from: from,
        to: to,
        is_active: false,
        is_remaining: true,
        latest_used_number: '',
        remaining: parseInt(to) - parseInt(from) + 1,
        expired_date: this.endDate,
        is_expired: false,
      } as IUpdatedLotNumber;
      this.updatedLotNumbers.push(newLotNumber);
      this.lotNumberForm.patchValue({
        trackingStartNumbers: '',
        trackingEndNumbers: '',
      });
    }
  }

  onDelete(idx: number): void {
    if (!this.updatedLotNumbers[idx].is_active) {
      this.updatedLotNumbers[idx].is_deleted = true;
    } else {
      this.openSuccessDialog({ text: 'Cant delete active lot number', title: 'Update failed !' });
    }
  }

  handleFilterUpdate(value: FilterEmits): void {
    this.endDate = dayjs(value.endDate).format('YYYY-MM-DD');
  }

  openSuccessDialog(data): void {
    this.successDialog = this.dialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '50%',
    });

    this.successDialog.componentInstance.data = data;
    this.successDialog.componentInstance.isError = true;
  }

  openInfoDialog(): void {
    const dialogRef = this.dialog.open(SettingLogisticRunningNumberInfoDialogComponent, {
      width: '100%',
    });
    dialogRef.afterClosed().subscribe(() => {
      //
    });
  }

  getActiveImageUrl(type: string): string {
    if (this.theme === this.themeType.CMS) {
      switch (type) {
        case EnumTrackingType.DROP_OFF:
          return 'assets/img/logistic/tracking-type/dropoff-active.svg';
        case EnumTrackingType.MANUAL:
          return 'assets/img/logistic/tracking-type/manual-active.svg';
        case EnumTrackingType.BOOK:
          return 'assets/img/logistic/tracking-type/book-active.svg';
        default:
          return '';
      }
    } else {
      switch (type) {
        case EnumTrackingType.DROP_OFF:
          return 'assets/img/logistic/tracking-type/dropoff-active.png';
        case EnumTrackingType.MANUAL:
          return 'assets/img/logistic/tracking-type/manual-active.png';
        case EnumTrackingType.BOOK:
          return 'assets/img/logistic/tracking-type/book-active.png';
        default:
          return '';
      }
    }
  }

  getUnactiveImageUrl(type: string): string {
    switch (type) {
      case EnumTrackingType.DROP_OFF:
        return 'assets/img/logistic/tracking-type/dropoff-inactive.png';
      case EnumTrackingType.MANUAL:
        return 'assets/img/logistic/tracking-type/manual-inactive.png';
      case EnumTrackingType.BOOK:
        return 'assets/img/logistic/tracking-type/book-inactive.png';
      default:
        return '';
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
