import { Component, Input, OnChanges, OnDestroy, OnInit } from '@angular/core';
import { EFontStyle, EnumLanguageCultureUI, EPosition, IGeneralText, IGeneralTextTextCultureUI } from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { CmsCommonService } from '../../services/cms-common.service';
import { ICmsLanguageSwitch } from '../common/cms-language-switch/cms-language-switch.model';

@Component({
  selector: 'cms-next-cms-general-text',
  templateUrl: './cms-general-text.component.html',
  styleUrls: ['./cms-general-text.component.scss'],
})
export class CmsGeneralTextComponent implements OnInit, OnChanges, OnDestroy {
  @Input() generalTextSetting: IGeneralText;
  @Input() changeDetectorTrigger: boolean;
  titleTextStyle = {
    fontSize: '18px',
    color: '#616161',
  };
  descriptionTextStyle = {
    fontSize: '18px',
    color: '#616161',
  };
  overlayStyle = {
    backgroundColor: '#616161',
    textAlign: 'left',
    lineHeight: 'unset',
    letterSpacing: 'unset',
    fontWeight: 'unset',
    fontStyle: 'normal',
    width: 'unset',
  };
  containerStyle = {
    justifyContent: EPosition.LEFT,
    alignItems: EPosition.TOP,
  };
  textEffectClass = '';
  overlayEffectClass = '';
  fontFamilyClass = '';
  languageTitle: string;
  languageDescription: string;
  currentCultureUI: EnumLanguageCultureUI;
  destroy$ = new Subject();
  constructor(private commonService: CmsCommonService) {
    this.commonService.getCmsLanguageSwitch.pipe(takeUntil(this.destroy$)).subscribe((language: ICmsLanguageSwitch) => {
      this.currentCultureUI = language.cultureUI;
      if (this.generalTextSetting?.text?.text) this.onLanguageTextHandler(this.generalTextSetting.text.text);
    });
  }

  ngOnDestroy(): void {
    this.destroy$.next(null);
    this.destroy$.complete();
  }

  ngOnChanges(): void {
    if (!this.generalTextSetting) return;
    const { verticalPosition, horizontalPosition } = this.generalTextSetting;
    const { fontStyle, titleFontSize, descriptionFontSize, textColor, textOpacity, textAlignment, text, lineHeight, letterSpacing, fontFamily, textAnimation } =
      this.generalTextSetting.text;
    if (text) this.onLanguageTextHandler(text);
    const { overlayColor, overlayOpacity, isOverlay, overlayAnimation, isOverlayFullWidth } = this.generalTextSetting.overlay;
    const isContent = this.languageTitle || this.languageDescription;
    this.titleTextStyle.fontSize = titleFontSize;
    this.titleTextStyle.color = hexToRgba(textColor, textOpacity);
    this.descriptionTextStyle.fontSize = descriptionFontSize;
    this.descriptionTextStyle.color = hexToRgba(textColor, textOpacity);
    this.overlayStyle.textAlign = textAlignment;
    this.overlayStyle.lineHeight = lineHeight;
    this.overlayStyle.letterSpacing = letterSpacing;
    this.overlayStyle.width = isOverlayFullWidth ? '100%' : 'unset';
    isOverlay && isContent ? (this.overlayStyle.backgroundColor = hexToRgba(overlayColor, overlayOpacity)) : (this.overlayStyle.backgroundColor = '');
    switch (fontStyle) {
      case EFontStyle.REGULAR:
        this.overlayStyle.fontStyle = 'normal';
        this.overlayStyle.fontWeight = 'unset';
        break;
      case EFontStyle.BOLD:
        this.overlayStyle.fontStyle = 'normal';
        this.overlayStyle.fontWeight = 'bold';
        break;
      case EFontStyle.ITALIC:
        this.overlayStyle.fontStyle = 'italic';
        this.overlayStyle.fontWeight = 'unset';
        break;
      default:
        break;
    }
    this.containerStyle.justifyContent = horizontalPosition;
    this.containerStyle.alignItems = verticalPosition;
    this.fontFamilyClass = `ql-font-${fontFamily}`;
    this.textEffectClass = textAnimation;
    this.overlayEffectClass = overlayAnimation;
  }

  onLanguageTextHandler(languageText: IGeneralTextTextCultureUI[]): void {
    const defaultLanguageText = languageText.find((item) => item.cultureUI === this.commonService.defaultCultureUI);
    const desiredLanguageText = languageText.find((item) => item.cultureUI === this.currentCultureUI);
    if (!desiredLanguageText) {
      const addedLanguageText: IGeneralTextTextCultureUI = {
        cultureUI: this.currentCultureUI,
        title: defaultLanguageText.title,
        description: defaultLanguageText.description,
      };
      languageText.push(addedLanguageText);
    }
    this.languageTitle = desiredLanguageText?.title ? desiredLanguageText.title : defaultLanguageText?.title;
    this.languageDescription = desiredLanguageText?.description ? desiredLanguageText?.description : defaultLanguageText?.description;
  }

  ngOnInit(): void {}
}
