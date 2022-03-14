import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnumThemeMode } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { CmsThemeRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ThemeSettingColor } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { replaceHrefAttribute } from 'apps/cms-frontend/src/app/modules/cms/services/domain/common.domain';
import { WebsiteService } from 'apps/cms-frontend/src/app/modules/cms/services/website.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-theme-setting-color',
  templateUrl: './cms-theme-setting-color.component.html',
  styleUrls: ['./cms-theme-setting-color.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsThemeSettingColorComponent implements OnInit, OnDestroy, AfterViewInit {
  themeSettingColorForm: FormGroup;
  parentForm: FormGroup;
  themeMode: EnumThemeMode;
  EnumThemeMode = EnumThemeMode;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private cmsThemeService: CmsEditThemeService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private sidebarService: CmsSidebarService,
    private websiteService: WebsiteService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.themeSettingColorForm = this.getThemeSettingColorFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('themeSettingColorForm', this.themeSettingColorForm);
  }

  getThemeSettingColorFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      color: this.getThemeSettingColorFormArray(),
      component: [],
      themeColor: [''],
    });
    return formGroup;
  }

  getThemeSettingColorFormArray(): FormArray {
    const formArray = this.fb.array([]);
    return formArray;
  }

  getThemeSettingColorDefailsFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      type: [''],
      dark: this.getThemeSettingColorPropertyFormGroup(),
      light: this.getThemeSettingColorPropertyFormGroup(),
    });
    return formGroup;
  }

  getThemeSettingColorPropertyFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      color: [''],
      opacity: [],
      bgColor: [''],
      bgOpacity: [],
    });
    return formGroup;
  }

  ngAfterViewInit(): void {
    this.sidebarService.getThemeMode.pipe(takeUntil(this.destroy$)).subscribe((mode) => {
      this.themeMode = mode;
    });
    this.cmsThemeService.getThemeColorSettingFormValue.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        const colorData = value?.color ? value.color : value;
        this.themeSettingColorForm.get('component').patchValue(value?.component);
        const colorFormArray = this.themeSettingColorForm.get('color') as FormArray;
        colorFormArray.clear();
        colorData.forEach((color) => {
          const colorFormGroup = this.getThemeSettingColorDefailsFormGroup();
          colorFormGroup.patchValue(color);
          colorFormArray.push(colorFormGroup);
        });
      }
    });
    this.onFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onFormValueChange(): void {
    this.themeSettingColorForm.valueChanges
      .pipe(
        startWith(this.themeSettingColorForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.cmsThemeService.setThemeColorSetting(value.color);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const themeSettingColor: ThemeSettingColor = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsThemeRenderingComponent,
          };
          this.onUpdateSharingThemeConfigColor(newValue);
          if (!newValue.component) {
            this.undoRedoService.addThemeSettingColor(themeSettingColor);
          }
        }
      });
  }

  onUpdateSharingThemeConfigColor(newValue: ThemeSettingColor) {
    const color = newValue.color;
    this.websiteService
      .updateSharingThemeConfigColor(color)
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
              let replaceTerm = environmentLib.cms.CMSFileSettingName;
              replaceTerm = replaceTerm.split('.')[0];
              const replaceValue = results.value;
              replaceHrefAttribute(replaceTerm, replaceValue);
            }
          }
        }),
        catchError((e) => {
          console.log('e  => onUpdateSharingThemeConfigColor :>> ', e);
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
