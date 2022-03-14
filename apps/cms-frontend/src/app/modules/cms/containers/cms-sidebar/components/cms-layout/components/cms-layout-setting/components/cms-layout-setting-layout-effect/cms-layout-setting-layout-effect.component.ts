import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { CmsSidebarService } from '../../../../../../../../services/cms-sidebar.service';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { ComponentTypeWithEffect, LayoutDesignEffect } from '../../../../../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from '../../../../../../../../services/cms-edit.service';
import { UndoRedoService } from '../../../../../../../../../../services/undo-redo.service';
import { EScrollEffect, ILayoutDesignLayoutEffect } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-setting-layout-effect',
  templateUrl: './cms-layout-setting-layout-effect.component.html',
  styleUrls: ['./cms-layout-setting-layout-effect.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingLayoutEffectComponent implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingLayoutEffectForm: FormGroup;
  parentForm: FormGroup;
  scrollEffect = [
    {
      value: EScrollEffect.NONE,
      title: EScrollEffect.NONE,
    },
    {
      value: EScrollEffect.PARALAX,
      title: EScrollEffect.PARALAX,
    },
    {
      value: EScrollEffect.REVEAL,
      title: EScrollEffect.REVEAL,
    },
    {
      value: EScrollEffect.FADE_IN,
      title: EScrollEffect.FADE_IN,
    },
    {
      value: EScrollEffect.ZOOM_IN,
      title: EScrollEffect.ZOOM_IN,
    },
  ];
  defaultScrollValue = this.scrollEffect[0].value;
  backgroundLayout = [
    {
      value: 'stretch',
      title: 'Stretch',
      icon: 'assets/cms/background-style/style-1.svg',
      iconActive: 'assets/cms/background-style/style-1-a.svg',
      status: true,
    },
    {
      value: 'page',
      title: 'Page',
      icon: 'assets/cms/background-style/style-2.svg',
      iconActive: 'assets/cms/background-style/style-2-a.svg',
      status: false,
    },
  ];
  destroy$ = new Subject();
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.layoutSettingLayoutEffectForm = this.getLayoutSettingLayoutEffectFormGroup();
    this.parentForm = this.parentFormDirective.form;
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.parentForm.addControl('layoutSettingLayoutEffectForm', this.layoutSettingLayoutEffectForm);
    this.sidebarService.getlayoutDesignEffectFormValue.pipe(distinctUntilChanged()).subscribe((value: ILayoutDesignLayoutEffect) => {
      if (value) {
        this.layoutSettingLayoutEffectForm.patchValue(value);
        this.backgroundLayout.forEach((background) => (background.status = false));
        value.isStretch ? (this.backgroundLayout[0].status = true) : (this.backgroundLayout[1].status = true);
      }
    });
    this.onLayoutSettingLayoutEffectFormValueChange();
  }

  onLayoutSettingLayoutEffectFormValueChange(): void {
    this.layoutSettingLayoutEffectForm.valueChanges
      .pipe(
        startWith(this.layoutSettingLayoutEffectForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) this.sidebarService.setLayoutDesignEffectValue(value);
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const layoutDesignEffect: LayoutDesignEffect = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithEffect,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutDesignEffect(layoutDesignEffect);
          }
        }
      });
  }

  getLayoutSettingLayoutEffectFormGroup(): FormGroup {
    const layoutSettingLayoutEffectFormGroup = this.fb.group({
      scrollEffect: [this.scrollEffect[0].value],
      xAxis: [0],
      yAxis: [0],
      isStretch: [false],
      margin: [0],
      component: null,
    });
    return layoutSettingLayoutEffectFormGroup;
  }

  onIncrease(formControlName: string): void {
    const formGroup = this.layoutSettingLayoutEffectForm.get(formControlName);
    formGroup.patchValue(formGroup.value + 1);
  }
  onDecrease(formControlName: string): void {
    const formGroup = this.layoutSettingLayoutEffectForm.get(formControlName);
    if (formGroup.value !== 0) formGroup.patchValue(formGroup.value - 1);
  }

  onActiveCurrentBackground(currentBackground: string): void {
    this.backgroundLayout.forEach((background) => (background.status = false));
    const found = this.backgroundLayout.find((background) => background.value === currentBackground);
    found.status = true;
  }

  onActiveBackground(index: number): void {
    this.backgroundLayout.forEach((background) => (background.status = false));
    this.backgroundLayout[index].status = true;
    this.layoutSettingLayoutEffectForm.get('isStretch').patchValue(this.backgroundLayout[index].value);
  }
}
