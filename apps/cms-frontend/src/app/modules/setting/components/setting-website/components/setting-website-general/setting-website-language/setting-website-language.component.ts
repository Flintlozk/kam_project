import { Component, EventEmitter, Input, OnDestroy, OnInit, Output, ViewEncapsulation } from '@angular/core';
import { FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ILanguage, IWebsiteConfigGeneral, IWebsiteConfigGeneralLanguage } from '@reactor-room/cms-models-lib';
import { LanguageService } from 'apps/cms-frontend/src/app/services/language.service';
import { catchError, switchMap, takeUntil } from 'rxjs/operators';
import { EMPTY, Subject } from 'rxjs';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import * as _ from 'lodash';
@Component({
  selector: 'cms-next-setting-website-language',
  templateUrl: './setting-website-language.component.html',
  styleUrls: ['./setting-website-language.component.scss'],
})
export class SettingWebsiteLanguageComponent implements OnInit, OnDestroy {
  generalSettingForm: FormGroup;
  parentForm: FormGroup;
  languageList: ILanguage[] = [];
  destroy$ = new Subject<void>();
  defaultLanguage: FormGroup;
  generalLanguage: IWebsiteConfigGeneralLanguage;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private languageService: LanguageService,
    private configGeneralService: SettingWebsiteService,
  ) {}
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }
  ngOnInit(): void {
    this.parentForm = this.parentFormDirective.form;
    this.generalSettingForm = this.parentForm as FormGroup;
    this.getLanguages();
  }
  getLanguages(): void {
    this.languageService
      .getLanguages()
      .pipe(
        takeUntil(this.destroy$),
        catchError((e) => {
          console.log('e  => SettingWebsiteLanguageComponent : onInit :>> ', e);
          return EMPTY;
        }),
      )
      .subscribe((result) => {
        this.languageList = result;
        this.patchLanguageListToLangageForm();
      });
  }
  getGeneralSettingLanguageFormArray(): FormArray {
    const generalSettingLanguageFormArray = this.fb.array([]);
    return generalSettingLanguageFormArray;
  }

  getGeneralSettingLanguageFormGroup(): FormGroup {
    const generalSettingLanguageFormGroup = this.fb.group({
      selected: [false],
      default: [false],
      icon: [''],
      name: [''],
      localName: [''],
      cultureUI: [''],
    });
    return generalSettingLanguageFormGroup;
  }

  patchLanguageListToLangageForm(): void {
    this.configGeneralService
      .getConfigGeneralLanguage()
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.generalLanguage = res;
        const languageFormArray = this.generalSettingForm.get('language') as FormArray;
        languageFormArray.clear();

        this.languageList.forEach((language) => {
          const languageFormGroup = this.getGeneralSettingLanguageFormGroup();
          languageFormGroup.patchValue({
            selected: false,
            default: false,
            icon: language.icon,
            name: language.name,
            localName: language.localName,
            cultureUI: language.cultureUI,
          });
          if (this.generalLanguage.selectedCultureUIs.includes(language.cultureUI)) {
            languageFormGroup.controls.selected.patchValue(true);
          } else {
            languageFormGroup.controls.selected.patchValue(false);
          }

          if (language.cultureUI === this.generalLanguage.defaultCultureUI) {
            languageFormGroup.controls.default.patchValue(true);

            this.defaultLanguage = languageFormGroup;
            languageFormGroup.controls.selected.patchValue(true);
          } else languageFormGroup.controls.default.patchValue(false);
          languageFormArray.push(languageFormGroup);
        });
      });
  }

  onChangeDefaultLanguage(index: number): void {
    this.generalSettingForm.markAsDirty();
    const languageFormArray = this.generalSettingForm.get('language') as FormArray;
    languageFormArray.controls.forEach((languageControl) => {
      languageControl.get('default').markAsDirty();
      languageControl.get('default').patchValue(false);
    });
    languageFormArray.controls[index].get('default').markAsDirty();
    languageFormArray.controls[index].get('selected').markAsDirty();

    this.defaultLanguage = languageFormArray.controls[index] as FormGroup;

    languageFormArray.controls[index].get('default').patchValue(true);
    languageFormArray.controls[index].get('selected').patchValue(true);
  }
}
