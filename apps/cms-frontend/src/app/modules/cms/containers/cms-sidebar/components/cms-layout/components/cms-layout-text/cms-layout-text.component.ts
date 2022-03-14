import { StringMap } from '@angular/compiler/src/compiler_facade_interface';
import { AfterViewInit, Component, Input, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { MatSelectChange } from '@angular/material/select';
import {
  EBullet,
  EDecoration,
  EFontFamily,
  EFontFamilyCode,
  EFontStyle,
  ElinkType,
  emojiList,
  ENumberPosition,
  EnumThemeMode,
  EnumThemeRenderingSettingColorType,
  EnumThemeRenderingSettingFontType,
  ETextPosition,
  fontSizeEm,
  fontSizePx,
  IContentManageText,
  IDropDown,
  IThemeRenderingSettingColors,
  IThemeRenderingSettingFont,
  textOpacity,
  UnitEnum,
} from '@reactor-room/cms-models-lib';
import { CmsSidebarService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-sidebar.service';
import { CmsEditThemeService } from 'apps/cms-frontend/src/app/modules/cms/services/cms-theme.service';
import { autoCompleteFilter } from 'apps/cms-frontend/src/app/modules/cms/services/domain/common.domain';
import {
  setQuillToEditorFormDefaultValue,
  setQuillToEditorFormLinkValue,
  setQuillToEditorFormTextValue,
  setQuillToEditorFormTypographyValue,
} from 'apps/cms-frontend/src/app/modules/cms/services/domain/quill.domain';
import { textDefault } from 'apps/cms-frontend/src/environments/environment';
import { QuillEditorComponent, Range } from 'ngx-quill';
import { EMPTY, Observable, Subject } from 'rxjs';
import { distinctUntilChanged, map, startWith, switchMap, takeUntil, tap } from 'rxjs/operators';
import { ITextSelectionEvent } from '../../../../../../../../modules/cms/components/cms-rendering-component/cms-text-rendering/cms-text-rederding.model';
import { CmsTextEditorService } from '../../../../../../../../modules/cms/services/cms-text-editor.service';
import { ESidebarElement, ESidebarMode } from '../../../../cms-sidebar.model';
import { linkTypeData } from '../../cms-layout.list';
import { anchorData, contentPageData, pageData, popupPageData, productPageData } from './../../cms-layout.list';
@Component({
  selector: 'cms-next-cms-layout-text',
  templateUrl: './cms-layout-text.component.html',
  styleUrls: ['./cms-layout-text.component.scss'],
})
export class CmsLayoutTextComponent implements OnInit, AfterViewInit, OnDestroy {
  @Input() isContentEditor = false;
  ESidebarElement = ESidebarElement;
  toggleData = [
    {
      title: ESidebarElement.TEXT_GENERAL,
      status: true,
    },
    {
      title: ESidebarElement.TEXT_TYPOGRAPHY,
      status: false,
    },
    {
      title: ESidebarElement.TEXT_LINK,
      status: false,
    },
  ];
  fontFamilyData: IDropDown[] = [
    {
      value: EFontFamilyCode.PROMPT,
      title: EFontFamily.PROMPT,
    },
    {
      value: EFontFamilyCode.NEUCHA,
      title: EFontFamily.NEUCHA,
    },
    {
      value: EFontFamilyCode.POST_NO_BILLS_COLOMBO,
      title: EFontFamily.POST_NO_BILLS_COLOMBO,
    },
    {
      value: EFontFamilyCode.QUANTICO,
      title: EFontFamily.QUANTICO,
    },
    {
      value: EFontFamilyCode.RACING_SANS_ONE,
      title: EFontFamily.RACING_SANS_ONE,
    },
  ];
  filterFontFamilyData: Observable<IDropDown[]>;

  themeStyleData: IDropDown[] = [
    {
      value: EnumThemeRenderingSettingFontType.NONE,
      title: 'Not Apply',
    },
    {
      value: EnumThemeRenderingSettingFontType.HEADER,
      title: 'Theme Header',
    },
    {
      value: EnumThemeRenderingSettingFontType.SUB_HEADER,
      title: 'Theme Sub Header',
    },
    {
      value: EnumThemeRenderingSettingFontType.DETAIL,
      title: 'Theme Detail',
    },
    {
      value: EnumThemeRenderingSettingFontType.SUB_DETAIL,
      title: 'Theme Sub Detail',
    },
  ];

  modeColorData: IDropDown[] = [
    {
      value: EnumThemeRenderingSettingColorType.NONE,
      title: 'Not Apply',
    },
    {
      value: EnumThemeRenderingSettingFontType.HEADER,
      title: 'Header',
    },
    {
      value: EnumThemeRenderingSettingFontType.SUB_HEADER,
      title: 'Sub Header',
    },
    {
      value: EnumThemeRenderingSettingFontType.DETAIL,
      title: 'Detail',
    },
    {
      value: EnumThemeRenderingSettingFontType.SUB_DETAIL,
      title: 'Sub Detail',
    },
    {
      value: EnumThemeRenderingSettingColorType.ASSERT1,
      title: 'Asset 1',
    },
    {
      value: EnumThemeRenderingSettingColorType.ASSERT2,
      title: 'Asset 2',
    },
    {
      value: EnumThemeRenderingSettingColorType.ASSERT3,
      title: 'Asset 3',
    },
  ];

  themeFontSetting: IThemeRenderingSettingFont[];
  themeColorSetting: IThemeRenderingSettingColors[];
  fontSizeEmData = fontSizeEm;
  filterFontSizeEmData: Observable<string[]>;
  fontSizePxData = fontSizePx;
  filterFontSizePxData: Observable<string[]>;
  fontStyleData: IDropDown[] = [
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
  decorationData = [
    {
      value: EDecoration.DASH,
      selected: false,
    },
    {
      value: EDecoration.UNDERLINE,
      selected: false,
    },
    {
      value: EDecoration.CROSSWORD,
      selected: false,
    },
  ];
  numberPositionData = [
    {
      value: ENumberPosition.SCRIPT,
      selected: false,
    },
    {
      value: ENumberPosition.SUBSCRIPT,
      selected: false,
    },
    {
      value: ENumberPosition.SUPERSCRIPT,
      selected: false,
    },
  ];
  bulletData = [
    {
      value: EBullet.NONE,
      selected: false,
    },
    {
      value: EBullet.BULLETED_LIST,
      selected: false,
    },
    {
      value: EBullet.NUMBERED_LIST,
      selected: false,
    },
  ];
  linkTypeData: IDropDown[] = linkTypeData;
  layoutTextData: IContentManageText = {
    themeStyle: textDefault.defaultTextThemeStyle,
    text: {
      fontFamily: textDefault.defaultFontFamilyCode,
      fontStyle: textDefault.defaultFontFamilyStyle,
      fontSize: textDefault.defaultFontSizePx,
      textColor: textDefault.defaultTextLightColor,
      colorStyle: textDefault.defaultTextThemeColor,
      textOpacity: textDefault.defaultTextOpacity,
      textAlignment: textDefault.defaultTextAlignment,
    },
    typography: {
      lineHeight: textDefault.defaultParagraphSetting,
      letterSpacing: textDefault.defaultParagraphSetting,
      decoration: textDefault.defaultTextDecoration,
      numberPosition: textDefault.defaultTextNumberPosition,
      bullet: textDefault.defaultTextBullet,
      horizontalPosition: ETextPosition.LEFT,
      verticalPosition: ETextPosition.TOP,
    },
    link: {
      linkType: textDefault.defaultTextLinkType,
      linkValue: null,
      parentID: null,
    },
    isThemeFontFamily: false,
    isThemeFontSize: false,
    isThemeStyle: false,
    isThemeTextColor: false,
    isThemeTextOpacity: false,
    isThemeLineHeight: false,
    isThemeLetterSpacing: false,
  };
  horizontalData = [
    {
      value: ETextPosition.LEFT,
      selected: false,
    },
    {
      value: ETextPosition.JUSTIFY_CENTER,
      selected: false,
    },
    {
      value: ETextPosition.RIGHT,
      selected: false,
    },
  ];
  verticalData = [
    {
      value: ETextPosition.TOP,
      selected: false,
    },
    {
      value: ETextPosition.ITEM_CENTER,
      selected: false,
    },
    {
      value: ETextPosition.BOTTOM,
      selected: false,
    },
  ];
  layoutTextForm: FormGroup;
  EDecoration = EDecoration;
  ENumberPosition = ENumberPosition;
  EBullet = EBullet;
  currentLinkType: ElinkType;
  ElinkType = ElinkType;
  ETextPosition = ETextPosition;
  pageData = pageData;
  productPageData = productPageData;
  contentPageData = contentPageData;
  popupPageData = popupPageData;
  anchorData = anchorData;

  textEditorEvent: ITextSelectionEvent;
  textSelectionRange: Range;
  emojiList = emojiList;
  quill: QuillEditorComponent;
  fontSizeCurrent = textDefault.defaultFontSizeUnit;
  globalThemeFontSetting: IThemeRenderingSettingFont = {
    type: textDefault.defaultTextThemeStyle,
    familyCode: textDefault.defaultFontFamilyCode,
    size: 14,
    unit: textDefault.defaultFontSizeUnit,
    style: textDefault.defaultFontFamilyStyle,
    lineHeight: textDefault.defaultParagraphSetting,
    letterSpacing: textDefault.defaultParagraphSetting,
  };
  globalThemeColorSetting: IThemeRenderingSettingColors = {
    type: EnumThemeRenderingSettingColorType.HEADER,
    dark: {
      color: textDefault.defaultTextLightColor,
      opacity: 1,
      bgColor: textDefault.defaultTextLightColor,
      bgOpacity: 1,
    },
    light: {
      color: textDefault.defaultTextLightColor,
      opacity: 1,
      bgColor: textDefault.defaultTextLightColor,
      bgOpacity: 1,
    },
  };
  globalModeColorSetting: IThemeRenderingSettingColors = {
    type: EnumThemeRenderingSettingColorType.HEADER,
    dark: {
      color: textDefault.defaultTextDarkColor,
      opacity: 1,
      bgColor: textDefault.defaultTextDarkColor,
      bgOpacity: 1,
    },
    light: {
      color: textDefault.defaultTextLightColor,
      opacity: 1,
      bgColor: textDefault.defaultTextLightColor,
      bgOpacity: 1,
    },
  };
  themeMode: EnumThemeMode;
  EnumThemeMode = EnumThemeMode;
  destroy$ = new Subject();
  previousQuillSetting: StringMap;
  positionLabel = 'Alignment';

  constructor(private fb: FormBuilder, private textEditorService: CmsTextEditorService, private cmsThemeService: CmsEditThemeService, private sidebarService: CmsSidebarService) {}

  ngOnInit(): void {
    this.setTextDataToForm();
    this.cmsThemeService.getThemeFontSetting.pipe(takeUntil(this.destroy$)).subscribe((themeFontSetting: IThemeRenderingSettingFont[]) => {
      this.themeFontSetting = themeFontSetting;
    });
    this.cmsThemeService.getThemeColorSetting.pipe(takeUntil(this.destroy$)).subscribe((themeColorSetting: IThemeRenderingSettingColors[]) => {
      this.themeColorSetting = themeColorSetting;
    });
    this.sidebarService.getThemeMode.pipe(takeUntil(this.destroy$)).subscribe((mode) => {
      this.themeMode = mode;
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngAfterViewInit(): void {
    this.textEditorService.getQuillEditor
      .pipe(
        takeUntil(this.destroy$),
        distinctUntilChanged(),
        switchMap((quill: QuillEditorComponent) => {
          if (quill) {
            this.quill = quill;
            return this.textEditorService.getTextSelectionRange;
          } else {
            return EMPTY;
          }
        }),
        switchMap((range: Range) => {
          if (range) {
            this.setQuillToEditorFormValue(range, this.quill);
            return this.layoutTextForm.valueChanges;
          } else {
            return EMPTY;
          }
        }),
        distinctUntilChanged(),
        tap((val: IContentManageText) => {
          this.textEditorService.updateTextEditorFormValue(val);
        }),
      )
      .subscribe();
    this.onFormAutoCompleteHandler();
  }

  onFormAutoCompleteHandler(): void {
    const textForm = this.layoutTextForm.get('text') as FormGroup;
    this.filterFontFamilyData = textForm.get('fontFamily').valueChanges.pipe(
      startWith(''),
      map((value) => autoCompleteFilter(value, this.fontFamilyData, 'object')),
    ) as Observable<IDropDown[]>;
    this.filterFontSizePxData = textForm.get('fontSize').valueChanges.pipe(
      startWith(''),
      map((value) => autoCompleteFilter(value, this.fontSizePxData, 'string')),
    ) as Observable<string[]>;
    this.filterFontSizeEmData = textForm.get('fontSize').valueChanges.pipe(
      startWith(''),
      map((value) => autoCompleteFilter(value, this.fontSizeEmData, 'string')),
    ) as Observable<string[]>;
  }

  setQuillToEditorFormValue(range: Range, quill: QuillEditorComponent): void {
    this.textSelectionRange = range;
    const setting = quill.quillEditor.getFormat(range.index, range.length);
    if (!this.previousQuillSetting) this.previousQuillSetting = setting;
    // const condition = !isEqual(setting, this.previousQuillSetting);
    // TODO: condition sometimes not working...should apply to improve Quill performance
    const condition = true;
    if (condition) {
      this.previousQuillSetting = setting;
      setQuillToEditorFormTextValue(setting, this.layoutTextForm.get('text') as FormGroup);
      setQuillToEditorFormTypographyValue(setting, this.layoutTextForm.get('typography') as FormGroup);
      setQuillToEditorFormLinkValue(quill, range, this.layoutTextForm.get('link') as FormGroup);
      [this.globalThemeFontSetting, this.globalThemeColorSetting, this.globalModeColorSetting] = setQuillToEditorFormDefaultValue(
        setting,
        this.layoutTextForm,
        this.themeFontSetting,
        this.themeColorSetting,
        this.globalThemeFontSetting,
        this.globalThemeColorSetting,
        this.globalModeColorSetting,
      );
      this.setDecorationData();
      this.setNumberPositionData();
      this.setBulletData();
      this.currentLinkType = this.layoutTextForm.get('link').get('linkType').value;
    }
  }

  setTextDataToForm(): void {
    this.layoutTextForm = this.getlayoutTextFormGroup();
    this.layoutTextForm.patchValue(this.layoutTextData);
    this.setDecorationData();
    this.setNumberPositionData();
    this.setBulletData();
    this.setHorizontalData();
    this.setVeriticalData();
    this.currentLinkType = this.layoutTextForm.get('link').get('linkType').value;
  }

  onToggleItem(index: number): void {
    this.toggleData.forEach((item, loopIndex) => {
      if (loopIndex !== index) item.status = false;
    });
    this.toggleData[index].status = !this.toggleData[index].status;
  }

  onToggleDefault(formControlName: string): void {
    this.layoutTextForm.get(formControlName).patchValue(!this.layoutTextForm.get(formControlName).value);
    this.layoutTextForm.get('text').get('fontFamily').patchValue(textDefault.defaultFontFamilyCode);
    this.layoutTextForm.get('text').get('fontStyle').patchValue(textDefault.defaultFontFamilyStyle);
    this.layoutTextForm.get('text').get('fontSize').patchValue(textDefault.defaultFontSizePx);
    this.setFontSizeCurrent();
    this.layoutTextForm.get('text').get('textColor').patchValue(textDefault.defaultTextLightColor);
    this.layoutTextForm.get('text').get('textOpacity').patchValue(textDefault.defaultTextOpacity);
    this.layoutTextForm.get('typography').get('lineHeight').patchValue(textDefault.defaultParagraphSetting);
    this.layoutTextForm.get('typography').get('letterSpacing').patchValue(textDefault.defaultParagraphSetting);
  }

  getlayoutTextFormGroup(): FormGroup {
    const layoutTextFormGroup = this.fb.group({
      themeStyle: [textDefault.defaultTextThemeStyle],
      text: this.getContentManageTextTextFormGroup(),
      typography: this.getContentManageTextTypographyFormGroup(),
      link: this.getContentManageTextLinkFormGroup(),
      isThemeFontFamily: [false],
      isThemeFontSize: [false],
      isThemeStyle: [false],
      isThemeTextColor: [false],
      isThemeTextOpacity: [false],
      isThemeLineHeight: [false],
      isThemeLetterSpacing: [false],
    });
    return layoutTextFormGroup;
  }

  getContentManageTextTextFormGroup(): FormGroup {
    const contentManageTextTextFormGroup = this.fb.group({
      fontFamily: [textDefault.defaultFontFamilyCode],
      fontStyle: [textDefault.defaultFontFamilyStyle],
      fontSize: [textDefault.defaultFontSizePx],
      textColor: [textDefault.defaultTextLightColor],
      colorStyle: [textDefault.defaultTextThemeColor],
      textOpacity: textDefault.defaultTextOpacity,
      textAlignment: [textDefault.defaultTextAlignment],
    });
    return contentManageTextTextFormGroup;
  }

  getContentManageTextTypographyFormGroup(): FormGroup {
    const contentManageTextTypographyFormGroup = this.fb.group({
      lineHeight: [textDefault.defaultParagraphSetting],
      letterSpacing: [textDefault.defaultParagraphSetting],
      decoration: [textDefault.defaultTextDecoration],
      numberPosition: [textDefault.defaultTextNumberPosition],
      bullet: [textDefault.defaultTextBullet],
      horizontalPosition: [ETextPosition.LEFT],
      verticalPosition: [ETextPosition.TOP],
    });
    return contentManageTextTypographyFormGroup;
  }

  getContentManageTextLinkFormGroup(): FormGroup {
    const contentManageTextLinkFormGroup = this.fb.group({
      linkType: [textDefault.defaultTextLinkType],
      linkValue: [],
      parentID: [],
    });
    return contentManageTextLinkFormGroup;
  }

  onIncreaseTextOpacity(): void {
    const textOpacityFormGroup = this.layoutTextForm.get('text').get('textOpacity');
    const textOpacityLength = textOpacity.length;
    const foundIndex = textOpacity.indexOf(textOpacityFormGroup.value);
    if (foundIndex < textOpacityLength - 1) textOpacityFormGroup.patchValue(textOpacity[foundIndex + 1]);
  }

  onDecreaseTextOpacity(): void {
    const textOpacityFormGroup = this.layoutTextForm.get('text').get('textOpacity');
    const foundIndex = textOpacity.indexOf(textOpacityFormGroup.value);
    if (foundIndex > 0) textOpacityFormGroup.patchValue(textOpacity[foundIndex - 1]);
  }

  onIncreaseLineHeight(): void {
    const lineHeightFormGroup = this.layoutTextForm.get('typography').get('lineHeight');
    console.log('lineHeightFormGroup :>> ', lineHeightFormGroup.value);
  }

  onDecreaseLineHeight(): void {
    const lineHeightFormGroup = this.layoutTextForm.get('typography').get('lineHeight');
    console.log('lineHeightFormGroup :>> ', lineHeightFormGroup.value);
  }

  onIncreaseLetterSpacing(): void {
    const letterSpacingFormGroup = this.layoutTextForm.get('typography').get('letterSpacing');
    console.log('letterSpacingFormGroup :>> ', letterSpacingFormGroup.value);
  }

  onDecreaseLetterSpacing(): void {
    const letterSpacingFormGroup = this.layoutTextForm.get('typography').get('letterSpacing');
    console.log('letterSpacingFormGroup :>> ', letterSpacingFormGroup.value);
  }

  onSetEmojiToQuill(index: number): void {
    this.textEditorService.updateTextEmoji(this.emojiList[index]);
  }

  setDecorationData(): void {
    this.decorationData.forEach((deco) => (deco.selected = false));
    const decoration = this.layoutTextForm.get('typography').get('decoration').value;
    const found = this.decorationData.find((deco) => deco.value === decoration);
    found.selected = true;
  }

  onDecoration(index: number): void {
    this.decorationData.forEach((deco) => (deco.selected = false));
    this.decorationData[index].selected = true;
    const decorationFormGroup = this.layoutTextForm.get('typography').get('decoration');
    decorationFormGroup.patchValue(this.decorationData[index].value);
  }

  setNumberPositionData(): void {
    this.numberPositionData.forEach((position) => (position.selected = false));
    const numberPosition = this.layoutTextForm.get('typography').get('numberPosition').value;
    const found = this.numberPositionData.find((position) => position.value === numberPosition);
    found.selected = true;
  }

  onNumberPosition(index: number): void {
    this.numberPositionData.forEach((position) => (position.selected = false));
    this.numberPositionData[index].selected = true;
    const numberPositionFormGroup = this.layoutTextForm.get('typography').get('numberPosition');
    numberPositionFormGroup.patchValue(this.numberPositionData[index].value);
  }

  setHorizontalData(): void {
    this.horizontalData.forEach((item) => (item.selected = false));
    const position = this.layoutTextForm.get('typography').get('horizontalPosition').value;
    const found = this.horizontalData.find((item) => item.value === position);
    found.selected = true;
  }

  onHorizontal(index: number): void {
    this.horizontalData.forEach((item) => (item.selected = false));
    this.horizontalData[index].selected = true;
    const horizontalFormGroup = this.layoutTextForm.get('typography').get('horizontalPosition');
    horizontalFormGroup.patchValue(this.horizontalData[index].value);
  }

  setVeriticalData(): void {
    this.verticalData.forEach((item) => (item.selected = false));
    const position = this.layoutTextForm.get('typography').get('verticalPosition').value;
    const found = this.verticalData.find((item) => item.value === position);
    found.selected = true;
  }

  onVertical(index: number): void {
    this.verticalData.forEach((item) => (item.selected = false));
    this.verticalData[index].selected = true;
    const verticalFormGroup = this.layoutTextForm.get('typography').get('verticalPosition');
    verticalFormGroup.patchValue(this.verticalData[index].value);
  }

  setBulletData(): void {
    this.bulletData.forEach((item) => (item.selected = false));
    const bullet = this.layoutTextForm.get('typography').get('bullet').value;
    const found = this.bulletData.find((item) => item.value === bullet);
    found.selected = true;
  }

  onBullet(index: number): void {
    this.bulletData.forEach((item) => (item.selected = false));
    this.bulletData[index].selected = true;
    const bulletFormGroup = this.layoutTextForm.get('typography').get('bullet');
    bulletFormGroup.patchValue(this.bulletData[index].value);
  }

  onLinkTypeChange(event: MatSelectChange): void {
    this.currentLinkType = event.value;
    this.layoutTextForm.get('link').get('linkValue').patchValue('');
  }

  onClearProperty(formGroupName: string, formControlName: string): void {
    const formGroup = this.layoutTextForm.get(formGroupName).get(formControlName);
    formGroup.patchValue('');
  }

  onSwitchFontSize(): void {
    const fontSizeFormGroup = this.layoutTextForm['controls']['text']['controls']['fontSize'];
    this.setFontSizeCurrent();
    switch (this.fontSizeCurrent) {
      case UnitEnum.PX:
        this.fontSizeCurrent = UnitEnum.EM;
        fontSizeFormGroup.patchValue(textDefault.defaultFontSizeEm);
        break;
      case UnitEnum.EM:
        this.fontSizeCurrent = UnitEnum.PX;
        fontSizeFormGroup.patchValue(textDefault.defaultFontSizePx);
        break;
      default:
        break;
    }
  }

  setFontSizeCurrent(): void {
    const fontSizeFormGroup = this.layoutTextForm['controls']['text']['controls']['fontSize'] as FormGroup;
    const fontSizeValue = fontSizeFormGroup.value as string;
    if (fontSizeValue.includes(UnitEnum.PX)) {
      this.fontSizeCurrent = UnitEnum.PX;
    } else {
      this.fontSizeCurrent = UnitEnum.EM;
    }
  }

  onDismissContentEditor(): void {
    this.sidebarService.setSidebarMode(ESidebarMode.CONTENT_MANAGE);
    this.sidebarService.setSidebarLayoutMode(null);
  }
}
