import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { ControlContainer, FormBuilder, FormGroup, FormGroupDirective } from '@angular/forms';
import {
  EFontFamily,
  EFontFamilyCode,
  EFontStyle,
  EnumLanguageCultureUI,
  EPosition,
  ETextAlignment,
  fontSizeEm,
  fontSizePx,
  IFont,
  IGeneralText,
  IGeneralTextTextCultureUI,
  letterSpacing,
  lineHeight,
  OverlayEffectTitleType,
  OverlayEffectType,
  TextEffectTitleType,
  TextEffectType,
  textOpacity,
} from '@reactor-room/cms-models-lib';
import { deepCopy } from '@reactor-room/itopplus-front-end-helpers';
import { UndoRedoService } from 'apps/cms-frontend/src/app/services/undo-redo.service';
import { EMPTY, Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, pairwise, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ICmsLanguageSwitch } from '../../../../components/common/cms-language-switch/cms-language-switch.model';
import { ComponentTypeWithText, GeneralText } from '../../../../modules/cms-edit-mode/components/cms-edit-rendering/cms-edit-rendering.model';
import { CmsCommonService } from '../../../../services/cms-common.service';
import { CmsEditService } from '../../../../services/cms-edit.service';
import { CmsSidebarService } from '../../../../services/cms-sidebar.service';

@Component({
  selector: 'cms-next-cms-general-text-setting',
  templateUrl: './cms-general-text-setting.component.html',
  styleUrls: ['./cms-general-text-setting.component.scss'],
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
})
export class CmsGeneralTextSettingComponent implements OnInit, AfterViewInit, OnDestroy {
  generalTextSettingForm: FormGroup;
  parentForm: FormGroup;
  destroy$ = new Subject();
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
  textAnimationData = [
    {
      title: TextEffectTitleType.NO_EFFECT,
      value: TextEffectType.NO_EFFECT,
    },
    {
      title: TextEffectTitleType.TRACKING_IN_EXPAND,
      value: TextEffectType.TRACKING_IN_EXPAND,
    },
    {
      title: TextEffectTitleType.TRACKING_OUT_CONTRACT,
      value: TextEffectType.TRACKING_OUT_CONTRACT,
    },
    {
      title: TextEffectTitleType.TEXT_FOCUS_IN,
      value: TextEffectType.TEXT_FOCUS_IN,
    },
    {
      title: TextEffectTitleType.TEXT_BLUR_OUT,
      value: TextEffectType.TEXT_BLUR_OUT,
    },
    {
      title: TextEffectTitleType.TEXT_FLICKER_IN_GLOW,
      value: TextEffectType.TEXT_FLICKER_IN_GLOW,
    },
    {
      title: TextEffectTitleType.TEXT_SHADOW_DROP_CENTER,
      value: TextEffectType.TEXT_SHADOW_DROP_CENTER,
    },
    {
      title: TextEffectTitleType.TEXT_SHADOWN_POP_TOP,
      value: TextEffectType.TEXT_SHADOWN_POP_TOP,
    },
    {
      title: TextEffectTitleType.TEXT_POP_UP_TOP,
      value: TextEffectType.TEXT_POP_UP_TOP,
    },
  ];
  overlayEffectData = [
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
  EPosition = EPosition;
  fontSizeTitleCurrent = 'px';
  fontSizeDescriptionCurrent = 'px';
  generalTextSettingValue: IGeneralText;
  currentCultureUI: EnumLanguageCultureUI;
  positionLabel = 'Alignment';

  constructor(
    private fb: FormBuilder,
    private parentFormDirective: FormGroupDirective,
    private sidebarService: CmsSidebarService,
    private cmsEditService: CmsEditService,
    private undoRedoService: UndoRedoService,
    private commonService: CmsCommonService,
  ) {}

  ngOnInit(): void {
    this.generalTextSettingForm = this.getGeneralTextSettingFormGroup();
    this.parentForm = this.parentFormDirective.form;
    this.parentForm.addControl('generalTextSetting', this.generalTextSettingForm);
  }

  ngAfterViewInit(): void {
    this.sidebarService.getGeneralTextSettingFormValue
      .pipe(
        distinctUntilChanged(),
        switchMap((generalTextSettingValue: IGeneralText) => {
          if (generalTextSettingValue) {
            this.generalTextSettingValue = generalTextSettingValue;
            this.generalTextSettingForm.patchValue(this.generalTextSettingValue);
            this.setHorizontalData(this.generalTextSettingValue.horizontalPosition);
            this.setVeriticalData(this.generalTextSettingValue.verticalPosition);
            this.setFontSizeTitleCurrent();
            this.setFontSizeDescriptionCurrent();
            this.setOverlayEffectData();
            return this.commonService.getCmsLanguageSwitch;
          } else return EMPTY;
        }),
        tap((language: ICmsLanguageSwitch) => {
          this.currentCultureUI = language.cultureUI;
          const currentText = this.generalTextSettingValue.text.text.find((item) => item.cultureUI === language.cultureUI);
          if (currentText) {
            this.generalTextSettingForm.get('text').get('title').patchValue(currentText.title);
            this.generalTextSettingForm.get('text').get('description').patchValue(currentText.description);
          }
        }),
      )
      .subscribe();
    this.onGeneralTextSettingFormValueChange();
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  onGeneralTextSettingFormValueChange(): void {
    this.generalTextSettingForm.valueChanges
      .pipe(
        startWith(this.generalTextSettingForm.value),
        distinctUntilChanged(),
        takeUntil(this.destroy$),
        debounceTime(100),
        tap((value) => {
          if (value) {
            const deepValue = deepCopy(value);
            delete deepValue?.text?.title;
            delete deepValue?.text?.description;
            deepValue.text.text = this.generalTextSettingValue?.text?.text;
            const textArray = deepValue.text.text as IGeneralTextTextCultureUI[];
            const foundText = textArray.find((item) => item.cultureUI === this.currentCultureUI);
            if (foundText) {
              foundText.title = value.text.title;
              foundText.description = value.text.description;
            }
            this.sidebarService.setGeneralTextSettingValue(deepValue);
          }
        }),
        pairwise(),
      )
      .subscribe(([oldValue, newValue]) => {
        if (newValue) {
          const generalTextSetting: GeneralText = {
            ...oldValue,
            component: this.cmsEditService.currentComponent as ComponentTypeWithText,
          };
          if (!newValue.component) {
            this.undoRedoService.addGeneralTextSetting(generalTextSetting);
          }
        }
      });
  }

  getGeneralTextSettingFormGroup(): FormGroup {
    const generalTextSettingFormGroup = this.fb.group({
      text: this.getGeneralTextSettingTextFormGroup(),
      overlay: this.getGeneralTextSettingOverlayFormGroup(),
      horizontalPosition: [EPosition.LEFT],
      verticalPosition: [EPosition.TOP],
      isApplyAll: [false],
      component: null,
    });
    return generalTextSettingFormGroup;
  }

  getGeneralTextSettingTextFormGroup(): FormGroup {
    const generalTextSettingTextFormGroup = this.fb.group({
      isText: [true],
      title: [''],
      description: [''],
      fontFamily: [EFontFamilyCode.PROMPT],
      fontStyle: [EFontStyle.REGULAR],
      titleFontSize: [fontSizePx[7]],
      descriptionFontSize: [fontSizePx[5]],
      textColor: ['#616161'],
      textOpacity: textOpacity[textOpacity.length - 1],
      textAlignment: [ETextAlignment.LEFT],
      lineHeight: [lineHeight[0]],
      letterSpacing: letterSpacing[0],
      textAnimation: [TextEffectType.NO_EFFECT],
    });
    return generalTextSettingTextFormGroup;
  }

  getGeneralTextSettingOverlayFormGroup(): FormGroup {
    const generalTextSettingOverlayFormGroup = this.fb.group({
      isOverlay: [true],
      isOverlayFullWidth: [false],
      overlayColor: ['#ffffff'],
      overlayOpacity: [textOpacity[textOpacity.length - 1]],
      overlayAnimation: [OverlayEffectType.NONE],
    });
    return generalTextSettingOverlayFormGroup;
  }

  setHorizontalData(position: string): void {
    this.horizontalData.forEach((item) => (item.selected = false));
    const found = this.horizontalData.find((item) => item.value === position);
    found.selected = true;
  }

  onHorizontal(index: number): void {
    this.horizontalData.forEach((item) => (item.selected = false));
    this.horizontalData[index].selected = true;
    const horizontalFormGroup = this.generalTextSettingForm.get('horizontalPosition');
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
    const verticalFormGroup = this.generalTextSettingForm.get('verticalPosition');
    verticalFormGroup.patchValue(this.verticalData[index].value);
  }

  // onToggleDefault(formGroupName: string, formControlName: string): void {
  //   this.generalTextSettingForm.get(formGroupName).get(formControlName).patchValue(!this.generalTextSettingForm.get(formGroupName).get(formControlName).value);
  //   const isGlobal = this.generalTextSettingForm.get(formGroupName).get(formControlName).value;
  //   //TODO: Heng (We still need or not?)
  //   switch (formControlName) {
  //     case 'isFontDefault':
  //       // if (isGlobal) this.generalTextSettingForm.get(formGroupName).get('fontFamily').patchValue(this.templateFontSetting.font);
  //       break;
  //     case 'isStyleDefault':
  //       if (isGlobal) this.generalTextSettingForm.get(formGroupName).get('fontStyle').patchValue(this.templateFontSetting.style);
  //       break;
  //     case 'isTextColorDefault':
  //       // if (isGlobal) this.generalTextSettingForm.get(formGroupName).get('textColor').patchValue(this.templateFontSetting.color);
  //       break;
  //     case 'isTextOpacityDefault':
  //       // if (isGlobal) this.generalTextSettingForm.get(formGroupName).get('textOpacity').patchValue(this.templateFontSetting.opacity);
  //       break;
  //     case 'isLineHeightDefault':
  //       if (isGlobal) this.generalTextSettingForm.get(formGroupName).get('lineHeight').patchValue(this.templateFontSetting.lineHeight);
  //       break;
  //     case 'isLetterSpacingDefault':
  //       if (isGlobal) this.generalTextSettingForm.get(formGroupName).get('letterSpacing').patchValue(this.templateFontSetting.letterSpacing);
  //       break;
  //     default:
  //       break;
  //   }
  // }

  // setSelectFontFamilyIndex(key: string, isTheme: boolean): void {
  //   const textFontIndexFormGroup = this.generalTextSettingForm.get('text').get('isFontIndexDefault');
  //   if (isTheme) {
  //     // const index = this.templateFontSetting.font.findIndex((font) => font.fontFamilyCode === key);
  //     // textFontIndexFormGroup.patchValue(index);
  //   } else {
  //     const index = this.fontFamilyData.findIndex((font) => font.fontFamilyCode === key);
  //     textFontIndexFormGroup.patchValue(index);
  //   }
  // }

  onSwitchTitleFontSize(): void {
    const fontSizeFormGroup = this.generalTextSettingForm['controls']['text']['controls']['titleFontSize'];
    this.setFontSizeTitleCurrent();
    switch (this.fontSizeTitleCurrent) {
      case 'px':
        this.fontSizeTitleCurrent = 'em';
        fontSizeFormGroup.patchValue('1.2em');
        break;
      case 'em':
        this.fontSizeTitleCurrent = 'px';
        fontSizeFormGroup.patchValue('18px');
        break;
      default:
        break;
    }
  }

  setFontSizeTitleCurrent(): void {
    const fontSizeFormGroup = this.generalTextSettingForm['controls']['text']['controls']['titleFontSize'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes('px')) {
      this.fontSizeTitleCurrent = 'px';
    } else {
      this.fontSizeTitleCurrent = 'em';
    }
  }

  onSwitchDescriptionFontSize(): void {
    const fontSizeFormGroup = this.generalTextSettingForm['controls']['text']['controls']['descriptionFontSize'];
    this.setFontSizeDescriptionCurrent();
    switch (this.fontSizeDescriptionCurrent) {
      case 'px':
        this.fontSizeDescriptionCurrent = 'em';
        fontSizeFormGroup.patchValue('1em');
        break;
      case 'em':
        this.fontSizeDescriptionCurrent = 'px';
        fontSizeFormGroup.patchValue('14px');
        break;
      default:
        break;
    }
  }

  setFontSizeDescriptionCurrent(): void {
    const fontSizeFormGroup = this.generalTextSettingForm['controls']['text']['controls']['descriptionFontSize'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes('px')) {
      this.fontSizeDescriptionCurrent = 'px';
    } else {
      this.fontSizeDescriptionCurrent = 'em';
    }
  }

  onIncreaseTextOpacity(): void {
    const textOpacityFormGroup = this.generalTextSettingForm.get('text').get('textOpacity');
    const textOpacityLength = textOpacity.length;
    const foundIndex = textOpacity.indexOf(textOpacityFormGroup.value);
    if (foundIndex < textOpacityLength - 1) textOpacityFormGroup.patchValue(textOpacity[foundIndex + 1]);
  }

  onDecreaseTextOpacity(): void {
    const textOpacityFormGroup = this.generalTextSettingForm.get('text').get('textOpacity');
    const foundIndex = textOpacity.indexOf(textOpacityFormGroup.value);
    if (foundIndex > 0) textOpacityFormGroup.patchValue(textOpacity[foundIndex - 1]);
  }

  onIncreaseOverlayOpacity(): void {
    const overlayOpacityFormGroup = this.generalTextSettingForm.get('overlay').get('overlayOpacity');
    const overlayOpacityLength = textOpacity.length;
    const foundIndex = textOpacity.indexOf(overlayOpacityFormGroup.value);
    if (foundIndex < overlayOpacityLength - 1) overlayOpacityFormGroup.patchValue(textOpacity[foundIndex + 1]);
  }

  onDecreaseOverlayOpacity(): void {
    const overlayOpacityFormGroup = this.generalTextSettingForm.get('overlay').get('overlayOpacity');
    const foundIndex = textOpacity.indexOf(overlayOpacityFormGroup.value);
    if (foundIndex > 0) overlayOpacityFormGroup.patchValue(textOpacity[foundIndex - 1]);
  }

  onSelectOverlayEffect(index: number): void {
    this.overlayEffectData.forEach((item) => (item.status = false));
    this.overlayEffectData[index].status = true;
    const overlayEffectFormGroup = this.generalTextSettingForm.get('overlay').get('overlayAnimation');
    overlayEffectFormGroup.patchValue(this.overlayEffectData[index].value);
  }

  setOverlayEffectData(): void {
    this.overlayEffectData.forEach((overlay) => (overlay.status = false));
    const overlayEffect = this.generalTextSettingForm.get('overlay').get('overlayAnimation').value;
    const found = this.overlayEffectData.find((overlay) => overlay.value === overlayEffect);
    found.status = true;
  }
}
