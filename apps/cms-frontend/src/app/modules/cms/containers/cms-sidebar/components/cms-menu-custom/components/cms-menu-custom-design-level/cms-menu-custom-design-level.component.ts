import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup } from '@angular/forms';
import {
  EColorStyle,
  EFontStyle,
  EGradientColorType,
  ETextHoverStyle,
  fontSizeEm,
  fontSizePx,
  IMenuRenderingSettingLevelOptions,
  OverlayEffectTitleType,
  OverlayEffectType,
} from '@reactor-room/cms-models-lib';
import { CmsMenuRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-menu-rendering/cms-menu-rendering.component';
import { MenuRenderingSettingLevelOptions } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { Observable, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, takeUntil, tap } from 'rxjs/operators';

@Component({
  selector: 'cms-next-cms-menu-custom-design-level',
  templateUrl: './cms-menu-custom-design-level.component.html',
  styleUrls: ['./cms-menu-custom-design-level.component.scss'],
})
export class CmsMenuCustomDesignLevelComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() level: number;
  fontSizeEmData = fontSizeEm;
  fontSizePxData = fontSizePx;
  fontStyleData = [
    {
      value: EFontStyle.REGULAR,
      title: EFontStyle.REGULAR,
    },
    {
      value: EFontStyle.BOLD,
      title: EFontStyle.BOLD,
    },
    {
      value: EFontStyle.ITALIC,
      title: EFontStyle.ITALIC,
    },
  ];
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
  backgroundHoverStyles = [
    {
      title: OverlayEffectTitleType.NONE,
      value: OverlayEffectType.NONE,
      imgUrl: 'assets/cms/text-overlay-style/none.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/none-active.svg',
      status: true,
    },
    {
      title: OverlayEffectTitleType.FADE,
      value: OverlayEffectType.FADE,
      imgUrl: 'assets/cms/text-overlay-style/fade.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/fade-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.ZOOM_IN,
      value: OverlayEffectType.ZOOM_IN,
      imgUrl: 'assets/cms/text-overlay-style/zoom-in.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/zoom-in-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.ZOOM_OUT,
      value: OverlayEffectType.ZOOM_OUT,
      imgUrl: 'assets/cms/text-overlay-style/zoom-out.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/zoom-out-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.SLIDE_IN,
      value: OverlayEffectType.SLIDE_IN,
      imgUrl: 'assets/cms/text-overlay-style/slide-in.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/slide-in-active.svg',
      status: false,
    },
    {
      title: OverlayEffectTitleType.MOVE_UP,
      value: OverlayEffectType.MOVE_UP,
      imgUrl: 'assets/cms/text-overlay-style/move-up.svg',
      imgActiveUrl: 'assets/cms/text-overlay-style/move-up-active.svg',
      status: false,
    },
  ];
  fontSizeCurrent = 'px';
  menuDesignFormGroup: FormGroup;
  destroy$ = new Subject();
  constructor(private fb: FormBuilder, private sidebarService: CmsSidebarService, private cmsEditService: CmsEditService, private undoRedoService: UndoRedoService) {}

  ngOnInit(): void {
    this.menuDesignFormGroup = this.gerMenuDesignFormGroup();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    switch (this.level) {
      case 1:
        this.menuLevelFormValueHandler(this.sidebarService.getMenuLevelOneFormValue, 'menuLevel1');
        break;
      case 2:
        this.menuLevelFormValueHandler(this.sidebarService.getMenuLevelTwoFormValue, 'menuLevel2');
        break;
      case 3:
        this.menuLevelFormValueHandler(this.sidebarService.getMenuLevelThreeFormValue, 'menuLevel3');
        break;
      case 4:
        this.menuLevelFormValueHandler(this.sidebarService.getMenuLevelFourFormValue, 'menuLevel4');
        break;
      default:
        break;
    }
    this.onMenuDesignLevelFormValueChange();
  }

  menuLevelFormValueHandler(formValue$: Observable<IMenuRenderingSettingLevelOptions>, formControlName: string): void {
    this.menuDesignFormGroup.addControl(formControlName, new FormControl(''));
    formValue$.pipe(distinctUntilChanged(), takeUntil(this.destroy$)).subscribe((menuLevel: IMenuRenderingSettingLevelOptions) => {
      if (menuLevel) {
        this.menuDesignFormGroup.patchValue(menuLevel);
        this.onActiveTextHoverCurrentStyle(menuLevel.textAnimation);
        this.onActiveBackgroundHoverCurrentStyle(menuLevel.backgroundAnimation);
        this.setFontSizeCurrent();
      }
    });
  }

  onMenuDesignLevelFormValueChange(): void {
    this.menuDesignFormGroup.valueChanges
      .pipe(
        startWith(this.menuDesignFormGroup.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            switch (this.level) {
              case 1:
                this.sidebarService.setMenuLevelOneValue(value);
                break;
              case 2:
                this.sidebarService.setMenuLevelTwoValue(value);
                break;
              case 3:
                this.sidebarService.setMenuLevelThreeValue(value);
                break;
              case 4:
                this.sidebarService.setMenuLevelFourValue(value);
                break;
              default:
                break;
            }
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const menuLevel: MenuRenderingSettingLevelOptions = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsMenuRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addMenuLevel(menuLevel);
          }
        }
      });
  }

  gerMenuDesignFormGroup(): FormGroup {
    const menuDesignFormGroup = this.fb.group({
      size: [fontSizePx[0]],
      style: [EFontStyle.REGULAR],
      text: this.getMenuDesignColorActionFormGroup(),
      backGround: this.getMenuDesignColorActionFormGroup(),
      shadow: this.getMenuDesignShadowFormGroup(),
      textAnimation: [''],
      backgroundAnimation: [OverlayEffectType.NONE],
      component: null,
    });
    return menuDesignFormGroup;
  }

  getMenuDesignColorActionFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      normal: this.getMenuDesignColorFormGroup(),
      hover: this.getMenuDesignColorFormGroup(),
      active: this.getMenuDesignColorFormGroup(),
    });
    return formGroup;
  }

  getMenuDesignColorFormGroup(): FormGroup {
    const menuDesignTextFormGroup = this.fb.group({
      style: [EColorStyle.COLOR],
      color: this.getColorFormGroup(),
      gradientColor: this.getMenuDesignGradientColorFormGroup(),
      image: [''],
    });
    return menuDesignTextFormGroup;
  }

  getColorFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      value: [''],
      opacity: [100],
    });
    return formGroup;
  }

  getMenuDesignGradientColorFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      type: [EGradientColorType.LINEAR],
      colors: this.fb.array([]),
    });
    return formGroup;
  }

  getMenuDesignShadowFormGroup(): FormGroup {
    const formGroup = this.fb.group({
      isShadow: [false],
      color: [''],
      opacity: [100],
      xAxis: [0],
      yAxis: [0],
      distance: [0],
      blur: [0],
    });
    return formGroup;
  }

  onSwitchFontSize(): void {
    const fontSizeFormGroup = this.menuDesignFormGroup['controls']['size'];
    this.setFontSizeCurrent();
    switch (this.fontSizeCurrent) {
      case 'px':
        this.fontSizeCurrent = 'em';
        fontSizeFormGroup.patchValue('1em');
        break;
      case 'em':
        this.fontSizeCurrent = 'px';
        fontSizeFormGroup.patchValue('14px');
        break;
      default:
        break;
    }
  }

  setFontSizeCurrent(): void {
    const fontSizeFormGroup = this.menuDesignFormGroup['controls']['size'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes('px')) {
      this.fontSizeCurrent = 'px';
    } else {
      this.fontSizeCurrent = 'em';
    }
  }

  onActiveTextHoverCurrentStyle(currentStyle: string): void {
    this.textHoverStyles.forEach((style) => (style.status = false));
    const found = this.textHoverStyles.find((style) => style.style === currentStyle);
    found.status = true;
  }

  onActiveTextHoverStyle(index: number): void {
    this.textHoverStyles.forEach((style) => (style.status = false));
    this.textHoverStyles[index].status = true;
    this.menuDesignFormGroup.get('textAnimation').patchValue(this.textHoverStyles[index].style);
  }

  onActiveBackgroundHoverStyle(index: number): void {
    this.backgroundHoverStyles.forEach((item) => (item.status = false));
    this.backgroundHoverStyles[index].status = true;
    const backgroundHoverFormGroup = this.menuDesignFormGroup.get('backgroundAnimation');
    backgroundHoverFormGroup.patchValue(this.backgroundHoverStyles[index].value);
  }

  onActiveBackgroundHoverCurrentStyle(currentStyle: string): void {
    this.backgroundHoverStyles.forEach((style) => (style.status = false));
    const found = this.backgroundHoverStyles.find((style) => style.value === currentStyle);
    found.status = true;
  }

  onIncrease(formControlName: string): void {
    const formGroup = this.menuDesignFormGroup.get('shadow').get(formControlName);
    formGroup.patchValue(formGroup.value + 1);
  }
  onDecrease(formControlName: string): void {
    const formGroup = this.menuDesignFormGroup.get('shadow').get(formControlName);
    if (formGroup.value !== 0) formGroup.patchValue(formGroup.value - 1);
  }

  onClearBackgroundColor(): void {
    this.menuDesignFormGroup.get('backGround').get('normal').get('color').patchValue('');
    this.menuDesignFormGroup.get('backGround').get('hover').get('color').patchValue('');
    this.menuDesignFormGroup.get('backGround').get('active').get('color').patchValue('');
  }
}
