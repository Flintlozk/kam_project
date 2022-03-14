import { ILayoutRenderingSetting } from '@reactor-room/cms-models-lib';
import { convertNumberToPx } from '../../convert';

export function performSetLayoutOptionsToElementStyle(layoutOption: ILayoutRenderingSetting): string {
  const { gap } = layoutOption.setting;
  const columnGap = convertNumberToPx(gap);
  return 'column-gap:' + columnGap;
}
