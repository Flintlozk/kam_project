import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, FormArray, FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { CustomerClosedReasonService } from '@reactor-room/plusmar-front-end-share/customer/services/customer-closed-reason.service';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { LayoutCommonService } from '@reactor-room/plusmar-front-end-share/services/layout-common.service';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { PageSettingType } from '@reactor-room/itopplus-model-lib';
import { isEmpty } from 'lodash';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-customer-reasoning',
  templateUrl: './setting-customer-reasoning.component.html',
  styleUrls: ['./setting-customer-reasoning.component.scss'],
})
export class SettingCustomerReasoningComponent implements OnInit, OnChanges, OnDestroy {
  @Input() isAllowed: boolean;
  @Input() isEnabled = false;

  destroy$: Subject<void> = new Subject<void>();
  customerReasonForm: FormGroup;
  reasonAmount = 0;

  settingType = PageSettingType.CUSTOMER_CLOSED_REASON;

  get getReasonsControl(): AbstractControl[] {
    return (<FormArray>this.customerReasonForm.get('reasons')).controls;
  }
  get getReasons(): FormArray {
    return <FormArray>this.customerReasonForm.get('reasons');
  }

  constructor(
    private customerClosedReasonService: CustomerClosedReasonService,
    private fromBuilder: FormBuilder,
    private settingsService: SettingsService,
    private toastr: ToastrService,
    public layoutCommonService: LayoutCommonService,
    private matDialog: MatDialog,
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.getCustomerClosedReasons();
  }

  ngOnChanges(): void {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  initForm(): void {
    this.customerReasonForm = new FormGroup({
      reasons: new FormArray([]),
    });
  }

  getCustomerClosedReasons(): void {
    this.customerClosedReasonService
      .getCustomerClosedReasons()
      .pipe(takeUntil(this.destroy$))
      .subscribe((reasons) => {
        if (isEmpty(reasons)) {
          this.addNewEmptyRow();
        } else {
          this.reasonAmount = reasons.length;
          reasons.map((item) => {
            const formReasons = this.customerReasonForm.get('reasons') as FormArray;
            formReasons.push(
              this.fromBuilder.group({
                id: new FormControl(item.id),
                reason: new FormControl(item.reason, [Validators.required]),
              }),
            );
          });
        }
      });
  }

  addNewEmptyRow(): void {
    const reasons = this.customerReasonForm.get('reasons') as FormArray;

    reasons.push(
      this.fromBuilder.group({
        id: new FormControl(-1),
        reason: new FormControl('', [Validators.required]),
      }),
    );
  }

  addReason(): void {
    const lastReason = this.getReasonsControl[this.getReasonsControl.length - 1];
    if (!isEmpty(lastReason.value['reason'])) {
      this.addNewEmptyRow();

      setTimeout(() => {
        document.getElementById('lastInputIndex')?.focus();
      }, 1);
    } // push = Abstract Control of FromArray
  }

  onKeyEscapePress(index: number): void {
    const reasons = this.customerReasonForm.get('reasons') as FormArray;
    if (reasons.at(index)?.value?.reason === '') {
      reasons.removeAt(index);
    }
  }
  deleteReason(index: number): void {
    const reasons = this.customerReasonForm.get('reasons') as FormArray;
    const targetID = reasons.at(index)?.value?.id;
    this.customerClosedReasonService.deleteCustomerClosedReason(targetID).subscribe(() => {
      reasons.removeAt(index);
    });
  }

  saveReasoninngForm(): void {
    if (this.customerReasonForm.dirty && this.customerReasonForm.valid) {
      this.layoutCommonService.startLoading();
      this.customerClosedReasonService
        .setCustomerClosedReasons(this.customerReasonForm.value)
        .pipe(
          finalize(() => {
            this.layoutCommonService.endLoading();
          }),
        )
        .subscribe(
          () => {
            this.openDialog();
            this.initForm();
            this.getCustomerClosedReasons();
          },
          (err) => {
            console.log('saveReasoninngForm error : ', err);
          },
        );
    }
  }

  toggleReasoningFeature(): void {
    if (this.reasonAmount > 0) {
      this.layoutCommonService.startLoading();
      this.settingsService.togglePageSetting(this.isEnabled, this.settingType).subscribe(
        () => {
          this.layoutCommonService.endLoading();
          this.toastr.success(this.isEnabled ? 'Enabled' : 'Disabled', 'Close follow reason', { positionClass: 'toast-bottom-right' });
        },
        (err) => {
          this.layoutCommonService.endLoading();
          this.toastr.error('Please try again', 'Close follow reason', { positionClass: 'toast-bottom-right' });
        },
      );
    } else {
      this.toastr.error('Please add at least 1 reason', 'Close follow reason', { positionClass: 'toast-bottom-right' });
      setTimeout(() => {
        this.isEnabled = false;
      }, 100);
    }
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
}
