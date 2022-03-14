import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { combineHourAndMinute, isMobile, isTimeBefore } from '@reactor-room/itopplus-front-end-helpers';
import { CustomerSLAService } from '@reactor-room/plusmar-front-end-share/customer/services/customer-sla.service';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { ICustomerSLATime, IPageCustomerSlaTimeOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-customer-sla',
  templateUrl: './setting-customer-sla.component.html',
  styleUrls: ['./setting-customer-sla.component.scss'],
})
export class SettingCustomerSlaComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isAllowed: boolean;
  @Input() isEnabled = false;

  destroy$: Subject<void> = new Subject<void>();
  customerSlaForm: FormGroup;

  settingType = PageSettingType.CUSTOMER_SLA_TIME;

  failedIsBefore = false;

  constructor(
    private matDialog: MatDialog,
    private toastr: ToastrService,
    private fromBuilder: FormBuilder,
    public layoutCommonService: LayoutCommonService,
    private settingsService: SettingsService,
    private customerSLAService: CustomerSLAService,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCustomerSLATime();
  }

  ngOnChanges(): void {
    if (this.customerSlaForm) {
      this.toggleInput();
    }
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initForm(): void {
    this.customerSlaForm = this.fromBuilder.group({
      alertHour: ['0', Validators.required],
      alertMinute: ['45', Validators.required],
      hour: ['03', Validators.required],
      minute: ['00', Validators.required],
    });
    this.toggleInput();
  }

  toggleInput(): void {
    const alertHour = this.customerSlaForm.controls['alertHour'];
    const alertMinute = this.customerSlaForm.controls['alertMinute'];
    const hour = this.customerSlaForm.controls['hour'];
    const minute = this.customerSlaForm.controls['minute'];

    this.isEnabled ? alertHour.enable() : alertHour.disable();
    this.isEnabled ? alertMinute.enable() : alertMinute.disable();
    this.isEnabled ? hour.enable() : hour.disable();
    this.isEnabled ? minute.enable() : minute.disable();
  }

  getCustomerSLATime(): void {
    this.customerSLAService
      .getCustomerSLATime()
      .pipe(takeUntil(this.destroy$))
      .subscribe(({ time }: ICustomerSLATime) => {
        if (!isEmpty(time)) {
          this.customerSlaForm.controls['alertHour'].setValue(String(time.alertHour).padStart(2, '0'));
          this.customerSlaForm.controls['alertMinute'].setValue(String(time.alertMinute).padStart(2, '0'));
          this.customerSlaForm.controls['hour'].setValue(String(time.hour).padStart(2, '0'));
          this.customerSlaForm.controls['minute'].setValue(String(time.minute).padStart(2, '0'));
        }
      });
  }

  toggleSlaFeature(): void {
    this.layoutCommonService.startLoading();
    this.settingsService.togglePageSetting(this.isEnabled, this.settingType).subscribe({
      next: () => {
        this.layoutCommonService.endLoading();
        this.toastr.success(this.isEnabled ? 'Enabled' : 'Disabled', 'Customer SLA', { positionClass: 'toast-bottom-right' });
        this.toggleInput();
      },
      error: () => {
        this.layoutCommonService.endLoading();
        this.toastr.error('Please try again', 'Customer SLA', { positionClass: 'toast-bottom-right' });
      },
    });
  }

  openDialog(): void {
    this.matDialog.open(SuccessDialogComponent, {
      width: isMobile() ? '90%' : '422px',
      data: {
        title: 'Saved Successfully !',
        text: 'Data have been saved successfully…',
      },
    });
  }

  saveSlaSetting(): void {
    const alertHour = Number(this.customerSlaForm.controls['alertHour'].value);
    const alertMinute = Number(this.customerSlaForm.controls['alertMinute'].value);
    const hour = Number(this.customerSlaForm.controls['hour'].value);
    const minute = Number(this.customerSlaForm.controls['minute'].value);

    const beforeAlert = combineHourAndMinute(alertHour, alertMinute);
    const alertSla = combineHourAndMinute(hour, minute);

    const isBefore = isTimeBefore(beforeAlert, alertSla);

    if (this.customerSlaForm.dirty && this.customerSlaForm.valid && this.isEnabled && isBefore) {
      this.failedIsBefore = false;
      this.layoutCommonService.startLoading();
      this.customerSLAService
        .setCustomerSLATime({
          alertHour,
          alertMinute,
          hour,
          minute,
        } as IPageCustomerSlaTimeOptions)
        .pipe(
          finalize(() => {
            this.layoutCommonService.endLoading();
          }),
        )
        .subscribe(
          () => {
            this.openDialog();
            this.initForm();
            this.getCustomerSLATime();
          },
          (err) => {
            console.log('saveSlaSetting error', err);
          },
        );
    } else {
      if (!isBefore) {
        this.toastr.error('Time before reach SLA must be set before over SLA time', 'Customer SLA', { positionClass: 'toast-bottom-right' });
        this.failedIsBefore = true;
      }

      if (!this.customerSlaForm.pristine && !(this.customerSlaForm.dirty && this.customerSlaForm.valid)) {
        this.toastr.error('Time format invalid', 'Customer SLA', { positionClass: 'toast-bottom-right' });
      }
    }
  }
}
