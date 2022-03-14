import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EFontStyle, EnumThemeRenderingSettingColorType, fontFamilyData, IDropDown, IFont, IThemeRenderingSettingFont, UnitEnum } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { CmsThemeRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ThemeSettingFont } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { autoCompleteFilter, replaceHrefAttribute } from 'apps/cms-frontend/src/app/modules/cms/services/domain/common.domain';
import { WebsiteService } from 'apps/cms-frontend/src/app/modules/cms/services/website.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { isEqual } from 'lodash';
import { EMPTY, Observable, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, map, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-theme-setting-text',
  templateUrl: './cms-theme-setting-text.component.html',
  styleUrls: ['./cms-theme-setting-text.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsThemeSettingTextComponent implements OnInit, OnDestroy, AfterViewInit {
  fontFamilyData = fontFamilyData;
  filterFontFamilyData: Observable<IDropDown[]>;
  fontStyleData: IDropDown[] = [
    {
      value: EFontStyle.REGULAR,
      title: EFontStyle.REGULAR,
    },
    {
      value: EFontStyle.BOLD,
      title: EFontStyle.BOLD,
    },
    {
      value: EFontStyle.ITALIC,
      title: EFontStyle.ITALIC,
    },
  ];
  unitData = UnitEnum;
  themeSettingTextForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private cmsThemeService: CmsEditThemeService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private websiteService: WebsiteService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.themeSettingTextForm = this.getThemeSettingTextFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('themeSettingTextForm', this.themeSettingTextForm);
  }

  getThemeSettingTextFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      font: this.getThemeSettingTextDetailFormArray(),
      component: [],
      themeFont: [''],
    });
    return formGroup;
  }

  getThemeSettingTextDetailFormArray(): FormArray {
    const formArray = this.fb.array([]);
    return formArray;
  }

  getThemeSettingTextDetailFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      type: [EnumThemeRenderingSettingColorType.HEADER],
      size: [textDefault.defaultFontSizePx],
      familyCode: [textDefault.defaultFontFamilyCode],
      unit: [textDefault.defaultFontSizeUnit],
      style: [textDefault.defaultFontFamilyStyle],
      lineHeight: [textDefault.defaultParagraphSetting],
      letterSpacing: [textDefault.defaultParagraphSetting],
      status: [false],
    });
    return formGroup;
  }

  ngAfterViewInit(): void {
    this.cmsThemeService.getThemeFontSettingFormValue.subscribe((value) => {
      if (value) {
        const fontData = value?.font ? value.font : value;
        this.themeSettingTextForm.get('component').patchValue(value?.component);
        const fontFormArray = this.themeSettingTextForm.get('font') as FormArray;
        fontFormArray.clear();
        fontData.forEach((font: IFont) => {
          const fontFormGroup = this.getThemeSettingTextDetailFormGroup();
          fontFormGroup.patchValue(font);
          fontFormArray.push(fontFormGroup);
        });
      }
    });
    this.onFormValueChange();
  }

  onFontFamilyValueChange(index: number): void {
    const fontFormArray = this.themeSettingTextForm['controls']['font']['controls'] as FormArray;
    const fontFamilyFormGroup = fontFormArray[index].get('familyCode') as FormGroup;
    this.filterFontFamilyData = fontFamilyFormGroup?.valueChanges.pipe(
      startWith(''),
      map((value) => autoCompleteFilter(value, this.fontFamilyData, 'object')),
    ) as Observable<IDropDown[]>;
  }

  onSwitchUnit(index: number): void {
    const fontFormArray = this.themeSettingTextForm['controls']['font']['controls'] as FormArray;
    const fontUnitFormGroup = fontFormArray[index].get('unit');
    switch (fontUnitFormGroup.value) {
      case UnitEnum.EM:
        fontUnitFormGroup.patchValue(UnitEnum.PX);
        break;
      case UnitEnum.PX:
        fontUnitFormGroup.patchValue(UnitEnum.EM);
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onFormValueChange(): void {
    this.themeSettingTextForm.valueChanges
      .pipe(
        startWith(this.themeSettingTextForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.cmsThemeService.setThemeFontSetting(value.font);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const themeSettingFont: ThemeSettingFont = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsThemeRenderingComponent,
          };
          const newFontValue = deepCopy(newValue?.font);
          newFontValue.forEach((fontItem) => delete fontItem?.status);
          const oldFontValue = deepCopy(oldValue?.font);
          oldFontValue.forEach((fontItem) => delete fontItem?.status);
          if (!isEqual(newFontValue, oldFontValue)) {
            this.onUpdateSharingThemeConfigFont(newFontValue);
          }
          if (!newValue.component) {
            this.undoRedoService.addThemeSettingFont(themeSettingFont);
          }
        }
      });
  }

  onUpdateSharingThemeConfigFont(font: IThemeRenderingSettingFont[]) {
    this.websiteService
      .updateSharingThemeConfigFont(font)
      .pipe(
        takeUntil(this.destroy$),
        tap((results) => {
          if (results?.status !== 200) {
            this.snackBar.openFromComponent(StatusSnackbarComponent, {
              data: {
                type: StatusSnackbarType.ERROR,
                message: results?.value,
              } as StatusSnackbarModel,
            });
          } else {
            if (results?.value) {
              const replaceTerm = environmentLib.cms.CMSFileSettingName;
              const replaceValue = results.value;
              replaceHrefAttribute(replaceTerm, replaceValue);
            }
          }
        }),
        catchError((e) => {
          console.log('e  => onUpdateSharingThemeConfigFont :>> ', e);
          this.showUnexpectedError();
          return EMPTY;
        }),
      )
      .subscribe();
  }

  showUnexpectedError(): void {
    this.snackBar.openFromComponent(StatusSnackbarComponent, {
      data: {
        type: StatusSnackbarType.ERROR,
        message: 'Unexpected Error occured...Try again later!',
      } as StatusSnackbarModel,
    });
  }
}
