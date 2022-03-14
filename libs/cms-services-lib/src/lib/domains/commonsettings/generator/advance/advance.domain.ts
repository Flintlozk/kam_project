import { ILayoutSettingAdvance } from '@reactor-room/cms-models-lib';
import { convertNumberToPx } from '../../../convert';

export function performSetLayoutSettingAdvanceValueToElementStyle(advanceValue: ILayoutSettingAdvance): string {
  const { margin, padding, verticalPosition, horizontalPosition } = advanceValue;
  const marginLeft = convertNumberToPx(margin.left);
  const marginTop = convertNumberToPx(margin.top);
  const marginRight = convertNumberToPx(margin.right);
  const marginBottom = convertNumberToPx(margin.bottom);
  const paddingLeft = convertNumberToPx(padding.left);
  const paddingTop = convertNumberToPx(padding.top);
  const paddingRight = convertNumberToPx(padding.right);
  const paddingBottom = convertNumberToPx(padding.bottom);
  const alignItems = verticalPosition;
  const justifyContent = horizontalPosition;
  return `margin-left:${marginLeft};margin-top:${marginTop};margin-right:${marginRight};margin-bottom:${marginBottom}\
          ;padding-left:${paddingLeft};padding-top:${paddingTop};padding-right:${paddingRight};padding-bottom:${paddingBottom};`;
}
