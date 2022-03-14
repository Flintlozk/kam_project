import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { IWebsiteConfigMeta } from '@reactor-room/cms-models-lib';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { Subject, EMPTY } from 'rxjs';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { catchError, switchMap, takeUntil, tap } from 'rxjs/operators';
import { SettingGeneralService } from '../../../../services/setting-general/setting-general-service';
import * as _ from 'lodash';
import { Router } from '@angular/router';
import { ShowSnackBarService } from '../../../../services/snackbar/show-snackbar.service';

@Component({
  selector: 'cms-next-setting-website-metatag',
  templateUrl: './setting-website-metatag.component.html',
  styleUrls: ['./setting-website-metatag.component.scss'],
})
export class SettingWebsiteMetatagComponent implements OnInit, OnDestroy {
  metatagSettingForm: FormGroup;
  metatagSetting: IWebsiteConfigMeta;
  parentForm: FormGroup;
  editorOptionsHTML = { theme: 'vs', language: 'html', minimap: { enabled: false }, automaticLayout: true };
  editorOptionsJS = { theme: 'vs', language: 'javascript', minimap: { enabled: false }, automaticLayout: true };
  destroy$ = new Subject();
  isUserTypeMetaTag: boolean;
  isUserTypeBodyTag: boolean;
  isUserTypeJavascript: boolean;
  originalForms: IWebsiteConfigMeta;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private settingWebsiteService: SettingWebsiteService,
    private settingService: SettingGeneralService,
    private router: Router,
    private snackBarService: ShowSnackBarService,
  ) {}
  get getCurrentForm(): FormGroup {
    return this.parentForm.get('meta_tags') as FormGroup;
  }

  ngOnInit(): void {
    this.onSaveAction();
    this.onRouteChange();
    this.parentForm = this.parentFormDirective.form;
    this.formCheck();
    this.onInitConfigMetaValue();
  }

  formCheck(): void {
    const form = this.getCurrentForm;
    if (_.isEmpty(form)) {
      this.metatagSettingForm = this.generateMetaTagForm();
      this.parentForm.addControl('meta_tags', this.metatagSettingForm);
    } else {
      this.metatagSettingForm = form;
    }
  }

  onSaveAction(): void {
    this.settingService
      .getSaveAction()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.onSaveConfigMeta();
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

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.unsubscribe();
  }

  onUserTypeMetaTag(): void {
    if (!_.isEqual(this.originalForms.meta_tag, this.metatagSettingForm.get('meta_tag').value)) {
      this.isUserTypeMetaTag = true;
    } else {
      this.isUserTypeMetaTag = false;
    }
  }
  onUserTypeBodyTag(): void {
    if (!_.isEqual(this.originalForms.body_tag, this.metatagSettingForm.get('body_tag').value)) {
      this.isUserTypeBodyTag = true;
    } else {
      this.isUserTypeBodyTag = false;
    }
  }
  onUserTypeJavascript(): void {
    if (!_.isEqual(this.originalForms.javascript, this.metatagSettingForm.get('javascript').value)) {
      this.isUserTypeJavascript = true;
    } else {
      this.isUserTypeJavascript = false;
    }
  }
  generateMetaTagForm(): FormGroup {
    return this.fb.group({
      meta_tag: [''],
      body_tag: [''],
      javascript: [''],
    });
  }
  resetUserType(): void {
    this.isUserTypeBodyTag = false;
    this.isUserTypeJavascript = false;
    this.isUserTypeMetaTag = false;
  }
  onSaveConfigMeta(): void {
    const metaSettingForm: IWebsiteConfigMeta = {};

    const meta_tag = this.getConfigMetaMetaTag();
    const body_tag = this.getConfigMetaBodyTag();
    const javascript = this.getConfigMetaJavascript();

    !_.isEmpty(meta_tag) ? (metaSettingForm.meta_tag = meta_tag) : null;
    !_.isEmpty(body_tag) ? (metaSettingForm.body_tag = body_tag) : null;
    !_.isEmpty(javascript) ? (metaSettingForm.javascript = javascript) : null;

    if (this.isUserTypeBodyTag || this.isUserTypeMetaTag || this.isUserTypeJavascript) {
      this.settingWebsiteService
        .saveConfigMeta(metaSettingForm)
        .pipe(
          takeUntil(this.destroy$),
          catchError((e) => {
            console.log('e  => onSaveConfigMeta :>> ', e);
            this.snackBarService.showUnexpectedError();
            return EMPTY;
          }),
        )
        .subscribe((result) => {
          if (result?.status === 200) {
            this.snackBarService.showSnackBar(StatusSnackbarType.SUCCESS, 'Your changes have been saved successfully');
            this.parentForm.markAsPristine();
            this.resetUserType();
            this.settingService.setOriginalForm(_.cloneDeep(this.parentForm));
          } else {
            this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, `${result?.value}`);
          }
        });
    } else {
      this.snackBarService.showSnackBar(StatusSnackbarType.WARNING, 'Meta : No changes have been made!');
    }
  }
  getConfigMetaMetaTag(): string {
    const meta_tag = this.isUserTypeMetaTag;
    if (meta_tag === true) return this.parentForm.get('meta_tags.meta_tag').value;
    else return '';
  }
  getConfigMetaBodyTag(): string {
    const body_tag = this.isUserTypeBodyTag;
    if (body_tag === true) return this.parentForm.get('meta_tags.body_tag').value;
    else return '';
  }
  getConfigMetaJavascript(): string {
    const javascript = this.isUserTypeJavascript;
    if (javascript === true) return this.parentForm.get('meta_tags.javascript').value;
    else return '';
  }

  patchMetaValues(): void {
    if (this.metatagSetting) {
      this.originalForms = _.cloneDeep(this.metatagSetting);
      this.metatagSettingForm.patchValue({
        meta_tag: this.metatagSetting.meta_tag,
        body_tag: this.metatagSetting.body_tag,
        javascript: this.metatagSetting.javascript,
      });
    }
  }
  onInitConfigMetaValue(): void {
    this.settingWebsiteService
      .getConfigMeta()
      .pipe(
        takeUntil(this.destroy$),
        catchError((e) => {
          console.log('e  => onInitConfigMetaValue :>> ', e);
          this.snackBarService.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe((configMeta) => {
        if (configMeta) {
          this.metatagSetting = configMeta;
          this.patchMetaValues();
        } else {
          this.snackBarService.showSnackBar(StatusSnackbarType.ERROR, 'Not Find Any General ConFig Setting!');
        }
      });
  }

  onDetectRouteChange(nextRoute: string[]): void {
    if (this.isUserTypeMetaTag || this.isUserTypeJavascript || this.isUserTypeBodyTag) {
      if (!this.settingService.isTabChanging) this.settingService.unsavedDialog(nextRoute);
    } else {
      if (!this.settingService.isTabChanging) {
        void this.router.navigate(nextRoute);
      }
    }
  }
}
