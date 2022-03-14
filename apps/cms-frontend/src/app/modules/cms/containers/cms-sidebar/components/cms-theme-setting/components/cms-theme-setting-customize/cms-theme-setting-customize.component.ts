import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { IThemeRenderingSettingCustomize } from '@reactor-room/cms-models-lib';
import { StatusSnackbarComponent, StatusSnackbarModel, StatusSnackbarType } from '@reactor-room/itopplus-cdk';
import { CmsThemeRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ThemeSettingCustomize } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { SettingWebsiteService } from 'apps/cms-frontend/src/app/services/setting-webiste.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { EMPTY, Subject } from 'rxjs';
import { catchError, debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { ESidebarElement } from '../../../../cms-sidebar.model';
import { isValidMonacco } from '../../../../../../services/domain/common.domain';

@Component({
  selector: 'cms-next-cms-theme-setting-customize',
  templateUrl: './cms-theme-setting-customize.component.html',
  styleUrls: ['./cms-theme-setting-customize.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsThemeSettingCustomizeComponent implements OnInit, AfterViewInit, OnDestroy {
  themeSettingCustomizeForm: FormGroup;
  parentForm: FormGroup;
  status = false;
  editorOptions = { theme: 'vs-dark', language: 'css', minimap: { enabled: false } };
  @ViewChild('monacoContainer') monacoContainer: ElementRef;
  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private websiteSettingService: SettingWebsiteService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.sidebarService.getSidebarElement.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((sidebarElement: { element: ESidebarElement }) => {
      if (sidebarElement) sidebarElement.element === ESidebarElement.THEME_CUSTOMIZE ? (this.status = true) : (this.status = false);
    });
    this.themeSettingCustomizeForm = this.getThemeSettingCustomizeFormGroup();
    this.themeSettingCustomizeForm.markAsPristine();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('themeSettingCustomizeForm', this.themeSettingCustomizeForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getthemeSettingCustomizeFormValue.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((value: IThemeRenderingSettingCustomize) => {
      if (value) this.themeSettingCustomizeForm.patchValue(value);
    });
    this.onThemeSettingCustomizeFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onThemeSettingCustomizeFormValueChange(): void {
    this.themeSettingCustomizeForm.valueChanges
      .pipe(
        startWith(this.themeSettingCustomizeForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap(async (value) => {
          if (value) {
            const valid = await isValidMonacco(this.monacoContainer);
            if (valid) this.sidebarService.setThemeSettingCustomizeValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(async ([oldValue, newValue]) => {
        const valid = await isValidMonacco(this.monacoContainer);
        if (newValue && valid) {
          const themeSettingCustomize: ThemeSettingCustomize = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsThemeRenderingComponent,
          };
          this.onSaveConfigStyle(newValue);
          if (!newValue.component) {
            this.undoRedoService.addThemeSettingCustomize(themeSettingCustomize);
          }
        }
      });
  }

  onSaveConfigStyle(newValue: ThemeSettingCustomize) {
    const style = newValue.cssStyle;
    this.websiteSettingService
      .saveConfigStyle(style)
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
          }
        }),
        catchError((e) => {
          console.log('e  => onSaveConfigStyle :>> ', e);
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

  getThemeSettingCustomizeFormGroup(): FormGroup {
    const themeSettingCustomizeFormGroup = this.fb.group({
      cssStyle: [''],
      elementId: [''],
      themeCustomize: [''],
      component: null,
    });
    return themeSettingCustomizeFormGroup;
  }
}
