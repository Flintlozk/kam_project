import { Component, OnDestroy, OnInit } from '@angular/core';
import { AbstractControl, ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';

import { Router } from '@angular/router';

import {
  ConfigGenerals,
  EnumConfigGeneral,
  ILanguage,
  IWebsiteConfigGeneral,
  IWebsiteConfigGeneralFavicon,
  IWebsiteConfigGeneralGeneral,
  IWebsiteConfigGeneralLanguage,
  IWebsiteConfigGeneralMobileView,
  IWebsiteConfigGeneralNotification,
  IWebsiteConfigGeneralSearch,
} from '@reactor-room/cms-models-lib';
import { StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { SettingGeneralService } from '../../../../services/setting-general/setting-general-service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil, debounceTime, distinctUntilChanged } from 'rxjs/operators';
import * as _ from 'lodash';
import { ShowSnackBarService } from '../../../../services/snackbar/show-snackbar.service';
enum EnumWebsiteSetting {
  GENERAL = 0,
  SEO = 1,
  META = 2,
  CSS = 3,
  DATAPRIVACY = 4,
}
@Component({
  selector: 'cms-next-setting-website-general',
  templateUrl: './setting-website-general.component.html',
  styleUrls: ['./setting-website-general.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class SettingWebsiteGeneralComponent implements OnInit, OnDestroy {
  generalSettingForm: FormGroup;
  parentForm: FormGroup;
  languageList: ILanguage[] = [];
  configGeneral: IWebsiteConfigGeneral;
  destroy$ = new Subject();
  originalForm: FormGroup = null;
  defaultLanguage: FormGroup;

  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private settingGeneralService: SettingGeneralService,
    private settingWebsiteService: SettingWebsiteService,
    private snackBarService: ShowSnackBarService,
    private router: Router,
  ) {}
  get getCurrentForm(): FormGroup {
    return this.parentForm.get('generalSetting') as FormGroup;
  }

  get getLangFieldControl(): AbstractControl[] {
    return (<FormArray>this.generalSettingForm.get('language')).controls;
  }
  ngOnInit(): void {
    this.onSaveAction();
    this.onRouteChange();
    this.parentForm = this.parentFormDirective.form;
    this.formCheck();
    this.onInitConfigGeneralValue();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
  formCheck(): void {
    const form = this.getCurrentForm;
    if (_.isEmpty(form)) {
      this.generalSettingForm = this.getGeneralSettingFormGroup();
      this.parentForm.addControl('generalSetting', this.generalSettingForm);
    } else {
      this.generalSettingForm = form;
    }
  }

  onSaveAction(): void {
    this.settingGeneralService
      .getSaveAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSaveConfigGeneral();
      });
  }

  onRouteChange(): void {
    this.settingGeneralService
      .getUnsaveDialog()
      .pipe(takeUntil(this.destroy$))
      .subscribe((nextRoute) => {
        this.onDetectRouteChange(nextRoute);
      });
  }

  trackByIndex(index: number): number {
    return index;
  }
  getGeneralSettingFormGroup(): FormGroup {
    const generalSettingFormGroup = this.fb.group({
      language: this.getGeneralSettingLanguageFormArray(),
    });
    return generalSettingFormGroup;
  }

  handleFormData(): void {
    this.settingGeneralService.setOriginalForm(_.cloneDeep(this.parentForm));
    this.parentForm.valueChanges.pipe(distinctUntilChanged(), debounceTime(200)).subscribe((form) => {
      this.originalForm = this.settingGeneralService.getOriginalForm();
      if (this.settingGeneralService.getCurrentSection() !== EnumWebsiteSetting.META && this.settingGeneralService.getCurrentSection() !== EnumWebsiteSetting.CSS) {
        this.parentForm = this.settingGeneralService.dirtyStateCheck(this.parentForm, this.parentForm);
      }
    });
  }

  getGeneralSettingLanguageFormArray(): FormArray {
    const generalSettingLanguageFormArray = this.fb.array([]);
    return generalSettingLanguageFormArray;
  }

  patchTemporaryCloseComponent(): void {
    this.generalSettingForm.get('temporary_close').patchValue(this.configGeneral.temporary_close);
  }
  patchGeneralViewComponent(): void {
    this.generalSettingForm.get('general').patchValue(this.configGeneral.general);
    this.settingGeneralService.selectedCurrency = this.configGeneral.general.header.currency_converter_setting.selected_main_converter;
  }
  patchMobileViewComponent(): void {
    this.generalSettingForm.get('mobile_view').patchValue(this.configGeneral.mobile_view);
  }
  patchSearchViewComponent(): void {
    this.generalSettingForm.get('search').patchValue(this.configGeneral.search);
  }
  patchNotificationViewComponent(): void {
    this.generalSettingForm.get('notification').patchValue(this.configGeneral.notification);
  }
  patchEmailSenderViewComponent(): void {
    this.generalSettingForm.get('email_sender_name').patchValue(this.configGeneral.email_sender_name);
  }

  getConfigGeneral(): IWebsiteConfigGeneral {
    const configGeneral: IWebsiteConfigGeneral = {};

    const language = this.getConfigGenralLanguage();
    !_.isEmpty(language) ? (configGeneral.language = language) : null;

    const email_sender_name = this.getConfigGeneralEmailSenderName();
    !_.isEmpty(email_sender_name) ? (configGeneral.email_sender_name = email_sender_name) : null;

    const general = this.getConfigGeneralContent();
    !_.isEmpty(general) ? (configGeneral.general = general) : null;

    const temporary_close = this.getConfigGeneralTempContent();
    !_.isNil(temporary_close) ? (configGeneral.temporary_close = temporary_close) : null;

    const search = this.getConfigGeneralSearchContent();
    !_.isEmpty(search) ? (configGeneral.search = search) : null;

    const mobile_view = this.getConfigGeneralMobileViewContent();
    !_.isEmpty(mobile_view) ? (configGeneral.mobile_view = mobile_view) : null;

    const notification = this.getConfigGeneralNotificationContent();
    !_.isEmpty(notification) ? (configGeneral.notification = notification) : null;

    const favicon = this.getConfigGeneralFaviconContent();
    !_.isEmpty(favicon) ? (configGeneral.favicon = favicon) : null;
    return configGeneral;
  }

  getConfigGeneralEmailSenderName(): string {
    const senderDirtyStates = this.parentForm.get(ConfigGenerals.EMAIL_SENDER_NAME);
    if (senderDirtyStates.dirty === true) return senderDirtyStates.value;
    else return '';
  }
  getConfigGeneralMobileViewContent(): IWebsiteConfigGeneralMobileView {
    const mobileDirtyStates = this.settingGeneralService.getDirtyValues(this.parentForm.get(ConfigGenerals.MOBILE_VIEW));
    return mobileDirtyStates;
  }
  getConfigGeneralNotificationContent(): IWebsiteConfigGeneralNotification {
    const notiStates = this.settingGeneralService.getDirtyValues(this.parentForm.get(ConfigGenerals.NOTIFICATION));
    return notiStates;
  }

  getConfigGeneralFaviconContent(): IWebsiteConfigGeneralFavicon {
    const faviconStates = this.settingGeneralService.getDirtyValues(this.parentForm.get(ConfigGenerals.FAVICON));
    return faviconStates;
  }
  getConfigGeneralTempContent(): boolean {
    let dirtyState = null;
    if (this.parentForm.get(ConfigGenerals.TEMPORARY_CLOSE).dirty) {
      dirtyState = this.parentForm.get(ConfigGenerals.TEMPORARY_CLOSE).value;
    }
    return dirtyState;
  }
  getConfigGeneralSearchContent(): IWebsiteConfigGeneralSearch {
    const searchDirtyStates = this.settingGeneralService.getDirtyValues(this.parentForm.get(ConfigGenerals.SEARCH));
    return searchDirtyStates;
  }
  getConfigGeneralContent(): IWebsiteConfigGeneralGeneral {
    const generalDirtyStates = this.settingGeneralService.getDirtyValues(this.parentForm.get(ConfigGenerals.GENERAL));
    const generalContents = this.getCurrencyConverter(generalDirtyStates);
    return generalContents;
  }

  getCurrencyConverter(generalDirtyStates): any {
    const selectedCurrencies = [];
    const languageFormArray = this.parentForm?.get('generalSetting.general.header.currency_converter_setting.selected_main_converter') as FormArray;
    if (languageFormArray.dirty) {
      languageFormArray.controls.forEach((item) => {
        if (item.get('selected').value) {
          selectedCurrencies.push(item.get('isoCode').value);
        }
      });
      _.set(generalDirtyStates, 'header.currency_converter_setting.selected_main_converter', selectedCurrencies);
    }
    return generalDirtyStates;
  }

  getConfigGenralLanguage(): IWebsiteConfigGeneralLanguage {
    const configGeneralLangage: IWebsiteConfigGeneralLanguage = {
      defaultCultureUI: null,
      selectedCultureUIs: [],
    };
    const languageFormArray = this.parentForm?.get('generalSetting')?.get('language') as FormArray;
    languageFormArray.value.forEach((language) => {
      if (language?.default) configGeneralLangage.defaultCultureUI = language.cultureUI;
      if (!language.default && language.selected) configGeneralLangage.selectedCultureUIs.push(language.cultureUI);
    });
    return configGeneralLangage;
  }

  onSaveConfigGeneral(): void {
    this.configGeneral = this.getConfigGeneral();
    const generalSettingFormGroup = this.parentForm?.get('generalSetting') as FormGroup;
    if (this.configGeneral && generalSettingFormGroup.valid && generalSettingFormGroup.dirty) {
      this.settingWebsiteService
        .saveConfigGeneral(this.configGeneral)
        .pipe(
          takeUntil(this.destroy$),
          catchError((e) => {
            console.log('e  => onSaveConfigGeneral :>> ', e);
            this.snackBarService.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe((result) => {
          if (result?.status === 200) {
            this.snackBarService.showSnackBar(StatusSnackbarType.SUCCESS, 'Your changes have been saved successfully');
            this.parentForm.markAsPristine();
            this.generalSettingForm.markAsPristine();
            this.settingGeneralService.setOriginalForm(_.cloneDeep(this.parentForm));
          } else {
            this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, `${result?.value}`);
          }
        });
    } else {
      this.snackBarService.showSnackBar(StatusSnackbarType.WARNING, 'No changes have been made!');
    }
  }

  onInitConfigGeneralValue(): void {
    this.settingWebsiteService
      .getConfigGeneral()
      .pipe(
        takeUntil(this.destroy$),
        catchError((e) => {
          console.log('e  => onInitConfigGeneralValue :>> ', e);
          this.snackBarService.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe((configGeneral) => {
        if (configGeneral) {
          this.configGeneral = configGeneral;
          this.handleFormData();
        } else {
          this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, 'Not Find Any General ConFig Setting!');
        }
      });
  }

  onDetectRouteChange(nextRoute: string[]): void {
    if (this.generalSettingForm.dirty) {
      this.settingGeneralService.unsavedDialog(nextRoute);
    } else {
      if (!this.settingGeneralService.isTabChanging) {
        void this.router.navigate(nextRoute);
      }
    }
  }

  patchFormValue(param: { name: EnumConfigGeneral }): void {
    switch (param.name) {
      case EnumConfigGeneral.GENERAL_VIEW: {
        this.patchGeneralViewComponent();
        break;
      }
      case EnumConfigGeneral.ICON_UPLOAD: {
        break;
      }
      case EnumConfigGeneral.LANGUAGE: {
        break;
      }
      case EnumConfigGeneral.TEMPORARY_CLOSE: {
        this.patchTemporaryCloseComponent();
        break;
      }
      case EnumConfigGeneral.EMAIL_SENDER: {
        this.patchEmailSenderViewComponent();
        break;
      }
      case EnumConfigGeneral.MOBILE_VIEW: {
        this.patchMobileViewComponent();
        break;
      }
      case EnumConfigGeneral.SEARCH: {
        this.patchSearchViewComponent();
        break;
      }
      case EnumConfigGeneral.NOTIFICATION: {
        this.patchNotificationViewComponent();
        break;
      }
    }
  }
}
