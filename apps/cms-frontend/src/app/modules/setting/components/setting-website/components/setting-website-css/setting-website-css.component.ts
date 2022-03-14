import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormArray, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { IWebsiteConfigCSS, IWebsiteConfigCSSWithLanguage, ILanguage } from '@reactor-room/cms-models-lib';
import { LanguageService } from 'apps/cms-frontend/src/app/services/language.service';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, takeUntil } from 'rxjs/operators';
import { StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { SettingGeneralService } from '../../../../services/setting-general/setting-general-service';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ShowSnackBarService } from '../../../../services/snackbar/show-snackbar.service';
@Component({
  selector: 'cms-next-setting-website-css',
  templateUrl: './setting-website-css.component.html',
  styleUrls: ['./setting-website-css.component.scss'],
})
export class SettingWebsiteCssComponent implements OnInit, OnDestroy {
  options: { value: string; valueString: string }[] = [];
  selectedOptionValue = '';
  languages: ILanguage[] = [];
  selectedOption: ILanguage;
  cssWithLang: IWebsiteConfigCSS[];
  cssSettingForm: FormGroup;
  cssSettings: IWebsiteConfigCSS;
  editorOptions = { theme: 'vs-light', language: 'css', minimap: { enabled: false }, automaticLayout: true };
  parentForm: FormGroup;
  originalGlobalForm: string;
  originalCSSwithLanguage: IWebsiteConfigCSSWithLanguage[];
  isUserTypedField = false;
  isUserTypeGlobal = false;

  destroy$ = new Subject();
  constructor(
    private languageService: LanguageService,
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private settingWebsiteService: SettingWebsiteService,
    private settingService: SettingGeneralService,
    private router: Router,
    private snackBarService: ShowSnackBarService,
  ) {}

  get getLangArray(): FormArray {
    return this.parentForm.get('css_setting.css_with_language') as FormArray;
  }
  get getCurrentForm(): FormGroup {
    return this.parentForm.get('css_setting') as FormGroup;
  }

  get getCSSwithLanguages(): IWebsiteConfigCSSWithLanguage[] {
    return this.parentForm.get('css_setting.css_with_language').value;
  }
  get getCSSField(): FormControl {
    return this.parentForm.get('css_setting.css_field') as FormControl;
  }
  get getCSSwithLanguagesControl(): FormControl {
    return this.parentForm.get('css_setting.css_with_language') as FormControl;
  }

  ngOnInit(): void {
    this.onSaveAction();
    this.onRouteChange();
    this.parentForm = this.parentFormDirective.form;
    this.getLanguages();
    this.formCheck();
    this.onInitConfigCSSValue();
    this.onCSSFormChanged();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  formCheck(): void {
    const form = this.getCurrentForm;
    if (_.isEmpty(form)) {
      this.generateCSSSettingForm();
      this.parentForm.addControl('css_setting', this.cssSettingForm);
    } else {
      const langs = this.getLangArray;
      langs.clear();
      this.cssSettingForm = form;
    }
  }
  onSaveAction(): void {
    this.settingService
      .getSaveAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSaveConfigCSS();
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

  onUserTypeGlobal(): void {
    if (!_.isEqual(this.cssSettingForm.get('global').value, this.originalGlobalForm)) {
      this.isUserTypeGlobal = true;
    } else {
      this.isUserTypeGlobal = false;
    }
  }

  onUserTypeField(): void {
    if (!_.isEqual(this.cssSettingForm.get('css_with_language').value, this.originalCSSwithLanguage)) {
      this.isUserTypedField = true;
    } else {
      this.isUserTypedField = false;
    }
  }

  selectedLang(event): void {
    this.selectedOptionValue = event.value;
    try {
      for (let languageIndex = 0; languageIndex < this.languages.length; languageIndex++) {
        if (_.isEqual(this.languages[languageIndex].cultureUI, this.selectedOptionValue)) {
          this.selectedOption = this.languages[languageIndex];
        }
      }
      Object.keys(this.getCSSwithLanguages).forEach((key) => {
        if (this.getCSSwithLanguages[key]['language'] === this.selectedOptionValue) {
          this.getCSSField.patchValue(this.getCSSwithLanguages[key]['stylesheet']);
        }
      });
    } catch (error) {
      console.log('e  => selectedLang :>> ', error);
      this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, 'Language does not exist');
    }
  }
  onCSSFormChanged(): void {
    this.cssSettingForm
      .get('css_field')
      .valueChanges.pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        Object.keys(this.getCSSwithLanguages).forEach((key) => {
          if (this.selectedOptionValue === this.getCSSwithLanguages[key]['language']) {
            this.parentForm.get('css_setting.css_with_language.' + key).patchValue({
              language: this.getCSSwithLanguages[key]['language'],
              stylesheet: this.getCSSField.value,
            });
            this.parentForm.get('css_setting.css_with_language.' + key).markAsDirty();
          }
        });
      });
  }
  generateCSSSettingForm(): void {
    this.cssSettingForm = this.fb.group({
      global: [''],
      css_with_language: this.fb.array([]),
      css_field: [''],
    });
  }

  getLanguages(): void {
    this.languageService.getLanguages().subscribe((languages) => {
      for (let languageIndex = 0; languageIndex < languages.length; languageIndex++) {
        this.languages.push(languages[languageIndex]);
        this.options.push({ value: languages[languageIndex].cultureUI, valueString: languages[languageIndex].cultureUI + ' : ' + languages[languageIndex].name });
        this.selectedOptionValue = this.options[0].value;
        this.selectedOption = languages[0];
      }
    });
  }

  patchCSSValues(): void {
    if (this.cssSettings) {
      this.cssSettingForm.patchValue({
        global: this.cssSettings.global,
        css_with_language: this.cssSettings.css_with_language,
      });
      this.parentForm.get('css_setting.css_field').setValue(this.cssSettings.css_with_language[0].stylesheet);
      Object.keys(this.cssSettings.css_with_language).forEach((key) => {
        const languages = <FormArray>this.cssSettingForm.get('css_with_language');
        languages.push(this.fb.control(this.cssSettings.css_with_language[key]));
      });
      this.originalGlobalForm = _.cloneDeep(this.cssSettingForm.get('global').value);
      this.originalCSSwithLanguage = _.cloneDeep(this.cssSettingForm.get('css_with_language').value);
    }
  }

  getConfigCSSGlobal(): string {
    const global = this.isUserTypeGlobal;
    if (global === true) return this.parentForm.get('css_setting.global').value;
    else return '';
  }
  getConfigCSSWithLanguage(): IWebsiteConfigCSSWithLanguage[] {
    const css_with_language = this.isUserTypedField;
    if (css_with_language === true) return this.parentForm.get('css_setting.css_with_language').value;
    else return [];
  }
  resetUserType(): void {
    this.isUserTypeGlobal = false;
    this.isUserTypedField = false;
  }
  onSaveConfigCSS(): void {
    const cssSettingForm: IWebsiteConfigCSS = {};
    const global = this.getConfigCSSGlobal();
    !_.isEmpty(global) ? (cssSettingForm.global = global) : null;
    const css_with_language = this.getConfigCSSWithLanguage();
    !_.isEmpty(css_with_language) ? (cssSettingForm.css_with_language = css_with_language) : null;
    if (this.isUserTypeGlobal || this.isUserTypedField) {
      this.settingWebsiteService
        .saveConfigCSS(cssSettingForm)
        .pipe(
          takeUntil(this.destroy$),
          catchError((e) => {
            console.log('e  => onSaveConfigCSS :>> ', e);
            this.snackBarService.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe((result) => {
          if (result?.status === 200) {
            this.snackBarService.showSnackBar(StatusSnackbarType.SUCCESS, 'Your changes have been saved successfully');
            this.parentForm.markAsPristine();
            this.settingService.setOriginalForm(_.cloneDeep(this.parentForm));
            this.originalGlobalForm = _.cloneDeep(this.cssSettingForm.get('global').value);
            this.originalCSSwithLanguage = _.cloneDeep(this.cssSettingForm.get('css_with_language').value);
            this.resetUserType();
          } else {
            this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, `${result?.value}`);
          }
        });
    } else {
      this.snackBarService.showSnackBar(StatusSnackbarType.WARNING, 'CSS : No changes have been made!');
    }
  }

  onInitConfigCSSValue(): void {
    this.settingWebsiteService
      .getConfigCSS()
      .pipe(
        takeUntil(this.destroy$),
        catchError((e) => {
          console.log('e  => onInitConfigSEOValue :>> ', e);
          this.snackBarService.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe((configCSS) => {
        if (configCSS) {
          this.cssSettings = configCSS;
          this.patchCSSValues();
        } else {
          this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, 'Not Find Any General ConFig Setting!');
        }
      });
  }

  onDetectRouteChange(nextRoute: string[]): void {
    if (this.isUserTypeGlobal || this.isUserTypedField) {
      if (!this.settingService.isTabChanging) this.settingService.unsavedDialog(nextRoute);
    } else {
      if (!this.settingService.isTabChanging) {
        void this.router.navigate(nextRoute);
      }
    }
  }
}
