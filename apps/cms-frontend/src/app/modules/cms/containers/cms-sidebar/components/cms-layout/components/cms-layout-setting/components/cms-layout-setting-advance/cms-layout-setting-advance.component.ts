import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { CmsSidebarService } from '../../../../../../../../../../modules/cms/services/cms-sidebar.service';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { ComponentTypeWithAdvance, LayoutSettingAdvance } from '../../../../../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../../../../../services/cms-edit.service';
import { UndoRedoService } from '../../../../../../../../../../services/undo-redo.service';
import { Subject } from 'rxjs';
import { EPosition, ILayoutSettingAdvance } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-setting-advance',
  templateUrl: './cms-layout-setting-advance.component.html',
  styleUrls: ['./cms-layout-setting-advance.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingAdvanceComponent implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingAdvanceForm: FormGroup;
  parentForm: FormGroup;
  isLinkedMargin = false;
  isLinkedPadding = false;
  guideLine = {
    marginLeft: false,
    marginTop: false,
    marginRight: false,
    marginBottom: false,
    paddingLeft: false,
    paddingTop: false,
    paddingRight: false,
    paddingBottom: false,
  };
  horizontalData = [
    {
      value: EPosition.LEFT,
      selected: true,
    },
    {
      value: EPosition.JUSTIFY_CENTER,
      selected: false,
    },
    {
      value: EPosition.RIGHT,
      selected: false,
    },
  ];
  verticalData = [
    {
      value: EPosition.TOP,
      selected: true,
    },
    {
      value: EPosition.ITEM_CENTER,
      selected: false,
    },
    {
      value: EPosition.BOTTOM,
      selected: false,
    },
  ];
  EPosition = EPosition;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.layoutSettingAdvanceForm = this.getLayoutSettingAdvanceFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingAdvanceForm', this.layoutSettingAdvanceForm);
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutSettingAdvanceFormValue.pipe(distinctUntilChanged()).subscribe((value: ILayoutSettingAdvance) => {
      if (value) {
        this.setHorizontalData(value.horizontalPosition);
        this.setVeriticalData(value.verticalPosition);
        this.layoutSettingAdvanceForm.patchValue(value);
      }
    });
    this.onLayoutSettingAdvanceFormValueChange();
  }

  onLayoutSettingAdvanceFormValueChange(): void {
    this.layoutSettingAdvanceForm.valueChanges
      .pipe(
        startWith(this.layoutSettingAdvanceForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setLayoutSettingAdvanceValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const layoutSettingAdvance: LayoutSettingAdvance = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithAdvance,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutSettingAdvance(layoutSettingAdvance);
          }
        }
      });
  }

  getLayoutSettingAdvanceFormGroup(): FormGroup {
    const layoutSettingAdvanceFormGroup = this.fb.group({
      margin: this.getMaginFormGroup(),
      padding: this.getPaddingFormGroup(),
      horizontalPosition: [EPosition.LEFT],
      verticalPosition: [EPosition.TOP],
      component: null,
    });
    return layoutSettingAdvanceFormGroup;
  }

  getMaginFormGroup(): FormGroup {
    const marginFormGroup = this.fb.group({
      left: [0],
      top: [0],
      right: [0],
      bottom: [0],
    });
    return marginFormGroup;
  }

  getPaddingFormGroup(): FormGroup {
    const paddingFormGroup = this.fb.group({
      left: [0],
      top: [0],
      right: [0],
      bottom: [0],
    });
    return paddingFormGroup;
  }

  onMarginChange(event: string): void {
    const marginFormGroup = this.layoutSettingAdvanceForm.get('margin') as FormGroup;
    if (this.isLinkedMargin) {
      marginFormGroup.get('left').setValue(+event);
      marginFormGroup.get('top').setValue(+event);
      marginFormGroup.get('right').setValue(+event);
      marginFormGroup.get('bottom').setValue(+event);
    }
  }

  onToggleLinkedMargin(): void {
    this.isLinkedMargin = !this.isLinkedMargin;
  }

  onPaddingChange(event: string): void {
    const paddingFormGroup = this.layoutSettingAdvanceForm.get('padding') as FormGroup;
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
      case 'marginLeft':
        this.guideLine.marginLeft = true;
        break;
      case 'marginTop':
        this.guideLine.marginTop = true;
        break;
      case 'marginRight':
        this.guideLine.marginRight = true;
        break;
      case 'marginBottom':
        this.guideLine.marginBottom = true;
        break;
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
      case 'marginLeft':
        this.guideLine.marginLeft = false;
        break;
      case 'marginTop':
        this.guideLine.marginTop = false;
        break;
      case 'marginRight':
        this.guideLine.marginRight = false;
        break;
      case 'marginBottom':
        this.guideLine.marginBottom = false;
        break;
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

  setHorizontalData(position: string): void {
    this.horizontalData.forEach((item) => (item.selected = false));
    const found = this.horizontalData.find((item) => item.value === position);
    found.selected = true;
  }

  onHorizontal(index: number): void {
    this.horizontalData.forEach((item) => (item.selected = false));
    this.horizontalData[index].selected = true;
    const horizontalFormGroup = this.layoutSettingAdvanceForm.get('horizontalPosition');
    horizontalFormGroup.patchValue(this.horizontalData[index].value);
  }

  setVeriticalData(position: string): void {
    this.verticalData.forEach((item) => (item.selected = false));
    const found = this.verticalData.find((item) => item.value === position);
    found.selected = true;
  }

  onVertical(index: number): void {
    this.verticalData.forEach((item) => (item.selected = false));
    this.verticalData[index].selected = true;
    const verticalFormGroup = this.layoutSettingAdvanceForm.get('verticalPosition');
    verticalFormGroup.patchValue(this.verticalData[index].value);
  }
}
