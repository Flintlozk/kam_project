import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { IPagePrivacyPolicyOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-term-condition',
  templateUrl: './setting-term-condition.component.html',
  styleUrls: ['./setting-term-condition.component.scss'],
})
export class SettingTermConditionComponent implements OnInit, OnDestroy {
  settingType = PageSettingType.TERMS_AND_CONDITION;
  styleToolbarStatus = false;

  @Input() isAllowed: boolean;
  termConditionForm: FormGroup;
  isExpanded = false;
  destroy$: Subject<void> = new Subject<void>();
  constructor(private matDialog: MatDialog, private toastr: ToastrService, private fromBuilder: FormBuilder, private settingService: SettingsService) {}

  ngOnInit(): void {
    this.initForm();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
  initForm(): void {
    this.termConditionForm = this.fromBuilder.group({
      textTH: ['', Validators.required],
      textENG: ['', Validators.required],
    });
    this.getSetting();
  }

  expansionToggler(bool: boolean): void {
    this.isExpanded = bool;
  }

  getDefaultSetting(): void {
    this.settingService
      .getPageDefaultSetting(this.settingType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((value: string) => {
        if (value) {
          const options = <IPagePrivacyPolicyOptions>JSON.parse(value as string);
          this.termConditionForm.controls['textTH'].setValue(options.textTH);
          this.termConditionForm.controls['textENG'].setValue(options.textENG);
        }
      });
  }

  getSetting(): void {
    this.settingService
      .getPageSetting(this.settingType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const options = <IPagePrivacyPolicyOptions>val.options;
          this.termConditionForm.controls['textTH'].setValue(options.textTH);
          this.termConditionForm.controls['textENG'].setValue(options.textENG);
        }
      });
  }

  saveSetting(): void {
    if (!this.termConditionForm.pristine) {
      this.settingService.setTermsAndCondition(<IPagePrivacyPolicyOptions>this.termConditionForm.value).subscribe(() => {
        this.openDialog();
      });
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
