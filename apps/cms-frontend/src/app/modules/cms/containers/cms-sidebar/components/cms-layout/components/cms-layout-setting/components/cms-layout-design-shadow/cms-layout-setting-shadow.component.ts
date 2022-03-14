import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../../../../../../../modules/cms/services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { ComponentTypeWithShadow, LayoutSettingShadow } from '../../../../../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../../../../../services/cms-edit.service';
import { UndoRedoService } from '../../../../../../../../../../services/undo-redo.service';

@Component({
  selector: 'cms-next-cms-layout-setting-shadow',
  templateUrl: './cms-layout-setting-shadow.component.html',
  styleUrls: ['./cms-layout-setting-shadow.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingShadowComponent implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingShadowForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private undoRedoService: UndoRedoService,
    private cmsEditService: CmsEditService,
  ) {}

  ngOnInit(): void {
    this.layoutSettingShadowForm = this.getLayoutSettingShadowFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingShadowForm', this.layoutSettingShadowForm);
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutSettingShadowFormValue.pipe(distinctUntilChanged()).subscribe((value) => {
      if (value) this.layoutSettingShadowForm.patchValue(value);
    });
    this.onLayoutSettingShadowFormValueChange();
  }

  onLayoutSettingShadowFormValueChange(): void {
    this.layoutSettingShadowForm.valueChanges
      .pipe(
        startWith(this.layoutSettingShadowForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setLayoutSettingShadowValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const undo: LayoutSettingShadow = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithShadow,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutSettingShadow(undo);
          }
        }
      });
  }
  getLayoutSettingShadowFormGroup(): FormGroup {
    const layoutSettingShadowFormGroup = this.fb.group({
      isShadow: [false],
      color: [''],
      opacity: [100],
      xAxis: [0],
      yAxis: [0],
      distance: [0],
      blur: [0],
      component: null,
    });
    return layoutSettingShadowFormGroup;
  }

  onIncrease(formControlName: string): void {
    const formGroup = this.layoutSettingShadowForm.get(formControlName);
    formGroup.patchValue(formGroup.value + 1);
  }
  onDecrease(formControlName: string): void {
    const formGroup = this.layoutSettingShadowForm.get(formControlName);
    if (formGroup.value !== 0) formGroup.patchValue(formGroup.value - 1);
  }
  onRemoveColorProperty(): void {
    this.layoutSettingShadowForm.get('color').patchValue('');
  }
}
