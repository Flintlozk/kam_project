import { Component, Input, OnChanges, OnInit } from '@angular/core';
import { convertNumberToPx } from '@reactor-room/cms-frontend-helpers-lib';
import { ButtonEffectType, EFontStyle, ETextAlignment, ETextStyle, IButtonBorder, IButtonRenderingSetting, IButtonSetting, IButtonText } from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
import { IButtonStyle } from './cms-single-button-rendering.model';

@Component({
  selector: 'cms-next-cms-single-button-rendering',
  templateUrl: './cms-single-button-rendering.component.html',
  styleUrls: ['./cms-single-button-rendering.component.scss'],
})
export class CmsSingleButtonRenderingComponent implements OnInit, OnChanges {
  @Input() buttonData: IButtonRenderingSetting;
  @Input() changeDetectorTrigger: boolean;
  buttonStyleData: IButtonStyle = {
    container: {
      display: 'flex',
      justifyContent: 'flex-start',
      alignItems: 'center',
    },
    settingBorder: {
      backgroundColor: '#000000',
      paddingLeft: '0px',
      paddingRight: '0px',
      paddingTop: '0px',
      paddingBottom: '0px',
      borderStyle: 'solid',
      borderLeftWidth: '0px',
      borderRightWidth: '0px',
      borderTopWidth: '0px',
      borderBottomWidth: '0px',
      borderColor: '#000000',
      borderTopLeftRadius: '0px',
      borderTopRightRadius: '0px',
      borderBottomLeftRadius: '0px',
      borderBottomRightRadius: '0px',
    },
    text: {
      fontStyle: 'normal',
      fontWeight: 'normal',
      textDecoration: 'none',
      fontSize: '18px',
      color: '#ffffff',
    },
    icon: {
      fontSize: '18px',
      color: '#ffffff',
    },
  };
  fontFamilyClass = '';
  buttonHoverEffectClass = ButtonEffectType.NO_EFFECT;
  constructor() {}

  ngOnInit(): void {}

  ngOnChanges(): void {
    this.setContainerData(this.buttonData.buttonText.textAlignment);
    this.setSettingBorderData(this.buttonData.buttonSetting, this.buttonData.buttonBorder);
    this.setTextData(this.buttonData.buttonText);
    this.setIconData(this.buttonData.buttonText);
  }

  setContainerData(textAlignment: string): void {
    switch (textAlignment) {
      case ETextAlignment.LEFT:
        this.buttonStyleData.container.justifyContent = 'flex-start';
        break;
      case ETextAlignment.RIGHT:
        this.buttonStyleData.container.justifyContent = 'flex-end';
        break;
      case ETextAlignment.CENTER:
        this.buttonStyleData.container.justifyContent = 'center';
        break;
      case ETextAlignment.JUSTIFY:
        this.buttonStyleData.container.justifyContent = 'space-between';
        break;
      default:
        break;
    }
  }

  setSettingBorderData(buttonSetting: IButtonSetting, buttonBorder: IButtonBorder): void {
    this.buttonStyleData.settingBorder.backgroundColor = hexToRgba(buttonSetting.background.backgroundColor, buttonSetting.background.backgroundColorOpacity);
    this.buttonStyleData.settingBorder.paddingLeft = convertNumberToPx(buttonSetting.padding.left);
    this.buttonStyleData.settingBorder.paddingRight = convertNumberToPx(buttonSetting.padding.right);
    this.buttonStyleData.settingBorder.paddingTop = convertNumberToPx(buttonSetting.padding.top);
    this.buttonStyleData.settingBorder.paddingBottom = convertNumberToPx(buttonSetting.padding.bottom);
    this.buttonStyleData.settingBorder.borderColor = hexToRgba(buttonBorder.color, buttonBorder.opacity);
    this.buttonStyleData.settingBorder.borderLeftWidth = buttonBorder.position.left ? convertNumberToPx(buttonBorder.thickness) : '0px';
    this.buttonStyleData.settingBorder.borderRightWidth = buttonBorder.position.right ? convertNumberToPx(buttonBorder.thickness) : '0px';
    this.buttonStyleData.settingBorder.borderTopWidth = buttonBorder.position.top ? convertNumberToPx(buttonBorder.thickness) : '0px';
    this.buttonStyleData.settingBorder.borderBottomWidth = buttonBorder.position.bottom ? convertNumberToPx(buttonBorder.thickness) : '0px';
    this.buttonStyleData.settingBorder.borderTopLeftRadius = convertNumberToPx(buttonBorder.corner.topLeft);
    this.buttonStyleData.settingBorder.borderTopRightRadius = convertNumberToPx(buttonBorder.corner.topRight);
    this.buttonStyleData.settingBorder.borderBottomLeftRadius = convertNumberToPx(buttonBorder.corner.bottomLeft);
    this.buttonStyleData.settingBorder.borderBottomRightRadius = convertNumberToPx(buttonBorder.corner.bottomRight);
  }

  setTextData(buttonText: IButtonText): void {
    this.buttonStyleData.text.color = hexToRgba(buttonText.textColor, buttonText.textOpacity);
    this.buttonStyleData.text.fontSize = buttonText.fontSize;
    this.fontFamilyClass = `ql-font-${buttonText.fontFamily}`;
    switch (buttonText.fontStyle) {
      case EFontStyle.REGULAR:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'unset';
        break;
      case EFontStyle.BOLD:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'bold';
        break;
      case EFontStyle.ITALIC:
        this.buttonStyleData.text.fontStyle = 'italic';
        this.buttonStyleData.text.fontWeight = 'unset';
        break;
      default:
        break;
    }
  }

  setIconData(buttonText: IButtonText): void {
    this.buttonStyleData.icon.color = hexToRgba(buttonText.iconColor, buttonText.iconColorOpacity);
    this.buttonStyleData.icon.fontSize = convertNumberToPx(buttonText.iconSize);
  }

  mouseEnterHandler(): void {
    if (this.buttonData.buttonHover.isHover) {
      this.applyHoverEffect();
    } else {
      this.removeHoverEffect();
    }
  }

  mouseLeaveHandler(): void {
    this.removeHoverEffect();
  }

  removeHoverEffect(): void {
    this.buttonStyleData.settingBorder.backgroundColor = hexToRgba(
      this.buttonData.buttonSetting.background.backgroundColor,
      this.buttonData.buttonSetting.background.backgroundColorOpacity,
    );
    this.buttonStyleData.settingBorder.borderColor = hexToRgba(this.buttonData.buttonBorder.color, this.buttonData.buttonBorder.opacity);
    this.buttonStyleData.text.color = hexToRgba(this.buttonData.buttonText.textColor, this.buttonData.buttonText.textOpacity);
    switch (this.buttonData.buttonText.fontStyle) {
      case EFontStyle.REGULAR:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'unset';
        this.buttonStyleData.text.textDecoration = 'none';
        break;
      case EFontStyle.BOLD:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'bold';
        this.buttonStyleData.text.textDecoration = 'none';
        break;
      case EFontStyle.ITALIC:
        this.buttonStyleData.text.fontStyle = 'italic';
        this.buttonStyleData.text.fontWeight = 'unset';
        this.buttonStyleData.text.textDecoration = 'none';
        break;
      default:
        this.buttonStyleData.text.textDecoration = 'none';
        break;
    }
    this.buttonHoverEffectClass = ButtonEffectType.NO_EFFECT;
  }
  applyHoverEffect(): void {
    this.buttonStyleData.settingBorder.backgroundColor = this.buttonData.buttonHover.buttonHoverColor
      ? hexToRgba(this.buttonData.buttonHover.buttonHoverColor, this.buttonData.buttonHover.borderHoverColorOpacity)
      : hexToRgba(this.buttonData.buttonSetting.background.backgroundColor, this.buttonData.buttonSetting.background.backgroundColorOpacity);
    this.buttonStyleData.settingBorder.borderColor = this.buttonData.buttonHover.borderHoverColor
      ? hexToRgba(this.buttonData.buttonHover.borderHoverColor, this.buttonData.buttonHover.borderHoverColorOpacity)
      : hexToRgba(this.buttonData.buttonBorder.color, this.buttonData.buttonBorder.opacity);
    this.buttonStyleData.text.color = this.buttonData.buttonHover.textHoverColor
      ? hexToRgba(this.buttonData.buttonHover.textHoverColor, this.buttonData.buttonHover.textHoverColorOpacity)
      : hexToRgba(this.buttonData.buttonText.textColor, this.buttonData.buttonText.textOpacity);
    switch (this.buttonData.buttonHover.textHoverTransform) {
      case ETextStyle.REGULAR:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'unset';
        this.buttonStyleData.text.textDecoration = 'none';
        break;
      case ETextStyle.BOLD:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'bold';
        this.buttonStyleData.text.textDecoration = 'none';
        break;
      case ETextStyle.ITALIC:
        this.buttonStyleData.text.fontStyle = 'italic';
        this.buttonStyleData.text.fontWeight = 'unset';
        this.buttonStyleData.text.textDecoration = 'none';
        break;
      case ETextStyle.UNDERLINE:
        this.buttonStyleData.text.fontStyle = 'normal';
        this.buttonStyleData.text.fontWeight = 'unset';
        this.buttonStyleData.text.textDecoration = 'underline';
        break;
      default:
        break;
    }
    this.buttonHoverEffectClass = this.buttonData.buttonHover.hoverEffect;
  }
}
