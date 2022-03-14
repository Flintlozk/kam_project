import { IRenderingComponentData, IThemeDevice, IThemeRenderingSettingColors, IThemeRenderingSettingFont } from '@reactor-room/cms-models-lib';

export interface IThemeSharingComponent extends IThemeSharingComponentConfig {
  _id: string;
  pageID: number;
  themeComponents: IRenderingComponentData[];
}

export interface IThemeSharingComponentConfig {
  devices?: IThemeDevice[];
  font?: IThemeRenderingSettingFont[];
  color?: IThemeRenderingSettingColors[];
}
