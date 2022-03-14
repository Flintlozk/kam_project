import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective, Validators } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../../../../../services/cms-sidebar.service';
import { UndoRedoService } from '../../../../../../../../../../services/undo-redo.service';
import { Subject } from 'rxjs';
import { ComponentTypeWithBorder, LayoutSettingBorder } from '../../../../../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../../../../../services/cms-edit.service';
import { ILayoutSettingBorder, ILayoutSettingBorderPosition } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-setting-border',
  templateUrl: './cms-layout-setting-border.component.html',
  styleUrls: ['./cms-layout-setting-border.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingBorderComponent implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingBorderForm: FormGroup;
  parentForm: FormGroup;
  isLinkedCorner = true;
  destroy$ = new Subject();

  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private undoRedoService: UndoRedoService,
    private cmsEditService: CmsEditService,
  ) {}

  ngOnInit(): void {
    this.layoutSettingBorderForm = this.getLayoutSettingBorderFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingBorderForm', this.layoutSettingBorderForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutSettingBorderFormValue.pipe(distinctUntilChanged()).subscribe((value: ILayoutSettingBorder) => {
      if (value) {
        this.layoutSettingBorderForm.patchValue(value);
      }
    });
    this.onLayoutSettingBorderFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onLayoutSettingBorderFormValueChange(): void {
    this.layoutSettingBorderForm.valueChanges
      .pipe(
        startWith(this.layoutSettingBorderForm.value),
        takeUntil(this.destroy$),
        debounceTime(100),
        distinctUntilChanged(),
        tap((value) => {
          if (value) {
            this.sidebarService.setLayoutSettingBorderValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const layoutSettingBorder: LayoutSettingBorder = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithBorder,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutBorderUndo(layoutSettingBorder);
          }
        }
      });
  }

  getLayoutSettingBorderFormGroup(): FormGroup {
    const layoutSettingBorderFormGroup = this.fb.group({
      corner: this.getLayoutSettingBorderCornerFormGroup(),
      color: [''],
      opacity: [100],
      thickness: [0],
      position: this.getLayoutSettingBorderPositionFormGroup(),
      component: null,
    });
    return layoutSettingBorderFormGroup;
  }

  getLayoutSettingBorderCornerFormGroup(): FormGroup {
    const layoutSettingBorderCornerFormGroup = this.fb.group({
      topLeft: [0, [Validators.required]],
      topRight: [0, [Validators.required]],
      bottomLeft: [0, [Validators.required]],
      bottomRight: [0, [Validators.required]],
    });
    return layoutSettingBorderCornerFormGroup;
  }

  getLayoutSettingBorderPositionFormGroup(): FormGroup {
    const layoutSettingBorderPositionFormGroup = this.fb.group({
      left: [true, [Validators.required]],
      top: [true, [Validators.required]],
      right: [true, [Validators.required]],
      bottom: [true, [Validators.required]],
    });
    return layoutSettingBorderPositionFormGroup;
  }

  patchCornerPosition(positions: ILayoutSettingBorderPosition): void {
    const cornerFormGroup = this.layoutSettingBorderForm['controls']['position'] as FormGroup;
    cornerFormGroup.get('left').patchValue(positions.left);
    cornerFormGroup.get('right').patchValue(positions.right);
    cornerFormGroup.get('top').patchValue(positions.top);
    cornerFormGroup.get('bottom').patchValue(positions.bottom);
  }

  onToggleBorderPosition(position: string): void {
    const cornerFormGroup = this.layoutSettingBorderForm['controls']['position'] as FormGroup;
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
    const textCornerFormGroup = this.layoutSettingBorderForm.get('corner') as FormGroup;
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
    this.layoutSettingBorderForm.get('color').patchValue('');
  }
}
