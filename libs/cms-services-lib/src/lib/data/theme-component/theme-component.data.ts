import { IRenderingComponentData } from 'libs/cms-models-lib/src/lib/component';
import { ThemeComponentModel } from 'libs/cms-models-lib/src/lib/theme-component';

export const getThemeComponents = async (pageID: number): Promise<IRenderingComponentData[]> => {
  const themeComponents = await ThemeComponentModel.findOne({ pageID, 'themeComponents.isActive': true }, { 'themeComponents.$': true });
  if (themeComponents === null) {
    return [];
  }
  return themeComponents.themeComponents;
};
