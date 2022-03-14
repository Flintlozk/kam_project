import { ELayoutColumns, ILayoutRenderingSetting, IRenderingComponentData } from '@reactor-room/cms-models-lib';
import { generateCommonSettingsStyle } from '../../commonsettings';
import { performSetLayoutOptionsToElementStyle } from '../../options';

export function generateStaticHTMLLayoutComponent(component: IRenderingComponentData) {
  const commonSettingsStyle = generateCommonSettingsStyle(component.commonSettings);
  const layoutOption = component.options as ILayoutRenderingSetting;
  const optionStyle = performSetLayoutOptionsToElementStyle(layoutOption);
  const layoutCommonSetting = generateCommonSettingsStyle(layoutOption.containerSettings[0]);
  const layoutProperty = getColumnClassName(layoutOption.setting.column);
  const sumStyle = commonSettingsStyle + optionStyle;
  return `<div id="${component._id}" class="${layoutProperty.className}" style="${sumStyle}"><div style="${layoutCommonSetting}">`;
}

export function getColumnClassName(layoutOptionSettingColumn: string): { className: string; layoutPositionNumber: number } {
  let className = '';
  let layoutPositionNumber = null;
  switch (layoutOptionSettingColumn) {
    case ELayoutColumns.ONE_COLUMN: {
      className = 'one-column';
      layoutPositionNumber = 0;
      break;
    }
    case ELayoutColumns.FIVE_FIVE_COLUMN ||
      ELayoutColumns.SIX_FOUR_COLUMN ||
      ELayoutColumns.FOUR_SIX_COLUMN ||
      ELayoutColumns.SEVEN_THREE_COLUMN ||
      ELayoutColumns.THREE_SEVEN_COLUMN: {
      className = 'two-column';
      layoutPositionNumber = 1;
      break;
    }
    case ELayoutColumns.THREE_COLUMN: {
      className = 'three-column';
      layoutPositionNumber = 2;
      break;
    }
    case ELayoutColumns.FOUR_COLUMN: {
      className = 'four-column';
      layoutPositionNumber = 3;
      break;
    }

    default:
      console.error('not implemented ColumnType:', layoutOptionSettingColumn);
  }
  return { className, layoutPositionNumber };
}
