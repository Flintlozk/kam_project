import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { IThemeGeneralInfo } from '@reactor-room/cms-models-lib';
import { CmsThemeRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ThemeSettingGeneral } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';

@Component({
  selector: 'cms-next-cms-theme-setting-theme',
  templateUrl: './cms-theme-setting-theme.component.html',
  styleUrls: ['./cms-theme-setting-theme.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsThemeSettingThemeComponent implements OnInit, AfterViewInit, OnDestroy {
  destroy$ = new Subject();
  parentForm: FormGroup;
  themeSettingGeneralForm: FormGroup;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private cmsThemeService: CmsEditThemeService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private sidebarService: CmsSidebarService,
  ) {}

  ngOnInit(): void {
    this.themeSettingGeneralForm = this.getThemeSettingGeneralFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('themeSettingGeneralForm', this.themeSettingGeneralForm);
  }

  ngAfterViewInit(): void {
    this.cmsThemeService.getThemeGeneralSettingFormValue.pipe(takeUntil(this.destroy$)).subscribe((value: IThemeGeneralInfo) => {
      if (value) {
        this.themeSettingGeneralForm.patchValue(value.html[0]);
      }
    });
    this.onFormValueChange();
  }

  onFormValueChange() {
    this.themeSettingGeneralForm.valueChanges
      .pipe(
        startWith(this.themeSettingGeneralForm.value),
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
          const themeSettingGeneral: ThemeSettingGeneral = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsThemeRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addThemeSettingGeneral(themeSettingGeneral);
          }
        }
      });
  }

  getThemeSettingGeneralFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      _id: [''],
      name: [{ value: '', disabled: true }],
      thumbnail: this.getThumbnailFormGroup(),
    });
    return formGroup;
  }

  getThumbnailFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      path: [''],
      steam: [''],
    });
    return formGroup;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
