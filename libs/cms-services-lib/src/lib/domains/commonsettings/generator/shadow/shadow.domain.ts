import { ILayoutSettingShadow } from '@reactor-room/cms-models-lib';
import hexToRgba from 'hex-to-rgba';
export function performsetLayoutSettingShadowValueToElementStyle(shadow: ILayoutSettingShadow): string {
  const { isShadow, color, opacity, xAxis, yAxis, distance, blur } = shadow;
  let boxShadow = '';
  !isShadow ? (boxShadow = 'none') : (boxShadow = `${xAxis}px ${yAxis}px ${blur}px ${distance}px ${color ? hexToRgba(color, opacity / 100) : 'transparent'}`);
  return `box-shadow:${boxShadow};`;
}
