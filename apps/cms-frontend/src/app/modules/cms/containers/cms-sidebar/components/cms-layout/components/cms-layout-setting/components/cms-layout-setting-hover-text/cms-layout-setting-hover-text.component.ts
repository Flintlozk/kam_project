import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';
import { CmsSidebarService } from '../../../../../../../../services/cms-sidebar.service';
import { Subject } from 'rxjs';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { ComponentTypeWithHover, LayoutSettingHover } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { ETextHoverStyle, ILayoutSettingHover } from '@reactor-room/cms-models-lib';

@Component({
  selector: 'cms-next-cms-layout-setting-hover-text',
  templateUrl: './cms-layout-setting-hover-text.component.html',
  styleUrls: ['./cms-layout-setting-hover-text.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutSettingHoverTextComponent implements OnInit, AfterViewInit, OnDestroy {
  layoutSettingHoverForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  textHoverStyles = [
    {
      status: true,
      style: '',
      icon: 'assets/cms/text-hover-style/no-style.svg',
      iconActive: 'assets/cms/text-hover-style/no-style-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_1,
      icon: 'assets/cms/text-hover-style/style-1.svg',
      iconActive: 'assets/cms/text-hover-style/style-1-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_2,
      icon: 'assets/cms/text-hover-style/style-2.svg',
      iconActive: 'assets/cms/text-hover-style/style-2-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_3,
      icon: 'assets/cms/text-hover-style/style-3.svg',
      iconActive: 'assets/cms/text-hover-style/style-3-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_4,
      icon: 'assets/cms/text-hover-style/style-4.svg',
      iconActive: 'assets/cms/text-hover-style/style-4-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_5,
      icon: 'assets/cms/text-hover-style/style-5.svg',
      iconActive: 'assets/cms/text-hover-style/style-5-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_6,
      icon: 'assets/cms/text-hover-style/style-6.svg',
      iconActive: 'assets/cms/text-hover-style/style-6-a.svg',
    },
    {
      status: false,
      style: ETextHoverStyle.STYLE_7,
      icon: 'assets/cms/text-hover-style/style-7.svg',
      iconActive: 'assets/cms/text-hover-style/style-7-a.svg',
    },
  ];
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.layoutSettingHoverForm = this.getLayoutSettingHoverFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('layoutSettingHoverForm', this.layoutSettingHoverForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getlayoutSettingHoverFormValue.pipe(distinctUntilChanged()).subscribe((value: ILayoutSettingHover) => {
      if (value) {
        this.layoutSettingHoverForm.patchValue(value);
        this.onActiveCurrentStyle(value.style);
      }
    });
    this.onLayoutSettingHoverFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onLayoutSettingHoverFormValueChange(): void {
    this.layoutSettingHoverForm.valueChanges
      .pipe(
        startWith(this.layoutSettingHoverForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setLayoutSettingHoverValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const layoutSettingHover: LayoutSettingHover = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithHover,
          };
          if (!newValue.component) {
            this.undoRedoService.addLayoutSettingHover(layoutSettingHover);
          }
        }
      });
  }
  getLayoutSettingHoverFormGroup(): FormGroup {
    const layoutSettingHoverFormGroup = this.fb.group({
      style: [''],
      textHover: null,
      component: null,
    });
    return layoutSettingHoverFormGroup;
  }

  onActiveCurrentStyle(currentStyle: string): void {
    this.textHoverStyles.forEach((style) => (style.status = false));
    const found = this.textHoverStyles.find((style) => style.style === currentStyle);
    found.status = true;
  }

  onActiveStyle(index: number): void {
    this.textHoverStyles.forEach((style) => (style.status = false));
    this.textHoverStyles[index].status = true;
    this.layoutSettingHoverForm.get('style').patchValue(this.textHoverStyles[index].style);
  }
}
