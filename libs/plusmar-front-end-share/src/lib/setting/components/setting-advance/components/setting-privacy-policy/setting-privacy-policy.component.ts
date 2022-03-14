import { Component, Input, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { SuccessDialogComponent } from '@reactor-room/itopplus-cdk';
import { isMobile } from '@reactor-room/itopplus-front-end-helpers';
import { SettingsService } from '@reactor-room/plusmar-front-end-share/services/settings/setting.service';
import { IPageTermsAndConditionOptions, PageSettingType } from '@reactor-room/itopplus-model-lib';
import { ToastrService } from 'ngx-toastr';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Component({
  selector: 'reactor-room-setting-privacy-policy',
  templateUrl: './setting-privacy-policy.component.html',
  styleUrls: ['./setting-privacy-policy.component.scss'],
})
export class SettingPrivacyPolicyComponent implements OnInit {
  settingType = PageSettingType.PRIVACY_POLICY;

  @Input() isAllowed: boolean;
  privacyPolicyForm: FormGroup;

  isExpanded = false;

  destroy$: Subject<void> = new Subject<void>();
  constructor(private matDialog: MatDialog, private toastr: ToastrService, private fromBuilder: FormBuilder, private settingService: SettingsService) {}

  ngOnInit(): void {
    this.initForm();
  }

  initForm(): void {
    this.privacyPolicyForm = this.fromBuilder.group({
      textTH: ['', Validators.required],
      textENG: ['', Validators.required],
    });
    this.getSetting();
  }

  getSetting(): void {
    this.settingService
      .getPageSetting(this.settingType)
      .pipe(takeUntil(this.destroy$))
      .subscribe((val) => {
        if (val) {
          const options = <IPageTermsAndConditionOptions>val.options;
          this.privacyPolicyForm.controls['textTH'].setValue(options.textTH);
          this.privacyPolicyForm.controls['textENG'].setValue(options.textENG);
        }
      });
  }

  saveSetting(): void {
    this.settingService.setPrivacyPolicy(<IPageTermsAndConditionOptions>this.privacyPolicyForm.value).subscribe((x) => {
      this.openDialog();
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
}
