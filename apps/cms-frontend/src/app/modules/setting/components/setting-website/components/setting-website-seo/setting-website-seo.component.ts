import { ControlContainer, FormBuilder, FormControl, FormGroup, FormGroupDirective } from '@angular/forms';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { Subject, EMPTY } from 'rxjs';
import { StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { catchError, takeUntil } from 'rxjs/operators';
import * as _ from 'lodash';
import { IWebsiteConfigSEO } from '@reactor-room/cms-models-lib';
import { SettingGeneralService } from '../../../../services/setting-general/setting-general-service';
import { Router } from '@angular/router';
import { ShowSnackBarService } from '../../../../services/snackbar/show-snackbar.service';

@Component({
  selector: 'cms-next-setting-website-seo',
  templateUrl: './setting-website-seo.component.html',
  styleUrls: ['./setting-website.seo.component.scss'],
})
export class SettingWebsiteSeoComponent implements OnInit, OnDestroy {
  seoSettingForm: FormGroup;
  destroy$ = new Subject();
  parentForm: FormGroup;
  seoSettings: IWebsiteConfigSEO;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private settingWebsiteService: SettingWebsiteService,
    private settingService: SettingGeneralService,
    private router: Router,
    private snackBarService: ShowSnackBarService,
  ) {}
  get getCurrentForm(): FormGroup {
    return this.parentForm.get('seoSetting') as FormGroup;
  }
  get getKeyword(): FormControl {
    return this.seoSettingForm.get('keyword') as FormControl;
  }

  get getKeywordField(): FormControl {
    return <FormControl>this.parentForm.get('seoSetting.keyword_field');
  }
  ngOnInit() {
    this.onSaveAction();
    this.onRouteChange();
    this.parentForm = this.parentFormDirective.form;
    this.formCheck();

    this.onInitConfigSEOValue();
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  formCheck(): void {
    const form = this.getCurrentForm;
    if (_.isEmpty(form)) {
      this.seoSettingForm = this.getConfigSeo();
      this.parentForm.addControl('seoSetting', this.seoSettingForm);
    } else {
      this.seoSettingForm = form;
    }
  }

  onSaveAction(): void {
    this.settingService
      .getSaveAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSaveConfigSEO();
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

  addKeyword(): void {
    const keyword = this.parentForm.get('seoSetting.keyword').value;
    if (keyword) {
      const noLineBreakValue = this.getKeywordField.value.replace('\n', '');
      keyword.push(noLineBreakValue);
      this.parentForm.get('seoSetting.keyword').patchValue(keyword);
      this.parentForm.get('seoSetting.keyword').markAsDirty();
      this.getKeywordField.reset();
    }
  }

  removeKeyword(keyword: string) {
    const keywordArray = <FormGroup>this.seoSettingForm.controls['keyword'];
    keywordArray.value.splice(keywordArray.value.indexOf(keyword), 1);
    this.getKeyword.patchValue(keywordArray.value);
    this.parentForm.get('seoSetting.keyword').markAsDirty();
  }

  getConfigSeo(): FormGroup {
    return this.fb.group({
      culture_ui: ['TH'],
      title: [''],
      keyword: [[]],
      keyword_field: [''],
      description: [''],
    });
  }

  patchSEOValues(): void {
    if (this.seoSettings) {
      this.seoSettingForm.patchValue({
        culture_ui: this.seoSettings.culture_ui,
        description: this.seoSettings.description,
        keyword: this.seoSettings.keyword,
        title: this.seoSettings.title,
      });
    }
  }

  getConfigSeoTitle(): string {
    const seo_title = this.parentForm.get('seoSetting.title');
    if (seo_title.dirty === true) return seo_title.value;
    else return '';
  }
  getConfigSeoKeywords(): string[] {
    const seo_keywords = this.parentForm.get('seoSetting.keyword');
    if (seo_keywords.dirty) {
      return seo_keywords.value;
    } else return null;
  }
  getConfigSeoDescription(): string {
    const seo_description = this.parentForm.get('seoSetting.description');
    if (seo_description.dirty === true) return seo_description.value;
    else return '';
  }
  onSaveConfigSEO(): void {
    const seoSettingGroup = this.parentForm.get('seoSetting');
    const seoSettingForm: IWebsiteConfigSEO = {};
    const seo_title = this.getConfigSeoTitle();

    !_.isEmpty(seo_title) ? (seoSettingForm.title = seo_title) : null;

    const seo_keywords = this.getConfigSeoKeywords();
    !_.isNil(seo_keywords) ? (seoSettingForm.keyword = seo_keywords) : null;

    const seo_description = this.getConfigSeoDescription();
    !_.isEmpty(seo_description) ? (seoSettingForm.description = seo_description) : null;

    seoSettingForm.culture_ui = this.parentForm.get('seoSetting.culture_ui').value;
    if (seoSettingGroup.valid && seoSettingGroup.dirty) {
      this.settingWebsiteService
        .saveConfigSEO(seoSettingForm)
        .pipe(
          takeUntil(this.destroy$),
          catchError((e) => {
            console.log('e  => onSaveConfigSEO :>> ', e);
            this.snackBarService.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe((result) => {
          if (result?.status === 200) {
            this.snackBarService.showSnackBar(StatusSnackbarType.SUCCESS, 'Your changes have been saved successfully');
            this.parentForm.markAsPristine();
            this.seoSettingForm.markAsPristine();
            this.settingService.setOriginalForm(_.cloneDeep(this.parentForm));
          } else {
            this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, `${result?.value}`);
          }
        });
    } else {
      this.snackBarService.showSnackBar(StatusSnackbarType.WARNING, 'SEO : No changes have been made!');
    }
  }

  onInitConfigSEOValue(): void {
    this.settingWebsiteService
      .getConfigSEO()
      .pipe(
        takeUntil(this.destroy$),
        catchError((e) => {
          console.log('e  => onInitConfigSEOValue :>> ', e);
          this.snackBarService.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe((configSEO) => {
        if (configSEO) {
          this.seoSettings = configSEO;
          this.patchSEOValues();
        } else {
          this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, 'Not Find Any General ConFig Setting!');
        }
      });
  }

  onDetectRouteChange(newRoute: string[]): void {
    if (this.seoSettingForm.dirty) {
      this.settingService.unsavedDialog(newRoute);
    } else {
      if (!this.settingService.isTabChanging) {
        void this.router.navigate(newRoute);
      }
    }
  }
}
