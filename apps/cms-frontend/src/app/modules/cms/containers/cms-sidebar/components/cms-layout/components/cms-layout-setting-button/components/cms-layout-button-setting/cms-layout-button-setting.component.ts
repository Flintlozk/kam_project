import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { IButtonSetting } from '@reactor-room/cms-models-lib';
import { CmsButtonRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { ButtonSetting } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-layout-button-setting',
  templateUrl: './cms-layout-button-setting.component.html',
  styleUrls: ['./cms-layout-button-setting.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutButtonSettingComponent implements OnInit, AfterViewInit, OnDestroy {
  buttonSettingForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  isLinkedPadding = false;
  guideLine = {
    paddingLeft: false,
    paddingTop: false,
    paddingRight: false,
    paddingBottom: false,
  };
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.buttonSettingForm = this.getButtonSettingFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('buttonSetting', this.buttonSettingForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getButtonSettingFormValue.pipe(distinctUntilChanged()).subscribe((buttonSettingValue: IButtonSetting) => {
      if (buttonSettingValue) {
        this.buttonSettingForm.patchValue(buttonSettingValue);
      }
    });
    this.onButtonSettingFormValueChange();
  }

  onButtonSettingFormValueChange(): void {
    this.buttonSettingForm.valueChanges
      .pipe(
        startWith(this.buttonSettingForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setButtonSettingValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const buttonSetting: ButtonSetting = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsButtonRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addButtonSetting(buttonSetting);
          }
        }
      });
  }

  getButtonSettingFormGroup(): FormGroup {
    const buttonSettingFormGroup = this.fb.group({
      background: this.getButtonSettingBackgroundFormGroup(),
      padding: this.getButtonSettingPaddingFormGroup(),
      buttonSetting: [''],
      component: null,
    });
    return buttonSettingFormGroup;
  }

  getButtonSettingBackgroundFormGroup(): FormGroup {
    const buttonSettingBackgroundFormGroup = this.fb.group({
      backgroundColor: ['#414042'],
      backgroundColorOpacity: [1],
    });
    return buttonSettingBackgroundFormGroup;
  }

  getButtonSettingPaddingFormGroup(): FormGroup {
    const buttonSettingPaddingFormGroup = this.fb.group({
      left: [0],
      top: [0],
      right: [0],
      bottom: [0],
    });
    return buttonSettingPaddingFormGroup;
  }

  onPaddingChange(event: string): void {
    const paddingFormGroup = this.buttonSettingForm.get('padding') as FormGroup;
    if (this.isLinkedPadding) {
      paddingFormGroup.get('left').setValue(+event);
      paddingFormGroup.get('top').setValue(+event);
      paddingFormGroup.get('right').setValue(+event);
      paddingFormGroup.get('bottom').setValue(+event);
    }
  }

  onToggleLinkedPadding(): void {
    this.isLinkedPadding = !this.isLinkedPadding;
  }

  onLayoutGuide(postion: string): void {
    switch (postion) {
      case 'paddingLeft':
        this.guideLine.paddingLeft = true;
        break;
      case 'paddingTop':
        this.guideLine.paddingTop = true;
        break;
      case 'paddingRight':
        this.guideLine.paddingRight = true;
        break;
      case 'paddingBottom':
        this.guideLine.paddingBottom = true;
        break;
      default:
        break;
    }
  }

  offLayoutGuide(postion: string): void {
    switch (postion) {
      case 'paddingLeft':
        this.guideLine.paddingLeft = false;
        break;
      case 'paddingTop':
        this.guideLine.paddingTop = false;
        break;
      case 'paddingRight':
        this.guideLine.paddingRight = false;
        break;
      case 'paddingBottom':
        this.guideLine.paddingBottom = false;
        break;
      default:
        break;
    }
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }
}
