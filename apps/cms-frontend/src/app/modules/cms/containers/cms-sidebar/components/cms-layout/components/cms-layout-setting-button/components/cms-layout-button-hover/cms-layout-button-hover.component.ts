import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { ButtonEffectTitleType, ButtonEffectType, ETextStyle, IButtonHover } from '@reactor-room/cms-models-lib';
import { CmsButtonRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { ButtonHover } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Subject } from 'rxjs';
import { startWith, takeUntil, debounceTime, pairwise, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-layout-button-hover',
  templateUrl: './cms-layout-button-hover.component.html',
  styleUrls: ['./cms-layout-button-hover.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutButtonHoverComponent implements OnInit, OnDestroy {
  buttonHoverForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  textHoverTransformData = [
    {
      title: ETextStyle.REGULAR,
      value: ETextStyle.REGULAR,
    },
    {
      title: ETextStyle.BOLD,
      value: ETextStyle.BOLD,
    },
    {
      title: ETextStyle.ITALIC,
      value: ETextStyle.ITALIC,
    },
    {
      title: ETextStyle.UNDERLINE,
      value: ETextStyle.UNDERLINE,
    },
  ];
  hoverEffectData = [
    {
      title: ButtonEffectTitleType.NO_EFFECT,
      value: ButtonEffectType.NO_EFFECT,
    },
    {
      title: ButtonEffectTitleType.BUTTON_BLUR_OUT,
      value: ButtonEffectType.BUTTON_BLUR_OUT,
    },
    {
      title: ButtonEffectTitleType.BUTTON_FLICKER_IN_GLOW,
      value: ButtonEffectType.BUTTON_FLICKER_IN_GLOW,
    },
    {
      title: ButtonEffectTitleType.BUTTON_FOCUS_IN,
      value: ButtonEffectType.BUTTON_FOCUS_IN,
    },
    {
      title: ButtonEffectTitleType.BUTTON_POP_UP_TOP,
      value: ButtonEffectType.BUTTON_POP_UP_TOP,
    },
    {
      title: ButtonEffectTitleType.BUTTON_SHADOWN_POP_TOP,
      value: ButtonEffectType.BUTTON_SHADOWN_POP_TOP,
    },
    {
      title: ButtonEffectTitleType.BUTTON_SHADOW_DROP_CENTER,
      value: ButtonEffectType.BUTTON_SHADOW_DROP_CENTER,
    },
  ];
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsThemeService: CmsEditThemeService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.buttonHoverForm = this.getButtonHoverFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('buttonHover', this.buttonHoverForm);
    this.sidebarService.getButtonHoverFormValue.pipe().subscribe((buttonHoverValue: IButtonHover) => {
      if (buttonHoverValue) {
        this.buttonHoverForm.patchValue(buttonHoverValue);
      }
    });
    this.onButtonHoverFormValueChange();
  }

  onButtonHoverFormValueChange(): void {
    this.buttonHoverForm.valueChanges
      .pipe(
        startWith(this.buttonHoverForm.value),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setButtonHoverValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const buttonHover: ButtonHover = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsButtonRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addButtonHover(buttonHover);
          }
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getButtonHoverFormGroup(): FormGroup {
    const buttonHoverFormGroup = this.fb.group({
      isHover: [false],
      buttonHoverColor: [''],
      buttonHoverColorOpacity: [100],
      borderHoverColor: [''],
      borderHoverColorOpacity: [100],
      textHoverColor: [''],
      textHoverColorOpacity: [100],
      textHoverTransform: [ETextStyle.REGULAR],
      hoverEffect: [ButtonEffectType.NO_EFFECT],
      component: null,
      buttonHover: [''],
    });
    return buttonHoverFormGroup;
  }

  onRemoveColorProperty(formControlName: string): void {
    this.buttonHoverForm.get(formControlName).patchValue('');
  }
}
