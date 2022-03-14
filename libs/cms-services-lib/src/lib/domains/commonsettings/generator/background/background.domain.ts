import { EBackground, ILayoutSettingBackground, ILayoutSettingBackgroundColor } from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
export function performSetLayoutSettingBackgroundValueToElementStyle(value: ILayoutSettingBackground): string {
  let style = '';
  switch (value.currentStyle) {
    case EBackground.COLOR:
      style = setBackgroundColorValue(value.layoutSettingBackgroundColorForm);
      break;
    case EBackground.IMAGE:
      this.resetBackgroundSetting(EBackground.IMAGE);
      this.setBackgroundImageValue(value.layoutSettingBackgroundImageForm);
      break;
    case EBackground.VIDEO:
      this.resetBackgroundSetting(EBackground.VIDEO);
      this.setBackgroundVideoValue(value.layoutSettingBackgroundVideoForm);
      break;
  }
  return style;
}
function setBackgroundColorValue(value: ILayoutSettingBackgroundColor): string {
  const backgroundColor = value.color ? hexToRgba(value.color, value.opacity / 100) : '';
  return `top:0px;left:0px;background-color:${backgroundColor};`;
}
