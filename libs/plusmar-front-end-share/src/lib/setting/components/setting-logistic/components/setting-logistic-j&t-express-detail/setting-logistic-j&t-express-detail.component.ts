import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { EnumAuthScope, EnumTrackingType, GenericButtonMode, GenericDialogMode, ILogisticModel } from '@reactor-room/itopplus-model-lib';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk/success-dialog/success-dialog.component';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { DialogService } from '@reactor-room/plusmar-front-end-share/services/dialog.service';
import { LogisticsService } from '@reactor-room/plusmar-front-end-share/services/settings/logistics.service';
import { UserService } from '@reactor-room/plusmar-front-end-share/services/user/user.service';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { validationMessages } from '../../logistic-validation';

@Component({
  selector: 'reactor-room-setting-logistic-j-and-t-express-detail',
  templateUrl: './setting-logistic-j&t-express-detail.component.html',
  styleUrls: ['./setting-logistic-j&t-express-detail.component.scss'],
})
export class SettingLogisticJAndTExpressDetailComponent implements OnInit, OnDestroy {
  @Input() logisticId: number;
  @Input() theme: string;
  themeType = EnumAuthScope;
  @Input() logistic: ILogisticModel;
  logisticTrackingType: EnumTrackingType;
  isAutoGenerate: boolean;
  jAndTForm: FormGroup;
  private validationMessages = validationMessages;
  successDialog;
  shopIdValidationMessage: string;
  shopNameValidationMessage: string;
  initForm = true;

  trackingTypes = [
    { trackingType: EnumTrackingType.DROP_OFF, title: 'Drop off' },
    { trackingType: EnumTrackingType.MANUAL, title: 'Manual' },
  ];

  destroy$: Subject<void> = new Subject<void>();

  constructor(
    private formBuilder: FormBuilder,
    private dialog: MatDialog,
    public userService: UserService,
    private logisticsService: LogisticsService,
    private dialogService: DialogService,
  ) {}

  ngOnInit(): void {
    this.logisticTrackingType = this.logistic.tracking_type;
    this.jAndTForm = this.formBuilder.group({
      shopId: [this.logistic.option.shop_id],
      shopName: [this.logistic.option.shop_name],
      registered: [this.logistic.option.registered],
    });
    this.eventLookUpOnFocus('shopName');
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  eventLookUpOnFocus(controlName: string): void {
    const customerFormControl = this.jAndTForm.get(controlName);
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
      if (this.jAndTForm.valid) this.initForm = false;
    }
  }

  showErrorMessage(controlName: string, errorMessage: string): void {
    switch (controlName) {
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

  verifyJAndTExpress() {
    this.logisticsService
      .verifyJAndTExpress()
      .pipe(takeUntil(this.destroy$))
      .subscribe((result) => {
        const customerFormControl = this.jAndTForm.get('registered');
        if (result.status === 200) {
          customerFormControl.patchValue(true);
          this.dialogService.openDialog('Your shopID is registered.', GenericDialogMode.SAVE_SUCCESS, GenericButtonMode.CLOSE).subscribe();
        } else {
          customerFormControl.patchValue(false);
          this.dialogService
            .openDialog('Sorry, Current shopID not registered or still in validation process', GenericDialogMode.CAUTION, GenericButtonMode.CLOSE, false, true)
            .subscribe();
        }
      });
  }
}
