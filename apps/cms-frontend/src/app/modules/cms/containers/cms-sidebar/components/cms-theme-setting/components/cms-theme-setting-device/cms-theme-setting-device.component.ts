import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormArray, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { MatSnackBar } from '@angular/material/snack-bar';
import { EnumThemeDeviceIcon } from '@reactor-room/cms-models-lib';
import { environmentLib } from '@reactor-room/environment-services-frontend';
import { StatusSnackbarComponent, StatusSnackbarType, StatusSnackbarModel } from '@reactor-room/itopplus-cdk';
import { CmsThemeRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-theme-rendering/cms-theme-rendering.component';
import { ThemeSettingDevice } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { replaceHrefAttribute } from 'apps/cms-frontend/src/app/modules/cms/services/domain/common.domain';
import { WebsiteService } from 'apps/cms-frontend/src/app/modules/cms/services/website.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { EMPTY, Subject } from 'rxjs';
import { takeUntil, startWith, distinctUntilChanged, debounceTime, tap, pairwise, catchError } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-theme-setting-device',
  templateUrl: './cms-theme-setting-device.component.html',
  styleUrls: ['./cms-theme-setting-device.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsThemeSettingDeviceComponent implements OnInit, OnDestroy, AfterViewInit {
  themeSettingDeviceForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  EnumThemeDeviceIcon = EnumThemeDeviceIcon;
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
    this.themeSettingDeviceForm = this.getThemeSettingDeviceFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('themeSettingDeviceForm', this.themeSettingDeviceForm);
  }

  getThemeSettingDeviceFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      devices: this.getThemeSettingDeviceFormArray(),
      component: [],
      themeDevice: [''],
    });
    return formGroup;
  }

  getThemeSettingDeviceFormArray(): FormArray {
    const formArray = this.fb.array([]);
    return formArray;
  }

  getThemeSettingDeviceDefailsFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      minwidth: [''],
      icon: [''],
      default: [true],
      baseFontSize: [16],
    });
    return formGroup;
  }

  ngAfterViewInit(): void {
    this.cmsThemeService.getThemeDeviceFormValue.pipe(takeUntil(this.destroy$)).subscribe((value) => {
      if (value) {
        const deviceData = value?.devices ? value.devices : value;
        this.themeSettingDeviceForm.get('component').patchValue(value?.component);
        const deviceFormArray = this.themeSettingDeviceForm.get('devices') as FormArray;
        deviceFormArray.clear();
        deviceData.forEach((device) => {
          const deviceFormGroup = this.getThemeSettingDeviceDefailsFormGroup();
          deviceFormGroup.patchValue(device);
          deviceFormArray.push(deviceFormGroup);
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
    this.themeSettingDeviceForm.valueChanges
      .pipe(
        startWith(this.themeSettingDeviceForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.cmsThemeService.setThemeDeviceSetting(value.devices);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const themeSettingDevice: ThemeSettingDevice = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsThemeRenderingComponent,
          };
          this.onUpdateSharingThemeConfigDevices(newValue);
          if (!newValue.component) {
            this.undoRedoService.addThemeSettingDevice(themeSettingDevice);
          }
        }
      });
  }

  onUpdateSharingThemeConfigDevices(newValue: ThemeSettingDevice) {
    const devices = newValue.devices;
    this.websiteService
      .updateSharingThemeConfigDevices(devices)
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
          console.log('e  => onUpdateSharingThemeConfigDevices :>> ', e);
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
