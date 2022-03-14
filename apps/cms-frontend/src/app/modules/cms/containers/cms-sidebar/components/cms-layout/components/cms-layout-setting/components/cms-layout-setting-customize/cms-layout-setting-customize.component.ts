import { AfterViewInit, Component, ElementRef, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../../../../../../../modules/cms/services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import {
  ComponentTypeWithCustomize,
  LayoutSettingCustomize,
} from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { ILayoutSettingCustomize } from '@reactor-room/cms-models-lib';
import { ESidebarElement } from '../../../../../../cms-sidebar.model';
import { isValidMonacco } from 'apps/cms-frontend/src/app/modules/cms/services/domain/common.domain';
@Component({
  selector: 'cms-next-cms-layout-setting-customize',
  templateUrl: './cms-layout-setting-customize.component.html',
  styleUrls: ['./cms-layout-setting-customize.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingCustomizeComponent implements OnInit, AfterViewInit, OnDestroy {
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}
  layoutSettingCustomizeForm: FormGroup;
  parentForm: FormGroup;
  status = false;
  editorOptions = { theme: 'vs-dark', language: 'css', minimap: { enabled: false } };
  destroy$ = new Subject();
  @ViewChild('monacoContainer') monacoContainer: ElementRef;

  ngOnInit(): void {
    this.sidebarService.getSidebarElement.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((sidebarElement: { element: ESidebarElement }) => {
      if (sidebarElement) sidebarElement.element === ESidebarElement.CUSTOMIZE ? (this.status = true) : (this.status = false);
    });
    this.layoutSettingCustomizeForm = this.getLayoutSettingCustomizeFormGroup();
    this.layoutSettingCustomizeForm.markAsPristine();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingCustomizeForm', this.layoutSettingCustomizeForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutSettingCustomizeFormValue.pipe(distinctUntilChanged()).subscribe((value: ILayoutSettingCustomize) => {
      if (value) this.layoutSettingCustomizeForm.patchValue(value);
    });
    this.onLayoutSettingCustomizeFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onLayoutSettingCustomizeFormValueChange(): void {
    this.layoutSettingCustomizeForm.valueChanges
      .pipe(
        startWith(this.layoutSettingCustomizeForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap(async (value) => {
          if (value) {
            const valid = await isValidMonacco(this.monacoContainer);
            if (valid) this.sidebarService.setLayoutSettingCustomizeValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(async ([oldValue, newValue]) => {
        const valid = await isValidMonacco(this.monacoContainer);
        if (newValue && valid) {
          const layoutSettingCustomize: LayoutSettingCustomize = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithCustomize,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutSettingCustomize(layoutSettingCustomize);
          }
        }
      });
  }

  getLayoutSettingCustomizeFormGroup(): FormGroup {
    const layoutSettingCustomizeFormGroup = this.fb.group({
      cssStyle: [''],
      elementId: [''],
      component: null,
    });
    return layoutSettingCustomizeFormGroup;
  }
}
