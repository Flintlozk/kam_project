import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { CmsSidebarService } from '../../../../../../../../../../modules/cms/services/cms-sidebar.service';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import {
  ComponentTypeWithBackground,
  LayoutSettingBackground,
} from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { EBackground, ILayoutSettingBackground } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-setting-background',
  templateUrl: './cms-layout-setting-background.component.html',
  styleUrls: ['./cms-layout-setting-background.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingBackgroundComponent implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingBackgroundForm: FormGroup;
  parentForm: FormGroup;
  selectedIndex = 0;
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.layoutSettingBackgroundForm = this.getLayoutSettingBackgroundFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingBackgroundForm', this.layoutSettingBackgroundForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutSettingBackgroundFormValue.pipe(distinctUntilChanged()).subscribe((value: ILayoutSettingBackground) => {
      if (value) {
        this.setActiveCurrentTab(value.currentStyle);
        this.layoutSettingBackgroundForm.patchValue(value);
      }
    });
    this.onLayoutSettingBackgroundFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onLayoutSettingBackgroundFormValueChange(): void {
    this.layoutSettingBackgroundForm.valueChanges
      .pipe(
        startWith(this.layoutSettingBackgroundForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setLayoutSettingBackgroundValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const layoutSettingBackground: LayoutSettingBackground = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithBackground,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutSettingBackground(layoutSettingBackground);
          }
        }
      });
  }
  getLayoutSettingBackgroundFormGroup(): FormGroup {
    const layoutSettingBackgroundFormGroup = this.fb.group({
      currentStyle: [EBackground.COLOR],
      component: null,
    });
    return layoutSettingBackgroundFormGroup;
  }

  handleIndexChange(event: number): void {
    this.selectedIndex = event;
    this.setCurrentStyleBySelectedIndex();
  }

  setActiveCurrentTab(currentStyle: string): void {
    switch (currentStyle) {
      case EBackground.COLOR:
        this.selectedIndex = 0;
        break;
      case EBackground.IMAGE:
        this.selectedIndex = 1;
        break;
      case EBackground.VIDEO:
        this.selectedIndex = 2;
        break;
      default:
        this.selectedIndex = 0;
        break;
    }
  }

  setCurrentStyleBySelectedIndex(): void {
    const currentStyleFormGroup = this.layoutSettingBackgroundForm.get('currentStyle');
    switch (this.selectedIndex) {
      case 0:
        currentStyleFormGroup.patchValue(EBackground.COLOR);
        break;
      case 1:
        currentStyleFormGroup.patchValue(EBackground.IMAGE);
        break;
      case 2:
        currentStyleFormGroup.patchValue(EBackground.VIDEO);
        break;
      default:
        break;
    }
  }
}
