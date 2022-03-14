import { ILayoutSettingBorder, ILayoutSettingBorderCorner, ILayoutSettingBorderPosition } from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
import { convertNumberToPx } from '../../../convert';
export function performSetLayoutSettingBorderValueToElementStyle(layoutBorder: ILayoutSettingBorder): string {
  const { color, opacity, corner, thickness, position } = layoutBorder;
  const BorderColor = color ? hexToRgba(color, opacity / 100) : 'transparent';
  const styleBorderColor = `border-color:${BorderColor};border-style:solid;`;
  const styleBorderCorner = setLayoutSettingBorderCorner(corner);
  const styleDesignBorderThickness = setLayoutSettingBorderThickness(thickness, position);
  return styleBorderColor + styleBorderCorner + styleDesignBorderThickness;
}

function setLayoutSettingBorderThickness(thickness: number, { bottom, top, left, right }: ILayoutSettingBorderPosition): string {
  const BorderBottomWidth = bottom ? convertNumberToPx(thickness) : '0px';
  const BorderTopWidth = top ? convertNumberToPx(thickness) : '0px';
  const BorderLeftWidth = left ? convertNumberToPx(thickness) : '0px';
  const BorderRightWidth = right ? convertNumberToPx(thickness) : '0px';
  const style = `border-bottom-width:${BorderBottomWidth};border-top-width:${BorderTopWidth};border-left-width:${BorderLeftWidth};border-right-width:${BorderRightWidth};`;
  return style;
}
function setLayoutSettingBorderCorner({ topLeft, topRight, bottomLeft, bottomRight }: ILayoutSettingBorderCorner): string {
  const borderTopLeftRadius = convertNumberToPx(topLeft);
  const borderTopRightRadius = convertNumberToPx(topRight);
  const borderBottomLeftRadius = convertNumberToPx(bottomLeft);
  const borderBottomRightRadius = convertNumberToPx(bottomRight);
  const style = `\
  border-top-left-radius:${borderTopLeftRadius};border-top-right-radius:${borderTopRightRadius}\
  ;border-bottom-left-radius:${borderBottomLeftRadius};border-bottom-right-radius:${borderBottomRightRadius};\
  `;
  return style;
}
