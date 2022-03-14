import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { IButtonBorder, ILayoutSettingBorderPosition } from '@reactor-room/cms-models-lib';
import { CmsButtonRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { ButtonBorder } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-layout-button-border',
  templateUrl: './cms-layout-button-border.component.html',
  styleUrls: ['./cms-layout-button-border.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutButtonBorderComponent implements OnInit, OnDestroy {
  buttonBorderForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  isLinkedCorner = true;
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.buttonBorderForm = this.getButtonBorderFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('buttonBorder', this.buttonBorderForm);
    this.sidebarService.getButtonBorderFormValue.pipe(distinctUntilChanged()).subscribe((buttonBorderValue: IButtonBorder) => {
      if (buttonBorderValue) {
        this.buttonBorderForm.patchValue(buttonBorderValue);
      }
    });
    this.onButtonBorderFormValueChange();
  }

  onButtonBorderFormValueChange(): void {
    this.buttonBorderForm.valueChanges
      .pipe(
        startWith(this.buttonBorderForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setButtonBorderValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const buttonBorder: ButtonBorder = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsButtonRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addButtonBorder(buttonBorder);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getButtonBorderFormGroup(): FormGroup {
    const buttonSettingBorderFormGroup = this.fb.group({
      corner: this.getButtonBorderCornerFormGroup(),
      color: [''],
      opacity: [100],
      thickness: [0],
      position: this.getButtonBorderPositionFormGroup(),
      component: null,
      buttonBorder: [''],
    });
    return buttonSettingBorderFormGroup;
  }

  getButtonBorderCornerFormGroup(): FormGroup {
    const buttonSettingBorderCornerFormGroup = this.fb.group({
      topLeft: [0, [Validators.required]],
      topRight: [0, [Validators.required]],
      bottomLeft: [0, [Validators.required]],
      bottomRight: [0, [Validators.required]],
    });
    return buttonSettingBorderCornerFormGroup;
  }

  getButtonBorderPositionFormGroup(): FormGroup {
    const buttonSettingBorderPositionFormGroup = this.fb.group({
      left: [true, [Validators.required]],
      top: [true, [Validators.required]],
      right: [true, [Validators.required]],
      bottom: [true, [Validators.required]],
    });
    return buttonSettingBorderPositionFormGroup;
  }

  patchCornerPosition(positions: ILayoutSettingBorderPosition): void {
    const cornerFormGroup = this.buttonBorderForm['controls']['position'] as FormGroup;
    cornerFormGroup.get('left').patchValue(positions.left);
    cornerFormGroup.get('right').patchValue(positions.right);
    cornerFormGroup.get('top').patchValue(positions.top);
    cornerFormGroup.get('bottom').patchValue(positions.bottom);
  }

  onToggleBorderPosition(position: string): void {
    const cornerFormGroup = this.buttonBorderForm['controls']['position'] as FormGroup;
    switch (position) {
      case 'left': {
        cornerFormGroup.get(position).patchValue(!cornerFormGroup.get(position).value);
        break;
      }
      case 'right': {
        cornerFormGroup.get(position).patchValue(!cornerFormGroup.get(position).value);
        break;
      }
      case 'top': {
        cornerFormGroup.get(position).patchValue(!cornerFormGroup.get(position).value);
        break;
      }
      case 'bottom': {
        cornerFormGroup.get(position).patchValue(!cornerFormGroup.get(position).value);
        break;
      }
      default: {
        break;
      }
    }
  }

  onBorderCornerChange(event: string): void {
    const textCornerFormGroup = this.buttonBorderForm['controls']['corner'] as FormGroup;
    if (this.isLinkedCorner) {
      textCornerFormGroup.get('topLeft').setValue(+event);
      textCornerFormGroup.get('topRight').setValue(+event);
      textCornerFormGroup.get('bottomLeft').setValue(+event);
      textCornerFormGroup.get('bottomRight').setValue(+event);
    }
  }

  onToggleLinkedCorner(): void {
    this.isLinkedCorner = !this.isLinkedCorner;
  }

  onRemoveColorProperty(): void {
    this.buttonBorderForm.get('color').patchValue('');
  }
}
