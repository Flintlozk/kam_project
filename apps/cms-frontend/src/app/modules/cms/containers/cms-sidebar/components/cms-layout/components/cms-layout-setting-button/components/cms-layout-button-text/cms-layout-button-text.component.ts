import { Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import { CmsEditService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-edit.service';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import {
  EFontFamily,
  EFontFamilyCode,
  EFontStyle,
  EPosition,
  ETextAlignment,
  fontSizeEm,
  fontSizePx,
  IButtonText,
  IFont,
  IThemeRenderingSettingFont,
  letterSpacing,
  lineHeight,
  textOpacity,
} from '@reactor-room/cms-models-lib';
import { Subject } from 'rxjs';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { distinctUntilChanged, startWith, takeUntil, debounceTime, pairwise, tap } from 'rxjs/operators';
import { ButtonText } from 'apps/cms-frontend/src/app/modules/cms/modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsButtonRenderingComponent } from 'apps/cms-frontend/src/app/modules/cms/components/cms-rendering-component/cms-button-rendering/cms-button-rendering.component';
import { fontAwesomeList } from 'apps/cms-frontend/src/app/modules/cms/shared/icons.model';

@Component({
  selector: 'cms-next-cms-layout-button-text',
  templateUrl: './cms-layout-button-text.component.html',
  styleUrls: ['./cms-layout-button-text.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsLayoutButtonTextComponent implements OnInit, OnDestroy {
  iconList: string[] = fontAwesomeList;
  buttonTextForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
  isLinkedPadding = false;
  guideLine = {
    paddingLeft: false,
    paddingTop: false,
    paddingRight: false,
    paddingBottom: false,
  };
  fontFamilyData: IFont[] = [
    {
      fontFamilyCode: EFontFamilyCode.PROMPT,
      title: EFontFamily.PROMPT,
    },
    {
      fontFamilyCode: EFontFamilyCode.NEUCHA,
      title: EFontFamily.NEUCHA,
    },
    {
      fontFamilyCode: EFontFamilyCode.POST_NO_BILLS_COLOMBO,
      title: EFontFamily.POST_NO_BILLS_COLOMBO,
    },
    {
      fontFamilyCode: EFontFamilyCode.QUANTICO,
      title: EFontFamily.QUANTICO,
    },
    {
      fontFamilyCode: EFontFamilyCode.RACING_SANS_ONE,
      title: EFontFamily.RACING_SANS_ONE,
    },
  ];
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
  textAlignmentData = [
    {
      value: ETextAlignment.LEFT,
      selected: true,
    },
    {
      value: ETextAlignment.CENTER,
      selected: false,
    },
    {
      value: ETextAlignment.RIGHT,
      selected: false,
    },
    {
      value: ETextAlignment.JUSTIFY,
      selected: false,
    },
  ];
  EPosition = EPosition;
  ETextAlignment = ETextAlignment;
  themeFontSetting: IThemeRenderingSettingFont;
  fontSizeCurrent = 'px';
  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsThemeService: CmsEditThemeService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
  ) {}

  ngOnInit(): void {
    this.buttonTextForm = this.getButtonTextFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('buttonText', this.buttonTextForm);
    this.cmsThemeService.getThemeFontSetting.subscribe((themeFontSetting: IThemeRenderingSettingFont) => {
      this.themeFontSetting = themeFontSetting;
    });
    this.sidebarService.getButtonTextFormValue.pipe(distinctUntilChanged()).subscribe((buttonTextValue: IButtonText) => {
      if (buttonTextValue) {
        this.buttonTextForm.patchValue(buttonTextValue);
        this.setFontSizeCurrent();
        this.setTextAlignmentData();
      }
    });
    this.onButtonTextFormValueChange();
  }

  onButtonTextFormValueChange(): void {
    this.buttonTextForm.valueChanges
      .pipe(
        startWith(this.buttonTextForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            this.sidebarService.setButtonTextValue(value);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const buttonText: ButtonText = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as CmsButtonRenderingComponent,
          };
          if (!newValue.component) {
            this.undoRedoService.addButtonText(buttonText);
          }
        }
      });
  }
  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  getButtonTextFormGroup(): FormGroup {
    const buttonTextFormGroup = this.fb.group({
      text: ['Sample Button'],
      isFontDefault: [false],
      isFontIndexDefault: [0],
      isStyleDefault: [false],
      isTextColorDefault: [false],
      isTextOpacityDefault: [false],
      isLineHeightDefault: [false],
      isLetterSpacingDefault: [false],
      fontFamily: [EFontFamilyCode.PROMPT],
      fontStyle: [EFontStyle.REGULAR],
      fontSize: [fontSizePx[7]],
      textColor: ['#616161'],
      textOpacity: textOpacity[textOpacity.length - 1],
      textAlignment: [ETextAlignment.LEFT],
      lineHeight: [lineHeight[0]],
      letterSpacing: letterSpacing[0],
      isIcon: [false],
      iconCode: ['caret-square-right'],
      iconBeforeText: [false],
      iconSize: [20],
      iconColor: ['#616161'],
      iconColorOpacity: [100],
      component: null,
      buttonText: [''],
    });
    return buttonTextFormGroup;
  }

  onToggleDefault(formControlName: string): void {
    this.buttonTextForm.get(formControlName).patchValue(!this.buttonTextForm.get(formControlName).value);
    const isGlobal = this.buttonTextForm.get(formControlName).value;
    switch (formControlName) {
      // TODO: Heng (We still need or not?)
      // delete not have field
      // case 'isFontDefault':
      //   if (isGlobal) this.buttonTextForm.get('fontFamily').patchValue(this.themeFontSetting.font);
      //   break;
      case 'isStyleDefault':
        if (isGlobal) this.buttonTextForm.get('fontStyle').patchValue(this.themeFontSetting.style);
        break;
      // case 'isTextColorDefault':
      //   if (isGlobal) this.buttonTextForm.get('textColor').patchValue(this.themeFontSetting.color);
      //   break;
      // case 'isTextOpacityDefault':
      //   if (isGlobal) this.buttonTextForm.get('textOpacity').patchValue(this.themeFontSetting.opacity);
      //   break;
      case 'isLineHeightDefault':
        if (isGlobal) this.buttonTextForm.get('lineHeight').patchValue(this.themeFontSetting.lineHeight);
        break;
      case 'isLetterSpacingDefault':
        if (isGlobal) this.buttonTextForm.get('letterSpacing').patchValue(this.themeFontSetting.letterSpacing);
        break;
      default:
        break;
    }
  }

  setSelectFontFamilyIndex(key: string, isTheme: boolean): void {
    const textFontIndexFormGroup = this.buttonTextForm.get('isFontIndexDefault');
    if (isTheme) {
      //TODO: Heng Delete font[] field
      // const index = this.themeFontSetting.findIndex((font) => font.familyCode === key);
      // textFontIndexFormGroup.patchValue(index);
    } else {
      const index = this.fontFamilyData.findIndex((font) => font.fontFamilyCode === key);
      textFontIndexFormGroup.patchValue(index);
    }
  }

  onSwitchFontSize(): void {
    const fontSizeFormGroup = this.buttonTextForm['controls']['fontSize'];
    this.setFontSizeCurrent();
    switch (this.fontSizeCurrent) {
      case 'px':
        this.fontSizeCurrent = 'em';
        fontSizeFormGroup.patchValue('1.2em');
        break;
      case 'em':
        this.fontSizeCurrent = 'px';
        fontSizeFormGroup.patchValue('18px');
        break;
      default:
        break;
    }
  }

  setFontSizeCurrent(): void {
    const fontSizeFormGroup = this.buttonTextForm['controls']['fontSize'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes('px')) {
      this.fontSizeCurrent = 'px';
    } else {
      this.fontSizeCurrent = 'em';
    }
  }

  onIncreaseTextOpacity(): void {
    const textOpacityFormGroup = this.buttonTextForm.get('textOpacity');
    const textOpacityLength = textOpacity.length;
    const foundIndex = textOpacity.indexOf(textOpacityFormGroup.value);
    if (foundIndex < textOpacityLength - 1) textOpacityFormGroup.patchValue(textOpacity[foundIndex + 1]);
  }

  onDecreaseTextOpacity(): void {
    const textOpacityFormGroup = this.buttonTextForm.get('textOpacity');
    const foundIndex = textOpacity.indexOf(textOpacityFormGroup.value);
    if (foundIndex > 0) textOpacityFormGroup.patchValue(textOpacity[foundIndex - 1]);
  }

  onTextAlignment(index: number): void {
    this.textAlignmentData.forEach((align) => (align.selected = false));
    this.textAlignmentData[index].selected = true;
    const textAlignmentFormGroup = this.buttonTextForm.get('textAlignment');
    textAlignmentFormGroup.patchValue(this.textAlignmentData[index].value);
  }

  setTextAlignmentData(): void {
    this.textAlignmentData.forEach((align) => (align.selected = false));
    const textAlignment = this.buttonTextForm.get('textAlignment').value;
    const found = this.textAlignmentData.find((align) => align.value === textAlignment);
    found.selected = true;
  }

  onSelectedIcon(icon: string): void {
    this.buttonTextForm.get('iconCode').patchValue(icon);
  }
}
