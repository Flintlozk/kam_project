import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { IWebsiteConfigDataPrivacy } from '@reactor-room/cms-models-lib';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, tap } from 'rxjs/operators';
import * as _ from 'lodash';
import { SettingGeneralService } from '../../../../services/setting-general/setting-general-service';
import { ShowSnackBarService } from '../../../../services/snackbar/show-snackbar.service';
import { StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { Router } from '@angular/router';
@Component({
  selector: 'cms-next-setting-website-data-privacy',
  templateUrl: './setting-website-data-privacy.component.html',
  styleUrls: ['./setting-website-data-privacy.component.scss'],
})
export class SettingWebsiteDataPrivacyComponent implements OnInit, OnDestroy {
  dataPrivacyForm: FormGroup;
  dataPrivacySettings: IWebsiteConfigDataPrivacy;
  parentForm: FormGroup;
  destroy$: Subject<void> = new Subject<void>();
  constructor(
    private settingWebsiteService: SettingWebsiteService,
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private settingService: SettingGeneralService,
    private snackBarService: ShowSnackBarService,
    private router: Router,
  ) {}

  get getDataStatus(): FormControl {
    return this.parentForm.get('datause_privacy_policy_setting.is_active') as FormControl;
  }
  get getCurrentForm(): FormGroup {
    return this.parentForm.get('datause_privacy_policy_setting') as FormGroup;
  }

  ngOnInit(): void {
    this.onSaveAction();
    this.onRouteChange();
    this.parentForm = this.parentFormDirective.form;
    this.formCheck();
    this.onInitConfigDataPrivacyValue();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  formCheck(): void {
    const form = this.getCurrentForm;
    if (_.isEmpty(form)) {
      this.generateDataPrivacyForm();
      this.parentForm.addControl('datause_privacy_policy_setting', this.dataPrivacyForm);
    } else {
      this.dataPrivacyForm = form;
    }
  }
  onSaveAction(): void {
    this.settingService
      .getSaveAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSaveConfigDataPrivacy();
      });
  }
  onRouteChange(): void {
    this.settingService
      .getUnsaveDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((newRoute) => {
        this.onDetectRouteChange(newRoute);
      });
  }

  generateDataPrivacyForm(): void {
    this.dataPrivacyForm = this.fb.group({
      is_active: [false],
      data_use: [''],
      privacy_policy: [''],
    });
  }
  patchDataPrivacy(): void {
    if (this.dataPrivacySettings) {
      this.dataPrivacyForm.patchValue({
        data_use: this.dataPrivacySettings.data_use,
        privacy_policy: this.dataPrivacySettings.privacy_policy,
        is_active: this.dataPrivacySettings.is_active,
      });
    }
  }

  getConfigDataPrivacyIsActive(): boolean {
    const is_active = this.parentForm.get('datause_privacy_policy_setting.is_active');
    if (is_active.dirty === true) return is_active.value;
    else return null;
  }
  getConfigDataPrivacyDataUse(): string {
    const data_use = this.parentForm.get('datause_privacy_policy_setting.data_use');
    if (data_use.dirty === true) return data_use.value;
    else return '';
  }

  getConfigDataPrivacyPolicy(): string {
    const privacy_policy = this.parentForm.get('datause_privacy_policy_setting.privacy_policy');
    if (privacy_policy.dirty === true) return privacy_policy.value;
    else return '';
  }

  onSaveConfigDataPrivacy(): void {
    const dataPrivacyForm: IWebsiteConfigDataPrivacy = {};

    const dataPrivacyFormGroup = this.parentForm?.get('datause_privacy_policy_setting') as FormGroup;
    const is_active = this.getConfigDataPrivacyIsActive();

    const data_use = this.getConfigDataPrivacyDataUse();
    const privacy_policy = this.getConfigDataPrivacyPolicy();

    !_.isNil(is_active) ? (dataPrivacyForm.is_active = is_active) : null;
    !_.isEmpty(data_use) ? (dataPrivacyForm.data_use = data_use) : null;
    !_.isEmpty(privacy_policy) ? (dataPrivacyForm.privacy_policy = privacy_policy) : null;
    if (dataPrivacyForm && dataPrivacyFormGroup.valid && dataPrivacyFormGroup.dirty) {
      this.settingWebsiteService
        .saveConfigDataPrivacy(dataPrivacyForm)
        .pipe(
          takeUntil(this.destroy$),
          catchError((e) => {
            console.log('e  => onSaveConfigDataPrivacy :>> ', e);
            this.snackBarService.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe((result) => {
          if (result?.status === 200) {
            this.snackBarService.showSnackBar(StatusSnackbarType.SUCCESS, 'Your changes have been saved successfully');
            this.parentForm.markAsPristine();
            this.dataPrivacyForm.markAsPristine();
            this.settingService.setOriginalForm(_.cloneDeep(this.parentForm));
          } else {
            this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, `${result?.value}`);
          }
        });
    } else {
      this.snackBarService.showSnackBar(StatusSnackbarType.WARNING, 'No changes have been made!');
    }
  }

  onInitConfigDataPrivacyValue(): void {
    this.settingWebsiteService
      .getConfigDataPrivacy()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.dataPrivacySettings = res;
        this.patchDataPrivacy();
      });
  }

  onDetectRouteChange(nextRoute: string[]): void {
    if (this.dataPrivacyForm.dirty) {
      this.settingService.unsavedDialog(nextRoute);
    } else {
      if (!this.settingService.isTabChanging) {
        void this.router.navigate(nextRoute);
      }
    }
  }
}
