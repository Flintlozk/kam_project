import { ICommonSettings } from '@reactor-room/cms-models-lib';
import { performSetLayoutSettingAdvanceValueToElementStyle } from './advance';
import { performSetLayoutSettingBackgroundValueToElementStyle } from './background';
import { performSetLayoutSettingBorderValueToElementStyle } from './border';
import { performsetLayoutSettingShadowValueToElementStyle } from './shadow';

export function generateCommonSettingsStyle(commonSettings: ICommonSettings): string {
  const style = performSetLayoutSettingBorderValueToElementStyle(commonSettings.border);
  const style2 = performsetLayoutSettingShadowValueToElementStyle(commonSettings.shadow);
  const style3 = performSetLayoutSettingAdvanceValueToElementStyle(commonSettings.advance);
  const style4 = performSetLayoutSettingBackgroundValueToElementStyle(commonSettings.background);
  const sumStyle = style + style2 + style3 + style4;
  return sumStyle;
}
